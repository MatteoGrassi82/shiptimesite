import type { Metadata } from "next";
import { PlusHome } from "@/components/sections/plus-home";
import { PageBuilder } from "@/components/sections/page-builder";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import type { Block, SiteSettings } from "@/components/sections/types";

export const metadata: Metadata = {
  title: "Your logistics, on autopilot. — ShipTime Plus",
  description:
    "ShipTime Plus is a logistics operating system designed around your operation — every mode, every carrier, every warehouse, orchestrated by embedded experts and AI built on your data.",
};

// The Plus home. If an editor has published a Plus page with slug "home" its
// sections take over; otherwise the coded homepage (PlusHome) is the default.
export default async function Page() {
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
      <main>{page?.sections?.length ? <PageBuilder sections={page.sections} /> : <PlusHome />}</main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
