import { useCallback, useEffect, useRef, useState } from 'react';

function read(key, initial) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? initial : JSON.parse(raw);
  } catch {
    return initial;
  }
}

/**
 * useState backed by localStorage.
 * The setter writes synchronously and returns `false` (leaving state untouched)
 * if the browser refuses the write, e.g. quota exceeded from large uploads.
 * Changes made in other tabs are picked up through the `storage` event.
 */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => read(key, initial));
  const ref = useRef(value);
  ref.current = value;

  const set = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(ref.current) : updater;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        return false;
      }
      ref.current = next;
      setValue(next);
      return true;
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key) setValue(read(key, initial));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set];
}
