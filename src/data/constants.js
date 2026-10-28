export const PROPERTY_TYPES = ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Land', 'Commercial'];
export const STATUSES = ['Available', 'Under Offer', 'Sold', 'Rented'];
export const BED_OPTIONS = [1, 2, 3, 4, 5];
export const BATH_OPTIONS = [1, 2, 3, 4];
export const PRICE_MAX = 5000000;
export const PRICE_STEP = 25000;
export const CONTACT_TIMES = ['Anytime', 'Morning (8–12)', 'Afternoon (12–5)', 'Evening (5–9)'];
export const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];
export const TYPE_IMAGES = {
  House: '1568605114967-8130f3a36994',
  Apartment: '1545324418-cc1a3fa10c00',
  Condo: '1493809842364-78817add7ffb',
  Townhouse: '1558036117-15d82a90b9b1',
  Villa: '1613490493576-7fde63acd811',
  Land: '1500382017468-9049fed747ef',
  Commercial: '1486406146926-c627a92ad1ab',
};
export const STORAGE_KEYS = {
  properties: 'sjr.properties.v1',
  agent: 'sjr.agent.v1',
  inquiries: 'sjr.inquiries.v1',
  favorites: 'sjr.favorites.v1',
  session: 'sjr.admin.session',
};
// DEMO ONLY: replace with real authentication (see README) before launch.
export const DEMO_CREDENTIALS = { email: 'admin@demo.com', password: 'admin123' };
