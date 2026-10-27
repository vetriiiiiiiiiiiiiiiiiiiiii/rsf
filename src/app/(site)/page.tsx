import { Hero } from "@/components/home/hero";
import { Journey } from "@/components/home/journey";
import { ProgramDirectory } from "@/components/home/program-directory";
import { CapabilityPlan } from "@/components/home/capability-plan";
import { Closing } from "@/components/home/closing";
import { Manifesto } from "@/components/home/manifesto";
import { ArchivePreview, Calendar, Ecosystem, Foundation, People } from "@/components/home/sections";
import { SectionHead } from "@/components/ui/section-head";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Pending } from "@/components/ui/pending";
import { getSettings } from "@/lib/settings";
import { countPublishedStartups, getEvents, getNews, getPartners, getPeople, getPrograms, getStartups } from "@/lib/queries";

export default async function HomePage() {
  const [s, programs, startups, total, leaders, mentors, events, news, partners] = await Promise.all([
    getSettings(),
    getPrograms(),
    getStartups(),
    countPublishedStartups(),
    getPeople("LEADERSHIP"),
    getPeople("MENTOR"),
    getEvents(),
    getNews(3),
    getPartners(),
  ]);
  const featured = [...startups.filter((x) => x.featured), ...startups.filter((x) => !x.featured)];
  const leader = leaders[0] ?? null;
  const anyProvisional = programs.some((p) => p.provisional);

  return (
    <>
      <Hero eyebrow={s["hero.eyebrow"]} headline={s["hero.headline"]} body={s["hero.body"]} />
      <Manifesto />

      <section aria-labelledby="s01-title" className="border-t border-rule bg-pale py-24 md:py-32">
        <div className="shell grid-12 gap-y-8">
          <SectionHead index="01" label="Our approach" title={"From a question\nto a *venture.*"} className="col-span-12 lg:col-span-7" />
          <p className="col-span-12 max-w-[42ch] self-end leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
            Incubation is a deliberate sequence. Each stage turns uncertainty into something more solid, with support suited to where a venture stands.
          </p>
        </div>
        <div className="shell mt-16 md:mt-20">
          <Journey />
        </div>
      </section>

      <Foundation
        intro={s["about.intro"]}
        vision={s["about.vision"]}
        mission={s["about.mission"]}
        leader={leader ? { name: leader.name, role: leader.role, bio: leader.bio, image: leader.image } : null}
      />

      {/* § 03 — Programmes */}
      <section aria-labelledby="s03-title" data-section-index="03" data-section-label="Programmes" className="border-t border-rule bg-pale py-24 md:py-32">
        <div className="shell">
          <div className="grid-12 gap-y-8">
            <SectionHead index="03" label="Incubation programmes" title={"Programmes for every\n*stage of a venture.*"} className="col-span-12 lg:col-span-8" />
          </div>
          <div className="mt-14">
            {programs.length ? (
              <ProgramDirectory
                programs={programs.map((p) => ({
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  summary: p.summary,
                  audience: p.audience,
                  illustration: p.illustration,
                  provisional: p.provisional,
                  acceptingApplications: p.acceptingApplications,
                }))}
              />
            ) : (
              <Pending label="Programme directory" note="Programmes are published from the administration panel." />
            )}
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-ink/20 pt-4 sm:flex-row sm:items-baseline sm:justify-between">
            {anyProvisional ? (
              <p className="max-w-[60ch] text-sm text-muted">
                Entries marked “proposed” describe intended programme categories. Formats, eligibility and timelines will be published once
                confirmed by the foundation.
              </p>
            ) : (
              <span />
            )}
            <ArrowLink href="/incubation">All programmes</ArrowLink>
          </div>
        </div>
      </section>

      <ArchivePreview startups={featured} total={total} />

      {/* § 05 — Capabilities */}
      <section aria-labelledby="s05-title" data-section-index="05" data-section-label="Capabilities" className="border-t border-rule py-24 md:py-32">
        <div className="shell">
          <div className="grid-12 gap-y-8">
            <SectionHead index="05" label="Capabilities" title={"Areas of *support.*"} className="col-span-12 lg:col-span-7" />
          </div>
          <div className="mt-14">
            <CapabilityPlan />
          </div>
        </div>
      </section>

      <People mentors={mentors} />
      <Calendar events={events.upcoming} news={news} />
      <Ecosystem partners={partners} />
      <Closing headline={s["closing.headline"]} />
    </>
  );
}
