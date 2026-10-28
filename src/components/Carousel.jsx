import { useRef } from 'react';
import { IconChevronLeft, IconChevronRight } from './Icons';

/** Scroll-snap carousel: swipe on touch devices, arrow buttons and keyboard on desktop. */
export default function Carousel({ children, label }) {
  const ref = useRef(null);
  const by = (dir) => {
    const el = ref.current;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };
  const btn = 'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lift transition hover:bg-navy hover:text-white md:flex';
  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <button type="button" onClick={() => by(-1)} aria-label="Previous listings" className={`${btn} -left-5`}><IconChevronLeft /></button>
      <div ref={ref} tabIndex={0} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-6 pt-1 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&>*]:shrink-0 [&>*]:snap-start [&>*]:basis-[85%] sm:[&>*]:basis-[calc(50%-10px)] lg:[&>*]:basis-[calc(33.333%-14px)]">
        {children}
      </div>
      <button type="button" onClick={() => by(1)} aria-label="Next listings" className={`${btn} -right-5`}><IconChevronRight /></button>
    </div>
  );
}
