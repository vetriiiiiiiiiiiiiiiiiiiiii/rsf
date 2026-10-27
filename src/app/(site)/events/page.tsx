import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { MediaImage } from "@/components/ui/media-image";
import { Arrow } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { dateParts, formatTime } from "@/lib/format";
import { EVENT_CATEGORY_LABEL } from "@/lib/site";
import { getEvents } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Events",
  description: "Workshops, founder sessions, demo days and deadlines at RS Foundation.",
};

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();

  return (
    <>
      <PageHeader
        index="05"
        label="Events"
        trail={[{ label: "Events" }]}
        variant="stacked"
        title={"Events & *programmes.*"}
        intro={<p>Workshops, founder sessions, demo days and application deadlines. Every entry is published by the foundation team, with registration where available.</p>}
      />

      <section aria-labelledby="upcoming" className="py-16 md:py-24">
        <div className="shell">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 id="upcoming" className="label text-ink">
              Upcoming
            </h2>
            <span className="label text-muted">{String(upcoming.length).padStart(2, "0")}</span>
          </div>
          {upcoming.length ? (
            <ol>
              {upcoming.map((e, i) => {
                const p = dateParts(e.startsAt);
                return (
                  <li key={e.id}>
                    <Link href={`/events/${e.slug}`} className="group grid grid-cols-[5.5rem_1fr] gap-x-6 gap-y-6 border-b border-rule py-10 md:grid-cols-[9rem_1fr_minmax(0,22rem)] md:gap-x-10">
                      <div className="leading-none">
                        <span className="block text-[clamp(3.2rem,6vw,5.5rem)] font-normal tabular-nums text-ink">{p.day}</span>
                        <span className="label mt-2 block text-muted">
                          {p.month} {p.year}
                        </span>
                        <span className="label-sm mt-1 block text-muted">
                          {p.weekday} · {formatTime(e.startsAt)}
                        </span>
                      </div>
                      <div>
                        <span className="label text-blue">{EVENT_CATEGORY_LABEL[e.category]}</span>
                        <h3 className="mt-3 text-[clamp(1.6rem,2.8vw,2.4rem)] font-normal leading-[1.05] text-ink group-hover:text-blue">{e.title}</h3>
                        <p className="mt-3 max-w-[56ch] text-muted">{e.summary}</p>
                        <span className="mt-5 inline-flex items-center gap-3 text-sm font-medium text-ink">
                          {e.location ? <span>{e.location}</span> : null}
                          {e.registrationOpen ? <span className="label border border-blue px-2 py-1 text-blue">Registration open</span> : null}
                          <Arrow className="text-blue" />
                        </span>
                      </div>
                      {e.image ? (
                        <InView data-crop className={`relative col-span-2 overflow-hidden md:col-span-1 ${i % 2 ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
                          <MediaImage image={e.image} fill sizes="(min-width:768px) 22rem, 100vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                        </InView>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="grid gap-6 py-12 md:grid-cols-[1fr_1fr]">
              <p className="display-sm text-ink">Nothing is scheduled just now.</p>
              <p className="text-muted">
                Workshops, founder sessions and demo days will be announced here first. For enquiries about upcoming activity, please{" "}
                <Link href="/contact" className="u-link-static text-blue">
                  get in touch
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="past" className="border-t border-rule bg-pale py-16 md:py-24">
        <div className="shell">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 id="past" className="label text-ink">
              Archive of past events
            </h2>
            <span className="label text-muted">{String(past.length).padStart(2, "0")}</span>
          </div>
          {past.length ? (
            <ul className="mt-10 grid gap-x-[var(--col-gap)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => {
                const p = dateParts(e.startsAt);
                return (
                  <li key={e.id}>
                    <Link href={`/events/${e.slug}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden border border-rule bg-white">
                        {e.image ? (
                          <MediaImage image={e.image} fill sizes="(min-width:1024px) 30vw, 90vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                        ) : (
                          <div className="bp-grid flex h-full items-end p-4">
                            <span className="text-6xl font-semibold text-rule">{p.day}</span>
                          </div>
                        )}
                      </div>
                      <p className="label mt-4 text-muted">
                        {p.day} {p.month} {p.year} · {EVENT_CATEGORY_LABEL[e.category]}
                      </p>
                      <p className="mt-1 text-[1.15rem] font-semibold text-ink group-hover:text-blue">{e.title}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-10 text-muted">Past events will be archived here, with photographs where available.</p>
          )}
        </div>
      </section>
    </>
  );
}
