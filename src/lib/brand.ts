import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/** The official R Shivakumar Foundation logo (monogram + name), supplied by the foundation. */
export const LOGO = { src: "/brand/rs-foundation-logo-tight.png", width: 1405, height: 658 } as const;

let cached: boolean | undefined;
/** True once the logo file has been placed in public/brand/. Until then the provisional wordmark is used. */
export function hasLogo() {
  if (cached === undefined || process.env.NODE_ENV !== "production") {
    cached = existsSync(path.join(/*turbopackIgnore: true*/ process.cwd(), "public", LOGO.src));
  }
  return cached;
}
