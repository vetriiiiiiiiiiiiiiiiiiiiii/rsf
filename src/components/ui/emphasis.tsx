import { parseEmphasis } from "@/lib/format";

/** Renders CMS headline text: one masked line per row, *fragments* in serif italic. */
export function MaskedLines({ text, className = "", startIndex = 0 }: { text: string; className?: string; startIndex?: number }) {
  return (
    <>
      {parseEmphasis(text).map((parts, i) => (
        <span key={i} className={`mask-line ${className}`} style={{ "--i": i + startIndex } as React.CSSProperties}>
          <span>
            {parts.map((p, j) =>
              p.em ? (
                <em key={j} className="em-serif">
                  {p.text}
                </em>
              ) : (
                <span key={j}>{p.text}</span>
              ),
            )}
          </span>
        </span>
      ))}
    </>
  );
}

export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {parseEmphasis(text).map((parts, i, all) => (
        <span key={i}>
          {parts.map((p, j) => (p.em ? <em key={j} className="em-serif">{p.text}</em> : <span key={j}>{p.text}</span>))}
          {i < all.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
