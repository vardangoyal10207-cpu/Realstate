import { useStore } from '../context/StoreContext';
import { useSeo } from '../hooks/useSeo';
import SmartImage from '../components/SmartImage';
import SocialLinks from '../components/SocialLinks';
import InquiryForm from '../components/InquiryForm';
import MapView from '../components/MapView';
import { IconCheck, IconMail, IconPhone, IconPin, IconWhatsApp } from '../components/Icons';
import { formatPhone, telHref, whatsappHref } from '../utils/format';

export default function About() {
  const { agent } = useStore();
  useSeo({
    title: `About ${agent.name} & Contact`,
    description: `Meet ${agent.name} of ${agent.agency}: credentials, service areas and how to get in touch for buying, selling or renting in Mississauga and the GTA.`,
    image: agent.photo,
  });

  const officeMarker = [{ id: 'office', lat: agent.office.lat, lng: agent.office.lng, label: agent.agency, title: `${agent.agency} office`, variant: 'gold' }];

  return (
    <>
      <section className="section" aria-labelledby="about-title">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[400px_1fr] lg:gap-16">
          <SmartImage src={agent.photo} alt={`Portrait of ${agent.name}`} eager className="mx-auto aspect-[4/5] w-full max-w-sm rounded-card shadow-lift lg:mx-0 lg:max-w-none" />
          <div>
            <p className="eyebrow">About</p>
            <h1 id="about-title" className="font-serif text-4xl font-semibold md:text-5xl">{agent.name}</h1>
            <p className="mt-2 font-medium text-slate-600">{agent.title} · {agent.agency}</p>
            <p className="mt-6 text-lg leading-relaxed">{agent.bio}</p>

            <dl className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[[agent.stats.homesSold, 'Homes sold'], [agent.stats.years, 'Years experience'], [agent.stats.clients, 'Happy clients']].map(([n, l]) => (
                <div key={l} className="card flex flex-col-reverse p-4"><dd className="font-serif text-3xl font-semibold text-navy">{n}+</dd><dt className="text-xs text-slate-600 sm:text-sm">{l}</dt></div>
              ))}
            </dl>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-serif text-2xl font-semibold">Credentials</h2>
                <ul className="mt-4 space-y-3">
                  {agent.credentials.map((c) => (
                    <li key={c} className="flex items-start gap-2.5"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/25 text-gold-dark"><IconCheck size={14} /></span>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold">Service areas</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {agent.serviceAreas.map((a) => <li key={a} className="chip !text-sm"><IconPin size={14} className="text-gold-dark" />{a}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section bg-cream-200/60" aria-labelledby="contact-title">
        <div className="container-x">
          <div className="mb-10 max-w-xl">
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title" className="h-section">Let’s start a conversation</h2>
            <p className="mt-3">Questions about a listing, selling your home or a market update? Send a note and {agent.name} will get back to you.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card p-6 md:p-8"><InquiryForm title="Send message" idPrefix="contact" /></div>
            <div className="space-y-5">
              <div className="card p-6">
                <ul className="space-y-4">
                  <li><a href={telHref(agent.phone)} className="flex items-center gap-3 font-medium text-navy hover:underline"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-200 text-gold-dark"><IconPhone size={18} /></span>{formatPhone(agent.phone)}</a></li>
                  <li><a href={whatsappHref(agent.whatsapp, `Hi ${agent.name}, I'd like to get in touch.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-medium text-navy hover:underline"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-200 text-gold-dark"><IconWhatsApp size={18} /></span>Chat on WhatsApp</a></li>
                  <li><a href={`mailto:${agent.email}`} className="flex items-center gap-3 break-all font-medium text-navy hover:underline"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-200 text-gold-dark"><IconMail size={18} /></span>{agent.email}</a></li>
                  <li className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-200 text-gold-dark"><IconPin size={18} /></span><span><span className="block font-medium text-navy">{agent.agency}</span>{agent.office.address}</span></li>
                </ul>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="mb-3 text-sm font-medium text-navy">Follow {agent.name}</p>
                  <SocialLinks social={agent.social} />
                </div>
              </div>
              <MapView markers={officeMarker} zoom={14} label="Office location map" className="h-72 overflow-hidden rounded-card shadow-card" scrollWheelZoom={false} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
