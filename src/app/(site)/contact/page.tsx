import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Pending } from "@/components/ui/pending";
import { Arrow } from "@/components/ui/arrow-link";
import { Suspense } from "react";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact RS Foundation — for founders, students, mentors, investors and partners.",
};

const PATHS = [
  { t: "Startup founders", c: "Ready to build? Apply for incubation.", href: "/apply" },
  { t: "Students & innovators", c: "Have an idea, or just a question? Start here.", href: "/contact?type=STUDENT#write" },
  { t: "Mentors", c: "Offer your experience to early-stage teams.", href: "/ecosystem?type=MENTOR#enquire" },
  { t: "Investors", c: "Meet ventures as they become investment-ready.", href: "/ecosystem?type=INVESTOR#enquire" },
  { t: "Industry partners", c: "Bring a real problem, data or a pilot.", href: "/ecosystem?type=INDUSTRY#enquire" },
];

export default function ContactPage() {
  const s = getSettings();

  return (
    <>
      <PageHeader index="07" label="Contact" trail={[{ label: "Contact" }]} variant="stacked" title={"Contact *us.*"} intro={<p>Choose the route that fits, or write to us directly below.</p>} />

      <section aria-label="Routes" className="border-b border-rule">
        <ol className="shell grid sm:grid-cols-2 lg:grid-cols-5">
          {PATHS.map((p, i) => (
            <li key={p.t} className="border-b border-rule sm:border-r lg:border-b-0 lg:last:border-r-0">
              <Link href={p.href} className="group flex h-full flex-col p-5 transition-colors hover:bg-pale lg:min-h-56">
                <span className="label text-blue">{String.fromCharCode(65 + i)}</span>
                <span className="mt-8 text-[1.25rem] font-semibold leading-tight text-ink">{p.t}</span>
                <span className="mt-2 flex-1 text-sm text-muted">{p.c}</span>
                <Arrow className="mt-6 text-blue" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section id="write" aria-labelledby="write-title" className="scroll-mt-24 py-20 md:py-28">
        <div className="shell grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <h2 id="write-title" className="display-md text-ink">
              Write to us
            </h2>
            <dl className="mt-10 space-y-6">
              {[
                { k: "Email", v: s["contact.email"], href: s["contact.email"] ? `mailto:${s["contact.email"]}` : undefined },
                { k: "Phone", v: s["contact.phone"], href: s["contact.phone"] ? `tel:${s["contact.phone"].replace(/\s+/g, "")}` : undefined },
                { k: "Address", v: s["contact.address"] },
                { k: "Hours", v: s["contact.hours"] },
              ].map((d) => (
                <div key={d.k} className="border-t border-rule pt-3">
                  <dt className="label text-muted">{d.k}</dt>
                  <dd className="mt-2 whitespace-pre-line text-ink">
                    {d.v ? (
                      d.href ? (
                        <a href={d.href} className="u-link-static">
                          {d.v}
                        </a>
                      ) : (
                        d.v
                      )
                    ) : (
                      <Pending inline label={d.k} />
                    )}
                  </dd>
                </div>
              ))}
              {s["contact.mapUrl"] ? (
                <a href={s["contact.mapUrl"]} target="_blank" rel="noopener noreferrer" className="label u-link-static inline-block text-blue">
                  Open map ↗
                </a>
              ) : null}
            </dl>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Suspense>
              <InquiryForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
