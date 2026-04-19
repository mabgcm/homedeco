import Link from "next/link";
import { notFound } from "next/navigation";
import { cjProducts } from "../../../data/products";
import { ProductPurchasePanel } from "../../../components/product-purchase-panel";
import {
  getCjProductByPid,
  getStorefrontProductBySlug,
  mapCjProductToStorefront
} from "../../../lib/cj";

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD"
});

const hasCjCredentials = Boolean(
  process.env.CJ_API_KEY || process.env.CJ_ACCESS_TOKEN
);

function getStaticProduct(slug) {
  return cjProducts.find((product) => product.id === slug) || null;
}

async function resolveProduct(slug) {
  const staticProduct = getStaticProduct(slug);

  if (!hasCjCredentials) {
    return staticProduct;
  }

  if (staticProduct) {
    try {
      return (await getStorefrontProductBySlug(slug)) || staticProduct;
    } catch {
      return staticProduct;
    }
  }

  try {
    const cjProduct = await getCjProductByPid(slug);
    return cjProduct ? mapCjProductToStorefront(cjProduct) : null;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return cjProducts.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return { title: "Product Not Found | Linen & Form" };
  }

  return {
    title: `${product.name} | Linen & Form`,
    description: product.description
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="pdp-page">
      <div className="pdp-shell">
        <div className="pdp-breadcrumbs">
          <Link href="/" className="back-link">
            Home
          </Link>
          <span>/</span>
          <span>{product.collection}</span>
        </div>

        <section className="pdp-grid">
          <div className="pdp-gallery">
            <div className="pdp-image-frame">
              <img src={product.image} alt={product.name} className="pdp-image" />
            </div>
            <div className="pdp-support-grid">
              <article>
                <strong>Why it works</strong>
                <p>{product.tagline}</p>
              </article>
              <article>
                <strong>Delivery note</strong>
                <p>{product.leadTime}</p>
              </article>
            </div>
          </div>

          <div className="pdp-copy">
            <p className="eyebrow">{product.collection}</p>
            <h1>{product.name}</h1>
            <p className="pdp-description">
              {product.fullDescription || product.description}
            </p>

            <div className="pdp-meta">
              <span>Soft-modern decor</span>
              <span>Free shipping to CA &amp; US — included in price</span>
              <span>Secure guest checkout</span>
            </div>

            <ProductPurchasePanel product={product} />

            <div className="pdp-detail-blocks">
              <article>
                <strong>Styling note</strong>
                <p>{product.description}</p>
              </article>
              <article>
                <strong>Fulfillment</strong>
                <p>{product.fulfillmentNote}</p>
              </article>
            </div>

            <div className="pdp-actions">
              <Link href="/" className="secondary-link">
                Continue shopping
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
