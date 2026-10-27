"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "ready" | "counting" | "launched";

const RAYS = Array.from({ length: 24 }, (_, i) => i * 15);

/**
 * Website launch ceremony: a single button, a 3-2-1 countdown, a gold burst,
 * then the site opens. Designed for a projector or large screen.
 */
export function LaunchStage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("ready");
  const [count, setCount] = useState(3);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    router.prefetch("/");
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [router]);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  function launch() {
    if (phase !== "ready") return;
    setPhase("counting");
    setCount(3);
    later(1000, () => setCount(2));
    later(2000, () => setCount(1));
    later(3000, () => setPhase("launched"));
    later(5600, () => router.push("/"));
  }

  return (
    <main className="launch relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink text-white" data-phase={phase}>
      {/* Soft spotlight and fine rings */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_45%,rgba(42,51,130,0.95),rgba(27,34,102,1)_70%)]" />
      <svg aria-hidden viewBox="0 0 800 800" className="launch-rings pointer-events-none absolute left-1/2 top-1/2 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2" fill="none">
        {[160, 240, 330].map((r, i) => (
          <circle key={r} cx="400" cy="400" r={r} stroke="#EFBC2F" strokeOpacity={0.14 - i * 0.03} strokeWidth="1" strokeDasharray={i === 1 ? "2 10" : undefined} />
        ))}
      </svg>

      {/* Gold burst on launch */}
      <svg aria-hidden viewBox="0 0 800 800" className="launch-burst pointer-events-none absolute left-1/2 top-1/2 h-[160vmin] w-[160vmin] -translate-x-1/2 -translate-y-1/2" fill="none">
        {RAYS.map((deg) => {
          const a = (deg * Math.PI) / 180;
          const x1 = Math.round((400 + Math.cos(a) * 90) * 100) / 100;
          const y1 = Math.round((400 + Math.sin(a) * 90) * 100) / 100;
          const x2 = Math.round((400 + Math.cos(a) * 390) * 100) / 100;
          const y2 = Math.round((400 + Math.sin(a) * 390) * 100) / 100;
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#EFBC2F" strokeWidth={deg % 30 ? 1 : 2} pathLength={1} className="launch-ray" />;
        })}
      </svg>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <div className="launch-logo bg-white px-5 py-3">
          <Image src="/brand/rs-foundation-logo-tight.png" alt="R Shivakumar Foundation" width={1405} height={658} priority style={{ height: 72, width: "auto" }} />
        </div>

        {/* Ready */}
        <div className="launch-ready flex flex-col items-center">
          <p className="label mt-10 flex items-center gap-4 text-white/70">
            <span aria-hidden className="block h-px w-10 bg-gold" />
            Website launch
            <span aria-hidden className="block h-px w-10 bg-gold" />
          </p>
          <h1 className="mt-6 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.05] text-white">
            R Shivakumar <em className="em-serif text-white/85">Foundation</em>
          </h1>
          <p className="mt-5 max-w-[40ch] text-[1.1rem] leading-relaxed text-white/70">Innovation & Incubation — ideas are only the beginning.</p>
          <button
            type="button"
            onClick={launch}
            disabled={phase !== "ready"}
            className="launch-button group relative mt-14 grid h-40 w-40 place-items-center rounded-full text-[1.15rem] tracking-[0.18em] text-ink uppercase focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-gold"
          >
            <span aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#FBE3A0,#EFBC2F_45%,#B98A12)] shadow-[0_0_0_10px_rgba(239,188,47,0.15),0_0_60px_rgba(239,188,47,0.45)] transition-transform duration-500 group-hover:scale-105" />
            <span aria-hidden className="launch-pulse absolute inset-0 rounded-full border border-gold" />
            <span className="relative">Launch</span>
          </button>
          <p className="mt-8 text-sm text-white/50">Click to launch the website</p>
        </div>

        {/* Countdown */}
        <div className="launch-count absolute inset-x-0 top-1/2 -translate-y-1/2" aria-live="assertive">
          {phase === "counting" ? (
            <div key={count} className="relative mx-auto grid h-[min(60vmin,420px)] w-[min(60vmin,420px)] place-items-center">
              <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90" fill="none">
                <circle cx="100" cy="100" r="92" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                <circle cx="100" cy="100" r="92" stroke="#EFBC2F" strokeWidth="3" strokeLinecap="round" pathLength={1} className="count-ring" />
              </svg>
              <span className="count-num text-[clamp(8rem,30vmin,18rem)] leading-none text-white">{count}</span>
            </div>
          ) : null}
        </div>

        {/* Launched */}
        {phase === "launched" ? (
          <div className="launch-done absolute inset-x-0 top-1/2 -translate-y-1/2 px-6" role="status">
            <p className="label text-gold">The website is live</p>
            <p className="mt-6 text-[clamp(2.8rem,8vw,6rem)] leading-none text-white">
              Welcome<span className="em-serif text-gold">.</span>
            </p>
            <p className="mt-6 text-white/70">Opening the R Shivakumar Foundation website…</p>
          </div>
        ) : null}
      </div>

      {/* Curtain that carries the visitor into the site */}
      <div aria-hidden className="launch-curtain pointer-events-none absolute inset-0 z-20 bg-white" />
    </main>
  );
}
