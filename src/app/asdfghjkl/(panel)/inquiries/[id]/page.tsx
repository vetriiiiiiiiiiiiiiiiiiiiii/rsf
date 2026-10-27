import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { INQUIRY_TYPE_LABEL } from "@/lib/site";
import { deleteInquiry, updateInquiry } from "@/app/actions/admin";
import { AdminHeader } from "@/components/admin/ui";
import { StatusForm } from "@/components/admin/status-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Facts } from "@/components/layout/page-header";

export default async function InquiryPage({ params }: PageProps<"/asdfghjkl/inquiries/[id]">) {
  const admin = await requireAdmin();
  const { id } = await params;
  const q = await db.inquiry.findUnique({ where: { id } });
  if (!q) notFound();
  // Opening a new enquiry marks it as being handled.
  if (q.status === "NEW") await db.inquiry.update({ where: { id }, data: { status: "IN_PROGRESS" } });

  return (
    <>
      <AdminHeader title={q.name} kicker={INQUIRY_TYPE_LABEL[q.type]}>
        <Link href="/asdfghjkl/inquiries" className="u-link-static">
          ← All enquiries
        </Link>
      </AdminHeader>
      <div className="grid gap-12 xl:grid-cols-[1.4fr_1fr]">
        <div>
          <Facts
            items={[
              { k: "Received", v: formatDate(q.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
              { k: "Email", v: <a className="u-link-static text-blue" href={`mailto:${q.email}`}>{q.email}</a> },
              ...(q.phone ? [{ k: "Phone", v: <a className="u-link-static" href={`tel:${q.phone}`}>{q.phone}</a> }] : []),
              ...(q.organisation ? [{ k: "Organisation", v: q.organisation }] : []),
            ]}
          />
          <h2 className="label mt-10 text-muted">Message</h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink">{q.message}</p>
        </div>
        <div>
          <StatusForm
            action={updateInquiry.bind(null, q.id)}
            status={q.status === "NEW" ? "IN_PROGRESS" : q.status}
            notes={q.notes ?? ""}
            notesName="notes"
            statuses={[
              { value: "NEW", label: "New" },
              { value: "IN_PROGRESS", label: "In progress" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
          />
          {admin.role === "ADMIN" ? (
            <form action={deleteInquiry.bind(null, q.id)} className="mt-12 border-t border-rule pt-6">
              <ConfirmButton message="Permanently delete this enquiry and its personal data?">Delete enquiry</ConfirmButton>
            </form>
          ) : null}
        </div>
      </div>
    </>
  );
}
