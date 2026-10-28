import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { IconClose, IconHeart, IconHome, IconMenu, IconPhone } from './Icons';
import { formatPhone, telHref } from '../utils/format';
import { useEscape } from '../hooks/useLockBodyScroll';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/listings', label: 'Listings' },
  { to: '/map', label: 'Map' },
  { to: '/about', label: 'About', end: true },
];

export default function Navbar() {
  const { agent, favorites } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const toggleRef = useRef(null);

  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEscape(open, () => { setOpen(false); toggleRef.current?.focus(); });

  const link = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition duration-200 ${isActive ? 'bg-navy/5 text-navy' : 'text-slate-700 hover:text-navy'}`;

  return (
    <header className={`sticky top-0 z-50 bg-cream/95 backdrop-blur transition-shadow duration-200 ${scrolled || open ? 'shadow-card' : ''}`}>
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${agent.agency} home`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-gold"><IconHome size={22} /></span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold text-navy">{agent.agency}</span>
            <span className="block text-[11px] font-medium uppercase tracking-[.16em] text-slate-600">with {agent.name}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={link}>{l.label}</NavLink>)}
          <Link to="/about#contact" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-navy">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to="/favorites" aria-label={`Favorites (${favorites.length})`} className="relative flex h-11 w-11 items-center justify-center rounded-full text-navy transition hover:bg-navy/5">
            <IconHeart />
            {favorites.length > 0 && (
              <span className="absolute right-1 top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-navy">{favorites.length}</span>
            )}
          </NavLink>
          <a href={telHref(agent.phone)} className="btn-primary hidden lg:inline-flex"><IconPhone size={16} />{formatPhone(agent.phone)}</a>
          <button
            ref={toggleRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-navy/5 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="animate-fade-in border-t border-slate-200 bg-cream md:hidden">
          <ul className="container-x space-y-1 py-3">
            {[...LINKS, { to: '/about#contact', label: 'Contact' }, { to: '/favorites', label: `Favorites (${favorites.length})` }].map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={({ isActive }) => `block rounded-ctl px-4 py-3 text-base font-medium ${isActive && !l.to.includes('#') ? 'bg-navy text-white' : 'text-navy hover:bg-navy/5'}`}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
