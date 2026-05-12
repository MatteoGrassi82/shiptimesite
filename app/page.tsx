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
  fontFamily: "var(--font-sora), system-ui, sans-serif",
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

const sora = { fontFamily: "var(--font-sora), sans-serif" };

const whatCards = [
  { Ico: Icon.Lightning, title: "Intelligent Rate Shopping",  desc: "Automatically surface the best carrier option across your negotiated rates and ours — every shipment, optimized in seconds." },
  { Ico: Icon.Layers,    title: "Unified Logistics Platform", desc: "One system for parcel, LTL, tracking, billing, and analytics. Replace your scattered tools with one control tower." },
  { Ico: Icon.Map,       title: "Fulfillment Optimization",   desc: "Access 2,500+ warehouse nodes across Canada & the US. Route inventory closer to your customers." },
  { Ico: Icon.Chart,     title: "Visibility & Control",       desc: "See performance clearly, uncover savings, and make better logistics decisions — without adding headcount." },
];

const metrics = [
  { big: "70%",    label: "Off walk-in carrier prices", sub: "Pre-negotiated volume discounts passed directly to you" },
  { big: "25+",    label: "Carriers integrated",        sub: "Canada Post, UPS, FedEx, Purolator, DHL & more" },
  { big: "1,000+", label: "Five-star reviews",          sub: "Rated #1 for ease of use by Canadian SMBs" },
];

const compareRows = [
  { feature: "Carrier choice",      st: "25+ carriers, full flexibility",    fba: "Amazon logistics only" },
  { feature: "Rate optimization",   st: "Multi-carrier comparison",          fba: "Fixed Amazon rates" },
  { feature: "Delivery experience", st: "Full control over branding & SLAs", fba: "Amazon-controlled" },
  { feature: "Platform lock-in",    st: "None — ship from any channel",      fba: "Amazon ecosystem only" },
  { feature: "Fulfillment",         st: "Tailored by product profile",       fba: "Rigid inbound requirements" },
  { feature: "Cost predictability", st: "Transparent, negotiated rates",     fba: "Variable storage & fee surges" },
  { feature: "Support",             st: "Dedicated, consultative team",      fba: "Ticket-based, limited" },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3.5" style={{ background: "rgba(255,255,255,0.93)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${ds.border}` }}>
        <a href="#">
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={110} height={34} className="h-7 w-auto" priority />
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: ds.body }}>
          <a href="#why" className="hover:text-[#FF6B35] transition-colors">Why ShipTime</a>
          <a href="#compare" className="hover:text-[#FF6B35] transition-colors">vs. FBA</a>
        </div>
        <a href="#get-report" className="text-white text-sm font-semibold px-4 py-2 transition-colors hover:opacity-90 whitespace-nowrap" style={{ background: ds.orange, borderRadius: 9, ...sora }}>
          Free Report
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-5 pt-28 md:pt-36 pb-0 overflow-hidden" style={{ background: ds.white, minHeight: "100svh" }}>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 68%)" }} />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest" style={{ background: ds.peach, color: ds.orange, ...sora }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          Logistics Intelligence Platform
        </div>

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
          <a href="#get-report" className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: ds.orange, borderRadius: 9, boxShadow: "0 4px 20px rgba(255,107,53,0.28)", ...sora }}>
            Get Free Logistics Report →
          </a>
          <a href="#book-meeting" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: ds.white, border: `1.5px solid ${ds.border}`, borderRadius: 999, color: ds.navy, ...sora }}>
            Book a Meeting
          </a>
        </div>

        {/* Tags — hide on very small screens */}
        <div className="hidden sm:flex gap-5 flex-wrap justify-center mb-12">
          {["Intelligent Shipping", "Fulfillment Optimization", "North American Network"].map(t => (
            <span key={t} className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: ds.muted, ...sora }}>{t}</span>
          ))}
        </div>

        {/* Stats bar */}
        <div className="w-full max-w-2xl border-t mb-0" style={{ borderColor: ds.border }}>
          <div className="grid grid-cols-3">
            {[
              { label: "vs. walk-in rates",  value: "Up to 70%" },
              { label: "Carriers",           value: "25+" },
              { label: "5-Star Reviews",     value: "1,000+" },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-col items-center py-6 gap-1" style={{ borderLeft: i > 0 ? `1px solid ${ds.border}` : undefined }}>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-center" style={{ color: ds.muted, ...sora }}>{s.label}</span>
                <span className="font-bold leading-none" style={{ ...heading, fontSize: "clamp(1.1rem, 4vw, 1.8rem)" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.surfaceAlt }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>What ShipTime Does</p>
            <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              One platform. Everything logistics.
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>
              Technology, operations, and network execution in one managed solution — so your brand can grow without limitation.
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

      {/* ── PAIN POINTS ── */}
      <section className="px-5 md:px-10 py-20 md:py-24" style={{ background: ds.white }}>
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
              <div key={m.big} style={{ ...card, textAlign: "center", padding: "36px 28px" }}>
                <div className="font-bold leading-none mb-3" style={{ ...heading, fontSize: "clamp(2.4rem, 6vw, 3.5rem)", color: ds.orange }}>{m.big}</div>
                <div className="font-semibold mb-2" style={{ color: ds.navy, fontSize: 15, ...sora }}>{m.label}</div>
                <div style={{ ...body, fontSize: 13.5, color: ds.muted }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHIPTIME VS FBA ── */}
      <section id="compare" className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.white }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>ShipTime vs. FBA</p>
            <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              Platform flexibility beats lock-in
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>
              FBA is powerful for Amazon reach. ShipTime is built for flexible, omnichannel logistics that you control.
            </p>
          </div>

          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {compareRows.map(row => (
              <div key={row.feature} style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${ds.border}` }}>
                <div className="px-4 py-2.5" style={{ background: ds.surface }}>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ds.muted, ...sora }}>{row.feature}</span>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-3 flex items-start gap-2" style={{ background: "#0F1B2D08", borderLeft: `2px solid ${ds.orange}` }}>
                    <div className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: ds.orange }}>
                      <Icon.Check size={9} style={{ stroke: "white" }} />
                    </div>
                    <span style={{ ...body, fontSize: 12.5, color: ds.navy }}>{row.st}</span>
                  </div>
                  <div className="px-4 py-3 flex items-start gap-2" style={{ borderLeft: `1px solid ${ds.border}` }}>
                    <span className="flex-shrink-0 text-xs font-bold mt-0.5" style={{ color: ds.muted }}>✕</span>
                    <span style={{ ...body, fontSize: 12.5, color: ds.muted }}>{row.fba}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: full table */}
          <div className="hidden md:block" style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${ds.border}` }}>
            <div className="grid grid-cols-3">
              <div className="px-6 py-4" style={{ background: ds.surface, borderBottom: `1px solid ${ds.border}` }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ds.muted, ...sora }}>Feature</span>
              </div>
              <div className="px-6 py-4" style={{ background: ds.navy, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ds.orange, ...sora }}>ShipTime</span>
              </div>
              <div className="px-6 py-4" style={{ background: ds.surface, borderBottom: `1px solid ${ds.border}`, borderLeft: `1px solid ${ds.border}` }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ds.muted, ...sora }}>FBA</span>
              </div>
            </div>
            {compareRows.map((row, i) => (
              <div key={row.feature} className="grid grid-cols-3" style={{ borderTop: i > 0 ? `1px solid ${ds.border}` : undefined }}>
                <div className="px-6 py-4" style={{ background: ds.surfaceAlt }}>
                  <span className="text-sm font-semibold" style={{ color: ds.navy, ...sora }}>{row.feature}</span>
                </div>
                <div className="px-6 py-4 flex items-center gap-2.5" style={{ background: "#0F1B2D08", borderLeft: `2px solid ${ds.orange}` }}>
                  <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: ds.orange }}>
                    <Icon.Check size={9} style={{ stroke: "white" }} />
                  </div>
                  <span style={{ ...body, fontSize: 13.5, color: ds.navy }}>{row.st}</span>
                </div>
                <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderLeft: `1px solid ${ds.border}` }}>
                  <span className="flex-shrink-0 text-xs font-bold" style={{ color: ds.muted }}>✕</span>
                  <span style={{ ...body, fontSize: 13.5, color: ds.muted }}>{row.fba}</span>
                </div>
              </div>
            ))}
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
            <a href="#" className="w-fit inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-all hover:-translate-y-0.5" style={{ background: ds.white, color: ds.navy, borderRadius: 9, ...sora }}>
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
            <a href="mailto:michael@shiptime.com" className="w-fit inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-all hover:bg-white/10" style={{ color: "white", borderRadius: 9, border: "1.5px solid rgba(255,255,255,0.3)", ...sora }}>
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
