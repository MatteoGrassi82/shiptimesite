import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { AssessmentTool } from "@/components/sections/plus-assessment-client";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C14 — the logistics self-assessment. Coded page (not Sanity-driven); the
// Plus counterpart of Core's savings calculator.

export const metadata: Metadata = {
  title: "Logistics maturity assessment — ShipTime Plus",
  description: "12 questions, 3 minutes. A maturity score, benchmarks, and your three highest-pressure fixes — free.",
};

export default async function AssessmentPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="Free assessment"
          heading={<>How much is your logistics <span className="italic">leaving on the table?</span></>}
          lead="12 questions, 3 minutes. A maturity score, benchmarks against operations like yours, and the three highest-pressure fixes — free."
        />
        <section className="bg-[#F8FAFB] py-16 md:py-24">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <AssessmentTool />
          </div>
        </section>
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
