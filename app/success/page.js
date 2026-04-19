import Link from "next/link";

export const metadata = {
  title: "Order Confirmed | Linen & Form"
};

export default function SuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id || "";

  return (
    <main className="status-page">
      <div className="status-shell">
        <p className="eyebrow">Payment received</p>
        <h1>Your order is confirmed.</h1>
        <p>
          Thank you for your purchase. We will process your order and ship it shortly.
        </p>

        {sessionId ? (
          <div className="success-order-id">
            <span>Your order ID</span>
            <code>{sessionId}</code>
            <p>Save this ID to track your order status.</p>
          </div>
        ) : null}

        <div className="success-actions">
          {sessionId ? (
            <Link href={`/track?session_id=${sessionId}`} className="status-link">
              Track your order
            </Link>
          ) : null}
          <Link href="/" className={sessionId ? "status-link-secondary" : "status-link"}>
            Return to storefront
          </Link>
        </div>
      </div>
    </main>
  );
}
