import type React from "react";
import Image from "next/image";
import ShipTimeWhySection from "@/components/ui/shiptime-why-section";
import ShipTimeGlobeSection from "@/components/ui/shiptime-globe-section";
import { Icon } from "@/components/ui/icons";

const ds = {
  navy:       "#0F1B2D",
  body:       "#4A5468",
  muted:      "#8A94A6",
  orange:     "#FF6B35",
  peach:      "#FFE8DD",
  surface:    "#F4F5F7",
  surfaceAlt: "#FAFAFB",
  border:     "#E5E7EB",
  white:      "#FFFFFF",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 700,
};

const body: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
  color: ds.body,
  lineHeight: 1.6,
};

const card: React.CSSProperties = {
  background: ds.surface,
  borderRadius: 22,
  padding: "28px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const sora = { fontFamily: "var(--font-dm-sans), sans-serif" };

const utm = (campaign: string, content: string) =>
  `?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=${campaign}&utm_content=${content}`;

const SHIPTIME = "https://www.shiptime.com";
const MEETING  = "https://meetings.hubspot.com/michael";

const reportUrl  = (content: string) => `${SHIPTIME}${utm("logistics-report", content)}`;
const meetingUrl = (content: string) => `${MEETING}${utm("book-meeting", content)}`;

const whatCards = [
  { Ico: Icon.Lightning, title: "Intelligent Rate Shopping",  desc: "Automatically surface the best carrier option across your negotiated rates and ours — every shipment, optimized in seconds." },
  { Ico: Icon.Layers,    title: "Unified Logistics Platform", desc: "One system for parcel, LTL, tracking, billing, and analytics. Replace your scattered tools with one control tower." },
  { Ico: Icon.Map,       title: "Fulfillment Optimization",   desc: "Access 2,500+ warehouse nodes across Canada & the US. Route inventory closer to your customers." },
  { Ico: Icon.Chart,     title: "Visibility & Control",       desc: "See performance clearly, uncover savings, and make better logistics decisions — without adding headcount." },
];

const metrics = [
  { big: "70%",    label: "Off walk-in carrier prices", sub: "Pre-negotiated volume discounts passed directly to you" },
  { big: "1,000+", label: "Five-star reviews",          sub: "Rated #1 for ease of use by Canadian SMBs" },
  { big: null,     label: "Growing 3PL network",        sub: "A growing network of partner 3PLs across Canada and the US — giving you more fulfillment flexibility with every shipment." },
];

const compareRows = [
  { feature: "Carrier choice",      st: "Courier, LTL, and FTL — full flexibility",  fba: "Amazon logistics only" },
  { feature: "Rate optimization",   st: "Multi-carrier comparison",                  fba: "Rates set by the platform" },
  { feature: "Delivery experience", st: "Full control over branding & SLAs",         fba: "Platform-controlled" },
  { feature: "Platform lock-in",    st: "None — ship from any channel",              fba: "Tied to Amazon ecosystem" },
  { feature: "Fulfillment",         st: "Tailored by product profile",               fba: "Rigid inbound requirements" },
  { feature: "Cost predictability", st: "Transparent, negotiated rates",             fba: "Variable storage & fee structures" },
  { feature: "Support",             st: "Dedicated, consultative team",              fba: "Ticket-based support" },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3.5" style={{ background: "rgba(255,255,255,0.93)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${ds.border}` }}>
        <a href="#">
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={160} height={50} className="h-10 w-auto" priority />
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: ds.body }}>
          <a href="#why" className="hover:text-[#FF6B35] transition-colors">Why ShipTime</a>
          <a href="#compare" className="hover:text-[#FF6B35] transition-colors">vs. FBA</a>
        </div>
        <a href={reportUrl("nav")} target="_blank" rel="noopener noreferrer" className="text-white text-sm font-semibold px-4 py-2 transition-colors hover:opacity-90 whitespace-nowrap" style={{ background: ds.orange, borderRadius: 9, ...sora }}>
          Free Report
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-5 pt-28 md:pt-36 pb-0 overflow-hidden" style={{ background: ds.white, minHeight: "100svh" }}>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 68%)" }} />

        {/* Headline */}
        <h1 className="mb-5 max-w-[820px]" style={{ ...heading, fontSize: "clamp(2.2rem, 7vw, 4.8rem)" }}>
          Your Logistics.<br />
          <span style={{ color: "#FFB899" }}>Fully Optimized.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-[480px] mb-8 px-2" style={{ ...body, fontSize: "clamp(15px, 2.5vw, 17px)", lineHeight: 1.65 }}>
          ShipTime is your logistics operating system — unifying shipping, fulfillment, and carrier strategy across North America.{" "}
          <strong style={{ color: ds.navy, fontWeight: 600 }}>No platform fees. No disruption.</strong>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 w-full max-w-sm sm:max-w-none">
          <a href={reportUrl("hero")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: ds.orange, borderRadius: 9, boxShadow: "0 4px 20px rgba(255,107,53,0.28)", ...sora }}>
            Get Free Logistics Report →
          </a>
          <a href={meetingUrl("hero")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: ds.white, border: `1.5px solid ${ds.border}`, borderRadius: 999, color: ds.navy, ...sora }}>
            Book a Meeting
          </a>
        </div>

        {/* Tags — hide on very small screens */}
        <div className="hidden sm:flex gap-5 flex-wrap justify-center mb-12">
          {["Intelligent Shipping", "Fulfillment Optimization", "North American Network"].map(t => (
            <span key={t} className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: ds.muted, ...sora }}>{t}</span>
          ))}
        </div>

      </section>

      {/* ── PAIN POINTS ── */}
      <section className="px-5 md:px-10 py-20 md:py-24" style={{ background: ds.surfaceAlt }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: ds.orange, ...sora }}>The Real Cost of Doing Nothing</p>
          <h2 className="mb-10 md:mb-14" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
            Three problems holding your logistics back
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { Ico: Icon.Dollar, title: "Unpredictable costs",             desc: "Carrier rates, surcharges, and fees that shift without warning. Budgeting for shipping feels like guesswork." },
              { Ico: Icon.Return, title: "Declining customer experience",   desc: "Late deliveries and poor tracking visibility erode trust. Each missed SLA is a loyalty hit you can't recover." },
              { Ico: Icon.Cog,    title: "Manual workflows slowing growth", desc: "Your team is copy-pasting orders, chasing exceptions, and firefighting logistics instead of scaling." },
            ].map(p => (
              <div key={p.title} style={card}>
                <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: ds.peach, borderRadius: 10 }}>
                  <p.Ico size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "0.95rem", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ ...body, fontSize: 14 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>What ShipTime Does</p>
            <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              One platform. Everything logistics.
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>
              Technology, operations, and network execution in one managed solution — so your brand can grow confidently and without limitation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whatCards.map(c => (
              <div key={c.title} style={card} className="hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: ds.peach, borderRadius: 10 }}>
                  <c.Ico size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "0.95rem", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{c.title}</h3>
                <p style={{ ...body, fontSize: 14 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBE ── */}
      <ShipTimeGlobeSection />

      {/* ── WHY SHIPTIME ── */}
      <div id="why"><ShipTimeWhySection /></div>

      {/* ── METRICS ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.surfaceAlt }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>The Numbers</p>
            <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              Better performance.<br />Lower total cost.
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 420, fontSize: 15 }}>
              ShipTime customers see measurable improvements in cost, speed, and satisfaction — consistently.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map(m => (
              <div key={m.label} style={{ ...card, textAlign: "center", padding: "36px 28px" }}>
                {m.big ? (
                  <div className="font-bold leading-none mb-3" style={{ ...heading, fontSize: "clamp(2.4rem, 6vw, 3.5rem)", color: ds.orange }}>{m.big}</div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center mb-3 mx-auto" style={{ background: ds.peach, borderRadius: 10 }}>
                    <Icon.Warehouse size={18} style={{ stroke: ds.orange }} />
                  </div>
                )}
                <div className="font-semibold mb-2" style={{ color: ds.navy, fontSize: 15, ...sora }}>{m.label}</div>
                <div style={{ ...body, fontSize: 13.5, color: ds.muted }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHIPTIME VS FBA ── */}
      <section id="compare" className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.surfaceAlt }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>ShipTime vs. FBA</p>
            <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
              Platform flexibility beats lock-in
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 520, fontSize: 16 }}>
              FBA is powerful for Amazon reach. ShipTime is built for flexible, omnichannel logistics that you control.
            </p>
          </div>

          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {compareRows.map(row => (
              <div key={row.feature} style={{ borderRadius: 18, overflow: "hidden", background: ds.white, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="px-5 py-3" style={{ background: ds.surface, borderBottom: `1px solid ${ds.border}` }}>
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: ds.navy, ...sora }}>{row.feature}</span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ background: ds.orange }}>
                      <Icon.Check size={11} style={{ stroke: "white" }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: ds.orange, ...sora }}>ShipTime</div>
                      <span style={{ ...body, fontSize: 14, color: ds.navy }}>{row.st}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3" style={{ borderTop: `1px solid ${ds.border}` }}>
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ background: ds.surface }}>
                      <span className="text-[11px] font-bold" style={{ color: ds.muted }}>✕</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: ds.muted, ...sora }}>FBA</div>
                      <span style={{ ...body, fontSize: 14, color: ds.muted }}>{row.fba}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: cleaner table with ShipTime column emphasized via shadow card */}
          <div className="hidden md:block relative">
            {/* ShipTime emphasis card — sits behind, raised */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -16,
                bottom: -16,
                left: "calc(33.333% + 8px)",
                width: "calc(33.333% - 16px)",
                background: ds.white,
                borderRadius: 20,
                boxShadow: "0 12px 40px rgba(15,27,45,0.10), 0 2px 8px rgba(15,27,45,0.06)",
                border: `1.5px solid ${ds.orange}`,
              }}
            />

            <div className="relative" style={{ borderRadius: 16, overflow: "hidden" }}>
              {/* Header row */}
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <div className="px-7 py-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: ds.muted, ...sora }}>Feature</span>
                </div>
                <div className="px-7 py-6 text-center">
                  <span className="text-sm font-bold uppercase tracking-widest" style={{ color: ds.orange, ...sora }}>ShipTime</span>
                </div>
                <div className="px-7 py-6 text-center">
                  <span className="text-sm font-bold uppercase tracking-widest" style={{ color: ds.muted, ...sora }}>FBA</span>
                </div>
              </div>

              {/* Data rows */}
              {compareRows.map((row, i) => (
                <div
                  key={row.feature}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: "1fr 1fr 1fr",
                    borderTop: `1px solid ${ds.border}`,
                  }}
                >
                  <div className="px-7 py-5">
                    <span className="font-semibold" style={{ color: ds.navy, fontSize: 15, ...sora }}>{row.feature}</span>
                  </div>
                  <div className="px-7 py-5 flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: ds.orange }}>
                      <Icon.Check size={11} style={{ stroke: "white" }} />
                    </div>
                    <span style={{ ...body, fontSize: 14.5, color: ds.navy, fontWeight: 500 }}>{row.st}</span>
                  </div>
                  <div className="px-7 py-5 flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: ds.surface }}>
                      <span className="text-[11px] font-bold" style={{ color: ds.muted }}>✕</span>
                    </div>
                    <span style={{ ...body, fontSize: 14.5, color: ds.muted }}>{row.fba}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DUAL CTA ── */}
      <section id="get-report" className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.navy }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="flex flex-col gap-5" style={{ background: ds.orange, borderRadius: 22, padding: "32px" }}>
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12 }}>
              <Icon.Clipboard size={18} style={{ stroke: "white" }} />
            </div>
            <h3 style={{ ...sora, fontWeight: 700, fontSize: "1.2rem", color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Get Your Free Logistics Performance Report</h3>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
              Answer 10 quick questions and identify cost savings, delivery improvements, and fulfillment opportunities — in under 2 minutes.
            </p>
            <a href={reportUrl("dual-cta")} target="_blank" rel="noopener noreferrer" className="w-fit inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-all hover:-translate-y-0.5" style={{ background: ds.white, color: ds.navy, borderRadius: 9, ...sora }}>
              Start the Free Assessment →
            </a>
          </div>
          <div id="book-meeting" className="flex flex-col gap-5" style={{ background: "rgba(255,255,255,0.06)", borderRadius: 22, padding: "32px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12 }}>
              <Icon.Calendar size={18} style={{ stroke: "white" }} />
            </div>
            <h3 style={{ ...sora, fontWeight: 700, fontSize: "1.2rem", color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Talk to a ShipTime Logistics Expert</h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
              Skip the form and get straight to the conversation. Book a 20-minute call to discuss your current setup and where we can drive the most impact.
            </p>
            <a href={meetingUrl("dual-cta")} target="_blank" rel="noopener noreferrer" className="w-fit inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-all hover:bg-white/10" style={{ color: "white", borderRadius: 9, border: "1.5px solid rgba(255,255,255,0.3)", ...sora }}>
              Book a Meeting →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-5 md:px-10 py-8 flex flex-col items-center gap-4 md:flex-row md:justify-between" style={{ background: ds.navy, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Image src="/shiptime-logo.svg" alt="ShipTime" width={100} height={32} className="brightness-0 invert opacity-60 h-7 w-auto" />
        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>© 2026 ShipTime Inc. · Canada & United States</p>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: "shiptime.com",         href: "https://www.shiptime.com" },
            { label: "416-937-1006",         href: "tel:4169371006" },
            { label: "michael@shiptime.com", href: "mailto:michael@shiptime.com" },
          ].map(l => (
            <a key={l.label} href={l.href} className="text-xs transition-colors hover:text-[#FF6B35]" style={{ color: "rgba(255,255,255,0.45)" }}>{l.label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
