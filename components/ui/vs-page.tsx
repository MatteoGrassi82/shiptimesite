"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/ui/site-nav";
import LandingHero from "@/components/ui/landing-hero";
import DashboardSection from "@/components/ui/feature-showcase";
import ShipTimeTimeline from "@/components/ui/shiptime-timeline";
import ShipTimeTestimonials from "@/components/ui/shiptime-testimonials";
import ShipTimeSceneDivider from "@/components/ui/shiptime-scene-divider";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";
import { CompareTable, WhyTeamsSwitch, FeatureDeepDives, LandingFaq } from "@/components/ui/landing-sections";
import type { Competitor } from "@/lib/competitors";

const ds = {
  navy: "#1C1E3D",
  navyDeep: "#16182F",
  muted: "#52566C",
  orange: "#EC5A26",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};
const body: React.CSSProperties = { fontFamily: "var(--font-inter), system-ui, sans-serif", lineHeight: 1.6 };
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

// ── Flow of unlocks (interlocking chevrons) + social proof ────────────────────
// A causal "flow": one move (switching) sets off a chain — costs drop, margins
// grow, you reinvest. The right-pointing chevrons read as a sequence.
const FLOW_STEPS = [
  { stage: "You switch", big: "15 min", label: "Connect a store and start shipping — nothing to migrate", bg: "#E3EEFC", fg: ds.navy },
  { stage: "Costs drop", big: "70% off", label: "walk-in carrier rates, from your very first label", bg: "#B6E04A", fg: ds.navy },
  { stage: "Margins grow", big: "$0 fees", label: "no platform fee, so every dollar you save stays yours", bg: ds.navyDeep, fg: ds.white },
  { stage: "You scale", big: "Grow", label: "reinvest the savings and ship more for less", bg: "#A9A2F2", fg: ds.navy },
];

function chevronClip(first: boolean) {
  const notch = 28;
  const left = first ? "0" : `${notch}px`;
  return `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%, ${left} 50%)`;
}

function FlowBand({ quote }: { quote: Competitor["alternative"]["quote"] }) {
  return (
    <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.navy }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <h2 className="mb-2" style={{ ...heading, color: ds.white, fontSize: "clamp(1.5rem, 3.6vw, 2.2rem)", maxWidth: 720 }}>
          What switching to ShipTime sets in motion
        </h2>
        <p className="mb-10" style={{ ...body, color: "rgba(255,255,255,0.72)", fontSize: 16, maxWidth: 560 }}>
          One move, and the rest follows — the flow our customers see after they come over.
        </p>

        {/* Desktop: interlocking chevrons */}
        <div className="hidden md:flex" style={{ marginLeft: -10 }}>
          {FLOW_STEPS.map((s, i) => (
            <div
              key={s.stage}
              className="flex flex-col justify-center"
              style={{
                background: s.bg,
                color: s.fg,
                flex: 1,
                minHeight: 172,
                padding: "0 28px 0 52px",
                marginLeft: i === 0 ? 0 : -24,
                clipPath: chevronClip(i === 0),
                zIndex: FLOW_STEPS.length - i,
              }}
            >
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ ...sora, color: s.fg, opacity: 0.65 }}>{s.stage}</div>
              <div style={{ ...heading, fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", color: s.fg }}>{s.big}</div>
              <div className="mt-1" style={{ ...inter, fontSize: 13, color: s.fg, maxWidth: 155, lineHeight: 1.35, opacity: 0.9 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile: stacked color blocks */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {FLOW_STEPS.map((s) => (
            <div key={s.stage} className="flex flex-col justify-center" style={{ background: s.bg, color: s.fg, borderRadius: 14, padding: "18px 16px", minHeight: 124 }}>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ ...sora, color: s.fg, opacity: 0.65 }}>{s.stage}</div>
              <div style={{ ...heading, fontSize: "1.7rem", color: s.fg }}>{s.big}</div>
              <div className="mt-1" style={{ ...inter, fontSize: 12, color: s.fg, lineHeight: 1.35, opacity: 0.9 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Social proof: a real customer's words, tying the flow to a result */}
        <figure className="mt-12 flex flex-col md:flex-row md:items-center gap-6 px-7 py-7" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20 }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill={ds.orange} aria-hidden className="flex-shrink-0" style={{ opacity: 0.9 }}>
            <path d="M10 7L7 12h3v5H4v-5l3-5h3zm10 0l-3 5h3v5h-6v-5l3-5h3z" />
          </svg>
          <div>
            <blockquote style={{ ...body, color: ds.white, fontSize: 18, lineHeight: 1.6, letterSpacing: "-0.01em" }}>
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm" style={{ ...inter, color: "rgba(255,255,255,0.65)" }}>
              <span className="font-semibold" style={{ color: ds.white }}>{quote.name}</span> · {quote.role}
              {quote.context ? ` · ${quote.context}` : ""}
            </figcaption>
          </div>
        </figure>

        <div className="mt-8">
          <LeadCaptureButton
            source="flow-band"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 transition-colors hover:opacity-90"
            style={{ background: ds.orange, borderRadius: 10, ...sora }}
          >
            See what switching looks like <span aria-hidden>→</span>
          </LeadCaptureButton>
        </div>
      </div>
    </section>
  );
}

export default function VsPage({ data, images }: { data: Competitor; images: Record<string, string | null> }) {
  const vs = data.vs;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body, color: ds.navy }}>
      <SiteNav leadCapture ctaLabel="Get in touch" />

      {/* ── HERO ── */}
      <LandingHero
        photo={images["hero"]}
        eyebrow={`ShipTime vs ${data.name}`}
        headline={
          <>
            Choose ShipTime over{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300, color: "#8B90A8" }}>{data.name}</em>.
          </>
        }
        subhead={vs.subhead || data.subhead}
        ctaSource="hero"
        chipTop="Best rate found"
        chipBottom="No platform fee"
      />

      {/* ── CENTERED INTRO STATEMENT ── */}
      {vs.answerFirst && (
        <section className="px-5 md:px-10 pt-4 pb-14 md:pb-20" style={{ background: ds.white }}>
          <div className="text-center" style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ ...body, fontSize: 20, color: ds.navy, lineHeight: 1.7, letterSpacing: "-0.01em" }}>
              {vs.answerFirst}
            </p>
            {vs.answerFirstMore && (
              <p className="mt-5" style={{ ...body, fontSize: 16, color: ds.muted, lineHeight: 1.75 }}>
                {vs.answerFirstMore}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── COMPARISON TABLE ── */}
      <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.surface }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <h2 className="mb-3" style={{ ...heading, color: ds.navy, fontSize: "clamp(1.5rem, 3.6vw, 2.2rem)" }}>
              {data.name} vs ShipTime
            </h2>
            <p className="mx-auto" style={{ ...body, color: ds.muted, fontSize: 15, maxWidth: 440 }}>
              {vs.savings} No platform fee, ever.
            </p>
          </div>
          <CompareTable rows={data.rows} competitorName={data.name} competitorPrice={vs.competitorPricing} competitorLogo={data.logo} />
        </div>
      </section>

      {/* ── WHY TEAMS SWITCH (before → after) ── */}
      {data.alternative.whyTeamsSwitch && (
        <WhyTeamsSwitch data={data.alternative.whyTeamsSwitch} eyebrow="Why teams prefer ShipTime" title={`What changes when you leave ${data.name}`} />
      )}

      {/* ── FEATURE DEEP-DIVES ── */}
      <FeatureDeepDives
        features={data.alternative.features}
        title={`Why teams choose ShipTime over ${data.name}`}
        subtitle="The parts that save you money and headaches, in one platform."
      />

      {/* ── FLOW OF UNLOCKS + SOCIAL PROOF ── */}
      <FlowBand quote={data.alternative.quote} />

      {/* ── LIVE FEATURE SHOWCASE ── */}
      <DashboardSection />

      {/* ── ONBOARDING TIMELINE ── */}
      <ShipTimeTimeline background={ds.white} />

      {/* ── TESTIMONIALS ── */}
      <ShipTimeTestimonials />

      {/* ── WHO SHOULD CHOOSE ── */}
      {vs.whoShouldChoose && (
        <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.surface }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 className="text-center mb-10" style={{ ...heading, color: ds.navy, fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}>
              Which platform is right for you?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* ShipTime — spotlighted with an orange border, no pale fill */}
              <div className="p-8" style={{ borderRadius: 20, background: ds.white, border: `2px solid ${ds.orange}`, boxShadow: "0 10px 30px rgba(236,90,38,0.12)" }}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>ShipTime</p>
                <h3 className="mb-4" style={{ ...heading, color: ds.navy, fontSize: "1.25rem" }}>{vs.whoShouldChoose.shiptime.title}</h3>
                <p style={{ ...body, fontSize: 15, color: ds.navy }}>{vs.whoShouldChoose.shiptime.body}</p>
                <div className="mt-6">
                  <LeadCaptureButton
                    source="who-should-choose"
                    className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 transition-all hover:opacity-90"
                    style={{ background: ds.orange, borderRadius: 999, ...sora }}
                  >
                    Get in touch
                  </LeadCaptureButton>
                </div>
              </div>
              <div className="p-8" style={{ borderRadius: 20, background: ds.white, border: `1px solid ${ds.border}` }}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.muted, ...sora }}>{data.name}</p>
                <h3 className="mb-4" style={{ ...heading, color: ds.navy, fontSize: "1.25rem" }}>{vs.whoShouldChoose.competitor.title}</h3>
                <p style={{ ...body, fontSize: 15, color: ds.muted }}>{vs.whoShouldChoose.competitor.body}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <LandingFaq faq={data.faq} title={`ShipTime vs ${data.name}: common questions`} />

      {/* ── SCENE DIVIDER ── */}
      <ShipTimeSceneDivider />

      {/* ── FOOTER ── */}
      <footer className="px-5 md:px-10 pt-16 pb-10" style={{ background: ds.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Image src="/shiptime-logo.svg" alt="ShipTime" width={150} height={46} className="h-9 w-auto opacity-90 mb-4" />
              <p style={{ ...body, color: "rgba(255,255,255,0.55)", fontSize: 14, maxWidth: 260 }}>
                Your logistics, fully optimized. One platform for parcel, freight, and everything in between.
              </p>
            </div>
            {[
              { title: "Compare", links: [["All comparisons", "/vs"], ["Freightcom", "/vs/freightcom"], ["ShipStation", "/vs/shipstation"], ["eShipper", "/vs/eshipper"]] },
              { title: "Alternatives", links: [["All alternatives", "/alternative"], ["ShipStation alternative", "/alternative/shipstation"], ["Freightcom alternative", "/alternative/freightcom"]] },
              { title: "Company", links: [["Home", "/"], ["Get in touch", "lead:footer"]] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)", ...sora }}>{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith("lead:") ? (
                        <LeadCaptureButton source={href.slice(5)} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)", ...inter }}>{label}</LeadCaptureButton>
                      ) : href.startsWith("/") ? (
                        <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)", ...inter }}>{label}</Link>
                      ) : (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)", ...inter }}>{label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ ...body, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>© 2026 ShipTime. Ship Smarter Today.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
