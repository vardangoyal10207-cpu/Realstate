const cad = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export const formatPrice = (price, rental = false) => `${cad.format(price || 0)}${rental ? '/mo' : ''}`;

export const formatCompactPrice = (price, rental = false) => {
  if (rental) return `$${Number(price).toLocaleString('en-CA')}/mo`;
  if (price >= 1e6) return `$${parseFloat((price / 1e6).toFixed(2))}M`;
  if (price >= 1e3) return `$${Math.round(price / 1e3)}K`;
  return `$${price}`;
};

export const formatNumber = (n) => Number(n || 0).toLocaleString('en-CA');

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' });

export const digits = (s) => String(s || '').replace(/\D/g, '');

/** "+1-2269950000" -> "+1 (226) 995-0000" (falls back to the raw string). */
export const formatPhone = (raw) => {
  const d = digits(raw);
  if (d.length === 11 && d.startsWith('1')) return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return raw;
};

export const telHref = (raw) => `tel:+${digits(raw)}`;

export const whatsappHref = (raw, text) =>
  `https://wa.me/${digits(raw)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const propertyUrl = (id) => `${window.location.origin}/property/${id}`;

export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Unsplash URLs can be resized by param; other URLs (uploads, custom) pass through. */
export const sized = (url, w) => {
  if (!url || !url.includes('images.unsplash.com')) return url;
  return url.replace(/([?&])w=\d+/, `$1w=${w}`);
};
