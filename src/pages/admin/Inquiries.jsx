import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useSeo } from '../../hooks/useSeo';
import ConfirmModal from '../../components/Modal';
import { IconMail, IconPhone, IconTrash } from '../../components/Icons';
import { formatDateTime, telHref } from '../../utils/format';

const TABS = [['all', 'All'], ['unread', 'Unread'], ['unreplied', 'Not replied']];

export default function Inquiries() {
  const { inquiries, updateInquiry, deleteInquiry, agent } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState('all');
  const [target, setTarget] = useState(null);
  useSeo({ title: 'Inquiries' });

  const list = inquiries.filter((i) => (tab === 'unread' ? !i.read : tab === 'unreplied' ? !i.replied : true));
  const toggle = 'btn-outline btn-sm';

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-semibold">Inquiries</h1>
      <p className="text-sm text-slate-600">{inquiries.filter((i) => !i.read).length} unread · {inquiries.length} total</p>

      <div className="mt-5 flex gap-2" role="tablist" aria-label="Filter inquiries">
        {TABS.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === k ? 'bg-navy text-white' : 'bg-white text-slate-700 hover:bg-cream-200'}`}>{label}</button>
        ))}
      </div>

      <ul className="mt-5 space-y-4">
        {list.map((i) => (
          <li key={i.id} className={`card p-5 ${i.read ? '' : 'border-l-4 border-gold'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex flex-wrap items-center gap-2 text-lg font-semibold text-navy">
                  {i.name}
                  {!i.read && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-900">Unread</span>}
                  {i.replied && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900">Replied</span>}
                  {i.sample && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">Sample</span>}
                </p>
                <p className="text-sm text-slate-600">
                  Re: {i.propertyId ? <Link to={`/property/${i.propertyId}`} className="font-medium text-navy hover:underline">{i.propertyTitle}</Link> : i.propertyTitle}
                </p>
              </div>
              <p className="text-xs text-slate-600">{formatDateTime(i.createdAt)}</p>
            </div>
            <p className="mt-3 whitespace-pre-line rounded-ctl bg-cream p-3.5 text-sm text-slate-800">{i.message}</p>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div className="flex gap-1.5"><dt className="sr-only">Email</dt><dd><a href={`mailto:${i.email}`} className="inline-flex items-center gap-1.5 text-navy hover:underline"><IconMail size={14} />{i.email}</a></dd></div>
              <div className="flex gap-1.5"><dt className="sr-only">Phone</dt><dd><a href={telHref(i.phone)} className="inline-flex items-center gap-1.5 text-navy hover:underline"><IconPhone size={14} />{i.phone}</a></dd></div>
              <div className="flex gap-1.5 text-slate-600"><dt>Best time:</dt><dd>{i.preferredTime}</dd></div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={toggle} onClick={() => updateInquiry(i.id, { read: !i.read })}>Mark as {i.read ? 'unread' : 'read'}</button>
              <button type="button" className={toggle} onClick={() => updateInquiry(i.id, { replied: !i.replied, read: true })}>Mark as {i.replied ? 'not replied' : 'replied'}</button>
              <a
                className="btn-primary btn-sm"
                href={`mailto:${i.email}?subject=${encodeURIComponent(`Re: ${i.propertyTitle}`)}&body=${encodeURIComponent(`Hi ${i.name.split(' ')[0]},\n\nThanks for your message.\n\n${agent.name}\n${agent.agency}`)}`}
                onClick={() => updateInquiry(i.id, { replied: true, read: true })}
              >Reply by email</a>
              <button type="button" className={`${toggle} ml-auto !text-red-800`} onClick={() => setTarget(i)} aria-label={`Delete inquiry from ${i.name}`}><IconTrash size={14} /> Delete</button>
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="card p-10 text-center text-slate-600">{inquiries.length ? 'Nothing in this view. You’re all caught up.' : 'No inquiries yet. They’ll appear here when visitors submit the contact forms.'}</li>}
      </ul>

      <ConfirmModal
        open={!!target} danger title="Delete inquiry?" confirmLabel="Delete"
        message={target ? `The message from ${target.name} will be permanently removed.` : ''}
        onCancel={() => setTarget(null)}
        onConfirm={() => { deleteInquiry(target.id); toast('Inquiry deleted'); setTarget(null); }}
      />
    </div>
  );
}
