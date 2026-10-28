import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';
import Gallery from '../components/Gallery';
import StatusBadge from '../components/StatusBadge';
import FavoriteButton from '../components/FavoriteButton';
import MortgageCalc from '../components/MortgageCalc';
import InquiryForm from '../components/InquiryForm';
import AgentCard from '../components/AgentCard';
import ShareButtons from '../components/ShareButtons';
import MapView, { propertyMarker } from '../components/MapView';
import PropertyCard from '../components/PropertyCard';
import NotFound from './NotFound';
import { IconArea, IconBath, IconBed, IconCalendar, IconCar, IconCheck, IconLot, IconPhone, IconPin, IconWhatsApp } from '../components/Icons';
import { formatNumber, formatPhone, formatPrice, propertyUrl, telHref, whatsappHref } from '../utils/format';
import { distanceKm } from '../utils/filters';

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-ctl bg-cream p-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gold-dark shadow-sm"><Icon size={20} /></span>
      <div><dt className="text-xs text-slate-600">{label}</dt><dd className="font-semibold text-navy">{value}</dd></div>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties, agent } = useStore();
  const p = properties.find((x) => x.id === id);

  const nearby = useMemo(() => {
    if (!p) return [];
    return properties
      .filter((x) => x.id !== p.id)
      .map((x) => ({ x, d: distanceKm(p, x) }))
      .filter(({ d }) => d <= 15)
      .sort((a, b) => a.d - b.d)
      .slice(0, 6)
      .map(({ x }) => x);
  }, [p, properties]);

  const similar = useMemo(() => {
    if (!p) return [];
    const score = (x) => (x.type === p.type ? 2 : 0) + (x.city === p.city ? 1 : 0);
    return properties.filter((x) => x.id !== p.id && score(x) > 0).sort((a, b) => score(b) - score(a)).slice(0, 3);
  }, [p, properties]);

  useSeo({
    title: p ? `${p.title}, ${p.city}` : 'Property not found',
    description: p ? `${p.title}: ${formatPrice(p.price, p.rental)}. ${p.description.slice(0, 140)}…` : undefined,
    image: p?.images[0],
    jsonLd: p && {
      '@context': 'https://schema.org', '@type': 'RealEstateListing', name: p.title, description: p.description,
      url: propertyUrl(p.id), image: p.images,
      offers: { '@type': 'Offer', price: p.price, priceCurrency: 'CAD' },
      address: { '@type': 'PostalAddress', streetAddress: p.address, addressLocality: p.city, addressCountry: 'CA' },
    },
  });

  if (!p) return <NotFound message="That listing may have been sold or removed." />;

  const url = propertyUrl(p.id);
  const wa = whatsappHref(agent.whatsapp, `Hi ${agent.name}, I'm interested in "${p.title}" (${url}). Is it still available?`);
  const markers = [propertyMarker(p, 'gold'), ...nearby.map((x) => propertyMarker(x))];
  const isLand = p.type === 'Land';

  return (
    <article className="container-x py-6 md:py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-slate-600">
          <li><Link to="/" className="hover:text-navy hover:underline">Home</Link></li><li aria-hidden="true">/</li>
          <li><Link to="/listings" className="hover:text-navy hover:underline">Listings</Link></li><li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-navy">{p.title}</li>
        </ol>
      </nav>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2"><StatusBadge status={p.status} /><span className="text-sm text-slate-600">{p.type}{p.rental ? ' · For rent' : ''}</span></div>
          <h1 className="font-serif text-3xl font-semibold md:text-4xl">{p.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-slate-700"><IconPin size={18} className="text-gold-dark" />{p.address}</p>
        </div>
        <div className="text-right">
          <p className="font-serif text-3xl font-semibold text-navy md:text-4xl">{formatPrice(p.price, p.rental)}</p>
          <FavoriteButton property={p} withLabel className="mt-2 border border-slate-300 bg-white px-4 py-2 text-navy hover:border-navy" />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-10">
          <Gallery images={p.images} title={p.title} type={p.type} />

          <section aria-labelledby="facts-title">
            <h2 id="facts-title" className="sr-only">Key features</h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {!isLand && p.bedrooms > 0 && <Fact icon={IconBed} label="Bedrooms" value={p.bedrooms} />}
              {!isLand && p.bathrooms > 0 && <Fact icon={IconBath} label="Bathrooms" value={p.bathrooms} />}
              {p.sqft > 0 && <Fact icon={IconArea} label="Living area" value={`${formatNumber(p.sqft)} sqft`} />}
              {p.lotSize && p.lotSize !== '—' && <Fact icon={IconLot} label="Lot size" value={p.lotSize} />}
              {p.yearBuilt && <Fact icon={IconCalendar} label="Year built" value={p.yearBuilt} />}
              <Fact icon={IconCar} label="Parking" value={p.parking ? `${p.parking} space${p.parking === 1 ? '' : 's'}` : 'None'} />
            </dl>
          </section>

          <section aria-labelledby="desc-title">
            <h2 id="desc-title" className="font-serif text-2xl font-semibold">About this property</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed">{p.description}</p>
          </section>

          {p.features.length > 0 && (
            <section aria-labelledby="amen-title">
              <h2 id="amen-title" className="font-serif text-2xl font-semibold">Amenities &amp; features</h2>
              <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-800">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"><IconCheck size={14} /></span>{f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!p.rental && p.status !== 'Sold' && <MortgageCalc price={p.price} />}

          <section aria-labelledby="loc-title">
            <h2 id="loc-title" className="font-serif text-2xl font-semibold">Location</h2>
            <p className="mt-1 text-sm text-slate-600">Gold pin: this property. Navy pins: other listings within 15 km.</p>
            <MapView key={p.id} markers={markers} zoom={14} label={`Map showing ${p.title}`} className="mt-4 h-[360px] overflow-hidden rounded-card shadow-card" scrollWheelZoom={false} />
          </section>

          <ShareButtons url={url} title={p.title} />
        </div>

        <aside aria-label="Contact" className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-serif text-2xl font-semibold">Interested in this home?</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={telHref(agent.phone)} className="btn-primary" aria-label={`Call ${formatPhone(agent.phone)}`}><IconPhone size={18} /> Call</a>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><IconWhatsApp size={18} /> WhatsApp</a>
              </div>
              <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-500"><span className="h-px flex-1 bg-slate-200" />or send a message<span className="h-px flex-1 bg-slate-200" /></div>
              <InquiryForm property={p} idPrefix="pd" />
            </div>
            <AgentCard />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16" aria-labelledby="similar-title">
          <h2 id="similar-title" className="h-section mb-6">Similar properties</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <PropertyCard key={s.id} property={s} />)}</div>
        </section>
      )}
    </article>
  );
}
