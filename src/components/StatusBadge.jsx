const STYLES = {
  Available: 'bg-emerald-100 text-emerald-900 ring-emerald-600/30',
  'Under Offer': 'bg-amber-100 text-amber-900 ring-amber-600/30',
  Sold: 'bg-red-100 text-red-900 ring-red-600/30',
  Rented: 'bg-red-100 text-red-900 ring-red-600/30',
};
const DOTS = { Available: 'bg-emerald-600', 'Under Offer': 'bg-amber-500', Sold: 'bg-red-600', Rented: 'bg-red-600' };

export default function StatusBadge({ status, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STYLES[status] || 'bg-slate-100 text-slate-800 ring-slate-300'} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status] || 'bg-slate-500'}`} aria-hidden="true" />
      {status}
    </span>
  );
}
