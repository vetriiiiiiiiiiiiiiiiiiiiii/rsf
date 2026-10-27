import type { Metadata } from "next";
import { PageHeader, Facts } from "@/components/layout/page-header";
import { ApplicationForm } from "@/components/forms/application-form";
import { issueFormToken } from "@/lib/form-guard";
import { getPrograms } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Apply for Incubation",
  description: "Apply to RS Foundation's incubation programmes.",
};

export default async function ApplyPage({ searchParams }: PageProps<"/apply">) {
  const sp = await searchParams;
  const programs = await getPrograms();
  const requested = typeof sp.programme === "string" ? sp.programme : undefined;
  const defaultProgram = programs.some((p) => p.slug === requested) ? requested : undefined;

  return (
    <>
      <PageHeader
        index="08"
        label="Application"
        trail={[{ label: "Apply" }]}
        title={"Apply for *incubation.*"}
        intro={<p>Tell us about the problem, the people and the progress so far. Honest, specific answers are more useful than polished ones.</p>}
        aside={
          <Facts
            items={[
              { k: "Time needed", v: "About 20 minutes" },
              { k: "You will need", v: "A clear description of the problem and your team" },
              { k: "Optional", v: "A pitch deck (PDF)" },
              { k: "Afterwards", v: "A reference number confirming receipt" },
            ]}
          />
        }
      />
      <section className="shell py-16 md:py-24">
        <ApplicationForm token={issueFormToken("application")} programs={programs.map((p) => ({ slug: p.slug, name: p.name }))} defaultProgram={defaultProgram} />
      </section>
    </>
  );
}
