import { useState } from 'react';
import { placeholderFor } from '../data/seed';

/** Lazy-loaded image with a shimmering skeleton until it loads, and a graceful fallback on error. */
export default function SmartImage({ src, alt, className = '', imgClassName = '', fallbackType = 'House', eager = false, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = failed ? placeholderFor(fallbackType) : src;

  return (
    <div className={`${/\babsolute\b/.test(className) ? '' : 'relative'} overflow-hidden ${loaded ? '' : 'skeleton'} ${className}`}>
      <img
        key={url}
        src={url}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => (failed ? setLoaded(true) : setFailed(true))}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        {...rest}
      />
    </div>
  );
}
