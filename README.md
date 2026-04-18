# Linen & Form

Next.js storefront scaffold for a home decor niche store.

## What changed

- CJ products are the main catalog and can be sent into Stripe Checkout.
- Amazon links are still present, but only as a smaller affiliate section.
- Stripe checkout and webhook routes are scaffolded for direct payment flow.
- If no CJ credentials are configured, the app shows a seed catalog banner so it is clear this is not your live CJ account yet.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Add your Stripe keys.
3. Add your CJ account credentials or access token if you want this tied to your own account.
4. Install dependencies with `npm install`.
5. Start the app with `npm run dev`.

## Fulfillment note

The checkout flow is ready, but CJ order submission is still intentionally kept as a handoff point. Use the Stripe webhook route to trigger your manual or automated CJ fulfillment process.
