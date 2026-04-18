import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        error:
          "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET. Webhook verification is disabled."
      },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const rawBody = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Stripe order completed", {
        sessionId: session.id,
        email: session.customer_details?.email,
        total: session.amount_total,
        note: "Send this order into your CJ fulfillment flow."
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Webhook signature verification failed." },
      { status: 400 }
    );
  }
}
