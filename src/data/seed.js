import { TYPE_IMAGES } from './constants';

export const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const HERO_IMAGE = unsplash('1600596542815-ffad4c1539a9', 2000);
export const CTA_IMAGE = unsplash('1570129477492-45c003edd2be', 1800);
export const ABOUT_IMAGE = unsplash('1517090504586-fde19ea6066f', 1600);

export const seedAgent = {
  id: 'agent-1',
  name: 'Vardan',
  agency: 'SJR Limited',
  title: 'Sales Representative · Mississauga & the GTA',
  photo: unsplash('1560250097-0b93528c311a', 600),
  phone: '+1-2269950000',
  whatsapp: '+1-2269950000',
  email: 'test@gmail.com',
  bio:
    'Vardan helps families, first-time buyers and investors move with confidence across Mississauga, Oakville, Brampton and Toronto’s west end. Known for honest advice, sharp negotiation and a calm, organised process, Vardan treats every transaction as if it were their own.',
  credentials: [
    'Licensed Real Estate Sales Representative (RECO)',
    'Accredited Buyer Representative (ABR)',
    'Certified Negotiation Expert (CNE)',
    'Member, Toronto Regional Real Estate Board',
  ],
  serviceAreas: ['Mississauga', 'Port Credit', 'Oakville', 'Brampton', 'Etobicoke', 'Burlington', 'Milton'],
  office: { address: '100 City Centre Dr, Mississauga, ON L5B 2C9', lat: 43.5933, lng: -79.6419 },
  stats: { homesSold: 240, years: 12, clients: 310 },
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/',
    youtube: 'https://youtube.com/',
    x: 'https://x.com/',
  },
};

export const testimonials = [
  {
    name: 'Priya & Arjun S.',
    role: 'First-time buyers, Erin Mills',
    quote:
      'Vardan walked us through every step and found a townhouse we never would have spotted on our own. We closed under budget and stress-free.',
  },
  {
    name: 'Michael T.',
    role: 'Seller, Port Credit',
    quote:
      'Sold above asking in nine days. The staging advice and marketing were outstanding, and communication was prompt the entire way.',
  },
  {
    name: 'Sandra L.',
    role: 'Investor, Brampton',
    quote:
      'Honest numbers, no pressure. Vardan helped me build a small rental portfolio and always puts the long-term return first.',
  },
];

const I = (ids) => ids.map((id) => unsplash(id));
const d = (days) => new Date(Date.now() - days * 864e5).toISOString();

const base = { agentId: 'agent-1', featured: false, rental: false };

// All listings are fictional sample data.
export const seedProperties = [
  {
    ...base, id: 'p-001', featured: true,
    title: 'Modern Lakeview Residence', city: 'Port Credit', address: '48 Lakeshore Rd E, Port Credit, Mississauga, ON',
    lat: 43.5527, lng: -79.5849, type: 'House', bedrooms: 5, bathrooms: 4, sqft: 3850, lotSize: '50 × 130 ft', yearBuilt: 2021, parking: 2,
    price: 2395000, status: 'Available', createdAt: d(3),
    description:
      'A show-stopping contemporary home steps from Port Credit harbour. Soaring ceilings, floor-to-ceiling glazing and a chef’s kitchen make everyday living feel like a retreat. The primary suite offers a spa ensuite and private balcony with lake glimpses.',
    features: ['Heated floors', 'Chef’s kitchen', 'Finished basement', 'Smart home system', 'Walk to waterfront', 'Backyard deck'],
    images: I(['1600596542815-ffad4c1539a9', '1600607687939-ce8a6c25118c', '1556909114-f6e7ad7d3136', '1540518614846-7eded433c457', '1600585154340-be6161a56a0c']),
  },
  {
    ...base, id: 'p-002', featured: true,
    title: 'Lorne Park Estate with Pool', city: 'Lorne Park', address: '1220 Lorne Park Rd, Mississauga, ON',
    lat: 43.5238, lng: -79.6153, type: 'Villa', bedrooms: 6, bathrooms: 5, sqft: 5200, lotSize: '0.6 acre', yearBuilt: 2018, parking: 4,
    price: 4250000, status: 'Available', createdAt: d(6),
    description:
      'Set on a mature, tree-lined lot in prestigious Lorne Park, this resort-style villa pairs timeless architecture with modern comforts: a saltwater pool, outdoor kitchen, home theatre and a four-car heated garage.',
    features: ['Saltwater pool', 'Home theatre', 'Outdoor kitchen', 'Wine cellar', 'Heated garage', 'Elevator'],
    images: I(['1613490493576-7fde63acd811', '1512917774080-9991f1c4c750', '1600566753190-17f0baa2a6c3', '1507089947368-19c1da9775ae', '1600573472550-8090b5e0745e']),
  },
  {
    ...base, id: 'p-003', featured: true,
    title: 'Square One Skyline Condo', city: 'Mississauga', address: '55 Eglinton Ave W, Unit 2204, Mississauga, ON',
    lat: 43.5896, lng: -79.6437, type: 'Condo', bedrooms: 2, bathrooms: 2, sqft: 1050, lotSize: '—', yearBuilt: 2019, parking: 1,
    price: 689000, status: 'Available', createdAt: d(2),
    description:
      'Bright corner suite on the 22nd floor with panoramic skyline views. Open-concept layout, quartz kitchen, in-suite laundry and a large balcony. Steps to Square One, Sheridan College and the LRT.',
    features: ['Concierge', 'Gym & yoga studio', 'Rooftop terrace', 'Party room', 'Visitor parking', 'Locker included'],
    images: I(['1502672260266-1c1ef2d93688', '1560448204-e02f11c3d0e2', '1484154218962-a197022b5858', '1505691938895-1758d7feb511']),
  },
  {
    ...base, id: 'p-004', featured: true,
    title: 'Family Home in Erin Mills', city: 'Erin Mills', address: '3305 Eglinton Ave W, Mississauga, ON',
    lat: 43.5565, lng: -79.7142, type: 'House', bedrooms: 4, bathrooms: 3, sqft: 2400, lotSize: '40 × 110 ft', yearBuilt: 2008, parking: 2,
    price: 1389000, status: 'Under Offer', createdAt: d(9),
    description:
      'A beautifully maintained detached home in a top school district. Hardwood throughout, renovated kitchen with island, finished basement with rec room and a fully fenced backyard perfect for summer entertaining.',
    features: ['Hardwood floors', 'Renovated kitchen', 'Finished basement', 'Fenced yard', 'Near top schools', 'Central A/C'],
    images: I(['1572120360610-d971b9d7767c', '1556911220-bff31c812dba', '1507089947368-19c1da9775ae', '1502005229762-cf1b2da7c5d6']),
  },
  {
    ...base, id: 'p-005', featured: true,
    title: 'Downtown Oakville Townhouse', city: 'Oakville', address: '215 Lakeshore Rd W, Oakville, ON',
    lat: 43.4472, lng: -79.6869, type: 'Townhouse', bedrooms: 3, bathrooms: 3, sqft: 1850, lotSize: '22 × 90 ft', yearBuilt: 2020, parking: 2,
    price: 1195000, status: 'Available', createdAt: d(5),
    description:
      'Stylish three-storey freehold townhome a short stroll from Oakville’s boutique shops and waterfront trails. Rooftop terrace, double garage and designer finishes throughout.',
    features: ['Rooftop terrace', 'Double garage', 'Quartz counters', 'Walk to lake', 'EV charger rough-in', 'Gas fireplace'],
    images: I(['1558036117-15d82a90b9b1', '1600047509807-ba8f99d2cdde', '1556909114-f6e7ad7d3136', '1540518614846-7eded433c457']),
  },
  {
    ...base, id: 'p-006',
    title: 'Streetsville Heritage Charmer', city: 'Streetsville', address: '28 Queen St S, Streetsville, Mississauga, ON',
    lat: 43.5826, lng: -79.7106, type: 'House', bedrooms: 3, bathrooms: 2, sqft: 1900, lotSize: '60 × 120 ft', yearBuilt: 1952, parking: 3,
    price: 1049000, status: 'Sold', createdAt: d(34),
    description:
      'Character-filled bungalow with a modern addition, in the heart of historic Streetsville village. Original trim, sun-filled sunroom and an oversized lot with mature gardens.',
    features: ['Sunroom', 'Mature gardens', 'Updated wiring', 'Detached workshop', 'Walk to GO station'],
    images: I(['1523217582562-09d0def993a6', '1600210492486-724fe5c67fb0', '1502005229762-cf1b2da7c5d6']),
  },
  {
    ...base, id: 'p-007',
    title: 'Brampton Starter Townhome', city: 'Brampton', address: '90 Peel Centre Dr, Brampton, ON',
    lat: 43.6934, lng: -79.7599, type: 'Townhouse', bedrooms: 3, bathrooms: 2, sqft: 1500, lotSize: '20 × 85 ft', yearBuilt: 2015, parking: 2,
    price: 799000, status: 'Available', createdAt: d(11),
    description:
      'Affordable and move-in ready, this sunny end-unit townhome offers a bright eat-in kitchen, walkout to a private patio and a generous primary suite. Minutes to Highway 410 and Bramalea City Centre.',
    features: ['End unit', 'Private patio', 'Walk-in closet', 'Close to transit', 'Low maintenance fees'],
    images: I(['1605276374104-dee2a0ed3cd6', '1600585154340-be6161a56a0c', '1556911220-bff31c812dba']),
  },
  {
    ...base, id: 'p-008',
    title: 'Etobicoke Waterfront Apartment', city: 'Etobicoke', address: '2230 Lake Shore Blvd W, Toronto, ON',
    lat: 43.6205, lng: -79.4801, type: 'Apartment', bedrooms: 1, bathrooms: 1, sqft: 720, lotSize: '—', yearBuilt: 2017, parking: 1,
    price: 3100, rental: true, status: 'Rented', createdAt: d(21),
    description:
      'Sleek one-bedroom apartment overlooking Humber Bay Park. Floor-to-ceiling windows, stainless appliances and amenities including a pool, gym and 24-hour concierge. Recently leased.',
    features: ['Indoor pool', '24h concierge', 'Gym', 'Balcony', 'Parking included', 'Pet friendly'],
    images: I(['1522708323590-d24dbb6b0267', '1493809842364-78817add7ffb', '1560448204-e02f11c3d0e2']),
  },
  {
    ...base, id: 'p-009',
    title: 'Cooksville Corner Condo', city: 'Mississauga', address: '3 Dundas St W, Unit 1510, Mississauga, ON',
    lat: 43.5801, lng: -79.6122, type: 'Condo', bedrooms: 1, bathrooms: 1, sqft: 610, lotSize: '—', yearBuilt: 2022, parking: 1,
    price: 2450, rental: true, status: 'Available', createdAt: d(1),
    description:
      'Brand-new one-bedroom plus den available for lease. Wide-plank flooring, integrated appliances and a private balcony. Walk to Cooksville GO and the Hurontario LRT.',
    features: ['Den / home office', 'Smart locks', 'Gym', 'Co-working lounge', 'Bike storage'],
    images: I(['1545324418-cc1a3fa10c00', '1502672260266-1c1ef2d93688', '1484154218962-a197022b5858']),
  },
  {
    ...base, id: 'p-010',
    title: 'Clarkson Development Lot', city: 'Clarkson', address: 'Lakeshore Rd W & Clarkson Rd, Mississauga, ON',
    lat: 43.5128, lng: -79.6335, type: 'Land', bedrooms: 0, bathrooms: 0, sqft: 0, lotSize: '1.2 acres', yearBuilt: null, parking: 0,
    price: 3150000, status: 'Available', createdAt: d(15),
    description:
      'Rare 1.2-acre residential-zoned parcel close to Clarkson GO and Lake Ontario. Survey, geotechnical report and concept plans for up to eight luxury townhomes available on request.',
    features: ['Residential zoning', 'Survey available', 'Municipal services', 'Near GO station', 'Corner exposure'],
    images: I(['1464146072230-91cabc968266', '1500382017468-9049fed747ef', '1449844908441-8829872d2607']),
  },
  {
    ...base, id: 'p-011',
    title: 'Meadowvale Business Park Unit', city: 'Meadowvale', address: '6900 Maritz Dr, Mississauga, ON',
    lat: 43.6044, lng: -79.7409, type: 'Commercial', bedrooms: 0, bathrooms: 2, sqft: 4800, lotSize: '0.4 acre', yearBuilt: 2005, parking: 20,
    price: 2290000, status: 'Under Offer', createdAt: d(18),
    description:
      'Flexible office / light-industrial unit with a reception area, six private offices, boardroom and a grade-level shipping door. Excellent exposure near Highways 401 and 407.',
    features: ['Grade-level loading', 'Boardroom', '20 surface parking spots', 'Signage on frontage', 'Fibre internet'],
    images: I(['1486406146926-c627a92ad1ab', '1497366216548-37526070297c', '1554469384-e58fac16e23a']),
  },
  {
    ...base, id: 'p-012',
    title: 'Burlington Lakeside Villa', city: 'Burlington', address: '4380 Lakeshore Rd, Burlington, ON',
    lat: 43.3607, lng: -79.7962, type: 'Villa', bedrooms: 5, bathrooms: 4, sqft: 4300, lotSize: '0.45 acre', yearBuilt: 2016, parking: 3,
    price: 3395000, status: 'Available', createdAt: d(7),
    description:
      'Elegant lakeside villa with private steps to the water. Open-plan living with a double-sided fireplace, gourmet kitchen, and a covered loggia ideal for year-round entertaining.',
    features: ['Private lake access', 'Covered loggia', 'Gourmet kitchen', 'Three-car garage', 'Radiant heating', 'Guest suite'],
    images: I(['1512918728675-ed5a9ecdebfd', '1600566753190-17f0baa2a6c3', '1580587771525-78b9dba3b914', '1556909114-f6e7ad7d3136']),
  },
  {
    ...base, id: 'p-013',
    title: 'Meadowvale Detached with Garden Suite', city: 'Meadowvale', address: '7155 Glen Erin Dr, Mississauga, ON',
    lat: 43.5902, lng: -79.7461, type: 'House', bedrooms: 4, bathrooms: 4, sqft: 2750, lotSize: '45 × 120 ft', yearBuilt: 2012, parking: 4,
    price: 1459000, status: 'Available', createdAt: d(4),
    description:
      'Spacious executive home with a legal basement apartment for rental income or multigenerational living. Upgraded kitchen, open-concept main floor and a landscaped yard backing onto green space.',
    features: ['Legal basement suite', 'Backs onto green space', 'Upgraded kitchen', 'Interlock driveway', 'Central vacuum'],
    images: I(['1570129477492-45c003edd2be', '1600607687939-ce8a6c25118c', '1507089947368-19c1da9775ae', '1600585154340-be6161a56a0c']),
  },
  {
    ...base, id: 'p-014',
    title: 'Port Credit Boutique Apartment', city: 'Port Credit', address: '70 Port St E, Unit 305, Mississauga, ON',
    lat: 43.5517, lng: -79.5815, type: 'Apartment', bedrooms: 2, bathrooms: 2, sqft: 1180, lotSize: '—', yearBuilt: 2014, parking: 1,
    price: 3650, rental: true, status: 'Available', createdAt: d(8),
    description:
      'Light-filled two-bedroom suite in a boutique building a block from the water. Hardwood floors, stone counters and a wraparound balcony. Includes parking, locker and heat.',
    features: ['Wraparound balcony', 'Heat included', 'Locker', 'Pet friendly', 'Walk to marina', 'Gym'],
    images: I(['1522708323590-d24dbb6b0267', '1560185007-cde436f6a4d0', '1493809842364-78817add7ffb']),
  },
];

// Fallback when an image fails to load or a listing has no photos.
export const placeholderFor = (type) => unsplash(TYPE_IMAGES[type] || TYPE_IMAGES.House, 900);
