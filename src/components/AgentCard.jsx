import { useStore } from '../context/StoreContext';
import SmartImage from './SmartImage';
import SocialLinks from './SocialLinks';
import { IconMail, IconPhone } from './Icons';
import { formatPhone, telHref } from '../utils/format';

export default function AgentCard({ className = '' }) {
  const { agent } = useStore();
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center gap-4">
        <SmartImage src={agent.photo} alt={`Portrait of ${agent.name}`} className="h-16 w-16 shrink-0 rounded-full" />
        <div className="min-w-0">
          <p className="font-serif text-xl font-semibold text-navy">{agent.name}</p>
          <p className="text-sm text-slate-600">{agent.agency}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        <li><a href={telHref(agent.phone)} className="flex items-center gap-2.5 text-slate-700 hover:text-navy"><IconPhone size={16} className="text-gold-dark" />{formatPhone(agent.phone)}</a></li>
        <li><a href={`mailto:${agent.email}`} className="flex items-center gap-2.5 break-all text-slate-700 hover:text-navy"><IconMail size={16} className="shrink-0 text-gold-dark" />{agent.email}</a></li>
      </ul>
      <SocialLinks social={agent.social} className="mt-4" />
    </div>
  );
}
