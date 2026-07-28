import type React from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icons";
import { FeatureMock } from "@/components/ui/product-mocks";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";
import type { Competitor } from "@/lib/competitors";

const ds = {
  navy: "#1C1E3D",
  muted: "#52566C",
  orange: "#EC5A26",
  red: "#D9534F",
  redSoft: "#FBE3E0",
  highlight: "#FFF6F2", // soft orange used to spotlight the ShipTime column
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
const body: React.CSSProperties = { fontFamily: "var(--font-inter), system-ui, sans-serif", color: ds.muted, lineHeight: 1.6 };
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

// ── Table cell marks ─────────────────────────────────────────────────────────
// ShipTime win: solid orange check. Competitor gap: readable RED ✗ (no more
// near-invisible pale gray). Competitor also-has-it: legible neutral check.
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill={ds.orange} />
      <path d="M5.5 10l2.8 2.8L14.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIconGray() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#DDE1EA" />
      <path d="M5.5 10l2.8 2.8L14.5 6.5" stroke="#6B7086" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill={ds.redSoft} />
      <path d="M6.8 6.8l6.4 6.4M13.2 6.8l-6.4 6.4" stroke={ds.red} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Shared comparison table ───────────────────────────────────────────────────
// The ShipTime column is spotlighted with a soft-orange fill so the winner reads
// at a glance; competitor gaps show a red ✗. No pale alternating rows.
export function CompareTable({
  rows,
  competitorName,
  competitorPrice,
  competitorLogo,
  ctaSource = "compare-table",
  showCtaRow = true,
}: {
  rows: Competitor["rows"];
  competitorName: string;
  competitorPrice: string;
  competitorLogo?: string;
  ctaSource?: string;
  showCtaRow?: boolean;
}) {
  const noSet = new Set(["no", "not supported", "none", "no."]);
  const yesSet = new Set(["yes", "yes.", "none"]);

  // Responsive columns: the two comparison columns shrink with the viewport
  // (clamp) so the feature text never gets crushed on a phone, while the
  // `minmax(0,1fr)` first column absorbs the remaining width without overflow.
  const COLS = "minmax(0,1fr) clamp(72px,21vw,148px) clamp(72px,21vw,148px)";

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${ds.border}`, background: ds.white, boxShadow: "0 8px 30px rgba(28,30,61,0.08)" }}>
      {/* Header */}
      <div className="grid" style={{ gridTemplateColumns: COLS, background: ds.white, borderBottom: `1px solid ${ds.border}` }}>
        <div className="px-6 py-4" />
        {/* ShipTime — spotlighted */}
        <div className="py-4 flex flex-col items-center gap-1" style={{ background: ds.highlight, borderLeft: `1px solid ${ds.border}` }}>
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full" style={{ background: ds.orange, color: ds.white, ...sora }}>ShipTime</span>
          <span className="text-[10px]" style={{ color: ds.orange, ...inter, fontWeight: 700 }}>Free forever</span>
        </div>
        {/* Competitor */}
        <div className="py-4 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
          {competitorLogo ? (
            <Image src={competitorLogo} alt={competitorName} width={100} height={24} className="h-4 w-auto object-contain" style={{ maxWidth: "88%", opacity: 0.7 }} />
          ) : (
            <span className="text-[11px] font-semibold text-center px-1" style={{ color: ds.muted, ...sora }}>{competitorName}</span>
          )}
          <span className="text-[10px] text-center px-1" style={{ color: ds.muted, ...inter }}>{competitorPrice}</span>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row) => {
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
            style={{ gridTemplateColumns: COLS, borderTop: `1px solid ${ds.border}`, background: ds.white }}
          >
            <div className="px-4 md:px-6 py-3.5">
              <span style={{ ...inter, fontSize: 13.5, color: ds.navy, fontWeight: 500 }}>{row.feature}</span>
            </div>
            {/* ShipTime cell (spotlighted) */}
            <div className="py-3.5 flex flex-col items-center justify-center gap-1" style={{ background: ds.highlight, borderLeft: `1px solid ${ds.border}` }}>
              {shipWin ? <CheckIcon /> : <CrossIcon />}
              {shipText && <span style={{ ...inter, fontSize: 11, color: ds.orange, fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>{shipText}</span>}
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
      {showCtaRow && (
        <div className="grid items-center" style={{ gridTemplateColumns: COLS, borderTop: `1px solid ${ds.border}`, background: ds.white }}>
          <div className="px-4 md:px-6 py-4">
            <span style={{ ...sora, fontSize: 13, fontWeight: 700, color: ds.navy }}>Ready to switch?</span>
          </div>
          <div className="py-4 flex justify-center" style={{ background: ds.highlight, borderLeft: `1px solid ${ds.border}` }}>
            <LeadCaptureButton source={ctaSource} className="text-white text-[12px] font-semibold px-4 py-2 transition-opacity hover:opacity-90 whitespace-nowrap" style={{ background: ds.orange, borderRadius: 999, ...sora }}>
              Get in touch
            </LeadCaptureButton>
          </div>
          <div className="py-4" style={{ borderLeft: `1px solid ${ds.border}` }} />
        </div>
      )}
    </div>
  );
}

// ── Why teams switch (navy before → after cards) ──────────────────────────────
export function WhyTeamsSwitch({
  data,
  ctaSource = "why-switch",
  eyebrow = "Why teams switch",
  title = "Here’s what changes",
}: {
  data: NonNullable<Competitor["alternative"]["whyTeamsSwitch"]>;
  ctaSource?: string;
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.navy }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="mb-14 md:mb-16" style={{ maxWidth: 620 }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: ds.orange, ...sora }}>{eyebrow}</p>
          <h2 className="mb-5" style={{ ...heading, color: ds.white, fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)" }}>{title}</h2>
          <p style={{ ...body, color: "rgba(255,255,255,0.78)", fontSize: 16, lineHeight: 1.7 }}>{data.opener}</p>
        </div>

        <div className="flex flex-col gap-4">
          {data.bullets.map((b, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_40px_1fr] gap-0 overflow-hidden" style={{ borderRadius: 16 }}>
              <div className="px-6 py-5 flex items-start gap-3" style={{ background: "rgba(255,255,255,0.11)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <span className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] px-2 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.85)", ...sora }}>Before</span>
                <span style={{ ...inter, fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>{b.before}</span>
              </div>
              <div className="hidden md:flex items-center justify-center" style={{ background: ds.navy }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M12 6l4 4-4 4" stroke={ds.orange} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="px-6 py-5 flex items-start gap-3 border border-[rgba(236,90,38,0.35)] md:border-l-0" style={{ background: "rgba(236,90,38,0.18)" }}>
                <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ds.orange }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ ...inter, fontSize: 14, color: "#FFFFFF", lineHeight: 1.6 }}>{b.after}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <LeadCaptureButton
            source={ctaSource}
            className="inline-flex items-center gap-2.5 text-white text-sm font-semibold px-7 py-3.5 transition-all hover:opacity-90"
            style={{ background: ds.orange, borderRadius: 999, boxShadow: "0 4px 20px rgba(236,90,38,0.35)", ...sora }}
          >
            Get in touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </LeadCaptureButton>
        </div>
      </div>
    </section>
  );
}

// ── Feature deep-dives (alternating copy + product mock) ───────────────────────
export function FeatureDeepDives({
  features,
  title,
  subtitle,
}: {
  features: Competitor["alternative"]["features"];
  title: string;
  subtitle: string;
}) {
  return (
    <section className="px-5 md:px-10 py-16 md:py-24" style={{ background: ds.white }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div className="text-center mb-14">
          <h2 className="mb-3" style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.3rem)" }}>{title}</h2>
          <p className="mx-auto" style={{ ...body, maxWidth: 460, fontSize: 15 }}>{subtitle}</p>
        </div>
        <div className="flex flex-col gap-16 md:gap-24">
          {features.map((f, i) => (
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
  );
}

// ── Minimal landing-page footer ───────────────────────────────────────────────
// Conversion pages keep exits to a minimum, so this is a slim bar rather than
// the multi-column sitemap: mark, one line, and the legal link.
export function LandingFooter() {
  return (
    <footer className="px-5 md:px-10 py-8" style={{ background: ds.navy }}>
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ maxWidth: 1240, margin: "0 auto" }}
      >
        <Image src="/shiptime-logo.svg" alt="ShipTime" width={130} height={40} className="h-7 w-auto opacity-90" />
        <div className="flex items-center gap-5">
          <a
            href="https://shiptime.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.55)", ...inter }}
          >
            Privacy
          </a>
          <span style={{ ...inter, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            © {new Date().getFullYear()} ShipTime
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── FAQ (card style) ──────────────────────────────────────────────────────────
export function LandingFaq({
  faq,
  title = "Common questions",
  subtitle,
}: {
  faq: Competitor["faq"];
  title?: string;
  subtitle?: string;
}) {
  if (!faq || faq.length === 0) return null;
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background: ds.surface }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: ds.orange, ...sora }}>FAQ</p>
          <h2 style={{ ...heading, fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>{title}</h2>
          {subtitle && <p className="mt-3 mx-auto" style={{ ...body, fontSize: 15, color: ds.muted, maxWidth: 440 }}>{subtitle}</p>}
        </div>

        <div className="flex flex-col gap-3">
          {faq.map((item, i) => (
            <div key={i} className="px-7 py-6" style={{ background: ds.white, borderRadius: 14, border: `1px solid ${ds.border}`, boxShadow: "0 2px 12px rgba(28,30,61,0.04)" }}>
              <div className="flex items-start gap-4">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5" style={{ background: "#FBEEE9", color: ds.orange, ...sora }}>Q</span>
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
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
