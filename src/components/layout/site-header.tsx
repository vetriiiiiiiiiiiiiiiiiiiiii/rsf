"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/site";
import { Wordmark } from "./wordmark";
import { BrandLogo } from "./brand-logo";
import { Arrow } from "@/components/ui/arrow-link";

export function SiteHeader({ hasLogo = false }: { hasLogo?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Every public page opens on a blueprint band; the header floats over it
  // (transparent, white type) until the band has been scrolled past.
  const isHome = pathname === "/";
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > (isHome ? window.innerHeight * 0.82 : 160));
      // Tuck the header away while reading down the page; bring it back on any upward scroll.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);
  // The header is always a clean white bar; the hero begins beneath it.
  const overDark = false;

  // Close the overlay on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.documentElement.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll<HTMLElement>("a, button")];
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 h-[var(--header-h)] transition-[background-color,box-shadow,color,transform] duration-500 ${
        hidden && !open ? "-translate-y-full" : ""
      } ${
        overDark ? "bg-transparent text-white" : "bg-white text-ink"
      } ${scrolled ? "shadow-[0_1px_0_0_var(--color-rule)]" : ""}`}
    >
      <a href="#main" className="sr-only-focusable absolute left-4 top-3 z-50 bg-blue px-3 py-2 text-white">
        Skip to content
      </a>
      <div className="shell flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label="R Shivakumar Foundation — home" className="relative z-[60]">
          {hasLogo ? <BrandLogo height={54} priority plate={open} className={open ? "-ml-3" : ""} /> : <Wordmark tone={open || overDark ? "white" : "ink"} />}
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-[clamp(1rem,2vw,2.25rem)]">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="group inline-flex items-start text-[0.92rem] font-medium tracking-[0.01em] text-current"
                >
                  <span className="nav-arc">
                    {item.label}
                    <svg aria-hidden viewBox="0 0 100 8" preserveAspectRatio="none">
                      <path d="M2 2 C 30 9, 70 9, 98 1" pathLength={1} fill="none" stroke="#EFBC2F" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/apply"
            className={`group hidden items-center gap-3 whitespace-nowrap px-4 py-2.5 text-[0.88rem] font-medium transition-colors sm:inline-flex ${
              overDark ? "bg-white text-ink hover:bg-pale" : "sweep bg-blue text-white [--sweep:var(--color-ink)]"
            }`}
          >
            Apply for Incubation
            <Arrow />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={`relative z-[60] inline-flex h-10 items-center gap-2.5 px-1 xl:hidden ${open || overDark ? "text-white" : "text-ink"}`}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="label">{open ? "Close" : "Index"}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-white xl:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="shell relative flex flex-1 flex-col pb-8 pt-[calc(var(--header-h)+24px)]">
              <p className="label text-white/60">Index — R Shivakumar Foundation</p>
              <nav aria-label="Mobile" className="mt-6 flex-1">
                <ul className="border-t border-white/20">
                  {[{ href: "/", label: "Home", index: "00" }, ...NAV].map((item, i) => (
                    <motion.li
                      key={item.href}
                      className="border-b border-white/20"
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.045, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className="flex items-baseline justify-between gap-4 py-3.5"
                      >
                        <span className="font-[family-name:var(--font-display)] text-[clamp(1.9rem,8vw,2.8rem)] font-normal leading-none">
                          {item.label}
                        </span>
                        
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="mt-8 flex flex-col gap-6">
                <Link href="/apply" className="group inline-flex items-center justify-between bg-white px-5 py-4 font-medium text-ink">
                  Apply for Incubation
                  <Arrow />
                </Link>
                <p className="label text-white/60">Tiruchirappalli, Tamil Nadu</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
