import { NextResponse } from "next/server";
import Stripe from "stripe";

function normalizeItems(items) {
  return items
    .filter((item) => item?.name && Number(item?.amount) > 0)
    .map((item) => ({
      quantity: Math.max(1, Number(item.quantity) || 1),
      price_data: {
        currency: "cad",
        unit_amount: Math.round(Number(item.amount)),
        product_data: {
          name: item.name,
          description: item.description || "CJ sourced home decor item"
        }
      }
    }));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const lineItems = normalizeItems(body?.items || []);

    if (!lineItems.length) {
      return NextResponse.json(
        { error: "Cart is empty or invalid." },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error:
            "Missing STRIPE_SECRET_KEY. Add your Stripe secret key to .env.local before using checkout."
        },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["CA", "US"]
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        fulfillmentPartner: "CJ Dropshipping",
        channel: "linen-and-form"
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to create checkout session." },
      { status: 500 }
    );
  }
}
