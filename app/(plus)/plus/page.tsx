import type { Metadata } from "next";
import PlusHero from "@/components/ui/plus-hero";
import { PageBuilder } from "@/components/sections/page-builder";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { Block, SiteSettings } from "@/components/sections/types";

export const metadata: Metadata = {
  title: "ShipTime Plus — One network. Every border. Done for you.",
  description:
    "The enterprise logistics network layer: audited invoices, cleared borders, and automated routing behind a single account.",
};

// The Plus home. If an editor has published a Plus page with slug "home" its
// sections take over; otherwise the hand-built PlusHero is the default.
export default async function PlusHome() {
  const [settings, page] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] }),
    sanityFetch<{ sections?: Block[] } | null>({
      query: PAGE_QUERY,
      params: { site: "plus", slug: "home" },
      tags: ["page:home", "page"],
    }),
  ]);

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      {page?.sections?.length ? (
        <main>
          <PageBuilder sections={page.sections} />
        </main>
      ) : (
        <PlusHero />
      )}
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
