import "server-only";
import { cache } from "react";
import { db } from "./db";
import type { Prisma } from "@/generated/prisma/client";

const PUBLISHED = { status: "PUBLISHED" } as const;
const image = { select: { id: true, alt: true, width: true, height: true } } as const;

export const getPrograms = cache(() =>
  db.program.findMany({ where: PUBLISHED, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
);

export const getProgram = cache((slug: string) => db.program.findFirst({ where: { slug, ...PUBLISHED } }));

export const getCategories = cache(() =>
  db.startupCategory.findMany({
    where: { startups: { some: PUBLISHED } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  }),
);

export async function getStartups(filter: { q?: string; category?: string } = {}) {
  const where: Prisma.StartupWhereInput = { ...PUBLISHED };
  if (filter.category) where.category = { slug: filter.category };
  if (filter.q) {
    where.OR = [
      { name: { contains: filter.q, mode: "insensitive" } },
      { tagline: { contains: filter.q, mode: "insensitive" } },
      { description: { contains: filter.q, mode: "insensitive" } },
      { founders: { contains: filter.q, mode: "insensitive" } },
    ];
  }
  return db.startup.findMany({
    where,
    include: { category: true, image },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { name: "asc" }],
  });
}

export const getStartup = cache((slug: string) =>
  db.startup.findFirst({ where: { slug, ...PUBLISHED }, include: { category: true, image } }),
);

export async function countPublishedStartups() {
  return db.startup.count({ where: PUBLISHED });
}

export const getEvents = cache(async () => {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    db.event.findMany({
      where: { ...PUBLISHED, OR: [{ startsAt: { gte: now } }, { endsAt: { gte: now } }] },
      orderBy: { startsAt: "asc" },
      include: { image },
    }),
    db.event.findMany({
      where: { ...PUBLISHED, startsAt: { lt: now }, OR: [{ endsAt: null }, { endsAt: { lt: now } }] },
      orderBy: { startsAt: "desc" },
      include: { image },
      take: 24,
    }),
  ]);
  return { upcoming, past };
});

export const getEvent = cache((slug: string) =>
  db.event.findFirst({ where: { slug, ...PUBLISHED }, include: { image, _count: { select: { registrations: true } } } }),
);

export const getNews = cache((take?: number) =>
  db.newsPost.findMany({ where: { ...PUBLISHED, publishedAt: { lte: new Date() } }, orderBy: { publishedAt: "desc" }, include: { image }, take }),
);

export const getNewsPost = cache((slug: string) =>
  db.newsPost.findFirst({ where: { slug, ...PUBLISHED, publishedAt: { lte: new Date() } }, include: { image } }),
);

export const getPeople = cache((kind?: "LEADERSHIP" | "MENTOR") =>
  db.person.findMany({ where: { ...PUBLISHED, ...(kind ? { kind } : {}) }, orderBy: [{ order: "asc" }, { name: "asc" }], include: { image } }),
);

export const getPartners = cache(() =>
  db.partner.findMany({ where: PUBLISHED, orderBy: [{ order: "asc" }, { name: "asc" }], include: { logo: image } }),
);

export type PublicImage = { id: string; alt: string; width: number | null; height: number | null };
