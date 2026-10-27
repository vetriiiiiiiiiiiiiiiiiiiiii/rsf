import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Facts } from "@/components/layout/page-header";
import { ProgramVisual } from "@/components/art/program-visual";
import { InView } from "@/components/motion/in-view";
import { Pending } from "@/components/ui/pending";
import { ArrowLink } from "@/components/ui/arrow-link";
import { getProgram, getPrograms } from "@/lib/queries";

export const dynamicParams = false;
export function generateStaticParams() {
  return getPrograms().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/incubation/[slug]">): Promise<Metadata> {
  const p = await getProgram((await params).slug);
  if (!p) return { title: "Programme not found" };
  return { title: p.name, description: p.summary, openGraph: { title: p.name, description: p.summary } };
}

export default async function ProgramPage({ params }: PageProps<"/incubation/[slug]">) {
  const { slug } = await params;
  const [program, all] = await Promise.all([getProgram(slug), getPrograms()]);
  if (!program) notFound();
  const idx = all.findIndex((p) => p.slug === program.slug);
  const next = all[(idx + 1) % all.length];

  return (
    <article>
      <div className="on-dark blueprint-ground -mt-[var(--header-h)] pt-[var(--header-h)]">
      <div className="shell flex items-center justify-between border-b border-rule py-2.5">
        <Breadcrumb trail={[{ href: "/incubation", label: "Incubation" }, { label: program.name }]} />
        
      </div>

      <div className="shell grid-12 gap-y-12 py-12 md:py-20">
        <InView data-reveal className="col-span-12 lg:col-span-7">
          <p className="label text-blue">
            Programme {String(idx + 1).padStart(2, "0")} {program.provisional ? "· Proposed" : ""}
          </p>
          <h1 className="display-lg mt-8 text-ink">
            <span className="mask-line">
              <span>{program.name}</span>
            </span>
          </h1>
          <p className="reveal-fade lede mt-8 max-w-[50ch] text-ink">{program.summary}</p>
        </InView>
        <InView data-draw className="col-span-12 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          <div className="border border-rule bg-white">
            <ProgramVisual image={program.image} kind={program.illustration} name={program.name} priority className="aspect-[4/3] w-full" />
          </div>
                  </InView>
      </div>

      </div>
      <div className="shell grid-12 gap-y-12 border-t border-rule py-16 md:py-24">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="label text-muted">Overview</h2>
          <div className="prose-rsf mt-6 max-w-[62ch] text-[1.05rem] text-ink">
            {program.description.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <h2 className="label mb-4 text-muted">Particulars</h2>
          <Facts
            items={[
              { k: "Intended for", v: program.audience ?? <Pending inline label="Eligibility" /> },
              { k: "Duration", v: program.duration ?? <Pending inline label="Duration" /> },
              { k: "Format", v: program.format ?? <Pending inline label="Format" /> },
              { k: "Status", v: program.provisional ? "Proposed — awaiting confirmation" : program.acceptingApplications ? "Accepting applications" : "Not currently accepting applications" },
            ]}
          />
          <div className="mt-8 flex flex-wrap gap-6">
            {program.acceptingApplications ? (
              <ArrowLink href={`/apply?programme=${program.slug}`} variant="solid">
                Apply to this programme
              </ArrowLink>
            ) : (
              <ArrowLink href="/contact?type=FOUNDER" variant="solid">
                Register your interest
              </ArrowLink>
            )}
          </div>
        </div>
      </div>

      {next && next.slug !== program.slug ? (
        <Link href={`/incubation/${next.slug}`} className="group block border-t border-rule bg-pale">
          <div className="shell flex items-center justify-between gap-6 py-10">
            <span>
              <span className="label text-muted">Next programme</span>
              <span className="display-sm mt-2 block text-ink group-hover:text-blue">{next.name}</span>
            </span>
            <span aria-hidden className="text-3xl text-blue transition-transform group-hover:translate-x-2">→</span>
          </div>
        </Link>
      ) : null}
    </article>
  );
}
