import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "R Shivakumar Foundation — Ideas are only the beginning.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), "public/brand/rs-foundation-logo.png")).catch(() => null);
  const logoSrc = logo ? `data:image/png;base64,${logo.toString("base64")}` : null;
  const grid = Array.from({ length: 50 }, (_, i) => i * 24);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fff", position: "relative", padding: 64, flexDirection: "column", justifyContent: "space-between" }}>
        <svg width="1200" height="630" style={{ position: "absolute", top: 0, left: 0 }}>
          {grid.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={630} stroke="#F4F5FA" />
          ))}
          {grid.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={1200} y2={y} stroke="#F4F5FA" />
          ))}
          <circle cx="930" cy="330" r="210" fill="none" stroke="#2A3382" strokeWidth="1.5" />
          <circle cx="930" cy="330" r="150" fill="none" stroke="#5866B8" strokeWidth="1" strokeDasharray="3 8" />
          <line x1="760" y1="200" x2="960" y2="150" stroke="#2A3382" />
          <line x1="1100" y1="250" x2="960" y2="150" stroke="#2A3382" />
          <line x1="930" y1="480" x2="960" y2="150" stroke="#2A3382" />
          <circle cx="960" cy="150" r="8" fill="#2A3382" />
        </svg>
        {logoSrc ? (
          <img src={logoSrc} width={250} height={125} alt="" />
        ) : (
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: "#2A3382", fontFamily: "monospace" }}>R SHIVAKUMAR FOUNDATION / INNOVATION &amp; INCUBATION</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95, color: "#1B2266" }}>
          <span>Ideas are</span>
          <span>only the</span>
          <span style={{ color: "#2A3382" }}>beginning.</span>
        </div>
      </div>
    ),
    size,
  );
}
