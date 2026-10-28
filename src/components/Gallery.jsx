import { useCallback, useEffect, useRef, useState } from 'react';
import SmartImage from './SmartImage';
import { IconChevronLeft, IconChevronRight, IconClose, IconExpand } from './Icons';
import { useEscape, useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { sized } from '../utils/format';

/** Touch swipe: returns handlers to spread on an element. */
function useSwipe(onPrev, onNext) {
  const start = useRef(null);
  return {
    onTouchStart: (e) => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; },
    onTouchEnd: (e) => {
      if (!start.current) return;
      const dx = e.changedTouches[0].clientX - start.current.x;
      const dy = e.changedTouches[0].clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? onNext : onPrev)();
    },
  };
}

function Lightbox({ images, index, setIndex, title, onClose }) {
  const closeRef = useRef(null);
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length, setIndex]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length, setIndex]);
  const swipe = useSwipe(prev, next);
  useLockBodyScroll(true);
  useEscape(true, onClose);

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Tab') {
        const f = [...document.querySelectorAll('[data-lightbox] button')];
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); opener?.focus?.(); };
  }, [prev, next]);

  return (
    <div data-lightbox role="dialog" aria-modal="true" aria-label={`${title} photo viewer`} className="fixed inset-0 z-[100] flex animate-fade-in flex-col bg-black/95 on-navy">
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <p className="text-sm" aria-live="polite">{index + 1} / {images.length}</p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo viewer" className="rounded-full p-2.5 hover:bg-white/10"><IconClose size={24} /></button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" {...swipe}>
        <img src={sized(images[index], 1800)} alt={`${title}, photo ${index + 1} of ${images.length}`} className="max-h-full max-w-full select-none object-contain" draggable={false} />
        {images.length > 1 && (
          <>
            <button type="button" onClick={prev} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-white/30 sm:left-4"><IconChevronLeft size={24} /></button>
            <button type="button" onClick={next} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-white/30 sm:right-4"><IconChevronRight size={24} /></button>
          </>
        )}
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
        {images.map((src, i) => (
          <button key={i} type="button" onClick={() => setIndex(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === index} className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === index ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <img src={sized(src, 160)} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Gallery({ images, title, type, badge }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);
  const swipe = useSwipe(prev, next);

  return (
    <div>
      <div className="group relative overflow-hidden rounded-card shadow-card" {...swipe}>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open fullscreen gallery" className="block w-full">
          <SmartImage src={sized(images[index], 1400)} alt={`${title}, photo ${index + 1} of ${count}`} fallbackType={type} eager className="aspect-[4/3] sm:aspect-[16/10]" />
        </button>
        {badge && <div className="absolute left-4 top-4">{badge}</div>}
        {count > 1 && (
          <>
            <button type="button" onClick={prev} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-navy shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"><IconChevronLeft /></button>
            <button type="button" onClick={next} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-navy shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"><IconChevronRight /></button>
          </>
        )}
        <button type="button" onClick={() => setOpen(true)} className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-navy/90 px-3.5 py-2 text-xs font-semibold text-white hover:bg-navy">
          <IconExpand size={16} /> {count} photo{count === 1 ? '' : 's'}
        </button>
      </div>
      {count > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((src, i) => (
            <button key={i} type="button" onClick={() => setIndex(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === index} className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition duration-200 sm:h-20 sm:w-28 ${i === index ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <img src={sized(src, 240)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {open && <Lightbox images={images} index={index} setIndex={setIndex} title={title} onClose={() => setOpen(false)} />}
    </div>
  );
}
