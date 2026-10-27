# RS Foundation — website & administration

The public website and content-management system for RS Foundation, an innovation and incubation centre associated with R. Sivakumar, Chairman of SRM Institute of Science and Technology, Tiruchirappalli.

Creative direction: **The Architecture of Ideas.** The site is built as a technical drawing set: a compass plan, an axonometric volume, section drawings and routed pathways. Lines construct themselves as you read, and an idea moves from question to venture.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions), TypeScript |
| Styling | Tailwind CSS 4 with custom tokens (`src/app/globals.css`) |
| Motion | CSS for line drawing and masked reveals; Motion (Framer Motion) for the menu and programme directory transitions |
| Data | PostgreSQL and Prisma 7 (driver adapter `@prisma/adapter-pg`) |
| Auth | Database sessions (httpOnly cookie, SHA-256 hashed token), bcrypt (cost 12) |
| Validation | Zod, on the server for every form and admin action |

Type: **Cormorant Garamond** for headings (echoing the logo's classical serif) and **Schibsted Grotesk** for text and labels. Palette is taken from the official logo: navy `#2A3382` and deep navy `#1B2266` on white, with the logo's gold `#EFBC2F` used only as a fine accent rule.

## Local development

Requires Node 20.9+.

```bash
npm install
cp .env.example .env              # then fill in values (see below)
npx prisma dev --name rsf --detach  # local Postgres (no install needed), or point DATABASE_URL at your own
npm run db:migrate                # apply migrations
npm run db:seed                   # proposed programmes, leadership entry, first admin
npm run dev                       # http://localhost:3000
```

`prisma dev` prints a `postgres://…` TCP URL; use it as `DATABASE_URL` and set `DATABASE_POOL_MAX="1"` for the local server.

Administration lives at **`/asdfghjkl`**. The seed creates the first administrator from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. To create or reset an administrator later: `npm run admin:create`.

### Checks

```bash
npm run lint
npm run typecheck
npm test          # validation, spam guard, upload sniffing, CSV injection, IST dates
npm run build
```

## Routes

Public: `/`, `/about`, `/incubation`, `/incubation/[slug]`, `/startups`, `/startups/[slug]`, `/ecosystem`, `/events`, `/events/[slug]`, `/news`, `/news/[slug]`, `/contact`, `/apply`, `/privacy`, `/terms`, plus `sitemap.xml`, `robots.txt`, an Open Graph image, and custom 404 and error pages.

Admin (`/asdfghjkl`): dashboard with pre-launch checklist and activity log; applications (status workflow, reviewer notes, private pitch-deck download, CSV export); enquiries; CRUD with publish/unpublish for startups, startup categories, programmes, events (with registrations and CSV export), news, leadership and mentors, and partners; media library; homepage copy, contact details and social links; account and users (administrators can add editors and deactivate users).

## Security model

- **Authorisation is server-side.** `src/proxy.ts` only redirects visitors without a cookie. Every admin page, server action and export route calls `requireAdmin()`, which validates the session against the database. Deletions of submissions and user management require the `ADMIN` role.
- **Sessions:** 32-byte random token. Only its SHA-256 hash is stored. httpOnly, `SameSite=Lax`, `Secure` in production, 8-hour expiry. Changing a password revokes all of that user's sessions.
- **Login:** constant-time comparison with a dummy hash for unknown emails. Rate-limited per account (5 / 15 min) and per client (20 / 15 min). Failures are logged.
- **CSRF:** mutations go through Server Actions, which Next.js restricts to same-origin requests. Cookies are `SameSite=Lax`, and CSP sets `form-action 'self'`.
- **Public forms:** honeypot, plus an HMAC-signed render timestamp that rejects instant and stale submissions, plus PostgreSQL-backed rate limits keyed by a keyed hash of the IP (raw IPs are never stored). Nothing is shown as submitted until the database write succeeds.
- **Uploads:** type detected from file contents (PNG, JPEG, WebP, PDF only; SVG and HTML rejected). Random storage names, size limits, stored outside `public/`. Served through `/media/[id]` with `nosniff` and a sandboxing CSP. Pitch decks are private and served only to signed-in administrators.
- **Headers:** CSP, `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy, a permissions policy, and HSTS in production. `/asdfghjkl` is `noindex` and `no-store`.
- **CSV exports** neutralise spreadsheet formula injection.
- **Logging:** structured JSON lines (`src/lib/log.ts`). An audit log of admin actions is shown on the dashboard.

## Deployment

1. Provision PostgreSQL and set `DATABASE_URL` (with `sslmode=require` where supported).
2. Set `APP_SECRET` (32+ random bytes), `SITE_URL` (public origin), and `UPLOAD_DIR` on a **persistent volume**. Uploaded files must survive redeploys. On serverless hosts without a persistent disk, replace `src/lib/uploads.ts` with an object-storage adapter (S3, R2 or GCS). The rest of the app only uses its exported functions.
3. `npm ci && npm run db:deploy && npm run build && npm start`
4. Run `npm run admin:create` once with `ADMIN_EMAIL`/`ADMIN_PASSWORD`, then remove `ADMIN_PASSWORD` from the environment.
5. Make sure the reverse proxy sets `X-Forwarded-For` correctly. Rate limiting relies on it.

Not included (choose per hosting): outbound email notifications for new applications and enquiries. Hook into `src/app/actions/public.ts` after the database write.

## Content required before launch

Nothing below has been invented. The public site shows each gap as a visible **"Awaiting approved content"** annotation, and the admin dashboard tracks them in a checklist.

- **Institution:** the official logo is in `public/brand/` (from `RSF Logo.png`); confirm the chairman's name spelling (the logo reads “Shivakumar”, the brief “Sivakumar”); exact approved wording of the SRM Tiruchirappalli association; vision and mission statements.
- **Leadership:** approved biography and photograph for R. Sivakumar, and any other leadership profiles.
- **Programmes:** the eight programme categories are **proposed**. Confirm which exist, then add eligibility, duration and format and untick "Proposed" for each.
- **Contact:** email, phone, postal address, visiting hours, map link; official social media accounts.
- **Portfolio and network:** verified startups (with founder consent for names), mentors (with consent), partners (with approved logos), events, news.
- **Capabilities:** the six capability areas are described as intentions. List actual facilities and resources once confirmed.
- **Legal:** the privacy policy and terms are drafts. They need the operating legal entity, a grievance officer and contact, a retention period, confidentiality terms for applications, and governing law, followed by review by counsel.
