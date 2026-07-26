# KBI launch site

A production-ready coming-soon experience for **KBI**, a Montego Bay-first food
delivery product. The site gives customers, restaurants, and drivers a clear
route into the launch while presenting a polished preview of the product.

## Product direction

- Brand: **KBI**
- Tagline: **Good food. On di way.**
- Initial market: Montego Bay, Jamaica
- Status: coming soon; no public launch date is claimed
- Primary conversion: customer waitlist
- Secondary conversions: founding restaurant and driver applications

No custom domain, public contact email, or social profiles are assumed. Add
those verified values before a public marketing release.

## Stack

- Next.js App Router, deployed through Vinext on Sites or native Next.js on
  Vercel
- React 19, TypeScript, Tailwind CSS
- Framer Motion and Lucide icons
- Zod validation shared by the UI and API
- Cloudflare D1 persistence through the `DB` binding on Sites
- Neon Postgres persistence through `DATABASE_URL` on Vercel
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
npm run db:generate:postgres
```

`npm test` runs linting, TypeScript validation, and both production builds.

It verifies both production targets: the Vinext/Sites bundle in `dist` and the
native Next.js/Vercel bundle in `.next`.

## Vercel deployment

The committed `vercel.json` selects the native Next.js build, so Vercel
receives the `.next` output it expects. Keep the project Framework Preset set
to **Next.js** and do not configure a custom Output Directory.

Before accepting live signups, install Neon from the Vercel Marketplace so the
project receives a server-only `DATABASE_URL`. The Vercel build applies the
committed Postgres migrations when that variable is present; it fails the
deployment if a configured database cannot be migrated. An optional
`MIGRATION_DATABASE_URL` can provide a separate schema-owner credential while
`DATABASE_URL` remains the restricted runtime credential.

Run `npm run db:migrate:postgres` to apply the same migrations manually. Scope
Preview deployments to a separate Neon branch when test signups must not enter
the production database.

Vercel's `VERCEL_PROJECT_PRODUCTION_URL` provides the canonical metadata origin
when system environment variables are exposed. Set `NEXT_PUBLIC_SITE_URL` to
the final HTTPS origin when an explicit canonical domain is preferred.

The Sites deployment continues to use its existing D1 binding and does not
require `DATABASE_URL`.

## Signup API

All signup paths post JSON to `POST /api/interest`:

- `customer` — email and launch area
- `restaurant` — business/contact details, location, cuisine, delivery setup,
  and consent
- `driver` — contact details, location, transport, availability, licence
  status, and consent

The endpoint performs server-side Zod validation, rejects oversized payloads
and the honeypot field, deduplicates retries with a client-generated request
ID, and applies the same hashed-IP database rate limit through D1 or Postgres.
It returns structured field errors without echoing private submission data.

## Search and sharing

The app derives its canonical origin from the production request and includes
Open Graph and Twitter cards, JSON-LD service data, `sitemap.xml`, `robots.txt`,
favicon assets, and a bespoke KBI share image.

## Photography

Locally bundled Jamaican food photography is sourced from Unsplash:

- [Ackee and saltfish](https://unsplash.com/photos/a-blue-plate-topped-with-food-next-to-a-cup-of-coffee-W4vDQETfroY)
- [Brown-stew fish](https://unsplash.com/photos/a-close-up-of-a-plate-of-food-on-a-table-hxVwlrOkP3c)
- [Sweet beans](https://unsplash.com/photos/a-bowl-of-food-eJ46aVjRXLA)
