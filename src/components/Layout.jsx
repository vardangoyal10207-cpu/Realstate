import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import MobileBar from './MobileBar';
import Navbar from './Navbar';

/** Scrolls to top on page change, or smoothly to #hash targets. Ignores query-string-only changes (live filters). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const prev = useRef(null);
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      prev.current = pathname;
      return () => clearTimeout(t);
    }
    if (prev.current !== pathname) window.scrollTo({ top: 0, behavior: 'instant' });
    prev.current = pathname;
    return undefined;
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-[200] rounded-lg bg-gold px-4 py-2 font-semibold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <ScrollManager />
      <Navbar />
      <main id="main" className="flex-1">
        <div key={pathname} className="animate-fade-up"><Outlet /></div>
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
