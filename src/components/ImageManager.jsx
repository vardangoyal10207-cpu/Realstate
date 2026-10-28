import { useRef, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { fileToDataUrl } from '../utils/images';
import { sized } from '../utils/format';
import { IconChevronLeft, IconChevronRight, IconClose, IconUpload } from './Icons';

const MAX_IMAGES = 12;

/**
 * Multi-image upload with previews, drag-to-reorder (plus arrow buttons for keyboard users)
 * and a cover-photo selector. The first image is the cover.
 */
export default function ImageManager({ images, onChange, error }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [zoneActive, setZoneActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState('');

  const addFiles = async (fileList) => {
    const files = [...fileList].filter((f) => f.type.startsWith('image/'));
    if (!files.length) { toast('Please choose image files (JPG, PNG, WebP).', 'error'); return; }
    const room = MAX_IMAGES - images.length;
    if (room <= 0) { toast(`You can add up to ${MAX_IMAGES} photos.`, 'error'); return; }
    setBusy(true);
    const added = [];
    for (const f of files.slice(0, room)) {
      try { added.push(await fileToDataUrl(f)); } catch (e) { toast(e.message, 'error'); }
    }
    setBusy(false);
    if (added.length) onChange([...images, ...added]);
    if (files.length > room) toast(`Only the first ${room} photo(s) were added (max ${MAX_IMAGES}).`, 'info');
  };

  const addUrl = () => {
    const u = url.trim();
    if (!/^https?:\/\/.+/i.test(u)) { toast('Enter a full image URL starting with https://', 'error'); return; }
    if (images.length >= MAX_IMAGES) { toast(`You can add up to ${MAX_IMAGES} photos.`, 'error'); return; }
    onChange([...images, u]); setUrl('');
  };

  const move = (from, to) => {
    if (to < 0 || to >= images.length || from === to) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setZoneActive(true); } }}
        onDragLeave={() => setZoneActive(false)}
        onDrop={(e) => { if (e.dataTransfer.files.length) { e.preventDefault(); setZoneActive(false); addFiles(e.dataTransfer.files); } }}
        className={`rounded-card border-2 border-dashed p-6 text-center transition ${zoneActive ? 'border-gold bg-gold/10' : 'border-slate-300 bg-white'}`}
      >
        <IconUpload className="mx-auto text-gold-dark" size={28} />
        <p className="mt-2 text-sm text-slate-700">Drag &amp; drop photos here, or</p>
        <button type="button" className="btn-outline btn-sm mt-2" onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? 'Processing…' : 'Choose files'}</button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" aria-label="Upload photos" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        <p className="mt-2 text-xs text-slate-600">Up to {MAX_IMAGES} photos. Large images are resized automatically.</p>
      </div>

      <div className="mt-3 flex gap-2">
        <label htmlFor="img-url" className="sr-only">Add photo by URL</label>
        <input id="img-url" type="url" className="input" placeholder="…or paste an image URL (https://)" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }} />
        <button type="button" className="btn-outline" onClick={addUrl}>Add</button>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}

      {images.length > 0 && (
        <>
          <p className="mt-4 text-xs text-slate-600">Drag photos to reorder. The first photo is the cover shown on cards.</p>
          <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((src, i) => (
              <li
                key={`${i}-${src.slice(-24)}`}
                draggable
                onDragStart={(e) => { setDragIdx(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); }}
                onDragOver={(e) => { if (dragIdx !== null) { e.preventDefault(); setOverIdx(i); } }}
                onDrop={(e) => { if (dragIdx !== null) { e.preventDefault(); move(dragIdx, i); } setDragIdx(null); setOverIdx(null); }}
                onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                className={`group relative cursor-grab overflow-hidden rounded-ctl border-2 bg-white transition active:cursor-grabbing ${i === 0 ? 'border-gold' : 'border-transparent'} ${overIdx === i && dragIdx !== i ? 'ring-2 ring-navy' : ''} ${dragIdx === i ? 'opacity-40' : ''}`}
              >
                <img src={sized(src, 400)} alt={`Photo ${i + 1}${i === 0 ? ' (cover)' : ''}`} className="aspect-[4/3] w-full object-cover" draggable={false} />
                {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-navy">Cover</span>}
                <button type="button" onClick={() => onChange(images.filter((_, k) => k !== i))} aria-label={`Remove photo ${i + 1}`} className="absolute right-1.5 top-1.5 rounded-full bg-white/95 p-1 text-red-800 shadow hover:bg-white"><IconClose size={14} /></button>
                <div className="flex items-center justify-between gap-1 bg-white p-1.5">
                  <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`} className="rounded p-1 text-navy hover:bg-cream-200 disabled:opacity-30"><IconChevronLeft size={16} /></button>
                  {i !== 0 ? <button type="button" onClick={() => move(i, 0)} className="text-xs font-semibold text-gold-dark hover:underline">Make cover</button> : <span className="text-xs text-slate-500">Cover photo</span>}
                  <button type="button" onClick={() => move(i, i + 1)} disabled={i === images.length - 1} aria-label={`Move photo ${i + 1} later`} className="rounded p-1 text-navy hover:bg-cream-200 disabled:opacity-30"><IconChevronRight size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
