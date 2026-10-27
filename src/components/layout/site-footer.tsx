import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { NAV } from "@/lib/site";
import { BrandLogo } from "./brand-logo";
import { Wordmark } from "./wordmark";
import { hasLogo } from "@/lib/brand";

const SOCIAL = [
  { key: "social.linkedin", label: "LinkedIn" },
  { key: "social.instagram", label: "Instagram" },
  { key: "social.x", label: "X" },
  { key: "social.youtube", label: "YouTube" },
] as const;

export async function SiteFooter() {
  const s = await getSettings();
  const socials = SOCIAL.filter((x) => s[x.key]);
  const hasContact = Boolean(s["contact.email"] || s["contact.phone"] || s["contact.address"]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-white text-ink">
      <div className="shell grid-12 gap-y-12 py-16 md:py-20">
        <div className="col-span-12 md:col-span-5">
          {hasLogo() ? <BrandLogo height={72} plate={false} /> : <Wordmark />}
          <p className="mt-8 max-w-[38ch] leading-relaxed text-muted">
            An innovation and incubation centre helping founders, students and researchers develop ideas into ventures.
          </p>
          <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-muted">{s["institution.association"]}</p>
        </div>

        <nav aria-label="Footer" className="col-span-6 md:col-span-2 md:col-start-7">
          <p className="label text-ink">Explore</p>
          <ul className="mt-5 space-y-2.5 text-[0.95rem] text-muted">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="u-link hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-3">
          <p className="label text-ink">Contact</p>
          <address className="mt-5 space-y-2.5 text-[0.95rem] not-italic text-muted">
            {s["contact.email"] ? (
              <a className="u-link block hover:text-ink" href={`mailto:${s["contact.email"]}`}>
                {s["contact.email"]}
              </a>
            ) : null}
            {s["contact.phone"] ? (
              <a className="u-link block hover:text-ink" href={`tel:${s["contact.phone"].replace(/\s+/g, "")}`}>
                {s["contact.phone"]}
              </a>
            ) : null}
            {s["contact.address"] ? <p className="whitespace-pre-line">{s["contact.address"]}</p> : null}
            {!hasContact ? <p>Tiruchirappalli, Tamil Nadu</p> : null}
            <Link href="/contact" className="u-link block text-blue">
              Send an enquiry
            </Link>
          </address>
          {socials.length ? (
            <>
              <p className="label mt-8 text-ink">Follow</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem] text-muted">
                {socials.map((x) => (
                  <li key={x.key}>
                    <a className="u-link hover:text-ink" href={s[x.key]} target="_blank" rel="noopener noreferrer">
                      {x.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="col-span-12 md:col-span-2">
          <Link href="/apply" className="inline-flex items-center gap-3 bg-blue px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-ink">
            Apply for Incubation
          </Link>
        </div>
      </div>

      <div className="border-t border-rule bg-pale">
        <div className="shell flex flex-col gap-3 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} R Shivakumar Foundation. All rights reserved.</p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="u-link hover:text-ink">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="u-link hover:text-ink">
                Terms of use
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
