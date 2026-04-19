"use client";

import { useState } from "react";

const cadFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD"
});

function formatCurrency(cents, currency = "cad") {
  if (currency === "cad") return cadFormatter.format(cents / 100);
  return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

const STATUS_LABELS = {
  confirmed: { label: "Payment confirmed", step: 1 },
  pending: { label: "Awaiting payment", step: 0 },
  expired: { label: "Session expired", step: -1 },
  unknown: { label: "Status unknown", step: 0 }
};

const CJ_STATUS_LABELS = {
  UNPAID: "Awaiting payment",
  UNSHIPPED: "Processing — preparing to ship",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  VOID: "Cancelled",
  OTHER: "In progress"
};

function StatusTrack({ stripeStatus, cjStatus }) {
  const steps = [
    { key: "paid", label: "Payment confirmed" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" }
  ];

  let activeStep = 0;
  if (stripeStatus === "confirmed") activeStep = 1;
  if (cjStatus === "UNSHIPPED") activeStep = 1;
  if (cjStatus === "SHIPPED") activeStep = 2;
  if (cjStatus === "DELIVERED") activeStep = 3;

  return (
    <div className="track-steps">
      {steps.map((step, i) => (
        <div
          key={step.key}
          className={
            i < activeStep
              ? "track-step track-step--done"
              : i === activeStep
              ? "track-step track-step--active"
              : "track-step"
          }
        >
          <div className="track-step-dot" />
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

export function OrderTracker({ initialSessionId }) {
  const [sessionId, setSessionId] = useState(initialSessionId || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function lookup(e) {
    e.preventDefault();
    const id = sessionId.trim();
    if (!id) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/track?session_id=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not find this order.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tracker-shell">
      <form className="tracker-form" onSubmit={lookup}>
        <label htmlFor="session-id">Order ID</label>
        <p className="tracker-hint">
          Your order ID starts with <code>cs_</code> and was shown after checkout.
        </p>
        <div className="tracker-input-row">
          <input
            id="session-id"
            type="text"
            placeholder="cs_live_..."
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" disabled={loading || !sessionId.trim()}>
            {loading ? "Looking up…" : "Track order"}
          </button>
        </div>
        {error ? <p className="tracker-error">{error}</p> : null}
      </form>

      {order ? (
        <div className="tracker-result">
          <div className="tracker-result-head">
            <div>
              <p className="eyebrow">
                {order.status === "confirmed" ? "Order confirmed" : STATUS_LABELS[order.status]?.label}
              </p>
              <h2>{order.customerName || "Your order"}</h2>
              {order.customerEmail ? (
                <p className="tracker-email">{order.customerEmail}</p>
              ) : null}
            </div>
            {order.amountTotal ? (
              <div className="tracker-total">
                <span>Total paid</span>
                <strong>{formatCurrency(order.amountTotal, order.currency)}</strong>
              </div>
            ) : null}
          </div>

          <StatusTrack
            stripeStatus={order.status}
            cjStatus={order.cj?.status || null}
          />

          {order.cj ? (
            <div className="tracker-shipping">
              <p className="eyebrow">Shipping</p>
              <div className="tracker-shipping-grid">
                <div>
                  <span>Carrier</span>
                  <strong>{order.cj.logisticName || "Pending"}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{CJ_STATUS_LABELS[order.cj.status] || order.cj.status}</strong>
                </div>
                {order.cj.trackingNumber ? (
                  <div>
                    <span>Tracking number</span>
                    <strong>
                      {order.cj.trackingUrl ? (
                        <a
                          href={order.cj.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {order.cj.trackingNumber}
                        </a>
                      ) : (
                        order.cj.trackingNumber
                      )}
                    </strong>
                  </div>
                ) : null}
                {order.cj.shippedAt ? (
                  <div>
                    <span>Shipped on</span>
                    <strong>{new Date(order.cj.shippedAt).toLocaleDateString("en-CA")}</strong>
                  </div>
                ) : null}
              </div>
            </div>
          ) : order.status === "confirmed" ? (
            <p className="tracker-pending-note">
              Your order is confirmed and will be handed to our fulfillment partner shortly. Tracking details will appear here once your package ships.
            </p>
          ) : null}

          {order.items?.length ? (
            <div className="tracker-items">
              <p className="eyebrow">Items ordered</p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    <span>{item.name}</span>
                    <span>
                      × {item.quantity}
                      {item.amount
                        ? ` — ${formatCurrency(item.amount, order.currency)}`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {order.shipping ? (
            <div className="tracker-address">
              <p className="eyebrow">Shipping address</p>
              <p>
                {[
                  order.shipping.line1,
                  order.shipping.line2,
                  order.shipping.city,
                  order.shipping.state,
                  order.shipping.postal_code,
                  order.shipping.country
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
