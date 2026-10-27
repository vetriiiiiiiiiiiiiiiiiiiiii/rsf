import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyArchive } from "@/components/home/sections";
import { StartupPlate } from "@/components/art/startup-plate";
import { MediaImage } from "@/components/ui/media-image";
import { Arrow } from "@/components/ui/arrow-link";
import { InView } from "@/components/motion/in-view";
import { countPublishedStartups, getCategories, getStartups } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Startups",
  description: "The archive of ventures developed with RS Foundation.",
};

export default async function StartupsPage({ searchParams }: PageProps<"/startups">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const category = typeof sp.category === "string" ? sp.category.slice(0, 80) : "";
  const [startups, categories, total] = await Promise.all([getStartups({ q, category }), getCategories(), countPublishedStartups()]);
  const filtered = Boolean(q || category);
  const featured = filtered ? [] : startups.filter((s) => s.featured).slice(0, 3);
  const ratios = ["aspect-[4/5]", "aspect-[16/11]", "aspect-[3/4]"];

  return (
    <>
      <PageHeader
        index="03"
        label="Startups"
        trail={[{ label: "Startups" }]}
        title={"Startup *portfolio.*"}
        intro={<p>Ventures developed with RS Foundation, recorded as they are verified — the problem each one addresses, the people building it, and where it stands.</p>}
        aside={
          <div className="flex items-baseline justify-between border-t border-ink pt-3">
            <span className="label text-muted">Entries on record</span>
            <span className="text-4xl font-semibold tabular-nums tracking-tight text-ink">{String(total).padStart(3, "0")}</span>
          </div>
        }
      />

      {total === 0 ? (
        <section className="shell py-16 md:py-24">
          <EmptyArchive />
        </section>
      ) : (
        <>
          {/* Search & filter — plain GET form so it works without JavaScript */}
          <section aria-label="Search and filter" className="sticky top-[var(--header-h)] z-30 border-b border-rule bg-white/95 backdrop-blur-[2px]">
            <div className="shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <form role="search" className="flex w-full max-w-md items-center gap-3" action="/startups">
                <label htmlFor="q" className="label shrink-0 text-muted">
                  Search
                </label>
                <input id="q" name="q" defaultValue={q} placeholder="Name, sector, founder…" className="field-input !py-2" />
                {category ? <input type="hidden" name="category" value={category} /> : null}
                <button type="submit" className="label shrink-0 border border-ink px-3 py-2 text-ink hover:bg-ink hover:text-white">
                  Go
                </button>
              </form>
              <nav aria-label="Filter by sector" className="-mx-1 flex gap-1 overflow-x-auto pb-1">
                <Link href={q ? `/startups?q=${encodeURIComponent(q)}` : "/startups"} aria-current={!category ? "page" : undefined} className="label shrink-0 border border-transparent px-3 py-2 text-muted hover:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink">
                  All
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/startups?category=${c.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                    aria-current={category === c.slug ? "page" : undefined}
                    className="label shrink-0 border border-transparent px-3 py-2 text-muted hover:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </div>
          </section>

          {featured.length ? (
            <section aria-labelledby="featured" className="shell py-16 md:py-24">
              <h2 id="featured" className="label text-blue">
                Featured ventures
              </h2>
              <ul className="grid-12 mt-8 gap-y-12">
                {featured.map((s, i) => (
                  <li key={s.id} className={`col-span-12 sm:col-span-6 ${["lg:col-span-5", "lg:col-span-4 lg:col-start-7 lg:mt-24", "lg:col-span-3 lg:col-start-10 lg:-mt-12"][i]}`}>
                    <Link href={`/startups/${s.slug}`} className="group block">
                      <InView data-crop className={`relative overflow-hidden ${ratios[i]}`}>
                        {s.image ? (
                          <MediaImage image={s.image} fill sizes="(min-width:1024px) 40vw, 90vw" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                        ) : (
                          <StartupPlate name={s.name} ratio={["4/5", "16/11", "3/4"][i]} className="h-full w-full" />
                        )}
                      </InView>
                      <p className="label mt-4 text-muted">{s.category?.name ?? "Unclassified"}</p>
                      <p className="display-sm mt-1 text-ink group-hover:text-blue">{s.name}</p>
                      <p className="mt-1 text-muted">{s.tagline}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="index-title" className="shell pb-24 pt-8">
            <div className="flex items-baseline justify-between border-b border-ink pb-3">
              <h2 id="index-title" className="label text-ink">
                {filtered ? "Results" : "Index"}
              </h2>
              <span className="label text-muted" aria-live="polite">
                {startups.length} {startups.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            {startups.length ? (
              <ol>
                {startups.map((s, i) => (
                  <li key={s.id} className="relative">
                    <Link href={`/startups/${s.slug}`} className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-4 border-b border-rule py-5 md:grid-cols-[5rem_1.2fr_1.6fr_10rem_4rem_2rem]">
                      <span className="label text-blue">{String(i + 1).padStart(3, "0")}</span>
                      <span className="text-[1.35rem] font-normal text-ink group-hover:text-blue">{s.name}</span>
                      <span className="col-start-2 text-muted md:col-start-auto">{s.tagline}</span>
                      <span className="label hidden text-muted md:inline">{s.category?.name ?? "—"}</span>
                      <span className="label hidden tabular-nums text-muted md:inline">{s.foundedYear ?? "—"}</span>
                      <Arrow className="col-start-3 row-start-1 text-blue md:col-start-auto md:row-start-auto" />
                    </Link>
                    {/* Hover preview (pointer devices only) */}
                    <div aria-hidden className="pointer-events-none absolute right-24 top-1/2 z-10 hidden aspect-[4/3] w-56 -translate-y-1/2 overflow-hidden opacity-0 shadow-[0_0_0_1px_var(--color-rule)] transition-opacity duration-300 xl:block [li:hover>&]:opacity-100">
                      {s.image ? <MediaImage image={s.image} fill sizes="224px" /> : <StartupPlate name={s.name} ratio="4/3" className="h-full w-full" />}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="py-16">
                <p className="display-sm text-ink">No ventures match that search.</p>
                <Link href="/startups" className="u-link-static mt-4 inline-block text-blue">
                  Clear filters
                </Link>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
