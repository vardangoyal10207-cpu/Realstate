import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROPERTY_TYPES } from '../data/constants';
import LocationInput from './LocationInput';
import { IconSearch } from './Icons';

const PRICE_PRESETS = [
  { label: 'Any price', min: 0, max: 0 },
  { label: 'Under $1M', min: 0, max: 1000000 },
  { label: '$1M – $2M', min: 1000000, max: 2000000 },
  { label: '$2M – $3M', min: 2000000, max: 3000000 },
  { label: '$3M +', min: 3000000, max: 0 },
];

/** Hero search: builds a query string and sends the visitor to /listings. */
export default function SearchBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState(0);
  const [beds, setBeds] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (type) p.set('type', type);
    const preset = PRICE_PRESETS[price];
    if (preset.min) p.set('min', preset.min);
    if (preset.max) p.set('max', preset.max);
    if (beds) p.set('beds', beds);
    navigate(`/listings${p.toString() ? `?${p}` : ''}`);
  };

  return (
    <form onSubmit={submit} role="search" aria-label="Search properties" className="grid gap-3 rounded-card bg-white p-3 text-left shadow-lift sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_.8fr_auto] lg:items-end lg:p-4">
      <div>
        <label htmlFor="hs-loc" className="label">Location</label>
        <LocationInput id="hs-loc" value={q} onChange={setQ} placeholder="Mississauga, Oakville…" />
      </div>
      <div>
        <label htmlFor="hs-type" className="label">Property type</label>
        <select id="hs-type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="hs-price" className="label">Price range</label>
        <select id="hs-price" className="input" value={price} onChange={(e) => setPrice(Number(e.target.value))}>
          {PRICE_PRESETS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="hs-beds" className="label">Bedrooms</label>
        <select id="hs-beds" className="input" value={beds} onChange={(e) => setBeds(e.target.value)}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
        </select>
      </div>
      <button type="submit" className="btn-gold min-h-[46px] sm:col-span-2 lg:col-span-1"><IconSearch size={18} /> Search</button>
    </form>
  );
}
