"use client";

import { useEffect, useState } from "react";

const WHO = ["founders", "students", "researchers", "innovators", "mentors"];

/** “For founders / students / …” — each word rolls up into place from beneath a mask. */
export function HeroCycler() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % WHO.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <p className="flex items-baseline gap-3 font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.2vw,1.9rem)] text-white/70">
      <span>An institution for</span>
      <span className="relative inline-grid h-[1.3em] overflow-hidden align-bottom" aria-live="off">
        {WHO.map((w, k) => (
          <span
            key={w}
            aria-hidden={k !== i}
            className="col-start-1 row-start-1 italic text-gold transition-[transform,opacity] duration-700 ease-[var(--ease-out-quint)]"
            style={{ transform: `translateY(${k === i ? 0 : k === (i - 1 + WHO.length) % WHO.length ? -110 : 110}%)`, opacity: k === i ? 1 : 0 }}
          >
            {w}.
          </span>
        ))}
      </span>
    </p>
  );
}
