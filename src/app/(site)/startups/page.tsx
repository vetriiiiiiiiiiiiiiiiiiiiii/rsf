import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyArchive } from "@/components/home/sections";
import { StartupIndex } from "@/components/startups/startup-index";
import { countPublishedStartups, getCategories, getStartups } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Startups",
  description: "Ventures developed with R Shivakumar Foundation.",
};

export default function StartupsPage() {
  const startups = getStartups();
  const total = countPublishedStartups();

  return (
    <>
      <PageHeader
        index="03"
        label="Startups"
        trail={[{ label: "Startups" }]}
        title={"Startup *portfolio.*"}
        intro={<p>Ventures developed with RS Foundation, recorded as they are verified — the problem each one addresses, the people building it, and where it stands.</p>}
      />
      {total === 0 ? (
        <section className="shell py-16 md:py-24">
          <EmptyArchive />
        </section>
      ) : (
        <StartupIndex startups={startups} categories={getCategories()} />
      )}
    </>
  );
}
