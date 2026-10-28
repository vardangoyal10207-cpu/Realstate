import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useSeo } from '../../hooks/useSeo';
import { PROPERTY_TYPES, STATUSES } from '../../data/constants';
import TagInput from '../../components/TagInput';
import ImageManager from '../../components/ImageManager';
import MapView from '../../components/MapView';
import { validateListing } from '../../utils/validation';

const EMPTY = {
  title: '', description: '', price: '', address: '', city: '', lat: '43.5890', lng: '-79.6441',
  type: 'House', bedrooms: '3', bathrooms: '2', sqft: '', lotSize: '', yearBuilt: '', parking: '1',
  features: [], images: [], status: 'Available', featured: false, rental: false,
};

const toForm = (p) => ({
  ...EMPTY, ...p,
  price: String(p.price), lat: String(p.lat), lng: String(p.lng), bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms),
  sqft: String(p.sqft), yearBuilt: p.yearBuilt ? String(p.yearBuilt) : '', parking: String(p.parking ?? 0), lotSize: p.lotSize || '',
});

function Field({ id, label, error, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export default function ListingForm() {
  const { id } = useParams();
  const { properties, addProperty, updateProperty } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const existing = id ? properties.find((p) => p.id === id) : null;
  const [v, setV] = useState(existing ? toForm(existing) : EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  useSeo({ title: existing ? 'Edit Listing' : 'Add Listing' });

  if (id && !existing) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <h1 className="font-serif text-2xl font-semibold">Listing not found</h1>
        <p className="mt-2 text-sm">It may have been deleted.</p>
        <Link to="/admin/listings" className="btn-primary mt-5">Back to listings</Link>
      </div>
    );
  }

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const err = (k) => errors[k];
  const inp = (k) => ({ id: `lf-${k}`, value: v[k], onChange: set(k), 'aria-invalid': !!err(k), 'aria-describedby': err(k) ? `lf-${k}-err` : undefined });
  const isLand = v.type === 'Land';

  const submit = (e) => {
    e.preventDefault();
    const errs = validateListing(v);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      toast('Please fix the highlighted fields.', 'error');
      document.getElementById(`lf-${first}`)?.focus();
      return;
    }
    setSaving(true);
    const data = {
      title: v.title.trim(), description: v.description.trim(), price: Number(v.price),
      address: v.address.trim(), city: v.city.trim(), lat: Number(v.lat), lng: Number(v.lng),
      type: v.type, bedrooms: Number(v.bedrooms), bathrooms: Number(v.bathrooms), sqft: Number(v.sqft),
      lotSize: v.lotSize.trim() || '—', yearBuilt: v.yearBuilt ? Number(v.yearBuilt) : null, parking: Number(v.parking) || 0,
      features: v.features, images: v.images, status: v.status, featured: v.featured, rental: v.rental,
    };
    const ok = existing ? updateProperty(existing.id, data) : addProperty(data);
    setSaving(false);
    if (!ok) { toast('Could not save: browser storage is full. Use fewer/smaller photos or paste image URLs instead.', 'error'); return; }
    toast(existing ? 'Listing updated' : 'Listing added. It’s live on the website.');
    navigate('/admin/listings');
  };

  const picked = Number.isFinite(Number(v.lat)) && Number.isFinite(Number(v.lng)) && v.lat !== '' && v.lng !== '' ? { lat: Number(v.lat), lng: Number(v.lng) } : null;

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/admin/listings" className="text-sm text-slate-600 hover:underline">← All listings</Link>
          <h1 className="font-serif text-3xl font-semibold">{existing ? 'Edit listing' : 'Add listing'}</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/listings" className="btn-outline">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-gold">{existing ? 'Save changes' : 'Publish listing'}</button>
        </div>
      </div>

      <section className="card space-y-5 p-6" aria-labelledby="lf-basic">
        <h2 id="lf-basic" className="font-serif text-xl font-semibold">Basics</h2>
        <Field id="lf-title" label="Title" error={err('title')}><input className="input" {...inp('title')} /></Field>
        <Field id="lf-description" label="Description" error={err('description')}><textarea rows={6} className="input" {...inp('description')} /></Field>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="lf-price" label={v.rental ? 'Monthly rent (CAD)' : 'Price (CAD)'} error={err('price')}><input type="number" min="0" step="1000" className="input" {...inp('price')} /></Field>
          <Field id="lf-type" label="Property type"><select className="input" {...inp('type')}>{PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field id="lf-status" label="Status"><select className="input" {...inp('status')}>{STATUSES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-navy"><input type="checkbox" checked={v.featured} onChange={set('featured')} className="h-5 w-5 accent-[#0B1F3A]" />Featured on home page</label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-navy"><input type="checkbox" checked={v.rental} onChange={set('rental')} className="h-5 w-5 accent-[#0B1F3A]" />This is a rental (price per month)</label>
        </div>
      </section>

      <section className="card space-y-5 p-6" aria-labelledby="lf-loc">
        <h2 id="lf-loc" className="font-serif text-xl font-semibold">Location</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="lf-address" label="Full address" error={err('address')}><input className="input" {...inp('address')} /></Field>
          <Field id="lf-city" label="City / area" error={err('city')}><input className="input" {...inp('city')} /></Field>
          <Field id="lf-lat" label="Latitude" error={err('lat')}><input type="number" step="any" className="input" {...inp('lat')} /></Field>
          <Field id="lf-lng" label="Longitude" error={err('lng')}><input type="number" step="any" className="input" {...inp('lng')} /></Field>
        </div>
        <div>
          <p className="label">Pick on map</p>
          <p className="mb-2 text-xs text-slate-600">Click the map or drag the pin to set the exact location. Latitude and longitude update automatically.</p>
          <MapView
            center={picked ? [picked.lat, picked.lng] : [43.589, -79.6441]} zoom={12} fit={false}
            picked={picked} onPick={({ lat, lng }) => setV((s) => ({ ...s, lat: String(lat), lng: String(lng) }))}
            label="Map location picker" className="h-72 overflow-hidden rounded-card border border-slate-200"
          />
        </div>
      </section>

      <section className="card space-y-5 p-6" aria-labelledby="lf-details">
        <h2 id="lf-details" className="font-serif text-xl font-semibold">Details</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="lf-bedrooms" label="Bedrooms" error={err('bedrooms')}><input type="number" min="0" className="input" {...inp('bedrooms')} /></Field>
          <Field id="lf-bathrooms" label="Bathrooms" error={err('bathrooms')}><input type="number" min="0" className="input" {...inp('bathrooms')} /></Field>
          <Field id="lf-sqft" label="Square feet" error={err('sqft')} hint={isLand ? 'Use 0 for vacant land.' : undefined}><input type="number" min="0" className="input" {...inp('sqft')} /></Field>
          <Field id="lf-lotSize" label="Lot size" hint="e.g. 50 × 120 ft or 0.5 acre"><input className="input" {...inp('lotSize')} /></Field>
          <Field id="lf-yearBuilt" label="Year built"><input type="number" min="1800" max="2100" className="input" {...inp('yearBuilt')} /></Field>
          <Field id="lf-parking" label="Parking spaces"><input type="number" min="0" className="input" {...inp('parking')} /></Field>
        </div>
        <Field id="lf-features" label="Features & amenities" hint="Type a feature and press Enter or comma.">
          <TagInput id="lf-features" value={v.features} onChange={(features) => setV((s) => ({ ...s, features }))} placeholder="e.g. Heated floors" />
        </Field>
      </section>

      <section className="card space-y-4 p-6" aria-labelledby="lf-photos">
        <h2 id="lf-photos" className="font-serif text-xl font-semibold">Photos</h2>
        <ImageManager images={v.images} onChange={(images) => setV((s) => ({ ...s, images }))} error={err('images')} />
      </section>

      <div className="flex justify-end gap-2">
        <Link to="/admin/listings" className="btn-outline">Cancel</Link>
        <button type="submit" disabled={saving} className="btn-gold">{existing ? 'Save changes' : 'Publish listing'}</button>
      </div>
    </form>
  );
}
