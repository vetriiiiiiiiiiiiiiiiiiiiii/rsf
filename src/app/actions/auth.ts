"use server";

import { redirect } from "next/navigation";
import { audit, createSession, destroySession, getAdmin, hashPassword, requireAdmin, verifyCredentials } from "@/lib/auth";
import { db } from "@/lib/db";
import { log } from "@/lib/log";
import { clearRateLimit, rateLimit } from "@/lib/rate-limit";
import { clientFingerprint, userAgent } from "@/lib/request";
import { flattenErrors, loginSchema, passwordSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export type AuthState = { error?: string; email?: string; ok?: boolean; errors?: Record<string, string> };

export async function login(_prev: AuthState, data: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({ email: data.get("email"), password: data.get("password") });
  const email = typeof data.get("email") === "string" ? String(data.get("email")) : "";
  if (!parsed.success) return { error: "Enter your email and password.", email };

  const ip = await clientFingerprint();
  const ipOk = await rateLimit(`login:ip:${ip}`, 20, 15 * 60);
  const userOk = await rateLimit(`login:user:${parsed.data.email}`, 5, 15 * 60);
  if (!ipOk || !userOk) {
    log("warn", "auth.rate_limited", { email: parsed.data.email });
    return { error: "Too many sign-in attempts. Please wait 15 minutes and try again.", email };
  }

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    log("warn", "auth.failed", { email: parsed.data.email });
    return { error: "Those credentials were not recognised.", email };
  }

  await clearRateLimit(`login:user:${parsed.data.email}`);
  await createSession(user.id, await userAgent());
  await audit(user.id, "login", "session");
  log("info", "auth.login", { userId: user.id });
  redirect("/asdfghjkl");
}

export async function logout() {
  const admin = await getAdmin();
  await destroySession();
  if (admin) await audit(admin.id, "logout", "session");
  redirect("/asdfghjkl/login");
}

export async function changePassword(_prev: AuthState, data: FormData): Promise<AuthState> {
  const admin = await requireAdmin();
  const current = String(data.get("current") ?? "");
  const next = String(data.get("next") ?? "");
  const confirm = String(data.get("confirm") ?? "");
  const user = await db.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await bcrypt.compare(current, user.passwordHash))) return { errors: { current: "Current password is incorrect." } };
  const parsed = passwordSchema.safeParse(next);
  if (!parsed.success) return { errors: { next: flattenErrors(parsed.error).form ?? parsed.error.issues[0].message } };
  if (next !== confirm) return { errors: { confirm: "Passwords do not match." } };
  await db.adminUser.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(next) } });
  // Invalidate all other sessions for this user.
  await db.session.deleteMany({ where: { userId: admin.id } });
  await createSession(admin.id, await userAgent());
  await audit(admin.id, "password_change", "user", admin.id);
  return { ok: true };
}
