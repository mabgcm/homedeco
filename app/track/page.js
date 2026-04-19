import { OrderTracker } from "../../components/order-tracker";

export const metadata = {
  title: "Track Your Order | Linen & Form"
};

export default async function TrackPage({ searchParams }) {
  const params = await searchParams;
  const sessionId = params?.session_id || "";

  return (
    <main className="status-page">
      <div className="status-shell status-shell--wide">
        <p className="eyebrow">Order tracking</p>
        <h1>Track your order</h1>
        <p>
          Enter the order ID from your confirmation page to see your order status and shipping details.
        </p>
        <OrderTracker initialSessionId={sessionId} />
      </div>
    </main>
  );
}
