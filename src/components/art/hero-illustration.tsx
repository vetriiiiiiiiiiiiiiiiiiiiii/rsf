/**
 * Hero illustration: an idea (the lightbulb) with a venture growing inside it
 * (the seedling), turned into reality by work (the gears) — the foundation's
 * purpose in one picture. White linework with gold accents, for the navy hero.
 */
const r2 = (n: number) => Math.round(n * 100) / 100;
const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

const RAYS = [-160, -130, -100, -80, -50, -20].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x1: r2(260 + Math.cos(a) * 178), y1: r2(220 + Math.sin(a) * 178), x2: r2(260 + Math.cos(a) * 212), y2: r2(220 + Math.sin(a) * 212) };
});

function gearPath(cx: number, cy: number, r: number, teeth: number) {
  let p = "";
  for (let i = 0; i < teeth; i++) {
    const a = (i * 2 * Math.PI) / teeth;
    p += `M${r2(cx + Math.cos(a) * r)} ${r2(cy + Math.sin(a) * r)}L${r2(cx + Math.cos(a) * r * 1.28)} ${r2(cy + Math.sin(a) * r * 1.28)}`;
  }
  return p;
}

export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 560" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-labelledby="hero-ill-t">
      <title id="hero-ill-t">An idea, shown as a lightbulb, with a seedling growing inside it and gears turning at its base</title>

      {/* Warm glow of the idea */}
      <circle cx="260" cy="220" r="150" fill="#EFBC2F" className="glow" />

      {/* Rays */}
      <g stroke="#EFBC2F" strokeWidth="3" className="hero-fade" style={d(1.6)}>
        {RAYS.map((r, i) => (
          <line key={i} {...r} className="ray" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </g>

      {/* Bulb */}
      <path
        className="hero-draw"
        style={{ "--d": "0.3s", "--dur": "2s" } as React.CSSProperties}
        pathLength={1}
        d="M260 70a150 150 0 0 0-84 274c18 14 28 32 28 52v24h112v-24c0-20 10-38 28-52A150 150 0 0 0 260 70Z"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      <path className="hero-draw" style={d(1.2)} pathLength={1} d="M214 446h92M222 470h76M238 494h44" stroke="#FFFFFF" strokeWidth="3" />

      {/* Seedling growing inside the idea */}
      <path className="hero-draw" style={d(1.4)} pathLength={1} d="M222 384h76" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="2.5" />
      <g className="grow-up" style={d(1.6)}>
        <path d="M260 384V246" stroke="#FFFFFF" strokeWidth="3" />
        <path className="leaf-left" style={d(2.2)} d="M260 318c-42 0-60-24-60-60 42 0 60 24 60 60Z" stroke="#FFFFFF" strokeWidth="2.5" fill="rgba(255,255,255,0.06)" />
        <path className="leaf-right" style={d(2.5)} d="M260 278c0-38 20-58 58-58 0 38-20 58-58 58Z" stroke="#EFBC2F" strokeWidth="2.5" fill="rgba(239,188,47,0.14)" />
      </g>

      {/* Gears: the work that turns an idea into a venture */}
      <g className="hero-fade" style={d(1.8)} stroke="#FFFFFF" strokeWidth="2.5">
        <g className="spin" style={{ transformOrigin: "120px 470px" }}>
          <circle cx="120" cy="470" r="34" />
          <circle cx="120" cy="470" r="11" />
          <path d={gearPath(120, 470, 34, 10)} strokeWidth="6" />
        </g>
        <g className="spin-rev" style={{ transformOrigin: "176px 420px" }}>
          <circle cx="176" cy="420" r="20" stroke="#EFBC2F" />
          <circle cx="176" cy="420" r="6" stroke="#EFBC2F" />
          <path d={gearPath(176, 420, 20, 8)} strokeWidth="5" stroke="#EFBC2F" />
        </g>
      </g>

      {/* Growth: a rising line from idea to venture */}
      <g className="hero-fade" style={d(2)}>
        <path d="M352 510h140" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" />
        <path d="M368 506v-24M396 506v-40M424 506v-58M452 506v-80" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="10" />
        <path className="hero-draw" style={d(2.3)} pathLength={1} d="M360 486l30-22 26 10 44-48M448 416h12v12" stroke="#EFBC2F" strokeWidth="3" />
      </g>
    </svg>
  );
}
