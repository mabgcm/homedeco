const DEFAULT_PAYMENT_FEE_RATE = 0.029;
const DEFAULT_PAYMENT_FIXED_CENTS = 30;
const DEFAULT_PACKAGING_FEE_CENTS = 150;
const DEFAULT_HANDLING_FEE_CENTS = 220;
const DEFAULT_MARKETING_RESERVE_RATE = 0.07;
const DEFAULT_CUSTOMS_RATE = 0.03;
const DEFAULT_SHIPPING_BUFFER_CENTS = 900;

function safeNumber(value, fallbackValue = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallbackValue;
}

export function buildPricingSnapshot(
  {
    retailPriceInCents,
    sourceCostInCents,
    shippingBufferInCents = DEFAULT_SHIPPING_BUFFER_CENTS,
    packagingFeeInCents = DEFAULT_PACKAGING_FEE_CENTS,
    handlingFeeInCents = DEFAULT_HANDLING_FEE_CENTS,
    marketingReserveRate = DEFAULT_MARKETING_RESERVE_RATE,
    customsRate = DEFAULT_CUSTOMS_RATE,
    paymentFeeRate = DEFAULT_PAYMENT_FEE_RATE,
    paymentFixedFeeInCents = DEFAULT_PAYMENT_FIXED_CENTS
  },
  sourceSyncedAt
) {
  const retail = safeNumber(retailPriceInCents);
  const sourceCost = safeNumber(sourceCostInCents);
  const shippingBuffer = safeNumber(shippingBufferInCents, DEFAULT_SHIPPING_BUFFER_CENTS);
  const packagingFee = safeNumber(packagingFeeInCents, DEFAULT_PACKAGING_FEE_CENTS);
  const handlingFee = safeNumber(handlingFeeInCents, DEFAULT_HANDLING_FEE_CENTS);
  const customsBuffer = Math.round(sourceCost * safeNumber(customsRate, DEFAULT_CUSTOMS_RATE));
  const paymentFee =
    Math.round(retail * safeNumber(paymentFeeRate, DEFAULT_PAYMENT_FEE_RATE)) +
    safeNumber(paymentFixedFeeInCents, DEFAULT_PAYMENT_FIXED_CENTS);
  const marketingReserve = Math.round(
    retail * safeNumber(marketingReserveRate, DEFAULT_MARKETING_RESERVE_RATE)
  );
  const totalEstimatedCostInCents =
    sourceCost +
    shippingBuffer +
    packagingFee +
    handlingFee +
    customsBuffer +
    paymentFee +
    marketingReserve;
  const estimatedMarginInCents = retail - totalEstimatedCostInCents;
  const estimatedMarginPercent = retail
    ? Math.round((estimatedMarginInCents / retail) * 1000) / 10
    : 0;

  return {
    retailPriceInCents: retail,
    sourceCostInCents: sourceCost,
    shippingBufferInCents: shippingBuffer,
    packagingFeeInCents: packagingFee,
    handlingFeeInCents: handlingFee,
    customsBufferInCents: customsBuffer,
    paymentFeeInCents: paymentFee,
    marketingReserveInCents: marketingReserve,
    totalEstimatedCostInCents,
    estimatedMarginInCents,
    estimatedMarginPercent,
    sourceSyncedAt: sourceSyncedAt || null
  };
}
