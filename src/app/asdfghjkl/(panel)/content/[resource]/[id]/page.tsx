import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getResource } from "@/lib/admin/resources";
import { editorOptions, listDelegate, toFormValues } from "@/lib/admin/load";
import { deleteRegistration, deleteResource } from "@/app/actions/admin";
import { AdminHeader, Notice, StatusTag } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/resource-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/asdfghjkl/content/[resource]/[id]">) {
  return { title: `Edit ${getResource((await params).resource)?.singular.toLowerCase() ?? "entry"}` };
}

export default async function EditResource({ params, searchParams }: PageProps<"/asdfghjkl/content/[resource]/[id]">) {
  await requireAdmin();
  const { resource, id } = await params;
  const sp = await searchParams;
  const res = getResource(resource);
  if (!res) notFound();
  const row = await listDelegate(res.model).findUnique({ where: { id } });
  if (!row) notFound();
  const opts = await editorOptions();
  const registrations = res.model === "event" ? await db.eventRegistration.findMany({ where: { eventId: id }, orderBy: { createdAt: "asc" } }) : [];
  const title = String(row[res.titleField] ?? res.singular);
  const publicHref = res.publicPath && row.status === "PUBLISHED" ? `${res.publicPath}/${String(row.slug)}` : null;

  return (
    <>
      <AdminHeader
        title={title}
        kicker={res.plural}
        actions={
          publicHref ? (
            <Link href={publicHref} target="_blank" className="label border border-ink px-3 py-2.5 text-ink hover:bg-ink hover:text-white">
              View on site ↗
            </Link>
          ) : null
        }
      >
        <span className="flex flex-wrap items-center gap-3">
          <Link href={`/asdfghjkl/content/${res.key}`} className="u-link-static">
            ← Back to {res.plural.toLowerCase()}
          </Link>
          {res.hasStatus ? <StatusTag value={String(row.status)} /> : null}
          {row.updatedAt instanceof Date ? <span>Last updated {formatDate(row.updatedAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span> : null}
        </span>
      </AdminHeader>
      {sp.saved ? <Notice tone="success">{res.singular} created.</Notice> : null}

      <ResourceForm
        key={row.updatedAt instanceof Date ? row.updatedAt.toISOString() : id}
        resourceKey={res.key}
        id={id}
        fields={res.fields}
        values={toFormValues(res, row)}
        categories={opts.categories}
        images={opts.images}
        singular={res.singular}
      />

      {res.model === "event" ? (
        <section aria-labelledby="regs" className="mt-16 max-w-3xl">
          <div className="flex items-baseline justify-between border-b border-ink pb-2">
            <h2 id="regs" className="font-semibold text-ink">
              Registrations ({registrations.length}
              {row.capacity ? ` of ${String(row.capacity)}` : ""})
            </h2>
            {registrations.length ? (
              <a href={`/asdfghjkl/export/registrations/${id}`} className="label u-link-static text-blue">
                Download CSV
              </a>
            ) : null}
          </div>
          {registrations.length ? (
            <ul>
              {registrations.map((r) => (
                <li key={r.id} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-rule py-2.5 text-sm">
                  <span>
                    <span className="font-medium text-ink">{r.name}</span> <span className="text-muted">· {r.email}</span>
                    {r.phone ? <span className="text-muted"> · {r.phone}</span> : null}
                    {r.organisation ? <span className="text-muted"> · {r.organisation}</span> : null}
                  </span>
                  <form action={deleteRegistration.bind(null, id, r.id)}>
                    <ConfirmButton message={`Remove ${r.name}'s registration?`}>Remove</ConfirmButton>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-muted">No registrations yet.</p>
          )}
        </section>
      ) : null}

      <section className="mt-16 max-w-3xl border border-rule p-5">
        <h2 className="font-semibold text-ink">Delete {res.singular.toLowerCase()}</h2>
        <p className="mt-1 text-sm text-muted">This permanently removes the record{res.model === "event" ? " and its registrations" : ""}. Unpublishing hides it without deleting.</p>
        <form action={deleteResource.bind(null, res.key, id)} className="mt-4">
          <ConfirmButton message={`Permanently delete “${title}”? This cannot be undone.`}>Delete permanently</ConfirmButton>
        </form>
      </section>
    </>
  );
}
