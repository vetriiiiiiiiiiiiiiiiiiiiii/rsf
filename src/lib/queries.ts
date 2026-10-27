import { EVENTS, NEWS, PARTNERS, PEOPLE, PROGRAMS, STARTUPS, type Event, type SiteImage } from "@/content";

/** Static content accessors. Everything is read from src/content at build time. */

export type PublicImage = SiteImage;

export const getPrograms = () => PROGRAMS;
export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug) ?? null;

export const getStartups = () => [...STARTUPS].sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
export const getStartup = (slug: string) => STARTUPS.find((s) => s.slug === slug) ?? null;
export const countPublishedStartups = () => STARTUPS.length;
export const getCategories = () => {
  const map = new Map<string, { name: string; slug: string }>();
  for (const s of STARTUPS) if (s.category) map.set(s.category.slug, s.category);
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
};

/** Event timing relative to the moment the site was built. */
export type EventStatus = "upcoming" | "live" | "past" | "tba";

export function eventStatus(e: Event, now = new Date()): EventStatus {
  if (!e.startDate) return "tba";
  const start = new Date(`${e.startDate}T00:00:00+05:30`);
  const end = new Date(`${e.endDate ?? e.startDate}T23:59:59+05:30`);
  if (now < start) return "upcoming";
  if (now > end) return "past";
  return "live";
}

export const getEvents = () => {
  const now = new Date();
  const withStatus = EVENTS.map((e) => ({ ...e, status: eventStatus(e, now) }));
  const byDate = (a: Event, b: Event) => (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999");
  return {
    upcoming: withStatus.filter((e) => e.status !== "past").sort(byDate),
    past: withStatus.filter((e) => e.status === "past").sort((a, b) => byDate(b, a)),
  };
};
export const getEvent = (slug: string) => {
  const e = EVENTS.find((x) => x.slug === slug);
  return e ? { ...e, status: eventStatus(e) } : null;
};

export const getNews = (take?: number) => [...NEWS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, take);
export const getNewsPost = (slug: string) => NEWS.find((n) => n.slug === slug) ?? null;

export const getPeople = (kind?: "LEADERSHIP" | "MENTOR") => PEOPLE.filter((p) => !kind || p.kind === kind);
export const getPartners = () => PARTNERS;
