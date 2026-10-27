"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

type Props<T extends ElementType> = {
  as?: T;
  /** Fraction of the element that must be visible before it is marked in view. */
  amount?: number;
  /** Set to true to toggle back when the element leaves the viewport. */
  repeat?: boolean;
} & ComponentPropsWithoutRef<T>;

/**
 * Marks an element with data-inview="true" once it enters the viewport.
 * All visual behaviour lives in CSS (see globals.css), so content is fully
 * visible without JavaScript and under prefers-reduced-motion.
 */
export function InView<T extends ElementType = "div">({ as, amount = 0.25, repeat = false, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = "true";
          if (!repeat) io.disconnect();
        } else if (repeat) {
          el.dataset.inview = "false";
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount, repeat]);

  return <Tag ref={ref} {...rest} />;
}
