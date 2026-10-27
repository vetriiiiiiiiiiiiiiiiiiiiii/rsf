import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { sha256 } from "./secret";
import type { AdminRole } from "@/generated/prisma/enums";

export const SESSION_COOKIE = "rsf_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
const BCRYPT_COST = 12;

export function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_COST);
}

// A real hash compared against when the email is unknown, keeping login timing constant.
let dummyHash: string | undefined;
function getDummyHash() {
  return (dummyHash ??= bcrypt.hashSync("rsf-timing-equaliser", BCRYPT_COST));
}

export async function verifyCredentials(email: string, password: string) {
  const user = await db.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  const ok = await bcrypt.compare(password, user?.passwordHash ?? getDummyHash());
  if (!user || !ok || !user.active) return null;
  return user;
}

export async function createSession(userId: string, userAgent: string | null) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.session.create({ data: { tokenHash: sha256(token), userId, expiresAt, userAgent } });
  await db.adminUser.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  // Opportunistically clear expired sessions.
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: sha256(token) } });
  jar.delete(SESSION_COOKIE);
}

/** Resolves the signed-in administrator for this request, or null. Memoised per request. */
export const getAdmin = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: { select: { id: true, email: true, name: true, role: true, active: true } } },
  });
  if (!session || session.expiresAt < new Date() || !session.user.active) return null;
  return session.user;
});

export type Admin = NonNullable<Awaited<ReturnType<typeof getAdmin>>>;

/** Server-side authorisation gate. Every admin page and action calls this. */
export async function requireAdmin(role?: AdminRole): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/asdfghjkl/login");
  if (role === "ADMIN" && admin.role !== "ADMIN") redirect("/asdfghjkl?denied=1");
  return admin;
}

export async function audit(userId: string, action: string, entity: string, entityId?: string, summary?: string) {
  await db.auditLog.create({ data: { userId, action, entity, entityId, summary: summary?.slice(0, 240) } });
}
