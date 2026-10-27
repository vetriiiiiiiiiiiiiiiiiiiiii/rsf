import type { NextConfig } from "next";

/**
 * Fully static site: `npm run build` writes plain HTML, CSS, JS and images to
 * `out/`, which can be uploaded to any static host. Security headers belong in
 * the host's configuration (see public/_headers for Netlify / Cloudflare Pages).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
