import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { IconFacebook, IconLinkedin, IconMail, IconShare, IconWhatsApp, IconX } from './Icons';

export default function ShareButtons({ url, title }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url), t = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    setCopied(true); toast('Link copied to clipboard'); setTimeout(() => setCopied(false), 2000);
  };
  const nativeShare = () => navigator.share({ title, url }).catch(() => {});

  const link = 'flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy transition duration-200 hover:bg-navy hover:text-white';
  const items = [
    { href: `https://wa.me/?text=${t}%20${u}`, label: 'Share on WhatsApp', Icon: IconWhatsApp },
    { href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, label: 'Share on Facebook', Icon: IconFacebook },
    { href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, label: 'Share on X', Icon: IconX },
    { href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, label: 'Share on LinkedIn', Icon: IconLinkedin },
    { href: `mailto:?subject=${t}&body=${u}`, label: 'Share by email', Icon: IconMail, same: true },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Share this property">
      <span className="mr-1 text-sm font-medium text-navy">Share</span>
      {items.map(({ href, label, Icon, same }) => (
        <a key={label} href={href} aria-label={label} title={label} className={link} {...(same ? {} : { target: '_blank', rel: 'noopener noreferrer' })}><Icon size={18} /></a>
      ))}
      <button type="button" onClick={copy} className="btn-outline btn-sm">{copied ? 'Copied!' : 'Copy link'}</button>
      {typeof navigator !== 'undefined' && navigator.share && (
        <button type="button" onClick={nativeShare} className={link} aria-label="Share via device"><IconShare size={18} /></button>
      )}
    </div>
  );
}
