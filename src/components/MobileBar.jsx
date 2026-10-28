import { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { IconPhone, IconWhatsApp } from './Icons';
import { propertyUrl, telHref, whatsappHref } from '../utils/format';

/** Sticky Call / WhatsApp bar, mobile only. On a property page the WhatsApp message references that property. */
export default function MobileBar() {
  const { agent, properties } = useStore();
  const match = useMatch('/property/:id');
  const property = match ? properties.find((p) => p.id === match.params.id) : null;

  useEffect(() => {
    document.body.classList.add('has-bottom-bar');
    return () => document.body.classList.remove('has-bottom-bar');
  }, []);

  const text = property
    ? `Hi ${agent.name}, I'm interested in "${property.title}" (${propertyUrl(property.id)}). Is it still available?`
    : `Hi ${agent.name}, I found you on your website and would like to talk about real estate.`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white/95 p-2.5 shadow-[0_-8px_24px_-12px_rgba(11,31,58,.3)] backdrop-blur md:hidden">
      <a href={telHref(agent.phone)} className="btn-primary"><IconPhone size={18} /> Call</a>
      <a href={whatsappHref(agent.whatsapp, text)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><IconWhatsApp size={18} /> WhatsApp</a>
    </div>
  );
}
