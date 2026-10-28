import { useState } from 'react';
import { CONTACT_TIMES } from '../data/constants';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { validateInquiry } from '../utils/validation';
import { IconCheck } from './Icons';

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

/** Used on property pages (with `property`) and on the Contact page (general enquiry). */
export default function InquiryForm({ property = null, title = 'Request a viewing', idPrefix = 'inq' }) {
  const { addInquiry, agent } = useStore();
  const toast = useToast();
  const initial = {
    name: '', email: '', phone: '', preferredTime: CONTACT_TIMES[0],
    message: property ? `Hi ${agent.name}, I’m interested in “${property.title}” and would like more information.` : '',
  };
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const set = (k) => (e) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k] || Object.keys(errors).length) setErrors(validateInquiry(next));
  };
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateInquiry(values));
  };
  const show = (k) => (touched[k] || touched.__submit ? errors[k] : undefined);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateInquiry(values);
    setErrors(errs);
    setTouched({ name: true, email: true, phone: true, message: true, __submit: true });
    const firstBad = Object.keys(errs)[0];
    if (firstBad) { document.getElementById(`${idPrefix}-${firstBad}`)?.focus(); return; }
    setStatus('sending');
    // Simulated network latency. Swap for a real API call (see README) when you add a backend.
    setTimeout(() => {
      const saved = addInquiry({
        propertyId: property?.id || null,
        propertyTitle: property?.title || 'General enquiry',
        name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(),
        message: values.message.trim(), preferredTime: values.preferredTime,
      });
      if (!saved) { setStatus('idle'); toast('Could not save your message (browser storage is full). Please call instead.', 'error'); return; }
      setStatus('sent');
    }, 800);
  };

  const reset = () => { setValues(initial); setErrors({}); setTouched({}); setStatus('idle'); };

  if (status === 'sent') {
    return (
      <div className="rounded-card bg-emerald-50 p-6 text-center ring-1 ring-emerald-600/30" role="status">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white"><IconCheck /></span>
        <h3 className="mt-4 font-serif text-2xl font-semibold">Thank you, {values.name.split(' ')[0]}!</h3>
        <p className="mt-2 text-sm text-slate-700">
          Your message has been received. {agent.name} will reach out{values.preferredTime !== CONTACT_TIMES[0] ? ` ${values.preferredTime.toLowerCase()}` : ' shortly'}.
        </p>
        <button type="button" onClick={reset} className="btn-outline mt-5">Send another message</button>
      </div>
    );
  }

  const desc = (k) => (show(k) ? `${idPrefix}-${k}-err` : undefined);

  return (
    <form onSubmit={submit} noValidate className="space-y-4" aria-label={title}>
      <Field id={`${idPrefix}-name`} label="Full name" error={show('name')}>
        <input id={`${idPrefix}-name`} className="input" autoComplete="name" value={values.name} onChange={set('name')} onBlur={blur('name')} aria-invalid={!!show('name')} aria-describedby={desc('name')} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Field id={`${idPrefix}-email`} label="Email" error={show('email')}>
          <input id={`${idPrefix}-email`} type="email" className="input" autoComplete="email" value={values.email} onChange={set('email')} onBlur={blur('email')} aria-invalid={!!show('email')} aria-describedby={desc('email')} />
        </Field>
        <Field id={`${idPrefix}-phone`} label="Phone" error={show('phone')}>
          <input id={`${idPrefix}-phone`} type="tel" className="input" autoComplete="tel" value={values.phone} onChange={set('phone')} onBlur={blur('phone')} aria-invalid={!!show('phone')} aria-describedby={desc('phone')} />
        </Field>
      </div>
      <Field id={`${idPrefix}-preferredTime`} label="Preferred contact time">
        <select id={`${idPrefix}-preferredTime`} className="input" value={values.preferredTime} onChange={set('preferredTime')}>
          {CONTACT_TIMES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field id={`${idPrefix}-message`} label="Message" error={show('message')}>
        <textarea id={`${idPrefix}-message`} rows={4} className="input resize-y" value={values.message} onChange={set('message')} onBlur={blur('message')} aria-invalid={!!show('message')} aria-describedby={desc('message')} />
      </Field>
      <button type="submit" disabled={status === 'sending'} className="btn-gold w-full">
        {status === 'sending' ? (
          <><span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy" aria-hidden="true" /> Sending…</>
        ) : title}
      </button>
      <p className="text-center text-xs text-slate-600">We’ll only use your details to respond to this enquiry.</p>
    </form>
  );
}
