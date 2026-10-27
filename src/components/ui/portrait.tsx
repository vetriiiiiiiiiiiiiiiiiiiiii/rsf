import { MediaImage } from "./media-image";
import type { PublicImage } from "@/lib/queries";

function initials(name: string) {
  return name
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

/** Portrait in a 4:5 frame. Without an approved photograph it shows the person's initials. */
export function Portrait({ image, name, className = "", sizes = "(min-width: 1024px) 30vw, 80vw" }: { image: PublicImage | null; name: string; className?: string; sizes?: string }) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-pale ${className}`}>
      {image ? (
        <MediaImage image={image} fill sizes={sizes} alt={image.alt || `Portrait of ${name}`} />
      ) : (
        <div aria-hidden className="absolute inset-0 grid place-items-center border border-rule">
          <span className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] font-normal text-blue/70">{initials(name)}</span>
        </div>
      )}
      <span aria-hidden className="absolute bottom-0 left-0 h-[3px] w-12 bg-gold" />
    </div>
  );
}
