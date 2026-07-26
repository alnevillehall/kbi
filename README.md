# ONDI launch site

A production-ready coming-soon experience for **ONDI**, a Kingston-first food
delivery product. The site gives customers, restaurants, and drivers a clear
route into the launch while presenting a polished preview of the product.

## Product direction

- Brand: **ONDI**
- Tagline: **Good food. On di way.**
- Initial market: Kingston, Jamaica
- Status: coming soon; no public launch date is claimed
- Primary conversion: customer waitlist
- Secondary conversions: founding restaurant and driver applications

The brand name, concept domain (`ondi.app`), contact email
(`hello@ondi.app`), and generic social links are launch-ready placeholders that
should be confirmed before a custom-domain release.

## Stack

- Next.js App Router via vinext
- React 19, TypeScript, Tailwind CSS
- Framer Motion and Lucide icons
- Zod validation shared by the UI and API
- Cloudflare D1 persistence through the `DB` binding
- Drizzle schema and migration files

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The local runtime provisions the declared D1 binding automatically. No secrets
or third-party form credentials are required.

## Quality checks

```bash
npm test
npm run db:generate
```

`npm test` runs linting, TypeScript validation, and the production build.

## Signup API

All signup paths post JSON to `POST /api/interest`:

- `customer` — email and launch area
- `restaurant` — business/contact details, location, cuisine, delivery setup,
  and consent
- `driver` — contact details, location, transport, availability, licence
  status, and consent

The endpoint performs server-side Zod validation, rejects oversized payloads
and the honeypot field, enforces a minimum form-fill interval, and applies a
hashed-IP D1 rate limit. It returns structured field errors without echoing
private submission data.

## Search and sharing

The app derives its canonical origin from the production request and includes
Open Graph and Twitter cards, JSON-LD service data, `sitemap.xml`, `robots.txt`,
favicon assets, and a bespoke ONDI share image.

## Photography

Locally bundled Jamaican food photography is sourced from Unsplash:

- [Ackee and saltfish](https://unsplash.com/photos/a-blue-plate-topped-with-food-next-to-a-cup-of-coffee-W4vDQETfroY)
- [Brown-stew fish](https://unsplash.com/photos/a-close-up-of-a-plate-of-food-on-a-table-hxVwlrOkP3c)
- [Sweet beans](https://unsplash.com/photos/a-bowl-of-food-eJ46aVjRXLA)
