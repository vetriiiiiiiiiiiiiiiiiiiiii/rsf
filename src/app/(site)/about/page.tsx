import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SectionDrawing } from "@/components/home/sections";
import { Portrait } from "@/components/ui/portrait";
import { Pending } from "@/components/ui/pending";
import { ArrowLink } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { getSettings } from "@/lib/settings";
import { getPeople } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About",
  description: "RS Foundation — an innovation and incubation centre for founders, students and researchers.",
};

const PRINCIPLES = [
  { t: "Evidence over enthusiasm", c: "Ideas are tested early and honestly. A disproved assumption is progress." },
  { t: "Structure without bureaucracy", c: "A clear sequence of stages, so founders always know what the next step is." },
  { t: "People before programmes", c: "Mentors and peers matter more than any curriculum. We connect founders to those who have built." },
  { t: "Ventures that stand alone", c: "The goal is independence: ventures that outgrow the foundation and sustain themselves." },
];

export default async function AboutPage() {
  const [s, leaders] = await Promise.all([getSettings(), getPeople("LEADERSHIP")]);

  return (
    <>
      <PageHeader
        index="01"
        label="About"
        trail={[{ label: "About" }]}
        title={"About the *foundation.*"}
        intro={<p>{s["about.intro"]}</p>}
        aside={<SectionDrawing />}
      />

      {/* Association */}
      <section aria-labelledby="association" className="py-20 md:py-28">
        <div className="shell grid-12 gap-y-8">
          <h2 id="association" className="label col-span-12 text-muted lg:col-span-3">
            Institutional association
          </h2>
          <p className="display-sm col-span-12 max-w-[34ch] text-ink lg:col-span-8 lg:col-start-5">{s["institution.association"]}</p>
        </div>
      </section>

      {/* Vision & mission */}
      <section aria-labelledby="purpose" className="bg-pale py-20 md:py-28">
        <div className="shell grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <span aria-hidden className="gold-rule" />
            <h2 id="purpose" className="display-md mt-5 text-ink">
              Purpose
            </h2>
          </div>
          <div className="col-span-12 grid gap-12 md:grid-cols-2 lg:col-span-8">
            {[
              { k: "Our vision", t: "Vision", v: s["about.vision"] },
              { k: "Our mission", t: "Mission", v: s["about.mission"] },
            ].map((a) => (
              <div key={a.k} className="border-t border-ink pt-4">
                <p className="label text-muted">{a.k}</p>
                <h3 className="display-sm mt-3 text-ink">{a.t}</h3>
                {a.v ? (
                  <p className="mt-4 text-[1.05rem] leading-relaxed text-ink">{a.v}</p>
                ) : (
                  <Pending className="mt-4 bg-white" label={`${a.t} statement`} note="Approved wording to be supplied by RS Foundation." />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles" className="py-20 md:py-28">
        <div className="shell">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 id="principles" className="display-sm text-ink">
              Working principles
            </h2>
            <span className="label text-muted">04 entries</span>
          </div>
          <ol className="grid md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <li key={p.t} className={`border-b border-rule py-8 md:pr-12 ${i % 2 ? "md:border-l md:pl-12" : ""}`}>
                <span className="label text-blue">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[1.5rem] font-normal leading-tight text-ink">{p.t}</h3>
                <p className="mt-3 max-w-[44ch] leading-relaxed text-muted">{p.c}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Leadership */}
      <section aria-labelledby="leadership" className="border-t border-rule py-20 md:py-28">
        <div className="shell">
          <div className="grid-12 gap-y-6">
            <p className="label col-span-12 text-blue lg:col-span-3">Leadership</p>
            <h2 id="leadership" className="display-md col-span-12 text-ink lg:col-span-8 lg:col-start-5">
              Stewardship
            </h2>
          </div>
          {leaders.length ? (
            <ul className="mt-16 space-y-24">
              {leaders.map((l, i) => (
                <li key={l.id} className="grid-12 gap-y-8">
                  <InView data-crop className={`col-span-10 sm:col-span-6 lg:col-span-4 ${i % 2 ? "lg:col-start-8 lg:row-start-1" : ""}`}>
                    <Portrait image={l.image} name={l.name} />
                  </InView>
                  <div className={`col-span-12 sm:col-span-6 lg:col-span-6 lg:self-end ${i % 2 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-6"}`}>
                    <p className="display-md text-ink">{l.name}</p>
                    <p className="mt-3 max-w-[42ch] text-[1.05rem] text-muted">{l.role}</p>
                    {l.bio ? (
                      <div className="prose-rsf mt-6 max-w-[60ch] text-ink">
                        {l.bio.split(/\n{2,}/).map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
                      </div>
                    ) : (
                      <Pending className="mt-6 max-w-lg" label="Approved biography" note="Verified biographical information to be supplied. No details are published until confirmed." />
                    )}
                    {l.linkedinUrl ? (
                      <ArrowLink href={l.linkedinUrl} external className="mt-6">
                        Professional profile
                      </ArrowLink>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Pending className="mt-12 max-w-xl" label="Leadership profiles" />
          )}
        </div>
      </section>

      <section className="border-t border-rule bg-pale py-16">
        <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="display-sm max-w-[28ch] text-ink">Ready to test an idea against reality?</p>
          <div className="flex flex-wrap gap-6">
            <ArrowLink href="/incubation" variant="line">
              View programmes
            </ArrowLink>
            <ArrowLink href="/apply" variant="solid">
              Apply for incubation
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
