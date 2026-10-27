import Image from "next/image";
import type { SiteImage } from "@/content";

/** Renders a site image from /public. */
export function MediaImage({
  image,
  sizes,
  className = "",
  fill = false,
  priority = false,
  alt,
}: {
  image: SiteImage;
  sizes: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  alt?: string;
}) {
  const altText = alt ?? image.alt;
  if (fill) {
    return <Image src={image.src} alt={altText} fill sizes={sizes} className={`object-cover ${className}`} priority={priority} />;
  }
  return <Image src={image.src} alt={altText} width={image.width} height={image.height} sizes={sizes} className={className} priority={priority} />;
}
