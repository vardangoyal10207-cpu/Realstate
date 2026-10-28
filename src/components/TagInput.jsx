import { useState } from 'react';
import { IconClose } from './Icons';

/** Type and press Enter or comma to add; Backspace on empty input removes the last tag. */
export default function TagInput({ id, value, onChange, placeholder = 'Type and press Enter' }) {
  const [draft, setDraft] = useState('');
  const add = (raw) => {
    const t = raw.trim().replace(/,$/, '').trim();
    if (t && !value.some((v) => v.toLowerCase() === t.toLowerCase())) onChange([...value, t]);
    setDraft('');
  };
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(draft); }
    else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
  };
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-ctl border border-slate-300 bg-white p-2 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/60">
      {value.map((t) => (
        <span key={t} className="chip !bg-cream">
          {t}
          <button type="button" onClick={() => onChange(value.filter((v) => v !== t))} aria-label={`Remove ${t}`} className="rounded-full p-0.5 hover:bg-navy/10"><IconClose size={13} /></button>
        </span>
      ))}
      <input
        id={id} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} onBlur={() => draft && add(draft)}
        placeholder={value.length ? '' : placeholder}
        className="min-w-[140px] flex-1 border-0 bg-transparent px-1.5 py-1 text-sm text-slate-800 outline-none placeholder:text-slate-500"
      />
    </div>
  );
}
