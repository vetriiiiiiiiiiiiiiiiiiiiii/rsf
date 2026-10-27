import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Facts } from "@/components/layout/page-header";
import { StartupPlate } from "@/components/art/startup-plate";
import { MediaImage } from "@/components/ui/media-image";
import { ArrowLink } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { getStartup, getStartups } from "@/lib/queries";

export const dynamicParams = false;
export function generateStaticParams() {
  // A static export needs at least one path; "_" renders the not-found page until startups are added.
  const slugs = getStartups().map((s) => ({ slug: s.slug }));
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/startups/[slug]">): Promise<Metadata> {
  const s = await getStartup((await params).slug);
  if (!s) return { title: "Venture not found" };
  return { title: s.name, description: s.tagline, openGraph: { title: s.name, description: s.tagline, images: s.image ? [s.image.src] : undefined } };
}

export default async function StartupPage({ params }: PageProps<"/startups/[slug]">) {
  const s = await getStartup((await params).slug);
  if (!s) notFound();

  return (
    <article>
      <div className="on-dark blueprint-ground -mt-[var(--header-h)] pt-[var(--header-h)]">
      <div className="shell flex items-center justify-between border-b border-rule py-2.5">
        <Breadcrumb trail={[{ href: "/startups", label: "Startups" }, { label: s.name }]} />
        <span className="label hidden text-muted sm:inline">{s.category?.name ?? "Unclassified"}</span>
      </div>
      <div className="shell grid-12 gap-y-12 py-12 md:py-20">
        <InView data-reveal className="col-span-12 lg:col-span-6">
          <p className="label text-blue">Venture profile</p>
          <h1 className="display-lg mt-8 text-ink">
            <span className="mask-line">
              <span>{s.name}</span>
            </span>
          </h1>
          <p className="reveal-fade lede mt-6 max-w-[44ch] text-ink">{s.tagline}</p>
          <div className="reveal-fade mt-10">
            <Facts
              items={[
                ...(s.founders ? [{ k: "Founders", v: s.founders }] : []),
                ...(s.category ? [{ k: "Sector", v: s.category.name }] : []),
                ...(s.stage ? [{ k: "Stage", v: s.stage }] : []),
                ...(s.foundedYear ? [{ k: "Founded", v: String(s.foundedYear) }] : []),
                ...(s.location ? [{ k: "Based in", v: s.location }] : []),
              ]}
            />
          </div>
          {s.website ? (
            <ArrowLink href={s.website} external variant="inverse" className="mt-8">
              Visit {s.name}
            </ArrowLink>
          ) : null}
        </InView>
        <InView data-crop className="relative col-span-12 aspect-[4/5] overflow-hidden lg:col-span-5 lg:col-start-8">
          {s.image ? <MediaImage image={s.image} fill priority sizes="(min-width:1024px) 40vw, 100vw" /> : <StartupPlate name={s.name} className="h-full w-full" />}
        </InView>
      </div>
      </div>
      <div className="shell grid-12 border-t border-rule py-16 md:py-24">
        <h2 className="label col-span-12 mb-6 text-muted lg:col-span-3">About the venture</h2>
        <div className="prose-rsf col-span-12 max-w-[64ch] text-[1.08rem] text-ink lg:col-span-7 lg:col-start-5">
          {s.description.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
