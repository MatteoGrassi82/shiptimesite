import type React from "react";
import Image from "next/image";
import ShipTimeWhySection from "@/components/ui/shiptime-why-section";
import ShipTimeGlobeSection from "@/components/ui/shiptime-globe-section";
import { Icon } from "@/components/ui/icons";

// Design system tokens
const ds = {
  navy:        "#0F1B2D",
  body:        "#4A5468",
  muted:       "#8A94A6",
  orange:      "#FF6B35",
  orangeHover: "#E85A24",
  peach:       "#FFE8DD",
  surface:     "#F4F5F7",
  surfaceAlt:  "#FAFAFB",
  border:      "#E5E7EB",
  white:       "#FFFFFF",
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
  padding: "32px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const whatCards = [
  { Ico: Icon.Lightning, title: "Intelligent Rate Shopping",    desc: "Automatically surface the best carrier option across your negotiated rates and ours — every single shipment, optimized in seconds." },
  { Ico: Icon.Layers,    title: "Unified Logistics Platform",   desc: "One system for parcel, LTL, tracking, billing, and analytics. Replace your scattered tools with one control tower." },
  { Ico: Icon.Map,       title: "Fulfillment Optimization",     desc: "Access 2,500+ warehouse nodes across Canada & the US. Route inventory closer to your customers." },
  { Ico: Icon.Chart,     title: "Visibility & Control",         desc: "See performance clearly, uncover savings, and make better logistics decisions — without adding headcount." },
];


const metrics = [
  { big: "70%",   label: "Off walk-in carrier prices",  sub: "Pre-negotiated volume discounts passed directly to you" },
  { big: "25+",   label: "Carriers integrated",         sub: "Canada Post, UPS, FedEx, Purolator, DHL & more" },
  { big: "1,000+",label: "Five-star reviews",           sub: "Rated #1 for ease of use by Canadian SMBs" },
];

const shipTimeWins = [
  "Multi-carrier rate optimization",
  "Control over delivery promise & customer experience",
  "No platform lock-in",
  "Tailored shipping strategies by product profile",
  "Consultative, dedicated support",
];

const fbaLoses = [
  "Embedded within the Amazon ecosystem",
  "Less control over packaging and delivery experience",
  "Storage and fulfillment fees can rise unpredictably",
  "Rigid inbound requirements and inventory constraints",
  "Not always omnichannel-friendly",
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${ds.border}` }}>
        <a href="#">
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={120} height={38} className="h-8 w-auto" priority />
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: ds.body }}>
          <a href="#why" className="hover:text-[#FF6B35] transition-colors">Why ShipTime</a>
          <a href="#compare" className="hover:text-[#FF6B35] transition-colors">vs. FBA</a>
        </div>
        <a
          href="#get-report"
          className="text-white text-sm font-semibold px-5 py-2.5 transition-colors hover:opacity-90"
          style={{ background: ds.orange, borderRadius: 9, fontFamily: "var(--font-sora), sans-serif" }}
        >
          Get My Free Report
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-0 overflow-hidden" style={{ background: ds.white, minHeight: "100svh" }}>
        {/* Decorative peach blob */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 68%)" }} />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest" style={{ background: ds.peach, color: ds.orange, fontFamily: "var(--font-sora), sans-serif" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          Logistics Intelligence Platform
        </div>

        {/* Headline */}
        <h1 className="mb-6 max-w-[820px]" style={{ ...heading, fontSize: "clamp(2.8rem, 6.5vw, 4.8rem)" }}>
          Your Logistics.<br />
          <span style={{ color: "#FFB899" }}>Fully Optimized.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-[520px] mb-10" style={{ ...body, fontSize: 17, lineHeight: 1.65 }}>
          ShipTime is your logistics operating system — unifying shipping, fulfillment, and carrier strategy across North America. <strong style={{ color: ds.navy, fontWeight: 600 }}>No platform fees. No disruption.</strong>
        </p>

        {/* CTAs */}
        <div className="flex gap-3 flex-wrap justify-center mb-12">
          <a href="#get-report" className="inline-flex items-center gap-2 text-white px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: ds.orange, borderRadius: 9, boxShadow: "0 4px 20px rgba(255,107,53,0.28)", fontFamily: "var(--font-sora), sans-serif" }}>
            Get Free Logistics Report →
          </a>
          <a href="#book-meeting" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: ds.white, border: `1.5px solid ${ds.border}`, borderRadius: 999, color: ds.navy, fontFamily: "var(--font-sora), sans-serif" }}>
            Book a Meeting
          </a>
        </div>

        {/* Tags */}
        <div className="flex gap-7 flex-wrap justify-center mb-16">
          {["Intelligent Shipping Execution", "Fulfillment Optimization", "North American Network"].map(t => (
            <span key={t} className="text-xs font-semibold uppercase tracking-widest" style={{ color: ds.muted, fontFamily: "var(--font-sora), sans-serif" }}>{t}</span>
          ))}
        </div>

        {/* Stats bar */}
        <div className="w-full max-w-3xl border-t" style={{ borderColor: ds.border }}>
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: ds.border }}>
            {[
              { label: "vs. walk-in rates",   value: "Up to 70%" },
              { label: "Carriers Available",  value: "25+" },
              { label: "Five-Star Reviews",   value: "1,000+" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center py-8 gap-1">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: ds.muted, fontFamily: "var(--font-sora), sans-serif" }}>{s.label}</span>
                <span className="font-bold leading-none" style={{ ...heading, fontSize: s.value.length > 4 ? "1.4rem" : "2rem" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QR + insight nudge */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mt-10 mb-0 px-8 py-6 w-full max-w-3xl" style={{ background: ds.surface, borderRadius: "0 0 22px 22px" }}>
          <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center" style={{ background: ds.white, borderRadius: 12, border: `1px solid ${ds.border}` }}>
            {/* QR placeholder — replace src with real QR image */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="2" y="2" width="18" height="18" rx="2" stroke={ds.navy} strokeWidth="2.5"/><rect x="7" y="7" width="8" height="8" fill={ds.navy}/><rect x="28" y="2" width="18" height="18" rx="2" stroke={ds.navy} strokeWidth="2.5"/><rect x="33" y="7" width="8" height="8" fill={ds.navy}/><rect x="2" y="28" width="18" height="18" rx="2" stroke={ds.navy} strokeWidth="2.5"/><rect x="7" y="33" width="8" height="8" fill={ds.navy}/><rect x="28" y="28" width="4" height="4" fill={ds.navy}/><rect x="34" y="28" width="4" height="4" fill={ds.navy}/><rect x="40" y="28" width="4" height="4" fill={ds.navy}/><rect x="28" y="34" width="4" height="4" fill={ds.navy}/><rect x="34" y="34" width="4" height="4" fill={ds.navy}/><rect x="40" y="40" width="4" height="4" fill={ds.navy}/><rect x="28" y="40" width="4" height="4" fill={ds.navy}/></svg>
          </div>
          <div className="text-center sm:text-left">
            <p className="font-semibold mb-0.5" style={{ color: ds.navy, fontSize: 14, fontFamily: "var(--font-sora), sans-serif" }}>Scan for your free logistics performance report</p>
            <p style={{ color: ds.muted, fontSize: 13 }}>Walk away with at least one actionable insight today.</p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="px-6 md:px-10 py-28" style={{ background: ds.surfaceAlt }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, fontFamily: "var(--font-sora), sans-serif" }}>What ShipTime Does</p>
            <h2 style={{ ...heading, fontSize: "clamp(1.9rem, 3vw, 2.4rem)", marginBottom: 16 }}>
              One platform. Everything logistics.
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>
              Technology, operations, and network execution in one managed solution — so your brand can grow without limitation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whatCards.map(c => (
              <div key={c.title} style={card} className="hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: ds.peach, borderRadius: 10 }}>
                  <c.Ico size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1rem", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{c.title}</h3>
                <p style={{ ...body, fontSize: 14 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBE ── */}
      <ShipTimeGlobeSection />

      {/* ── PAIN POINTS (setup for roadblocks) ── */}
      <section className="px-6 md:px-10 py-24" style={{ background: ds.white }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: ds.orange, fontFamily: "var(--font-sora), sans-serif" }}>The Real Cost of Doing Nothing</p>
          <h2 className="mb-16" style={{ ...heading, fontSize: "clamp(1.9rem, 3vw, 2.4rem)" }}>
            Three problems holding your logistics back
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { Ico: Icon.Dollar,    title: "Unpredictable costs",              desc: "Carrier rates, surcharges, and fees that shift without warning. Budgeting for shipping feels like guesswork." },
              { Ico: Icon.Return,    title: "Declining customer experience",    desc: "Late deliveries and poor tracking visibility erode trust. Each missed SLA is a loyalty hit you can't recover." },
              { Ico: Icon.Cog,       title: "Manual workflows slowing growth",  desc: "Your team is copy-pasting orders, chasing exceptions, and firefighting logistics instead of scaling the business." },
            ].map(p => (
              <div key={p.title} style={card} className="text-left">
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: ds.peach, borderRadius: 10 }}>
                  <p.Ico size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1rem", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ ...body, fontSize: 14 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SHIPTIME ── */}
      <div id="why"><ShipTimeWhySection /></div>

      {/* ── METRICS ── */}
      <section className="px-6 md:px-10 py-28" style={{ background: ds.surfaceAlt }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, fontFamily: "var(--font-sora), sans-serif" }}>The Numbers</p>
            <h2 style={{ ...heading, fontSize: "clamp(1.9rem, 3vw, 2.4rem)", marginBottom: 16 }}>
              Better performance.<br />Lower total cost.
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 420, fontSize: 15 }}>
              ShipTime customers see measurable improvements in cost, speed, and satisfaction — consistently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {metrics.map(m => (
              <div key={m.big} style={{ ...card, textAlign: "center", padding: "40px 32px" }}>
                <div className="font-bold leading-none mb-3" style={{ ...heading, fontSize: "3.5rem", color: ds.orange }}>{m.big}</div>
                <div className="font-semibold mb-2" style={{ color: ds.navy, fontSize: 16, fontFamily: "var(--font-sora), sans-serif" }}>{m.label}</div>
                <div style={{ ...body, fontSize: 13.5, color: ds.muted }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHIPTIME VS FBA ── */}
      <section id="compare" className="px-6 md:px-10 py-28" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, fontFamily: "var(--font-sora), sans-serif" }}>ShipTime vs. FBA</p>
            <h2 style={{ ...heading, fontSize: "clamp(1.9rem, 3vw, 2.4rem)", marginBottom: 16 }}>
              Platform flexibility beats platform lock-in
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>
              FBA is powerful for Amazon reach. ShipTime is built for flexible, omnichannel logistics that you control.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] gap-5 md:gap-0 items-start">
            {/* ShipTime col */}
            <div style={{ background: ds.navy, borderRadius: 22, padding: "36px" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: ds.orange, fontFamily: "var(--font-sora), sans-serif" }}>ShipTime — Partner-Led Flexibility</p>
              <div className="flex flex-col gap-3">
                {shipTimeWins.map(w => (
                  <div key={w} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: ds.orange }}>
                      <Icon.Check size={11} style={{ stroke: "white" }} />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 1.55 }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* VS badge */}
            <div className="hidden md:flex items-start justify-center pt-16">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: ds.peach, color: ds.orange, fontFamily: "var(--font-sora), sans-serif" }}>VS</div>
            </div>
            {/* FBA col */}
            <div style={{ ...card, padding: "36px" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: ds.muted, fontFamily: "var(--font-sora), sans-serif" }}>FBA — A Channel, Not a Strategy</p>
              <div className="flex flex-col gap-3">
                {fbaLoses.map(l => (
                  <div key={l} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 mt-0.5 text-sm" style={{ color: ds.muted }}>✕</span>
                    <span style={{ ...body, fontSize: 14 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DUAL CTA ── */}
      <section id="get-report" className="px-6 md:px-10 py-28" style={{ background: ds.navy }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* Card 1 */}
          <div className="flex flex-col gap-5" style={{ background: ds.orange, borderRadius: 22, padding: "40px" }}>
            <div className="w-11 h-11 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12 }}>
              <Icon.Clipboard size={20} style={{ stroke: "white" }} />
            </div>
            <h3 style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Get Your Free Logistics Performance Report</h3>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
              Answer 10 quick questions and identify cost savings, delivery improvements, and fulfillment opportunities — in under 2 minutes. Includes a complimentary 20-minute expert review.
            </p>
            <a href="#" className="w-fit inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-all hover:-translate-y-0.5" style={{ background: ds.white, color: ds.navy, borderRadius: 9, fontFamily: "var(--font-sora), sans-serif" }}>
              Start the Free Assessment →
            </a>
          </div>
          {/* Card 2 */}
          <div id="book-meeting" className="flex flex-col gap-5" style={{ background: "rgba(255,255,255,0.06)", borderRadius: 22, padding: "40px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-11 h-11 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12 }}>
              <Icon.Calendar size={20} style={{ stroke: "white" }} />
            </div>
            <h3 style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Talk to a ShipTime Logistics Expert</h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
              Skip the form and get straight to the conversation. Book a 20-minute call with our team to discuss your current setup and where we can drive the most impact.
            </p>
            <a href="mailto:michael@shiptime.com" className="w-fit inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-all hover:bg-white/10" style={{ color: "white", borderRadius: 9, border: "1.5px solid rgba(255,255,255,0.3)", fontFamily: "var(--font-sora), sans-serif" }}>
              Book a Meeting →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: ds.navy, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Image src="/shiptime-logo.svg" alt="ShipTime" width={110} height={34} className="brightness-0 invert opacity-60 h-7 w-auto" />
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>© 2026 ShipTime Inc. · Canada & United States</p>
        <div className="flex gap-5">
          {[
            { label: "shiptime.com",          href: "https://www.shiptime.com" },
            { label: "416-937-1006",          href: "tel:4169371006" },
            { label: "michael@shiptime.com",  href: "mailto:michael@shiptime.com" },
          ].map(l => (
            <a key={l.label} href={l.href} className="text-xs transition-colors hover:text-[#FF6B35]" style={{ color: "rgba(255,255,255,0.45)" }}>{l.label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
