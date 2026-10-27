"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ProgramGlyph } from "@/components/art/program-glyph";
import { Arrow } from "@/components/ui/arrow-link";

export type DirectoryProgram = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  audience: string | null;
  illustration: string;
  provisional: boolean;
  acceptingApplications: boolean;
};

function DrawOnMount({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => ref.current?.setAttribute("data-inview", "true"));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div ref={ref} data-draw className={className}>
      {children}
    </div>
  );
}

export function ProgramDirectory({ programs }: { programs: DirectoryProgram[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = programs[active];

  return (
    <div className="grid-12 gap-y-10">
      <ol className="col-span-12 border-t border-ink lg:col-span-6" aria-label="Programme directory">
        {programs.map((p, i) => {
          const selected = i === active;
          return (
            <li key={p.id} className="border-b border-rule">
              <button
                type="button"
                className="group flex w-full items-baseline gap-4 py-4 text-left md:gap-6 md:py-5"
                aria-expanded={selected}
                aria-controls={`program-detail-${p.id}`}
                onClick={() => setActive(i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className={`label w-8 shrink-0 transition-colors ${selected ? "text-blue" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`flex-1 text-[clamp(1.35rem,2.3vw,2.1rem)] font-normal leading-tight transition-[color,transform] duration-500 ease-[var(--ease-out-quint)] ${selected ? "translate-x-2 text-blue" : "text-ink group-hover:translate-x-1"}`}>
                  {p.name}
                </span>
                <span aria-hidden className={`hidden h-px self-center bg-blue transition-[width] duration-500 ease-[var(--ease-draft)] sm:block ${selected ? "w-16" : "w-0"}`} />
                {p.provisional ? <span className="label-sm hidden shrink-0 text-muted md:inline">Proposed</span> : null}
              </button>

              {/* Inline detail for small screens */}
              <div id={`program-detail-${p.id}`} className={`lg:hidden ${selected ? "block" : "hidden"}`}>
                <div className="grid grid-cols-[96px_1fr] gap-5 pb-6 sm:grid-cols-[140px_1fr]">
                  <DrawOnMount key={selected ? "on" : "off"} className="bg-white">
                    <ProgramGlyph kind={p.illustration} className="aspect-square w-full" />
                  </DrawOnMount>
                  <div>
                    <p className="text-[0.98rem] leading-relaxed text-ink">{p.summary}</p>
                    {p.audience ? <p className="mt-3 text-sm text-muted">For — {p.audience}</p> : null}
                    <Link href={`/incubation/${p.slug}`} className="group mt-4 inline-flex items-center gap-3 text-sm font-medium text-blue">
                      <span className="u-link">Programme details</span>
                      <Arrow />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Selector panel for large screens */}
      <div className="col-span-12 hidden lg:col-span-5 lg:col-start-8 lg:block">
        <div className="sticky top-[calc(var(--header-h)+32px)]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <motion.div
                key={current.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 0 100%)" }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0 0%)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
              >
                <div className="flex items-center justify-between border-b border-rule pb-2">
                  <span className="label text-blue">Programme {String(active + 1).padStart(2, "0")}</span>
                  <span className="label text-muted">{current.provisional ? "Proposed — awaiting confirmation" : current.acceptingApplications ? "Accepting applications" : "Programme"}</span>
                </div>
                <DrawOnMount className="mt-5 border border-rule bg-white">
                  <ProgramGlyph kind={current.illustration} label={`Illustration for ${current.name}`} className="aspect-square w-full" />
                </DrawOnMount>
                <p className="mt-6 max-w-[48ch] text-[1.05rem] leading-relaxed text-ink">{current.summary}</p>
                {current.audience ? (
                  <p className="mt-3 text-sm text-muted">
                    <span className="label mr-2">For</span>
                    {current.audience}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                  <Link href={`/incubation/${current.slug}`} className="group inline-flex items-center gap-3 font-medium text-ink">
                    <span className="u-link">Programme details</span>
                    <Arrow />
                  </Link>
                  {current.acceptingApplications ? (
                    <Link href={`/apply?programme=${current.slug}`} className="group inline-flex items-center gap-3 font-medium text-blue">
                      <span className="u-link">Apply</span>
                      <Arrow />
                    </Link>
                  ) : (
                    <Link href="/contact?type=FOUNDER" className="group inline-flex items-center gap-3 font-medium text-blue">
                      <span className="u-link">Enquire</span>
                      <Arrow />
                    </Link>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
