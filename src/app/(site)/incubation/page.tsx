import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ProgramVisual } from "@/components/art/program-visual";
import { Pending } from "@/components/ui/pending";
import { ArrowLink, Arrow } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { getPrograms } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Incubation",
  description: "Incubation programmes at RS Foundation — from idea validation to investor readiness.",
};

const ROUTE = [
  { t: "Apply", c: "Submit the application form. You receive a reference number as soon as it is saved." },
  { t: "Review", c: "The team reads every application and may ask follow-up questions." },
  { t: "Conversation", c: "Shortlisted founders are invited to talk through the venture in more depth." },
  { t: "Decision", c: "Each applicant is told the outcome, with a recommended next step." },
];

export default async function IncubationPage() {
  const programs = await getPrograms();
  const provisional = programs.some((p) => p.provisional);

  return (
    <>
      <PageHeader
        index="02"
        label="Incubation"
        trail={[{ label: "Incubation" }]}
        variant="stacked"
        title={"Incubation *programmes.*"}
        intro={
          <p>
            Each programme addresses a particular moment in a venture&rsquo;s life — from the first question about a problem to the first
            conversation with an investor.
          </p>
        }
        aside={
          provisional ? (
            <p className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted">
              Programmes marked <span className="label text-blue">Proposed</span> are intended categories. Eligibility, duration and format
              will be published once confirmed by the foundation.
            </p>
          ) : undefined
        }
      />

      <section aria-label="Programme index" className="py-16 md:py-24">
        <div className="shell">
          {programs.length ? (
            <ol>
              {programs.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/incubation/${p.slug}`} className="group grid grid-cols-[3rem_1fr] items-start gap-x-4 gap-y-4 border-t border-rule py-8 transition-colors hover:border-blue md:grid-cols-[4rem_7rem_1fr_14rem] md:gap-x-8">
                    <span className="label pt-2 text-blue">{String(i + 1).padStart(2, "0")}</span>
                    <InView data-draw amount={0.5} className="col-start-2 row-start-2 w-24 border border-rule bg-white md:col-start-auto md:row-start-auto md:w-full">
                      <ProgramVisual image={p.image} kind={p.illustration} name={p.name} sizes="140px" className="aspect-square w-full" />
                    </InView>
                    <div className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">
                      <h2 className="text-[clamp(1.6rem,3vw,2.6rem)] font-normal leading-[1.02] text-ink transition-colors group-hover:text-blue">
                        {p.name}
                      </h2>
                      <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">{p.summary}</p>
                    </div>
                    <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-1 md:flex-col md:items-end md:justify-between md:self-stretch">
                      <span className="label text-muted">{p.provisional ? "Proposed" : p.acceptingApplications ? "Accepting applications" : "Confirmed"}</span>
                      <Arrow className="text-blue" />
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <Pending label="Programme directory" note="No programmes have been published yet." />
          )}
        </div>
      </section>

      <section aria-labelledby="route" className="bg-pale py-20 md:py-28">
        <div className="shell grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <span aria-hidden className="gold-rule" />
            <h2 id="route" className="display-md mt-5 text-ink">
              The route in
            </h2>
            <p className="mt-5 max-w-[38ch] leading-relaxed text-muted">How an application moves through review. Timelines will be published with each intake.</p>
            <ArrowLink href="/apply" variant="solid" className="mt-8">
              Start an application
            </ArrowLink>
          </div>
          <ol className="col-span-12 grid gap-px bg-ink/15 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {ROUTE.map((r, i) => (
              <li key={r.t} className="relative bg-pale p-5 pt-8">
                <span aria-hidden className="absolute left-0 top-0 h-px w-full bg-blue" style={{ transform: `scaleX(${(i + 1) / ROUTE.length})`, transformOrigin: "left" }} />
                <span className="label text-blue">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[1.3rem] font-normal text-ink">{r.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.c}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
