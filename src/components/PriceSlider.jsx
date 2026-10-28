import { PRICE_MAX, PRICE_STEP } from '../data/constants';
import { formatCompactPrice } from '../utils/format';

export default function PriceSlider({ min, max, onChange }) {
  const pct = (v) => (v / PRICE_MAX) * 100;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-semibold text-navy">
        <span>{formatCompactPrice(min)}</span>
        <span>{max >= PRICE_MAX ? `${formatCompactPrice(PRICE_MAX)}+` : formatCompactPrice(max)}</span>
      </div>
      <div className="dual-range">
        <div className="track" />
        <div className="fill" style={{ left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%` }} />
        <input
          type="range" min={0} max={PRICE_MAX} step={PRICE_STEP} value={min}
          aria-label="Minimum price"
          aria-valuetext={formatCompactPrice(min)}
          onChange={(e) => onChange({ minPrice: Math.min(Number(e.target.value), max - PRICE_STEP) })}
        />
        <input
          type="range" min={0} max={PRICE_MAX} step={PRICE_STEP} value={max}
          aria-label="Maximum price"
          aria-valuetext={max >= PRICE_MAX ? 'No maximum' : formatCompactPrice(max)}
          onChange={(e) => onChange({ maxPrice: Math.max(Number(e.target.value), min + PRICE_STEP) })}
        />
      </div>
    </div>
  );
}
