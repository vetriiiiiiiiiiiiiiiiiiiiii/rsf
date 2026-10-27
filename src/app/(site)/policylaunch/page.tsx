import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSF Policy Framework",
  description: "The R Shivakumar Foundation Policy Framework: 43 policies across 11 categories, with full text and search.",
};

/**
 * The policy framework is a self-contained document (public/policy/) with its own
 * register, search and reader. It is shown here beneath the site header so
 * visitors can move between it and the rest of the site.
 */
export default function RsfPolicyPage() {
  return (
    <section aria-label="RSF Policy Framework" className="bg-white">
      <iframe
        src="/policy/rsf-policy-framework.html"
        title="RSF Policy Framework"
        className="block h-[calc(100svh-var(--header-h))] w-full border-0"
      />
      <p className="shell py-3 text-sm text-muted">
        <a href="/policy/rsf-policy-framework.html" target="_blank" rel="noopener" className="u-link-static">
          Open the policy framework in a full window ↗
        </a>
      </p>
    </section>
  );
}
