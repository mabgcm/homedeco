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

const moods = [
  {
    id: "living",
    label: "Layered living",
    copy: "Rounded silhouettes, warm neutrals, and quiet texture."
  },
  {
    id: "lighting",
    label: "Soft glow",
    copy: "Statement floor lamps and softer evening ambience."
  },
  {
    id: "textiles",
    label: "Textile depth",
    copy: "Pillow covers and tactile accents that lift plain sofas."
  },
  {
    id: "wall",
    label: "Clean walls",
    copy: "Art and decor that finish the room without clutter."
  }
];

const featureBlocks = [
  {
    title: "Secure guest checkout",
    text: "Stripe-powered payment, no marketplace account required."
  },
  {
    title: "Curated, not crowded",
    text: "Edited home decor assortment instead of a generic mega-catalog."
  },
  {
    title: "Designed to layer",
    text: "Lamps, textiles, and sculptural accents chosen to work together in one room."
  }
];

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD"
});

function getCollectionTitle(activeFilter) {
  return filters.find((filter) => filter.id === activeFilter)?.label || "All products";
}

export function Storefront({ cjProducts, amazonEdit, storeMetrics }) {
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

  const highlightedProducts = useMemo(() => catalog.slice(0, 3), [catalog]);
  const featuredOffer = useMemo(
    () => filteredProducts[0] || catalog[0] || null,
    [filteredProducts, catalog]
  );
  const secondaryOffer = useMemo(
    () => highlightedProducts[1] || highlightedProducts[0] || null,
    [highlightedProducts]
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
          <a href="#rooms">Rooms</a>
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
          <div className="store-hero-metrics">
            {storeMetrics.map((metric) => (
              <article key={metric.label} className="store-mini-stat">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
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

      <section className="feature-strip">
        {featureBlocks.map((feature) => (
          <article key={feature.title} className="feature-card">
            <strong>{feature.title}</strong>
            <p>{feature.text}</p>
            <Link href={featuredOffer ? `/products/${featuredOffer.id}` : "#shop"} className="inline-cta">
              Shop now
            </Link>
          </article>
        ))}
      </section>

      <section id="rooms" className="mood-section">
        <div className="store-section-head">
          <div>
            <p className="eyebrow">Shop by mood</p>
            <h2>Start with the room feeling you want.</h2>
          </div>
        </div>
        <div className="mood-grid">
          {moods.map((mood) => (
            <button
              key={mood.id}
              type="button"
              className="mood-card"
              onClick={() => {
                setActiveFilter(mood.id);
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <strong>{mood.label}</strong>
              <span>{mood.copy}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="editorial-section">
        <article className="editorial-card editorial-large">
          <p className="eyebrow">Room recipe</p>
          <h2>One statement lamp. One tactile textile. One object with shape.</h2>
          <p>
            That is the fastest path to a room that looks styled instead of merely
            furnished. The store is organized around that principle.
          </p>
          {featuredOffer ? (
            <div className="editorial-offer">
              <span>{featuredOffer.name}</span>
              <strong>{currencyFormatter.format(featuredOffer.priceInCents / 100)}</strong>
              <Link href={`/products/${featuredOffer.id}`} className="inline-cta">
                View product
              </Link>
            </div>
          ) : null}
        </article>
        <article className="editorial-card">
          <p className="eyebrow">What to expect</p>
          <h3>Large imagery, calm navigation, and clear delivery details.</h3>
          <p>
            Browse quickly, open a full product page, and check out without
            digging through cluttered menus or endless catalog pages.
          </p>
          {secondaryOffer ? (
            <div className="editorial-offer">
              <span>{secondaryOffer.name}</span>
              <strong>{currencyFormatter.format(secondaryOffer.priceInCents / 100)}</strong>
              <Link href={`/products/${secondaryOffer.id}`} className="inline-cta">
                Shop the detail
              </Link>
            </div>
          ) : null}
        </article>
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
            {filteredProducts.map((product) => {
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
