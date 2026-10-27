"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="on-dark blueprint-ground -mt-[var(--header-h)] pt-[var(--header-h)]">
      <div className="shell py-24 md:py-32">
      <p className="label text-blue">Error — The drawing could not be completed</p>
      <h1 className="display-md mt-6 max-w-[20ch] text-ink">Something went wrong loading this page.</h1>
      <p className="mt-6 max-w-[48ch] text-muted">Please try again. If the problem continues, the site may be temporarily unavailable.</p>
      {error.digest ? <p className="label mt-4 text-muted">Reference {error.digest}</p> : null}
      <div className="mt-10 flex flex-wrap gap-6">
        <button type="button" onClick={reset} className="bg-white px-5 py-3.5 font-medium text-ink hover:bg-pale">
          Try again
        </button>
        <Link href="/" className="u-link-static self-center text-ink">
          Return to the index
        </Link>
      </div>
      </div>
    </section>
  );
}
