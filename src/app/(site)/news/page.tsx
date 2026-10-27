import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { MediaImage } from "@/components/ui/media-image";
import { InView } from "@/components/motion/in-view";
import { formatDate } from "@/lib/format";
import { getNews } from "@/lib/queries";

export const metadata: Metadata = {
  title: "News",
  description: "News and announcements from RS Foundation.",
};

export default async function NewsPage() {
  const news = await getNews();
  const [lead, ...rest] = news;

  return (
    <>
      <PageHeader index="06" label="News" trail={[{ label: "News" }]} title={"News & *announcements.*"} intro={<p>Updates from the foundation: intakes, decisions, milestones and notices.</p>} />
      <section className="shell py-16 md:py-24">
        {lead ? (
          <>
            <Link href={`/news/${lead.slug}`} className="group grid-12 gap-y-6 border-b border-ink pb-14">
              {lead.image ? (
                <InView data-crop className="relative col-span-12 aspect-[16/10] overflow-hidden lg:col-span-7">
                  <MediaImage image={lead.image} fill priority sizes="(min-width:1024px) 58vw, 100vw" />
                </InView>
              ) : null}
              <div className={`col-span-12 ${lead.image ? "lg:col-span-4 lg:col-start-9 lg:self-end" : "lg:col-span-8"}`}>
                <p className="label text-blue">Latest · {formatDate(lead.publishedAt)}</p>
                <h2 className="display-md mt-4 text-ink group-hover:text-blue">{lead.title}</h2>
                <p className="mt-4 leading-relaxed text-muted">{lead.excerpt}</p>
              </div>
            </Link>
            {rest.length ? (
              <ol>
                {rest.map((n) => (
                  <li key={n.id}>
                    <Link href={`/news/${n.slug}`} className="group grid gap-2 border-b border-rule py-7 md:grid-cols-[12rem_1fr_1fr] md:gap-8">
                      <span className="label pt-1 text-muted">{formatDate(n.publishedAt, { day: "2-digit", month: "short", year: "numeric" })}</span>
                      <span className="text-[1.35rem] font-normal leading-snug text-ink group-hover:text-blue">{n.title}</span>
                      <span className="text-muted">{n.excerpt}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : null}
          </>
        ) : (
          <div className="grid gap-6 border-t border-ink pt-8 md:grid-cols-2">
            <p className="display-sm text-ink">No announcements yet.</p>
            <p className="text-muted">News and notices will be published here by the foundation team.</p>
          </div>
        )}
      </section>
    </>
  );
}
