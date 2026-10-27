import { MediaImage } from "@/components/ui/media-image";
import { ProgramGlyph } from "./program-glyph";

import type { SiteImage as Img } from "@/content";

/** A programme's real photograph when one has been uploaded; otherwise its illustration. */
export function ProgramVisual({
  image,
  kind,
  name,
  className = "",
  sizes = "(min-width: 1024px) 40vw, 90vw",
  priority = false,
}: {
  image: Img | null | undefined;
  kind: string;
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!image) return <ProgramGlyph kind={kind} label={`Illustration for ${name}`} className={className} />;
  return (
    <div className={`relative overflow-hidden bg-pale ${className}`}>
      <MediaImage image={image} fill sizes={sizes} priority={priority} alt={image.alt || name} className="transition-transform duration-[1.2s] ease-[var(--ease-out-quint)] hover:scale-[1.03]" />
    </div>
  );
}
