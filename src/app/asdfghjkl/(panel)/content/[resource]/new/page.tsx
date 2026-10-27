import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getResource } from "@/lib/admin/resources";
import { editorOptions, toFormValues } from "@/lib/admin/load";
import { AdminHeader } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/resource-form";
import Link from "next/link";

export async function generateMetadata({ params }: PageProps<"/asdfghjkl/content/[resource]/new">) {
  return { title: `New ${getResource((await params).resource)?.singular.toLowerCase() ?? "entry"}` };
}

export default async function NewResource({ params }: PageProps<"/asdfghjkl/content/[resource]/new">) {
  await requireAdmin();
  const res = getResource((await params).resource);
  if (!res) notFound();
  const opts = await editorOptions();
  return (
    <>
      <AdminHeader title={`New ${res.singular.toLowerCase()}`} kicker={res.plural}>
        <Link href={`/asdfghjkl/content/${res.key}`} className="u-link-static">
          ← Back to {res.plural.toLowerCase()}
        </Link>
      </AdminHeader>
      <ResourceForm resourceKey={res.key} id={null} fields={res.fields} values={toFormValues(res, null)} categories={opts.categories} images={opts.images} singular={res.singular} />
    </>
  );
}
