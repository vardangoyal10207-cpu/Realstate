import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import SocialLinks from './SocialLinks';
import { IconHome, IconMail, IconPhone, IconPin } from './Icons';
import { formatPhone, telHref } from '../utils/format';

export default function Footer() {
  const { agent } = useStore();
  const links = [
    ['/', 'Home'], ['/listings', 'Browse listings'], ['/map', 'Map search'], ['/favorites', 'Saved homes'],
    ['/about', 'About ' + agent.name], ['/about#contact', 'Contact'],
  ];
  return (
    <footer className="on-navy mt-auto bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-navy"><IconHome size={22} /></span>
            <span className="font-serif text-xl font-semibold text-white">{agent.agency}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm">Premium real estate guidance across Mississauga and the Greater Toronto Area.</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="font-serif text-lg font-semibold text-white">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map(([to, label]) => <li key={to}><Link to={to} className="hover:text-gold">{label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <h2 className="font-serif text-lg font-semibold text-white">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href={telHref(agent.phone)} className="flex items-center gap-2.5 hover:text-gold"><IconPhone size={16} className="text-gold" />{formatPhone(agent.phone)}</a></li>
            <li><a href={`mailto:${agent.email}`} className="flex items-center gap-2.5 break-all hover:text-gold"><IconMail size={16} className="shrink-0 text-gold" />{agent.email}</a></li>
            <li className="flex items-start gap-2.5"><IconPin size={16} className="mt-0.5 shrink-0 text-gold" />{agent.office.address}</li>
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-lg font-semibold text-white">Follow along</h2>
          <SocialLinks social={agent.social} className="mt-4" linkClassName="bg-white/10 text-white hover:bg-gold hover:text-navy" />
          <p className="mt-6 text-sm"><Link to="/admin" className="text-white/70 underline-offset-2 hover:text-gold hover:underline">Agent login</Link></p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {agent.agency}. All rights reserved.</p>
          <p>Sample listings are fictional and for demonstration only.</p>
        </div>
      </div>
    </footer>
  );
}
