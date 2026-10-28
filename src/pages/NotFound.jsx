import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export default function NotFound({ message = 'The page you’re looking for has moved or doesn’t exist.' }) {
  useSeo({ title: 'Page not found', description: message });
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-8xl font-semibold text-gold-dark md:text-9xl" aria-hidden="true">404</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">We couldn’t find that page</h1>
      <p className="mt-3 max-w-md">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Back to home</Link>
        <Link to="/listings" className="btn-outline">Browse listings</Link>
      </div>
    </section>
  );
}
