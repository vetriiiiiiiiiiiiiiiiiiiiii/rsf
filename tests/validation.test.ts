import { test } from "node:test";
import assert from "node:assert/strict";
import { applicationSchema, inquirySchema, passwordSchema } from "../src/lib/validation";

const validApplication = {
  founderName: "A Founder",
  email: "Founder@Example.test ",
  phone: "+91 90000 00000",
  ventureName: "Venture",
  sector: "Health",
  stage: "Idea",
  problem: "x".repeat(40),
  solution: "y".repeat(40),
  teamSize: "3",
  team: "z".repeat(20),
  support: "w".repeat(20),
  consent: "on",
  website: "example.org",
};

test("application: valid input is normalised", () => {
  const r = applicationSchema.safeParse(validApplication);
  assert.ok(r.success);
  assert.equal(r.data.email, "founder@example.test");
  assert.equal(r.data.teamSize, 3);
  assert.equal(r.data.website, "https://example.org");
  assert.equal(r.data.institution, undefined);
});

test("application: consent is mandatory", () => {
  const r = applicationSchema.safeParse({ ...validApplication, consent: undefined });
  assert.ok(!r.success);
  assert.ok(r.error.issues.some((i) => i.path[0] === "consent"));
});

test("application: rejects unknown stage and bad phone", () => {
  const r = applicationSchema.safeParse({ ...validApplication, stage: "Unicorn", phone: "call me" });
  assert.ok(!r.success);
  const paths = r.error.issues.map((i) => i.path[0]);
  assert.ok(paths.includes("stage") && paths.includes("phone"));
});

test("application: rejects javascript: URLs", () => {
  const r = applicationSchema.safeParse({ ...validApplication, website: "javascript:alert(1)" });
  assert.ok(!r.success);
});

test("inquiry: enforces type whitelist and message length", () => {
  const base = { type: "MENTOR", name: "N", email: "n@example.test", message: "m".repeat(20), consent: "on" };
  assert.ok(inquirySchema.safeParse(base).success);
  assert.ok(!inquirySchema.safeParse({ ...base, type: "ADMIN" }).success);
  assert.ok(!inquirySchema.safeParse({ ...base, message: "short" }).success);
});

test("password policy", () => {
  assert.ok(!passwordSchema.safeParse("short1").success);
  assert.ok(!passwordSchema.safeParse("onlylettersherexx").success);
  assert.ok(passwordSchema.safeParse("a-long-passphrase-42").success);
});
