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

function getProduct(slug) {
  return cjProducts.find((product) => product.id === slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let product = getProduct(slug);

  if (product) {
    try {
      product = (await getStorefrontProductBySlug(slug)) || product;
    } catch {
      product = getProduct(slug);
    }
  }

  if (!product && (process.env.CJ_API_KEY || process.env.CJ_ACCESS_TOKEN)) {
    try {
      const cjProduct = await getCjProductByPid(slug);
      if (cjProduct) {
        product = mapCjProductToStorefront(cjProduct);
      }
    } catch {
      product = null;
    }
  }

  if (!product) {
    return {
      title: "Product Not Found | Linen & Form"
    };
  }

  return {
    title: `${product.name} | Linen & Form`,
    description: product.description
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  let product = getProduct(slug);

  if (product) {
    try {
      product = (await getStorefrontProductBySlug(slug)) || product;
    } catch {
      product = getProduct(slug);
    }
  }

  if (!product && (process.env.CJ_API_KEY || process.env.CJ_ACCESS_TOKEN)) {
    try {
      const cjProduct = await getCjProductByPid(slug);
      if (cjProduct) {
        product = mapCjProductToStorefront(cjProduct);
      }
    } catch {
      product = null;
    }
  }

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
              <span>Ships to CA/US</span>
              <span>Secure checkout</span>
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
