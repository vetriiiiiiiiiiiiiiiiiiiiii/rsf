/**
 * Placeholder for institutional content that has not yet been supplied.
 * Deliberately understated on the public site; the administration dashboard
 * keeps the full list of what is outstanding.
 */
export function Pending({ label, note, className = "", inline = false }: { label: string; note?: string; className?: string; inline?: boolean }) {
  if (inline) {
    return <span className={`text-muted italic ${className}`}>To be announced</span>;
  }
  return (
    <div className={`border-l-2 border-gold/70 py-1 pl-5 ${className}`} role="note">
      <p className="label text-muted">Forthcoming</p>
      <p className="mt-2 text-[0.98rem] text-ink">{label} will be published shortly.</p>
      {note ? <span className="sr-only">{note}</span> : null}
    </div>
  );
}
