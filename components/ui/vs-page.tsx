"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/ui/site-nav";
import { Reveal } from "@/components/ui/reveal";
import DashboardSection from "@/components/ui/feature-showcase";
import ShipTimeTimeline from "@/components/ui/shiptime-timeline";
import ShipTimeTestimonials from "@/components/ui/shiptime-testimonials";
import ShipTimeSceneDivider from "@/components/ui/shiptime-scene-divider";
import { Icon } from "@/components/ui/icons";
import type { Competitor } from "@/lib/competitors";

// ── Table icon cells ────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#EC5A26" />
      <path d="M5 9l2.5 2.5L13 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIconGray() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#E2E5ED" />
      <path d="M5 9l2.5 2.5L13 6" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#F3F4F6" />
      <path d="M6 6l6 6M12 6l-6 6" stroke="#CBD5E1" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const ds = {
  navy: "#1C1E3D",
  navyDeep: "#16182F",
  muted: "#6E728A",
  orange: "#EC5A26",
  orangeSoft: "#F0845B",
  lightBlue: "#E3EEFC",
  lightPink: "#FAF0EB",
  green: "#3FA864",
  red: "#D9534F",
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

const SIGNUP = "https://app.shiptime.com/";
const signupUrl = (content: string) =>
  `${SIGNUP}?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=signup&utm_content=${content}`;

// A photo panel that uses a generated image if present, else an on-brand
// gradient placeholder. The check happens client-side via the prop.
function PhotoPanel({ src, alt, rounded = 20 }: { src: string | null; alt: string; rounded?: number }) {
  if (src) {
    return (
      <div className="relative w-full overflow-hidden" style={{ borderRadius: rounded }}>
        <Image src={src} alt={alt} width={720} height={540} className="block w-full h-auto object-cover" />
      </div>
    );
  }
  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{
        borderRadius: rounded,
        aspectRatio: "4 / 3",
        background: "linear-gradient(135deg, #E3EEFC 0%, #FAF0EB 100%)",
        border: `1px solid ${ds.border}`,
      }}
    >
      <Icon.Package size={56} style={{ stroke: ds.orange, opacity: 0.5 }} />
    </div>
  );
}

function Chip({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{ background: ds.white, borderRadius: 12, boxShadow: "0 8px 24px rgba(28,30,61,0.14)", border: `1px solid ${ds.border}` }}
    >
      <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
        <Icon.Check size={12} style={{ stroke: "white" }} />
      </span>
      <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: ds.navy, ...sora }}>{label}</span>
    </div>
  );
}


// Interlocking chevron stats band (navy heading + colored arrow segments).
// Each segment uses clip-path so its pointed right edge nests into the next.
const STAT_CHEVRONS = [
  { big: "70%", label: "off walk-in carrier rates", bg: "#E3EEFC", fg: ds.navy },
  { big: "1,000+", label: "five-star customer reviews", bg: "#B6E04A", fg: ds.navy },
  { big: "1", label: "invoice across every carrier", bg: ds.orange, fg: ds.white },
  { big: "5 min", label: "to sign up and start shipping", bg: "#A9A2F2", fg: ds.navy },
];

// Right-pointing arrow notch. First segment is flat on the left, the rest are
// notched so they interlock; all but the last point on the right.
function chevronClip(first: boolean) {
  const notch = 28; // px depth of the arrow point
  const left = first ? "0" : `${notch}px`;
  return `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%, ${left} 50%)`;
}

function StatsChevrons() {
  return (
    <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.navy }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <h2 className="mb-10" style={{ ...heading, color: ds.white, fontSize: "clamp(1.5rem, 3.6vw, 2.2rem)", maxWidth: 720 }}>
          ShipTime turns every shipment into your best rate
        </h2>

        {/* Desktop: interlocking chevrons */}
        <div className="hidden md:flex" style={{ marginLeft: -10 }}>
          {STAT_CHEVRONS.map((s, i) => (
            <div
              key={s.big}
              className="flex flex-col justify-center"
              style={{
                background: s.bg,
                color: s.fg,
                flex: 1,
                minHeight: 168,
                padding: "0 28px 0 52px",
                marginLeft: i === 0 ? 0 : -24,
                clipPath: chevronClip(i === 0),
                zIndex: STAT_CHEVRONS.length - i,
              }}
            >
              <div style={{ ...heading, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: s.fg }}>{s.big}</div>
              <div className="mt-1" style={{ ...inter, fontSize: 13.5, color: s.fg, maxWidth: 150, lineHeight: 1.35 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile: stacked color blocks */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {STAT_CHEVRONS.map((s) => (
            <div key={s.big} className="flex flex-col justify-center" style={{ background: s.bg, color: s.fg, borderRadius: 14, padding: "20px 18px", minHeight: 120 }}>
              <div style={{ ...heading, fontSize: "1.9rem", color: s.fg }}>{s.big}</div>
              <div className="mt-1" style={{ ...inter, fontSize: 12.5, color: s.fg, lineHeight: 1.35 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a
            href={signupUrl("stats-band")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 transition-colors hover:opacity-90"
            style={{ background: ds.orange, borderRadius: 10, ...sora }}
          >
            Hear from our customers <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function VsPage({ data, images }: { data: Competitor; images: Record<string, string | null> }) {
  const vs = data.vs;
  const [active, setActive] = useState(0);
  const reason = vs.reasons[active];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body, color: ds.navy }}>
      <SiteNav ctaHref={signupUrl("nav")} />

      {/* ── NAVY HERO ── */}
      <section className="px-5 md:px-10 pt-28 pb-16 md:pt-36 md:pb-24" style={{ background: ds.navy }}>
        <div className="grid md:grid-cols-2 gap-12 items-center" style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.16em] px-3 py-1 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", ...sora }}>
              ShipTime vs {data.name}
            </span>
            <h1 className="mb-5" style={{ ...heading, color: ds.white, fontSize: "clamp(2.2rem, 5.5vw, 3.4rem)" }}>
              {vs.headline || `Choose ShipTime over ${data.name}`}
            </h1>
            <p className="mb-8" style={{ ...body, color: "rgba(255,255,255,0.72)", fontSize: 17, maxWidth: 460 }}>
              {vs.subhead || data.subhead}
            </p>
            <a
              href={signupUrl("hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white text-sm font-semibold px-7 py-3.5 transition-colors hover:opacity-90"
              style={{ background: ds.orange, borderRadius: 999, ...sora }}
            >
              Get started free
            </a>
          </div>
          {/* Hero photo with floating accent badges */}
          <div className="relative">
            <PhotoPanel src={images["vs-hero"]} alt={`Choose ShipTime over ${data.name}`} />
            <div className="absolute -top-4 -right-2 flex gap-2">
              <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: ds.orange, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
                <Icon.Tag size={18} style={{ stroke: "white" }} />
              </span>
              <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: ds.green, boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
                <Icon.Check size={18} style={{ stroke: "white" }} />
              </span>
            </div>
            <div className="absolute -bottom-4 right-8">
              <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#F0C04B", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>
                <Icon.Dollar size={20} style={{ stroke: ds.navy }} />
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* ── ANSWER-FIRST AEO PARAGRAPH ── */}
      {vs.answerFirst && (
        <section className="px-5 md:px-10 py-10 md:py-14" style={{ background: ds.surface }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ ...body, fontSize: 17, color: ds.navy, lineHeight: 1.75 }}>{vs.answerFirst}</p>
          </div>
        </section>
      )}

      {/* ── WHY TEAMS PREFER (tabbed reasons) ── */}
      <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <h2 className="text-center mb-10" style={{ ...heading, color: ds.navy, fontSize: "clamp(1.7rem, 4vw, 2.4rem)" }}>
            Why teams prefer ShipTime over {data.name}
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {vs.reasons.map((r, i) => (
              <button
                key={r.tab}
                onClick={() => setActive(i)}
                className="px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{
                  ...sora,
                  borderRadius: 999,
                  background: i === active ? ds.navy : ds.surface,
                  color: i === active ? ds.white : ds.muted,
                  border: `1px solid ${i === active ? ds.navy : ds.border}`,
                }}
              >
                {r.tab}
              </button>
            ))}
          </div>

          {/* Active reason: copy + mini table left, photo + chips right (alternating) */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className={active % 2 === 1 ? "md:order-2" : ""}>
              <h3 className="mb-4" style={{ ...heading, color: ds.navy, fontSize: "clamp(1.4rem, 3.2vw, 2rem)" }}>{reason.title}</h3>
              <p className="mb-7" style={{ ...body, color: ds.muted, fontSize: 16 }}>{reason.body}</p>

              <div style={{ borderRadius: 14, border: `1px solid ${ds.border}`, overflow: "hidden" }}>
                <div className="grid items-center px-4 py-2.5" style={{ gridTemplateColumns: "1fr auto auto", gap: 24, background: ds.surface, borderBottom: `1px solid ${ds.border}` }}>
                  <span />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: ds.orange, ...sora, width: 60 }}>ShipTime</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: ds.muted, ...sora, width: 60 }}>{data.name}</span>
                </div>
                {reason.mini.map((m) => (
                  <div key={m.feature} className="grid items-center px-4 py-3" style={{ gridTemplateColumns: "1fr auto auto", gap: 24, borderTop: `1px solid ${ds.border}` }}>
                    <span className="text-[13.5px] font-medium" style={{ color: ds.navy, ...inter }}>{m.feature}</span>
                    <span className="flex justify-center" style={{ width: 60 }}>{m.shiptime ? <CheckIcon /> : <CrossIcon />}</span>
                    <span className="flex justify-center" style={{ width: 60 }}>
                      {m.competitor === "basic" ? <span className="text-[12px] font-medium" style={{ color: ds.muted, fontFamily: "var(--font-inter),sans-serif" }}>Basic</span> : m.competitor ? <CheckIconGray /> : <CrossIcon />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative ${active % 2 === 1 ? "md:order-1" : ""}`}>
              <PhotoPanel src={images[reason.image]} alt={reason.title} />
              <div className="absolute -left-3 top-6">
                <Chip label={reason.chips[0]} accent={ds.orange} />
              </div>
              {reason.chips[1] && (
                <div className="absolute -right-3 bottom-8">
                  <Chip label={reason.chips[1]} accent={ds.green} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.surface }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <h2 className="mb-3" style={{ ...heading, color: ds.navy, fontSize: "clamp(1.5rem, 3.6vw, 2.2rem)" }}>
              {data.name} vs ShipTime
            </h2>
            <p className="mx-auto" style={{ ...body, color: ds.muted, fontSize: 15, maxWidth: 420 }}>
              {vs.savings} No platform fee, ever.
            </p>
          </div>

          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${ds.border}`, background: ds.white, boxShadow: "0 2px 20px rgba(28,30,61,0.06)" }}>
            {/* Header */}
            <div className="grid" style={{ gridTemplateColumns: "1fr 140px 140px", background: ds.surface, borderBottom: `1px solid ${ds.border}` }}>
              <div className="px-6 py-4" />
              <div className="py-4 flex flex-col items-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full" style={{ background: ds.orange, color: ds.white, ...sora }}>ShipTime</span>
                <span className="text-[10px] font-semibold" style={{ color: ds.orange, ...inter }}>Free forever</span>
              </div>
              <div className="py-4 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
                {data.logo ? (
                  <Image src={data.logo} alt={data.name} width={100} height={24} className="h-4 w-auto object-contain" style={{ maxWidth: 88, opacity: 0.65 }} />
                ) : (
                  <span className="text-[11px] font-semibold" style={{ color: ds.muted, ...sora }}>{data.name}</span>
                )}
                <span className="text-[10px]" style={{ color: ds.muted, ...inter }}>{vs.competitorPricing}</span>
              </div>
            </div>

            {/* Rows */}
            {data.rows.map((row, i) => {
              const noSet = new Set(["no", "not supported", "no."]);
              const yesSet = new Set(["yes", "yes.", "none"]);
              const compVal = row.competitor.toLowerCase().trim();
              const shipVal = row.shiptime.toLowerCase().trim();
              const shipWin = !!row.shiptimeWin || yesSet.has(shipVal);
              const compWin = !!row.competitorWin || yesSet.has(compVal);
              const compNo = noSet.has(compVal);
              const shipText = !yesSet.has(shipVal) && !noSet.has(shipVal) ? row.shiptime : null;
              const compText = !yesSet.has(compVal) && !noSet.has(compVal) ? row.competitor : null;

              return (
                <div
                  key={row.feature}
                  className="grid items-center"
                  style={{ gridTemplateColumns: "1fr 140px 140px", borderTop: `1px solid ${ds.border}`, background: i % 2 === 0 ? ds.white : ds.surface }}
                >
                  <div className="px-6 py-3.5">
                    <span style={{ ...inter, fontSize: 13.5, color: ds.navy, fontWeight: 500 }}>{row.feature}</span>
                  </div>
                  <div className="py-3.5 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
                    {shipWin ? <CheckIcon /> : <CrossIcon />}
                    {shipText && <span style={{ ...inter, fontSize: 11, color: ds.orange, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{shipText}</span>}
                  </div>
                  <div className="py-3.5 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
                    {compNo ? <CrossIcon /> : compWin ? <CheckIconGray /> : <CrossIcon />}
                    {compText && <span style={{ ...inter, fontSize: 11, color: ds.muted, fontWeight: 500, textAlign: "center", lineHeight: 1.3 }}>{compText}</span>}
                  </div>
                </div>
              );
            })}

            {/* Footer CTA */}
            <div className="grid items-center" style={{ gridTemplateColumns: "1fr 140px 140px", borderTop: `1px solid ${ds.border}`, background: ds.surface }}>
              <div className="px-6 py-4">
                <span style={{ ...sora, fontSize: 13, fontWeight: 700, color: ds.navy }}>Ready to switch?</span>
              </div>
              <div className="py-4 flex justify-center" style={{ borderLeft: `1px solid ${ds.border}` }}>
                <a href={signupUrl("compare-table")} target="_blank" rel="noopener noreferrer" className="text-white text-[12px] font-semibold px-4 py-2 transition-opacity hover:opacity-90 whitespace-nowrap" style={{ background: ds.orange, borderRadius: 999, ...sora }}>
                  Start free
                </a>
              </div>
              <div className="py-4" style={{ borderLeft: `1px solid ${ds.border}` }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS CHEVRONS ── */}
      <StatsChevrons />

      {/* ── LIVE FEATURE SHOWCASE (tabbed Remotion players) ── */}
      <DashboardSection />

      {/* ── ONBOARDING TIMELINE ── */}
      <ShipTimeTimeline background={ds.white} />

      {/* ── TESTIMONIALS ── */}
      <ShipTimeTestimonials />

      {/* ── WHO SHOULD CHOOSE ── */}
      {vs.whoShouldChoose && (
        <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.white }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 className="text-center mb-10" style={{ ...heading, color: ds.navy, fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}>
              Which platform is right for you?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8" style={{ borderRadius: 20, background: ds.lightBlue, border: `1.5px solid ${ds.orange}` }}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>ShipTime</p>
                <h3 className="mb-4" style={{ ...heading, color: ds.navy, fontSize: "1.25rem" }}>{vs.whoShouldChoose.shiptime.title}</h3>
                <p style={{ ...body, fontSize: 15, color: ds.navy }}>{vs.whoShouldChoose.shiptime.body}</p>
                <div className="mt-6">
                  <a
                    href={signupUrl("who-should-choose")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 transition-all hover:opacity-90"
                    style={{ background: ds.orange, borderRadius: 999, ...sora }}
                  >
                    Start free
                  </a>
                </div>
              </div>
              <div className="p-8" style={{ borderRadius: 20, background: ds.surface, border: `1px solid ${ds.border}` }}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.muted, ...sora }}>{data.name}</p>
                <h3 className="mb-4" style={{ ...heading, color: ds.navy, fontSize: "1.25rem" }}>{vs.whoShouldChoose.competitor.title}</h3>
                <p style={{ ...body, fontSize: 15, color: ds.muted }}>{vs.whoShouldChoose.competitor.body}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {data.faq && data.faq.length > 0 && (
        <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.surface }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>FAQ</p>
            <h2 className="mb-10" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}>
              ShipTime vs {data.name}: common questions
            </h2>
            <div className="flex flex-col" style={{ border: `1px solid ${ds.border}`, borderRadius: 16, overflow: "hidden", background: ds.white }}>
              {data.faq.map((item, i) => (
                <div key={i} style={{ borderTop: i > 0 ? `1px solid ${ds.border}` : undefined, padding: "20px 24px" }}>
                  <p className="mb-2" style={{ ...sora, fontWeight: 700, fontSize: 15, color: ds.navy }}>{item.q}</p>
                  <p style={{ ...body, fontSize: 14, color: ds.muted }}>{item.a}</p>
                </div>
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: data.faq.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: { "@type": "Answer", text: item.a },
                  })),
                }),
              }}
            />
          </div>
        </section>
      )}

      {/* ── SCENE DIVIDER (stats + illustration) ── */}
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
              { title: "Compare", links: [["All comparisons", "/vs"], ["Freightcom", "/vs/freightcom"], ["ShipStation", "/vs/shipstation"], ["Stallion Express", "/vs/stallion-express"]] },
              { title: "Alternatives", links: [["All alternatives", "/alternative"], ["ShipStation alternative", "/alternative/shipstation"], ["Freightcom alternative", "/alternative/freightcom"]] },
              { title: "Company", links: [["Home", "/"], ["Sign up free", signupUrl("footer")]] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)", ...sora }}>{col.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith("/") ? (
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
