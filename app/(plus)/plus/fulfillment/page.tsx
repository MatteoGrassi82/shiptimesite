import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { CardGrid, CtaBand, FeatureRows, StatBand, TextSection, type FeatureRow } from "@/components/sections/plus-blocks";
import { ImageSlot } from "@/components/sections/plus-mocks";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C4 — Fulfillment. Coded page. Freight-forwarder subsection intentionally
// omitted pending the doc's partner-conflict check.

export const metadata: Metadata = {
  title: "Fulfillment — ShipTime Plus",
  description: "Warehousing, fulfillment, and inventory orchestrated inside the same operating system that moves your freight.",
};

const ROWS: FeatureRow[] = [
  {
    eyebrow: "Warehousing & fulfillment",
    title: "You see everything. You touch nothing.",
    body: "Your inventory lives in our network; your orders flow through custom fulfillment workflows — grouped into batches, picked, packed, and shipped by whatever mode the system says wins.",
    visual: <ImageSlot src="/generated/plus-iso-fulfillment.png" label="Warehouse & fulfillment" />,
  },
  {
    eyebrow: "Inventory",
    title: "One SKU. Every location. No duplicates.",
    body: "Multi-location inventory that treats the same variant as the same item everywhere — allocation, replenishment triggers, and visibility across warehouses without the spreadsheet gymnastics.",
    visual: <ImageSlot src="/generated/plus-iso-inventory.png" label="Multi-location inventory" />,
  },
];

export default async function FulfillmentPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="Fulfillment"
          heading={<>Warehousing, fulfillment, and inventory — <span className="italic">orchestrated.</span></>}
          lead="Storage, pick-and-pack, and stock intelligence inside the same operating system that moves your freight."
          primaryCta={{ label: "Book a call", href: "/plus/book-a-call" }}
          visual={<ImageSlot src="/generated/plus-iso-dock.png" label="Fulfillment hero image" />}
        />

        <FeatureRows rows={ROWS} tone="surface" />

        <TextSection
          eyebrow="Zone skipping & last-mile"
          heading={<>Skip the zones. <span className="italic">Keep the margin.</span></>}
          callout={
            <>
              Our own local delivery service runs <span className="font-semibold">$2–3 cheaper per package</span> than
              carrier rates in dense markets.{" "}
              <span className="text-slate-600">Cost drops on exactly the lanes where you ship density.</span>
            </>
          }
        >
          We consolidate your volume, line-haul it to injection points near your customers, and hand it off to the
          regional parcel network — or to our own local delivery service.
        </TextSection>

        <StatBand
          eyebrow="From our Toronto node alone"
          heading={<>Density where it <span className="italic">pays.</span></>}
          stats={[
            { value: "7M", label: "People reachable same-day" },
            { value: "20%+", label: "Of the Canadian population within reach" },
            { value: "$2–3", label: "Cheaper per package in dense markets" },
            { value: "40 yrs", label: "Our Toronto partner has run warehousing" },
          ]}
        />

        <CardGrid
          tone="surface"
          eyebrow="The certified partner network"
          heading={<>Run by people who&rsquo;ve done it <span className="italic">for decades.</span></>}
          lead="Our fulfillment network is built on certified 3PL partners — vetted, integrated, and held to unbiased performance standards."
          cards={[
            { title: "Proven operators", body: "Our Toronto partner has run warehousing for 40 years: 100K sq ft, 5M orders a year." },
            { title: "Placement by demand", body: "Inventory placed based on demand patterns, not warehouse capacity." },
            { title: "Intelligent node selection", body: "Every order fulfilled from the location that wins on end-to-end cost and speed." },
            { title: "Drop shipping", body: "Supplier-direct fulfillment with the same visibility and branded experience as your own dock." },
          ]}
        />

        <CtaBand heading="See what the network does for your lanes." body="Bring your volumes — we'll model the node placement and the savings." />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
