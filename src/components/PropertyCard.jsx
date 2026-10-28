import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import SmartImage from './SmartImage';
import StatusBadge from './StatusBadge';
import { IconArea, IconBath, IconBed, IconPin } from './Icons';
import { formatNumber, formatPrice, sized } from '../utils/format';

function Specs({ p }) {
  const hasHome = p.type !== 'Land';
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-700">
      {p.bedrooms > 0 && (
        <li className="flex items-center gap-1.5"><IconBed size={16} className="text-gold-dark" /><span>{p.bedrooms}<span className="sr-only"> bedrooms</span> bd</span></li>
      )}
      {hasHome && p.bathrooms > 0 && (
        <li className="flex items-center gap-1.5"><IconBath size={16} className="text-gold-dark" /><span>{p.bathrooms}<span className="sr-only"> bathrooms</span> ba</span></li>
      )}
      {p.sqft > 0 && (
        <li className="flex items-center gap-1.5"><IconArea size={16} className="text-gold-dark" /><span>{formatNumber(p.sqft)} sqft</span></li>
      )}
      {p.type === 'Land' && <li>{p.lotSize}</li>}
    </ul>
  );
}

export default function PropertyCard({ property: p, layout = 'grid' }) {
  const list = layout === 'list';
  const dim = p.status === 'Sold' || p.status === 'Rented';

  return (
    <article className={`group card relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift ${list ? 'sm:flex' : ''} animate-fade-in`}>
      <div className={`relative ${list ? 'sm:w-72 sm:shrink-0 md:w-80' : ''}`}>
        <Link to={`/property/${p.id}`} tabIndex={-1} aria-hidden="true">
          <SmartImage
            src={sized(p.images[0], 700)}
            alt=""
            fallbackType={p.type}
            className={list ? 'aspect-[4/3] sm:aspect-auto sm:h-full' : 'aspect-[4/3]'}
            imgClassName={`transition duration-500 group-hover:scale-105 ${dim ? 'saturate-50' : ''}`}
          />
        </Link>
        <StatusBadge status={p.status} className="absolute left-3 top-3 shadow" />
        <span className="absolute bottom-3 left-3 rounded-full bg-navy/90 px-2.5 py-1 text-xs font-medium text-white">{p.type}</span>
        <FavoriteButton property={p} className="absolute right-3 top-3 z-10 h-10 w-10 bg-white/95 text-navy shadow hover:bg-white" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-serif text-2xl font-semibold text-navy">{formatPrice(p.price, p.rental)}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug">
          <Link to={`/property/${p.id}`} className="font-sans text-navy after:absolute after:inset-0 hover:text-navy-600 hover:underline">
            {p.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
          <IconPin size={16} className="mt-0.5 shrink-0 text-gold-dark" />
          <span>{p.address}</span>
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4"><Specs p={p} /></div>
        {list && <p className="mt-3 hidden line-clamp-2 text-sm text-slate-600 md:block">{p.description}</p>}
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-6 w-1/3 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}
