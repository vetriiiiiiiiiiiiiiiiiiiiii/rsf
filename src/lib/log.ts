import "server-only";

type Level = "info" | "warn" | "error";

/** Structured JSON logging — one line per event, safe to ship to any log collector. */
export function log(level: Level, event: string, data: Record<string, unknown> = {}) {
  const entry = { ts: new Date().toISOString(), level, event, ...serialise(data) };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

function serialise(data: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    out[k] = v instanceof Error ? { name: v.name, message: v.message, stack: v.stack } : v;
  }
  return out;
}
