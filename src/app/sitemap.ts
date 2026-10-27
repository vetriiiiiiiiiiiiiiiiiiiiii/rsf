import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const statics = ["", "/about", "/incubation", "/startups", "/ecosystem", "/events", "/news", "/contact", "/apply", "/privacy", "/terms"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const published = { where: { status: "PUBLISHED" as const }, select: { slug: true, updatedAt: true } };
  const [programs, startups, events, news] = await Promise.all([
    db.program.findMany(published),
    db.startup.findMany(published),
    db.event.findMany(published),
    db.newsPost.findMany(published),
  ]);
  const entries = (prefix: string, rows: { slug: string; updatedAt: Date }[]) => rows.map((r) => ({ url: `${base}${prefix}/${r.slug}`, lastModified: r.updatedAt }));
  return [...statics, ...entries("/incubation", programs), ...entries("/startups", startups), ...entries("/events", events), ...entries("/news", news)];
}
