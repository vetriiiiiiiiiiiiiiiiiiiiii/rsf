import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
const required = (label: string, max: number) => trimmed(max).min(1, `${label} is required.`);
const optional = (max: number) =>
  trimmed(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const email = z.string().trim().toLowerCase().max(200).email("Enter a valid email address.");
const phone = z
  .string()
  .trim()
  .regex(/^[+()\d\s-]{7,20}$/, "Enter a valid phone number.");
const url = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((v) => (v ? (/^https?:\/\//i.test(v) ? v : `https://${v}`) : undefined))
  .refine((v) => !v || z.url().safeParse(v).success, "Enter a valid web address.");

export const INQUIRY_TYPES = ["GENERAL", "FOUNDER", "STUDENT", "MENTOR", "INVESTOR", "INDUSTRY", "INSTITUTIONAL"] as const;

export const inquirySchema = z.object({
  type: z.enum(INQUIRY_TYPES, { message: "Choose who you are." }),
  name: required("Your name", 120),
  email,
  phone: z.union([z.literal(""), phone]).optional().transform((v) => v || undefined),
  organisation: optional(160),
  message: trimmed(4000).min(20, "Please write at least a couple of sentences (20+ characters)."),
  consent: z.literal("on", { message: "Please confirm you agree to us storing your message." }),
});

export const registrationSchema = z.object({
  name: required("Your name", 120),
  email,
  phone: z.union([z.literal(""), phone]).optional().transform((v) => v || undefined),
  organisation: optional(160),
  consent: z.literal("on", { message: "Please confirm you agree to us storing your details." }),
});

export const STAGES = ["Idea", "Prototype", "Early users", "Revenue", "Scaling"] as const;

export const applicationSchema = z.object({
  founderName: required("Your name", 120),
  email,
  phone,
  institution: optional(160),
  city: optional(120),
  ventureName: required("Venture name", 120),
  sector: required("Sector", 120),
  stage: z.enum(STAGES, { message: "Choose the stage that fits best." }),
  programSlug: optional(80),
  problem: trimmed(3000).min(40, "Describe the problem in at least 40 characters."),
  solution: trimmed(3000).min(40, "Describe your solution in at least 40 characters."),
  teamSize: z.coerce.number({ message: "Enter a number." }).int().min(1, "At least one person.").max(500),
  team: trimmed(3000).min(20, "Tell us a little about the team (20+ characters)."),
  website: url,
  support: trimmed(3000).min(20, "Tell us what support you are looking for (20+ characters)."),
  consent: z.literal("on", { message: "Please confirm you agree to the handling of your application." }),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(200),
});

export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(200)
  .refine((v) => /[a-z]/i.test(v) && /\d/.test(v), "Include letters and at least one number.");

export type FieldErrors = Record<string, string>;

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Collects string fields from FormData so they can be validated and echoed back on error. */
export function formValues(data: FormData, keys: readonly string[]) {
  const values: Record<string, string> = {};
  for (const k of keys) {
    const v = data.get(k);
    if (typeof v === "string") values[k] = v;
  }
  return values;
}
