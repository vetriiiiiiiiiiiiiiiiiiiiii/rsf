/**
 * Line illustrations that depict what the foundation actually does — ideas,
 * experiments, prototypes, mentors, industry. One consistent style: navy
 * strokes with a single gold accent. Strokes use .draw / .fade so they
 * construct themselves when the nearest [data-draw] ancestor enters view.
 */

export type IconName =
  | "idea" | "question" | "experiment" | "build" | "validate" | "grow"
  | "search" | "seedling" | "incubator" | "product" | "canvas" | "mentor" | "investor" | "industry"
  | "prototype" | "research" | "engineering" | "education";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

function Gear({ cx, cy, r, delay = 0 }: { cx: number; cy: number; r: number; delay?: number }) {
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const p = (k: number) => [Math.round((cx + Math.cos(a) * r * k) * 100) / 100, Math.round((cy + Math.sin(a) * r * k) * 100) / 100];
    const [x1, y1] = p(1);
    const [x2, y2] = p(1.35);
    return `M${x1} ${y1}L${x2} ${y2}`;
  }).join("");
  return (
    <g>
      <circle className="draw" style={d(delay)} pathLength={1} cx={cx} cy={cy} r={r} />
      <path className="fade" style={d(delay + 0.3)} d={teeth} strokeWidth="3" />
      <circle className="fade" style={d(delay + 0.4)} cx={cx} cy={cy} r={r * 0.35} />
    </g>
  );
}

function Shape({ name, gold }: { name: IconName; gold: string }) {
  switch (name) {
    case "idea":
      return (
        <g>
          <path className="draw" pathLength={1} d="M32 8a16 16 0 0 0-9 29.2c2 1.5 3 3.5 3 5.8v3h12v-3c0-2.3 1-4.3 3-5.8A16 16 0 0 0 32 8Z" />
          <path className="draw" style={d(0.4)} pathLength={1} d="M26 51h12M28 56h8" />
          <path className="fade" style={d(0.7)} d="M32 2v2M50 10l-1.5 1.5M14 10l1.5 1.5M56 26h-2M8 26h2" stroke={gold} />
        </g>
      );
    case "question":
      return (
        <g>
          <path className="draw" pathLength={1} d="M10 12h44v30H30l-10 9v-9H10Z" />
          <path className="draw" style={d(0.5)} pathLength={1} d="M27 22a5 5 0 1 1 7 4.6c-1.3.6-2 1.6-2 3V31" stroke={gold} />
          <circle className="fade" style={d(0.9)} cx="32" cy="36" r="1.4" fill={gold} stroke="none" />
        </g>
      );
    case "experiment":
      return (
        <g>
          <path className="draw" pathLength={1} d="M25 8h14M28 8v16L14 50a4 4 0 0 0 3.5 6h29a4 4 0 0 0 3.5-6L36 24V8" />
          <path className="draw" style={d(0.6)} pathLength={1} d="M19 42h26" stroke={gold} />
          <circle className="fade" style={d(0.9)} cx="28" cy="49" r="2" />
          <circle className="fade" style={d(1)} cx="36" cy="46" r="1.4" />
        </g>
      );
    case "build":
      return (
        <g>
          <Gear cx={26} cy={38} r={11} />
          <g stroke={gold}>
            <Gear cx={46} cy={20} r={7} delay={0.4} />
          </g>
        </g>
      );
    case "validate":
      return (
        <g>
          <path className="draw" pathLength={1} d="M16 12h32v44H16Z" />
          <path className="draw" style={d(0.3)} pathLength={1} d="M25 8h14v8H25Z" />
          <path className="draw" style={d(0.6)} pathLength={1} d="M23 34l6 6 12-13" stroke={gold} strokeWidth="2.5" />
        </g>
      );
    case "grow":
      return (
        <g>
          <path className="draw" pathLength={1} d="M8 56h48" />
          <path className="fade" style={d(0.3)} d="M15 54V44M27 54V36M39 54V28M51 54V20" strokeWidth="5" strokeOpacity="0.25" />
          <path className="draw" style={d(0.5)} pathLength={1} d="M10 40l14-12 10 6 18-18M44 16h8v8" stroke={gold} strokeWidth="2.2" />
        </g>
      );
    case "search":
      return (
        <g>
          <circle className="draw" pathLength={1} cx="27" cy="27" r="16" />
          <path className="draw" style={d(0.4)} pathLength={1} d="M39 39l15 15" strokeWidth="3" />
          <path className="draw" style={d(0.7)} pathLength={1} d="M20 27l5 5 10-10" stroke={gold} strokeWidth="2.2" />
        </g>
      );
    case "seedling":
      return (
        <g>
          <path className="draw" pathLength={1} d="M12 54h40" />
          <path className="draw" style={d(0.3)} pathLength={1} d="M32 54V30" />
          <path className="draw" style={d(0.6)} pathLength={1} d="M32 38c-10 0-15-6-15-15 10 0 15 6 15 15Z" />
          <path className="draw" style={d(0.8)} pathLength={1} d="M32 31c0-9 5-14 14-14 0 9-5 14-14 14Z" stroke={gold} />
        </g>
      );
    case "incubator":
      return (
        <g>
          <path className="draw" pathLength={1} d="M12 48a20 20 0 0 1 40 0" />
          <path className="draw" style={d(0.3)} pathLength={1} d="M8 48h48v7H8Z" />
          <path className="draw" style={d(0.6)} pathLength={1} d="M32 48V36M32 40c-5 0-7-3-7-7 5 0 7 3 7 7ZM32 37c0-5 3-7 7-7 0 5-3 7-7 7Z" stroke={gold} />
        </g>
      );
    case "product":
      return (
        <g>
          <path className="draw" pathLength={1} d="M14 14h36v26H14Z" />
          <path className="draw" style={d(0.3)} pathLength={1} d="M8 46h48l-4 6H12Z" />
          <path className="fade" style={d(0.6)} d="M20 22h14M20 28h20M20 34h10" stroke={gold} />
        </g>
      );
    case "canvas":
      return (
        <g>
          <path className="draw" pathLength={1} d="M8 12h48v40H8Z" />
          <path className="fade" style={d(0.4)} d="M20 12v28M32 12v28M44 12v28M8 40h48M32 40v12M20 26h12M44 26h12" />
          <path className="fade" style={d(0.7)} d="M32 12h12v28H32Z" fill={gold} fillOpacity="0.18" stroke="none" />
        </g>
      );
    case "mentor":
      return (
        <g>
          <circle className="draw" pathLength={1} cx="22" cy="22" r="6" />
          <path className="draw" style={d(0.2)} pathLength={1} d="M11 52c0-9 5-15 11-15s11 6 11 15" />
          <circle className="draw" style={d(0.4)} pathLength={1} cx="44" cy="26" r="5" stroke={gold} />
          <path className="draw" style={d(0.6)} pathLength={1} d="M35 52c0-7 4-12 9-12s9 5 9 12" stroke={gold} />
          <path className="fade" style={d(0.9)} d="M30 14h14v8h-8l-4 3v-3h-2Z" />
        </g>
      );
    case "investor":
      return (
        <g>
          <circle className="draw" pathLength={1} cx="26" cy="34" r="16" />
          <path className="draw" style={d(0.4)} pathLength={1} d="M20 26h12M20 31h12M24 26c6 0 6 10 0 10h-3l9 9" />
          <path className="draw" style={d(0.7)} pathLength={1} d="M44 22l10-10M46 12h8v8" stroke={gold} strokeWidth="2.2" />
        </g>
      );
    case "industry":
      return (
        <g>
          <path className="draw" pathLength={1} d="M8 54V32l12 8v-8l12 8v-8l12 8V14h8v40Z" />
          <path className="fade" style={d(0.5)} d="M14 46h4M24 46h4M34 46h4" stroke={gold} strokeWidth="2.5" />
          <path className="fade" style={d(0.7)} d="M48 10c0-3 3-4 3-7" />
        </g>
      );
    case "prototype":
      return (
        <g>
          <path className="draw" pathLength={1} d="M32 8l20 11v24L32 56 12 43V19Z" />
          <path className="draw" style={d(0.4)} pathLength={1} d="M12 19l20 12 20-12M32 31v25" />
          <path className="fade" style={d(0.7)} d="M32 31l20-12v24L32 56Z" fill={gold} fillOpacity="0.2" stroke="none" />
        </g>
      );
    case "research":
      return (
        <g>
          <path className="draw" pathLength={1} d="M14 56h36M22 48h20" />
          <path className="draw" style={d(0.3)} pathLength={1} d="M29 8l10 5-10 22-10-5Z" />
          <path className="draw" style={d(0.5)} pathLength={1} d="M34 30c8 3 10 12 4 18M26 40v8" />
          <circle className="fade" style={d(0.8)} cx="22" cy="40" r="3" stroke={gold} />
        </g>
      );
    case "engineering":
      return (
        <g>
          <path className="draw" pathLength={1} d="M20 20h24v24H20Z" />
          <path className="fade" style={d(0.4)} d="M26 14v6M32 14v6M38 14v6M26 44v6M32 44v6M38 44v6M14 26h6M14 32h6M14 38h6M44 26h6M44 32h6M44 38h6" />
          <path className="draw" style={d(0.6)} pathLength={1} d="M26 26h12v12H26Z" stroke={gold} />
        </g>
      );
    case "education":
      return (
        <g>
          <path className="draw" pathLength={1} d="M4 26l28-12 28 12-28 12Z" />
          <path className="draw" style={d(0.4)} pathLength={1} d="M15 31v11c0 4 8 8 17 8s17-4 17-8V31" />
          <path className="draw" style={d(0.7)} pathLength={1} d="M60 26v14" stroke={gold} strokeWidth="2.2" />
        </g>
      );
  }
}

export function ContentIcon({
  name,
  className = "",
  tone = "light",
  label,
}: {
  name: IconName;
  className?: string;
  tone?: "light" | "dark";
  label?: string;
}) {
  const ink = tone === "dark" ? "#FFFFFF" : "#2A3382";
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke={ink}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Shape name={name} gold="#D9A520" />
    </svg>
  );
}
