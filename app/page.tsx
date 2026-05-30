import type React from "react";
import Image from "next/image";
import ShipTimeWhySection from "@/components/ui/shiptime-why-section";
import ShipTimeGlobeSection from "@/components/ui/shiptime-globe-section";
import ShipTimeHeroChat from "@/components/ui/shiptime-hero-chat";
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3.5" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E8E8E8" }}>
        <a href="#">
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={160} height={50} className="h-10 w-auto" priority />
        </a>

        <a href={reportUrl("nav")} target="_blank" rel="noopener noreferrer" className="text-white text-sm font-semibold px-5 py-2 transition-colors hover:opacity-90 whitespace-nowrap" style={{ background: ds.orange, borderRadius: 999, ...sora }}>
          Free Report
        </a>
      </nav>

      {/* ── HERO ── */}
      <ShipTimeHeroChat />

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

      {/* ── COMPARE. SHIP. GROW. ── */}
      <section className="px-5 md:px-10 py-20 md:py-24" style={{ background: ds.surfaceAlt }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-4" style={{ color: ds.orange, ...sora }}>Compare. Ship. Grow.</p>
          <h2 className="mb-10 md:mb-14" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
            Trusted by thousands of businesses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { Ico: Icon.Search,    title: "Compare", desc: "Every carrier's rates and transit times, one screen. Pick the best option in seconds." },
              { Ico: Icon.Package,   title: "Ship",    desc: "Automate labels, schedule pickups, track every package. One dashboard for your entire operation." },
              { Ico: Icon.Lightning, title: "Grow",    desc: "Unified billing, analytics, and freight. The platform scales as you do." },
            ].map(p => (
              <div key={p.title} style={card}>
                <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: ds.lightBlue, borderRadius: 12 }}>
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

      {/* ── TESTIMONIAL ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.navy }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div className="text-5xl mb-6 leading-none" style={{ color: ds.orange, fontFamily: "Georgia, serif" }}>"</div>
          <blockquote
            className="mb-8"
            style={{ ...heading, fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: ds.white, fontWeight: 700, lineHeight: 1.3 }}
          >
            I Was Spending 90 Minutes a Day on Shipping. Four Tools. Now It&apos;s One.
          </blockquote>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.8)", ...sora }}>ShipTime Customer</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Canadian eCommerce business</span>
          </div>
        </div>
      </section>

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

      {/* ── SAMPLE RATES ── */}
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
      <section id="compare" className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.white }}>
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
                boxShadow: "0 12px 40px rgba(28,30,61,0.10), 0 2px 8px rgba(28,30,61,0.06)",
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
            <h2 className="mb-3" style={{ ...heading, fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", color: ds.white }}>
              Your Shipping Shouldn&apos;t Be<br />This Complicated.
            </h2>
            <p style={{ ...body, fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 440, margin: "0 auto" }}>
              Most businesses are up and running in under five minutes.
            </p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-5" style={{ background: ds.orange, borderRadius: 24, padding: "32px" }}>
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12 }}>
              <Icon.Clipboard size={18} style={{ stroke: "white" }} />
            </div>
            <h3 style={{ ...sora, fontWeight: 700, fontSize: "1.2rem", color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Get Your Free Logistics Performance Report</h3>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
              Answer 10 quick questions and identify cost savings, delivery improvements, and fulfillment opportunities in under 2 minutes.
            </p>
            <a href={reportUrl("dual-cta")} target="_blank" rel="noopener noreferrer" className="w-fit inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-all hover:opacity-90" style={{ background: ds.white, color: ds.navy, borderRadius: 999, ...sora }}>
              Start the Free Assessment →
            </a>
          </div>
          <div id="book-meeting" className="flex flex-col gap-5" style={{ background: "rgba(255,255,255,0.06)", borderRadius: 24, padding: "32px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12 }}>
              <Icon.Calendar size={18} style={{ stroke: "white" }} />
            </div>
            <h3 style={{ ...sora, fontWeight: 700, fontSize: "1.2rem", color: "white", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Talk to a ShipTime Logistics Expert</h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
              Skip the form and get straight to the conversation. Book a 20-minute call to discuss your current setup and where we can drive the most impact.
            </p>
            <a href={meetingUrl("dual-cta")} target="_blank" rel="noopener noreferrer" className="w-fit inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 transition-all hover:bg-white/10" style={{ color: "white", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.3)", ...sora }}>
              Book a Meeting →
            </a>
          </div>
        </div>
        </div>
      </section>

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
