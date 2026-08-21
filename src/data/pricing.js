// At-cost pricing: Printful base cost + Stripe processing fees (2.9% + $0.30),
// rounded up slightly for buffer. Recalculate if Printful's base cost or
// Stripe's rate changes.
export const BASE_PRICE = 12.5;
export const SIZE_SURCHARGE = { XXL: 2 };
