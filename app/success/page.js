import Link from "next/link";

export const metadata = {
  title: "Order Confirmed | Linen & Form"
};

export default function SuccessPage() {
  return (
    <main className="status-page">
      <div className="status-shell">
        <p className="eyebrow">Payment received</p>
        <h1>Your order is in the queue.</h1>
        <p>
          Stripe checkout completed successfully. We will now process your order
          and prepare the next fulfillment steps.
        </p>
        <Link href="/" className="status-link">
          Return to storefront
        </Link>
      </div>
    </main>
  );
}
