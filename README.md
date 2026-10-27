# R Shivakumar Foundation — website

The website of R Shivakumar Foundation (RS Foundation), an innovation and incubation centre associated with Dr. R. Shivakumar, Chairman of SRM Group of Institutions, Chennai – Ramapuram & Tiruchirappalli Campus.

It is a **fully static site**: no database, no server and no admin panel. `npm run build` produces plain HTML, CSS, JavaScript and images in `out/`, which can be uploaded to any static host (Netlify, Cloudflare Pages, GitHub Pages, Vercel, cPanel / any web server).

## Editing content

All content lives in **`src/content/index.ts`**:

| What | Where |
| --- | --- |
| Homepage text, vision, mission, contact details, social links | `SITE` |
| Incubation programmes (and their photos) | `PROGRAMS` |
| Events (hackathons, workshops, programmes) | `EVENTS` |
| Leadership and mentors | `PEOPLE` |
| Startups, news, partners | `STARTUPS`, `NEWS`, `PARTNERS` |

Images go in `public/images/…` and are referenced by path, e.g. `/images/people/dr-r-shivakumar.jpg`. After editing, rebuild and re-upload `out/`.

Only publish verified information. Empty fields are shown on the site as understated "forthcoming" notes.

**Events** are sorted into "current & upcoming" and "past" at build time, so rebuild the site after an event ends to move it into the past list.

## Forms

The Apply and Contact forms validate in the browser and post to a hosted form service (Formspree, Web3Forms, Getform…). Set its endpoint in `NEXT_PUBLIC_FORM_ENDPOINT` (see `.env.example`) and rebuild. Until it is set, the forms tell visitors that online submissions are not yet enabled; they never claim to have sent anything the service has not confirmed. Pitch decks are collected as links (a static site cannot receive file uploads).

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to out/
npm run preview    # serve out/ locally
npm run lint && npm run typecheck && npm test
```

Security headers for hosts that support them are in `public/_headers`.

## Stack

Next.js 16 (static export), TypeScript, Tailwind CSS 4, Motion. Type: Times New Roman. Palette from the official logo: navy `#2A3382`, deep navy `#1B2266`, white, with the logo's gold `#EFBC2F` as a fine accent.

## Still to supply

- Contact email, phone, address and official social media links (`SITE`).
- Dr. R. Shivakumar's approved biography (`PEOPLE`).
- Confirmation of the eight proposed programmes, with eligibility, duration and format (`PROGRAMS`).
- Launchpad details (launchpad.rsfhub.com did not respond when the events were added).
- Verified startups, mentors, partners and news.
- Legal review of the privacy policy and terms.
