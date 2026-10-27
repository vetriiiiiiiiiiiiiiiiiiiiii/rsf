import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { MediaImage } from "@/components/ui/media-image";
import { Arrow } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { dateParts, formatRange } from "@/lib/format";
import { EVENT_CATEGORY_LABEL } from "@/lib/site";
import { getEvents, type EventStatus } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Events",
  description: "Hackathons, workshops, founder sessions and programmes from R Shivakumar Foundation.",
};

const STATUS_LABEL: Record<EventStatus, string | null> = { live: "Happening now", upcoming: null, past: null, tba: "Dates to be announced" };

export default function EventsPage() {
  const { upcoming, past } = getEvents();

  return (
    <>
      <PageHeader
        index="05"
        label="Events"
        trail={[{ label: "Events" }]}
        variant="stacked"
        title={"Events & *programmes.*"}
        intro={<p>Hackathons, workshops, founder sessions and programmes run by the foundation and its partner institutions.</p>}
      />

      <section aria-labelledby="upcoming" className="py-16 md:py-24">
        <div className="shell">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 id="upcoming" className="label text-ink">
              Current & upcoming
            </h2>
            <span className="label text-muted">{String(upcoming.length).padStart(2, "0")}</span>
          </div>
          {upcoming.length ? (
            <ol>
              {upcoming.map((e, i) => {
                const p = e.startDate ? dateParts(e.startDate) : null;
                const status = STATUS_LABEL[e.status];
                return (
                  <li key={e.slug}>
                    <Link href={`/events/${e.slug}/`} className="group grid grid-cols-[5.5rem_1fr] gap-x-6 gap-y-6 border-b border-rule py-10 md:grid-cols-[9rem_1fr_minmax(0,22rem)] md:gap-x-10">
                      <div className="leading-none">
                        {p ? (
                          <>
                            <span className="block text-[clamp(3.2rem,6vw,5.5rem)] tabular-nums text-ink">{p.day}</span>
                            <span className="label mt-2 block text-muted">
                              {p.month} {p.year}
                            </span>
                          </>
                        ) : (
                          <span className="label block pt-3 text-muted">Date TBA</span>
                        )}
                      </div>
                      <div>
                        <span className="flex flex-wrap items-center gap-3">
                          <span className="label text-blue">{EVENT_CATEGORY_LABEL[e.category]}</span>
                          {status ? (
                            <span className="label inline-flex items-center gap-2 border border-gold px-2 py-0.5 text-ink">
                              {e.status === "live" ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" /> : null}
                              {status}
                            </span>
                          ) : null}
                        </span>
                        <h3 className="mt-3 text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.05] text-ink group-hover:text-blue">{e.title}</h3>
                        <p className="mt-3 max-w-[56ch] text-muted">{e.summary}</p>
                        <span className="mt-5 inline-flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink">
                          {formatRange(e.startDate, e.endDate) ? <span>{formatRange(e.startDate, e.endDate)}</span> : null}
                          {e.location ? <span className="text-muted">{e.location}</span> : null}
                          <Arrow className="text-blue" />
                        </span>
                      </div>
                      {e.image ? (
                        <InView data-crop className={`relative col-span-2 overflow-hidden md:col-span-1 ${i % 2 ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
                          <MediaImage image={e.image} fill sizes="(min-width:768px) 22rem, 100vw" />
                        </InView>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="py-12 text-muted">No events are scheduled at the moment. New events will be announced here first.</p>
          )}
        </div>
      </section>

      {past.length ? (
        <section aria-labelledby="past" className="border-t border-rule bg-pale py-16 md:py-24">
          <div className="shell">
            <div className="flex items-baseline justify-between border-b border-ink pb-3">
              <h2 id="past" className="label text-ink">
                Past events
              </h2>
              <span className="label text-muted">{String(past.length).padStart(2, "0")}</span>
            </div>
            <ul className="mt-10 grid gap-x-[var(--col-gap)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <li key={e.slug}>
                  <Link href={`/events/${e.slug}/`} className="group block border-t border-ink pt-4">
                    <p className="label text-muted">
                      {formatRange(e.startDate, e.endDate)} · {EVENT_CATEGORY_LABEL[e.category]}
                    </p>
                    <p className="mt-2 text-[1.3rem] text-ink group-hover:text-blue">{e.title}</p>
                    <p className="mt-1 text-sm text-muted">{e.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
