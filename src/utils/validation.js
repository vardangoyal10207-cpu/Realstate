const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (v) => EMAIL_RE.test(String(v).trim());

export function validateInquiry(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your name.';
  else if (v.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
  if (!v.email.trim()) e.email = 'Please enter your email.';
  else if (!isEmail(v.email)) e.email = 'Enter a valid email address, e.g. name@example.com.';
  const phoneDigits = v.phone.replace(/\D/g, '');
  if (!v.phone.trim()) e.phone = 'Please enter a phone number.';
  else if (phoneDigits.length < 10 || phoneDigits.length > 15) e.phone = 'Enter a valid phone number (10–15 digits).';
  if (!v.message.trim()) e.message = 'Please tell us how we can help.';
  else if (v.message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
  return e;
}

export function validateListing(v) {
  const e = {};
  if (!v.title.trim()) e.title = 'Title is required.';
  if (!v.description.trim()) e.description = 'Description is required.';
  if (!(Number(v.price) > 0)) e.price = 'Enter a price greater than 0.';
  if (!v.address.trim()) e.address = 'Address is required.';
  if (!v.city.trim()) e.city = 'City / area is required.';
  const lat = Number(v.lat), lng = Number(v.lng);
  if (v.lat === '' || Number.isNaN(lat) || lat < -90 || lat > 90) e.lat = 'Latitude must be between -90 and 90.';
  if (v.lng === '' || Number.isNaN(lng) || lng < -180 || lng > 180) e.lng = 'Longitude must be between -180 and 180.';
  ['bedrooms', 'bathrooms', 'sqft'].forEach((k) => {
    if (v[k] === '' || Number(v[k]) < 0 || Number.isNaN(Number(v[k]))) e[k] = 'Enter 0 or more.';
  });
  if (!v.images.length) e.images = 'Add at least one photo.';
  return e;
}

export function validateAgent(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Name is required.';
  if (!isEmail(v.email)) e.email = 'Enter a valid email address.';
  if (v.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number.';
  if (v.whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Enter a valid WhatsApp number.';
  Object.entries(v.social).forEach(([k, url]) => {
    if (url && !/^https?:\/\//i.test(url)) e[`social.${k}`] = 'Must start with http:// or https://';
  });
  return e;
}
