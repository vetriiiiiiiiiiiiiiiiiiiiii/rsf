import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

function appSecret() {
  const secret = process.env.APP_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("APP_SECRET must be set to at least 32 characters");
  }
  return secret;
}

export function hmac(value: string) {
  return createHmac("sha256", appSecret()).update(value).digest("base64url");
}

export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
