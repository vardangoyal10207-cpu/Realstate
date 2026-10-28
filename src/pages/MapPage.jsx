import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListingFilters } from '../hooks/useListingFilters';
import { useSeo } from '../hooks/useSeo';
import FiltersPanel from '../components/FiltersPanel';
import FilterChips from '../components/FilterChips';
import Drawer from '../components/Drawer';
import MapView, { propertyMarker } from '../components/MapView';
import { IconFilter, IconList } from '../components/Icons';

export default function MapPage() {
  const { filters, results, chips, update, clearAll, query } = useListingFilters();
  const [drawer, setDrawer] = useState(false);
  useSeo({ title: 'Map Search', description: 'Explore every listing on an interactive map of Mississauga and the Greater Toronto Area.' });

  const markers = results.map((p) => propertyMarker(p));

  return (
    <div className="flex h-[calc(100dvh-64px-68px)] md:h-[calc(100dvh-72px)]">
      <aside aria-label="Filters" className="hidden w-[340px] shrink-0 overflow-y-auto border-r border-slate-200 bg-cream p-5 lg:block">
        <h1 className="mb-5 font-serif text-2xl font-semibold">Map search</h1>
        <FiltersPanel filters={filters} update={update} onClear={clearAll} idPrefix="map" />
      </aside>

      <div className="relative min-w-0 flex-1">
        <MapView markers={markers} cluster label="Map of listings" className="absolute inset-0 !min-h-0" />

        <div className="pointer-events-none absolute inset-x-3 top-3 z-[400] flex flex-wrap items-start gap-2">
          <button type="button" onClick={() => setDrawer(true)} className="btn-primary pointer-events-auto shadow-lift lg:hidden"><IconFilter size={18} /> Filters{chips.length ? ` (${chips.length})` : ''}</button>
          <p className="pointer-events-auto rounded-ctl bg-white px-3.5 py-2.5 text-sm font-semibold text-navy shadow-lift" role="status" aria-live="polite">
            {results.length} propert{results.length === 1 ? 'y' : 'ies'} on map
          </p>
          <Link to={`/listings${query ? `?${query}` : ''}`} className="btn-outline pointer-events-auto ml-auto shadow-lift"><IconList size={18} /> List view</Link>
        </div>
        {chips.length > 0 && (
          <div className="pointer-events-none absolute bottom-4 left-3 right-3 z-[400] hidden lg:block">
            <div className="pointer-events-auto inline-block max-w-full rounded-ctl bg-white/95 p-2.5 shadow-lift"><FilterChips chips={chips} update={update} onClear={clearAll} /></div>
          </div>
        )}
        {results.length === 0 && (
          <div className="absolute inset-0 z-[401] flex items-center justify-center p-6">
            <div className="card max-w-sm p-6 text-center">
              <h2 className="font-serif text-xl font-semibold">No listings in this search</h2>
              <p className="mt-2 text-sm">Try loosening your filters to see more homes on the map.</p>
              <button type="button" onClick={clearAll} className="btn-primary mt-4">Clear all filters</button>
            </div>
          </div>
        )}
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filters" footer={<button type="button" onClick={() => setDrawer(false)} className="btn-gold w-full">Show {results.length} on map</button>}>
        <FiltersPanel filters={filters} update={update} onClear={clearAll} idPrefix="mapdrawer" />
      </Drawer>
    </div>
  );
}
