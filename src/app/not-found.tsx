import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ArrowLink } from "@/components/ui/arrow-link";
import { hasLogo } from "@/lib/brand";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <>
      <SiteHeader hasLogo={hasLogo()} />
      <main id="main" className="on-dark blueprint-ground -mt-[var(--header-h)] pt-[var(--header-h)]">
        <div className="shell grid-12 gap-y-10 py-20 md:py-32">
        <div className="col-span-12 lg:col-span-6">
          <p className="label text-blue">Page not found</p>
          <h1 className="display-lg mt-8 text-ink">
            This page is
            <br />
            <em className="em-serif text-pale">not on the plan.</em>
          </h1>
          <p className="lede mt-8 max-w-[40ch] text-muted">The address may be mistyped, or the page may have moved or been unpublished.</p>
          <div className="mt-10 flex flex-wrap gap-6">
            <ArrowLink href="/" variant="inverse">
              Return to the index
            </ArrowLink>
            <ArrowLink href="/contact" variant="text-inverse">Report a broken link</ArrowLink>
          </div>
        </div>
        <svg aria-hidden viewBox="0 0 400 300" className="col-span-12 h-auto w-full lg:col-span-5 lg:col-start-8" fill="none">
          <rect x="0.5" y="0.5" width="399" height="299" stroke="rgba(255,255,255,0.3)" />
          <rect x="60" y="50" width="280" height="200" stroke="white" strokeDasharray="6 6" />
          <path d="M60 50L340 250M340 50L60 250" stroke="rgba(255,255,255,0.3)" />
          <circle cx="200" cy="150" r="5" fill="white" />
          <text x="68" y="44" className="font-mono" fontSize="10" fill="rgba(255,255,255,0.7)">
            404
          </text>
        </svg>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
