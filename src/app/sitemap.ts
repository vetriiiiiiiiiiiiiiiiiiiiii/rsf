import type { MetadataRoute } from "next";
import { EVENTS, NEWS, PROGRAMS, STARTUPS } from "@/content";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const page = (p: string, priority = 0.7) => ({ url: `${base}${p}/`.replace(/\/\/$/, "/"), changeFrequency: "weekly" as const, priority });
  return [
    page("", 1),
    ...["/about", "/incubation", "/startups", "/ecosystem", "/events", "/news", "/rsf-policy", "/contact", "/apply", "/privacy", "/terms"].map((p) => page(p)),
    ...PROGRAMS.map((p) => page(`/incubation/${p.slug}`, 0.6)),
    ...EVENTS.map((e) => page(`/events/${e.slug}`, 0.6)),
    ...STARTUPS.map((s) => page(`/startups/${s.slug}`, 0.5)),
    ...NEWS.map((n) => page(`/news/${n.slug}`, 0.5)),
  ];
}
