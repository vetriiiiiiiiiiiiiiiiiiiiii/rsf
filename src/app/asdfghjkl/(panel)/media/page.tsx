import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteMedia, updateMediaAlt } from "@/app/actions/admin";
import { AdminHeader, Empty } from "@/components/admin/ui";
import { MediaUpload } from "@/components/admin/media-upload";
import { ConfirmButton, PlainSubmit } from "@/components/admin/confirm-button";

export const metadata = { title: "Media library" };

export default async function MediaPage() {
  await requireAdmin();
  const assets = await db.mediaAsset.findMany({
    where: { kind: "IMAGE" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { startups: true, events: true, news: true, people: true, partners: true } } },
    take: 300,
  });

  return (
    <>
      <AdminHeader title="Media library" kicker="Site">
        Images used across the site. Files are checked by content, renamed, and stored outside the public folder. Upload only images you have the right to publish.
      </AdminHeader>
      <MediaUpload />
      {assets.length ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {assets.map((a) => {
            const uses = Object.values(a._count).reduce((n, c) => n + c, 0);
            return (
              <li key={a.id} className="border border-rule">
                <div className="relative aspect-[4/3] bg-pale">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
                  <img src={`/media/${a.id}`} alt={a.alt} loading="lazy" className="h-full w-full object-contain" />
                </div>
                <div className="space-y-3 p-3">
                  <p className="truncate text-sm font-medium text-ink" title={a.originalName}>
                    {a.originalName}
                  </p>
                  <p className="label-sm text-muted">
                    {a.width && a.height ? `${a.width}×${a.height} · ` : ""}
                    {Math.round(a.size / 1024)} KB · used {uses}×
                  </p>
                  <form action={updateMediaAlt.bind(null, a.id)} className="flex gap-2">
                    <label htmlFor={`alt-${a.id}`} className="sr-only">
                      Alt text
                    </label>
                    <input id={`alt-${a.id}`} name="alt" defaultValue={a.alt} placeholder="Alt text" className="field-input !py-1.5 !text-sm" />
                    <PlainSubmit>Save</PlainSubmit>
                  </form>
                  <form action={deleteMedia.bind(null, a.id)}>
                    <ConfirmButton message={uses ? `This image is used ${uses} time(s). Deleting it removes it from those pages. Continue?` : "Delete this image?"}>Delete</ConfirmButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-10">
          <Empty title="No images uploaded yet." />
        </div>
      )}
    </>
  );
}
