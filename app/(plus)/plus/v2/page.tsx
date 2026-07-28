import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { PlusHomeV2 } from "@/components/sections/plus-home-v2";
import type { SiteSettings } from "@/components/sections/types";

// Variant B of the Plus homepage (/plus/v2) — an unlisted comparison surface,
// same idea as Core's /home-2. Noindexed until a direction is chosen; if it
// wins, its sections replace PlusHome and this route goes away.

export const metadata: Metadata = {
  title: "Your logistics, on autopilot. — ShipTime Plus (V2)",
  description:
    "ShipTime Plus is a logistics operating system designed around your operation — every mode, every carrier, every warehouse, orchestrated by embedded experts and AI built on your data.",
  robots: "noindex",
};

export default async function PlusHomeVariantTwo() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PlusHomeV2 />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
