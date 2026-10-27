import Link from "next/link";
import { InView } from "@/components/motion/in-view";
import { SectionHead } from "@/components/ui/section-head";
import { ArrowLink, Arrow } from "@/components/ui/arrow-link";
import { Pending } from "@/components/ui/pending";
import { Portrait } from "@/components/ui/portrait";
import { MediaImage } from "@/components/ui/media-image";
import { StartupPlate } from "@/components/art/startup-plate";
import { dateParts, formatDate } from "@/lib/format";
import { EVENT_CATEGORY_LABEL, PARTNER_KIND_LABEL } from "@/lib/site";
import type { PublicImage } from "@/lib/queries";

/* ─── § 02 — The foundation ─────────────────────────────────────── */

export function SectionDrawing() {
  const strata = ["Question", "Evidence", "Product", "Venture"];
  return (
    <InView data-draw amount={0.3}>
      <figure>
        <svg viewBox="0 0 360 300" className="h-auto w-full" role="img" aria-labelledby="fig02-t">
          <title id="fig02-t">Section drawing: four strata — question, evidence, product, venture — built one on another</title>
          <defs>
            <pattern id="sec-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M0 0V6" stroke="#5866B8" strokeWidth="0.8" />
            </pattern>
          </defs>
          {strata.map((label, i) => {
            const y = 230 - i * 56;
            const inset = i * 26;
            return (
              <g key={label} className="stack" style={{ "--d": `${0.2 + i * 0.22}s` } as React.CSSProperties}>
                <rect className="fade" style={{ "--d": `${0.3 + i * 0.2}s` } as React.CSSProperties} x={20 + inset} y={y} width={320 - inset * 2} height="44" fill={i === 3 ? "url(#sec-hatch)" : i % 2 ? "#F4F5FA" : "#fff"} />
                <rect className="draw" style={{ "--d": `${0.15 + i * 0.2}s` } as React.CSSProperties} pathLength={1} x={20 + inset} y={y} width={320 - inset * 2} height="44" fill="none" stroke={i === 3 ? "#2A3382" : "#1B2266"} strokeWidth="1.2" />
                <text className="fade font-sans" style={{ "--d": `${0.5 + i * 0.2}s` } as React.CSSProperties} x={30 + inset} y={y + 26} fontSize="10" letterSpacing="0.8" fill="#1B2266">
                  {`${String(i + 1).padStart(2, "0")}  ${label.toUpperCase()}`}
                </text>
              </g>
            );
          })}
          <path className="draw" style={{ "--d": "1.1s" } as React.CSSProperties} pathLength={1} d="M0 274H360" stroke="#1B2266" strokeWidth="2" />
          <path className="fade" style={{ "--d": "1.2s" } as React.CSSProperties} d="M0 282l8-8M12 282l8-8M24 282l8-8M36 282l8-8M48 282l8-8M60 282l8-8M72 282l8-8M84 282l8-8M96 282l8-8M108 282l8-8M120 282l8-8M132 282l8-8M144 282l8-8M156 282l8-8M168 282l8-8M180 282l8-8M192 282l8-8M204 282l8-8M216 282l8-8M228 282l8-8M240 282l8-8M252 282l8-8M264 282l8-8M276 282l8-8M288 282l8-8M300 282l8-8M312 282l8-8M324 282l8-8M336 282l8-8M348 282l8-8" stroke="#5B6380" strokeWidth="0.7" />
        </svg>
      </figure>
    </InView>
  );
}

export function Foundation({
  intro,
  vision,
  mission,
  leader,
}: {
  intro: string;
  vision: string;
  mission: string;
  leader: { name: string; role: string; bio: string | null; image: PublicImage | null } | null;
}) {
  return (
    <section aria-labelledby="foundation-title" data-section-index="02" data-section-label="Foundation" className="relative py-24 md:py-36">
      <div className="shell grid-12 gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <InView data-reveal>
            <p className="label flex items-center gap-4 text-blue">
              <span aria-hidden className="gold-rule" />
              About the foundation
            </p>
            <h2 id="foundation-title" className="display-lg mt-6 text-ink">
              <span className="mask-line" style={{ "--i": 0 } as React.CSSProperties}>
                <span>An institution built</span>
              </span>
              <span className="mask-line" style={{ "--i": 1 } as React.CSSProperties}>
                <span>
                  for ideas in their <em className="em-serif text-blue">first</em>
                </span>
              </span>
              <span className="mask-line" style={{ "--i": 2 } as React.CSSProperties}>
                <span>
                  <em className="em-serif text-blue">form.</em>
                </span>
              </span>
            </h2>
            <p className="reveal-fade lede mt-8 max-w-[52ch] text-ink">{intro}</p>
          </InView>
        </div>
        <div className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9 lg:mt-16">
          <SectionDrawing />
        </div>

        {/* Vision & mission as articles */}
        <div className="col-span-12 grid gap-10 border-t border-rule pt-10 md:grid-cols-2">
          {[
            { k: "Our vision", t: "Vision", v: vision },
            { k: "Our mission", t: "Mission", v: mission },
          ].map((a) => (
            <div key={a.k}>
              <p className="label text-muted">{a.k}</p>
              <h3 className="display-sm mt-3 text-ink">{a.t}</h3>
              {a.v ? (
                <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink">{a.v}</p>
              ) : (
                <Pending className="mt-4" label={`${a.t} statement`} note="To be supplied by RS Foundation and published from the administration panel." />
              )}
            </div>
          ))}
        </div>

        {/* Leadership */}
        {leader ? (
          <div className="col-span-12 grid-12 mt-10 gap-y-8">
            <div className="col-span-8 col-start-3 sm:col-span-5 sm:col-start-2 lg:col-span-3 lg:col-start-2">
              <Portrait image={leader.image} name={leader.name} />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-6 lg:col-start-6 lg:self-end">
              <p className="label text-blue">Leadership</p>
              <p className="display-md mt-4 text-ink">{leader.name}</p>
              <p className="mt-3 max-w-[40ch] text-[1.05rem] text-muted">{leader.role}</p>
              {leader.bio ? (
                <p className="mt-6 max-w-[56ch] leading-relaxed text-ink">{leader.bio}</p>
              ) : (
                <Pending className="mt-6 max-w-lg" label="Approved biography" note="A verified professional biography will appear here once supplied." />
              )}
              <ArrowLink href="/about" className="mt-8">
                About the foundation
              </ArrowLink>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ─── § 04 — The archive ───────────────────────────────────────── */

type ArchiveStartup = {
  slug: string;
  name: string;
  tagline: string;
  category: { name: string } | null;
  foundedYear: number | null;
  image: PublicImage | null;
};

export function EmptyArchive({ compact = false }: { compact?: boolean }) {
  return (
    <InView data-draw amount={0.3} className="relative">
      <div className={`relative border border-rule ${compact ? "p-6 md:p-10" : "p-8 md:p-14"}`}>
        <div className="relative max-w-xl bg-white">
          <p className="label text-blue">Portfolio</p>
          <p className="display-sm mt-4 text-ink">Our first ventures will be introduced here.</p>
          <p className="mt-4 leading-relaxed text-muted">
            Each venture is presented once its information has been verified and approved for publication.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            <ArrowLink href="/apply" variant="text">
              Apply for incubation
            </ArrowLink>
          </div>
        </div>
      </div>
    </InView>
  );
}

export function ArchivePreview({ startups, total }: { startups: ArchiveStartup[]; total: number }) {
  const ratios = ["aspect-[4/5]", "aspect-[16/10]", "aspect-square", "aspect-[3/4]"];
  const spans = ["lg:col-span-5", "lg:col-span-6 lg:col-start-7 lg:mt-32", "lg:col-span-4 lg:col-start-2", "lg:col-span-5 lg:col-start-8 lg:-mt-20"];
  return (
    <section aria-labelledby="s04-title" data-section-index="04" data-section-label="Archive" className="py-24 md:py-36">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <SectionHead index="04" label="Startups" title={"Startup *portfolio.*"} className="col-span-12 lg:col-span-7" />
          <div className="col-span-12 flex flex-col justify-end gap-6 lg:col-span-4 lg:col-start-9">
            <p className="leading-relaxed text-muted">
              A curated record of the ventures developed with RS Foundation — their founders, their problems and what they are building.
            </p>
            <div className={`flex items-baseline justify-between border-t border-rule pt-3 ${total ? "" : "hidden"}`}>
              <span className="label text-muted">Ventures</span>
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-ink">{String(total).padStart(3, "0")}</span>
            </div>
          </div>
        </div>

        <div className="mt-16">
          {startups.length === 0 ? (
            <EmptyArchive />
          ) : (
            <>
              <ul className="grid-12 gap-y-14">
                {startups.slice(0, 4).map((s, i) => (
                  <li key={s.slug} className={`col-span-12 sm:col-span-6 ${spans[i]}`}>
                    <Link href={`/startups/${s.slug}`} className="group block">
                      <InView data-crop amount={0.2} className={`relative overflow-hidden ${ratios[i]}`}>
                        {s.image ? (
                          <MediaImage image={s.image} fill sizes="(min-width: 1024px) 40vw, 90vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                        ) : (
                          <StartupPlate name={s.name} ratio={ratios[i].replace(/aspect-\[?|\]/g, "").replace("square", "1/1")} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]" />
                        )}
                      </InView>
                      <div className="mt-4 flex items-baseline gap-4">
                                                <span className="label text-muted">{s.category?.name ?? "Unclassified"}</span>
                      </div>
                      <p className="display-sm mt-2 text-ink transition-colors group-hover:text-blue">{s.name}</p>
                      <p className="mt-1 max-w-[46ch] text-muted">{s.tagline}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-16 flex justify-end border-t border-rule pt-4">
                <ArrowLink href="/startups">Open the full archive</ArrowLink>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── § 06 — People ────────────────────────────────────────────── */

type PersonRow = { slug: string; name: string; role: string; expertise: string | null; image: PublicImage | null };

export function People({ mentors }: { mentors: PersonRow[] }) {
  return (
    <section aria-labelledby="s06-title" data-section-index="06" data-section-label="People" className="border-t border-rule py-24 md:py-32">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <SectionHead index="06" label="Mentors" title={"Mentors & *advisors.*"} size="display-md" />
          <p className="mt-6 max-w-[38ch] leading-relaxed text-muted">
            Practitioners, operators and researchers who give their time to founders. Every name here is listed with their consent.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          {mentors.length ? (
            <ul className="border-t border-ink">
              {mentors.slice(0, 8).map((m, i) => (
                <li key={m.slug} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-rule py-5 sm:grid-cols-[2.5rem_1fr_1fr]">
                  <span className="label pt-1 text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[1.25rem] font-semibold text-ink">{m.name}</p>
                    <p className="text-sm text-muted">{m.role}</p>
                  </div>
                  {m.expertise ? <p className="col-start-2 text-sm text-ink sm:col-start-3">{m.expertise}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-t border-ink pt-6">
              <p className="display-sm text-ink">The mentor network is being assembled.</p>
              <p className="mt-3 max-w-[52ch] text-muted">
                Mentors will be introduced here as they join. If you have built, operated or invested and would like to help early-stage
                founders, we would like to hear from you.
              </p>
              <ArrowLink href="/contact?type=MENTOR" className="mt-6">
                Offer to mentor
              </ArrowLink>
            </div>
          )}
          {mentors.length ? (
            <ArrowLink href="/ecosystem#mentors" className="mt-8">
              All mentors
            </ArrowLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ─── § 07 — Calendar ──────────────────────────────────────────── */

type EventRow = { slug: string; title: string; category: string; startsAt: Date; location: string | null };
type NewsRow = { slug: string; title: string; excerpt: string; publishedAt: Date };

export function Calendar({ events, news }: { events: EventRow[]; news: NewsRow[] }) {
  return (
    <section aria-labelledby="s07-title" data-section-index="07" data-section-label="Calendar" className="border-y border-rule bg-pale py-24 md:py-32">
      <div className="shell grid-12 gap-y-14">
        <SectionHead index="07" label="Calendar" title={"Events & *announcements.*"} className="col-span-12 lg:col-span-5" size="display-md" />
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <div className="flex items-baseline justify-between border-b border-ink pb-2">
            <h3 className="label text-ink">Upcoming</h3>
            <Link href="/events" className="label u-link text-blue">
              Full calendar
            </Link>
          </div>
          {events.length ? (
            <ul>
              {events.slice(0, 4).map((e) => {
                const p = dateParts(e.startsAt);
                return (
                  <li key={e.slug} className="border-b border-rule bg-white">
                    <Link href={`/events/${e.slug}`} className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-5">
                      <span className="leading-none">
                        <span className="block text-[2.4rem] font-normal tabular-nums text-ink">{p.day}</span>
                        <span className="label-sm text-muted">
                          {p.month} {p.year}
                        </span>
                      </span>
                      <span>
                        <span className="label text-blue">{EVENT_CATEGORY_LABEL[e.category]}</span>
                        <span className="mt-1 block text-[1.15rem] font-semibold text-ink group-hover:text-blue">{e.title}</span>
                        {e.location ? <span className="block text-sm text-muted">{e.location}</span> : null}
                      </span>
                      <Arrow className="text-blue" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="bg-white py-6 text-muted">No events are scheduled at the moment. Workshops, founder sessions and demo days will be announced here first.</p>
          )}

          <div className="mt-14 flex items-baseline justify-between border-b border-ink pb-2">
            <h3 className="label text-ink">Announcements</h3>
            <Link href="/news" className="label u-link text-blue">
              All news
            </Link>
          </div>
          {news.length ? (
            <ul className="grid gap-px bg-rule sm:grid-cols-3">
              {news.slice(0, 3).map((n) => (
                <li key={n.slug} className="bg-white">
                  <Link href={`/news/${n.slug}`} className="group block h-full p-4 pl-0 sm:pl-4">
                    <span className="label-sm text-muted">{formatDate(n.publishedAt, { day: "2-digit", month: "short", year: "numeric" })}</span>
                    <span className="mt-2 block font-semibold leading-snug text-ink group-hover:text-blue">{n.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="bg-white py-6 text-muted">No announcements have been published yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── § 08 — Ecosystem ─────────────────────────────────────────── */

type PartnerRow = { slug: string; name: string; kind: string; url: string | null; logo: PublicImage | null };

export function Ecosystem({ partners }: { partners: PartnerRow[] }) {
  const doors = [
    { id: "industry", t: "Industry collaboration", c: "Bring a real problem, data or a pilot opportunity to founders who can work on it." },
    { id: "mentorship", t: "Mentorship", c: "Give structured time to early-stage teams in your area of expertise." },
    { id: "investors", t: "Investor engagement", c: "Meet ventures as they become ready for capital." },
    { id: "institutions", t: "Institutional partnerships", c: "Collaborate on programmes, research and entrepreneurship education." },
  ];
  return (
    <section aria-labelledby="s08-title" data-section-index="08" data-section-label="Ecosystem" className="py-24 md:py-32">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <SectionHead index="08" label="Ecosystem" title={"Partners & *collaboration.*"} className="col-span-12 lg:col-span-8" />
        </div>
        {partners.length ? (
          <ul className="mt-14 grid grid-cols-2 border-l border-t border-rule sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((p) => (
              <li key={p.slug} className="group relative flex aspect-[3/2] flex-col justify-between border-b border-r border-rule p-4">
                <span className="label-sm text-muted">{PARTNER_KIND_LABEL[p.kind]}</span>
                <div className="relative flex h-1/2 items-center justify-center">
                  {p.logo ? (
                    <MediaImage image={p.logo} fill sizes="200px" className="!object-contain opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0" alt={`${p.name} logo`} />
                  ) : (
                    <span className="text-center font-semibold text-ink">{p.name}</span>
                  )}
                </div>
                <span className="sr-only">{p.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 max-w-[60ch] text-muted">
            Partner organisations will be shown here once each partnership is confirmed and its logo approved for use.
          </p>
        )}
        <InView as="ol" data-reveal amount={0.2} className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {doors.map((d, i) => (
            <li key={d.id} className="reveal-item" style={{ "--i": i } as React.CSSProperties}>
              <Link href={`/ecosystem#${d.id}`} className="lift group flex h-full flex-col border border-rule bg-white p-6">
                <span className="label text-blue">{String.fromCharCode(97 + i)}.</span>
                <span className="mt-8 text-[1.3rem] font-normal leading-tight text-ink">{d.t}</span>
                <span className="mt-3 flex-1 text-sm leading-relaxed text-muted">{d.c}</span>
                <Arrow className="mt-6 text-blue" />
              </Link>
            </li>
          ))}
        </InView>
      </div>
    </section>
  );
}
