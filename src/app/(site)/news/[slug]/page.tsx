import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/page-header";
import { MediaImage } from "@/components/ui/media-image";
import { InView } from "@/components/motion/in-view";
import { ArrowLink } from "@/components/ui/arrow-link";
import { formatDate } from "@/lib/format";
import { getNewsPost } from "@/lib/queries";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const n = await getNewsPost((await params).slug);
  if (!n) return { title: "Article not found" };
  return { title: n.title, description: n.excerpt, openGraph: { type: "article", title: n.title, description: n.excerpt, publishedTime: n.publishedAt.toISOString(), images: n.image ? [`/media/${n.image.id}`] : undefined } };
}

export default async function NewsPostPage({ params }: PageProps<"/news/[slug]">) {
  const n = await getNewsPost((await params).slug);
  if (!n) notFound();
  return (
    <article>
      <div className="on-dark blueprint-ground -mt-[var(--header-h)] pt-[var(--header-h)]">
      <div className="shell flex items-center justify-between border-b border-rule py-2.5">
        <Breadcrumb trail={[{ href: "/news", label: "News" }, { label: n.title }]} />
      </div>
      <InView data-reveal className="shell grid-12 gap-y-8 py-12 md:py-20">
        <p className="label col-span-12 text-blue lg:col-span-3">
          <time dateTime={n.publishedAt.toISOString()}>{formatDate(n.publishedAt)}</time>
        </p>
        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <h1 className="display-md text-ink">{n.title}</h1>
          <p className="reveal-fade lede mt-6 text-muted">{n.excerpt}</p>
        </div>
      </InView>
      </div>
      {n.image ? (
        <InView data-crop className="shell">
          <div className="relative aspect-[16/9] overflow-hidden">
            <MediaImage image={n.image} fill priority sizes="100vw" />
          </div>
        </InView>
      ) : null}
      <div className="shell grid-12 py-16">
        <div className="prose-rsf col-span-12 max-w-[64ch] text-[1.08rem] text-ink lg:col-span-7 lg:col-start-5">
          {n.body.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="col-span-12 mt-12 lg:col-start-5">
          <ArrowLink href="/news">All news</ArrowLink>
        </div>
      </div>
    </article>
  );
}
