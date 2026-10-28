import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { IconHeart } from './Icons';

export default function FavoriteButton({ property, className = '', withLabel = false }) {
  const { favorites, toggleFavorite } = useStore();
  const toast = useToast();
  const active = favorites.includes(property.id);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
    toast(active ? 'Removed from favorites' : 'Saved to favorites', 'info');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${active ? 'Remove' : 'Save'} ${property.title} ${active ? 'from' : 'to'} favorites`}
      className={`inline-flex items-center justify-center gap-2 rounded-full transition duration-200 hover:scale-105 active:scale-95 ${className}`}
    >
      <IconHeart className={active ? 'fill-red-600 stroke-red-600' : ''} />
      {withLabel && <span className="text-sm font-semibold">{active ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
