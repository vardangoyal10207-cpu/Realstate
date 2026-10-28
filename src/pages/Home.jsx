import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';
import { useInView } from '../hooks/useInView';
import { PROPERTY_TYPES, TYPE_IMAGES } from '../data/constants';
import { ABOUT_IMAGE, CTA_IMAGE, HERO_IMAGE, testimonials, unsplash } from '../data/seed';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import Carousel from '../components/Carousel';
import SmartImage from '../components/SmartImage';
import { IconPhone, IconQuote, IconStar, IconWhatsApp } from '../components/Icons';
import { formatPhone, telHref, whatsappHref } from '../utils/format';
import { useEffect, useState } from 'react';

function CountUp({ to, suffix = '' }) {
  const [ref, seen] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(to); return undefined; }
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 1200);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n.toLocaleString('en-CA')}{suffix}</span>;
}

export default function Home() {
  const { properties, agent } = useStore();
  useSeo({
    description: `Browse homes, condos and townhouses for sale and rent in Mississauga, Oakville, Brampton and the GTA with ${agent.name} of ${agent.agency}.`,
    image: HERO_IMAGE,
  });

  const featured = properties.filter((p) => p.featured);
  const counts = Object.fromEntries(PROPERTY_TYPES.map((t) => [t, properties.filter((p) => p.type === t).length]));

  return (
    <>
      {/* Hero */}
      <section className="on-navy relative isolate overflow-hidden bg-navy text-white" aria-labelledby="hero-title">
        <SmartImage src={HERO_IMAGE} alt="" eager className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/85" />
        <div className="container-x py-16 sm:py-24 lg:py-32">
          <p className="eyebrow !text-gold">Mississauga · Oakville · Brampton · GTA</p>
          <h1 id="hero-title" className="max-w-3xl text-4xl font-semibold leading-[1.1] !text-white sm:text-5xl lg:text-6xl">
            Find the home that fits your life, <span className="text-gold">not just your budget.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/90 sm:text-lg">
            Personal, honest guidance from {agent.name} at {agent.agency}, from first viewing to final handshake.
          </p>
          <div className="mt-10 max-w-6xl"><SearchBar /></div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Track record" className="border-b border-slate-200 bg-white">
        <dl className="container-x grid grid-cols-1 divide-y divide-slate-200 py-2 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-8">
          {[
            [agent.stats.homesSold, '+', 'Homes sold'],
            [agent.stats.years, '+', 'Years of experience'],
            [agent.stats.clients, '+', 'Happy clients'],
          ].map(([n, s, label]) => (
            <div key={label} className="flex flex-col px-4 py-5 sm:py-0">
              <dt className="order-2 mt-1 text-sm font-medium text-slate-600">{label}</dt>
              <dd className="font-serif text-4xl font-semibold text-navy md:text-5xl"><CountUp to={Number(n)} suffix={s} /></dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Featured */}
      <section className="section" aria-labelledby="featured-title">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Hand-picked</p>
              <h2 id="featured-title" className="h-section">Featured listings</h2>
            </div>
            <Link to="/listings" className="btn-outline">View all listings</Link>
          </div>
          {featured.length ? (
            <Carousel label="Featured listings">
              {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
            </Carousel>
          ) : (
            <p className="rounded-card bg-white p-8 text-center text-slate-600">No featured listings yet. Mark a listing as featured in the admin dashboard.</p>
          )}
        </div>
      </section>

      {/* Types */}
      <section className="section bg-cream-200/60" aria-labelledby="types-title">
        <div className="container-x">
          <div className="mb-8 max-w-xl">
            <p className="eyebrow">Explore</p>
            <h2 id="types-title" className="h-section">Browse by property type</h2>
          </div>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PROPERTY_TYPES.map((t) => (
              <li key={t}>
                <Link to={`/listings?type=${t}`} className="group relative block aspect-[4/5] overflow-hidden rounded-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:aspect-square">
                  <SmartImage src={unsplash(TYPE_IMAGES[t], 600)} alt="" className="absolute inset-0 h-full w-full" imgClassName="transition duration-500 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <span className="block font-serif text-xl font-semibold">{t === 'Land' ? 'Land' : `${t}${t.endsWith('s') ? '' : 's'}`}</span>
                    <span className="text-sm text-white/90">{counts[t]} listing{counts[t] === 1 ? '' : 's'}</span>
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link to="/map" className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-card bg-navy p-4 text-center text-white shadow-card transition duration-300 hover:-translate-y-1 hover:bg-navy-700 sm:aspect-square">
                <span className="font-serif text-xl font-semibold text-gold">Search by map</span>
                <span className="text-sm text-white/90">See every listing on the map</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Agent intro */}
      <section className="section" aria-labelledby="agent-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <SmartImage src={agent.photo} alt={`Portrait of ${agent.name}, real estate agent at ${agent.agency}`} className="mx-auto aspect-[4/5] w-full max-w-md rounded-card shadow-lift lg:mx-0" />
          <div>
            <p className="eyebrow">Meet your agent</p>
            <h2 id="agent-title" className="h-section">Hi, I’m {agent.name}.</h2>
            <p className="mt-2 text-sm font-medium text-slate-600">{agent.title}</p>
            <p className="mt-5 text-base leading-relaxed">{agent.bio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/about" className="btn-primary">More about {agent.name}</Link>
              <Link to="/about#contact" className="btn-outline">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section on-navy bg-navy" aria-labelledby="testi-title">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <p className="eyebrow">Client stories</p>
            <h2 id="testi-title" className="font-serif text-3xl font-semibold !text-white md:text-4xl">Trusted by families across the GTA</h2>
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.name} className="rounded-card bg-white/[.07] p-6 ring-1 ring-white/10">
                <IconQuote className="text-gold" size={28} />
                <div className="mt-3 flex gap-0.5 text-gold" role="img" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <IconStar key={i} size={16} />)}</div>
                <blockquote className="mt-3 text-[15px] leading-relaxed text-white/90">“{t.quote}”</blockquote>
                <p className="mt-5 font-semibold text-white">{t.name}</p>
                <p className="text-sm text-white/70">{t.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="on-navy relative isolate overflow-hidden text-white" aria-labelledby="cta-title">
        <SmartImage src={CTA_IMAGE} alt="" className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-navy/80" />
        <div className="container-x py-16 text-center md:py-24">
          <h2 id="cta-title" className="mx-auto max-w-2xl font-serif text-3xl font-semibold !text-white md:text-5xl">Ready to make your next move?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">Whether you’re buying, selling or just curious about your home’s value, let’s talk. No pressure, just a clear plan.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={telHref(agent.phone)} className="btn-gold"><IconPhone size={18} /> Call {formatPhone(agent.phone)}</a>
            <a href={whatsappHref(agent.whatsapp, `Hi ${agent.name}, I'd like to talk about buying or selling a home.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><IconWhatsApp size={18} /> Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
