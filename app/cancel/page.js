import Link from "next/link";

export const metadata = {
  title: "Checkout Cancelled | Linen & Form"
};

export default function CancelPage() {
  return (
    <main className="status-page">
      <div className="status-shell">
        <p className="eyebrow">Checkout paused</p>
        <h1>Your cart is still waiting.</h1>
        <p>
          No payment was captured. You can return to the collection and resume
          checkout whenever you are ready.
        </p>
        <Link href="/" className="status-link">
          Back to collection
        </Link>
      </div>
    </main>
  );
}
