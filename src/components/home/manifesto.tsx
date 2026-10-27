import { InView } from "@/components/motion/in-view";

/** A short statement of purpose, set in the serif. */
export function Manifesto() {
  return (
    <section id="statement" aria-label="Statement of purpose" className="scroll-mt-24 bg-white py-24 md:py-36">
      <InView data-reveal className="shell relative">
        <div className="relative mx-auto max-w-[62rem] text-center">
          <span aria-hidden className="gold-rule mx-auto" />
          <p className="reveal-fade mt-10 font-[family-name:var(--font-display)] text-[clamp(1.9rem,3.6vw,3.4rem)] font-normal leading-[1.2] text-ink">
            Every lasting venture was once a fragile idea. We give ideas the structure, the people and the evidence they need to{" "}
            <em className="em-serif text-blue">stand on their own.</em>
          </p>
        </div>
      </InView>
    </section>
  );
}
