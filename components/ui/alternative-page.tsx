import type React from "react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/ui/site-nav";
import AlternativeHero from "@/components/ui/alternative-hero";
import { FeatureMock } from "@/components/ui/product-mocks";
import DashboardSection from "@/components/ui/feature-showcase";
import ShipTimeTimeline from "@/components/ui/shiptime-timeline";
import ShipTimeTestimonials from "@/components/ui/shiptime-testimonials";
import ShipTimeSceneDivider from "@/components/ui/shiptime-scene-divider";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icons";
import type { Competitor } from "@/lib/competitors";

// Server-side check (runs at build/prerender time): does a generated PNG exist
// in public/generated/? Lets feature blocks use AI images when present and fall
// back to the CSS mock when they are not, so the page works before any key is set.
function generatedImage(basename?: string): string | null {
  if (!basename) return null;
  const rel = `generated/${basename}.png`;
  return existsSync(join(process.cwd(), "public", rel)) ? `/${rel}` : null;
}

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  lightBlue: "#E3EEFC",
  lightPink: "#FAF0EB",
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

const body: React.CSSProperties = {
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  color: ds.muted,
  lineHeight: 1.6,
};

const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const YEAR = 2026;

// Original on-brand illustration for the closing CTA — two hands meeting over a
// parcel (a "handoff", echoing "leave the shipping to us"). Pure SVG, no assets.
function CtaIllustration() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" aria-hidden>
      {/* soft glow */}
      <circle cx="80" cy="70" r="58" fill="#EC5A26" opacity="0.12" />
      {/* parcel */}
      <rect x="56" y="50" width="48" height="40" rx="6" fill="#EC5A26" />
      <path d="M80 50v40" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
      <path d="M56 64h48" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
      {/* left arm/hand */}
      <rect x="14" y="92" width="46" height="14" rx="7" fill="#E3EEFC" />
      <circle cx="58" cy="99" r="10" fill="#E3EEFC" />
      {/* right arm/hand */}
      <rect x="100" y="92" width="46" height="14" rx="7" fill="#F0845B" />
      <circle cx="102" cy="99" r="10" fill="#F0845B" />
      {/* spark lines above the box */}
      <path d="M80 30v10M64 36l5 7M96 36l-5 7" stroke="#F0845B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const SIGNUP = "https://app.shiptime.com/";
const signupUrl = (content: string) =>
  `${SIGNUP}?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=signup&utm_content=${content}`;

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75;
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <svg key={i} width={22} height={22} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor={ds.orange} />
                <stop offset="50%" stopColor={ds.border} />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? ds.orange : isHalf ? `url(#half-${i})` : ds.border}
            />
          </svg>
        );
      })}
    </div>
  );
}

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

// A floating pill chip (icon tile + label) that overlaps the hero photo.
function PillChip({ label, accent = ds.lightBlue }: { label: string; accent?: string }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 pl-2.5 pr-4 py-2.5"
      style={{ background: ds.white, borderRadius: 14, boxShadow: "0 10px 30px rgba(28,30,61,0.16)", border: `1px solid ${ds.border}` }}
    >
      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
        <Icon.Check size={15} style={{ stroke: ds.navy }} />
      </span>
      <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: ds.navy, ...sora }}>{label}</span>
    </div>
  );
}

// Hero visual: classic "photo on the right" with floating UI chips + a stacked
// notifications card, recreating the reference composition in ShipTime's brand.
// Uses a generated photo (public/generated/alt-hero.png) with a gradient fallback.
function HeroVisual({ photo }: { photo: string | null }) {
  return (
    <div className="relative" style={{ paddingTop: 8, paddingBottom: 8 }}>
      {/* The photo */}
      <div className="relative overflow-hidden mx-auto" style={{ borderRadius: 22, maxWidth: 380, boxShadow: "0 20px 60px rgba(28,30,61,0.16)" }}>
        {photo ? (
          <Image src={photo} alt="Ship smarter with ShipTime" width={760} height={950} className="block w-full h-auto object-cover" priority />
        ) : (
          <div className="flex items-center justify-center" style={{ aspectRatio: "4 / 5", background: "linear-gradient(135deg, #E3EEFC 0%, #FAF0EB 100%)" }}>
            <Icon.Package size={64} style={{ stroke: ds.orange, opacity: 0.45 }} />
          </div>
        )}
      </div>

      {/* Top-right pill */}
      <div className="absolute" style={{ top: 24, right: -8 }}>
        <PillChip label="Best rate found" accent={ds.lightBlue} />
      </div>

      {/* Mid-right stacked notifications card */}
      <div className="absolute" style={{ top: "40%", right: -20, width: 230 }}>
        <div className="p-3" style={{ background: ds.white, borderRadius: 16, boxShadow: "0 16px 44px rgba(28,30,61,0.18)", border: `1px solid ${ds.border}` }}>
          {[
            { c: ds.orange, w: 78, hl: false },
            { c: ds.lightBlue, w: 64, hl: true },
            { c: "#D7E9D4", w: 72, hl: false },
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl"
              style={{ background: row.hl ? ds.surface : "transparent", border: row.hl ? `1px solid ${ds.border}` : "1px solid transparent" }}
            >
              <span className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: row.c }} />
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="h-2 rounded-full" style={{ background: ds.border, width: `${row.w}%` }} />
                <span className="h-2 rounded-full" style={{ background: "#EFF1F4", width: `${row.w - 22}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom pill */}
      <div className="absolute" style={{ bottom: 28, left: 0 }}>
        <PillChip label="Canada Post ready" accent="#FAF0EB" />
      </div>
    </div>
  );
}

// ── Comparison table ──────────────────────────────────────────────────────────
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

function CompareTable({
  rows,
  competitorName,
  competitorPrice,
  competitorLogo,
}: {
  rows: Competitor["rows"];
  competitorName: string;
  competitorPrice: string;
  competitorLogo?: string;
}) {
  const noSet = new Set(["no", "not supported", "none", "no."]);
  const yesSet = new Set(["yes", "yes.", "none"]);

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${ds.border}`, background: ds.white, boxShadow: "0 2px 20px rgba(28,30,61,0.06)" }}>
      {/* Header */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 140px 140px", background: ds.surface, borderBottom: `1px solid ${ds.border}` }}>
        <div className="px-6 py-4" />
        {/* ShipTime */}
        <div className="py-4 flex flex-col items-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full" style={{ background: ds.orange, color: ds.white, ...sora }}>ShipTime</span>
          <span className="text-[10px]" style={{ color: ds.orange, ...inter, fontWeight: 600 }}>Free forever</span>
        </div>
        {/* Competitor */}
        <div className="py-4 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
          {competitorLogo ? (
            <Image src={competitorLogo} alt={competitorName} width={100} height={24} className="h-4 w-auto object-contain" style={{ maxWidth: 88, opacity: 0.65 }} />
          ) : (
            <span className="text-[11px] font-semibold" style={{ color: ds.muted, ...sora }}>{competitorName}</span>
          )}
          <span className="text-[10px]" style={{ color: ds.muted, ...inter }}>{competitorPrice}</span>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => {
        const compVal = row.competitor.toLowerCase().trim();
        const shipVal = row.shiptime.toLowerCase().trim();
        // ShipTime wins = orange check; competitor win = grey check; no = cross; text = short label
        const shipWin = !!row.shiptimeWin || yesSet.has(shipVal);
        const compWin = !!row.competitorWin || yesSet.has(compVal);
        const compNo = noSet.has(compVal);
        // Short qualifier text (only when not a plain yes/no)
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
            {/* ShipTime cell */}
            <div className="py-3.5 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
              {shipWin ? <CheckIcon /> : <CrossIcon />}
              {shipText && <span style={{ ...inter, fontSize: 11, color: ds.orange, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{shipText}</span>}
            </div>
            {/* Competitor cell */}
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
          <a
            href="https://app.shiptime.com/?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=compare-table"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-[12px] font-semibold px-4 py-2 transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ background: ds.orange, borderRadius: 999, ...sora }}
          >
            Start free
          </a>
        </div>
        <div className="py-4" style={{ borderLeft: `1px solid ${ds.border}` }} />
      </div>
    </div>
  );
}

export default function AlternativePage({ data }: { data: Competitor }) {
  const alt = data.alternative;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>
      <SiteNav ctaHref={signupUrl("nav")} />

      {/* ── HERO ── */}
      <AlternativeHero competitorName={data.name} photo={generatedImage("alt-hero")} />

      {/* ── WHY TEAMS SWITCH ── */}
      {alt.whyTeamsSwitch && (
        <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.navy }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            {/* Header */}
            <div className="mb-14 md:mb-16" style={{ maxWidth: 600 }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: ds.orange, ...sora }}>
                Why teams switch
              </p>
              <h2 className="mb-5" style={{ ...heading, color: ds.white, fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)" }}>
                Here&rsquo;s what changes
              </h2>
              <p style={{ ...body, color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.7 }}>
                {alt.whyTeamsSwitch.opener}
              </p>
            </div>

            {/* Before → After cards */}
            <div className="flex flex-col gap-4">
              {alt.whyTeamsSwitch.bullets.map((b, i) => (
                <div
                  key={i}
                  className="grid md:grid-cols-[1fr_40px_1fr] gap-0 overflow-hidden"
                  style={{ borderRadius: 16 }}
                >
                  {/* Before */}
                  <div
                    className="px-6 py-5 flex items-start gap-3"
                    style={{ background: "rgba(255,255,255,0.11)", border: "1px solid rgba(255,255,255,0.18)" }}
                  >
                    <span
                      className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.85)", ...sora }}
                    >
                      Before
                    </span>
                    <span style={{ ...inter, fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>{b.before}</span>
                  </div>

                  {/* Arrow divider */}
                  <div className="hidden md:flex items-center justify-center" style={{ background: ds.navy }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10h12M12 6l4 4-4 4" stroke={ds.orange} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* After */}
                  <div
                    className="px-6 py-5 flex items-start gap-3"
                    style={{ background: "rgba(236,90,38,0.18)", border: "1px solid rgba(236,90,38,0.35)", borderLeft: "none" }}
                  >
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: ds.orange }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span style={{ ...inter, fontSize: 14, color: "#FFFFFF", lineHeight: 1.6 }}>{b.after}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12">
              <a
                href={signupUrl("why-switch")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-white text-sm font-semibold px-7 py-3.5 transition-all hover:opacity-90"
                style={{ background: ds.orange, borderRadius: 999, boxShadow: "0 4px 20px rgba(236,90,38,0.35)", ...sora }}
              >
                Start for free
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── COMPARISON TABLE ── */}
      <section className="px-5 md:px-10 py-16 md:py-20" style={{ background: ds.white }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <h2 className="mb-3" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}>
              {data.name} vs ShipTime
            </h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 420, fontSize: 15, color: ds.muted }}>
              Everything you need. Nothing you don&rsquo;t pay for.
            </p>
          </div>

          <CompareTable rows={data.rows} competitorName={data.name} competitorPrice={alt.competitorPrice} competitorLogo={data.logo} />
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <ShipTimeTestimonials />

      {/* ── LIVE FEATURE SHOWCASE (tabbed Remotion players) ── */}
      <DashboardSection />

      {/* ── ONBOARDING TIMELINE ── */}
      <ShipTimeTimeline background={ds.surface} />

      {/* ── FEATURE DEEP-DIVES ── */}
      <section className="px-5 md:px-10 py-16 md:py-24" style={{ background: ds.white }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div className="text-center mb-14">
            <h2 className="mb-3" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}>{data.name} Alternative</h2>
            <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>
              Here is why teams switch to ShipTime.
            </p>
          </div>
          <div className="flex flex-col gap-16 md:gap-24">
            {alt.features.map((f, i) => (
              <Reveal key={f.title} className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>{f.eyebrow}</p>
                  <h3 className="mb-5" style={{ ...heading, fontSize: "clamp(1.3rem, 3vw, 1.7rem)" }}>{f.title}</h3>
                  <ul className="flex flex-col gap-3">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <Icon.Check size={18} style={{ stroke: ds.orange, marginTop: 2, flexShrink: 0 }} />
                        <span style={{ ...body, fontSize: 15, color: ds.navy }}>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <FeatureMock image={f.image} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SWITCHING GUIDE ── */}
      {alt.switchingGuide && (
        <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.navy }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: ds.orange, ...sora }}>
                  How to switch
                </p>
                <h2 className="mb-5" style={{ ...heading, color: ds.white, fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
                  Ready when you are
                </h2>
                <p style={{ ...body, color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.8 }}>
                  {alt.switchingGuide}
                </p>
                {/* step list */}
                <div className="mt-8 flex flex-col gap-3">
                  {["Register your free account in under a minute", "Connect your carrier rates and compare with our discounted rates", "Start comparing rates and saving immediately"].map((step, i) => (
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
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: ds.orange }}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path d="M13 3v14M7 11l6 6 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 20h18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg mb-1" style={{ color: ds.white, ...sora }}>Free forever</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)", ...inter }}>No platform fee. No contract.</p>
                </div>
                <a
                  href={signupUrl("switching-guide")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 transition-all hover:opacity-90"
                  style={{ background: ds.orange, borderRadius: 999, fontSize: 14, boxShadow: "0 4px 20px rgba(236,90,38,0.4)", ...sora }}
                >
                  Start for free
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)", ...inter }}>No credit card required</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {data.faq && data.faq.length > 0 && (
        <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.surface }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            {/* Centered header */}
            <div className="text-center mb-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: ds.orange, ...sora }}>FAQ</p>
              <h2 style={{ ...heading, fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
                Common questions
              </h2>
              <p className="mt-3 mx-auto" style={{ ...body, fontSize: 15, color: ds.muted, maxWidth: 420 }}>
                Answers about switching from {data.name} to ShipTime
              </p>
            </div>

            {/* FAQ cards */}
            <div className="flex flex-col gap-3">
              {data.faq.map((item, i) => (
                <div
                  key={i}
                  className="px-7 py-6"
                  style={{
                    background: ds.white,
                    borderRadius: 14,
                    border: `1px solid ${ds.border}`,
                    boxShadow: "0 2px 12px rgba(28,30,61,0.04)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                      style={{ background: "#EEF5FF", color: ds.navy, ...sora }}
                    >
                      Q
                    </span>
                    <div>
                      <p className="mb-2.5" style={{ ...sora, fontWeight: 700, fontSize: 15, color: ds.navy }}>{item.q}</p>
                      <p style={{ ...inter, fontSize: 14, color: ds.muted, lineHeight: 1.7 }}>{item.a}</p>
                    </div>
                  </div>
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
      <SiteFooter />
    </div>
  );
}

// ── Rich multi-column footer (shared shape across the alternative pages) ──
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
        { label: "All alternatives", href: "/alternative" },
        { label: "Freightcom alternative", href: "/alternative/freightcom" },
        { label: "ShipStation alternative", href: "/alternative/shipstation" },
        { label: "Stallion Express alternative", href: "/alternative/stallion-express" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Home", href: "/" },
        { label: "Sign up free", href: signupUrl("footer") },
        { label: "Ship smarter", href: signupUrl("footer") },
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
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ ...body, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            © {YEAR} ShipTime. Ship Smarter Today.
          </p>
        </div>
      </div>
    </footer>
  );
}
