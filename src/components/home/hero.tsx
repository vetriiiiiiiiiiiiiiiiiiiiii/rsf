import { HeroIllustration } from "@/components/art/hero-illustration";
import { HeroCycler } from "./hero-cycler";
import { ArrowLink } from "@/components/ui/arrow-link";
import { parseEmphasis } from "@/lib/format";

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

export function Hero({ eyebrow, headline, body }: { eyebrow: string; headline: string; body: string }) {
  const lines = parseEmphasis(headline);
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden text-white">
      <div aria-hidden className="pour absolute inset-0 bg-ink" />
      {/* The idea, growing into a venture. */}
      <div className="pointer-events-none absolute inset-y-0 right-[-38vw] flex items-center sm:right-[-16vw] lg:right-[4vw]">
        <HeroIllustration className="h-[min(78svh,700px)] w-auto max-w-none opacity-[0.12] lg:opacity-100" />
      </div>

      <div className="shell relative flex min-h-[calc(100svh-var(--header-h)-5.5rem)] flex-col justify-center py-16 md:py-20">
        <div className="max-w-[46rem]">
          <p className="hero-fade label flex items-center gap-4 text-white/75" style={d("0.15s")}>
            <span aria-hidden className="gold-rule rule-grow" />
            {eyebrow}
          </p>

          <div className="relative">
          <h1 id="hero-title" className="relative mt-9 text-[clamp(3rem,7vw,6.75rem)] font-normal leading-[1.02] text-white">
            {lines.map((parts, i) => (
              <span key={i} className="mask-line hero-rise" style={{ "--i": i } as React.CSSProperties}>
                <span>
                  {parts.map((p, j) =>
                    p.em ? (
                      <em key={j} className="em-serif text-white/85">
                        {p.text}
                      </em>
                    ) : (
                      <span key={j}>{p.text}</span>
                    ),
                  )}
                </span>
              </span>
            ))}
          </h1>
          </div>

          <div className="hero-fade mt-8" style={d("0.65s")}>
            <HeroCycler />
          </div>

          <p className="hero-fade mt-7 max-w-[36rem] text-[1.12rem] leading-relaxed text-white/80" style={d("0.8s")}>
            {body}
          </p>
          <div className="hero-fade mt-11 flex flex-wrap items-center gap-x-9 gap-y-5" style={d("0.95s")}>
            <ArrowLink href="/incubation" variant="inverse">
              Incubation programmes
            </ArrowLink>
            <ArrowLink href="/startups" variant="text-inverse">
              Explore the ecosystem
            </ArrowLink>
          </div>
        </div>
      </div>
      {/* Focus strip and scroll cue */}
      <div className="shell relative">
        <div className="hero-fade flex items-end justify-between gap-8 border-t border-white/15 py-6" style={d("1.3s")}>
          <ul className="grid flex-1 gap-4 text-sm text-white/70 sm:grid-cols-3 sm:gap-10">
            {["Incubation & mentorship", "Prototype & product development", "Industry & investor connections"].map((t, i) => (
              <li key={t} className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-display)] text-lg italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </ul>
          <a href="#statement" className="group hidden shrink-0 flex-col items-center gap-2 text-white/70 hover:text-white md:flex">
            <span className="label">Scroll</span>
            <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-white/25">
              <span className="ink-drop absolute -left-[2px] top-0 h-[6px] w-[5px] rounded-full bg-gold" />
            </span>
          </a>
        </div>
      </div>
      <div aria-hidden className="relative h-px bg-gold/60" />
    </section>
  );
}
