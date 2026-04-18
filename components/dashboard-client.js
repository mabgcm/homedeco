"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const cadFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD"
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const emptyData = {
  account: {
    openName: "CJ Dashboard",
    openEmail: null,
    root: null,
    isSandbox: 0
  },
  balance: {
    amount: 0,
    noWithdrawalAmount: 0,
    freezeAmount: 0
  },
  products: [],
  usingFallbackCatalog: false,
  metrics: {
    totalProducts: 0,
    unpaidCount: 0,
    processingCount: 0,
    shippedCount: 0,
    deliveredCount: 0,
    salesUsd: 0,
    recentOrderCount: 0
  },
  recentOrders: [],
  warnings: [],
  partial: false,
  generatedAt: null
};

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatDateTime(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getStatusTone(status) {
  switch (status) {
    case "DELIVERED":
      return "green";
    case "SHIPPED":
      return "blue";
    case "UNSHIPPED":
      return "amber";
    case "UNPAID":
      return "rose";
    default:
      return "gray";
  }
}

function LoadingMetricCard() {
  return <div className="loading-block" />;
}

export function DashboardClient() {
  const [data, setData] = useState(emptyData);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [state, setState] = useState({
    loading: true,
    message: ""
  });

  const selectedProduct =
    data.products.find((product) => product.id === selectedProductId) ||
    data.products[0] ||
    null;

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard", {
          cache: "no-store"
        });

        if (response.status === 401) {
          window.location.reload();
          return;
        }

        const payload = await response.json();

        if (!cancelled) {
          setData(payload);
          setSelectedProductId((currentValue) => currentValue || payload.products?.[0]?.id || null);
          setState({
            loading: false,
            message: ""
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            loading: false,
            message: error.message || "Dashboard data could not be loaded."
          });
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    await fetch("/api/dashboard/logout", {
      method: "POST"
    });
    window.location.reload();
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">Operations dashboard</p>
            <h1>Products, sales, and deliveries in one panel.</h1>
            <p className="dashboard-copy">
              This dashboard opens immediately. Live CJ data loads in the
              background and fills the cards when ready.
            </p>
            {data.partial || state.message ? (
              <div className="dashboard-warning">
                <strong>{state.message ? "Data issue" : "Partial data mode"}</strong>
                <span>
                  {state.message || data.warnings[0] || "One or more CJ requests failed."}
                </span>
              </div>
            ) : null}
          </div>
          <div className="dashboard-hero-actions">
            <Link href="/" className="secondary-link">
              Back to storefront
            </Link>
            <button type="button" className="secondary-link button-link" onClick={logout}>
              Lock dashboard
            </button>
          </div>
        </section>

        <section className="dashboard-grid dashboard-top-grid">
          <article className="dashboard-card">
            <p className="eyebrow">Account</p>
            <h2>{state.loading ? "Loading..." : data.account.openName || "CJ Account"}</h2>
            <div className="meta-stack">
              <span>{state.loading ? "Checking account..." : data.account.openEmail || "No account email returned"}</span>
              <span>Root: {state.loading ? "..." : data.account.root || "Unknown"}</span>
              <span>{state.loading ? "..." : data.account.isSandbox ? "Sandbox" : "Production"}</span>
              <span>Updated: {state.loading ? "Waiting..." : formatDate(data.generatedAt)}</span>
            </div>
          </article>

          <article className="dashboard-card">
            <p className="eyebrow">Balance</p>
            <h2>{state.loading ? "..." : usdFormatter.format(data.balance.amount)}</h2>
            <div className="metric-inline-list">
              <span>Bonus: {state.loading ? "..." : usdFormatter.format(data.balance.noWithdrawalAmount)}</span>
              <span>Frozen: {state.loading ? "..." : usdFormatter.format(data.balance.freezeAmount)}</span>
            </div>
          </article>

          <article className="dashboard-card">
            <p className="eyebrow">Catalog</p>
            <h2>{state.loading ? "Loading..." : `${data.metrics.totalProducts} visible items`}</h2>
            <div className="meta-stack">
              <span>
                Pricing sync: {state.loading ? "Waiting..." : "Curated catalog with source snapshots"}
              </span>
              <span>
                {state.loading
                  ? "Fetching product costs..."
                  : "Store prices stay fixed. Latest source costs and fee assumptions are tracked per product."}
              </span>
              <span>Curated items: {state.loading ? "..." : data.metrics.totalProducts}</span>
            </div>
          </article>
        </section>

        <section className="dashboard-metrics">
          {state.loading ? (
            <>
              <LoadingMetricCard />
              <LoadingMetricCard />
              <LoadingMetricCard />
              <LoadingMetricCard />
              <LoadingMetricCard />
            </>
          ) : (
            <>
              <article className="dashboard-stat">
                <span>Recent order sales</span>
                <strong>{usdFormatter.format(data.metrics.salesUsd)}</strong>
              </article>
              <article className="dashboard-stat">
                <span>Unpaid</span>
                <strong>{data.metrics.unpaidCount}</strong>
              </article>
              <article className="dashboard-stat">
                <span>Processing</span>
                <strong>{data.metrics.processingCount}</strong>
              </article>
              <article className="dashboard-stat">
                <span>Shipped</span>
                <strong>{data.metrics.shippedCount}</strong>
              </article>
              <article className="dashboard-stat">
                <span>Delivered</span>
                <strong>{data.metrics.deliveredCount}</strong>
              </article>
            </>
          )}
        </section>

        <section className="dashboard-grid dashboard-main-grid">
          <article className="dashboard-card dashboard-table-card">
            <div className="dashboard-section-head">
              <div>
                <p className="eyebrow">Orders</p>
                <h2>Recent sales and fulfillment</h2>
              </div>
            </div>

            {state.loading ? (
              <div className="dashboard-loading-list">
                <div className="loading-row" />
                <div className="loading-row" />
                <div className="loading-row" />
              </div>
            ) : data.recentOrders.length ? (
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Destination</th>
                      <th>Logistics</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div className="table-primary">
                            <strong>{order.orderNum}</strong>
                            <span>{order.customer}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${getStatusTone(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{usdFormatter.format(order.amount)}</td>
                        <td>{order.country}</td>
                        <td>
                          <div className="table-primary">
                            <strong>{order.logisticName}</strong>
                            <span>{order.trackingNumber || "No tracking yet"}</span>
                          </div>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-state-copy">
                No recent CJ orders were returned for the tracked statuses.
              </p>
            )}
          </article>

          <article className="dashboard-card dashboard-products-card">
            <div className="dashboard-section-head">
              <div>
                <p className="eyebrow">Products</p>
                <h2>Store pricing inspector</h2>
              </div>
            </div>

            {state.loading ? (
              <div className="dashboard-loading-list">
                <div className="loading-product" />
                <div className="loading-product" />
                <div className="loading-product" />
              </div>
            ) : (
              <>
                <div className="dashboard-product-list">
                  {data.products.slice(0, 10).map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className={
                        product.id === selectedProduct?.id
                          ? "dashboard-product-item active"
                          : "dashboard-product-item"
                      }
                      onClick={() => setSelectedProductId(product.id)}
                    >
                      <img src={product.image} alt={product.name} />
                      <div>
                        <strong>{product.name}</strong>
                        <span>{cadFormatter.format(product.priceInCents / 100)}</span>
                        <span>{product.leadTime}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedProduct ? (
                  <div className="dashboard-detail-panel">
                    <div className="dashboard-detail-head">
                      <div>
                        <p className="eyebrow">Selected product</p>
                        <h3>{selectedProduct.name}</h3>
                      </div>
                      <Link href={`/products/${selectedProduct.id}`} className="secondary-link">
                        Open product page
                      </Link>
                    </div>

                    <div className="dashboard-pricing-grid">
                      <article className="dashboard-pricing-stat">
                        <span>Store price</span>
                        <strong>
                          {cadFormatter.format(
                            selectedProduct.pricingSnapshot?.retailPriceInCents
                              ? selectedProduct.pricingSnapshot.retailPriceInCents / 100
                              : selectedProduct.priceInCents / 100
                          )}
                        </strong>
                      </article>
                      <article className="dashboard-pricing-stat">
                        <span>Latest source cost</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.sourceCostInCents || 0) / 100
                          )}
                        </strong>
                      </article>
                      <article className="dashboard-pricing-stat">
                        <span>Estimated margin</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.estimatedMarginInCents || 0) /
                              100
                          )}
                        </strong>
                      </article>
                    </div>

                    <div className="meta-stack">
                      <span>
                        Last source sync:{" "}
                        {formatDateTime(selectedProduct.pricingSnapshot?.sourceSyncedAt)}
                      </span>
                      <span>
                        Margin rate: {selectedProduct.pricingSnapshot?.estimatedMarginPercent || 0}
                        %
                      </span>
                      <span>{selectedProduct.fulfillmentNote}</span>
                    </div>

                    <div className="dashboard-cost-breakdown">
                      <div>
                        <span>CJ source cost</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.sourceCostInCents || 0) / 100
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Shipping buffer</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.shippingBufferInCents || 0) / 100
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Packaging</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.packagingFeeInCents || 0) / 100
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Handling</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.handlingFeeInCents || 0) / 100
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Stripe fee estimate</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.paymentFeeInCents || 0) / 100
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Customs buffer</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.customsBufferInCents || 0) / 100
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Marketing reserve</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.marketingReserveInCents || 0) / 100
                          )}
                        </strong>
                      </div>
                      <div>
                        <span>Total estimated cost</span>
                        <strong>
                          {cadFormatter.format(
                            (selectedProduct.pricingSnapshot?.totalEstimatedCostInCents || 0) /
                              100
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
