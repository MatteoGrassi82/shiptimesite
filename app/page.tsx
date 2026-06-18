import type React from "react";
import ShipTimeWhySection from "@/components/ui/shiptime-why-section";
import ShipTimeHeroChat from "@/components/ui/shiptime-hero-chat";
import ShipTimeTestimonials from "@/components/ui/shiptime-testimonials";
import DashboardSection from "@/components/ui/feature-showcase";
import SiteNav from "@/components/ui/site-nav";
import MeetShipTimeIntro from "@/components/ui/meet-shiptime-intro";
import ShipTimeSceneDivider from "@/components/ui/shiptime-scene-divider";
import AlternatingFeatures from "@/components/ui/alternating-features";
import ShipTimeEdgeCases from "@/components/ui/shiptime-edge-cases";
import ShipTimeTimeline from "@/components/ui/shiptime-timeline";
import ShipTimeRoadmap from "@/components/ui/shiptime-roadmap";
import ComparisonMatrix from "@/components/ui/comparison-matrix";
import ShipTimeFAQ from "@/components/ui/shiptime-faq";
import { Icon } from "@/components/ui/icons";

const ds = {
  navy:       "#1C1E3D",
  body:       "#1C1E3D",
  muted:      "#6E728A",
  orange:     "#EC5A26",
  orangeSoft: "#F0845B",
  lightBlue:  "#E3EEFC",
  surface:    "#F8FAFB",
  surfaceAlt: "#F8FAFB",
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

const card: React.CSSProperties = {
  background: ds.white,
  borderRadius: 16,
  padding: "28px",
  border: `1px solid ${ds.border}`,
};

const sora = { fontFamily: "var(--font-manrope), sans-serif" };

const utm = (campaign: string, content: string) =>
  `?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=${campaign}&utm_content=${content}`;

const SHIPTIME = "https://docs.google.com/forms/d/e/1FAIpQLSeLZv90COHXyXqlijLX6Gls5SMAquTHc8POd8JO3ajmxSdiVA/viewform?usp=send_form";
const MEETING  = "https://meetings-na3.hubspot.com/peter-sexton/meeting-with-peter";

const reportUrl  = (content: string) => `${SHIPTIME}${utm("logistics-report", content)}`;
const meetingUrl = (content: string) => `${MEETING}${utm("book-meeting", content)}`;

const metrics = [
  { big: "70%",    label: "Off walk-in carrier prices", sub: "Pre-negotiated volume discounts passed directly to you" },
  { big: "1,000+", label: "Five-star reviews",          sub: "Rated #1 for ease of use by Canadian SMBs" },
  { big: "Growing", label: "3PL partner network",        sub: "A growing network of partner 3PLs across Canada and the US, giving you more fulfillment flexibility with every shipment." },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>

      {/* ── NAV ── */}
      <SiteNav ctaHref={reportUrl("nav")} ctaLabel="Free Report" />

      {/* ── HERO ── */}
      <ShipTimeHeroChat />

      {/* ── DUAL CTA + ILLUSTRATED SCENE ── */}

      {/* ── TRUST STRIP ── */}
      <section className="px-5 md:px-10 py-10" style={{ background: ds.white, borderBottom: `1px solid ${ds.border}` }}>
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

      {/* ── MEET SHIPTIME (typographic statement) ── */}
      <MeetShipTimeIntro background={ds.surface} />

      {/* ── WHAT WE DO (BENTO) ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>The Platform</p>
            <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              One Platform That Grows With You
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>
              Every major carrier, parcel and freight, one login. Bring your own rates or use ours.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">

            {/* 1 — Rate Shopping: wide left, dark bg */}
            <div
              className="md:col-span-7 relative overflow-hidden flex flex-col justify-between"
              style={{ background: ds.navy, borderRadius: 24, padding: "36px", minHeight: 260 }}
            >
              {/* Decorative rings */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full pointer-events-none" style={{ border: "1.5px solid rgba(236,90,38,0.15)" }} />
              <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full pointer-events-none" style={{ border: "1.5px solid rgba(236,90,38,0.25)" }} />
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: "rgba(236,90,38,0.15)", borderRadius: 12 }}>
                  <Icon.Lightning size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1.15rem", color: ds.white }}>Multi-Carrier + BYOR</h3>
                <p style={{ ...body, fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 380 }}>
                  Every major carrier, parcel and freight, one login. Bring your own rates or use ours.
                </p>
              </div>
              {/* Mock rate comparison widget */}
              <div className="mt-6 flex flex-col gap-2">
                {[
                  { carrier: "Canada Post", price: "$8.42", best: true },
                  { carrier: "Purolator",   price: "$9.18", best: false },
                  { carrier: "UPS",         price: "$11.05", best: false },
                ].map(r => (
                  <div key={r.carrier} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: r.best ? "rgba(236,90,38,0.15)" : "rgba(255,255,255,0.05)", border: r.best ? `1px solid ${ds.orange}` : "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ ...sora, fontSize: 13, fontWeight: 600, color: r.best ? ds.orange : "rgba(255,255,255,0.55)" }}>{r.carrier}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ ...sora, fontSize: 13, fontWeight: 700, color: r.best ? ds.white : "rgba(255,255,255,0.4)" }}>{r.price}</span>
                      {r.best && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: ds.orange, color: ds.white, ...sora }}>Best</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 — Unified Platform: narrow right, peach accent */}
            <div
              className="md:col-span-5 flex flex-col justify-between relative overflow-hidden"
              style={{ background: ds.lightBlue, borderRadius: 24, padding: "36px", minHeight: 260 }}
            >
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(236,90,38,0.08)" }} />
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: "rgba(236,90,38,0.15)", borderRadius: 12 }}>
                  <Icon.Layers size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1.15rem", color: ds.navy }}>Freight & LTL</h3>
                <p style={{ ...body, fontSize: 14, color: ds.muted, maxWidth: 300 }}>
                  One invoice, total cost visibility, no surprise surcharges.
                </p>
              </div>
              {/* Module pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["Parcel", "LTL", "Tracking", "Billing", "Analytics"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 text-xs font-semibold rounded-full" style={{ background: "rgba(236,90,38,0.12)", color: ds.orange, ...sora }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* 3 — Fulfillment Optimization: narrow left, surface bg */}
            <div
              className="md:col-span-5 flex flex-col justify-between relative overflow-hidden"
              style={{ background: ds.surface, borderRadius: 24, padding: "36px", minHeight: 240 }}
            >
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: ds.lightBlue, borderRadius: 12 }}>
                  <Icon.Map size={18} style={{ stroke: ds.orange }} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 style={{ ...heading, fontSize: "1.15rem", color: ds.navy }}>Warehouse & Fulfillment</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: ds.lightBlue, color: ds.orange, ...sora }}>Coming Soon</span>
                </div>
                <p style={{ ...body, fontSize: 14, color: ds.muted }}>
                  Multi-location order routing, on the way.
                </p>
              </div>
              <div className="mt-6 flex items-end gap-3">
                <span style={{ ...heading, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: ds.orange }}>2,500+</span>
                <span className="pb-1" style={{ ...body, fontSize: 13, color: ds.muted }}>warehouse nodes<br />across North America</span>
              </div>
            </div>

            {/* 4 — Visibility & Control: wide right, white bg with chart mockup */}
            <div
              className="md:col-span-7 flex flex-col justify-between relative overflow-hidden"
              style={{ background: ds.white, borderRadius: 24, padding: "36px", minHeight: 240, border: `1px solid ${ds.border}` }}
            >
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: ds.lightBlue, borderRadius: 12 }}>
                  <Icon.Chart size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1.15rem", color: ds.navy }}>Comprehensive Support</h3>
                <p style={{ ...body, fontSize: 14, color: ds.muted, maxWidth: 340 }}>
                  Real people who know your account. Voice, email, live chat.
                </p>
              </div>
              {/* Sparkline bars */}
              <div className="mt-6 flex items-end gap-1.5 h-14">
                {[40, 55, 45, 70, 60, 80, 65, 90, 75, 95, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: i === 11 ? ds.orange : i >= 8 ? "rgba(236,90,38,0.35)" : ds.border,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between">
                <span style={{ ...sora, fontSize: 11, color: ds.muted }}>Jan</span>
                <span style={{ ...sora, fontSize: 11, color: ds.muted }}>Dec</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PERSONA TABS (tabbed Remotion players, framed by role) ── */}
      <DashboardSection />

      {/* ── EVERY ACCOUNT INCLUDES (alternating feature blocks) ── */}
      <AlternatingFeatures background={ds.white} />

      {/* ── TODAY vs WITH SHIPTIME (edge cases) ── */}
      <ShipTimeEdgeCases background={ds.surface} />

      {/* ── TESTIMONIALS ── */}
      <ShipTimeTestimonials />

      {/* ── FIRST-WEEK TIMELINE ── */}
      <ShipTimeTimeline background={ds.surface} />

      {/* ── ROADMAP (Week 1 → Year 1) ── */}
      <ShipTimeRoadmap background={ds.white} />

      {/* ── WHY SHIPTIME ── */}
      <div id="why"><ShipTimeWhySection /></div>

      {/* ── COMPARISON MATRIX (ShipTime vs named competitors) ── */}
      <div id="compare"><ComparisonMatrix background={ds.surface} /></div>

      {/* ── INTEGRATIONS ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div style={{ maxWidth: 440 }}>
              <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>Integrations</p>
              <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
                Connects to Your Store in Minutes
              </h2>
              <p className="mb-6" style={{ ...body, fontSize: 15 }}>
                Orders in, labels out. ShipTime connects directly to your eCommerce platform so you can ship without switching tabs.
              </p>
              <a
                href="https://www.shiptime.com/integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-90"
                style={{ color: ds.navy, ...sora }}
              >
                Browse All Integrations →
              </a>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[
                "Shopify", "WooCommerce", "Magento", "BigCommerce",
                "Amazon", "eBay", "Etsy", "Squarespace",
              ].map(name => (
                <div key={name} className="flex items-center justify-center px-4 py-3 rounded-xl text-xs font-semibold text-center" style={{ background: ds.surface, border: `1px solid ${ds.border}`, color: ds.muted, ...sora }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SAMPLE RATES (self-serve quote CTA) ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.surfaceAlt }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>Ship Smarter</p>
          <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
            See Sample Rates in 30 Seconds
          </h2>
          <p className="mb-8 mx-auto" style={{ ...body, fontSize: 16, maxWidth: 500 }}>
            Enter origin, destination, and weight. Compare real carrier rates, no account needed. Your actual rates may be lower.
          </p>
          <a
            href="https://www.shiptime.com/get-a-quote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-7 py-3.5 transition-all hover:opacity-90"
            style={{ background: ds.orange, borderRadius: 999, boxShadow: "0 4px 20px rgba(236,90,38,0.25)", ...sora }}
          >
            Get Your Rates →
          </a>
          <p className="mt-4 text-xs" style={{ color: ds.muted }}>No account needed. Takes under 30 seconds.</p>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>The Numbers</p>
            <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              Better performance.<br />Lower total cost.
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 420, fontSize: 15 }}>
              ShipTime customers see measurable improvements in cost, speed, and satisfaction, consistently.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map(m => (
              <div key={m.label} style={{ ...card, textAlign: "center", padding: "36px 28px" }}>
                <div className="font-bold leading-none mb-3" style={{ ...heading, fontSize: "clamp(2.4rem, 6vw, 3.5rem)", color: ds.orange }}>{m.big}</div>
                <div className="font-semibold mb-2" style={{ color: ds.navy, fontSize: 15, ...sora }}>{m.label}</div>
                <div style={{ ...body, fontSize: 13.5, color: ds.muted }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <ShipTimeFAQ background={ds.surface} />

      {/* ── SCENE DIVIDER (stats + illustration) ── */}
      <ShipTimeSceneDivider />

      {/* ── FOOTER ── */}
      <footer className="px-5 md:px-10 py-10 md:py-14" style={{ background: ds.navy, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8" style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Tagline */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)", ...sora }}>Ship Smarter Today</p>
          </div>

          {/* Address + phone */}
          <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            <p>700 Dorval Dr., Suite 700</p>
            <p>Oakville, ON L6K 3V3 Canada</p>
            <a href="tel:18777845744" className="mt-2 transition-colors hover:text-[#EC5A26]" style={{ color: "rgba(255,255,255,0.45)" }}>1-877-784-5744</a>
          </div>
        </div>
        <p className="mt-8 text-xs text-center md:text-left" style={{ color: "rgba(255,255,255,0.25)", maxWidth: 1240, margin: "32px auto 0" }}>© 2026 ShipTime Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
