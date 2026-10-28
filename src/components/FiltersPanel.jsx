import { BATH_OPTIONS, BED_OPTIONS, PROPERTY_TYPES, STATUSES } from '../data/constants';
import LocationInput from './LocationInput';
import PriceSlider from './PriceSlider';

function Segmented({ label, value, options, onChange }) {
  const items = [{ v: 0, t: 'Any' }, ...options.map((n) => ({ v: n, t: `${n}+` }))];
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {items.map((o) => (
          <button
            key={o.v}
            type="button"
            aria-pressed={value === o.v}
            onClick={() => onChange(o.v)}
            className={`min-h-[40px] min-w-[44px] rounded-ctl border px-3 text-sm font-medium transition duration-200 ${value === o.v ? 'border-navy bg-navy text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-navy'}`}
          >
            {o.t}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Filter controls shared by the listings sidebar, the mobile drawer and the map page. */
export default function FiltersPanel({ filters, update, onClear, idPrefix = 'f' }) {
  const toggleType = (t) =>
    update({ types: filters.types.includes(t) ? filters.types.filter((x) => x !== t) : [...filters.types, t] });

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor={`${idPrefix}-loc`} className="label">Location</label>
        <LocationInput id={`${idPrefix}-loc`} value={filters.q} onChange={(q) => update({ q })} />
      </div>

      <fieldset>
        <legend className="label">Price range</legend>
        <PriceSlider min={filters.minPrice} max={filters.maxPrice} onChange={update} />
      </fieldset>

      <fieldset>
        <legend className="label">Property type</legend>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {PROPERTY_TYPES.map((t) => (
            <label key={t} className="flex min-h-[40px] cursor-pointer items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.types.includes(t)}
                onChange={() => toggleType(t)}
                className="h-4 w-4 rounded border-slate-400 accent-[#0B1F3A]"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <Segmented label="Bedrooms" value={filters.beds} options={BED_OPTIONS} onChange={(beds) => update({ beds })} />
      <Segmented label="Bathrooms" value={filters.baths} options={BATH_OPTIONS} onChange={(baths) => update({ baths })} />

      <div>
        <label htmlFor={`${idPrefix}-status`} className="label">Status</label>
        <select id={`${idPrefix}-status`} className="input" value={filters.status} onChange={(e) => update({ status: e.target.value })}>
          <option value="">Any status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <button type="button" onClick={onClear} className="btn-outline w-full">Clear all filters</button>
    </div>
  );
}
