import Image from "next/image";

// Official logo, trimmed of its transparent margin so it can be set at size.
const SRC = "/brand/rs-foundation-logo-tight.png";
const W = 1405;
const H = 658;

/**
 * The official logo, shown on its own white ground — like the title block of
 * a drawing — so the navy-and-gold mark keeps its colours on both white pages
 * and the blueprint bands.
 */
export function BrandLogo({ className = "", height = 44, priority = false, plate = true }: { className?: string; height?: number; priority?: boolean; plate?: boolean }) {
  return (
    <span className={`inline-flex items-center ${plate ? "bg-white px-3 py-2" : ""} ${className}`}>
      <Image
        src={SRC}
        alt="R Shivakumar Foundation"
        width={W}
        height={H}
        priority={priority}
        sizes={`${Math.round((height * W) / H)}px`}
        style={{ height, width: "auto" }}
      />
    </span>
  );
}
