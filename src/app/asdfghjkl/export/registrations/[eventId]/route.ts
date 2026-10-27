import { getAdmin, audit } from "@/lib/auth";
import { db } from "@/lib/db";
import { toCsv } from "@/lib/csv";

export async function GET(_req: Request, ctx: RouteContext<"/asdfghjkl/export/registrations/[eventId]">) {
  const admin = await getAdmin();
  if (!admin) return new Response("Unauthorised", { status: 401 });
  const { eventId } = await ctx.params;
  const event = await db.event.findUnique({ where: { id: eventId }, select: { slug: true } });
  if (!event) return new Response("Not found", { status: 404 });
  const rows = await db.eventRegistration.findMany({ where: { eventId }, orderBy: { createdAt: "asc" } });
  await audit(admin.id, "export", "eventRegistration", eventId, `${rows.length} rows`);
  const csv = toCsv(rows, ["createdAt", "name", "email", "phone", "organisation"]);
  return new Response(`﻿${csv}`, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="registrations-${event.slug}.csv"`, "Cache-Control": "no-store" },
  });
}
