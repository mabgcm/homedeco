import { NextResponse } from "next/server";
import Stripe from "stripe";
import { listCjOrders } from "../../../lib/cj";

function formatStatus(stripeStatus, paymentStatus) {
  if (stripeStatus === "expired") return "expired";
  if (paymentStatus === "paid") return "confirmed";
  if (paymentStatus === "unpaid") return "pending";
  return "unknown";
}

async function findCjOrderByEmail(email) {
  if (!process.env.CJ_API_KEY && !process.env.CJ_ACCESS_TOKEN) return null;

  try {
    const statuses = ["UNSHIPPED", "SHIPPED", "DELIVERED"];
    for (const status of statuses) {
      const { list } = await listCjOrders({ pageNum: 1, pageSize: 50, status });
      const match = list.find(
        (order) =>
          order.customer &&
          email &&
          order.customer.toLowerCase().includes(email.split("@")[0].toLowerCase())
      );
      if (match) return match;
    }
  } catch {
    // CJ unavailable — skip silently
  }

  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required." }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Store is not configured for order lookup." }, { status: 500 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"]
    });

    const customerEmail = session.customer_details?.email || null;
    const customerName = session.customer_details?.name || null;
    const shipping = session.shipping_details?.address || null;

    const items = (session.line_items?.data || []).map((item) => ({
      name: item.description || item.price?.product?.name || "Item",
      quantity: item.quantity,
      amount: item.amount_total
    }));

    const cjOrder = customerEmail ? await findCjOrderByEmail(customerEmail) : null;

    return NextResponse.json({
      sessionId,
      status: formatStatus(session.status, session.payment_status),
      customerName,
      customerEmail,
      shipping,
      amountTotal: session.amount_total,
      currency: session.currency,
      items,
      cj: cjOrder
        ? {
            orderId: cjOrder.id,
            orderNum: cjOrder.orderNum,
            status: cjOrder.status,
            logisticName: cjOrder.logisticName,
            trackingNumber: cjOrder.trackingNumber,
            trackingUrl: cjOrder.trackingUrl,
            shippedAt: cjOrder.shippedAt
          }
        : null
    });
  } catch (error) {
    if (error?.statusCode === 404 || /No such checkout/i.test(error?.message || "")) {
      return NextResponse.json({ error: "Order not found. Check your order ID and try again." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not retrieve order details." }, { status: 500 });
  }
}
