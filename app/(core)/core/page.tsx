import type React from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/ui/site-nav";
import CoreHero from "@/components/ui/core-hero";
import CorePlatformTrio from "@/components/ui/core-platform-trio";
import StatsChevrons from "@/components/ui/stats-chevrons";
import CoreFeaturesSticky from "@/components/ui/core-features-sticky";
import CoreWhyChoose from "@/components/ui/core-why-choose";
import ShipTimeTestimonials from "@/components/ui/shiptime-testimonials";
import ShipTimeFAQ from "@/components/ui/shiptime-faq";
import ShipTimeSceneDivider from "@/components/ui/shiptime-scene-divider";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";

// ── ShipTime Core homepage ─────────────────────────────────────────────────────
// Core 2's section lineup (hero → platform trio → feature toolkit → why choose
// → testimonials → objection handling → close) rebuilt with the /alternative
// and /vs landing-page sections and styling: split photo hero with floating
// chips, white bordered cards, chevron stats band, photo + chip feature blocks,
// comparison table, navy getting-started, orange CTA strip, rich footer.

const ds = {
  navy:       "#1C1E3D",
  muted:      "#6E728A",
  orange:     "#EC5A26",
  surface:    "#F8FAFB",
  border:     "#E8E8E8",
  white:      "#FFFFFF",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

const body: React.CSSProperties = {
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  color: ds.muted,
  lineHeight: 1.6,
};

const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

const utm = (campaign: string, content: string) =>
  `?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=${campaign}&utm_content=${content}`;

const SHIPTIME = "https://docs.google.com/forms/d/e/1FAIpQLSeLZv90COHXyXqlijLX6Gls5SMAquTHc8POd8JO3ajmxSdiVA/viewform?usp=send_form";
const SIGNUP = "https://app.shiptime.com/";

const reportUrl = (content: string) => `${SHIPTIME}${utm("logistics-report", content)}`;
const signupUrl = (content: string) => `${SIGNUP}${utm("signup", content)}`;

// ── Orange-bordered CTA strip (from the /alternative pages) ──────────────────
function FreeStrip() {
  return (
    <section className="px-5 md:px-10 py-12" style={{ background: ds.white }}>
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-5 px-7 py-7"
        style={{ maxWidth: 880, margin: "0 auto", border: `1.5px solid ${ds.orange}`, borderRadius: 18, background: ds.white }}
      >
        <p style={{ ...heading, fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>Ship smarter, starting free.</p>
        <a
          href={signupUrl("free-strip")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-sm font-semibold px-7 py-3 transition-colors hover:opacity-90 whitespace-nowrap"
          style={{ background: ds.orange, borderRadius: 999, ...sora }}
        >
          Sign me up
        </a>
      </div>
    </section>
  );
}

// ── Navy "ready when you are" getting-started section (from /alternative) ────
function GettingStarted() {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.navy }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: ds.orange, ...sora }}>
              Getting started
            </p>
            <h2 className="mb-5" style={{ ...heading, color: ds.white, fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
              Ready when you are
            </h2>
            <p style={{ ...body, color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8 }}>
              No migration project, no sales call, no contract. Most businesses print
              their first discounted label the same afternoon they sign up.
            </p>
            {/* step list */}
            <div className="mt-8 flex flex-col gap-3">
              {[
                "Register your free account in under a minute",
                "Connect your store, or bring your own carrier rates",
                "Compare live rates and print your first label",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: ds.orange, color: ds.white, ...sora }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ ...inter, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          {/* CTA card */}
          <div
            className="flex flex-col items-center text-center gap-5 px-8 py-10"
            style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", minWidth: 240 }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: ds.orange }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M13 3v14M7 11l6 6 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20h18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg mb-1" style={{ color: ds.white, ...sora }}>Free forever</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)", ...inter }}>No platform fee. No contract.</p>
            </div>
            <LeadCaptureButton
              source="getting-started"
              className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 transition-all hover:opacity-90"
              style={{ background: ds.orange, borderRadius: 999, fontSize: 14, boxShadow: "0 4px 20px rgba(236,90,38,0.4)", ...sora }}
            >
              Get in touch
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LeadCaptureButton>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)", ...inter }}>No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Rich multi-column footer (shared shape with the /alternative pages) ──────
function SiteFooter() {
  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Platform",
      links: [
        { label: "Rate shopping", href: signupUrl("footer") },
        { label: "Courier & LTL", href: signupUrl("footer") },
        { label: "Bring your own rates", href: signupUrl("footer") },
        { label: "Tracking & analytics", href: signupUrl("footer") },
      ],
    },
    {
      title: "Compare",
      links: [
        { label: "All comparisons", href: "/vs" },
        { label: "All alternatives", href: "/alternative" },
        { label: "ShipStation alternative", href: "/alternative/shipstation" },
        { label: "Freightcom alternative", href: "/alternative/freightcom" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Home", href: "/" },
        { label: "ShipTime Plus", href: "/plus" },
        { label: "Sign up free", href: signupUrl("footer") },
      ],
    },
  ];

  return (
    <footer className="px-5 md:px-10 pt-16 pb-10" style={{ background: ds.navy, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image src="/shiptime-logo.svg" alt="ShipTime" width={150} height={46} className="h-9 w-auto opacity-90 mb-4" />
            <p style={{ ...body, color: "rgba(255,255,255,0.55)", fontSize: 14, maxWidth: 260 }}>
              Your logistics, fully optimized. One platform for parcel, freight, and everything in between.
            </p>
            <div className="mt-5 flex flex-col gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)", ...inter }}>
              <p>700 Dorval Dr., Suite 700</p>
              <p>Oakville, ON L6K 3V3 Canada</p>
              <a href="tel:18777845744" className="transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>1-877-784-5744</a>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)", ...sora }}>
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("/") ? (
                      <Link href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)", ...inter }}>
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)", ...inter }}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ ...body, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>© 2026 ShipTime Inc. Ship Smarter Today.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>

      {/* ── NAV ── */}
      <SiteNav ctaHref={reportUrl("nav")} ctaLabel="Free Report" />

      {/* ── HERO (alternative-page style: photo + floating chips) ── */}
      <CoreHero />

      {/* ── TRUST STRIP ── */}
      <section className="px-5 md:px-10 py-10" style={{ background: ds.white, borderTop: `1px solid ${ds.border}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: ds.muted, ...sora }}>
            Trusted by thousands of businesses across Canada and the US
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {["Canada Post", "UPS", "FedEx", "Purolator", "DHL", "Canpar", "GLS", "Loomis"].map(name => (
              <span key={name} className="text-sm font-bold" style={{ color: "#C8CDD8", letterSpacing: "0.02em", ...sora }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM TRIO (For me / For my business / Enterprise, landing skin) ── */}
      <CorePlatformTrio signupHref={signupUrl("trio")} />

      {/* ── STATS CHEVRONS (from /vs landings) ── */}
      <StatsChevrons />

      {/* ── FEATURE TOOLKIT (pinned sticky-card scroll tour, skiper17-style) ── */}
      <CoreFeaturesSticky background={ds.white} />

      {/* ── WHY CHOOSE SHIPTIME (landing comparison table) ── */}
      <CoreWhyChoose background={ds.surface} />

      {/* ── TESTIMONIALS ── */}
      <ShipTimeTestimonials />

      {/* ── GETTING STARTED (navy, from /alternative switching guide) ── */}
      <GettingStarted />

      {/* ── FREE CTA STRIP (from /alternative) ── */}
      <FreeStrip />

      {/* ── FAQ ── */}
      <ShipTimeFAQ background={ds.surface} />

      {/* ── SCENE DIVIDER (stats + illustration) ── */}
      <ShipTimeSceneDivider />

      {/* ── FOOTER ── */}
      <SiteFooter />
    </div>
  );
}
