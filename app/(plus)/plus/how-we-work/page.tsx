import type { Metadata } from "next";
import { FileSearch, Users, BadgeCheck } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { CardGrid, CtaBand, EngagementSteps, TextSection } from "@/components/sections/plus-blocks";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C8 — How we work. Coded page in the Hana design language.

export const metadata: Metadata = {
  title: "How We Work — ShipTime Plus",
  description: "No demo, no pricing page. Exactly how a Plus engagement runs, from a free discovery call to a designed, quantified proposal.",
};

const STEPS = [
  { label: "Discovery (30 min, free)", body: "We ask what you ship, where, with whom, and what hurts. You'll know by the end of the call whether this is worth pursuing — and so will we. We say no to operations we can't clearly improve." },
  { label: "Operational deep-dive (1–2 weeks)", body: "With your permission, we look at real data: lanes, volumes, spend, systems, exceptions. We talk to the people who actually run your shipping." },
  { label: "The designed proposal", body: "A document, not a quote: your business profile modeled, a transparent rate card, lane-by-lane cost analysis against your current state, a phased plan — and the savings, quantified against your own numbers. If we can't show a return, we tell you." },
  { label: "Build & embed (phased)", body: "Integrations first, intelligence second, automation third. Your Logistics Success Manager is inside your operation from day one." },
  { label: "Operate & expand", body: "Quarterly design reviews. Autopilot grows workflow by workflow. Results measured against the proposal, in writing." },
];

export default async function HowWeWorkPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="How we work"
          heading={<>No demo. No pricing page. <span className="italic">Here&rsquo;s why.</span></>}
          lead="Plus isn't a product you evaluate from screenshots. It's a system we design around your operation — so the process looks different."
          primaryCta={{ label: "Book the discovery call", href: "/plus/book-a-call" }}
        />

        <EngagementSteps
          eyebrow="The engagement"
          heading={<>Step by <span className="italic">step.</span></>}
          steps={STEPS}
        />

        <TextSection
          eyebrow="Pricing"
          heading={<>Why there&rsquo;s no <span className="italic">pricing page.</span></>}
          callout={
            <>
              What we commit to instead: the proposal is concrete, the savings are{" "}
              <span className="font-semibold">quantified before you sign</span>,{" "}
              <span className="text-slate-600">and annual terms mean we have to keep earning it.</span>
            </>
          }
        >
          Because the honest answer is &ldquo;it depends on what we&rsquo;re building.&rdquo; A designed system for a
          3-warehouse DTC brand and one for a freight-heavy industrial shipper aren&rsquo;t the same engagement — and
          pretending they fit a three-column pricing table would mean padding one and starving the other.
        </TextSection>

        <CardGrid
          tone="surface"
          eyebrow="What we ask of you"
          heading={<>Three things. <span className="italic">That&rsquo;s it.</span></>}
          cards={[
            { title: "Access to your data", body: "The shipping data we need to model your operation honestly — lanes, volumes, spend, exceptions.", icon: <FileSearch className="size-5 text-primary" /> },
            { title: "Time with your team", body: "The people who actually run shipping. The logic that matters isn't written down anywhere else.", icon: <Users className="size-5 text-primary" /> },
            { title: "A decision-maker at the proposal", body: "Someone in the room who can say yes. If we're not a fit, you leave with a free diagnostic of your operation.", icon: <BadgeCheck className="size-5 text-primary" /> },
          ]}
        />

        <TextSection
          eyebrow="Who you'll work with"
          heading={<>One named person, accountable <span className="italic">end to end.</span></>}
        >
          Your Logistics Success Manager. Behind them: integration engineers, the intelligence team, and
          carrier/brokerage operations. Not a rotating cast, not a ticket queue.
        </TextSection>

        <CtaBand
          heading={<>Book the <span className="italic">discovery call.</span></>}
          body="30 minutes. You'll know by the end whether a designed system makes sense for you."
        />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
