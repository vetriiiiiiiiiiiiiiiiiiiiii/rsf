const TZ = "Asia/Kolkata";

export function formatDate(d: Date, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...opts }).format(d);
}

export function dateParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, day: "2-digit", month: "short", year: "numeric", weekday: "short" }).formatToParts(d);
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
