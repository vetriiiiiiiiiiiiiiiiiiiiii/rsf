import Image from "next/image";
import type { PublicImage } from "@/lib/queries";

/** Renders an uploaded image through the media route with Next.js optimisation. */
export function MediaImage({
  image,
  sizes,
  className = "",
  fill = false,
  priority = false,
  alt,
}: {
  image: PublicImage;
  sizes: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  alt?: string;
}) {
  const src = `/media/${image.id}`;
  const altText = alt ?? image.alt;
  if (fill || !image.width || !image.height) {
    return <Image src={src} alt={altText} fill sizes={sizes} className={`object-cover ${className}`} priority={priority} />;
  }
  return <Image src={src} alt={altText} width={image.width} height={image.height} sizes={sizes} className={className} priority={priority} />;
}
