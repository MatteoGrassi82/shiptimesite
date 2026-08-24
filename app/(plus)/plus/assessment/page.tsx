import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { LpsShiplet } from "@/components/sections/lps-shiplet";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C14 — the Logistics Performance Assessment. Runs the LPS shiplet (Michael's
// 16-question framework, 2026-08-18) — the same unit embedded on /parcelforum.

export const metadata: Metadata = {
  title: "Logistics Performance Score — ShipTime Plus",
  description: "16 questions, 5 minutes. Your Logistics Performance Score across cost, operational excellence and customer experience — with a personalized read on where the leverage is.",
};

export default async function AssessmentPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="Logistics Performance Assessment"
          heading={<>How much is your logistics <span className="italic">leaving on the table?</span></>}
          lead="Sixteen questions. Five minutes. A score out of 100 across the three pillars of a well-designed logistics system — and a personalized read on where your leverage is."
        />
        <section className="bg-[#F8FAFB] py-16 md:py-24">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <LpsShiplet />
          </div>
        </section>
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
