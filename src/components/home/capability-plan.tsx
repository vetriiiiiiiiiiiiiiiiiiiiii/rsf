import { InView } from "@/components/motion/in-view";
import { ContentIcon, type IconName } from "@/components/art/content-icons";

const AREAS: { name: string; icon: IconName; copy: string }[] = [
  { name: "Prototype development", icon: "prototype", copy: "Turning concepts into something testable — sketches, models and working prototypes that can be put in front of users." },
  { name: "Research & experimentation", icon: "research", copy: "Structured inquiry into problems and markets, so that decisions rest on evidence rather than assumption." },
  { name: "Product engineering", icon: "engineering", copy: "Moving from prototype to product: architecture, reliability and the discipline of building for real users." },
  { name: "Mentorship", icon: "mentor", copy: "Founders working alongside practitioners who have built, operated and invested — at the centre of every programme." },
  { name: "Industry engagement", icon: "industry", copy: "Connections to organisations with real problems, real data and real routes to market." },
  { name: "Entrepreneurship education", icon: "education", copy: "Workshops and sessions that make the methods of venture building accessible to students and first-time founders." },
];

/** The six areas of support, each with an illustration of the work it describes. */
export function CapabilityPlan() {
  return (
    <InView data-reveal data-draw amount={0.15}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((a, i) => (
          <li key={a.name} className="reveal-item lift border border-rule bg-white p-7" style={{ "--i": i } as React.CSSProperties}>
            <div className="grid h-16 w-16 place-items-center rounded-full bg-pale">
              <ContentIcon name={a.icon} className="w-10" />
            </div>
            <h3 className="mt-6 text-[1.5rem] leading-tight text-ink">{a.name}</h3>
            <p className="mt-3 leading-relaxed text-muted">{a.copy}</p>
          </li>
        ))}
      </ul>
      <p className="reveal-fade mt-8 max-w-[70ch] text-sm leading-relaxed text-muted">
        Areas of work, described as intentions. Specific facilities, equipment and resources will be listed here once confirmed by the foundation.
      </p>
    </InView>
  );
}
