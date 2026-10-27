import { db } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { readUpload } from "@/lib/uploads";
import { log } from "@/lib/log";

export async function GET(_req: Request, ctx: RouteContext<"/media/[id]">) {
  const { id } = await ctx.params;
  if (!/^[a-z0-9]{20,32}$/.test(id)) return new Response("Not found", { status: 404 });

  const asset = await db.mediaAsset.findUnique({ where: { id } });
  if (!asset) return new Response("Not found", { status: 404 });
  if (!asset.isPublic && !(await getAdmin())) return new Response("Not found", { status: 404 });

  try {
    const body = await readUpload(asset.storageKey);
    const isPdf = asset.mimeType === "application/pdf";
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(body.length),
        "Cache-Control": asset.isPublic ? "public, max-age=31536000, immutable" : "private, no-store",
        "Content-Disposition": `${isPdf ? "attachment" : "inline"}; filename="${asset.originalName.replace(/"/g, "")}"`,
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (error) {
    log("error", "media.read_failed", { id, error });
    return new Response("Not found", { status: 404 });
  }
}
