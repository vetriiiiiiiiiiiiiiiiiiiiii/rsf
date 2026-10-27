/** Converts between Date and the value of an <input type="datetime-local"> interpreted in IST (UTC+05:30). */
const IST_OFFSET_MIN = 330;

export function toISTInput(d: Date | null | undefined) {
  if (!d) return "";
  const shifted = new Date(d.getTime() + IST_OFFSET_MIN * 60_000);
  return shifted.toISOString().slice(0, 16);
}

export function fromISTInput(v: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return null;
  const d = new Date(`${v}:00+05:30`);
  return Number.isNaN(d.getTime()) ? null : d;
}
