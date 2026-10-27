import Link from "next/link";
import { InView } from "@/components/motion/in-view";
import { MaskedLines } from "@/components/ui/emphasis";
import { Arrow } from "@/components/ui/arrow-link";

const PATHS = [
  { who: "Startup founders", what: "Apply for incubation", href: "/apply" },
  { who: "Students & innovators", what: "Start with a conversation", href: "/contact?type=STUDENT" },
  { who: "Mentors", what: "Offer your experience", href: "/ecosystem#mentorship" },
  { who: "Investors", what: "Meet the ventures", href: "/ecosystem#investors" },
  { who: "Industry partners", what: "Collaborate on real problems", href: "/ecosystem#industry" },
];

export function Closing({ headline }: { headline: string }) {
  return (
    <InView as="section" data-reveal data-draw amount={0.25} aria-labelledby="closing-title" className="relative overflow-hidden text-white">
      <div aria-hidden className="pour-view absolute inset-0 bg-ink" />
      <div className="shell relative grid-12 gap-y-14 py-24 md:py-32">
        <div className="col-span-12 lg:col-span-6">
          <p className="label flex items-center gap-4 text-white/70">
            <span aria-hidden className="gold-rule" />
            Get in touch
          </p>
          <div className="relative">
          <h2 id="closing-title" className="relative mt-8 text-[clamp(2.6rem,5.2vw,4.75rem)] font-normal leading-[1.05] text-white [&_em]:text-white/80">
            <MaskedLines text={headline} />
          </h2>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:self-end">
          <ul className="reveal-fade border-t border-white/25">
            {PATHS.map((p) => (
              <li key={p.href} className="border-b border-white/15">
                <Link href={p.href} className="group flex items-center justify-between gap-4 py-5">
                  <span>
                    <span className="block text-[1.12rem] font-medium text-white">{p.who}</span>
                    <span className="block text-sm text-white/60">{p.what}</span>
                  </span>
                  <Arrow className="text-white/80 group-hover:text-white" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </InView>
  );
}
