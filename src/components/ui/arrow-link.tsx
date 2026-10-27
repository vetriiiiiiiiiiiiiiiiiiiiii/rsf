import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "solid" | "line" | "text" | "inverse" | "text-inverse";

const base = "group inline-flex items-center gap-3 font-medium transition-colors duration-300";
const variants: Record<Variant, string> = {
  solid:
    "sweep relative bg-blue text-white px-5 py-3.5 text-[0.95rem] [--sweep:var(--color-ink)]",
  line: "sweep relative border border-ink/80 px-5 py-3.5 text-[0.95rem] text-ink hover:text-white [--sweep:var(--color-ink)]",
  text: "text-ink",
  inverse:
    "sweep relative bg-white text-ink px-6 py-4 text-[1rem] [--sweep:var(--color-gold)]",
  "text-inverse": "text-white",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 10" className={`h-[10px] w-6 shrink-0 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:translate-x-1 ${className}`}>
      <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function ArrowLink({
  variant = "text",
  children,
  className = "",
  external,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; external?: boolean }) {
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...extra} {...props}>
      <span className={variant === "text" || variant === "text-inverse" ? "u-link" : ""}>{children}</span>
      <Arrow />
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </Link>
  );
}
