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

const SHIPTIME = "https://docs.google.com/forms/d/e/1FAIpQLSeLZv90COHXyXqlijLX6Gls5SMAquTHc8POd8JO3ajmxSdiVA/viewform?usp=send_form";
const MEETING  = "https://meetings.hubspot.com/michael";

const reportUrl  = (content: string) => `${SHIPTIME}${utm("logistics-report", content)}`;
const meetingUrl = (content: string) => `${MEETING}${utm("book-meeting", content)}`;

const whatCards = [
  { Ico: Icon.Lightning, title: "Intelligent Rate Shopping",  desc: "Automatically surface the best carrier option across your negotiated rates and ours. Every shipment, optimized in seconds." },
  { Ico: Icon.Layers,    title: "Unified Logistics Platform", desc: "One system for parcel, LTL, tracking, billing, and analytics. Replace your scattered tools with one control tower." },
  { Ico: Icon.Map,       title: "Fulfillment Optimization",   desc: "Access 2,500+ warehouse nodes across Canada & the US. Route inventory closer to your customers." },
  { Ico: Icon.Chart,     title: "Visibility & Control",       desc: "See performance clearly, uncover savings, and make better logistics decisions without adding headcount." },
];

const metrics = [
  { big: "70%",    label: "Off walk-in carrier prices", sub: "Pre-negotiated volume discounts passed directly to you" },
  { big: "1,000+", label: "Five-star reviews",          sub: "Rated #1 for ease of use by Canadian SMBs" },
  { big: "Growing", label: "3PL partner network",        sub: "A growing network of partner 3PLs across Canada and the US, giving you more fulfillment flexibility with every shipment." },
];

const compareRows = [
  { feature: "Carrier choice",      st: "Courier, LTL, and FTL with full flexibility",  fba: "Amazon logistics only" },
  { feature: "Rate optimization",   st: "Multi-carrier comparison",                  fba: "Rates set by the platform" },
  { feature: "Delivery experience", st: "Full control over branding & SLAs",         fba: "Platform-controlled" },
  { feature: "Platform lock-in",    st: "None. Ship from any channel",            fba: "Tied to Amazon ecosystem" },
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

        <a href={reportUrl("nav")} target="_blank" rel="noopener noreferrer" className="text-white text-sm font-semibold px-4 py-2 transition-colors hover:opacity-90 whitespace-nowrap" style={{ background: ds.orange, borderRadius: 9, ...sora }}>
          Free Report
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-5 pt-28 md:pt-36 pb-0 overflow-hidden" style={{ background: ds.white, minHeight: "100svh" }}>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 68%)" }} />

        {/* Eyebrow */}
        <p className="text-xs font-bold uppercase tracking-[0.14em] mb-4" style={{ color: ds.orange, ...sora }}>
          Get Your Free Logistics Performance Report
        </p>

        {/* Headline */}
        <h1 className="mb-5 max-w-[820px]" style={{ ...heading, fontSize: "clamp(2.2rem, 7vw, 4.8rem)" }}>
          Your Logistics.<br />
          <span style={{ color: "#FFB899" }}>Fully Optimized.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-[500px] mb-8 px-2" style={{ ...body, fontSize: "clamp(15px, 2.5vw, 17px)", lineHeight: 1.65 }}>
          Identify cost savings, delivery improvements, and fulfillment opportunities in under 2 minutes.{" "}
          <strong style={{ color: ds.navy, fontWeight: 600 }}>Confidential. No obligation.</strong>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 w-full max-w-sm sm:max-w-none">
          <a href={reportUrl("hero")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: ds.orange, borderRadius: 9, boxShadow: "0 4px 20px rgba(255,107,53,0.28)", ...sora }}>
            Start the 2-Minute Questionnaire →
          </a>
          <a href={meetingUrl("hero")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5" style={{ background: ds.white, border: `1.5px solid ${ds.border}`, borderRadius: 999, color: ds.navy, ...sora }}>
            Book a Meeting
          </a>
        </div>

        {/* 3-step how it works strip */}
        <div className="w-full max-w-2xl mb-10">
          <div className="grid grid-cols-3 gap-0" style={{ borderTop: `1px solid ${ds.border}` }}>
            {[
              { n: "1", label: "Fill out the questionnaire", sub: "2 minutes, confidential" },
              { n: "2", label: "Get your performance report", sub: "Personalised to your business" },
              { n: "3", label: "Optional 20-min expert review", sub: "With a ShipTime logistics expert" },
            ].map((step, i) => (
              <div key={step.n} className="flex flex-col items-center text-center px-3 pt-6 pb-2 gap-1.5" style={{ borderLeft: i > 0 ? `1px solid ${ds.border}` : undefined }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1" style={{ background: ds.orange, color: ds.white, ...sora }}>{step.n}</div>
                <span className="text-xs font-semibold leading-tight" style={{ color: ds.navy, ...sora }}>{step.label}</span>
                <span className="text-[11px]" style={{ color: ds.muted }}>{step.sub}</span>
              </div>
            ))}
          </div>
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

      {/* ── WHAT WE DO (BENTO) ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>What ShipTime Does</p>
            <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
              One platform. Everything logistics.
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>
              Technology, operations, and network execution in one managed solution, so your brand can grow confidently and without limitation.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">

            {/* 1 — Rate Shopping: wide left, dark bg */}
            <div
              className="md:col-span-7 relative overflow-hidden flex flex-col justify-between"
              style={{ background: ds.navy, borderRadius: 22, padding: "36px", minHeight: 260 }}
            >
              {/* Decorative rings */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full pointer-events-none" style={{ border: "1.5px solid rgba(255,107,53,0.15)" }} />
              <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full pointer-events-none" style={{ border: "1.5px solid rgba(255,107,53,0.25)" }} />
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: "rgba(255,107,53,0.15)", borderRadius: 10 }}>
                  <Icon.Lightning size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1.15rem", color: ds.white }}>Intelligent Rate Shopping</h3>
                <p style={{ ...body, fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 380 }}>
                  Automatically surface the best carrier option across your negotiated rates and ours. Every shipment, optimized in seconds.
                </p>
              </div>
              {/* Mock rate comparison widget */}
              <div className="mt-6 flex flex-col gap-2">
                {[
                  { carrier: "Canada Post", price: "$8.42", best: true },
                  { carrier: "Purolator",   price: "$9.18", best: false },
                  { carrier: "UPS",         price: "$11.05", best: false },
                ].map(r => (
                  <div key={r.carrier} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: r.best ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.05)", border: r.best ? `1px solid ${ds.orange}` : "1px solid rgba(255,255,255,0.08)" }}>
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
              style={{ background: ds.peach, borderRadius: 22, padding: "36px", minHeight: 260 }}
            >
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "rgba(255,107,53,0.08)" }} />
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: "rgba(255,107,53,0.15)", borderRadius: 10 }}>
                  <Icon.Layers size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1.15rem", color: ds.navy }}>Unified Logistics Platform</h3>
                <p style={{ ...body, fontSize: 14, color: ds.body, maxWidth: 300 }}>
                  One system for parcel, LTL, tracking, billing, and analytics. Replace your scattered tools with one control tower.
                </p>
              </div>
              {/* Module pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["Parcel", "LTL", "Tracking", "Billing", "Analytics"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 text-xs font-semibold rounded-full" style={{ background: "rgba(255,107,53,0.12)", color: ds.orange, ...sora }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* 3 — Fulfillment Optimization: narrow left, surface bg */}
            <div
              className="md:col-span-5 flex flex-col justify-between relative overflow-hidden"
              style={{ background: ds.surface, borderRadius: 22, padding: "36px", minHeight: 240 }}
            >
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: ds.peach, borderRadius: 10 }}>
                  <Icon.Map size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1.15rem", color: ds.navy }}>Fulfillment Optimization</h3>
                <p style={{ ...body, fontSize: 14, color: ds.body }}>
                  Access warehouse nodes across Canada and the US. Route inventory closer to your customers, cut last-mile costs.
                </p>
              </div>
              {/* Mini stat */}
              <div className="mt-6 flex items-end gap-3">
                <span style={{ ...heading, fontSize: "clamp(2rem, 4vw, 2.8rem)", color: ds.orange }}>2,500+</span>
                <span className="pb-1" style={{ ...body, fontSize: 13, color: ds.muted }}>warehouse nodes<br />across North America</span>
              </div>
            </div>

            {/* 4 — Visibility & Control: wide right, white bg with chart mockup */}
            <div
              className="md:col-span-7 flex flex-col justify-between relative overflow-hidden"
              style={{ background: ds.white, borderRadius: 22, padding: "36px", minHeight: 240, border: `1px solid ${ds.border}` }}
            >
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: ds.peach, borderRadius: 10 }}>
                  <Icon.Chart size={18} style={{ stroke: ds.orange }} />
                </div>
                <h3 className="mb-2" style={{ ...heading, fontSize: "1.15rem", color: ds.navy }}>Visibility & Control</h3>
                <p style={{ ...body, fontSize: 14, color: ds.body, maxWidth: 340 }}>
                  See performance clearly, uncover savings, and make better logistics decisions without adding headcount.
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
                      background: i === 11 ? ds.orange : i >= 8 ? "rgba(255,107,53,0.35)" : ds.border,
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
            {/* ShipTime emphasis cardsits behind, raised */}
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
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: ds.orange, ...sora }}>Two ways to get started</p>
            <h2 className="mb-3" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: ds.white }}>
              Walk away with at least one<br />actionable insight
            </h2>
            <p style={{ ...body, fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 440, margin: "0 auto" }}>
              Fill out the questionnaire or speak directly with a ShipTime logistics expert. Either way, you leave with a clearer picture of where to improve.
            </p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-5" style={{ background: ds.orange, borderRadius: 22, padding: "32px" }}>
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12 }}>
              <Icon.Clipboard size={18} style={{ stroke: "white" }} />
            </div>
            <h3 style={{ ...sora, fontWeight: 700, fontSize: "1.2rem", color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Get Your Free Logistics Performance Report</h3>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
              Answer 10 quick questions and identify cost savings, delivery improvements, and fulfillment opportunitiesin under 2 minutes.
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
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-5 md:px-10 py-10 md:py-14" style={{ background: ds.navy, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8" style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Logo + tagline + CTA */}
          <div className="flex flex-col gap-4">
            <Image src="/shiptime-logo.svg" alt="ShipTime" width={130} height={40} className="brightness-0 invert opacity-80 h-8 w-auto" />
            <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)", ...sora }}>Ship Smarter Today</p>
            <a href={reportUrl("footer")} target="_blank" rel="noopener noreferrer" className="w-fit text-sm font-semibold px-5 py-2.5 transition-all hover:opacity-90" style={{ background: ds.orange, color: ds.white, borderRadius: 9, ...sora }}>
              Get a Quote →
            </a>
          </div>

          {/* Address + phone */}
          <div className="flex flex-col gap-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            <p>700 Dorval Dr., Suite 700</p>
            <p>Oakville, ON L6K 3V3 Canada</p>
            <a href="tel:18777845744" className="mt-2 transition-colors hover:text-[#FF6B35]" style={{ color: "rgba(255,255,255,0.45)" }}>1-877-784-5744</a>
          </div>
        </div>
        <p className="mt-8 text-xs text-center md:text-left" style={{ color: "rgba(255,255,255,0.25)", maxWidth: 1240, margin: "32px auto 0" }}>© 2026 ShipTime Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
