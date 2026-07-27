import type React from "react";
import { existsSync } from "node:fs";
import { join } from "node:path";
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

// Server-side check (runs at build/prerender time): does a generated PNG exist
// in public/generated/? Lets the hero use an AI image when present and fall back
// to the CSS mock when not, so the page works before any key is set.
function generatedImage(basename?: string): string | null {
  if (!basename) return null;
  const rel = `generated/${basename}.png`;
  return existsSync(join(process.cwd(), "public", rel)) ? `/${rel}` : null;
}

const ds = {
  navy: "#1C1E3D",
  muted: "#52566C",
  orange: "#EC5A26",
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

export default function AlternativePage({ data }: { data: Competitor }) {
  const alt = data.alternative;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: ds.white, ...body }}>
      <SiteNav leadCapture ctaLabel="Get in touch" />

      {/* ── HERO ── */}
      <LandingHero
        photo={generatedImage("alt-hero")}
        eyebrow={`${data.name} Alternative`}
        headline={
          <>
            The Best{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300, color: "#8B90A8" }}>{data.name}</em>{" "}
            Alternative.
          </>
        }
        subhead={
          <>
            ShipTime brings <strong style={{ color: ds.navy, fontWeight: 600 }}>every carrier, one screen</strong> — compare rates, print labels, manage freight, and track every package from one platform.
          </>
        }
        ctaSource="alt-hero"
      />

      {/* ── WHY TEAMS SWITCH ── */}
      {alt.whyTeamsSwitch && <WhyTeamsSwitch data={alt.whyTeamsSwitch} />}

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

      {/* ── LIVE FEATURE SHOWCASE ── */}
      <DashboardSection />

      {/* ── ONBOARDING TIMELINE ── */}
      <ShipTimeTimeline background={ds.surface} />

      {/* ── FEATURE DEEP-DIVES ── */}
      <FeatureDeepDives
        features={alt.features}
        title={`${data.name} Alternative`}
        subtitle="Here is why teams switch to ShipTime."
      />

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
                <p style={{ ...body, color: "rgba(255,255,255,0.82)", fontSize: 16, lineHeight: 1.8 }}>
                  {alt.switchingGuide}
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  {["Register in under a minute and start shipping right away — no integration required", "Add your own carrier rates or connect a store in about 15 minutes", "Compare every rate and start saving from your first label"].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ background: ds.orange, color: ds.white, ...sora }}>
                        {i + 1}
                      </span>
                      <span style={{ ...inter, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-5 px-8 py-10" style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", minWidth: 240 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: ds.orange }}>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path d="M13 3v14M7 11l6 6 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 20h18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg mb-1" style={{ color: ds.white, ...sora }}>Free forever</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)", ...inter }}>No platform fee. No contract.</p>
                </div>
                <LeadCaptureButton
                  source="switching-guide"
                  className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 transition-all hover:opacity-90"
                  style={{ background: ds.orange, borderRadius: 999, fontSize: 14, boxShadow: "0 4px 20px rgba(236,90,38,0.4)", ...sora }}
                >
                  Get in touch
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </LeadCaptureButton>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)", ...inter }}>No credit card required</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <LandingFaq faq={data.faq} title="Common questions" subtitle={`Answers about switching from ${data.name} to ShipTime`} />

      {/* ── SCENE DIVIDER ── */}
      <ShipTimeSceneDivider />

      {/* ── FOOTER ── */}
      <SiteFooter />
    </div>
  );
}

// ── Rich multi-column footer (shared shape across the landing pages) ──
function SiteFooter() {
  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Platform",
      links: [
        { label: "Rate shopping", href: "lead:footer" },
        { label: "Courier & LTL", href: "lead:footer" },
        { label: "Bring your own rates", href: "lead:footer" },
        { label: "Tracking & analytics", href: "lead:footer" },
      ],
    },
    {
      title: "Compare",
      links: [
        { label: "All alternatives", href: "/alternative" },
        { label: "Freightcom alternative", href: "/alternative/freightcom" },
        { label: "ShipStation alternative", href: "/alternative/shipstation" },
        { label: "eShipper alternative", href: "/alternative/eshipper" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Home", href: "/" },
        { label: "Get in touch", href: "lead:footer" },
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
                    {l.href.startsWith("lead:") ? (
                      <LeadCaptureButton source={l.href.slice(5)} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)", ...inter }}>
                        {l.label}
                      </LeadCaptureButton>
                    ) : (
                      <Link href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.6)", ...inter }}>
                        {l.label}
                      </Link>
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
