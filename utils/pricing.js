// utils/pricing.js
export function calcPricing({
  pricePerNight, // number (e.g. 200.00) or cents
  checkIn, // Date string or Date
  checkOut, // Date
  cleaningFee = 0,
  serviceFeePercent = 5,
  taxesPercent = 7
}) {
  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const msPerDay = 24*60*60*1000;
  const nights = Math.round((co - ci) / msPerDay);
  if (isNaN(nights) || nights <= 0) throw new Error("Invalid dates");

  const baseTotal = Number((pricePerNight * nights).toFixed(2));
  const serviceFee = Number(((serviceFeePercent / 100) * baseTotal).toFixed(2));
  const subtotal = Number((baseTotal + cleaningFee + serviceFee).toFixed(2));
  const taxes = Number(((taxesPercent / 100) * subtotal).toFixed(2));
  const total = Number((subtotal + taxes).toFixed(2));

  return {
    nights,
    baseTotal,
    cleaningFee,
    serviceFee,
    subtotal,
    taxes,
    total
  };
}
