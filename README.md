# SJR Limited: Real Estate Website (Vardan)

React 18 + Vite + Tailwind CSS + React Router + Leaflet (OpenStreetMap, no API key).
Fully working out of the box with 14 sample listings; all data persists in `localStorage`.

## Run locally

Requires Node 18+.

```bash
cd sjr-realty
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the build at http://localhost:4173
```

Public site: `/`. Admin: `/admin` (demo login `admin@demo.com` / `admin123`, **placeholder only**).

When deploying, configure your host to serve `index.html` for every route (SPA fallback),
e.g. Netlify `_redirects`: `/* /index.html 200`, Vercel rewrite to `/index.html`.

## Customize

| What | Where |
|---|---|
| Agent name, agency, phone, WhatsApp, email, bio, socials, office address | `/admin` → Agent profile (live), or defaults in `src/data/seed.js` (`seedAgent`) |
| Sample listings / testimonials | `src/data/seed.js` |
| Colors, fonts | `tailwind.config.js`, `index.html` (Google Fonts) |
| Demo admin credentials | `src/data/constants.js` |

Changing `seed.js` after first load has no effect in a browser that already stored data. Use
Admin → Dashboard → "Reset to sample data" (or clear site data).

The office address (100 City Centre Dr, Mississauga) and all listings/testimonials are fictional placeholders.

## Structure

```
src/
  components/  reusable UI (Navbar, PropertyCard, MapView, Gallery, filters, forms…)
  pages/       public pages; pages/admin/ for the dashboard
  context/     StoreContext (data + auth), ToastContext
  hooks/       useListingFilters (URL-synced filters), useLocalStorage, useSeo…
  utils/       format, filters, validation, mortgage, images
  data/        constants + seed data
  lib/         Leaflet bootstrap
```

## Swapping in a real backend (Supabase example; Firebase is analogous)

All data access goes through `src/context/StoreContext.jsx`. Replace its `useLocalStorage` calls with
async calls and keep the same exported API; pages won't change.

1. **Auth.** Replace `login`/`logout` with `supabase.auth.signInWithPassword` / `signOut`, and derive `authed`
   from `supabase.auth.onAuthStateChange`. Delete `DEMO_CREDENTIALS`. Never rely on the client-side
   check for security: enforce it with Row Level Security.
2. **Database.** Tables `properties` (columns from the Property model; `features text[]`, `images text[]`),
   `inquiries`, `agents`. RLS: public `select` on `properties` and `agents`; public `insert` only on
   `inquiries`; all writes and `select` on `inquiries` restricted to the authenticated admin.
   Load with `supabase.from('properties').select('*')` into state; make `addProperty`/`updateProperty`/
   `deleteProperty` call `insert/update/delete`. The inquiry forms already funnel through `addInquiry`
   (see the simulated delay in `InquiryForm.jsx`).
3. **Images.** In `ImageManager.jsx`, replace `fileToDataUrl` with an upload to a Supabase Storage bucket
   (`supabase.storage.from('listing-images').upload(...)`) and store the returned public URL in
   `images[]`. This also removes the localStorage size limit (about 5 MB) that data-URL uploads face.
4. **Email notifications.** Add a database trigger or Edge Function on `inquiries` insert to email the agent.
5. **SEO.** Meta tags are set client-side (`useSeo`). For best social-preview and search results on
   listing pages, add pre-rendering or move to a framework with SSR (Next.js, Remix).

## Notes

- Mortgage calculator uses Canadian semi-annual compounding and excludes CMHC insurance, tax and closing costs.
- Photos load from Unsplash; map tiles from OpenStreetMap (attribution is shown on the map).
- Colors meet WCAG AA: gold text on light backgrounds uses the darker `gold-dark` token.
