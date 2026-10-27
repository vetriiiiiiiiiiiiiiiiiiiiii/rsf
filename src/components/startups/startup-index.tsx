"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Startup } from "@/content";
import { StartupPlate } from "@/components/art/startup-plate";
import { MediaImage } from "@/components/ui/media-image";
import { Arrow } from "@/components/ui/arrow-link";

/** Searchable, filterable list of ventures. Filtering happens in the browser. */
export function StartupIndex({ startups, categories }: { startups: Startup[]; categories: { name: string; slug: string }[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return startups.filter(
      (s) =>
        (!category || s.category?.slug === category) &&
        (!term || [s.name, s.tagline, s.description, s.founders ?? ""].some((t) => t.toLowerCase().includes(term))),
    );
  }, [startups, q, category]);

  return (
    <>
      <section aria-label="Search and filter" className="sticky top-[var(--header-h)] z-30 border-b border-rule bg-white">
        <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="search" className="flex w-full max-w-md items-center gap-3">
            <label htmlFor="q" className="label shrink-0 text-muted">
              Search
            </label>
            <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, sector, founder…" className="field-input !py-2" />
          </div>
          <div role="group" aria-label="Filter by sector" className="-mx-1 flex gap-1 overflow-x-auto pb-1">
            {[{ name: "All", slug: "" }, ...categories].map((c) => (
              <button
                key={c.slug || "all"}
                type="button"
                aria-pressed={category === c.slug}
                onClick={() => setCategory(c.slug)}
                className="label shrink-0 border border-transparent px-3 py-2 text-muted hover:text-ink aria-pressed:border-ink aria-pressed:text-ink"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="index-title" className="shell pb-24 pt-8">
        <div className="flex items-baseline justify-between border-b border-ink pb-3">
          <h2 id="index-title" className="label text-ink">
            {q || category ? "Results" : "Index"}
          </h2>
          <span className="label text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        {results.length ? (
          <ol>
            {results.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/startups/${s.slug}/`} className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 border-b border-rule py-5 md:grid-cols-[5rem_8rem_1.2fr_1.6fr_10rem_2rem]">
                  <span className="label text-blue">{String(i + 1).padStart(3, "0")}</span>
                  <span className="relative hidden aspect-[4/3] overflow-hidden md:block">
                    {s.image ? <MediaImage image={s.image} fill sizes="128px" /> : <StartupPlate name={s.name} className="h-full w-full !p-2" />}
                  </span>
                  <span className="text-[1.35rem] text-ink group-hover:text-blue">{s.name}</span>
                  <span className="col-start-2 text-muted md:col-start-auto">{s.tagline}</span>
                  <span className="label hidden text-muted md:inline">{s.category?.name ?? "—"}</span>
                  <Arrow className="col-start-3 row-start-1 text-blue md:col-start-auto md:row-start-auto" />
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="py-16">
            <p className="display-sm text-ink">No ventures match that search.</p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCategory("");
              }}
              className="u-link-static mt-4 inline-block text-blue"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
