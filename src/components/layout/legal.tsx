import { PageHeader } from "./page-header";

export function LegalPage({ index, title, label, updated, sections }: { index: string; title: string; label: string; updated: string; sections: { h: string; body: React.ReactNode }[] }) {
  return (
    <>
      <PageHeader index={index} label={label} trail={[{ label }]} title={title} intro={<p className="text-muted">Draft for review — last revised {updated}.</p>} />
      <div className="shell grid-12 gap-y-10 py-16 md:py-24">
        <nav aria-label="Sections" className="col-span-12 lg:col-span-3">
          <ol className="sticky top-[calc(var(--header-h)+32px)] space-y-2 border-l border-rule pl-4 text-sm">
            {sections.map((s, i) => (
              <li key={s.h}>
                <a href={`#s${i + 1}`} className="flex gap-3 text-muted hover:text-ink">
                  <span className="label-sm pt-[3px] text-blue">{String(i + 1).padStart(2, "0")}</span>
                  {s.h}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="col-span-12 lg:col-span-7 lg:col-start-5">
          <div role="note" className="mb-12 border-l-2 border-blue bg-pale p-5 text-sm leading-relaxed text-ink">
            This document is a working draft prepared alongside the website. It must be reviewed and approved by RS Foundation and its legal
            advisers before the site is launched. Items marked as pending must be completed.
          </div>
          {sections.map((s, i) => (
            <section key={s.h} id={`s${i + 1}`} className="scroll-mt-28 border-t border-rule py-8">
              <h2 className="flex gap-4 text-[1.35rem] font-normal text-ink">
                <span className="label pt-2 text-blue">{String(i + 1).padStart(2, "0")}</span>
                {s.h}
              </h2>
              <div className="prose-rsf mt-4 pl-10 text-ink">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
