import "server-only";
import { db } from "@/lib/db";
import { toISTInput } from "./datetime";
import type { ResourceDef } from "./resources";

type Row = Record<string, unknown>;
type ListDelegate = {
  findMany(args: unknown): Promise<Row[]>;
  findUnique(args: unknown): Promise<Row | null>;
};

export function listDelegate(model: ResourceDef["model"]) {
  return (db as unknown as Record<string, ListDelegate>)[model];
}

/** Converts a database row into string/boolean form values for the editor. */
export function toFormValues(res: ResourceDef, row: Row | null): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const f of res.fields) {
    const v = row?.[f.name];
    if (f.type === "checkbox") out[f.name] = Boolean(v ?? (f.name === "provisional" && !row ? true : false));
    else if (f.type === "datetime") out[f.name] = v instanceof Date ? toISTInput(v) : "";
    else out[f.name] = v == null ? "" : String(v);
  }
  if (!row) {
    if (res.hasStatus) out.status = "DRAFT";
    if (res.fields.some((f) => f.name === "publishedAt")) out.publishedAt = toISTInput(new Date());
  }
  return out;
}

export async function editorOptions() {
  const [categories, images] = await Promise.all([
    db.startupCategory.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
    db.mediaAsset.findMany({ where: { kind: "IMAGE", isPublic: true }, orderBy: { createdAt: "desc" }, select: { id: true, originalName: true, alt: true }, take: 500 }),
  ]);
  return { categories, images: images.map((i) => ({ id: i.id, name: i.originalName, alt: i.alt })) };
}
