"use server";

import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { log } from "@/lib/log";
import { rateLimit } from "@/lib/rate-limit";
import { clientFingerprint } from "@/lib/request";
import { checkFormGuard } from "@/lib/form-guard";
import { storeUpload, UploadError } from "@/lib/uploads";
import {
  applicationSchema,
  flattenErrors,
  formValues,
  inquirySchema,
  registrationSchema,
  type FieldErrors,
} from "@/lib/validation";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: FieldErrors;
  values?: Record<string, string>;
  reference?: string;
};

const GENERIC_ERROR = "Something went wrong on our side and your submission was not saved. Please try again in a few minutes.";
const STALE = "This form has expired. Please reload the page and submit again.";
const RATE = "Too many submissions from your connection. Please wait a while and try again.";

async function guard(form: string, data: FormData, limit: number): Promise<FormState | null> {
  const g = checkFormGuard(form, data);
  if (!g.ok) {
    log("warn", "form.rejected", { form, reason: g.reason });
    // Bots get a neutral message; humans with a stale page are told to reload.
    return { status: "error", message: g.reason === "expired" ? STALE : "Your submission could not be accepted. Please reload the page and try again." };
  }
  const ip = await clientFingerprint();
  if (!(await rateLimit(`form:${form}:${ip}`, limit, 60 * 60))) {
    log("warn", "form.rate_limited", { form });
    return { status: "error", message: RATE };
  }
  return null;
}

/* ─── Contact & partnership enquiries ─────────────────────────── */

const INQUIRY_KEYS = ["type", "name", "email", "phone", "organisation", "message", "consent"] as const;

export async function submitInquiry(_prev: FormState, data: FormData): Promise<FormState> {
  const values = formValues(data, INQUIRY_KEYS);
  const blocked = await guard("inquiry", data, 6);
  if (blocked) return { ...blocked, values };

  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", errors: flattenErrors(parsed.error), values, message: "Please check the highlighted fields." };
  }
  try {
    const { consent: _consent, ...rest } = parsed.data;
    const row = await db.inquiry.create({ data: rest });
    log("info", "inquiry.created", { id: row.id, type: row.type });
    return { status: "success", message: "Thank you — your message has been received. We will reply by email." };
  } catch (error) {
    log("error", "inquiry.failed", { error });
    return { status: "error", message: GENERIC_ERROR, values };
  }
}

/* ─── Event registration ───────────────────────────────────────── */

const REG_KEYS = ["name", "email", "phone", "organisation", "consent"] as const;

export async function registerForEvent(eventId: string, _prev: FormState, data: FormData): Promise<FormState> {
  const values = formValues(data, REG_KEYS);
  const blocked = await guard("registration", data, 10);
  if (blocked) return { ...blocked, values };

  const parsed = registrationSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", errors: flattenErrors(parsed.error), values, message: "Please check the highlighted fields." };
  }
  try {
    const event = await db.event.findFirst({
      where: { id: eventId, status: "PUBLISHED", registrationOpen: true, registrationUrl: null },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event) return { status: "error", message: "Registration for this event is closed." };
    if (event.capacity && event._count.registrations >= event.capacity) {
      return { status: "error", message: "This event is fully booked." };
    }
    const { consent: _consent, ...rest } = parsed.data;
    const existing = await db.eventRegistration.findUnique({ where: { eventId_email: { eventId, email: rest.email } } });
    if (existing) return { status: "success", message: "You are already registered for this event with that email address." };
    await db.eventRegistration.create({ data: { ...rest, eventId } });
    log("info", "event.registered", { eventId });
    return { status: "success", message: "You are registered. Please keep an eye on your email for any updates from the organisers." };
  } catch (error) {
    log("error", "event.registration_failed", { error, eventId });
    return { status: "error", message: GENERIC_ERROR, values };
  }
}

/* ─── Startup application ──────────────────────────────────────── */

const APP_KEYS = [
  "founderName", "email", "phone", "institution", "city", "ventureName", "sector", "stage", "programSlug",
  "problem", "solution", "teamSize", "team", "website", "support", "consent",
] as const;

function reference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  const code = [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
  return `RSF-${new Date().getFullYear()}-${code}`;
}

export async function submitApplication(_prev: FormState, data: FormData): Promise<FormState> {
  const values = formValues(data, APP_KEYS);
  const blocked = await guard("application", data, 3);
  if (blocked) return { ...blocked, values };

  const parsed = applicationSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", errors: flattenErrors(parsed.error), values, message: "Please check the highlighted fields." };
  }

  let pitchDeckId: string | undefined;
  const deck = data.get("pitchDeck");
  if (deck instanceof File && deck.size > 0) {
    try {
      const asset = await storeUpload(deck, { accept: "document", isPublic: false });
      pitchDeckId = asset.id;
    } catch (error) {
      if (error instanceof UploadError) {
        return { status: "error", errors: { pitchDeck: error.message }, values, message: "Please check the highlighted fields." };
      }
      log("error", "application.upload_failed", { error });
      return { status: "error", message: GENERIC_ERROR, values };
    }
  }

  try {
    const { consent: _consent, programSlug, ...rest } = parsed.data;
    const program = programSlug
      ? await db.program.findFirst({ where: { slug: programSlug, status: "PUBLISHED" }, select: { slug: true } })
      : null;
    const row = await db.application.create({
      data: { ...rest, programSlug: program?.slug, reference: reference(), consentAt: new Date(), pitchDeckId },
    });
    log("info", "application.created", { id: row.id, reference: row.reference });
    return { status: "success", reference: row.reference, message: "Your application has been received." };
  } catch (error) {
    log("error", "application.failed", { error });
    return { status: "error", message: GENERIC_ERROR, values };
  }
}
