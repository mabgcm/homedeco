import {
  getCuratedStorefrontCatalog,
  getCjSettings,
} from "../../../../lib/cj";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.CJ_API_KEY && !process.env.CJ_ACCESS_TOKEN) {
    return Response.json({
      connected: false,
      account: null,
      products: [],
      message: "CJ credentials are not configured."
    });
  }

  let settings = null;
  let catalog = { products: [], warnings: [] };

  try {
    settings = await getCjSettings();
  } catch {
    // settings failure is non-fatal
  }

  try {
    catalog = await getCuratedStorefrontCatalog();
  } catch (error) {
    return Response.json({
      connected: true,
      account: null,
      products: [],
      warnings: [error.message || "Catalog sync failed."],
      message: "Catalog sync failed — using static product data."
    });
  }

  return Response.json({
    connected: true,
    account: settings
      ? {
          openId: settings.openId || null,
          openName: settings.openName || null,
          openEmail: settings.openEmail || null,
          root: settings.root || null,
          isSandbox: settings.isSandbox || 0
        }
      : null,
    products: catalog.products,
    warnings: catalog.warnings || [],
    message: catalog.products.length ? null : "Connected but no products returned."
  });
}
