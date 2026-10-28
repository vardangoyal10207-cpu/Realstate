import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { DEFAULT_FILTERS, activeChips, applyFilters, filtersToParams, parseFilters } from '../utils/filters';
import { formatCompactPrice } from '../utils/format';

/**
 * Single source of truth for search filters: the URL query string.
 * Updating a filter rewrites the URL (replace, so Back isn't polluted) and the list re-filters live.
 */
export function useListingFilters() {
  const { properties } = useStore();
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => parseFilters(params), [params]);
  const results = useMemo(() => applyFilters(properties, filters), [properties, filters]);
  const chips = useMemo(() => activeChips(filters, formatCompactPrice), [filters]);

  const update = useCallback(
    (patch) => setParams((prev) => filtersToParams({ ...parseFilters(prev), ...patch }, prev), { replace: true }),
    [setParams],
  );
  const clearAll = useCallback(() => update({ ...DEFAULT_FILTERS, sort: filters.sort }), [update, filters.sort]);

  return { filters, results, chips, update, clearAll, query: params.toString() };
}
