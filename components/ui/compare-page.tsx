"use client";

import type React from "react";
import Link from "next/link";
import SiteNav from "@/components/ui/site-nav";
import LandingHero from "@/components/ui/landing-hero";
import DashboardSection from "@/components/ui/feature-showcase";
import ShipTimeTimeline from "@/components/ui/shiptime-timeline";
import ShipTimeTestimonials from "@/components/ui/shiptime-testimonials";
import ShipTimeSceneDivider from "@/components/ui/shiptime-scene-divider";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";
import { FeatureDeepDives, LandingFaq, LandingFooter } from "@/components/ui/landing-sections";
import { MultiCompareTable, type MultiCompareRow, type MultiCompareCompetitor } from "@/components/ui/multi-compare-table";
import { competitors, type FaqItem } from "@/lib/competitors";

const ds = {
  navy: "#1C1E3D",
  muted: "#52566C",
  orange: "#EC5A26",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};
const body: React.CSSProperties = { fontFamily: "var(--font-inter), system-ui, sans-serif", color: ds.muted, lineHeight: 1.6 };
const sora = { fontFamily: "var(--font-manrope), sans-serif" };

// Curated cross-section of lib/competitors.ts — every cell here has a matching
// claim on that competitor's own /vs/[slug] page, so nothing is asserted for
// the first time in this table.
const COMPETITOR_COLS: MultiCompareCompetitor[] = [
  { key: "freightcom", name: "Freightcom", price: "Free", logo: "/logos/freightcom.png" },
  { key: "eshipper", name: "eShipper", price: "Free" },
  { key: "shipstation", name: "ShipStation", price: "$14.99–$7,499/mo" },
];

const ROWS: MultiCompareRow[] = [
  { feature: "Monthly platform fee", shiptime: "$0", shiptimeWin: true, freightcom: "$0", eshipper: "$0", shipstation: "$14.99–$7,499/mo" },
  { feature: "Discounted carrier rates of their own", shiptime: "Yes", freightcom: "Yes", eshipper: "Yes", shipstation: "No" },
  { feature: "Bring your own rates, compared on every label", shiptime: "Parcel & LTL", shiptimeWin: true, freightcom: "No", eshipper: "No", shipstation: "Own accounts only" },
  { feature: "Courier + LTL freight in one platform", shiptime: "Yes", freightcom: "Yes", eshipper: "Yes", shipstation: "Parcel only" },
  { feature: "Invoice audit & carrier dispute support", shiptime: "Set up with us", shiptimeWin: true, freightcom: "No", eshipper: "No", shipstation: "No" },
  { feature: "Support you can actually reach", shiptime: "~26s avg", shiptimeWin: true, freightcom: "Limited", eshipper: "Limited", shipstation: "Ticket queue" },
];

const COMPARE_FAQ: FaqItem[] = [
  {
    q: "Is ShipTime really free?",
    a: "Yes — no platform fee, no contract. You pay for the labels you print, nothing else. Of the three platforms on this page, only ShipStation charges a subscription: $14.99 to $7,499 a month.",
  },
  {
    q: "Can I bring my own carrier rates?",
    a: "Yes. Drop in the pricing you've already negotiated and ShipTime compares it against our discounted rates on every shipment, parcel and LTL both. Freightcom and eShipper don't support this; ShipStation connects your own accounts but has no discounted rates of its own to compare them against.",
  },
  {
    q: "Do you handle freight and LTL?",
    a: "Yes — parcel and LTL live in one dashboard, and you can bring your own LTL rates too. ShipStation is parcel only.",
  },
  {
    q: "Can I get Canada Post rates, with pickups?",
    a: "Yes. Canada Post is built in, with pickups. Freightcom and ShipStation include Canada Post too; eShipper's Canada Post service only runs out of their warehouse, and pickups aren't supported.",
  },
  {
    q: "How fast do you actually answer support calls?",
    a: "So far this year our Canadian team has taken more than 10,000 support calls, with an average time to answer of 26 seconds — and fewer than 1% of callers needed a callback. Support at Freightcom and eShipper is more limited, and ShipStation routes you to a ticket queue.",
  },
  {
    q: "Do you check carrier invoices for errors?",
    a: "We do — on the carrier invoices for the rates you bring to ShipTime. Set it up with us once, and we'll check those bills for overcharges, help you recover them, and take carrier disputes on ourselves. None of the other three offer this.",
  },
  {
    q: "Does ShipTime integrate with my store?",
    a: "Yes — Shopify, WooCommerce, BigCommerce, Magento, and more. Connect your store in minutes; there's nothing to migrate.",
  },
];

export default function ComparePage({ images }: { images: Record<string, string | null> }) {
  const featureCompetitor = competitors[0]; // ALT_FEATURES is shared across every entry

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>
      <SiteNav leadCapture minimal ctaLabel="Get in touch" />

      {/* ── HERO ── */}
      <LandingHero
        photo={images["hero"]}
        eyebrow="ShipTime vs Freightcom · eShipper · ShipStation"
        headline={
          <>
            Comparing shipping platforms? <em style={{ fontStyle: "italic", fontWeight: 300, color: "#8B90A8" }}>See them side by side.</em>
          </>
        }
        subhead="Freightcom, eShipper, ShipStation, or ShipTime: the real differences are the platform fee, whose rates you can use, courier and LTL coverage, and who answers when something goes wrong. Here are all four, side by side."
        ctaSource="compare-hero"
        chipTop="Best rate found"
        chipBottom="No platform fee"
      />

      {/* ── ANSWER-FIRST INTRO ── */}
      <section className="px-5 md:px-10 pt-4 pb-14 md:pb-20" style={{ background: ds.white }}>
        <div className="text-center" style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ ...body, fontSize: 20, color: ds.navy, lineHeight: 1.7, letterSpacing: "-0.01em" }}>
            Freightcom, eShipper, and ShipStation each do part of this well. ShipTime is built to lower your true cost of shipping across all of it.
          </p>
          <p className="mt-5" style={{ ...body, fontSize: 16, lineHeight: 1.75 }}>
            No platform fee at any volume, your own negotiated carrier rates compared on every quote, courier and LTL together in one dashboard, and a Canadian team that answers in 26 seconds on average — not a ticket queue.
          </p>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.surface }} id="compare-table">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <h2 className="mb-3" style={{ ...heading, fontSize: "clamp(1.5rem, 3.6vw, 2.2rem)" }}>Four platforms. One table.</h2>
            <p className="mx-auto" style={{ ...body, fontSize: 15, maxWidth: 460 }}>
              Bring the carrier deals you&rsquo;ve already earned — and keep them. No platform fee, ever.
            </p>
          </div>
          <MultiCompareTable rows={ROWS} competitors={COMPETITOR_COLS} ctaSource="compare-table" />
          <p className="text-center mt-6" style={{ ...body, fontSize: 13 }}>
            Want the detail behind any cell? Each platform has its own full side-by-side below.
          </p>
        </div>
      </section>

      {/* ── VERDICT + DEEP DIVES ── */}
      <section className="px-5 md:px-10 py-16 md:py-24" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: ds.orange, ...sora }}>Which platform is right for you?</p>
            <h2 style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}>Pick ShipTime if this sounds like you.</h2>
          </div>
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
            <div className="p-8 md:p-9 flex flex-col" style={{ background: ds.navy, borderRadius: 20 }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#B6E04A", ...sora }}>Pick ShipTime if</p>
              <h3 className="mb-3" style={{ ...heading, color: ds.white, fontSize: "1.4rem" }}>
                You ship in Canada or cross-border and want the savings to stay yours.
              </h3>
              <p style={{ ...body, color: "rgba(255,255,255,0.78)", fontSize: 15 }}>
                You want Canada Post and Canadian carriers native, need parcel and freight in one place, would rather skip a monthly fee, or have your own negotiated rates to bring. And when something goes wrong, you want a real person on the phone — not a ticket queue.
              </p>
              <div className="mt-6">
                <LeadCaptureButton source="compare-verdict" className="inline-flex items-center gap-2 self-start text-white text-sm font-semibold px-6 py-3 transition-opacity hover:opacity-90" style={{ background: ds.orange, borderRadius: 999, ...sora }}>
                  Get in touch
                </LeadCaptureButton>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {competitors.map((c) => (
                <Link
                  key={c.slug}
                  href={`/vs/${c.slug}`}
                  className="group flex flex-col p-6 lift"
                  style={{ background: ds.white, borderRadius: 16, border: `1px solid ${ds.border}`, boxShadow: "0 4px 18px rgba(28,30,61,0.05)" }}
                >
                  <h4 className="mb-2 flex items-center justify-between gap-3" style={{ ...sora, fontWeight: 800, fontSize: 15.5, color: ds.navy }}>
                    ShipTime vs {c.name}
                    <span aria-hidden style={{ color: ds.orange, fontSize: 17, flexShrink: 0 }}>→</span>
                  </h4>
                  <p style={{ ...body, fontSize: 13.5 }}>{c.vs.subhead}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE DEEP-DIVES (shared across every competitor page) ── */}
      <FeatureDeepDives
        features={featureCompetitor.alternative.features}
        title="Why teams choose ShipTime over the rest"
        subtitle="The parts that save you money and headaches, in one platform."
      />

      {/* ── LIVE FEATURE SHOWCASE ── */}
      <DashboardSection />

      {/* ── ONBOARDING TIMELINE ── */}
      <ShipTimeTimeline background={ds.surface} />

      {/* ── TESTIMONIALS ── */}
      <ShipTimeTestimonials />

      {/* ── FAQ ── */}
      <LandingFaq faq={COMPARE_FAQ} title="Common questions" subtitle="Answers that hold across Freightcom, eShipper, and ShipStation" />

      {/* ── SCENE DIVIDER ── */}
      <ShipTimeSceneDivider />

      {/* ── FOOTER ── */}
      <LandingFooter />
    </div>
  );
}
