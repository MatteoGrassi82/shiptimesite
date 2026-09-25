import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { PlusHomeV3 } from "@/components/sections/plus-home-v3";
import type { SiteSettings } from "@/components/sections/types";

// Variant C of the Plus homepage (/plus/v3) — the "first iteration" layout from
// the internal brief: who it's for → the problems → the solution (what / how
// we're different / three pillars) → proof. V2 visual language via plus-v2-kit.
// Noindexed while positioning is being tested against live prospects.

export const metadata: Metadata = {
  title: "Logistics, fully optimized. | ShipTime One (V3)",
  description:
    "ShipTime One designs Logistics Operating Systems for growing e-commerce businesses: reducing shipping costs, improving delivery times, and improving the customer experience.",
  robots: "noindex",
};

export default async function PlusHomeVariantThree() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  // The footer copy comes from Sanity fields shared across the whole plus zone,
  // and footerNote still reads "ShipTime Plus is the designed-deal tier…".
  // Renaming in the CMS would rename it on all 22 indexed pages, so it is
  // substituted here for this page only. Delete this once the zone-wide
  // rename is agreed and made in Sanity.
  const toOne = (s?: string) => s?.replace(/ShipTime Plus/g, "ShipTime One");
  const oneSettings: SiteSettings | undefined = settings
    ? { ...settings, tagline: toOne(settings.tagline), footerNote: toOne(settings.footerNote) }
    : settings;

  return (
    <>
      <ZoneNav zone="plus" settings={oneSettings} minimal brandSuffix="One" />
      <main>
        <PlusHomeV3 />
      </main>
      <ZoneFooter zone="plus" settings={oneSettings} brandSuffix="One" />
    </>
  );
}
