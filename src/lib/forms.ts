import type { z } from "zod";
import { flattenErrors, type FieldErrors } from "./validation";

/**
 * Static-site form handling. Submissions are validated in the browser and sent
 * to a hosted form service (Formspree, Web3Forms, Getform, …) whose endpoint is
 * set at build time in NEXT_PUBLIC_FORM_ENDPOINT. A submission is only shown as
 * received when that service confirms it.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: FieldErrors;
  values?: Record<string, string>;
  reference?: string;
};

const HONEYPOT = "company_website";

export function collect(data: FormData, keys: readonly string[]) {
  const values: Record<string, string> = {};
  for (const k of keys) {
    const v = data.get(k);
    if (typeof v === "string") values[k] = v;
  }
  return values;
}

export async function submitToService<T extends z.ZodType>(
  formName: string,
  schema: T,
  data: FormData,
  keys: readonly string[],
): Promise<FormState & { parsed?: z.infer<T> }> {
  const values = collect(data, keys);
  // Bots fill every field; people never see this one.
  const trap = data.get(HONEYPOT);
  if (typeof trap === "string" && trap.trim()) return { status: "success", message: "Thank you." };

  const parsed = schema.safeParse(values);
  if (!parsed.success) return { status: "error", errors: flattenErrors(parsed.error), values, message: "Please check the highlighted fields." };
  if (!FORM_ENDPOINT) {
    return { status: "error", values, message: "Online submissions are not yet enabled. Please contact the foundation directly." };
  }
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _form: formName, _subject: `RS Foundation — ${formName}`, ...(parsed.data as object) }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { status: "success", parsed: parsed.data };
  } catch {
    return { status: "error", values, message: "Your submission could not be sent. Please try again in a few minutes." };
  }
}

export function reference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `RSF-${new Date().getFullYear()}-${[...bytes].map((b) => alphabet[b % alphabet.length]).join("")}`;
}
