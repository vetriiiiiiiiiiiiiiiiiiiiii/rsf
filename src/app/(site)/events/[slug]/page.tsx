import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Facts } from "@/components/layout/page-header";
import { MediaImage } from "@/components/ui/media-image";
import { ArrowLink } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { dateParts, formatRange } from "@/lib/format";
import { EVENT_CATEGORY_LABEL } from "@/lib/site";
import { getEvent } from "@/lib/queries";
import { EVENTS } from "@/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = getEvent((await params).slug);
  if (!e) return { title: "Event not found" };
  return { title: e.title, description: e.summary, openGraph: { title: e.title, description: e.summary, images: e.image ? [e.image.src] : undefined } };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = getEvent((await params).slug);
  if (!e) notFound();
  const p = e.startDate ? dateParts(e.startDate) : null;
  const range = formatRange(e.startDate, e.endDate);
  const host = e.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.summary,
    startDate: e.startDate ?? undefined,
    endDate: e.endDate ?? undefined,
    url: e.url,
    location: e.location ? { "@type": "Place", name: e.location } : undefined,
    organizer: { "@type": "Organization", name: "R Shivakumar Foundation" },
  };

  return (
    <article>
      {e.startDate ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /> : null}
      <div className="on-dark blueprint-ground">
        <div className="shell flex items-center justify-between border-b border-rule py-2.5">
          <Breadcrumb trail={[{ href: "/events/", label: "Events" }, { label: e.title }]} />
          <span className="label hidden text-muted sm:inline">{EVENT_CATEGORY_LABEL[e.category]}</span>
        </div>
        <div className="shell grid-12 gap-y-10 py-12 md:py-20">
          <div className="col-span-12 leading-none lg:col-span-3">
            {p ? (
              <>
                <span className="block text-[clamp(5rem,11vw,10rem)] tabular-nums text-blue">{p.day}</span>
                <span className="label mt-3 block text-ink">
                  {p.month} {p.year}
                </span>
              </>
            ) : (
              <span className="label block text-ink">Dates to be announced</span>
            )}
          </div>
          <InView data-reveal className="col-span-12 lg:col-span-8 lg:col-start-5">
            <p className="label flex flex-wrap items-center gap-3 text-blue">
              {EVENT_CATEGORY_LABEL[e.category]}
              {e.status === "live" ? <span className="border border-gold px-2 py-0.5 text-ink">Happening now</span> : null}
            </p>
            <h1 className="display-lg mt-6 text-ink">
              <span className="mask-line">
                <span>{e.title}</span>
              </span>
            </h1>
            <p className="reveal-fade lede mt-6 max-w-[52ch] text-ink">{e.summary}</p>
            <div className="reveal-fade mt-8">
              <ArrowLink href={e.url} external variant="inverse">
                Visit {host}
              </ArrowLink>
            </div>
          </InView>
        </div>
      </div>

      {e.image ? (
        <InView data-crop className="shell mt-12">
          <div className="relative aspect-[21/9] overflow-hidden">
            <MediaImage image={e.image} fill priority sizes="100vw" />
          </div>
        </InView>
      ) : null}

      <div className="shell grid-12 gap-y-12 py-16 md:py-24">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="label text-muted">About the event</h2>
          <div className="prose-rsf mt-6 max-w-[62ch] text-[1.05rem] text-ink">
            {e.body.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
        <aside className="col-span-12 lg:col-span-5 lg:col-start-8" aria-label="Event details">
          <Facts
            items={[
              ...(range ? [{ k: "Dates", v: range }] : []),
              ...(e.location ? [{ k: "Venue", v: e.location }] : []),
              ...e.facts,
              {
                k: "Website",
                v: (
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="u-link-static text-blue">
                    {host}
                  </a>
                ),
              },
            ]}
          />
          <p className="mt-6 text-sm text-muted">Registration, problem statements, schedules and results are published on the official event website.</p>
        </aside>
      </div>
    </article>
  );
}
