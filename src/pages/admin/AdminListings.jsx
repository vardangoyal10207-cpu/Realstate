import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useSeo } from '../../hooks/useSeo';
import { STATUSES } from '../../data/constants';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/Modal';
import SmartImage from '../../components/SmartImage';
import { IconEdit, IconStar, IconTrash } from '../../components/Icons';
import { formatPrice, sized } from '../../utils/format';

export default function AdminListings() {
  const { properties, deleteProperty } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [target, setTarget] = useState(null);
  useSeo({ title: 'Manage Listings' });

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = properties.filter((p) => (!status || p.status === status) && (!s || `${p.title} ${p.address} ${p.city} ${p.type}`.toLowerCase().includes(s)));
    const by = {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      title: (a, b) => a.title.localeCompare(b.title),
    }[sort];
    return [...list].sort(by);
  }, [properties, q, status, sort]);

  const confirmDelete = () => {
    deleteProperty(target.id);
    toast(`Deleted “${target.title}”`);
    setTarget(null);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-serif text-3xl font-semibold">Listings</h1><p className="text-sm text-slate-600">{rows.length} of {properties.length} shown</p></div>
        <Link to="/admin/listings/new" className="btn-gold">+ Add listing</Link>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div><label htmlFor="al-q" className="sr-only">Search listings</label><input id="al-q" type="search" placeholder="Search title, address, city…" className="input" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div><label htmlFor="al-status" className="sr-only">Filter by status</label>
          <select id="al-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label htmlFor="al-sort" className="sr-only">Sort</label>
          <select id="al-sort" className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="title">Title A–Z</option>
          </select></div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Property listings</caption>
          <thead className="border-b border-slate-200 bg-cream text-xs uppercase tracking-wide text-slate-600">
            <tr><th scope="col" className="p-4">Property</th><th scope="col" className="p-4">Price</th><th scope="col" className="p-4">Status</th><th scope="col" className="p-4">Type</th><th scope="col" className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-cream/60">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <SmartImage src={sized(p.images[0], 160)} alt="" fallbackType={p.type} className="h-12 w-16 shrink-0 rounded-lg" />
                    <div className="min-w-0">
                      <Link to={`/property/${p.id}`} className="flex items-center gap-1.5 font-semibold text-navy hover:underline">{p.title}{p.featured && <IconStar size={14} className="text-gold" aria-label="Featured" />}</Link>
                      <p className="truncate text-xs text-slate-600">{p.address}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap p-4 font-semibold text-navy">{formatPrice(p.price, p.rental)}</td>
                <td className="p-4"><StatusBadge status={p.status} /></td>
                <td className="p-4">{p.type}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/listings/${p.id}`} className="btn-outline btn-sm" aria-label={`Edit ${p.title}`}><IconEdit size={15} /> Edit</Link>
                    <button type="button" onClick={() => setTarget(p)} className="btn-outline btn-sm !text-red-800 hover:!border-red-700" aria-label={`Delete ${p.title}`}><IconTrash size={15} /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-slate-600">No listings match your search.</td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!target} danger title="Delete this listing?" confirmLabel="Delete listing"
        message={target ? `“${target.title}” will be permanently removed from the website. This can’t be undone.` : ''}
        onCancel={() => setTarget(null)} onConfirm={confirmDelete}
      />
    </div>
  );
}
