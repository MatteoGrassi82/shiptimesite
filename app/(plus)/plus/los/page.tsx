import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { CtaBand, EngagementSteps, FeatureRows, TextSection } from "@/components/sections/plus-blocks";
import { LOS_ROWS } from "@/components/sections/plus-content";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C2 — Logistics Operating System. Coded page in the Hana design language.

export const metadata: Metadata = {
  title: "The Logistics Operating System — ShipTime Plus",
  description: "Not software you buy. A system we build — on your data, around your operation, run with your team.",
};

const ENGAGEMENT_STEPS = [
  { label: "Discovery call", body: "What you ship, where, with whom, what hurts." },
  { label: "System design", body: "We map your operation and design the LOS around it." },
  { label: "Proposal", body: "Concrete, quantified: here's the system, here's the savings." },
  { label: "Build & embed", body: "Phased rollout, our team inside yours." },
  { label: "Operate", body: "Autopilot expands, results measured, quarterly design reviews." },
];

export default async function LosPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="Logistics Operating System"
          heading={<>Not software you buy. A system <span className="italic">we build.</span></>}
          lead="On your data, around your operation, run with your team — the Logistics Operating System."
          primaryCta={{ label: "Book a call", href: "/plus/book-a-call" }}
          secondaryCta={{ label: "How we work", href: "/plus/how-we-work" }}
        />

        <TextSection
          tone="surface"
          eyebrow="Why an operating system"
          heading={<>Software gave you tools. Nobody gave you a <span className="italic">system.</span></>}
          callout={
            <>
              The real operating logic of your logistics lives in spreadsheets, inboxes, and the heads of{" "}
              <span className="font-semibold">two or three irreplaceable people.</span>{" "}
              <span className="text-slate-600">An LOS captures that logic and then runs it.</span>
            </>
          }
        >
          Every logistics tool you&rsquo;ve bought solved one slice — a rate shopper here, a WMS there, a TMS half your
          team uses. The result is fragmentation. An LOS is different: it connects everything you already have,
          captures the logic that was never written down, and then runs it.
        </TextSection>

        {/* The three phases, as alternating rows with product mocks */}
        <FeatureRows rows={LOS_ROWS} tone="page" />

        <EngagementSteps
          eyebrow="The engagement"
          heading={<>What an engagement <span className="italic">looks like.</span></>}
          steps={ENGAGEMENT_STEPS}
        />

        <CtaBand
          heading={<>Book the <span className="italic">discovery call.</span></>}
          body="30 minutes, no deck — what you ship, where it hurts, and a first read on the savings."
        />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
