import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useSeo } from '../../hooks/useSeo';
import SmartImage from '../../components/SmartImage';
import TagInput from '../../components/TagInput';
import { SOCIAL_NETWORKS } from '../../components/SocialLinks';
import { fileToDataUrl } from '../../utils/images';
import { validateAgent } from '../../utils/validation';

function Field({ id, label, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export default function AgentSettings() {
  const { agent, updateAgent } = useStore();
  const toast = useToast();
  const [v, setV] = useState({ ...agent, credentialsText: agent.credentials.join('\n') });
  const [errors, setErrors] = useState({});
  useSeo({ title: 'Agent Profile' });

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const setSocial = (k) => (e) => setV((s) => ({ ...s, social: { ...s.social, [k]: e.target.value } }));
  const setStat = (k) => (e) => setV((s) => ({ ...s, stats: { ...s.stats, [k]: Number(e.target.value) || 0 } }));
  const setOffice = (k) => (e) => setV((s) => ({ ...s, office: { ...s.office, [k]: k === 'address' ? e.target.value : Number(e.target.value) } }));

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { const url = await fileToDataUrl(file, 640, 0.8); setV((s) => ({ ...s, photo: url })); }
    catch (err) { toast(err.message, 'error'); }
    e.target.value = '';
  };

  const save = (e) => {
    e.preventDefault();
    const errs = validateAgent(v);
    setErrors(errs);
    if (Object.keys(errs).length) { toast('Please fix the highlighted fields', 'error'); return; }
    const { credentialsText, ...rest } = v;
    const ok = updateAgent({ ...rest, credentials: credentialsText.split('\n').map((s) => s.trim()).filter(Boolean) });
    toast(ok === false ? 'Could not save: browser storage is full. Try a smaller photo.' : 'Profile saved. The public site is updated.', ok === false ? 'error' : 'success');
  };

  return (
    <form onSubmit={save} noValidate className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-serif text-3xl font-semibold">Agent profile</h1><p className="text-sm text-slate-600">Changes appear on the public site instantly.</p></div>
        <button type="submit" className="btn-gold">Save changes</button>
      </div>

      <section className="card space-y-5 p-6" aria-labelledby="ap-basic">
        <h2 id="ap-basic" className="font-serif text-xl font-semibold">Basics</h2>
        <div className="flex flex-wrap items-center gap-5">
          <SmartImage src={v.photo} alt="Current agent photo" className="h-24 w-24 rounded-full" />
          <div className="min-w-[220px] flex-1 space-y-2">
            <Field id="ap-photo" label="Photo URL"><input id="ap-photo" className="input" value={v.photo.startsWith('data:') ? '(uploaded image)' : v.photo} onChange={set('photo')} readOnly={v.photo.startsWith('data:')} /></Field>
            <label className="btn-outline btn-sm cursor-pointer">Upload photo<input type="file" accept="image/*" className="sr-only" onChange={upload} /></label>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="ap-name" label="Name" error={errors.name}><input id="ap-name" className="input" value={v.name} onChange={set('name')} aria-invalid={!!errors.name} /></Field>
          <Field id="ap-agency" label="Agency"><input id="ap-agency" className="input" value={v.agency} onChange={set('agency')} /></Field>
          <Field id="ap-title" label="Title / tagline"><input id="ap-title" className="input" value={v.title} onChange={set('title')} /></Field>
          <Field id="ap-email" label="Email" error={errors.email}><input id="ap-email" type="email" className="input" value={v.email} onChange={set('email')} aria-invalid={!!errors.email} /></Field>
          <Field id="ap-phone" label="Phone" error={errors.phone} hint="Include country code, e.g. +1-2269950000"><input id="ap-phone" type="tel" className="input" value={v.phone} onChange={set('phone')} aria-invalid={!!errors.phone} /></Field>
          <Field id="ap-wa" label="WhatsApp number" error={errors.whatsapp} hint="Used for the Chat on WhatsApp buttons"><input id="ap-wa" type="tel" className="input" value={v.whatsapp} onChange={set('whatsapp')} aria-invalid={!!errors.whatsapp} /></Field>
        </div>
        <Field id="ap-bio" label="Bio"><textarea id="ap-bio" rows={5} className="input" value={v.bio} onChange={set('bio')} /></Field>
      </section>

      <section className="card space-y-5 p-6" aria-labelledby="ap-about">
        <h2 id="ap-about" className="font-serif text-xl font-semibold">About page &amp; stats</h2>
        <Field id="ap-cred" label="Credentials (one per line)"><textarea id="ap-cred" rows={4} className="input" value={v.credentialsText} onChange={set('credentialsText')} /></Field>
        <Field id="ap-areas" label="Service areas"><TagInput id="ap-areas" value={v.serviceAreas} onChange={(serviceAreas) => setV((s) => ({ ...s, serviceAreas }))} placeholder="Add an area and press Enter" /></Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="ap-s1" label="Homes sold"><input id="ap-s1" type="number" min="0" className="input" value={v.stats.homesSold} onChange={setStat('homesSold')} /></Field>
          <Field id="ap-s2" label="Years of experience"><input id="ap-s2" type="number" min="0" className="input" value={v.stats.years} onChange={setStat('years')} /></Field>
          <Field id="ap-s3" label="Happy clients"><input id="ap-s3" type="number" min="0" className="input" value={v.stats.clients} onChange={setStat('clients')} /></Field>
        </div>
        <Field id="ap-addr" label="Office address"><input id="ap-addr" className="input" value={v.office.address} onChange={setOffice('address')} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="ap-lat" label="Office latitude"><input id="ap-lat" type="number" step="any" className="input" value={v.office.lat} onChange={setOffice('lat')} /></Field>
          <Field id="ap-lng" label="Office longitude"><input id="ap-lng" type="number" step="any" className="input" value={v.office.lng} onChange={setOffice('lng')} /></Field>
        </div>
      </section>

      <section className="card space-y-5 p-6" aria-labelledby="ap-social">
        <h2 id="ap-social" className="font-serif text-xl font-semibold">Social links</h2>
        <p className="-mt-3 text-sm text-slate-600">Leave blank to hide an icon.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {SOCIAL_NETWORKS.map(({ key, label }) => (
            <Field key={key} id={`ap-soc-${key}`} label={label} error={errors[`social.${key}`]}>
              <input id={`ap-soc-${key}`} type="url" placeholder="https://" className="input" value={v.social[key] || ''} onChange={setSocial(key)} aria-invalid={!!errors[`social.${key}`]} />
            </Field>
          ))}
        </div>
      </section>

      <div className="flex justify-end"><button type="submit" className="btn-gold">Save changes</button></div>
    </form>
  );
}
