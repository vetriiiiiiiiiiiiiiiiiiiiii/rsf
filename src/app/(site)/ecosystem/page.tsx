import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { MediaImage } from "@/components/ui/media-image";
import { Portrait } from "@/components/ui/portrait";
import { ArrowLink } from "@/components/ui/arrow-link";
import { issueFormToken } from "@/lib/form-guard";
import { getPartners, getPeople } from "@/lib/queries";
import { PARTNER_KIND_LABEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ecosystem",
  description: "Mentors, partners and collaboration opportunities at RS Foundation.",
};

const DOORS = [
  {
    id: "industry",
    kind: "INDUSTRY",
    type: "INDUSTRY",
    t: "Industry collaboration",
    c: "Organisations can bring real problems, data or pilot opportunities to founders equipped to work on them — and gain early access to new approaches.",
    ask: ["A defined problem statement", "A contact who can make decisions", "Openness to a pilot or proof of concept"],
  },
  {
    id: "mentorship",
    kind: "MENTORSHIP",
    type: "MENTOR",
    t: "Mentorship",
    c: "Experienced founders, operators, researchers and specialists can give structured time to early-stage teams working in their area of expertise.",
    ask: ["Practical experience in a field", "A few hours a month", "Candour and patience"],
  },
  {
    id: "investors",
    kind: "INVESTOR",
    type: "INVESTOR",
    t: "Investor engagement",
    c: "Investors can meet ventures as they become ready for capital, and help founders understand what investment-readiness genuinely requires.",
    ask: ["An investment thesis to share", "Willingness to give feedback", "Interest in early-stage ventures"],
  },
  {
    id: "institutions",
    kind: "INSTITUTIONAL",
    type: "INSTITUTIONAL",
    t: "Institutional partnerships",
    c: "Academic, public and civic institutions can collaborate on programmes, research translation and entrepreneurship education.",
    ask: ["Shared objectives", "A named point of contact", "A clear scope for collaboration"],
  },
] as const;

export default async function EcosystemPage({ searchParams }: PageProps<"/ecosystem">) {
  const sp = await searchParams;
  const [mentors, partners] = await Promise.all([getPeople("MENTOR"), getPartners()]);
  const requested = typeof sp.type === "string" ? sp.type : undefined;
  const defaultType = DOORS.some((d) => d.type === requested) ? requested : "INDUSTRY";

  return (
    <>
      <PageHeader
        index="04"
        label="Ecosystem"
        trail={[{ label: "Ecosystem" }]}
        title={"Our *ecosystem.*"}
        intro={<p>No venture is built alone. The foundation connects founders with mentors, industry, investors and institutions — each relationship listed only once it is real.</p>}
        aside={
          <nav aria-label="On this page">
            <ul className="border-t border-ink">
              {[{ id: "mentors", t: "Mentors" }, { id: "partners", t: "Partners" }, ...DOORS.map((d) => ({ id: d.id, t: d.t })), { id: "enquire", t: "Start a conversation" }].map((l, i) => (
                <li key={l.id} className="border-b border-rule">
                  <a href={`#${l.id}`} className="flex gap-4 py-2 text-sm text-ink hover:text-blue">
                    <span className="label pt-[2px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {l.t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      <section id="mentors" aria-labelledby="mentors-title" className="scroll-mt-24 py-20 md:py-28">
        <div className="shell">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 id="mentors-title" className="display-sm text-ink">
              Mentors
            </h2>
            <span className="label text-muted">{String(mentors.length).padStart(2, "0")} listed</span>
          </div>
          {mentors.length ? (
            <ul className="mt-12 grid gap-x-[var(--col-gap)] gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
              {mentors.map((m, i) => (
                <li key={m.id} className={i % 4 === 1 ? "lg:mt-16" : i % 4 === 3 ? "lg:mt-8" : ""}>
                  <Portrait image={m.image} name={m.name} sizes="(min-width:1024px) 22vw, 45vw" />
                  <p className="mt-6 text-[1.3rem] font-normal text-ink">{m.name}</p>
                  <p className="text-sm text-muted">{m.role}</p>
                  {m.expertise ? <p className="label mt-3 text-blue">{m.expertise}</p> : null}
                  {m.bio ? <p className="mt-3 text-sm leading-relaxed text-ink">{m.bio}</p> : null}
                  {m.linkedinUrl ? (
                    <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="u-link-static mt-3 inline-block text-sm text-blue">
                      Profile<span className="sr-only"> of {m.name} (opens in a new tab)</span>
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 max-w-[60ch] text-muted">Mentors will be introduced here as they join, each with their consent and an approved profile.</p>
          )}
        </div>
      </section>

      <section id="partners" aria-labelledby="partners-title" className="scroll-mt-24 border-t border-rule py-20 md:py-28">
        <div className="shell">
          <div className="flex items-baseline justify-between border-b border-ink pb-3">
            <h2 id="partners-title" className="display-sm text-ink">
              Partners
            </h2>
            <span className="label text-muted">{String(partners.length).padStart(2, "0")} confirmed</span>
          </div>
          {partners.length ? (
            <ul className="mt-10 grid grid-cols-2 border-l border-t border-rule sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((p) => {
                const inner = (
                  <>
                    <span className="label-sm text-muted">{PARTNER_KIND_LABEL[p.kind]}</span>
                    <span className="relative flex h-16 items-center justify-center">
                      {p.logo ? <MediaImage image={p.logo} fill sizes="200px" className="!object-contain" alt={`${p.name} logo`} /> : <span className="text-center font-semibold text-ink">{p.name}</span>}
                    </span>
                    <span className="text-sm text-ink">{p.name}</span>
                  </>
                );
                return (
                  <li key={p.id} className="border-b border-r border-rule">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex aspect-[4/3] flex-col justify-between p-5 transition-colors hover:bg-pale">
                        {inner}
                      </a>
                    ) : (
                      <div className="flex aspect-[4/3] flex-col justify-between p-5">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-8 max-w-[60ch] text-muted">Partner organisations will appear here once each partnership is confirmed and its logo approved for use.</p>
          )}
        </div>
      </section>

      {DOORS.map((d, i) => (
        <section key={d.id} id={d.id} aria-labelledby={`${d.id}-title`} className={`scroll-mt-24 border-t border-rule py-16 md:py-24 ${i % 2 ? "bg-pale" : ""}`}>
          <div className="shell grid-12 gap-y-8">
            <div className={`col-span-12 lg:col-span-5 ${i % 2 ? "lg:col-start-8 lg:row-start-1" : ""}`}>
              <p className="label text-blue">{String.fromCharCode(97 + i)}. {PARTNER_KIND_LABEL[d.kind]}</p>
              <h2 id={`${d.id}-title`} className="display-md mt-5 text-ink">
                {d.t}
              </h2>
            </div>
            <div className={`col-span-12 lg:col-span-5 ${i % 2 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-8"}`}>
              <p className="text-[1.05rem] leading-relaxed text-ink">{d.c}</p>
              <ul className="mt-6 border-t border-ink/30">
                {d.ask.map((a) => (
                  <li key={a} className="flex gap-3 border-b border-ink/10 py-2 text-sm text-muted">
                    <span aria-hidden className="text-blue">+</span>
                    {a}
                  </li>
                ))}
              </ul>
              <ArrowLink href={`/ecosystem?type=${d.type}#enquire`} className="mt-6">
                Enquire about {d.t.toLowerCase()}
              </ArrowLink>
            </div>
          </div>
        </section>
      ))}

      <section id="enquire" aria-labelledby="enquire-title" className="scroll-mt-24 border-t border-ink py-20 md:py-28">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <p className="label text-blue">Form E-01</p>
            <h2 id="enquire-title" className="display-md mt-5 text-ink">
              Start a conversation
            </h2>
            <p className="mt-5 max-w-[36ch] leading-relaxed text-muted">Tell us who you are and how you would like to be involved. A member of the team will reply by email.</p>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <InquiryForm key={defaultType} token={issueFormToken("inquiry")} defaultType={defaultType} types={["INDUSTRY", "MENTOR", "INVESTOR", "INSTITUTIONAL", "GENERAL"]} />
          </div>
        </div>
      </section>
    </>
  );
}
