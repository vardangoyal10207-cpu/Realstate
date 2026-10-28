import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useListingFilters } from '../hooks/useListingFilters';
import { useSeo } from '../hooks/useSeo';
import { SORTS } from '../data/constants';
import FiltersPanel from '../components/FiltersPanel';
import FilterChips from '../components/FilterChips';
import Drawer from '../components/Drawer';
import PropertyCard, { PropertyCardSkeleton } from '../components/PropertyCard';
import { IconFilter, IconGrid, IconList, IconMap, IconSearch } from '../components/Icons';

export default function Listings() {
  const { filters, results, chips, update, clearAll, query } = useListingFilters();
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const view = params.get('view') === 'list' ? 'list' : 'grid';

  useSeo({
    title: 'Browse Listings',
    description: 'Filter homes, condos, townhouses, villas, land and commercial property across Mississauga and the GTA by price, bedrooms and location.',
  });

  // Brief skeleton on first paint: mirrors the loading state you'll get with a real backend.
  useEffect(() => { const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t); }, []);

  const setView = (v) => setParams((prev) => { const p = new URLSearchParams(prev); if (v === 'grid') p.delete('view'); else p.set('view', v); return p; }, { replace: true });
  const viewBtn = (active) => `flex h-10 items-center gap-1.5 px-3 text-sm font-medium transition ${active ? 'bg-navy text-white' : 'bg-white text-slate-700 hover:bg-cream-200'}`;

  return (
    <div className="container-x py-8 md:py-12">
      <div className="mb-6">
        <p className="eyebrow">Properties</p>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Browse listings</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-5">
            <FiltersPanel filters={filters} update={update} onClear={clearAll} idPrefix="side" />
          </div>
        </aside>

        <section aria-label="Results">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setDrawer(true)} className="btn-outline lg:hidden">
              <IconFilter size={18} /> Filters{chips.length ? ` (${chips.length})` : ''}
            </button>
            <p className="mr-auto text-sm font-medium text-navy" aria-live="polite" role="status">
              {results.length} propert{results.length === 1 ? 'y' : 'ies'} found
            </p>
            <div>
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <select id="sort" className="input !w-auto py-2" value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex overflow-hidden rounded-ctl border border-slate-300" role="group" aria-label="Change view">
              <button type="button" onClick={() => setView('grid')} aria-pressed={view === 'grid'} className={viewBtn(view === 'grid')}><IconGrid size={18} /><span className="hidden sm:inline">Grid</span></button>
              <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'} className={viewBtn(view === 'list')}><IconList size={18} /><span className="hidden sm:inline">List</span></button>
              <Link to={`/map${query ? `?${query}` : ''}`} className={viewBtn(false)}><IconMap size={18} /><span className="hidden sm:inline">Map</span></Link>
            </div>
          </div>

          <FilterChips chips={chips} update={update} onClear={clearAll} />

          <div className="mt-5">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <PropertyCardSkeleton key={i} />)}</div>
            ) : results.length === 0 ? (
              <div className="card flex flex-col items-center px-6 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-navy"><IconSearch size={26} /></span>
                <h2 className="mt-4 font-serif text-2xl font-semibold">No homes match just yet</h2>
                <p className="mt-2 max-w-md text-sm">Try widening your price range, removing a filter or searching a nearby city. New listings are added all the time.</p>
                <button type="button" onClick={clearAll} className="btn-primary mt-6">Clear all filters</button>
              </div>
            ) : (
              <div className={view === 'list' ? 'space-y-5' : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'}>
                {results.map((p) => <PropertyCard key={p.id} property={p} layout={view} />)}
              </div>
            )}
          </div>
        </section>
      </div>

      <Drawer
        open={drawer} onClose={() => setDrawer(false)} title="Filters"
        footer={<button type="button" onClick={() => setDrawer(false)} className="btn-gold w-full">Show {results.length} result{results.length === 1 ? '' : 's'}</button>}
      >
        <FiltersPanel filters={filters} update={update} onClear={clearAll} idPrefix="drawer" />
      </Drawer>
    </div>
  );
}
