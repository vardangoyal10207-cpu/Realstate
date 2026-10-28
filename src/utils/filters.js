import { PRICE_MAX } from '../data/constants';

export const DEFAULT_FILTERS = {
  q: '', types: [], minPrice: 0, maxPrice: PRICE_MAX, beds: 0, baths: 0, status: '', sort: 'newest',
};

const num = (v, fallback) => (v !== null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : fallback);

export function parseFilters(params) {
  return {
    q: params.get('q') || '',
    types: (params.get('type') || '').split(',').filter(Boolean),
    minPrice: num(params.get('min'), 0),
    maxPrice: num(params.get('max'), PRICE_MAX),
    beds: num(params.get('beds'), 0),
    baths: num(params.get('baths'), 0),
    status: params.get('status') || '',
    sort: params.get('sort') || 'newest',
  };
}

/** Only non-default values are written, which keeps shareable URLs short. */
export function filtersToParams(f, base = new URLSearchParams()) {
  const p = new URLSearchParams(base);
  ['q', 'type', 'min', 'max', 'beds', 'baths', 'status', 'sort'].forEach((k) => p.delete(k));
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.types.length) p.set('type', f.types.join(','));
  if (f.minPrice > 0) p.set('min', f.minPrice);
  if (f.maxPrice < PRICE_MAX) p.set('max', f.maxPrice);
  if (f.beds > 0) p.set('beds', f.beds);
  if (f.baths > 0) p.set('baths', f.baths);
  if (f.status) p.set('status', f.status);
  if (f.sort !== 'newest') p.set('sort', f.sort);
  return p;
}

export function applyFilters(list, f) {
  const q = f.q.trim().toLowerCase();
  const out = list.filter((p) => {
    if (q && !`${p.city} ${p.address} ${p.title}`.toLowerCase().includes(q)) return false;
    if (f.types.length && !f.types.includes(p.type)) return false;
    if (p.price < f.minPrice || p.price > f.maxPrice) return false;
    if (f.beds && p.bedrooms < f.beds) return false;
    if (f.baths && p.bathrooms < f.baths) return false;
    if (f.status && p.status !== f.status) return false;
    return true;
  });
  const by = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
  }[f.sort] || (() => 0);
  return out.sort(by);
}

export function activeChips(f, fmt) {
  const chips = [];
  if (f.q.trim()) chips.push({ key: 'q', label: `“${f.q.trim()}”`, clear: { q: '' } });
  f.types.forEach((t) => chips.push({ key: `type-${t}`, label: t, clear: { types: f.types.filter((x) => x !== t) } }));
  if (f.minPrice > 0 || f.maxPrice < PRICE_MAX)
    chips.push({
      key: 'price',
      label: `${fmt(f.minPrice)} – ${f.maxPrice >= PRICE_MAX ? `${fmt(PRICE_MAX)}+` : fmt(f.maxPrice)}`,
      clear: { minPrice: 0, maxPrice: PRICE_MAX },
    });
  if (f.beds) chips.push({ key: 'beds', label: `${f.beds}+ beds`, clear: { beds: 0 } });
  if (f.baths) chips.push({ key: 'baths', label: `${f.baths}+ baths`, clear: { baths: 0 } });
  if (f.status) chips.push({ key: 'status', label: f.status, clear: { status: '' } });
  return chips;
}

/** Haversine distance in km. */
export function distanceKm(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
