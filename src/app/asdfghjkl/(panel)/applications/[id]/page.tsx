import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { APPLICATION_STATUS_LABEL } from "@/lib/site";
import { deleteApplication, updateApplication } from "@/app/actions/admin";
import { AdminHeader, StatusTag } from "@/components/admin/ui";
import { StatusForm } from "@/components/admin/status-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Facts } from "@/components/layout/page-header";

export default async function ApplicationPage({ params }: PageProps<"/asdfghjkl/applications/[id]">) {
  const admin = await requireAdmin();
  const { id } = await params;
  const a = await db.application.findUnique({ where: { id }, include: { pitchDeck: true } });
  if (!a) notFound();
  const program = a.programSlug ? await db.program.findUnique({ where: { slug: a.programSlug }, select: { name: true } }) : null;

  const long = [
    { k: "Problem", v: a.problem },
    { k: "Solution & evidence", v: a.solution },
    { k: "Team", v: a.team },
    { k: "Support sought", v: a.support },
  ];

  return (
    <>
      <AdminHeader title={a.ventureName} kicker={`Application ${a.reference}`}>
        <span className="flex flex-wrap items-center gap-3">
          <Link href="/asdfghjkl/applications" className="u-link-static">
            ← All applications
          </Link>
          <StatusTag value={a.status} label={APPLICATION_STATUS_LABEL[a.status]} />
        </span>
      </AdminHeader>
      <div className="grid gap-12 xl:grid-cols-[1.5fr_1fr]">
        <div>
          <Facts
            items={[
              { k: "Founder", v: a.founderName },
              { k: "Email", v: <a className="u-link-static text-blue" href={`mailto:${a.email}`}>{a.email}</a> },
              { k: "Phone", v: <a className="u-link-static" href={`tel:${a.phone}`}>{a.phone}</a> },
              ...(a.institution ? [{ k: "Institution", v: a.institution }] : []),
              ...(a.city ? [{ k: "City", v: a.city }] : []),
              { k: "Sector", v: a.sector },
              { k: "Stage", v: a.stage },
              { k: "Team size", v: String(a.teamSize) },
              ...(program ? [{ k: "Programme", v: program.name }] : []),
              ...(a.website ? [{ k: "Website", v: <a className="u-link-static text-blue" href={a.website} target="_blank" rel="noopener noreferrer">{a.website}</a> }] : []),
              { k: "Received", v: formatDate(a.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
              { k: "Consent", v: formatDate(a.consentAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
              {
                k: "Pitch deck",
                v: a.pitchDeck ? (
                  <a className="u-link-static text-blue" href={`/media/${a.pitchDeck.id}`}>
                    Download PDF ({Math.round(a.pitchDeck.size / 1024)} KB)
                  </a>
                ) : (
                  "Not provided"
                ),
              },
            ]}
          />
          {long.map((l) => (
            <section key={l.k} className="mt-10">
              <h2 className="label text-muted">{l.k}</h2>
              <p className="mt-3 max-w-[70ch] whitespace-pre-wrap leading-relaxed text-ink">{l.v}</p>
            </section>
          ))}
        </div>
        <div className="xl:sticky xl:top-8 xl:self-start">
          <h2 className="mb-6 font-semibold text-ink">Review</h2>
          <StatusForm
            action={updateApplication.bind(null, a.id)}
            status={a.status}
            notes={a.internalNotes ?? ""}
            notesName="internalNotes"
            notesLabel="Reviewer notes"
            statuses={Object.entries(APPLICATION_STATUS_LABEL).map(([value, label]) => ({ value, label }))}
          />
          <p className="mt-4 text-xs text-muted">Changing the status does not email the applicant. Correspond with them directly using the email above.</p>
          {admin.role === "ADMIN" ? (
            <form action={deleteApplication.bind(null, a.id)} className="mt-12 border-t border-rule pt-6">
              <ConfirmButton message="Permanently delete this application, its pitch deck and personal data?">Delete application</ConfirmButton>
            </form>
          ) : null}
        </div>
      </div>
    </>
  );
}
