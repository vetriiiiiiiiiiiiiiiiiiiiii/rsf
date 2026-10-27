import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Facts } from "@/components/layout/page-header";
import { MediaImage } from "@/components/ui/media-image";
import { ArrowLink } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { RegistrationForm } from "@/components/forms/registration-form";
import { issueFormToken } from "@/lib/form-guard";
import { dateParts, formatDate, formatTime } from "@/lib/format";
import { EVENT_CATEGORY_LABEL } from "@/lib/site";
import { getEvent } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  if (!e) return { title: "Event not found" };
  return { title: e.title, description: e.summary, openGraph: { title: e.title, description: e.summary, images: e.image ? [`/media/${e.image.id}`] : undefined } };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const e = await getEvent((await params).slug);
  if (!e) notFound();
  const p = dateParts(e.startsAt);
  const now = new Date();
  const isPast = (e.endsAt ?? e.startsAt) < now;
  const full = e.capacity != null && e._count.registrations >= e.capacity;

  let registration: React.ReactNode;
  if (isPast) registration = <p className="text-muted">This event has taken place.</p>;
  else if (!e.registrationOpen) registration = <p className="text-muted">Registration is not open for this event.</p>;
  else if (e.registrationUrl)
    registration = (
      <ArrowLink href={e.registrationUrl} external variant="solid">
        Register on the event page
      </ArrowLink>
    );
  else if (full) registration = <p className="text-ink">This event is fully booked.</p>;
  else registration = <RegistrationForm eventId={e.id} token={issueFormToken("registration")} />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.summary,
    startDate: e.startsAt.toISOString(),
    endDate: e.endsAt?.toISOString(),
    location: e.location ? { "@type": "Place", name: e.location } : undefined,
    organizer: { "@type": "Organization", name: "RS Foundation" },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="on-dark blueprint-ground -mt-[var(--header-h)] pt-[var(--header-h)]">
      <div className="shell flex items-center justify-between border-b border-rule py-2.5">
        <Breadcrumb trail={[{ href: "/events", label: "Events" }, { label: e.title }]} />
        <span className="label hidden text-muted sm:inline">{EVENT_CATEGORY_LABEL[e.category]}</span>
      </div>
      <div className="shell grid-12 gap-y-10 py-12 md:py-20">
        <div className="col-span-12 leading-none lg:col-span-3">
          <span className="block text-[clamp(5rem,11vw,10rem)] font-normal tabular-nums text-blue">{p.day}</span>
          <span className="label mt-3 block text-ink">
            {p.month} {p.year} · {p.weekday}
          </span>
        </div>
        <InView data-reveal className="col-span-12 lg:col-span-8 lg:col-start-5">
          <p className="label text-blue">{EVENT_CATEGORY_LABEL[e.category]}</p>
          <h1 className="display-lg mt-6 text-ink">
            <span className="mask-line">
              <span>{e.title}</span>
            </span>
          </h1>
          <p className="reveal-fade lede mt-6 max-w-[52ch] text-ink">{e.summary}</p>
        </InView>
      </div>
      </div>

      {e.image ? (
        <InView data-crop className="shell">
          <div className="relative aspect-[21/9] overflow-hidden">
            <MediaImage image={e.image} fill priority sizes="100vw" />
          </div>
        </InView>
      ) : null}

      <div className="shell grid-12 gap-y-12 py-16 md:py-24">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="label text-muted">Details</h2>
          <div className="prose-rsf mt-6 max-w-[62ch] text-[1.05rem] text-ink">
            {e.body.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
        <aside className="col-span-12 lg:col-span-5 lg:col-start-8" aria-labelledby="reg-title">
          <Facts
            items={[
              { k: "Date", v: formatDate(e.startsAt, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
              { k: "Time", v: `${formatTime(e.startsAt)}${e.endsAt ? ` – ${formatTime(e.endsAt)}` : ""} IST` },
              ...(e.location ? [{ k: "Location", v: e.location }] : []),
              ...(e.capacity ? [{ k: "Places", v: String(e.capacity) }] : []),
            ]}
          />
          <h2 id="reg-title" className="display-sm mt-12 text-ink">
            Registration
          </h2>
          <div className="mt-6">{registration}</div>
        </aside>
      </div>
    </article>
  );
}
