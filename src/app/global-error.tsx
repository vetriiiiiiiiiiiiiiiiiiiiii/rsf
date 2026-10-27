"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ fontFamily: "system-ui, sans-serif", color: "#1B2266", background: "#fff", padding: "10vh 6vw" }}>
        <p style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.08em", color: "#2A3382" }}>RS FOUNDATION — ERROR</p>
        <h1 style={{ fontSize: 40, letterSpacing: "-0.03em", maxWidth: "18ch" }}>The site is temporarily unavailable.</h1>
        <button onClick={reset} style={{ marginTop: 24, background: "#2A3382", color: "#fff", border: 0, padding: "14px 20px", fontSize: 16 }}>
          Try again
        </button>
      </body>
    </html>
  );
}
