"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD"
});

export function ProductPurchasePanel({ product }) {
  const { addItem } = useCart();
  const [message, setMessage] = useState("");
  const canPurchase = product.priceInCents > 0;

  function handleAdd() {
    if (!canPurchase) {
      return;
    }

    addItem(product);
    setMessage("Added to cart. Return to the storefront cart to check out.");
  }

  return (
    <div className="pdp-buy-card">
      <div className="pdp-price-row">
        <strong>
          {canPurchase
            ? currencyFormatter.format(product.priceInCents / 100)
            : "Pricing updates daily"}
        </strong>
        <span>
          {canPurchase
            ? "Secure guest checkout with Stripe"
            : "Open product detail and price manually if needed"}
        </span>
      </div>

      <div className="pdp-trust-list">
        <span>Ships to CA/US</span>
        <span>{product.leadTime}</span>
        <span>Curated for soft-modern spaces</span>
      </div>

      <button
        type="button"
        className="pdp-buy-button"
        onClick={handleAdd}
        disabled={!canPurchase}
      >
        {canPurchase ? "Add to cart" : "Pricing unavailable"}
      </button>

      {message ? <p className="pdp-message">{message}</p> : null}
    </div>
  );
}
