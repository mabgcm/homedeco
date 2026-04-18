"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-provider";

const filters = [
  { id: "all", label: "All products" },
  { id: "living", label: "Living room" },
  { id: "lighting", label: "Lighting" },
  { id: "textiles", label: "Textiles" },
  { id: "wall", label: "Wall decor" }
];


const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD"
});

function getCollectionTitle(activeFilter) {
  return filters.find((filter) => filter.id === activeFilter)?.label || "All products";
}

export function Storefront({ cjProducts, amazonEdit }) {
  const router = useRouter();
  const { cartItems, cartCount, subtotal, addItem, updateQuantity, hydrated } =
    useCart();
  const [catalog, setCatalog] = useState(cjProducts);
  const [activeFilter, setActiveFilter] = useState("all");
  const [offerBarDismissed, setOfferBarDismissed] = useState(false);
  const [checkoutState, setCheckoutState] = useState({
    loading: false,
    message: ""
  });

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return catalog;
    }

    return catalog.filter((product) => product.category === activeFilter);
  }, [activeFilter, catalog]);

  const mergedProducts = useMemo(() => {
    const result = [];
    let amazonIdx = 0;
    filteredProducts.forEach((product, i) => {
      result.push(product);
      if ((i + 1) % 2 === 0 && amazonIdx < amazonEdit.length) {
        result.push({ ...amazonEdit[amazonIdx], isAffiliate: true });
        amazonIdx++;
      }
    });
    return result;
  }, [filteredProducts, amazonEdit]);

  const highlightedProducts = useMemo(() => catalog.slice(0, 3), [catalog]);
  const featuredOffer = useMemo(
    () => filteredProducts[0] || catalog[0] || null,
    [filteredProducts, catalog]
  );

  useEffect(() => {
    let cancelled = false;

    async function syncCjCatalog() {
      try {
        const response = await fetch("/api/cj/storefront", {
          cache: "no-store"
        });
        const data = await response.json();

        if (!cancelled && Array.isArray(data.products) && data.products.length) {
          setCatalog(data.products);
        }
      } catch {
        if (!cancelled) {
          setCatalog(cjProducts);
        }
      }
    }

    syncCjCatalog();

    return () => {
      cancelled = true;
    };
  }, [cjProducts]);

  async function beginCheckout() {
    if (!cartItems.length) {
      setCheckoutState({
        loading: false,
        message: "Add at least one priced item to begin checkout."
      });
      return;
    }

    setCheckoutState({ loading: true, message: "" });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            name: item.name,
            description: item.description,
            amount: item.priceInCents,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout could not be started.");
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutState({
        loading: false,
        message: error.message || "Stripe checkout failed to initialize."
      });
    }
  }

  return (
    <main className="store-shell">
      <div className="store-topbar">
        <div className="store-topbar-track">
          <span>
            Spring decor edit live now
            <strong>•</strong>
            Secure guest checkout with Stripe
            <strong>•</strong>
            Ships across Canada and the U.S.
            <strong>•</strong>
            Spring decor edit live now
            <strong>•</strong>
            Secure guest checkout with Stripe
            <strong>•</strong>
            Ships across Canada and the U.S.
          </span>
        </div>
      </div>

      <header className="store-header">
        <Link href="/" className="store-wordmark">
          Linen &amp; Form
        </Link>
        <nav className="store-nav">
          <a href="#shop">Shop</a>
          <a href="#amazon-edit">Amazon add-ons</a>
        </nav>
        <div className="store-header-actions">
          <a href="#cart" className="cart-chip">
            Cart
            <strong>{hydrated ? cartCount : 0}</strong>
          </a>
        </div>
      </header>

      <section className="store-hero">
        <div className="store-hero-copy">
          <p className="eyebrow">Modern home decor store</p>
          <h1>Soft-modern decor that makes a room feel finished.</h1>
          <p className="store-hero-text">
            Rounded lamps, quiet textiles, sculptural vases, and clean wall
            accents curated into one calm, elevated home edit.
          </p>
          <div className="store-hero-actions">
            <a href="#shop" className="primary-link">
              Shop the collection
            </a>
            <a href="#amazon-edit" className="secondary-link">
              Browse Amazon add-ons
            </a>
          </div>
        </div>

        <div className="store-hero-media">
          <div className="hero-mosaic">
            {highlightedProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={index === 0 ? "hero-product hero-product-main" : "hero-product"}
              >
                <img src={product.image} alt={product.name} />
                <div className="hero-product-copy">
                  <span>{product.collection}</span>
                  <strong>{product.name}</strong>
                </div>
              </Link>
            ))}
          </div>
          <div className="hero-promo-card">
            <span>New room refresh</span>
            <strong>
              {featuredOffer
                ? `${featuredOffer.name} from ${currencyFormatter.format(
                    featuredOffer.priceInCents / 100
                  )}`
                : "Build a warm living room in 3 pieces"}
            </strong>
            <p>
              {featuredOffer
                ? featuredOffer.tagline
                : "Lamp, vase, and textile layers that work together out of the box."}
            </p>
            {featuredOffer ? (
              <div className="hero-promo-actions">
                <Link href={`/products/${featuredOffer.id}`} className="primary-link">
                  Shop this piece
                </Link>
                <button
                  type="button"
                  className="secondary-link"
                  onClick={() => addItem(featuredOffer)}
                >
                  Add to cart
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="shop" className="shop-section">
        <div className="store-section-head">
          <div>
            <p className="eyebrow">Shop the edit</p>
            <h2>{getCollectionTitle(activeFilter)}</h2>
            <p className="section-copy">
              A focused product edit with strong imagery, clear pricing, and
              straightforward paths into the product page or cart.
            </p>
          </div>
          <div className="shop-filter-row">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={filter.id === activeFilter ? "shop-chip active" : "shop-chip"}
                onClick={() => setActiveFilter(filter.id)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="shop-grid">
          <div className="shop-products">
            {mergedProducts.map((product) => {
              if (product.isAffiliate) {
                return (
                  <article key={`amz-${product.id}`} className="shop-card shop-card--amazon">
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noopener sponsored"
                      className="shop-card-media"
                    >
                      <img src={product.image} alt={product.alt} loading="lazy" />
                      <span className="shop-card-badge shop-card-badge--amazon">Amazon</span>
                    </a>

                    <div className="shop-card-copy">
                      <div className="shop-card-meta">
                        <span>{product.category}</span>
                        <span>Affiliate link</span>
                      </div>
                      <a
                        href={product.href}
                        target="_blank"
                        rel="noopener sponsored"
                        className="shop-card-title"
                      >
                        {product.name}
                      </a>
                      <p>{product.description}</p>
                      <div className="shop-card-footer">
                        <div>
                          <strong>{product.price}</strong>
                          <span>Ships via Amazon</span>
                        </div>
                        <div className="shop-card-actions">
                          <a
                            href={product.href}
                            target="_blank"
                            rel="noopener sponsored"
                            className="add-button"
                          >
                            View on Amazon
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              const canPurchase = product.priceInCents > 0;

              return (
                <article key={product.id} className="shop-card">
                  <button
                    type="button"
                    className="shop-card-media"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <img src={product.image} alt={product.name} />
                    <span className="shop-card-badge">{product.collection}</span>
                  </button>

                  <div className="shop-card-copy">
                    <div className="shop-card-meta">
                      <span>{product.category}</span>
                      <span>{product.leadTime}</span>
                    </div>
                    <Link href={`/products/${product.id}`} className="shop-card-title">
                      {product.name}
                    </Link>
                    <p>{product.description}</p>
                    <div className="shop-card-footer">
                      <div>
                        <strong>
                          {canPurchase
                            ? currencyFormatter.format(product.priceInCents / 100)
                            : "Price syncing"}
                        </strong>
                        <span>{product.tagline}</span>
                      </div>
                      <div className="shop-card-actions">
                        <Link href={`/products/${product.id}`} className="shop-link-button">
                          Details
                        </Link>
                        <button
                          type="button"
                          className="add-button"
                          disabled={!canPurchase}
                          onClick={() => addItem(product)}
                        >
                          {canPurchase ? "Add" : "View"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside id="cart" className="store-cart">
            <div className="store-cart-head">
              <p className="eyebrow">Your cart</p>
              <h3>Checkout-ready basket</h3>
            </div>

            <div className="store-cart-notes">
              <span>Guest checkout via Stripe</span>
              <span>Shipping and tax shown in checkout</span>
            </div>

            <div className="store-cart-list">
              {cartItems.length ? (
                cartItems.map((item) => (
                  <div key={item.id} className="store-cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="store-cart-copy">
                      <strong>{item.name}</strong>
                      <span>{currencyFormatter.format(item.priceInCents / 100)}</span>
                    </div>
                    <div className="quantity-stepper">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-copy">
                  Add pieces from the collection and your basket will stay here while
                  you browse product details.
                </p>
              )}
            </div>

            <div className="store-cart-summary">
              <div className="summary-line">
                <span>Subtotal</span>
                <strong>{currencyFormatter.format(subtotal / 100)}</strong>
              </div>
              <button
                type="button"
                className="checkout-button"
                onClick={beginCheckout}
                disabled={checkoutState.loading || !cartItems.length}
              >
                {checkoutState.loading ? "Starting checkout..." : "Checkout with Stripe"}
              </button>
              {checkoutState.message ? (
                <p className="checkout-message">{checkoutState.message}</p>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section id="amazon-edit" className="amazon-affiliate-section">
        <div className="store-section-head">
          <div>
            <p className="eyebrow">Amazon add-ons</p>
            <h2>Optional finishing pieces from Amazon</h2>
            <p className="affiliate-disclosure">
              Disclosure: this section contains Amazon affiliate links. If you buy
              through them, we may earn a commission at no extra cost to you.
            </p>
          </div>
        </div>

        <div className="amazon-affiliate-grid">
          {amazonEdit.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener sponsored"
              className="amazon-affiliate-card"
            >
              <img src={item.image} alt={item.alt} loading="lazy" />
              <div className="amazon-affiliate-copy">
                <div className="amazon-affiliate-meta">
                  <span>Affiliate link</span>
                  <span>{item.category}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <strong>{item.price}</strong>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="store-footer">
        <div>
          <strong>Linen &amp; Form</strong>
          <p>
            A calm, edited home decor store for softer living rooms, shelves,
            and wall styling.
          </p>
        </div>
        <div>
          <strong>Affiliate disclosure</strong>
          <p>
            Amazon links are clearly marked and may earn us a commission at no
            extra cost to you.
          </p>
        </div>
      </footer>

      {featuredOffer && !offerBarDismissed ? (
        <div className="floating-offer-bar">
          <button
            type="button"
            className="floating-offer-close"
            aria-label="Close offer bar"
            onClick={() => setOfferBarDismissed(true)}
          >
            ×
          </button>
          <Link href={`/products/${featuredOffer.id}`} className="floating-offer-item">
            <img src={featuredOffer.image} alt={featuredOffer.name} />
            <div>
              <span>Shop now</span>
              <strong>{featuredOffer.name}</strong>
            </div>
          </Link>
          <div className="floating-offer-price">
            <span>From</span>
            <strong>{currencyFormatter.format(featuredOffer.priceInCents / 100)}</strong>
          </div>
          <div className="floating-offer-actions">
            <button
              type="button"
              className="secondary-link"
              onClick={() => addItem(featuredOffer)}
            >
              Add to cart
            </button>
            <Link href={`/products/${featuredOffer.id}`} className="primary-link">
              Buy now
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
