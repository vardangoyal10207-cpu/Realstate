import { useMemo, useState } from 'react';
import { formatPrice } from '../utils/format';
import { monthlyPayment } from '../utils/mortgage';

export default function MortgageCalc({ price }) {
  const [homePrice, setHomePrice] = useState(price);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(5.0);
  const [years, setYears] = useState(25);

  const r = useMemo(() => monthlyPayment({ price: Number(homePrice) || 0, downPct, ratePct: Number(rate) || 0, years }), [homePrice, downPct, rate, years]);
  const down = (Number(homePrice) || 0) * (downPct / 100);

  return (
    <div className="card p-6">
      <h2 className="font-serif text-2xl font-semibold">Mortgage estimate</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="mc-price" className="label">Home price (CAD)</label>
          <input id="mc-price" type="number" min="0" step="1000" className="input" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} />
        </div>
        <div>
          <label htmlFor="mc-rate" className="label">Interest rate (%)</label>
          <input id="mc-rate" type="number" min="0" max="25" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="mc-down" className="label">Down payment: {downPct}% ({formatPrice(down)})</label>
          <input id="mc-down" type="range" min="5" max="60" step="1" value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-[#0B1F3A]" />
        </div>
        <div>
          <label htmlFor="mc-years" className="label">Amortization</label>
          <select id="mc-years" className="input" value={years} onChange={(e) => setYears(Number(e.target.value))}>
            {[10, 15, 20, 25, 30].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-ctl bg-navy p-5 text-white" aria-live="polite">
        <p className="text-sm text-white/80">Estimated monthly payment</p>
        <p className="font-serif text-4xl font-semibold text-gold">{formatPrice(r.payment)}</p>
        <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div><dt className="text-white/70">Mortgage</dt><dd className="font-semibold">{formatPrice(r.principal)}</dd></div>
          <div><dt className="text-white/70">Total interest</dt><dd className="font-semibold">{formatPrice(r.interest)}</dd></div>
          <div><dt className="text-white/70">Total cost</dt><dd className="font-semibold">{formatPrice(r.total + down)}</dd></div>
        </dl>
      </div>
      <p className="mt-3 text-xs text-slate-600">
        Estimate only. Uses Canadian semi-annual compounding; excludes property tax, insurance, closing costs and CMHC default insurance
        (required when the down payment is under 20%). Speak with a mortgage professional for exact figures.
      </p>
    </div>
  );
}
