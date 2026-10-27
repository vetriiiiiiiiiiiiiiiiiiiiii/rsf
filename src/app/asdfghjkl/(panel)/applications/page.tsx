import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { APPLICATION_STATUS_LABEL } from "@/lib/site";
import { AdminHeader, Empty, Notice, StatusTag } from "@/components/admin/ui";
import type { ApplicationStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Applications" };

export default async function ApplicationsPage({ searchParams }: PageProps<"/asdfghjkl/applications">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = Object.keys(APPLICATION_STATUS_LABEL).find((s) => s === sp.status) as ApplicationStatus | undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const rows = await db.application.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? { OR: [{ ventureName: { contains: q, mode: "insensitive" } }, { founderName: { contains: q, mode: "insensitive" } }, { reference: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  const grouped = await db.application.groupBy({ by: ["status"], _count: true });
  const countOf = (s: string) => grouped.find((g) => g.status === s)?._count ?? 0;

  return (
    <>
      <AdminHeader
        title="Applications"
        kicker="Submissions"
        actions={
          <a href="/asdfghjkl/export/applications" className="label border border-ink px-3 py-2.5 text-ink hover:bg-ink hover:text-white">
            Export CSV
          </a>
        }
      >
        Incubation applications submitted through the public form.
      </AdminHeader>
      {sp.deleted ? <Notice tone="success">Application deleted.</Notice> : null}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          <Link href="/asdfghjkl/applications" aria-current={!status ? "page" : undefined} className="label border border-rule px-3 py-1.5 aria-[current=page]:border-ink">
            All
          </Link>
          {Object.entries(APPLICATION_STATUS_LABEL).map(([k, label]) => (
            <Link key={k} href={`/asdfghjkl/applications?status=${k}`} aria-current={status === k ? "page" : undefined} className="label border border-rule px-3 py-1.5 aria-[current=page]:border-ink">
              {label} · {countOf(k)}
            </Link>
          ))}
        </nav>
        <form role="search" className="flex max-w-xs gap-2">
          <label htmlFor="q" className="sr-only">
            Search applications
          </label>
          <input id="q" name="q" defaultValue={q} placeholder="Venture, founder, reference…" className="field-input !py-2 !text-sm" />
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <button className="label border border-ink px-3">Go</button>
        </form>
      </div>
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-ink text-left">
                {["Reference", "Venture", "Founder", "Stage", "Received", "Status"].map((h) => (
                  <th key={h} scope="col" className="label py-2 pr-4 font-normal text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-rule hover:bg-pale/60">
                  <td className="py-3 pr-4 font-mono text-xs">
                    <Link href={`/asdfghjkl/applications/${a.id}`} className="text-blue hover:underline">
                      {a.reference}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 font-medium text-ink">{a.ventureName}</td>
                  <td className="py-3 pr-4">{a.founderName}</td>
                  <td className="py-3 pr-4 text-muted">{a.stage}</td>
                  <td className="py-3 pr-4 text-muted">{formatDate(a.createdAt, { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="py-3">
                    <StatusTag value={a.status} label={APPLICATION_STATUS_LABEL[a.status]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title="No applications found.">Applications appear here when founders submit the form at /apply.</Empty>
      )}
    </>
  );
}
