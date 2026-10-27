import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Facts } from "@/components/layout/page-header";
import { ApplicationForm } from "@/components/forms/application-form";
import { ArrowLink } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { ContentIcon } from "@/components/art/content-icons";
import { getPrograms } from "@/lib/queries";
import { APPLICATIONS_OPEN } from "@/content";

export const metadata: Metadata = {
  title: "Apply for Incubation",
  description: APPLICATIONS_OPEN ? "Apply to RS Foundation's incubation programmes." : "Applications for RS Foundation's incubation programmes are opening soon.",
};

function ComingSoon() {
  return (
    <section aria-labelledby="soon-title" className="py-20 md:py-28">
      <InView data-reveal data-draw className="shell grid-12 gap-y-12">
        <div className="col-span-12 flex items-start lg:col-span-3">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-pale">
            <ContentIcon name="incubator" className="w-16" />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <p className="label flex items-center gap-4 text-blue">
            <span aria-hidden className="gold-rule" />
            Applications
          </p>
          <h2 id="soon-title" className="display-lg mt-6 text-ink">
            <span className="mask-line">
              <span>
                Coming <em className="em-serif text-blue">soon.</em>
              </span>
            </span>
          </h2>
          <p className="reveal-fade mt-7 max-w-[52ch] text-[1.1rem] leading-relaxed text-muted">
            Applications for our incubation programmes will open shortly. In the meantime, explore the programmes or get in touch — we would be glad to
            hear about your idea.
          </p>
          <div className="reveal-fade mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ArrowLink href="/incubation/" variant="solid">
              Explore programmes
            </ArrowLink>
            <ArrowLink href="/contact/?type=FOUNDER">Contact us</ArrowLink>
          </div>
        </div>
      </InView>
    </section>
  );
}

export default function ApplyPage() {
  const programs = getPrograms().map((p) => ({ slug: p.slug, name: p.name }));

  return (
    <>
      <PageHeader
        index="08"
        label="Application"
        trail={[{ label: "Apply" }]}
        title={"Apply for *incubation.*"}
        intro={
          <p>
            {APPLICATIONS_OPEN
              ? "Tell us about the problem, the people and the progress so far. Honest, specific answers are more useful than polished ones."
              : "Applications are opening soon."}
          </p>
        }
        aside={
          APPLICATIONS_OPEN ? (
            <Facts
              items={[
                { k: "Time needed", v: "About 20 minutes" },
                { k: "You will need", v: "A clear description of the problem and your team" },
                { k: "Optional", v: "A link to your pitch deck" },
                { k: "Afterwards", v: "A reference number confirming receipt" },
              ]}
            />
          ) : undefined
        }
      />
      {APPLICATIONS_OPEN ? (
        <section className="shell py-16 md:py-24">
          <Suspense>
            <ApplicationForm programs={programs} />
          </Suspense>
        </section>
      ) : (
        <ComingSoon />
      )}
    </>
  );
}
