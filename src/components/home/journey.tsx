import { StageGlyph } from "@/components/art/stage-glyphs";
import { InView } from "@/components/motion/in-view";

const STAGES = [
  { word: "Question", copy: "Every venture begins with a question worth asking: who has this problem, and how do they solve it today?" },
  { word: "Experiment", copy: "Small, fast tests replace assumptions with evidence — conversations, sketches, prototypes and pilots." },
  { word: "Build", copy: "The idea takes form: a working product, a committed team and a first version of the business model." },
  { word: "Validate", copy: "Real users, real usage and early revenue — proof that the venture solves the problem it set out to." },
  { word: "Grow", copy: "With foundations in place, the venture prepares to scale through customers, capital and partnerships." },
];

/** The five stages of incubation, set as a measured row with a connecting hairline. */
export function Journey() {
  return (
    <InView data-draw data-reveal amount={0.2} className="relative">
      <svg aria-hidden className="pointer-events-none absolute left-0 top-[19px] hidden h-px w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 1">
        <path className="draw" style={{ "--dur": "2.2s" } as React.CSSProperties} pathLength={1} d="M0 0.5H100" stroke="#EFBC2F" strokeOpacity="0.7" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden className="journey-dot pointer-events-none absolute top-[14px] z-20 hidden h-[10px] w-[10px] rotate-45 bg-gold lg:block" />
      <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        {STAGES.map((s, i) => (
          <li key={s.word} className="reveal-item relative" style={{ "--i": i } as React.CSSProperties}>
            <span className="step-dot relative z-10 grid h-10 w-10 place-items-center rounded-full border border-blue bg-white text-sm font-medium text-blue">
              {i + 1}
            </span>
            <h3 className="mt-7 text-[1.85rem] leading-tight text-ink">{s.word}</h3>
            <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">{s.copy}</p>
            <StageGlyph stage={i} className="mt-7 w-20 opacity-80" />
          </li>
        ))}
      </ol>
    </InView>
  );
}
