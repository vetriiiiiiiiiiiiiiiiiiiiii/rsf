import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { INQUIRY_TYPE_LABEL } from "@/lib/site";
import { AdminHeader, Empty, Notice, StatusTag } from "@/components/admin/ui";
import type { InquiryStatus } from "@/generated/prisma/enums";

const FILTERS = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"] as const;

export const metadata = { title: "Enquiries" };

export default async function InquiriesPage({ searchParams }: PageProps<"/asdfghjkl/inquiries">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = FILTERS.find((f) => f === sp.status) as InquiryStatus | undefined;
  const rows = await db.inquiry.findMany({ where: status ? { status } : { status: { not: "ARCHIVED" } }, orderBy: { createdAt: "desc" }, take: 500 });

  return (
    <>
      <AdminHeader title="Enquiries" kicker="Submissions">Messages from the contact and ecosystem forms.</AdminHeader>
      {sp.deleted ? <Notice tone="success">Enquiry deleted.</Notice> : null}
      <nav aria-label="Filter" className="mb-6 flex flex-wrap gap-2">
        <Link href="/asdfghjkl/inquiries" aria-current={!status ? "page" : undefined} className="label border border-rule px-3 py-1.5 aria-[current=page]:border-ink">
          Open
        </Link>
        {FILTERS.map((f) => (
          <Link key={f} href={`/asdfghjkl/inquiries?status=${f}`} aria-current={status === f ? "page" : undefined} className="label border border-rule px-3 py-1.5 aria-[current=page]:border-ink">
            {f.replace("_", " ")}
          </Link>
        ))}
      </nav>
      {rows.length ? (
        <ul className="border-t border-ink">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/asdfghjkl/inquiries/${r.id}`} className="grid gap-2 border-b border-rule py-3 text-sm hover:bg-pale md:grid-cols-[8rem_12rem_1fr_7rem]">
                <span className="label-sm pt-[3px] text-muted">{formatDate(r.createdAt, { day: "2-digit", month: "short", year: "numeric" })}</span>
                <span className="font-medium text-ink">{r.name}</span>
                <span className="truncate text-muted">
                  <span className="text-ink">{INQUIRY_TYPE_LABEL[r.type]}</span> — {r.message}
                </span>
                <span className="md:text-right">
                  <StatusTag value={r.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="No enquiries here.">Enquiries appear when visitors submit the contact or ecosystem forms.</Empty>
      )}
    </>
  );
}
