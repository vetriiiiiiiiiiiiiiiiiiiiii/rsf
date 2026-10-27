import { getAdmin, audit } from "@/lib/auth";
import { db } from "@/lib/db";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return new Response("Unauthorised", { status: 401 });
  const rows = await db.application.findMany({ orderBy: { createdAt: "desc" } });
  await audit(admin.id, "export", "application", undefined, `${rows.length} rows`);
  const csv = toCsv(rows, ["reference", "createdAt", "status", "founderName", "email", "phone", "institution", "city", "ventureName", "sector", "stage", "programSlug", "teamSize", "website", "problem", "solution", "team", "support", "internalNotes"]);
  return new Response(`﻿${csv}`, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
  });
}
