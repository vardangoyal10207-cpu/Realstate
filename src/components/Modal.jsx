import { useEffect, useRef } from 'react';
import { useEscape, useLockBodyScroll } from '../hooks/useLockBodyScroll';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  useLockBodyScroll(open);
  useEscape(open, onCancel);
  useEffect(() => { if (open) cancelRef.current?.focus(); }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-navy/60 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div role="alertdialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc" className="relative w-full max-w-md animate-fade-up rounded-card bg-white p-6 shadow-lift">
        <h2 id="modal-title" className="font-serif text-2xl font-semibold">{title}</h2>
        <p id="modal-desc" className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} className="btn-outline">Cancel</button>
          <button type="button" onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
