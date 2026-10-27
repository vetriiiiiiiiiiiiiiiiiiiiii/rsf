import { test } from "node:test";
import assert from "node:assert/strict";

process.env.APP_SECRET ??= "test-secret-test-secret-test-secret-123";
// The Prisma client is constructed on import but never connects in these tests.
process.env.DATABASE_URL ??= "postgres://test:test@127.0.0.1:1/test";

const { issueFormToken, checkFormGuard } = await import("../src/lib/form-guard");
const { sniff, imageSize } = await import("../src/lib/uploads");
const { toCsv } = await import("../src/lib/csv");
const { fromISTInput, toISTInput } = await import("../src/lib/admin/datetime");

function form(entries: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
}

test("form guard: rejects filled honeypot", () => {
  const r = checkFormGuard("inquiry", form({ form_token: issueFormToken("inquiry"), company_website: "spam.example" }));
  assert.deepEqual(r, { ok: false, reason: "spam" });
});

test("form guard: rejects instant submissions and forged tokens", () => {
  assert.deepEqual(checkFormGuard("inquiry", form({ form_token: issueFormToken("inquiry") })), { ok: false, reason: "spam" });
  const old = (Date.now() - 10_000).toString(36);
  assert.deepEqual(checkFormGuard("inquiry", form({ form_token: `${old}.forged` })), { ok: false, reason: "expired" });
  // A token for one form cannot be replayed on another.
  assert.equal(checkFormGuard("application", form({ form_token: issueFormToken("inquiry") })).ok, false);
});

test("form guard: accepts a token issued a few seconds ago", async () => {
  const realNow = Date.now;
  const token = issueFormToken("inquiry");
  Date.now = () => realNow() + 5000;
  try {
    assert.deepEqual(checkFormGuard("inquiry", form({ form_token: token })), { ok: true });
  } finally {
    Date.now = realNow;
  }
});

test("uploads: identifies files by content, not name", () => {
  const png = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(png);
  png.writeUInt32BE(640, 16);
  png.writeUInt32BE(480, 20);
  assert.equal(sniff(png)?.mime, "image/png");
  assert.deepEqual(imageSize(png, "image/png"), { width: 640, height: 480 });
  assert.equal(sniff(Buffer.from("%PDF-1.7 ..."))?.kind, "DOCUMENT");
  assert.equal(sniff(Buffer.from("<svg onload=alert(1)>")), null);
  assert.equal(sniff(Buffer.from("<html><script>")), null);
});

test("csv: escapes quotes and neutralises formulas", () => {
  const csv = toCsv([{ a: '=HYPERLINK("x")', b: 'He said "hi", twice' }], ["a", "b"]);
  assert.equal(csv.split("\r\n")[1], `"'=HYPERLINK(""x"")","He said ""hi"", twice"`);
});

test("datetime: IST round trip", () => {
  const d = fromISTInput("2026-11-05T10:30");
  assert.equal(d?.toISOString(), "2026-11-05T05:00:00.000Z");
  assert.equal(toISTInput(d), "2026-11-05T10:30");
  assert.equal(fromISTInput("not a date"), null);
});
