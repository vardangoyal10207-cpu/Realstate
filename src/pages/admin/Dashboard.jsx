import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useSeo } from '../../hooks/useSeo';
import { PROPERTY_TYPES } from '../../data/constants';
import ConfirmModal from '../../components/Modal';
import { formatDateTime } from '../../utils/format';

function Stat({ label, value, hint, tone = 'text-navy' }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className={`mt-1 font-serif text-4xl font-semibold ${tone}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { properties, inquiries, resetData } = useStore();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  useSeo({ title: 'Admin Dashboard' });

  const count = (s) => properties.filter((p) => p.status === s).length;
  const closed = count('Sold') + count('Rented');
  const unread = inquiries.filter((i) => !i.read).length;
  const byType = PROPERTY_TYPES.map((t) => ({ t, n: properties.filter((p) => p.type === t).length }));
  const max = Math.max(1, ...byType.map((x) => x.n));
  const recent = inquiries.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-serif text-3xl font-semibold">Overview</h1><p className="text-sm text-slate-600">A snapshot of your business today.</p></div>
        <Link to="/admin/listings/new" className="btn-gold">+ Add listing</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total listings" value={properties.length} />
        <Stat label="Available" value={count('Available')} hint={`${count('Under Offer')} under offer`} tone="text-emerald-800" />
        <Stat label="Sold / rented" value={closed} tone="text-red-800" />
        <Stat label="New inquiries" value={unread} hint={`${inquiries.length} total`} tone="text-gold-dark" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="card p-6 lg:col-span-3" aria-labelledby="chart-title">
          <h2 id="chart-title" className="font-serif text-xl font-semibold">Listings by type</h2>
          <ul className="mt-5 space-y-3" aria-label="Listings by property type">
            {byType.map(({ t, n }) => (
              <li key={t} className="grid grid-cols-[96px_1fr_28px] items-center gap-3 text-sm">
                <span className="text-slate-700">{t}</span>
                <span className="h-5 overflow-hidden rounded-full bg-cream-200" aria-hidden="true">
                  <span className="block h-full rounded-full bg-navy transition-all duration-500" style={{ width: `${(n / max) * 100}%` }} />
                </span>
                <span className="text-right font-semibold text-navy">{n}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6 lg:col-span-2" aria-labelledby="recent-title">
          <div className="flex items-center justify-between"><h2 id="recent-title" className="font-serif text-xl font-semibold">Recent inquiries</h2><Link to="/admin/inquiries" className="text-sm font-semibold text-gold-dark hover:underline">View all</Link></div>
          {recent.length ? (
            <ul className="mt-4 divide-y divide-slate-100">
              {recent.map((i) => (
                <li key={i.id} className="py-3">
                  <p className="flex items-center gap-2 font-medium text-navy">{!i.read && <span className="h-2 w-2 rounded-full bg-red-600" aria-label="Unread" />}{i.name}</p>
                  <p className="truncate text-sm text-slate-600">{i.propertyTitle}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(i.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : <p className="mt-4 text-sm text-slate-600">No inquiries yet.</p>}
        </section>
      </div>

      <div className="mt-10 rounded-card border border-dashed border-slate-300 p-5 text-sm">
        <p className="font-semibold text-navy">Demo data</p>
        <p className="mt-1 text-slate-600">All data is stored in this browser (localStorage). Reset restores the sample listings, agent profile and inquiries.</p>
        <button type="button" className="btn-outline btn-sm mt-3" onClick={() => setConfirm(true)}>Reset to sample data</button>
      </div>

      <ConfirmModal
        open={confirm} danger title="Reset all data?" confirmLabel="Reset"
        message="This replaces every listing, inquiry, favorite and agent setting with the original sample data."
        onCancel={() => setConfirm(false)}
        onConfirm={() => { resetData(); setConfirm(false); toast('Sample data restored'); }}
      />
    </div>
  );
}
