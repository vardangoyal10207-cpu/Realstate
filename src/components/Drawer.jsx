import { useEffect, useRef } from 'react';
import { useEscape, useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { IconClose } from './Icons';

/** Left-hand slide-in drawer used for the mobile filter panel. */
export default function Drawer({ open, onClose, title, children, footer }) {
  const closeRef = useRef(null);
  useLockBodyScroll(open);
  useEscape(open, onClose);
  useEffect(() => { if (open) closeRef.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 animate-fade-in bg-navy/60" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="true" aria-label={title} className="absolute inset-y-0 left-0 flex w-[90%] max-w-sm animate-slide-in flex-col bg-cream shadow-lift">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-serif text-xl font-semibold">{title}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close filters" className="rounded-full p-2 hover:bg-navy/5"><IconClose /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-slate-200 bg-white p-4">{footer}</div>}
      </aside>
    </div>
  );
}
