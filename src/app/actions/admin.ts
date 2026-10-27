"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { audit, hashPassword, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { log } from "@/lib/log";
import { getResource, type FieldDef, type ResourceDef } from "@/lib/admin/resources";
import { fromISTInput } from "@/lib/admin/datetime";
import { SETTINGS, type SettingKey } from "@/lib/settings";
import { slugify } from "@/lib/slug";
import { deleteUpload, storeUpload, UploadError } from "@/lib/uploads";
import { email as emailSchema, flattenErrors, passwordSchema } from "@/lib/validation";

export type AdminFormState = { status: "idle" | "error" | "success"; message?: string; errors?: Record<string, string> };

type Delegate = {
  findUnique(args: unknown): Promise<Record<string, unknown> | null>;
  findFirst(args: unknown): Promise<Record<string, unknown> | null>;
  create(args: unknown): Promise<Record<string, unknown>>;
  update(args: unknown): Promise<Record<string, unknown>>;
  delete(args: unknown): Promise<Record<string, unknown>>;
};

function delegate(model: ResourceDef["model"]): Delegate {
  return (db as unknown as Record<string, Delegate>)[model];
}

function refresh() {
  revalidatePath("/", "layout");
}

/* ─── Generic content CRUD ─────────────────────────────────────── */

function fieldSchema(f: FieldDef): z.ZodType {
  switch (f.type) {
    case "text":
    case "textarea": {
      const s = z.string().trim().max(f.max ?? 10000, `Keep under ${f.max} characters.`);
      return f.required ? s.min(1, `${f.label} is required.`) : s.transform((v) => v || null);
    }
    case "url": {
      const s = z
        .string()
        .trim()
        .max(f.max ?? 300)
        .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
        .refine((v) => !v || z.url().safeParse(v).success, "Enter a valid web address.");
      return f.required ? s.refine((v) => v.length > 0, `${f.label} is required.`) : s.transform((v) => v || null);
    }
    case "number": {
      return z
        .string()
        .trim()
        .transform((v, ctx) => {
          if (!v) {
            if (f.required) ctx.addIssue({ code: "custom", message: `${f.label} is required.` });
            return null;
          }
          const n = Number(v);
          if (!Number.isInteger(n)) ctx.addIssue({ code: "custom", message: "Enter a whole number." });
          else if ((f.min != null && n < f.min) || (f.max != null && n > f.max)) ctx.addIssue({ code: "custom", message: `Enter a number between ${f.min} and ${f.max}.` });
          return n;
        });
    }
    case "checkbox":
      return z.string().optional().transform((v) => v === "on");
    case "select": {
      const values = f.options.map((o) => o.value);
      return f.required
        ? z.string().refine((v) => values.includes(v), `Choose a ${f.label.toLowerCase()}.`)
        : z.string().transform((v) => (values.includes(v) ? v : null));
    }
    case "relation":
      return z.string().transform((v) => v || null);
    case "datetime":
      return z.string().transform((v, ctx) => {
        if (!v) {
          if (f.required) ctx.addIssue({ code: "custom", message: `${f.label} is required.` });
          return null;
        }
        const d = fromISTInput(v);
        if (!d) ctx.addIssue({ code: "custom", message: "Enter a valid date and time." });
        return d;
      });
    case "image":
      return z.string().transform((v) => v || null);
  }
}

async function uniqueSlug(res: ResourceDef, base: string, id: string | null) {
  const root = slugify(base) || res.key.slice(0, -1);
  let candidate = root;
  for (let i = 2; i < 200; i++) {
    const hit = await delegate(res.model).findFirst({ where: { slug: candidate, ...(id ? { NOT: { id } } : {}) }, select: { id: true } });
    if (!hit) return candidate;
    candidate = `${root}-${i}`;
  }
  throw new Error("Could not generate a unique slug");
}

export async function saveResource(key: string, id: string | null, _prev: AdminFormState, data: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const res = getResource(key);
  if (!res) return { status: "error", message: "Unknown content type." };

  const shape: Record<string, z.ZodType> = {};
  const raw: Record<string, string> = {};
  for (const f of res.fields) {
    shape[f.name] = fieldSchema(f);
    const v = data.get(f.name);
    raw[f.name] = typeof v === "string" ? v : "";
  }
  const parsed = z.object(shape).safeParse(raw);
  if (!parsed.success) return { status: "error", errors: flattenErrors(parsed.error), message: "Please correct the highlighted fields." };
  const values = parsed.data as Record<string, unknown>;

  // Image uploads: a new file takes precedence over the library selection.
  for (const f of res.fields.filter((x) => x.type === "image")) {
    const file = data.get(`${f.name}__file`);
    if (file instanceof File && file.size > 0) {
      try {
        const asset = await storeUpload(file, { accept: "image", isPublic: true, alt: String(data.get(`${f.name}__alt`) ?? "") });
        values[f.name] = asset.id;
      } catch (error) {
        if (error instanceof UploadError) return { status: "error", errors: { [f.name]: error.message }, message: "Please correct the highlighted fields." };
        throw error;
      }
    } else if (values[f.name]) {
      const exists = await db.mediaAsset.findFirst({ where: { id: String(values[f.name]), kind: "IMAGE", isPublic: true }, select: { id: true } });
      if (!exists) values[f.name] = null;
    }
  }
  for (const f of res.fields.filter((x) => x.type === "relation")) {
    if (values[f.name]) {
      const exists = await db.startupCategory.findUnique({ where: { id: String(values[f.name]) }, select: { id: true } });
      if (!exists) values[f.name] = null;
    }
  }
  if (res.hasSlug) values.slug = await uniqueSlug(res, String(values.slug || values[res.titleField]), id);
  if ("order" in values && values.order == null) values.order = 0;

  let row: Record<string, unknown>;
  try {
    row = id ? await delegate(res.model).update({ where: { id }, data: values }) : await delegate(res.model).create({ data: values });
    await audit(admin.id, id ? "update" : "create", res.model, String(row.id), String(values[res.titleField] ?? ""));
    log("info", "admin.saved", { model: res.model, id: row.id, by: admin.id });
  } catch (error) {
    log("error", "admin.save_failed", { model: res.model, error });
    return { status: "error", message: "The record could not be saved. Please try again." };
  }
  refresh();
  if (!id) redirect(`/asdfghjkl/content/${res.key}/${row.id}?saved=1`);
  return { status: "success", message: `${res.singular} saved.` };
}

export async function deleteResource(key: string, id: string) {
  const admin = await requireAdmin();
  const res = getResource(key);
  if (!res) return;
  const row = await delegate(res.model).delete({ where: { id } });
  await audit(admin.id, "delete", res.model, id, String(row[res.titleField] ?? ""));
  refresh();
  redirect(`/asdfghjkl/content/${res.key}?deleted=1`);
}

export async function setPublished(key: string, id: string, publish: boolean) {
  const admin = await requireAdmin();
  const res = getResource(key);
  if (!res?.hasStatus) return;
  await delegate(res.model).update({ where: { id }, data: { status: publish ? "PUBLISHED" : "DRAFT" } });
  await audit(admin.id, publish ? "publish" : "unpublish", res.model, id);
  refresh();
}

/* ─── Inquiries ─────────────────────────────────────────────────── */

const inquiryUpdate = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]),
  notes: z.string().trim().max(4000).transform((v) => v || null),
});

export async function updateInquiry(id: string, _prev: AdminFormState, data: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = inquiryUpdate.safeParse({ status: data.get("status"), notes: data.get("notes") ?? "" });
  if (!parsed.success) return { status: "error", message: "Invalid update." };
  await db.inquiry.update({ where: { id }, data: parsed.data });
  await audit(admin.id, "update", "inquiry", id, parsed.data.status);
  return { status: "success", message: "Enquiry updated." };
}

export async function deleteInquiry(id: string) {
  const admin = await requireAdmin("ADMIN");
  await db.inquiry.delete({ where: { id } });
  await audit(admin.id, "delete", "inquiry", id);
  redirect("/asdfghjkl/inquiries?deleted=1");
}

/* ─── Applications ──────────────────────────────────────────────── */

const applicationUpdate = z.object({
  status: z.enum(["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "ACCEPTED", "DECLINED", "WITHDRAWN"]),
  internalNotes: z.string().trim().max(8000).transform((v) => v || null),
});

export async function updateApplication(id: string, _prev: AdminFormState, data: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const parsed = applicationUpdate.safeParse({ status: data.get("status"), internalNotes: data.get("internalNotes") ?? "" });
  if (!parsed.success) return { status: "error", message: "Invalid update." };
  await db.application.update({ where: { id }, data: parsed.data });
  await audit(admin.id, "update", "application", id, parsed.data.status);
  return { status: "success", message: "Application updated." };
}

export async function deleteApplication(id: string) {
  const admin = await requireAdmin("ADMIN");
  const app = await db.application.delete({ where: { id } });
  if (app.pitchDeckId) await deleteUpload(app.pitchDeckId).catch(() => undefined);
  await audit(admin.id, "delete", "application", id, app.reference);
  redirect("/asdfghjkl/applications?deleted=1");
}

/* ─── Event registrations ───────────────────────────────────────── */

export async function deleteRegistration(eventId: string, id: string) {
  const admin = await requireAdmin();
  await db.eventRegistration.delete({ where: { id, eventId } });
  await audit(admin.id, "delete", "eventRegistration", id);
  revalidatePath(`/asdfghjkl/content/events/${eventId}`);
}

/* ─── Media ─────────────────────────────────────────────────────── */

export async function uploadMedia(_prev: AdminFormState, data: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const files = data.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { status: "error", message: "Choose at least one image." };
  if (files.length > 12) return { status: "error", message: "Upload up to 12 images at a time." };
  const alt = String(data.get("alt") ?? "").trim();
  const failed: string[] = [];
  for (const file of files) {
    try {
      const asset = await storeUpload(file, { accept: "image", isPublic: true, alt });
      await audit(admin.id, "upload", "media", asset.id, asset.originalName);
    } catch (error) {
      failed.push(`${file.name}: ${error instanceof UploadError ? error.message : "upload failed"}`);
      if (!(error instanceof UploadError)) log("error", "media.upload_failed", { error });
    }
  }
  revalidatePath("/asdfghjkl/media");
  if (failed.length) return { status: "error", message: failed.join(" · ") };
  return { status: "success", message: `${files.length} ${files.length === 1 ? "image" : "images"} uploaded.` };
}

export async function updateMediaAlt(id: string, data: FormData) {
  const admin = await requireAdmin();
  const alt = String(data.get("alt") ?? "").trim().slice(0, 200);
  await db.mediaAsset.update({ where: { id }, data: { alt } });
  await audit(admin.id, "update", "media", id, "alt text");
  revalidatePath("/asdfghjkl/media");
  refresh();
}

export async function deleteMedia(id: string) {
  const admin = await requireAdmin();
  const asset = await deleteUpload(id);
  await audit(admin.id, "delete", "media", id, asset.originalName);
  revalidatePath("/asdfghjkl/media");
  refresh();
}

/* ─── Settings ──────────────────────────────────────────────────── */

export async function saveSettings(_prev: AdminFormState, data: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const errors: Record<string, string> = {};
  const updates: { key: string; value: string }[] = [];
  for (const key of Object.keys(SETTINGS) as SettingKey[]) {
    const v = data.get(key);
    if (typeof v !== "string") continue;
    const value = v.trim().slice(0, 4000);
    if ((key.startsWith("social.") || key === "contact.mapUrl") && value && !z.url().safeParse(value).success) {
      errors[key] = "Enter a full URL, starting with https://";
      continue;
    }
    if (key === "contact.email" && value && !emailSchema.safeParse(value).success) {
      errors[key] = "Enter a valid email address.";
      continue;
    }
    updates.push({ key, value });
  }
  if (Object.keys(errors).length) return { status: "error", errors, message: "Please correct the highlighted fields." };
  await db.$transaction(updates.map((u) => db.setting.upsert({ where: { key: u.key }, update: { value: u.value }, create: u })));
  await audit(admin.id, "update", "settings", undefined, `${updates.length} values`);
  refresh();
  return { status: "success", message: "Settings saved." };
}

export async function resetSetting(key: string) {
  const admin = await requireAdmin();
  if (!(key in SETTINGS)) return;
  await db.setting.deleteMany({ where: { key } });
  await audit(admin.id, "reset", "settings", key);
  refresh();
}

/* ─── Users (administrators only) ───────────────────────────────── */

export async function createUser(_prev: AdminFormState, data: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin("ADMIN");
  const schema = z.object({
    name: z.string().trim().min(1, "Name is required.").max(120),
    email: emailSchema,
    role: z.enum(["ADMIN", "EDITOR"]),
    password: passwordSchema,
  });
  const parsed = schema.safeParse(Object.fromEntries(["name", "email", "role", "password"].map((k) => [k, data.get(k) ?? ""])));
  if (!parsed.success) return { status: "error", errors: flattenErrors(parsed.error), message: "Please correct the highlighted fields." };
  if (await db.adminUser.findUnique({ where: { email: parsed.data.email } })) return { status: "error", errors: { email: "A user with this email already exists." } };
  const user = await db.adminUser.create({
    data: { name: parsed.data.name, email: parsed.data.email, role: parsed.data.role, passwordHash: await hashPassword(parsed.data.password) },
  });
  await audit(admin.id, "create", "user", user.id, user.email);
  revalidatePath("/asdfghjkl/account");
  return { status: "success", message: `${user.email} can now sign in.` };
}

export async function setUserActive(id: string, active: boolean) {
  const admin = await requireAdmin("ADMIN");
  if (id === admin.id) return;
  await db.adminUser.update({ where: { id }, data: { active } });
  if (!active) await db.session.deleteMany({ where: { userId: id } });
  await audit(admin.id, active ? "activate" : "deactivate", "user", id);
  revalidatePath("/asdfghjkl/account");
}
