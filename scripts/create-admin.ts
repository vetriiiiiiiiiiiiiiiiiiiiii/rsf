import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/** Creates (or resets the password of) an administrator from ADMIN_EMAIL / ADMIN_PASSWORD. */
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 1 }) });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment.");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  const passwordHash = await bcrypt.hash(password, 12);
  await db.adminUser.upsert({
    where: { email },
    update: { passwordHash, active: true, role: "ADMIN" },
    create: { email, name: "Administrator", role: "ADMIN", passwordHash },
  });
  await db.session.deleteMany({ where: { user: { email } } });
  console.log(`Administrator ${email} is ready. Remove ADMIN_PASSWORD from the environment now.`);
}

main().finally(() => db.$disconnect());
