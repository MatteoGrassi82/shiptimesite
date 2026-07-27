import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { CardGrid, CtaBand, FeatureRows, type FeatureRow } from "@/components/sections/plus-blocks";
import { ImageSlot } from "@/components/sections/plus-mocks";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C3 — Platform. Coded page. Three capability rows (one interactive), then a
// grid for the remaining platform surfaces.

export const metadata: Metadata = {
  title: "Platform — every mode, every carrier — ShipTime Plus",
  description: "Courier to ocean, parcel to full truckload — quoted, booked, and tracked in one platform, with intelligence deciding what moves how.",
};

const ROWS: FeatureRow[] = [
  {
    eyebrow: "Multimodal",
    title: "Courier, LTL, FTL, ocean.",
    subhead: "Most platforms do parcels. Your business doesn't stop there.",
    body: "Plus runs every mode in one place — so a pallet, a container, and a box get the same rate discipline, the same visibility, the same system. Within each mode, every carrier you use is rate-shopped automatically. No default-carrier tax.",
    visual: <ImageSlot src="/generated/plus-iso-rateshop.png" label="Multimodal rate shop" />,
  },
  {
    eyebrow: "Freight brokerage",
    title: "Your quote: $450. The market's: $375.",
    subhead: "When you have time, you have leverage. Now you have both.",
    body: "Punch in an LTL shipment and get an instant rate. Then hit one more button: your shipment goes to the spot board, carriers bid, and within about an hour you have a market-tested price. Book whichever wins.",
    visual: <ImageSlot src="/generated/plus-iso-spot.png" label="Spot board — carrier bidding" />,
  },
  {
    eyebrow: "Analytics & intelligence",
    title: "The numbers your next negotiation needs.",
    subhead: "Operational intelligence on your own data.",
    body: "Cost per lane, mode mix, carrier performance, exception rates — every shipment scored against what it should have cost. Overcharges surfaced, renegotiations backed by data.",
    visual: <ImageSlot src="/generated/plus-iso-analytics.png" label="Lane & cost analytics" />,
  },
];

export default async function PlatformPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="Platform"
          heading={<>Every mode. Every carrier. <span className="italic">One brain.</span></>}
          lead="Courier to ocean, parcel to full truckload — quoted, booked, and tracked in one platform, with intelligence deciding what moves how."
          primaryCta={{ label: "Book a call", href: "/plus/book-a-call" }}
          visual={<ImageSlot src="/generated/plus-iso-multimodal.png" label="Platform hero image" />}
        />

        <FeatureRows rows={ROWS} tone="surface" />

        <CardGrid
          eyebrow="Also in the platform"
          heading={<>Everything else the <span className="italic">system runs.</span></>}
          cards={[
            { title: "Bring your own rates", body: "Plug in your carrier contracts. We orchestrate on top — your rates where they win, ours where they don't, one system running both." },
            { title: "Customs brokerage", body: "From a factory overseas to a customer in Toronto: collection, ocean freight, clearance, and delivery into our network. One partner, the whole chain.", tag: "Rolling out" },
            { title: "Open API", body: "Full API access for teams that build: rating, booking, tracking, documents. Everything the platform does, programmable." },
            { title: "One invoice", body: "Parcel and freight settled on one clean invoice — total landed cost up front, no surprise surcharges at month end." },
          ]}
        />

        <CtaBand heading="See it run on your lanes." body="Bring a recent invoice — we'll show you where the system finds money." />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
