import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal";
import { Pending } from "@/components/ui/pending";

export const metadata: Metadata = { title: "Privacy policy", description: "How RS Foundation handles personal data submitted through this website." };

export default function PrivacyPage() {
  return (
    <LegalPage
      index="L1"
      label="Privacy"
      title={"Privacy *policy.*"}
      updated="October 2026"
      sections={[
        {
          h: "Who we are",
          body: (
            <>
              <p>This website is operated by RS Foundation (“we”, “us”). For questions about this policy or your personal data, contact the person responsible for data protection:</p>
              <p>
                <Pending inline label="Legal entity name" /> <Pending inline label="Grievance officer & contact" />
              </p>
            </>
          ),
        },
        {
          h: "What we collect",
          body: (
            <>
              <p>We only collect information you choose to send us through the forms on this website:</p>
              <p>
                <strong>Contact and partnership enquiries</strong> — your name, email address, and optionally phone number and organisation, with your message.{" "}
                <strong>Event registrations</strong> — your name, email address, and optionally phone number and organisation.{" "}
                <strong>Incubation applications</strong> — your contact details, information about your venture and team, and optionally a pitch deck.
              </p>
            </>
          ),
        },
        {
          h: "How we use it",
          body: <p>To respond to your enquiry, manage event attendance, and assess and correspond about your application. We do not sell personal data or use it for advertising.</p>,
        },
        {
          h: "Cookies and tracking",
          body: <p>The public website sets no tracking or advertising cookies and uses no third-party analytics. A strictly necessary session cookie is set only for authorised administrators who sign in to manage the site.</p>,
        },
        {
          h: "Security and storage",
          body: (
            <p>
              Submissions are stored in a secured database. Pitch decks are private files available only to authorised administrators. To prevent abuse, we keep a keyed, irreversible hash of the network
              address used to submit a form for a short time; we do not store raw IP addresses with submissions.
            </p>
          ),
        },
        {
          h: "Retention",
          body: (
            <p>
              We keep submissions only as long as needed for the purposes above. <Pending inline label="Retention period" />
            </p>
          ),
        },
        {
          h: "Your rights",
          body: <p>Subject to applicable law, including the Digital Personal Data Protection Act, 2023, you may ask to access, correct or erase your personal data, or withdraw consent, by contacting us using the details above.</p>,
        },
      ]}
    />
  );
}
