import "server-only";
import { hmac, safeEqual } from "./secret";

/**
 * Lightweight spam protection for public forms, without third-party trackers:
 *  - a hidden honeypot field that people never fill in;
 *  - a signed timestamp proving the form was rendered by this server and
 *    was not submitted implausibly fast (bots) or after it went stale.
 */
export const HONEYPOT_FIELD = "company_website";
export const TOKEN_FIELD = "form_token";

const MIN_FILL_MS = 2500;
const MAX_AGE_MS = 1000 * 60 * 60 * 6;

export function issueFormToken(form: string) {
  const issued = Date.now().toString(36);
  return `${issued}.${hmac(`form:${form}:${issued}`)}`;
}

export type GuardResult = { ok: true } | { ok: false; reason: "spam" | "expired" };

export function checkFormGuard(form: string, data: FormData): GuardResult {
  const honeypot = data.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { ok: false, reason: "spam" };

  const token = data.get(TOKEN_FIELD);
  if (typeof token !== "string") return { ok: false, reason: "expired" };
  const [issued, sig] = token.split(".");
  if (!issued || !sig || !safeEqual(sig, hmac(`form:${form}:${issued}`))) {
    return { ok: false, reason: "expired" };
  }
  const age = Date.now() - parseInt(issued, 36);
  if (age < MIN_FILL_MS) return { ok: false, reason: "spam" };
  if (age > MAX_AGE_MS) return { ok: false, reason: "expired" };
  return { ok: true };
}
