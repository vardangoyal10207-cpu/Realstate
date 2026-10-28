import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';
import PropertyCard from '../components/PropertyCard';
import { IconHeart } from '../components/Icons';

export default function Favorites() {
  const { properties, favorites } = useStore();
  useSeo({ title: 'Saved Homes', description: 'Your saved listings.' });
  const saved = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="container-x py-8 md:py-12">
      <p className="eyebrow">Your shortlist</p>
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Saved homes</h1>
      <p className="mt-2 text-sm text-slate-600">Saved on this device. Tap the heart on any listing to add or remove it.</p>
      <div className="mt-8">
        {saved.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{saved.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
        ) : (
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-navy"><IconHeart size={26} /></span>
            <h2 className="mt-4 font-serif text-2xl font-semibold">Nothing saved yet</h2>
            <p className="mt-2 max-w-md text-sm">Found a place you love? Tap the heart on a listing and it will wait for you here.</p>
            <Link to="/listings" className="btn-primary mt-6">Browse listings</Link>
          </div>
        )}
      </div>
    </div>
  );
}
