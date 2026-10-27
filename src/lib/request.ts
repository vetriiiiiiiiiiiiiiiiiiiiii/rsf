import "server-only";
import { headers } from "next/headers";
import { hmac } from "./secret";

/** A keyed hash of the caller's IP — used for rate limiting without storing raw addresses. */
export async function clientFingerprint() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  return hmac(`ip:${ip}`).slice(0, 32);
}

export async function userAgent() {
  return (await headers()).get("user-agent")?.slice(0, 255) ?? null;
}
