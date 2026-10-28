import { useId, useMemo, useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { IconPin, IconSearch } from './Icons';

/** Text input with ARIA combobox autocomplete over cities, addresses and listing titles. */
export default function LocationInput({ value, onChange, placeholder = 'City, neighbourhood or address', id, className = '', inputClassName = '' }) {
  const { properties } = useStore();
  const uid = useId();
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrap = useRef(null);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    const cities = [...new Set(properties.map((p) => p.city))].map((c) => ({ text: c, kind: 'City' }));
    const streets = properties.flatMap((p) => [
      { text: p.address, kind: 'Address' },
      { text: p.title, kind: 'Listing' },
    ]);
    const pool = q ? [...cities, ...streets] : cities;
    const seen = new Set();
    return pool
      .filter((s) => (!q || s.text.toLowerCase().includes(q)) && s.text.toLowerCase() !== q && !seen.has(s.text) && seen.add(s.text))
      .slice(0, 7);
  }, [properties, value]);

  const choose = (s) => { onChange(s.text); setOpen(false); setActive(-1); };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => (a + 1) % Math.max(suggestions.length, 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1)); }
    else if (e.key === 'Enter' && open && active >= 0 && suggestions[active]) { e.preventDefault(); choose(suggestions[active]); }
    else if (e.key === 'Escape') { setOpen(false); setActive(-1); }
  };

  return (
    <div
      ref={wrap}
      className={`relative ${className}`}
      onBlur={(e) => { if (!wrap.current.contains(e.relatedTarget)) { setOpen(false); setActive(-1); } }}
    >
      <IconSearch size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${uid}-opt-${active}` : undefined}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={`input pl-10 ${inputClassName}`}
      />
      {open && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-ctl border border-slate-200 bg-white py-1 shadow-lift">
          {suggestions.map((s, i) => (
            <li
              key={s.text}
              id={`${uid}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(s)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-2.5 px-3.5 py-2 text-sm text-slate-800 ${i === active ? 'bg-cream-200' : ''}`}
            >
              <IconPin size={15} className="shrink-0 text-gold-dark" />
              <span className="flex-1 truncate">{s.text}</span>
              <span className="text-xs text-slate-500">{s.kind}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
