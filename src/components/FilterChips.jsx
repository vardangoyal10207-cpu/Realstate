import { IconClose } from './Icons';

export default function FilterChips({ chips, update, onClear }) {
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((c) => (
        <span key={c.key} className="chip">
          {c.label}
          <button type="button" onClick={() => update(c.clear)} aria-label={`Remove filter ${c.label}`} className="rounded-full p-0.5 hover:bg-navy/10">
            <IconClose size={14} />
          </button>
        </span>
      ))}
      <button type="button" onClick={onClear} className="px-2 text-sm font-semibold text-gold-dark underline-offset-2 hover:underline">
        Clear all
      </button>
    </div>
  );
}
