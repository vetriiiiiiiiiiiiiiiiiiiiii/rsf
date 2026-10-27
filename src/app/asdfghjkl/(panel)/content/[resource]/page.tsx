import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getResource } from "@/lib/admin/resources";
import { listDelegate } from "@/lib/admin/load";
import { setPublished } from "@/app/actions/admin";
import { AdminButton, AdminHeader, Empty, Notice, StatusTag } from "@/components/admin/ui";
import { PlainSubmit } from "@/components/admin/confirm-button";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/asdfghjkl/content/[resource]">) {
  return { title: getResource((await params).resource)?.plural ?? "Content" };
}

export default async function ResourceList({ params, searchParams }: PageProps<"/asdfghjkl/content/[resource]">) {
  await requireAdmin();
  const { resource } = await params;
  const sp = await searchParams;
  const res = getResource(resource);
  if (!res) notFound();

  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const include = res.model === "startup" ? { category: { select: { name: true } } } : undefined;
  const rows = await listDelegate(res.model).findMany({
    where: q ? { [res.titleField]: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: res.orderBy,
    include,
    take: 500,
  });

  return (
    <>
      <AdminHeader title={res.plural} kicker="Content" actions={<AdminButton href={`/asdfghjkl/content/${res.key}/new`}>New {res.singular.toLowerCase()}</AdminButton>} />
      {sp.deleted ? <Notice tone="success">{res.singular} deleted.</Notice> : null}

      <form className="mb-6 flex max-w-sm gap-2" role="search">
        <label htmlFor="q" className="sr-only">
          Search {res.plural}
        </label>
        <input id="q" name="q" defaultValue={q} placeholder={`Search ${res.plural.toLowerCase()}…`} className="field-input !py-2 !text-sm" />
        <button className="label border border-ink px-3">Search</button>
      </form>

      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink text-left">
                {res.columns.map((c) => (
                  <th key={c.name} scope="col" className="label py-2 pr-4 font-normal text-muted">
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="label py-2 text-right font-normal text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const id = String(row.id);
                const published = row.status === "PUBLISHED";
                return (
                  <tr key={id} className="border-b border-rule align-middle hover:bg-pale/60">
                    {res.columns.map((c, i) => {
                      const v = row[c.name];
                      let cell: React.ReactNode = v == null ? "—" : String(v);
                      if (c.kind === "status") cell = <StatusTag value={String(v)} />;
                      if (c.kind === "bool") cell = v ? "Yes" : "—";
                      if (c.kind === "date") cell = v instanceof Date ? formatDate(v, { day: "2-digit", month: "short", year: "numeric" }) : "—";
                      if (c.kind === "relation") cell = (v as { name?: string } | null)?.name ?? "—";
                      if (c.kind === "enum") cell = res.enumLabels?.[c.name]?.[String(v)] ?? String(v);
                      return (
                        <td key={c.name} className="py-3 pr-4">
                          {i === 0 ? (
                            <Link href={`/asdfghjkl/content/${res.key}/${id}`} className="font-medium text-ink hover:text-blue">
                              {cell}
                            </Link>
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        {res.hasStatus ? (
                          <form action={setPublished.bind(null, res.key, id, !published)}>
                            <PlainSubmit>{published ? "Unpublish" : "Publish"}</PlainSubmit>
                          </form>
                        ) : null}
                        <Link href={`/asdfghjkl/content/${res.key}/${id}`} className="label border border-ink/40 px-3 py-2 text-ink hover:border-ink">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title={q ? "Nothing matches that search." : `No ${res.plural.toLowerCase()} yet.`}>
          {!q ? <p>Create the first entry when verified information is available.</p> : null}
        </Empty>
      )}
    </>
  );
}
