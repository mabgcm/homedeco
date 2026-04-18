import { cjProducts } from "../data/products";
import { buildPricingSnapshot } from "./pricing";
import { toStoreImageUrl } from "./store-images";

const CJ_API_BASE = "https://developers.cjdropshipping.com/api2.0/v1";
const DASHBOARD_CACHE_TTL_MS = 60 * 1000;
const CURATED_CATALOG_TTL_MS = 15 * 60 * 1000;

let tokenCache = {
  accessToken: null,
  expiresAt: 0
};
let tokenPromise = null;
let dashboardCache = {
  data: null,
  expiresAt: 0
};
let curatedCatalogCache = {
  data: null,
  expiresAt: 0
};

function toExpiryTimestamp(value) {
  const timestamp = Date.parse(value || "");
  if (Number.isNaN(timestamp)) {
    return Date.now() + 10 * 60 * 1000;
  }

  return timestamp;
}

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok || data?.result === false) {
    const message = data?.message || "CJ request failed.";
    throw new Error(message);
  }

  return data;
}

async function safeCall(task, fallbackValue, warnings, label) {
  try {
    return await task();
  } catch (error) {
    warnings.push(`${label}: ${error.message || "request failed"}`);
    return fallbackValue;
  }
}

export async function getCjAccessToken() {
  if (process.env.CJ_ACCESS_TOKEN) {
    return process.env.CJ_ACCESS_TOKEN;
  }

  if (
    tokenCache.accessToken &&
    tokenCache.expiresAt - Date.now() > 60 * 1000
  ) {
    return tokenCache.accessToken;
  }

  if (!process.env.CJ_API_KEY) {
    throw new Error("Missing CJ_API_KEY.");
  }

  if (!tokenPromise) {
    tokenPromise = (async () => {
      const response = await fetch(
        `${CJ_API_BASE}/authentication/getAccessToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            apiKey: process.env.CJ_API_KEY
          }),
          cache: "no-store"
        }
      );

      const payload = await parseResponse(response);
      const accessToken = payload?.data?.accessToken;

      if (!accessToken) {
        throw new Error("CJ access token was not returned.");
      }

      tokenCache = {
        accessToken,
        expiresAt: toExpiryTimestamp(payload?.data?.accessTokenExpiryDate)
      };

      return accessToken;
    })().finally(() => {
      tokenPromise = null;
    });
  }

  return tokenPromise;
}

export async function cjFetch(path, { method = "GET", query, body } = {}) {
  const accessToken = await getCjAccessToken();
  const url = new URL(`${CJ_API_BASE}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": accessToken
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  return parseResponse(response);
}

export async function getCjSettings() {
  const payload = await cjFetch("/setting/get");
  return payload.data;
}

export async function getCjBalance() {
  const payload = await cjFetch("/shopping/pay/getBalance");
  return payload.data;
}

export async function getCjMyProducts() {
  const payload = await cjFetch("/product/myProduct/query");
  return payload?.data?.content || [];
}

export async function listCjOrders({ pageNum = 1, pageSize = 20, status } = {}) {
  const payload = await cjFetch("/shopping/order/list", {
    query: {
      pageNum,
      pageSize,
      status
    }
  });

  return payload?.data || { total: 0, list: [] };
}

export async function getCjProductByPid(pid) {
  const payload = await cjFetch("/product/query", {
    query: {
      pid,
      features: "enable_inventory"
    }
  });

  return payload.data;
}

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeDate(value) {
  const timestamp = Date.parse(value || "");
  return Number.isNaN(timestamp) ? null : timestamp;
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html) {
  return decodeHtmlEntities(
    String(html || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeDescription(text, maxLength = 180) {
  const clean = stripHtml(text);

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength).trim()}...`;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRateLimitedError(error) {
  return /Too Many Requests|QPS limit/i.test(String(error?.message || ""));
}

function extractCjPidFromUrl(url) {
  const match = String(url || "").match(/-p-([A-Za-z0-9-]+)\.html?$/i);
  return match ? match[1] : null;
}

function getCollectionLabel(category) {
  if (category === "lighting") {
    return "Warm Light Edit";
  }

  if (category === "textiles") {
    return "Layered Textiles";
  }

  if (category === "wall") {
    return "Gallery Wall";
  }

  return "Shelf Styling";
}

function getTagline(category) {
  if (category === "lighting") {
    return "A statement layer for softer evening rooms";
  }

  if (category === "textiles") {
    return "Texture that lifts a sofa without noise";
  }

  if (category === "wall") {
    return "A finishing layer for calm walls";
  }

  return "A sculptural accent for shelves and tables";
}

function getFulfillmentNote(category) {
  if (category === "lighting") {
    return "Best styled beside seating, consoles, or quiet reading corners.";
  }

  if (category === "textiles") {
    return "Works well layered with other neutral textures and soft upholstery.";
  }

  if (category === "wall") {
    return "Designed to sit cleanly within modern living rooms, offices, and entryways.";
  }

  return "A versatile accent for consoles, shelves, sideboards, and coffee tables.";
}

function getLeadTimeLabel(deliveryCycle, category) {
  if (deliveryCycle) {
    return `${deliveryCycle} day delivery window`;
  }

  if (category === "lighting") {
    return "Allow extra time for larger lighting pieces";
  }

  if (category === "wall") {
    return "Delivery timing varies by size and frame format";
  }

  return "Standard decor delivery window";
}

export function mapCjProductToStorefront(product, sourceLabel = "catalog") {
  const pid = product.productId || product.pid || product.id;
  const unitPrice = safeNumber(
    product.sellPrice || product.nowPrice || product.price
  );
  const productName =
    product.nameEn || product.productNameEn || "Curated Home Accent";
  const normalizedCategory = normalizeCategory(
    product.categoryName || product.threeCategoryName || productName
  );
  const rawDescription =
    product.description ||
    product.remark ||
    product.entryNameEn ||
    "A curated home decor piece selected for calm, layered interiors.";
  const image =
    toStoreImageUrl(
      product.bigImage || product.productImage || product.mainImage
    ) ||
    createPlaceholderImage(
      (product.nameEn || product.productNameEn || "Home Accent")
        .split(" ")
        .slice(0, 2)
        .join(" "),
      ...pickTones(pid)
    );

  const retailPriceInCents = Math.round(unitPrice * 230);

  return {
    id: pid,
    source: sourceLabel,
    sku: product.productSku || product.sku || product.spu || pid,
    cjUrl: product.cjUrl || null,
    sourceCostInCents: Math.round(unitPrice * 100),
    priceInCents: retailPriceInCents,
    category: normalizedCategory,
    collection: getCollectionLabel(normalizedCategory),
    name: productName,
    description: summarizeDescription(rawDescription),
    fullDescription: stripHtml(rawDescription),
    compareAt: "Current store pricing",
    tagline: getTagline(normalizedCategory),
    fulfillmentNote: getFulfillmentNote(normalizedCategory),
    leadTime: getLeadTimeLabel(product.deliveryCycle, normalizedCategory),
    pricingSnapshot: buildPricingSnapshot(
      {
        retailPriceInCents,
        sourceCostInCents: Math.round(unitPrice * 100)
      },
      new Date().toISOString()
    ),
    visualLabel: productName
      .split(" ")
      .slice(0, 2)
      .join(" "),
    tones: pickTones(pid),
    image,
    hasRealImage: Boolean(image && !String(image).startsWith("data:image"))
  };
}

function mergeStoreProduct(seedProduct, liveProduct, sourceSyncedAt) {
  const liveMapped = liveProduct ? mapCjProductToStorefront(liveProduct, "live") : null;
  const sourceCostInCents =
    liveMapped?.sourceCostInCents || seedProduct.sourceCostInCents || 0;
  const image = liveMapped?.image || seedProduct.image;

  return {
    ...liveMapped,
    ...seedProduct,
    id: seedProduct.id,
    sku: seedProduct.sku,
    cjUrl: seedProduct.cjUrl,
    source: "store-catalog",
    priceInCents: seedProduct.priceInCents,
    sourceCostInCents,
    category: seedProduct.category || liveMapped?.category || "living",
    collection: seedProduct.collection || liveMapped?.collection || "Shelf Styling",
    name: seedProduct.name || liveMapped?.name || "Curated Home Accent",
    description: seedProduct.description || liveMapped?.description,
    fullDescription:
      seedProduct.fullDescription ||
      liveMapped?.fullDescription ||
      seedProduct.description,
    compareAt: "Store price locked",
    tagline: seedProduct.tagline || liveMapped?.tagline,
    fulfillmentNote: seedProduct.fulfillmentNote || liveMapped?.fulfillmentNote,
    leadTime: seedProduct.leadTime || liveMapped?.leadTime,
    visualLabel: seedProduct.visualLabel || liveMapped?.visualLabel,
    tones: seedProduct.tones || liveMapped?.tones,
    image,
    hasRealImage: Boolean(image && !String(image).startsWith("data:image")),
    pricingSnapshot: buildPricingSnapshot(
      {
        retailPriceInCents: seedProduct.priceInCents,
        sourceCostInCents,
        shippingBufferInCents: seedProduct.shippingBufferInCents,
        packagingFeeInCents: seedProduct.packagingFeeInCents,
        handlingFeeInCents: seedProduct.handlingFeeInCents,
        marketingReserveRate: seedProduct.marketingReserveRate,
        customsRate: seedProduct.customsRate
      },
      sourceSyncedAt
    )
  };
}

async function fetchLiveProductForSeed(seedProduct, warnings) {
  if (!process.env.CJ_API_KEY && !process.env.CJ_ACCESS_TOKEN) {
    return { liveProduct: null, sourceSyncedAt: null };
  }

  const pid = extractCjPidFromUrl(seedProduct.cjUrl);
  if (!pid) {
    warnings.push(`Missing product id for ${seedProduct.name}`);
    return { liveProduct: null, sourceSyncedAt: null };
  }

  let liveProduct = null;
  let lastError = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      liveProduct = await getCjProductByPid(pid);
      lastError = null;
      break;
    } catch (error) {
      lastError = error;

      if (!isRateLimitedError(error) || attempt === 2) {
        break;
      }

      await sleep(1250);
    }
  }

  if (!liveProduct && lastError) {
    warnings.push(`Product ${seedProduct.name}: ${lastError.message || "request failed"}`);
  }

  return {
    liveProduct,
    sourceSyncedAt: liveProduct ? new Date().toISOString() : null
  };
}

export async function getCuratedStorefrontCatalog() {
  if (curatedCatalogCache.data && curatedCatalogCache.expiresAt > Date.now()) {
    return curatedCatalogCache.data;
  }

  const warnings = [];
  const products = [];

  for (const seedProduct of cjProducts) {
    const { liveProduct, sourceSyncedAt } = await fetchLiveProductForSeed(
      seedProduct,
      warnings
    );

    products.push(mergeStoreProduct(seedProduct, liveProduct, sourceSyncedAt));

    if (process.env.CJ_API_KEY || process.env.CJ_ACCESS_TOKEN) {
      await sleep(1200);
    }
  }

  const data = {
    products,
    warnings,
    generatedAt: new Date().toISOString()
  };

  curatedCatalogCache = {
    data,
    expiresAt: Date.now() + CURATED_CATALOG_TTL_MS
  };

  return data;
}

export async function getStorefrontProductBySlug(slug) {
  const catalog = await getCuratedStorefrontCatalog();
  return catalog.products.find((product) => product.id === slug) || null;
}

export async function getDecorFallbackProducts() {
  const catalog = await getCuratedStorefrontCatalog();
  return catalog.products;
}

function mapCjOrder(order) {
  return {
    id: order.orderId || order.cjOrderId || order.orderNum,
    orderNum: order.orderNum || order.cjOrderCode || order.orderId,
    status: order.orderStatus || "OTHER",
    amount: safeNumber(order.orderAmount || order.productAmount),
    productAmount: safeNumber(order.productAmount),
    postageAmount: safeNumber(order.postageAmount),
    customer: order.shippingCustomerName || "Unknown customer",
    country: order.shippingCountryCode || "--",
    logisticName: order.logisticName || "Pending",
    trackingNumber: order.trackNumber || null,
    trackingUrl: order.trackingUrl || null,
    createdAt: order.createDate || order.storeCreateDate || null,
    paidAt: order.paymentDate || null,
    shippedAt: order.outWarehouseTime || null
  };
}

function uniqueOrders(orders) {
  const seen = new Set();

  return orders.filter((order) => {
    if (seen.has(order.id)) {
      return false;
    }

    seen.add(order.id);
    return true;
  });
}

export async function getCjDashboardData() {
  if (dashboardCache.data && dashboardCache.expiresAt > Date.now()) {
    return dashboardCache.data;
  }

  const warnings = [];
  const settings = await safeCall(
    () => getCjSettings(),
    null,
    warnings,
    "Account settings"
  );
  const balance = await safeCall(
    () => getCjBalance(),
    null,
    warnings,
    "Balance"
  );
  const myProducts = await safeCall(
    () => getCjMyProducts(),
    [],
    warnings,
    "My products"
  );
  const curatedCatalog = await safeCall(
    () => getCuratedStorefrontCatalog(),
    { products: [], warnings: [] },
    warnings,
    "Store catalog"
  );
  const visibleProducts = curatedCatalog.products || [];
  warnings.push(...(curatedCatalog.warnings || []));

  const statusBuckets = ["UNPAID", "UNSHIPPED", "SHIPPED", "DELIVERED"];
  const orderResponses = [];

  for (const status of statusBuckets) {
    const response = await safeCall(
      () =>
        listCjOrders({
          pageNum: 1,
          pageSize: 10,
          status
        }),
      { total: 0, list: [] },
      warnings,
      `Orders ${status}`
    );

    orderResponses.push({
      status,
      total: response.total || 0,
      list: (response.list || []).map(mapCjOrder)
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 1100);
    });
  }

  const recentOrders = uniqueOrders(
    orderResponses.flatMap((bucket) => bucket.list)
  ).sort((left, right) => {
    return (safeDate(right.createdAt) || 0) - (safeDate(left.createdAt) || 0);
  });

  const salesUsd = recentOrders.reduce((sum, order) => sum + order.amount, 0);
  const shippedCount =
    orderResponses.find((bucket) => bucket.status === "SHIPPED")?.total || 0;
  const deliveredCount =
    orderResponses.find((bucket) => bucket.status === "DELIVERED")?.total || 0;
  const unpaidCount =
    orderResponses.find((bucket) => bucket.status === "UNPAID")?.total || 0;
  const processingCount =
    orderResponses.find((bucket) => bucket.status === "UNSHIPPED")?.total || 0;

  const result = {
    account: {
      openId: settings?.openId || null,
      openName: settings?.openName || null,
      openEmail: settings?.openEmail || null,
      root: settings?.root || null,
      isSandbox: settings?.isSandbox || 0
    },
    balance: {
      amount: safeNumber(balance?.amount),
      noWithdrawalAmount: safeNumber(balance?.noWithdrawalAmount),
      freezeAmount: safeNumber(balance?.freezeAmount)
    },
    products: visibleProducts,
    usingFallbackCatalog: false,
    myProductsCount: myProducts.length,
    metrics: {
      totalProducts: visibleProducts.length,
      unpaidCount,
      processingCount,
      shippedCount,
      deliveredCount,
      salesUsd,
      recentOrderCount: recentOrders.length
    },
    recentOrders: recentOrders.slice(0, 12),
    warnings: [...new Set(warnings)],
    partial: [...new Set(warnings)].length > 0,
    generatedAt: new Date().toISOString()
  };

  dashboardCache = {
    data: result,
    expiresAt: Date.now() + DASHBOARD_CACHE_TTL_MS
  };

  return result;
}

function createPlaceholderImage(label, toneA, toneB) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${toneA}" />
          <stop offset="100%" stop-color="${toneB}" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" rx="48" fill="url(#bg)" />
      <rect x="110" y="110" width="580" height="580" rx="28" fill="rgba(255,255,255,0.45)" />
      <text x="400" y="390" text-anchor="middle" fill="#2b241d" font-size="56" font-family="Georgia, serif">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function normalizeCategory(categoryName = "") {
  const value = String(categoryName || "").toLowerCase();

  if (value.includes("lamp") || value.includes("light")) {
    return "lighting";
  }

  if (
    value.includes("pillow") ||
    value.includes("cushion") ||
    value.includes("textile") ||
    value.includes("blanket")
  ) {
    return "textiles";
  }

  if (
    value.includes("wall") ||
    value.includes("painting") ||
    value.includes("mirror") ||
    value.includes("canvas")
  ) {
    return "wall";
  }

  return "living";
}

function pickTones(seed = "") {
  const palettes = [
    ["#d6b48a", "#f3e7d8"],
    ["#84776e", "#d8d0c9"],
    ["#c4ae96", "#eee2d4"],
    ["#bea89e", "#efe4dc"],
    ["#af9c8e", "#ebe0d7"]
  ];
  const index =
    [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    palettes.length;

  return palettes[index];
}
