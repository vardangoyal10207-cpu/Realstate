/**
 * Canadian fixed-rate mortgages compound semi-annually, so the effective
 * monthly rate is (1 + r/2)^(1/6) - 1 rather than r/12.
 */
export function monthlyPayment({ price, downPct, ratePct, years }) {
  const principal = Math.max(0, price * (1 - downPct / 100));
  const n = Math.round(years * 12);
  const annual = ratePct / 100;
  if (principal === 0 || n === 0) return { principal, payment: 0, total: 0, interest: 0 };
  const i = annual === 0 ? 0 : Math.pow(1 + annual / 2, 1 / 6) - 1;
  const payment = i === 0 ? principal / n : (principal * i) / (1 - Math.pow(1 + i, -n));
  const total = payment * n;
  return { principal, payment, total, interest: total - principal };
}
