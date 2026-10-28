import { useEffect } from 'react';

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

/** Sets <title>, description, Open Graph / Twitter tags, canonical URL and optional JSON-LD per page. */
export function useSeo({ title, description, image, jsonLd }) {
  useEffect(() => {
    const full = title ? `${title} | SJR Limited` : 'SJR Limited | Mississauga Real Estate with Vardan';
    document.title = full;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:url', window.location.href);
    if (image) setMeta('property', 'og:image', image);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;

    let script = document.getElementById('seo-jsonld');
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'seo-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
    return () => document.getElementById('seo-jsonld')?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, JSON.stringify(jsonLd)]);
}
