import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "@/components/sections/site-chrome";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { Faq } from "@/components/sections/Faq";
import { CardGrid, CtaBand } from "@/components/sections/plus-blocks";
import { PageHero } from "@/components/sections/plus-page-hero";
import type { SiteSettings } from "@/components/sections/types";

// C10 — Compare (Plus vs 3PL vs TMS vs broker). Coded page.

export const metadata: Metadata = {
  title: "Plus vs 3PL vs TMS vs Broker — ShipTime Plus",
  description: "Four ways to handle logistics complexity. An honest map of which one you actually need.",
};

export default async function ComparePage() {
  const settings = await sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: "plus" }, tags: ["siteSettings"] });

  return (
    <>
      <ZoneNav zone="plus" settings={settings} />
      <main>
        <PageHero
          eyebrow="Compare"
          heading={<>Plus vs a 3PL vs a TMS <span className="italic">vs a broker.</span></>}
          lead="Four ways to handle logistics complexity. An honest map of which one you actually need."
          primaryCta={{ label: "Take the assessment", href: "/plus/assessment" }}
          secondaryCta={{ label: "Book a call", href: "/plus/book-a-call", style: "ghost" }}
        />

        <ComparisonTable
          _type="comparisonTable"
          _key="compare"
          heading="The comparison"
          approaches={["ShipTime Plus", "A 3PL", "A TMS", "A Freight Broker"]}
          rows={[
            { _key: "r1", aspect: "What it is", values: ["A designed logistics operating system with an embedded team.", "Outsourced warehousing and fulfillment operations.", "Software for managing transportation — you run it.", "A transactional freight-booking relationship."] },
            { _key: "r2", aspect: "Great when", values: ["You have real complexity: multiple modes, locations, or systems that don't talk.", "You need warehousing without building it yourself.", "You have the team to implement, tune, and maintain it.", "You need occasional freight capacity, transaction by transaction."] },
            { _key: "r3", aspect: "Watch out for", values: ["It's a designed engagement, not a self-serve tool — no pricing page.", "The spread between their invoice and the market rate.", "Most TMS projects stall in implementation — the logic is on you.", "No visibility into your data, parcel spend, or exceptions."] },
            { _key: "r4", aspect: "Your rates or theirs", values: ["Either — bring your own (BYOR) or use ours.", "Usually theirs.", "Yours — you bring the carrier relationships.", "Theirs, negotiated shipment by shipment."] },
          ]}
        />

        <CardGrid
          tone="surface"
          eyebrow="The honest paragraphs"
          heading={<>When each one is the <span className="italic">right answer.</span></>}
          cards={[
            { title: "“Just get a 3PL”", body: "Right for plenty of businesses — we work alongside 3PLs every day. But if you're big enough to care about the spread between their invoice and the market, you're big enough for a designed system." },
            { title: "“Just buy a TMS”", body: "A TMS is a powerful empty box. The implementation, the logic, the tuning — that's on your team, and it's where most TMS projects stall. Plus ships with the team included." },
            { title: "“Just use our broker”", body: "Brokers are great at freight transactions. They're not building your data layer, watching your parcel spend, or automating your exceptions. We include brokerage inside the system." },
          ]}
        />

        <Faq
          _type="faqSection"
          _key="compare-faq"
          heading="Common questions"
          items={[
            { _key: "q1", question: "Can Plus work with my existing 3PL?", answer: "Yes — we orchestrate alongside 3PLs every day; some of our fulfillment partners are 3PLs themselves." },
            { _key: "q2", question: "Does Plus replace my TMS?", answer: "It can, or it can sit alongside one — the point is the system and the embedded team that implements and tunes it, not just software." },
            { _key: "q3", question: "What if I already have a broker I like?", answer: "Freight brokerage is included inside the platform, so you can use it for overflow or as your primary lane — your call." },
          ]}
        />

        <CtaBand heading={<>Not sure <span className="italic">which you are?</span></>} body="Take the 3-minute assessment — a maturity score and your three highest-pressure fixes, free." primary={{ label: "Take the assessment", href: "/plus/assessment" }} />
      </main>
      <ZoneFooter zone="plus" settings={settings} />
    </>
  );
}
