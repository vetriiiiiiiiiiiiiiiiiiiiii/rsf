const TZ = "Asia/Kolkata";

/** Accepts a Date or an ISO date string ("2026-10-26" is read as that day in India). */
export function toDate(d: Date | string) {
  return typeof d === "string" ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T12:00:00+05:30` : d) : d;
}

export function formatDate(d: Date | string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...opts }).format(toDate(d));
}

/** "26–28 October 2026", "26 October 2026", or null when no date is announced. */
export function formatRange(start: string | null, end: string | null) {
  if (!start) return null;
  if (!end || end === start) return formatDate(start);
  const s = toDate(start);
  const e = toDate(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${formatDate(s, { day: "numeric" })}–${formatDate(e)}`;
  }
  return `${formatDate(s)} – ${formatDate(e)}`;
}

export function dateParts(d: Date | string) {
  const parts = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, day: "2-digit", month: "short", year: "numeric", weekday: "short" }).formatToParts(toDate(d));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("day"), month: get("month").toUpperCase(), year: get("year"), weekday: get("weekday").toUpperCase() };
}

export function formatTime(d: Date) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: true }).format(d);
}

export function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}

/** Splits on newlines and marks *emphasised* fragments for the serif italic treatment. */
export function parseEmphasis(text: string) {
  return text.split("\n").map((line) =>
    line.split(/(\*[^*]+\*)/g).filter(Boolean).map((part) =>
      part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), em: true } : { text: part, em: false },
    ),
  );
}

export function plainText(text: string) {
  return text.replace(/\*/g, "").replace(/\n/g, " ");
}
