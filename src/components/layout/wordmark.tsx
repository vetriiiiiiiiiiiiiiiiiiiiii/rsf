/**
 * Provisional typographic identity — to be replaced with the approved logo.
 * The glyph is a compass construction: a square, a quarter arc drawn from
 * its corner, and the point where the idea begins.
 */
export function Wordmark({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "white" }) {
  const color = tone === "white" ? "text-white" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2.5 ${color} ${className}`}>
      <svg aria-hidden viewBox="0 0 24 24" className="h-[22px] w-[22px] shrink-0">
        <rect x="0.6" y="0.6" width="22.8" height="22.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M0.6 23.4A22.8 22.8 0 0 1 23.4 0.6" fill="none" stroke={tone === "white" ? "#F4F5FA" : "#2A3382"} strokeWidth="1.4" />
        <circle cx="0.6" cy="23.4" r="2.6" fill={tone === "white" ? "#F4F5FA" : "#2A3382"} />
      </svg>
      <span className="whitespace-nowrap text-[1.02rem] leading-none">
        <span className="font-bold">RS</span> <span className="font-normal">Foundation</span>
      </span>
    </span>
  );
}
