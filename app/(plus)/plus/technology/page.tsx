import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { CardGrid, CtaBand, FeatureRows, TextSection, type FeatureRow } from "@/components/sections/plus-blocks";
import { ImageSlot } from "@/components/sections/plus-mocks";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C9 — Technology. Coded page.

export const metadata: Metadata = {
  title: "Technology — ShipTime Plus",
  description: "Orchestration across your existing systems, AI built on your operation's context, and infrastructure your IT team can sign off on.",
};

const ROWS: FeatureRow[] = [
  {
    eyebrow: "Orchestration, not replacement",
    title: "Connects to what you already run.",
    body: "ERP, e-commerce platforms, WMS, carrier accounts, finance systems — up to 30 connections, orchestrated into one operational layer. Nothing gets ripped out; everything starts talking.",
    visual: <ImageSlot src="/generated/plus-iso-orchestration.png" label="Orchestration — 30 systems" />,
  },
  {
    eyebrow: "Custom AI, your context",
    title: "Generic software ships with generic logic. Ours doesn't.",
    body: "It's built on your data: your lanes, your seasonality, your carrier performance, your exceptions history — plus the rules your team carries in their heads, captured during onboarding. That's what makes mode selection, exception prediction, and cost scoring accurate for you.",
    visual: <ImageSlot src="/generated/plus-iso-intelligence.png" label="Custom AI on your data" />,
  },
  {
    eyebrow: "What the system decides",
    title: "Autopilot is earned, not assumed.",
    body: "Every automated decision class starts in 'recommend' mode — the system suggests, your team approves. When the hit rate is proven, it graduates to autonomous, with full audit trails. You always see why a decision was made, and you can pull any workflow back to manual.",
    visual: <ImageSlot src="/generated/plus-iso-autopilot.png" label="Recommend → autonomous" />,
  },
];

export default async function TechnologyPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="Technology"
          heading={<>The intelligence layer <span className="italic">under your logistics.</span></>}
          lead="Orchestration across your existing systems, AI built on your operation's context, and infrastructure your IT team can sign off on."
          primaryCta={{ label: "Book a call", href: "/plus/book-a-call" }}
          visual={<ImageSlot src="/generated/plus-iso-techlayer.png" label="Technology hero image" />}
        />

        <FeatureRows rows={ROWS} tone="surface" />

        <TextSection
          eyebrow="Security & reliability"
          heading={<>Your data trains your system — <span className="italic">never anyone else&rsquo;s.</span></>}
        >
          We walk through our security and data-handling practices in detail on a call — encryption, access controls,
          uptime, and the compliance posture your IT team needs to sign off. The short version: your data builds your
          system, and it stays yours.
        </TextSection>

        <CardGrid
          tone="surface"
          eyebrow="Built for IT sign-off"
          heading="The questions your team will ask."
          cards={[
            { title: "Data ownership", body: "You own your data. It builds your system and never trains anyone else's." },
            { title: "Audit trails", body: "Every automated decision is logged with its reasoning. Pull any workflow back to manual, any time." },
            { title: "Access controls", body: "Role-based access, encryption in transit and at rest, and a documented data-handling posture." },
          ]}
        />

        <CtaBand heading="Bring your stack. We'll map the integration." body="A 30-minute call to walk through what connects and how." />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
