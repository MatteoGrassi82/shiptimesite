import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/plus-blocks";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C11 — FAQ. Coded page.

export const metadata: Metadata = {
  title: "FAQ — ShipTime Plus",
  description: "The questions buyers actually ask, answered straight.",
};

export default async function FaqPage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="FAQ"
          heading={<>The questions buyers <span className="italic">actually ask.</span></>}
          lead="Straight answers, no hedging."
          primaryCta={{ label: "Ask us the ones we missed", href: "/plus/book-a-call" }}
        />

        <Faq
          _type="faqSection"
          _key="faq"
          items={[
            { _key: "q1", question: "How long until we see results?", answer: "Phase 1 (unification) typically shows the first findings in weeks: visibility alone surfaces money. Quantified savings targets are in your proposal with dates attached." },
            { _key: "q2", question: "What if we already have good rates?", answer: "Then we plug them in (BYOR) and make money elsewhere: mode optimization, exceptions, consolidation, spot-market leverage. Some of our best results are with accounts whose rates we never touched." },
            { _key: "q3", question: "Are we locked in?", answer: "Annual terms, and the integrations are yours. What keeps customers isn't a contract — it's that the system runs their logistics better than the alternative. That's the deal we want." },
            { _key: "q4", question: "We're mid-migration / replatforming — bad timing?", answer: "Usually the opposite. Unification during a migration means the new stack lands already orchestrated." },
            { _key: "q5", question: "How big do we need to be?", answer: "There's no volume gate. The test is complexity: multiple modes, locations, or systems that don't talk. If a quote button solves your problem, use Core — honestly." },
            { _key: "q6", question: "Who owns our data?", answer: "You do. Your data builds your system; it never trains anyone else's." },
            { _key: "q7", question: "What does it cost?", answer: "See How We Work — designed proposals, quantified savings, no surprises at signature." },
          ]}
        />

        <CtaBand heading={<>Ask us the ones <span className="italic">we missed.</span></>} body="A 30-minute call, no pitch deck — just answers about your operation." />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
