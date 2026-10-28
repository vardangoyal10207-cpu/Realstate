import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEMO_CREDENTIALS, STORAGE_KEYS } from '../data/constants';
import { seedAgent, seedProperties } from '../data/seed';
import { uid } from '../utils/format';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const sampleInquiries = () => [
  {
    id: 'inq-sample-1', propertyId: 'p-003', propertyTitle: 'Square One Skyline Condo',
    name: 'Daniel Okafor', email: 'daniel@example.com', phone: '+1 416 555 0134',
    message: 'Hi, is this unit still available for a viewing this weekend?', preferredTime: 'Evening (5–9)',
    createdAt: new Date(Date.now() - 36e5 * 5).toISOString(), read: false, replied: false, sample: true,
  },
  {
    id: 'inq-sample-2', propertyId: 'p-001', propertyTitle: 'Modern Lakeview Residence',
    name: 'Hannah Lee', email: 'hannah@example.com', phone: '+1 905 555 0172',
    message: 'We are pre-approved and would like to see the property. Could you share the floor plans?', preferredTime: 'Morning (8–12)',
    createdAt: new Date(Date.now() - 36e5 * 30).toISOString(), read: true, replied: false, sample: true,
  },
];

export function StoreProvider({ children }) {
  const [properties, setProperties] = useLocalStorage(STORAGE_KEYS.properties, seedProperties);
  const [agent, setAgent] = useLocalStorage(STORAGE_KEYS.agent, seedAgent);
  const [inquiries, setInquiries] = useLocalStorage(STORAGE_KEYS.inquiries, sampleInquiries());
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, []);
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(STORAGE_KEYS.session) === '1'; } catch { return false; }
  });

  const addProperty = useCallback(
    (data) => {
      const property = { ...data, id: uid('p'), createdAt: new Date().toISOString(), agentId: agent.id };
      return setProperties((list) => [property, ...list]) ? property : null;
    },
    [setProperties, agent.id],
  );
  const updateProperty = useCallback(
    (id, data) => setProperties((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p))),
    [setProperties],
  );
  const deleteProperty = useCallback(
    (id) => {
      setFavorites((f) => f.filter((x) => x !== id));
      return setProperties((list) => list.filter((p) => p.id !== id));
    },
    [setProperties, setFavorites],
  );

  const updateAgent = useCallback((data) => setAgent((a) => ({ ...a, ...data })), [setAgent]);

  const addInquiry = useCallback(
    (data) => setInquiries((list) => [{ ...data, id: uid('inq'), createdAt: new Date().toISOString(), read: false, replied: false }, ...list]),
    [setInquiries],
  );
  const updateInquiry = useCallback(
    (id, patch) => setInquiries((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i))),
    [setInquiries],
  );
  const deleteInquiry = useCallback((id) => setInquiries((list) => list.filter((i) => i.id !== id)), [setInquiries]);

  const toggleFavorite = useCallback(
    (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    [setFavorites],
  );

  const login = useCallback((email, password) => {
    // DEMO ONLY: client-side check. Replace with real auth (Supabase/Firebase) before launch.
    const ok = email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
    if (ok) {
      try { sessionStorage.setItem(STORAGE_KEYS.session, '1'); } catch { /* private mode */ }
      setAuthed(true);
    }
    return ok;
  }, []);
  const logout = useCallback(() => {
    try { sessionStorage.removeItem(STORAGE_KEYS.session); } catch { /* private mode */ }
    setAuthed(false);
  }, []);

  const resetData = useCallback(() => {
    setProperties(seedProperties);
    setAgent(seedAgent);
    setInquiries(sampleInquiries());
    setFavorites([]);
  }, [setProperties, setAgent, setInquiries, setFavorites]);

  const value = useMemo(
    () => ({
      properties, addProperty, updateProperty, deleteProperty,
      agent, updateAgent,
      inquiries, addInquiry, updateInquiry, deleteInquiry,
      favorites, toggleFavorite,
      authed, login, logout, resetData,
    }),
    [properties, agent, inquiries, favorites, authed, addProperty, updateProperty, deleteProperty, updateAgent,
      addInquiry, updateInquiry, deleteInquiry, toggleFavorite, login, logout, resetData],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
