import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { ShipletsParallax } from "@/components/sections/plus-shiplets";
import { CardGrid, CtaBand, TextSection } from "@/components/sections/plus-blocks";
import type { SiteSettings } from "@/components/sections/types";

// Shiplets — the micro-app layer of ShipTime Plus. The parallax wall IS the
// hero (it carries its own header), so no PageHero here.

export const metadata: Metadata = {
  title: "Shiplets — the micro-apps inside ShipTime Plus",
  description:
    "A shiplet is a micro-application that does one job inside your logistics operating system — rate shopping, invoice recovery, node selection, exception watch. One data layer underneath them all.",
};

export default async function ShipletsPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main style={{ background: "#FBFBFC" }}>
        <ShipletsParallax />

        <TextSection
          tone="surface"
          eyebrow="Why micro-apps"
          heading={<>A tool you bolt on is a silo. A shiplet <span className="italic">is not.</span></>}
          callout={
            <>
              Every shiplet reads the same unified data layer and the same rules your team already agreed on —{" "}
              <span className="font-semibold">so switching one on adds capability, never another integration.</span>
            </>
          }
        >
          The old way to add a capability was to buy a product, integrate it, and maintain the seam forever. Inside the
          operating system there is no seam: a shiplet inherits your carriers, your negotiated rates, your lanes, and
          your exception history from the moment it's enabled.
        </TextSection>

        <CardGrid
          eyebrow="How they compose"
          heading={<>Turn one on. It already knows <span className="italic">your operation.</span></>}
          lead="Shiplets are enabled per workflow during the build phase of your engagement — not bought, not separately integrated."
          cards={[
            { title: "One data layer", body: "Every shiplet reads the unified layer built in Phase 1 — your ERP, stores, carrier accounts, and WMS, already orchestrated." },
            { title: "Shared rules", body: "The logic captured from your team applies everywhere at once. Change a rule and every shiplet honours it." },
            { title: "Earned autonomy", body: "Each shiplet starts in recommend mode and graduates to autonomous once its hit rate is proven — with full audit trails." },
          ]}
        />

        <CtaBand
          heading={<>Which shiplets would <span className="italic">your operation run?</span></>}
          body="Bring your lanes and volumes to a 30-minute call — we'll map the ones that pay for themselves first."
        />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
