import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal";
import { Pending } from "@/components/ui/pending";

export const metadata: Metadata = { title: "Terms of use", description: "Terms governing use of the RS Foundation website." };

export default function TermsPage() {
  return (
    <LegalPage
      index="L2"
      label="Terms"
      title={"Terms of *use.*"}
      updated="October 2026"
      sections={[
        { h: "About these terms", body: <p>These terms govern your use of this website. By using the site you agree to them. <Pending inline label="Operating legal entity" /></p> },
        {
          h: "Content",
          body: <p>We aim to keep information on this site accurate and current, but programmes, events and other details may change. Programmes marked “proposed” are indicative and do not constitute an offer.</p>,
        },
        {
          h: "Applications",
          body: <p>Submitting an application does not guarantee admission to any programme. Decisions are made at the foundation&rsquo;s discretion. You confirm that information you submit is accurate and that you have the right to share it.</p>,
        },
        {
          h: "Your submissions",
          body: <p>You retain ownership of the ideas and materials you submit. We use them only to assess and correspond about your application or enquiry, as described in the privacy policy. <Pending inline label="Confidentiality terms for applications" /></p>,
        },
        {
          h: "Names, logos and trademarks",
          body: <p>Names and logos of institutions, partners and ventures shown on this site belong to their respective owners and are displayed with permission. The RS Foundation identity on this site is provisional.</p>,
        },
        { h: "Acceptable use", body: <p>Do not attempt to disrupt the site, access areas you are not authorised to use, or submit unlawful, misleading or automated content.</p> },
        { h: "Governing law", body: <p><Pending inline label="Governing law and jurisdiction" /></p> },
      ]}
    />
  );
}
