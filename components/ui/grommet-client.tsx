"use client";

// ShipTime x Grommet co-marketing lander. Grommet links here from three
// automated emails (pre-launch, post-launch, Product of the Week winner), so
// the page has to work for cold mobile traffic: photo-led hero, a form section
// that saves after step 1, then the scorecard revealed in place.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { captureAttribution, flushLeadOutbox, identifyLead, readAttribution, submitLead, trackLeadConversion } from "@/components/ui/lead-capture-form";
import { ShipTimeSignupForm } from "@/components/ui/shiptime-signup-form";

const ds = {
  navy: "#1C1E3D",
  navyDeep: "#16182F",
  muted: "#52566C",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface: "#F8FAFB",
  lightBlue: "#E3EEFC",
  lightPink: "#FAF0EB",
  white: "#FFFFFF",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

const h2Style: React.CSSProperties = {
  ...sora, margin: 0, fontWeight: 800,
  fontSize: "clamp(1.6rem, 4.2vw, 2.4rem)",
  letterSpacing: "-0.025em", lineHeight: 1.12, color: ds.navy,
};

// Volume bands are Grommet-specific: their brands are sub-$2M and shipping
// their first 10–20k orders, so the ranges sit much lower than our own forms.
const PARCEL_BANDS = ["0–50", "50–250", "250+"];
const LTL_BANDS = ["Less than 5", "5–20", "20–100"];

// The twelve, verbatim from Michael's "ShipTime - Logistics Readiness Scorecard
// for New Brands.docx" (emailed 2026-08-19, Spark 180921). Kept in his document
// order so his numbering still lines up; GROUPS below controls display order.
//
// Provenance of what these REPLACED, since two earlier versions of this comment
// got it wrong and the question was asked directly:
//  • The ten questions here from 2026-07-29 to 2026-08-19 came verbatim from
//    Matteo's build brief of 2026-07-28, under the heading "Full checklist copy
//    — The New Brand Shipping Readiness Checklist". Not written here, and never
//    reviewed by Michael or Stephen — that review covered the /vs and
//    /alternative comparison pages.
//  • Only two items were ever authored here: on-time delivery tracking and
//    branded tracking / proactive updates, added 2026-08-19 because Michael's
//    closing insight names delivery performance and customer experience and the
//    original ten measured neither. Both are now gone, superseded by his list.
//
// Two normalisations, both presentational and both flagged back to him:
//  • Items 10 and 12 arrived as a single sentence with no bold lead-in, unlike
//    1-9 and 11. Titles added so every row renders the same shape; his sentence
//    is preserved intact as the body.
//  • Nothing else is reworded.
const ESSENTIALS: { title: string; body: string }[] = [
  { title: "Know your product dimensions & weight",
    body: "Measure and record the exact weight and dimensions of every product and its packaged form." },
  { title: "Choose packaging that protects without adding cost",
    body: "Use the smallest box or mailer that safely protects your products." },
  { title: "Compare carrier rates before every shipment",
    body: "Compare rates and transit times across multiple carriers." },
  { title: "Understand your shipping costs",
    body: "Know your true shipping cost per order, including packaging and fulfillment." },
  { title: "Set clear customer delivery expectations",
    body: "Communicate accurate delivery expectations before and after purchase." },
  { title: "Provide shipment tracking",
    body: "Automatically send tracking updates to customers." },
  { title: "Create a simple returns process",
    body: "Have a clear, customer-friendly returns process." },
  { title: "Automate wherever possible",
    body: "Connect your store to your shipping platform to reduce manual work." },
  { title: "Review shipping performance monthly",
    body: "Monitor shipping costs, delivery performance and customer issues." },
  { title: "Audit your shipping invoices",
    body: "Have a process in place to audit shipping invoices — there can be errors on these bills that will cost you money." },
  { title: "Establish simple shipping policies early",
    body: "Clearly define shipping rates, processing times and policies for damaged or lost shipments." },
  { title: "Choose a provider that automates and rate shops",
    body: "Select a provider that can help you automate the shipping process and rate shop across multiple courier options." },
];

const MAX_PER_ITEM = 2;
const MAX_SCORE = ESSENTIALS.length * MAX_PER_ITEM; // 24

// "Score each item: 2 = Yes, we've fully addressed this / 1 = Partially in place
// / 0 = Not yet addressed" — his wording, shortened to fit a segmented control
// with the full phrasing kept as the accessible label.
const SCORE_OPTIONS: { value: 0 | 1 | 2; label: string; full: string }[] = [
  { value: 2, label: "Yes", full: "Yes, we've fully addressed this" },
  { value: 1, label: "Partly", full: "Partially in place" },
  { value: 0, label: "Not yet", full: "Not yet addressed" },
];

// Michael's note with the list: "needs to be re-organized in a better order".
// These are his own three pillars, lifted from the Logistics Performance
// Framework doc he sent the day before — Logistics Costs, Operational Excellence,
// Customer Experience — so the two artifacts describe the business the same way
// and the sub-scores here map onto his CPS/OES/CES.
//
// Indices point back into ESSENTIALS, so his numbering survives while the rows
// renumber 1..12 in display order.
const GROUPS: { label: string; blurb: string; items: number[] }[] = [
  { label: "Logistics costs", blurb: "What each parcel actually costs you, and where it leaks.", items: [0, 1, 2, 3, 9] },
  { label: "Operational excellence", blurb: "How much of this runs without you touching it.", items: [7, 8, 10, 11] },
  { label: "Customer experience", blurb: "What the buyer sees after they hit pay.", items: [4, 5, 6] },
];

// Render order across the groups, so "next unanswered" walks the list the way
// the visitor sees it rather than the order ESSENTIALS happens to be declared in.
const ORDER = GROUPS.flatMap((g) => g.items);

// Eases the displayed total toward the real one. A score that snaps from 14 to
// 16 reads as a re-render; one that travels reads as something being tallied,
// which is the whole feeling a scorecard is meant to have.
function useCountUp(value: number, ms = 420) {
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);
  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);
  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;
    // Respect a reduced-motion preference: jump straight there.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setShown(Math.round(from + (value - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

// Bands are his exact supplied copy, verbatim, so the page can't drift from the
// scorecard he hands out elsewhere. Scored out of 24.
function verdict(score: number, answered: boolean) {
  if (!answered)
    return { label: "Not scored yet", tone: "#52566C", bg: "#F1F2F5",
      body: "Score each item as you go — your total builds automatically." };
  if (score >= 20)
    return { label: "Excellent foundation", tone: "#2F8F55", bg: "#EAF7EE",
      body: "Your logistics are well positioned to support growth." };
  if (score >= 15)
    return { label: "Good start", tone: "#2F7D8F", bg: "#E6F4F7",
      body: "Address a few gaps before order volume increases." };
  if (score >= 10)
    return { label: "Significant opportunities to improve", tone: "#A9701A", bg: "#FDF4E4",
      body: "Strengthening these areas will reduce costs and improve customer satisfaction." };
  return { label: "Fundamentals first", tone: "#C2521F", bg: "#FCEDE6",
    body: "Focus on logistics fundamentals before scaling your business." };
}

// Flattens the answers into CRM fields. Nothing about the scorecard reached us
// before this: the answers lived in localStorage and the visitor's score — the
// only thing on the page that describes how they actually operate — was
// invisible to sales. `scorecard_detail` keeps each item's mark so a rep can see
// *which* of the twelve are failing, not just that the total is low.
//
// weakest is withheld until everything is answered: naming a "weakest area" off
// four answers would just point at whichever group they happened to start with.
function scoreFields(scores: Record<number, 0 | 1 | 2>) {
  const answered = Object.keys(scores).length;
  const total = Object.values(scores).reduce<number>((a, b) => a + b, 0);
  const areas = GROUPS.map((g) => {
    const max = g.items.length * MAX_PER_ITEM;
    const got = g.items.reduce<number>((a, i) => a + (scores[i] ?? 0), 0);
    return { label: g.label, got, max, pct: got / max };
  });
  const weakest =
    answered === ESSENTIALS.length
      ? areas.reduce((lo, r) => (r.pct < lo.pct ? r : lo), areas[0])
      : null;

  return {
    scorecard_total: String(total),
    scorecard_answered: String(answered),
    scorecard_band: verdict(total, answered > 0).label,
    scorecard_areas: areas.map((a) => `${a.label}: ${a.got}/${a.max}`).join("; "),
    ...(weakest ? { scorecard_weakest: `${weakest.label} (${weakest.got}/${weakest.max})` } : {}),
    scorecard_detail: ORDER.map((i, n) => `${n + 1}. [${scores[i] ?? "-"}] ${ESSENTIALS[i].title}`).join("\n"),
  };
}

// Closing line, his wording verbatim. Sits under the scorecard as the takeaway,
// and is the reason group four exists at all.
const INSIGHT =
  "The strongest brands don't optimize for the lowest shipping cost alone. They balance cost, delivery performance and customer experience to build long-term customer loyalty and profitable growth.";

// Amounts confirmed 2026-07-28 (David + Michael): every Grommet signup gets $10
// automatically via the affiliation-based reward campaign; Product of the Week
// winners get $50 as 5 x $10 coupons, applied manually. The earlier $20 (2 x $10)
// figure from the original brief was wrong.
// Never say "ShipCash" here — that's internal. It's "shipping credit" on the page.
const OFFERS = {
  default: {
    eyebrow: "Your ShipTime offer",
    body: "Sign up with ShipTime and get $10 in shipping credit toward your first shipments. It's added to your account automatically when you sign up — just apply it at checkout when you pay for a shipment.",
  },
  winner: {
    eyebrow: "Product of the Week prize",
    body: "As part of your Product of the Week prize, get $50 in shipping credit toward scaling your fulfillment, issued as 5 x $10 credits so nothing goes to waste on smaller orders. Redeem it when you sign up.",
  },
} as const;

export type OfferVariant = keyof typeof OFFERS;

// Signup happens HERE now, not by handing off to shiptime.com/grommet.
//
// The old note said signup had to go to that co-branded page because it held the
// logic that reads the UTMs and sets the Grommet affiliation, and app.shiptime.com
// had neither (David, 2026-07-28). That constraint is gone: we call the Signup API
// directly with membership_type=ship-grommet, verified against production
// 2026-08-13. Three reasons this is now the better path:
//
//  • Their page currently declares `g_subsite = 'cfib'`, so it was tagging Grommet
//    signups as CFIB. (Raised with David; he's fixing it overnight.)
//  • localStorage is per-origin, so a visitor crossing from here to shiptime.com
//    lands on a store that never saw our UTMs — that page could only recover
//    attribution from the query string we appended. We hold the values
//    server-side and pass them straight to the API.
//  • One less step, and no cross-domain hop to lose people at.
//
// The $10 credit is unaffected: David confirmed 2026-08-13 that it's triggered by
// the affiliation itself, "automatically regardless of source".
//
// Campaign still differs per variant — winners get 5 x $10 coupons issued
// manually, so they have to stay distinguishable from the automated reward.
// Survives a return visit: how they scored each item, and that they've already
// paid the email toll. Separate from st_attribution, which tracks the campaign.
const PROGRESS_KEY = "st_grommet_progress";

const CAMPAIGN: Record<OfferVariant, string> = {
  default: "grommet_checklist",
  winner: "grommet_potw_winner",
};

// ── Small pieces ──────────────────────────────────────────────────────────────

// Floating chip that overlaps the hero photo — same device the comparison
// pages use, so this page reads as part of the same family.
function PillChip({ label, accent = ds.lightBlue }: { label: string; accent?: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 pl-2.5 pr-4 py-2.5"
      style={{ background: ds.white, borderRadius: 14, boxShadow: "0 10px 30px rgba(28,30,61,0.16)", border: `1px solid ${ds.border}` }}>
      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
        <Icon.Check size={15} style={{ stroke: ds.navy }} />
      </span>
      <span style={{ ...sora, fontSize: 13, fontWeight: 600, color: ds.navy, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

// `cta: "form"` renders the real signup inline; `"anchor"` just points at it.
// Only one instance carries the form so there's a single place to convert — the
// footer block, which renders whether or not the checklist has been unlocked, so
// the anchor always resolves.
function OfferBox({
  variant,
  rounded = false,
  cta = "anchor",
  email,
}: {
  variant: OfferVariant;
  rounded?: boolean;
  cta?: "form" | "anchor";
  email?: string;
}) {
  const offer = OFFERS[variant];
  return (
    <div style={{ background: ds.navy, padding: 26, borderRadius: rounded ? 20 : 0 }}>
      <p style={{ ...sora, margin: "0 0 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ds.orange }}>
        {offer.eyebrow}
      </p>
      <p style={{ ...inter, margin: 0, fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.9)" }}>
        {offer.body}
      </p>

      {cta === "form" ? (
        // White panel: the form's inputs and labels are styled for a light
        // surface and would be unreadable directly on navy.
        <div style={{ marginTop: 20, background: ds.white, borderRadius: 16, padding: "22px 20px" }}>
          <p style={{ ...sora, margin: "0 0 16px", fontWeight: 800, fontSize: 17, color: ds.navy }}>
            Create your free account
          </p>
          <ShipTimeSignupForm
            affiliation="grommet"
            language="en"
            leadSource="grommet-checklist"
            ctaLabel="Create my free account"
            leadFields={{ partner_source: "grommet", grommet_offer: variant }}
            initialEmail={email}
            campaignFallback={CAMPAIGN[variant]}
          />
        </div>
      ) : (
        <a
          href="#create-account"
          style={{ ...sora, display: "block", textAlign: "center", marginTop: 20, background: ds.orange, color: ds.white, borderRadius: 999, padding: "14px 20px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}
        >
          Create your free account
        </a>
      )}

      <p style={{ ...inter, margin: "10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
        No platform fee. No contract.
      </p>
    </div>
  );
}

function LockGlyph({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size * (14 / 12)} viewBox="0 0 12 14" fill="none" aria-hidden>
      <rect x="1" y="6" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.4 6V4.2a2.6 2.6 0 015.2 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Three-way selector for one item: 2 / 1 / 0, per the scorecard's own scoring
// key. Rendered as a segmented control rather than a dropdown so the whole scale
// is visible at a glance — the point of a scorecard is seeing where you sit on
// each line, which a collapsed select hides.
//
// `undefined` is a real state, distinct from 0: "not yet addressed" is an answer
// worth zero, whereas unanswered means we shouldn't imply a verdict at all.
function ScoreSelect({
  value,
  onPick,
  compact = false,
}: {
  value: 0 | 1 | 2 | undefined;
  onPick: (v: 0 | 1 | 2) => void;
  compact?: boolean;
}) {
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  // Left/right arrows move along the scale and pick as they go, so the whole
  // card is answerable from the keyboard without tabbing through 36 buttons.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const at = SCORE_OPTIONS.findIndex((o) => o.value === value);
    const cur = at < 0 ? 0 : at;
    const next = e.key === "ArrowRight"
      ? Math.min(SCORE_OPTIONS.length - 1, cur + 1)
      : Math.max(0, cur - 1);
    onPick(SCORE_OPTIONS[next].value);
    btns.current[next]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 5, flexShrink: 0 }} role="group" onKeyDown={onKeyDown}>
      {SCORE_OPTIONS.map((o, oi) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            ref={(el) => { btns.current[oi] = el; }}
            type="button"
            className="gm-score-btn"
            onClick={() => onPick(o.value)}
            aria-pressed={on}
            aria-label={o.full}
            title={o.full}
            style={{
              ...sora,
              fontSize: compact ? 11 : 12,
              fontWeight: 700,
              lineHeight: 1,
              padding: compact ? "7px 9px" : "8px 11px",
              borderRadius: 8,
              cursor: "pointer",
              whiteSpace: "nowrap",
              color: on ? ds.white : ds.muted,
              background: on ? ds.orange : ds.white,
              border: `1.5px solid ${on ? ds.orange : ds.border}`,
              transition: "background .15s, border-color .15s, color .15s",
            }}
          >
            {o.label}
            <span style={{ opacity: on ? 0.75 : 0.5, marginLeft: 4, fontWeight: 700 }}>{o.value}</span>
          </button>
        );
      })}
    </div>
  );
}

// The gated asset, rendered as an object rather than a list: page edges stacked
// behind it, a branded cover, and — the part that does the work — the first
// three items actually scoreable, totalling live out of 24.
//
// Scoring before the form is deliberate. It turns a vague "download a PDF" into
// a score they've started and can't finish, so the email field arrives after
// they've invested three answers rather than before, and the gate becomes
// specific: not "get the scorecard" but "9 items still locked".
//
// The blurred rows are real items 4–6, so what's behind the gate reads as
// genuine content; only three of the nine are drawn, which implies the rest
// without turning the card into a wall of filler.
function ChecklistDoc({
  scores,
  onScore,
}: {
  scores: Record<number, 0 | 1 | 2>;
  onScore: (i: number, v: 0 | 1 | 2) => void;
}) {
  const open = ESSENTIALS.slice(0, 3);
  const blurred = ESSENTIALS.slice(3, 6);
  const lockedCount = ESSENTIALS.length - open.length;
  const total = Object.values(scores).reduce<number>((a, b) => a + b, 0);
  const answered = Object.keys(scores).length;

  return (
    <div style={{ position: "relative" }}>
      {/* Page edges peeking out behind the top — reads as a multi-page document */}
      <div aria-hidden style={{ position: "absolute", top: -15, left: 26, right: 26, height: 60, borderRadius: 18, background: "rgba(255,255,255,0.22)" }} />
      <div aria-hidden style={{ position: "absolute", top: -7, left: 13, right: 13, height: 60, borderRadius: 19, background: "rgba(255,255,255,0.5)" }} />

      <div style={{ position: "relative", background: ds.white, borderRadius: 20, boxShadow: "0 34px 84px rgba(0,0,0,0.46)", overflow: "hidden" }}>
        {/* ── Cover ── */}
        <div style={{ position: "relative", background: ds.navyDeep, padding: "19px 22px 17px", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(125% 150% at 100% 0%, rgba(236,90,38,0.42) 0%, rgba(236,90,38,0) 62%)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
            <div>
              <p style={{ ...sora, margin: "0 0 8px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ds.orange }}>
                ShipTime × Grommet
              </p>
              <p style={{ ...sora, margin: 0, fontWeight: 800, fontSize: 16.5, lineHeight: 1.24, color: ds.white, maxWidth: 250 }}>
                The ShipTime Logistics Readiness Scorecard
              </p>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <span style={{ ...sora, display: "block", fontSize: 44, fontWeight: 800, lineHeight: 0.88, color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.34)" }}>
                {ESSENTIALS.length}
              </span>
              <span style={{ ...sora, fontSize: 8.5, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.44)" }}>ESSENTIALS</span>
            </div>
          </div>
        </div>

        {/* ── The three open items ── */}
        <div style={{ padding: "17px 20px 0" }}>
          <p style={{ ...inter, margin: "0 0 12px", fontSize: 12, fontWeight: 600, color: ds.muted }}>
            Score each one: <strong style={{ color: ds.navy }}>2</strong> fully addressed,{" "}
            <strong style={{ color: ds.navy }}>1</strong> partially, <strong style={{ color: ds.navy }}>0</strong> not yet.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {open.map((q, i) => (
              <div
                key={i}
                style={{
                  background: scores[i] !== undefined ? "#FFF8F4" : ds.white,
                  border: `1.5px solid ${scores[i] !== undefined ? "rgba(236,90,38,0.4)" : ds.border}`,
                  borderRadius: 12,
                  padding: "11px 12px",
                  transition: "background .18s, border-color .18s",
                }}
              >
                <p style={{ ...sora, margin: "0 0 3px", fontSize: 13, fontWeight: 700, lineHeight: 1.35, color: ds.navy }}>{q.title}</p>
                <p style={{ ...inter, margin: "0 0 10px", fontSize: 12.5, lineHeight: 1.5, color: ds.muted }}>{q.body}</p>
                <ScoreSelect compact value={scores[i]} onPick={(v) => onScore(i, v)} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Locked remainder — the seal is a link, so clicking the lock
             jumps to the form that opens it ── */}
        <div style={{ position: "relative", padding: "10px 20px 26px", display: "flex", flexDirection: "column", gap: 10 }}>
          {blurred.map((q, i) => (
            <div key={i} aria-hidden style={{ border: `1.5px solid ${ds.border}`, borderRadius: 12, padding: "11px 12px", filter: "blur(4.5px)", opacity: 0.5, userSelect: "none" }}>
              <p style={{ ...sora, margin: "0 0 3px", fontSize: 13, fontWeight: 700, lineHeight: 1.35, color: ds.navy }}>{q.title}</p>
              <p style={{ ...inter, margin: "0 0 10px", fontSize: 12.5, lineHeight: 1.5, color: ds.muted }}>{q.body}</p>
              <div style={{ display: "flex", gap: 5 }}>
                {SCORE_OPTIONS.map((o) => (
                  <span key={o.value} style={{ ...sora, fontSize: 11, fontWeight: 700, padding: "7px 9px", borderRadius: 8, border: `1.5px solid ${ds.border}`, color: ds.muted }}>
                    {o.label} {o.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <a
            href="#gm-form"
            // Fades late on purpose: an earlier fade whited out the third row
            // entirely and left a dead gap above the pill.
            style={{ position: "absolute", inset: 0, textDecoration: "none", background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.94) 82%, ${ds.white} 100%)`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4 }}
          >
            <span style={{ ...sora, display: "inline-flex", alignItems: "center", gap: 8, background: ds.navy, color: ds.white, borderRadius: 999, padding: "10px 19px", fontSize: 12.5, fontWeight: 700, boxShadow: "0 8px 22px rgba(28,30,61,0.3)" }}>
              <LockGlyph />
              {lockedCount} more — unlock free
            </span>
          </a>
        </div>

        {/* ── Live score ── */}
        <div style={{ borderTop: `1px solid ${ds.border}`, background: ds.surface, padding: "13px 20px 15px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 9 }}>
            <span style={{ ...sora, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: ds.muted }}>
              Your readiness score
            </span>
            <span style={{ ...sora, fontSize: 15, fontWeight: 800, color: ds.navy }}>
              {total}<span style={{ color: "#A6ABBC" }}> / {MAX_SCORE}</span>
            </span>
          </div>
          {/* One continuous bar, not a segment per point — 24 segments at this
              width would be hairlines. */}
          <div style={{ height: 7, borderRadius: 999, background: "#E4E6EC", overflow: "hidden" }} aria-hidden>
            <div style={{ width: `${(total / MAX_SCORE) * 100}%`, height: "100%", borderRadius: 999, background: ds.orange, transition: "width .25s" }} />
          </div>
          <p style={{ ...inter, margin: "9px 0 0", fontSize: 11.5, color: ds.muted }}>
            {answered === 0
              ? "Score an item above to start."
              : `${lockedCount} items still locked.`}
          </p>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { n: "1", title: "Answer the questions", body: "Two quick details about your volume — parcel and LTL. Under a minute, no sales call.", img: "/generated/grommet-step-1.png" },
  // NOTE: deliberately does not promise an email — no send is wired up yet.
  // Once a HubSpot workflow on partner_source=grommet delivers the checklist,
  // change this back to mention the emailed copy.
  { n: "2", title: "Score all twelve", body: "All 12 essentials and the scoring bands appear right on this page, so you can work through them straight away.", img: "/generated/grommet-step-2.png" },
  { n: "3", title: "Sign up if it's useful", body: "If shipping turns out to be one of the gaps, create a free account and claim your shipping credit.", img: "/generated/grommet-step-3.png" },
];

const TRUST = [
  { title: "Deeply discounted rates", body: "Pre-negotiated pricing across every major carrier from your very first label — no volume minimum to unlock it." },
  { title: "No platform fee, no contract", body: "You pay for the labels you print and nothing else. Nothing to cancel if it isn't for you." },
  { title: "Every carrier on one screen", body: "Canada Post, Purolator, UPS, FedEx, GLS and LTL freight side by side, so the cheapest option is never a guess." },
  { title: "Real support, based in Canada", body: "Over 10,000 calls answered this year, 26 seconds to answer on average. You reach a person, not a queue." },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GrommetClient({ variant }: { variant: OfferVariant }) {
  const [step, setStep] = useState<1 | 2 | "done">(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [parcel, setParcel] = useState("");
  const [ltl, setLtl] = useState("");
  const [busy, setBusy] = useState(false);
  // Score per item, keyed by index into ESSENTIALS. Lives here rather than in
  // ChecklistDoc so the form can reflect the score they've already started.
  // A missing key means unanswered, which is deliberately not the same as 0.
  const [scores, setScores] = useState<Record<number, 0 | 1 | 2>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  const setScore = (i: number, v: 0 | 1 | 2) => setScores((prev) => ({ ...prev, [i]: v }));
  const total = Object.values(scores).reduce<number>((a, b) => a + b, 0);
  const answeredCount = Object.keys(scores).length;
  const allScored = answeredCount === ESSENTIALS.length;
  const shownTotal = useCountUp(total);

  // The first item they haven't scored, in the order they see them.
  const nextUnanswered = ORDER.find((i) => scores[i] === undefined);
  const jumpToNext = () => {
    if (nextUnanswered === undefined) return;
    document.getElementById(`gm-item-${nextUnanswered}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Scoring twelve items scrolls the running total off screen, so the number
  // they're building is invisible exactly while they build it. This bar docks it
  // to the bottom for the stretch between the header leaving view and the offer
  // arriving — never over the offer, which is the one thing that must not be
  // covered.
  const scoreHeaderRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const [showDock, setShowDock] = useState(false);
  useEffect(() => {
    if (step !== "done") {
      setShowDock(false);
      return;
    }
    const header = scoreHeaderRef.current;
    const offer = offerRef.current;
    if (!header) return;
    let headerVisible = true;
    let offerVisible = false;
    const update = () => setShowDock(!headerVisible && !offerVisible);
    const obs: IntersectionObserver[] = [];
    const watch = (el: Element, set: (v: boolean) => void) => {
      const o = new IntersectionObserver(([entry]) => { set(entry.isIntersecting); update(); });
      o.observe(el);
      obs.push(o);
    };
    watch(header, (v) => { headerVisible = v; });
    if (offer) watch(offer, (v) => { offerVisible = v; });
    return () => obs.forEach((o) => o.disconnect());
  }, [step]);

  // Grommet's emails carry their own UTMs; store first-touch on arrival so the
  // values survive the two-step transition and aren't lost on submit.
  useEffect(() => {
    captureAttribution();
    // Retry anything a previous visit couldn't confirm. No-op when empty.
    void flushLeadOutbox();
  }, []);

  // Restore a returning visitor. The scorecard tells them to bookmark the page
  // and pick up where they left off, which was untrue: nothing persisted, so a
  // return visit reset to step 1 and asked for the email it already had. The
  // unlock is a one-way door — they've handed over the lead once and shouldn't
  // pay twice for the same asset.
  //
  // Accepts one frame of the gated state before flipping: the SSR'd HTML is
  // already painted by the time effects run, and blocking first paint on
  // localStorage would cost every first-time visitor to spare returning ones.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        unlocked?: boolean;
        scores?: Record<string, number>;
        ticked?: number[]; // pre-scorecard shape, still in visitors' browsers
        email?: string;
      };
      const valid = (i: number) => Number.isInteger(i) && i >= 0 && i < ESSENTIALS.length;
      if (saved.scores && typeof saved.scores === "object") {
        const next: Record<number, 0 | 1 | 2> = {};
        for (const [k, v] of Object.entries(saved.scores)) {
          const i = Number(k);
          if (valid(i) && (v === 0 || v === 1 || v === 2)) next[i] = v;
        }
        setScores(next);
      } else if (Array.isArray(saved.ticked)) {
        // Anyone who unlocked under the old binary checklist has a `ticked`
        // array. A tick meant "yes", which is 2 on the new scale — migrate it
        // rather than wiping the answers they already gave.
        const next: Record<number, 0 | 1 | 2> = {};
        for (const i of saved.ticked) if (valid(i)) next[i] = 2;
        setScores(next);
      }
      if (saved.email) setEmail(saved.email);
      if (saved.unlocked) setStep("done");
    } catch {
      /* private mode / corrupt value — the form just starts fresh */
    }
  }, []);

  // Persist only once unlocked, so an abandoned half-filled form doesn't grant
  // access on the next visit.
  useEffect(() => {
    if (step !== "done") return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ unlocked: true, scores, email }));
    } catch {
      /* nothing to do — persistence is a convenience, not part of the flow */
    }
  }, [step, scores, email]);

  // Push the score onto the contact. Same email, so the route matches and
  // PATCHes the record step 1 created — this enriches, it never duplicates.
  //
  // Signature-guarded so identical state is never sent twice, which matters
  // because two separate triggers call it.
  const lastSent = useRef("");
  const sendScores = useCallback(() => {
    const addr = email.trim();
    if (!addr || Object.keys(scores).length === 0) return;
    const payload = {
      email: addr,
      ...scoreFields(scores),
      partner_source: "grommet",
      grommet_offer: variant,
      lead_source: "grommet-checklist",
      ...readAttribution(),
    };
    const sig = JSON.stringify(payload);
    if (sig === lastSent.current) return;
    lastSent.current = sig;
    // Failure is already handled: submitLead retries and queues, so a score lost
    // to a bad connection is re-sent on the next visit like any other lead.
    void submitLead(payload).catch(() => {});
  }, [email, scores, variant]);

  // Debounced, so scoring twelve items in a row is one or two writes rather than
  // twelve. Fires on the pause, which is also when they've stopped to think.
  useEffect(() => {
    if (step !== "done") return;
    const id = setTimeout(sendScores, 2500);
    return () => clearTimeout(id);
  }, [step, sendScores]);

  // Catches the visitor who scores a few items and leaves before the debounce
  // fires. `keepalive` on the POST is what makes a send during unload survive.
  useEffect(() => {
    if (step !== "done") return;
    const flush = () => sendScores();
    const onHide = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [step, sendScores]);

  // Tags every lead as Grommet-sourced, distinct from other sources, so
  // referrals can be traced back to the partnership.
  const partnerFields = {
    partner_source: "grommet",
    grommet_offer: variant,
    lead_source: "grommet-checklist",
  };

  // Step 1 saves immediately — if they drop before the volume questions we
  // still have the lead.
  async function onStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setBusy(true);
    const parts = name.trim().split(/\s+/);
    const lead = {
      email: email.trim(),
      firstname: parts[0],
      ...(parts.length > 1 ? { lastname: parts.slice(1).join(" ") } : {}),
      ...partnerFields,
      ...readAttribution(),
    };
    // Fire the tracker identify first, and synchronously. It's a queue push
    // rather than a request, so it costs nothing and it lands even if the CRM
    // write below fails outright.
    identifyLead(lead);
    try {
      await submitLead(lead);
    } catch {
      /* fail-soft: never block the visitor. submitLead has already retried and
         queued the payload for the next page view, so the lead survives. */
    }
    // Fire once, here — step 1 is where the lead is captured. Firing again on
    // step 2 would double-count.
    trackLeadConversion({ lead_source: "grommet-checklist", partner_source: "grommet", offer: variant });
    setBusy(false);
    setStep(2);
  }

  // Step 2 enriches the same contact (matched on email), then unlocks.
  async function onStep2(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await submitLead({
        email: email.trim(),
        ...(parcel ? { parcel_volume: parcel } : {}),
        ...(ltl ? { ltl_volume: ltl } : {}),
        ...partnerFields,
        ...readAttribution(),
      });
    } catch {
      /* fail-soft: the contact is already saved from step 1 */
    }
    setBusy(false);
    setStep("done");
    // Bring the revealed scorecard into view rather than leaving them staring
    // at a form that vanished.
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const inputStyle: React.CSSProperties = {
    ...inter, width: "100%", borderRadius: 11,
    border: `1.5px solid ${ds.border}`, padding: "14px 15px",
    fontSize: 16, // 16px avoids iOS zoom-on-focus
    color: ds.navy, background: ds.white, outline: "none",
  };
  const labelStyle: React.CSSProperties = { ...inter, fontSize: 13, fontWeight: 600, color: ds.muted, marginBottom: 6, display: "block" };
  const btnStyle: React.CSSProperties = {
    ...sora, width: "100%", background: ds.orange, color: ds.white, border: 0,
    borderRadius: 999, padding: "16px 24px", fontSize: 15.5, fontWeight: 700,
    cursor: "pointer", boxShadow: "0 6px 22px rgba(236,90,38,0.32)",
  };

  return (
    <div style={{ background: ds.white, ...inter, color: ds.navy }}>
      {/* ── Header ── */}
      <header style={{ borderBottom: `1px solid ${ds.border}`, padding: "16px 20px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          {/* Co-brand lockup. The Grommet wordmark is 128x18 with no icon or
              tagline, so its full height is its cap height — at 14px it optically
              matches the "ShipTime" wordmark inside a 30px-tall logo that also
              carries an icon and a tagline. Matching the box heights instead
              would leave Grommet looking twice the size. */}
          <div className="gm-brand" style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
            <Image className="gm-brand-st" src="/shiptime-logo.svg" alt="ShipTime" width={130} height={32} style={{ height: 30, width: "auto" }} />
            <span aria-hidden style={{ ...inter, fontSize: 15, lineHeight: 1, color: "#B9BCC9" }}>×</span>
            <Image className="gm-brand-gm" src="/grommet-logo.svg" alt="Grommet" width={128} height={18} style={{ height: "clamp(11px, 3vw, 14px)", width: "auto" }} />
          </div>
          {/* Once the scorecard is unlocked, "Get the scorecard" is stale — they
              have it. Point the header at the offer instead. */}
          <a href={step === "done" ? "#create-account" : "#get-checklist"} className="gm-nav-cta" style={{ ...sora, background: ds.orange, color: ds.white, borderRadius: 999, padding: "9px 18px", fontSize: 13.5, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
            {step === "done" ? (
              <>
                {/* Swapped by CSS, not JS, so there's no hydration flash */}
                <span className="gm-cta-long">Claim your credit</span>
                <span className="gm-cta-short">Claim it</span>
              </>
            ) : (
              <>
                <span className="gm-cta-long">Get the scorecard</span>
                <span className="gm-cta-short">Get it free</span>
              </>
            )}
          </a>
        </div>
      </header>

      {/* ── 1. HERO ── */}
      <section style={{ background: `linear-gradient(160deg, ${ds.lightBlue} 0%, ${ds.lightPink} 62%, ${ds.white} 100%)`, padding: "52px 20px 64px" }}>
        <div className="gm-hero" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gap: 44, gridTemplateColumns: "1fr", alignItems: "center" }}>
          <div>
            <span style={{ ...sora, display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ds.orange, background: ds.white, padding: "7px 14px", borderRadius: 999, marginBottom: 20, boxShadow: "0 2px 10px rgba(28,30,61,0.08)" }}>
              ShipTime × Grommet
            </span>
            <h1 style={{ ...sora, margin: 0, fontWeight: 800, fontSize: "clamp(2.1rem, 6.4vw, 3.5rem)", lineHeight: 1.06, letterSpacing: "-0.035em", color: ds.navy }}>
              The ShipTime Logistics{" "}
              <em style={{ fontStyle: "italic", fontWeight: 300, color: "#8B90A8" }}>Readiness</em> Scorecard
            </h1>
            <p style={{ ...inter, margin: "20px 0 0", fontSize: 19, lineHeight: 1.55, color: ds.navy, fontWeight: 500, maxWidth: 480 }}>
              12 essentials every new brand should get right before shipping their
              first 1,000 orders.
            </p>
            <p style={{ ...inter, margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: ds.muted, maxWidth: 480 }}>
              Built for Grommet brands getting their first orders out the door. Answer these
              honestly and you&rsquo;ll know exactly where shipping is quietly costing you money.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 30 }}>
              <a href="#get-checklist" style={{ ...sora, background: ds.navy, color: ds.white, borderRadius: 999, padding: "15px 30px", fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }}>
                Get the free scorecard
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </a>
              <span style={{ ...inter, fontSize: 13.5, color: ds.muted }}>Free · takes a minute</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 26 }}>
              <div style={{ display: "flex", gap: 2 }} aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width={15} height={15} viewBox="0 0 24 24" fill={ds.orange}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span style={{ ...inter, fontSize: 13.5, color: ds.muted }}>
                <strong style={{ color: ds.navy }}>4.5</strong> from 1,000+ reviews
              </span>
            </div>
          </div>

          {/* Photo + floating chips */}
          <div className="gm-hero-visual" style={{ position: "relative" }}>
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 24, maxWidth: 400, margin: "0 auto", boxShadow: "0 24px 70px rgba(28,30,61,0.2)" }}>
              <Image src="/generated/grommet-hero.png" alt="A brand owner packing their first orders" width={1024} height={1536} style={{ display: "block", width: "100%", height: "auto", objectFit: "cover" }} priority />
            </div>
            <div style={{ position: "absolute", top: 26, right: -6 }}><PillChip label="12-point scorecard" /></div>
            <div style={{ position: "absolute", bottom: 76, left: -8 }}><PillChip label="Free to download" accent={ds.lightPink} /></div>
            <div style={{ position: "absolute", bottom: 16, right: 6 }}><PillChip label="Shipping credit inside" accent="#D7E9D4" /></div>
          </div>
        </div>
      </section>

      {/* ── 2. FORM / RESULTS ── */}
      {/* Navy while gated (high contrast, makes the white form card the focal
          point and the locked preview feel like a real document); flips to
          white once unlocked so the checklist itself reads comfortably. */}
      <section
        id="get-checklist"
        ref={resultsRef}
        style={{
          background: step === "done" ? ds.white : "linear-gradient(168deg, #1F2245 0%, #191B38 50%, #0F1124 100%)",
          padding: "72px 20px 78px",
          scrollMarginTop: 70,
          position: "relative",
          // Deliberately NOT overflow: hidden. An ancestor with overflow hidden
          // becomes the sticky scrollport, which would silently kill the sticky
          // form column below. The decorative layer clips itself instead.
        }}
      >
        {step !== "done" && (
          // Own clipping context so the glows can bleed past the section edges
          // without the section itself having to clip.
          <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {/* One confident glow behind the document rather than the two
                overlapping orange washes that were here — they muddied to brown. */}
            <div style={{ position: "absolute", top: "-34%", right: "-14%", width: 820, height: 820, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,90,38,0.34) 0%, rgba(236,90,38,0) 66%)" }} />
            <div style={{ position: "absolute", bottom: "-30%", left: "-14%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(84,110,222,0.24) 0%, rgba(84,110,222,0) 68%)" }} />
            {/* Faint dot grid, faded out toward the bottom, so the navy has some
                texture instead of reading as a flat block. */}
            <div
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(rgba(255,255,255,0.075) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage: "radial-gradient(90% 70% at 50% 0%, #000 0%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(90% 70% at 50% 0%, #000 0%, transparent 100%)",
              }}
            />
          </div>
        )}

        <div style={{ maxWidth: step === "done" ? 720 : 1060, margin: "0 auto", position: "relative" }}>
          {step !== "done" ? (
            <Reveal>
              <div className="gm-capture" style={{ display: "grid", gap: 40, gridTemplateColumns: "1fr", alignItems: "center" }}>

                {/* LEFT — the pitch + the interactive asset */}
                <div>
                  <span style={{ ...sora, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: ds.orange, background: "rgba(236,90,38,0.13)", border: "1px solid rgba(236,90,38,0.3)", borderRadius: 999, padding: "7px 14px", marginBottom: 18 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: ds.orange }} aria-hidden />
                    Free · 12 essentials · 3 min
                  </span>
                  <h2 style={{ ...h2Style, color: ds.white }}>
                    {step === 1 ? (
                      <>
                        How ready is your shipping,{" "}
                        <em style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.52)" }}>really</em>?
                      </>
                    ) : (
                      "Almost there"
                    )}
                  </h2>
                  <p style={{ ...inter, margin: "16px 0 0", fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.76)", maxWidth: 440 }}>
                    {step === 1
                      ? "Tick the questions you can confidently answer yes to. Three are open below — the other seven unlock free, right on this page."
                      : "Two quick details about your volume and all 12 essentials unlock on this page."}
                  </p>
                  {step === 1 && (
                    <p style={{ ...inter, margin: "18px 0 0", paddingLeft: 14, borderLeft: `2px solid ${ds.orange}`, fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.62)", maxWidth: 400 }}>
                      Most brands we talk to get to 3 or 4 of these. That&rsquo;s
                      normal at this stage — it&rsquo;s exactly why we wrote it.
                    </p>
                  )}
                  <div className="gm-peek" style={{ marginTop: 34 }}>
                    <ChecklistDoc scores={scores} onScore={setScore} />
                  </div>
                </div>

                {/* RIGHT — the form */}
                <div id="gm-form" className="gm-form-col" style={{ borderRadius: 22, background: ds.white, boxShadow: "0 24px 70px rgba(0,0,0,0.34)", overflow: "hidden", scrollMarginTop: 84 }}>
                  {/* Orange top edge — gives the form its own accent so it isn't
                      just the second white rectangle in the row. */}
                  <div aria-hidden style={{ height: 4, background: `linear-gradient(90deg, ${ds.orange} 0%, #F0873F 100%)` }} />
                  <div style={{ padding: "28px 28px 30px" }}>
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                      <p style={{ ...sora, margin: 0, fontWeight: 800, fontSize: 18, color: ds.navy }}>
                        {step === 1 ? "Where should we send it?" : "Two quick questions"}
                      </p>
                      <span style={{ ...inter, fontSize: 12, fontWeight: 600, color: ds.muted, whiteSpace: "nowrap" }}>
                        Step {step} of 2
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }} aria-hidden>
                      {[1, 2].map((n) => (
                        <span key={n} style={{ flex: 1, height: 5, borderRadius: 999, background: n <= (step as number) ? ds.orange : ds.border, transition: "background .25s" }} />
                      ))}
                    </div>
                    {/* Picks up whatever they scored in the document, so the ask
                        lands as "finish what you started" rather than cold. */}
                    <p style={{ ...inter, margin: "13px 0 0", fontSize: 13, lineHeight: 1.55, color: ds.muted }}>
                      {step === 1
                        ? answeredCount > 0
                          ? `You're at ${total} of ${MAX_SCORE}. Unlock the other ${ESSENTIALS.length - 3} items to finish your score.`
                          : `Two steps. The remaining ${ESSENTIALS.length - 3} items unlock on this page.`
                        : "Last step — then the full scorecard appears below."}
                    </p>
                  </div>

                {step === 1 ? (
                  <form onSubmit={onStep1}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle} htmlFor="gm-name">Name</label>
                      <input id="gm-name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Your name" />
                    </div>
                    <div style={{ marginBottom: 22 }}>
                      <label style={labelStyle} htmlFor="gm-email">Email</label>
                      <input id="gm-email" type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@yourbrand.com" />
                    </div>
                    <button type="submit" disabled={busy} style={{ ...btnStyle, opacity: busy ? 0.6 : 1 }}>
                      {busy ? "Sending…" : "Continue"}
                    </button>
                    <p style={{ ...inter, margin: "13px 0 0", fontSize: 12.5, color: "#8A8FA3", textAlign: "center" }}>
                      No spam. Unsubscribe any time.
                    </p>
                  </form>
                ) : (
                  <form onSubmit={onStep2}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle} htmlFor="gm-parcel">Parcel shipments per month</label>
                      <select id="gm-parcel" style={{ ...inputStyle, color: parcel ? ds.navy : "#9AA0B0" }} value={parcel} onChange={(e) => setParcel(e.target.value)} required>
                        <option value="" disabled>Select a range…</option>
                        {PARCEL_BANDS.map((b) => <option key={b} value={b} style={{ color: ds.navy }}>{b}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 22 }}>
                      <label style={labelStyle} htmlFor="gm-ltl">LTL shipments per month</label>
                      <select id="gm-ltl" style={{ ...inputStyle, color: ltl ? ds.navy : "#9AA0B0" }} value={ltl} onChange={(e) => setLtl(e.target.value)} required>
                        <option value="" disabled>Select a range…</option>
                        {LTL_BANDS.map((b) => <option key={b} value={b} style={{ color: ds.navy }}>{b}</option>)}
                      </select>
                    </div>
                    <button type="submit" disabled={busy} style={{ ...btnStyle, opacity: busy ? 0.6 : 1 }}>
                      {busy ? "Unlocking…" : "Show me the scorecard"}
                    </button>
                  </form>
                )}
                  </div>
                </div>
              </div>
            </Reveal>
          ) : (
            /* ── Results: a scorecard they keep filling in, not a printout.
                 Carries forward whatever they scored behind the gate, opens all
                 twelve, and totals out of 24 against the four supplied bands. ── */
            (() => {
              const v = verdict(total, answeredCount > 0);
              let n = 0; // display number, sequential across the groups
              return (
                <div>
                  {/* ── Scorecard ── */}
                  <div ref={scoreHeaderRef} style={{ background: ds.white, border: `1px solid ${ds.border}`, borderRadius: 20, padding: "26px 26px 22px", boxShadow: "0 8px 30px rgba(28,30,61,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                      <p style={{ ...sora, margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ds.orange }}>
                        Your scorecard
                      </p>
                      {answeredCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setScores({})}
                          style={{ ...inter, background: "none", border: 0, padding: 0, cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: ds.muted, textDecoration: "underline", textUnderlineOffset: 3 }}
                        >
                          Start over
                        </button>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
                      <h2 style={{ ...h2Style, margin: 0 }}>
                        {shownTotal}
                        <span style={{ color: "#A6ABBC", fontWeight: 700 }}> / {MAX_SCORE}</span>
                      </h2>
                      <span style={{ ...sora, fontSize: 13, fontWeight: 700, color: v.tone, background: v.bg, borderRadius: 999, padding: "8px 15px" }}>
                        {v.label}
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: "#E4E6EC", overflow: "hidden", marginTop: 16 }} aria-hidden>
                      <div style={{ width: `${(total / MAX_SCORE) * 100}%`, height: "100%", borderRadius: 999, background: ds.orange, transition: "width .25s" }} />
                    </div>
                    <p style={{ ...inter, margin: "16px 0 0", fontSize: 15, lineHeight: 1.65, color: ds.navy }}>
                      {v.body}
                    </p>
                    <p style={{ ...inter, margin: "10px 0 0", fontSize: 13.5, lineHeight: 1.6, color: ds.muted }}>
                      {answeredCount < ESSENTIALS.length
                        ? `${ESSENTIALS.length - answeredCount} of ${ESSENTIALS.length} still to score. `
                        : "All twelve scored. "}
                      Your answers stay on this page, so you can bookmark it and pick
                      up where you left off.
                    </p>
                  </div>

                  {/* ── The twelve, grouped ── */}
                  {GROUPS.map((g) => {
                    const groupMax = g.items.length * MAX_PER_ITEM;
                    const groupScore = g.items.reduce((a, i) => a + (scores[i] ?? 0), 0);
                    const groupDone = g.items.every((i) => scores[i] !== undefined);
                    return (
                      <div key={g.label} style={{ marginTop: 30 }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                          <h3 style={{ ...sora, margin: 0, fontSize: 17, fontWeight: 800, color: ds.navy, letterSpacing: "-0.01em" }}>
                            {g.label}
                          </h3>
                          <span style={{ ...sora, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: groupDone && groupScore === groupMax ? "#2F8F55" : ds.muted, whiteSpace: "nowrap" }}>
                            {/* A check means "all answered", not "all correct" —
                                a group scored straight zeroes is complete too. */}
                            {groupDone && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                            {groupScore}/{groupMax}
                          </span>
                        </div>
                        <p style={{ ...inter, margin: "0 0 14px", fontSize: 13.5, color: ds.muted }}>{g.blurb}</p>

                        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                          {g.items.map((idx) => {
                            const val = scores[idx];
                            const set = val !== undefined;
                            n += 1;
                            return (
                              <li
                                key={idx}
                                id={`gm-item-${idx}`}
                                style={{
                                  scrollMarginTop: 90,
                                  scrollMarginBottom: 110,
                                  background: set ? "#FFF8F4" : ds.white,
                                  border: `1.5px solid ${set ? "rgba(236,90,38,0.4)" : ds.border}`,
                                  borderRadius: 14,
                                  padding: "15px 17px",
                                  boxShadow: set ? "none" : "0 2px 10px rgba(28,30,61,0.04)",
                                  transition: "background .18s, border-color .18s",
                                }}
                              >
                                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                  <span style={{
                                    ...sora, flexShrink: 0, width: 26, height: 26, borderRadius: 8, marginTop: 1,
                                    background: set ? ds.orange : ds.surface,
                                    border: `1.5px solid ${set ? ds.orange : ds.border}`,
                                    color: set ? ds.white : "#9AA0B0",
                                    fontSize: 12.5, fontWeight: 800,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                  }}>
                                    {n}
                                  </span>
                                  <span>
                                    <span style={{ ...sora, display: "block", fontSize: 15.5, fontWeight: 800, lineHeight: 1.35, color: ds.navy, letterSpacing: "-0.01em" }}>
                                      {ESSENTIALS[idx].title}
                                    </span>
                                    <span style={{ ...inter, display: "block", marginTop: 4, fontSize: 14.5, lineHeight: 1.55, color: ds.muted }}>
                                      {ESSENTIALS[idx].body}
                                    </span>
                                  </span>
                                </div>
                                {/* Selector sits under the text and indented to the
                                    number's gutter, so long items don't squeeze it
                                    into an unreadable column on a phone. */}
                                <div className="gm-score-row" style={{ marginTop: 12, marginLeft: 40 }}>
                                  <ScoreSelect value={val} onPick={(picked) => setScore(idx, picked)} />
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    );
                  })}

                  {/* ── By-area breakdown, once every item is scored. Holding it
                       back until then is deliberate: a "weakest area" verdict
                       drawn from four answers would be noise, and it gives the
                       twelfth pick a payoff instead of just filling a bar. ── */}
                  {allScored && (() => {
                    const rows = GROUPS.map((g) => {
                      const max = g.items.length * MAX_PER_ITEM;
                      const got = g.items.reduce<number>((a, i) => a + (scores[i] ?? 0), 0);
                      return { label: g.label, got, max, pct: got / max };
                    });
                    const weakest = rows.reduce((lo, r) => (r.pct < lo.pct ? r : lo), rows[0]);
                    return (
                      <div style={{ marginTop: 30, background: ds.white, border: `1px solid ${ds.border}`, borderRadius: 18, padding: "24px 24px 20px", boxShadow: "0 8px 30px rgba(28,30,61,0.06)" }}>
                        <p style={{ ...sora, margin: "0 0 18px", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ds.orange }}>
                          Where you stand by area
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {rows.map((r) => (
                            <div key={r.label}>
                              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                                <span style={{ ...inter, fontSize: 14, fontWeight: 600, color: ds.navy }}>{r.label}</span>
                                <span style={{ ...sora, fontSize: 13, fontWeight: 800, color: r === weakest ? ds.orange : ds.muted, whiteSpace: "nowrap" }}>
                                  {r.got}/{r.max}
                                </span>
                              </div>
                              <div style={{ height: 6, borderRadius: 999, background: "#EDEFF3", overflow: "hidden" }} aria-hidden>
                                <div style={{ width: `${r.pct * 100}%`, height: "100%", borderRadius: 999, background: r === weakest ? ds.orange : "#C3C8D4", transition: "width .3s" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p style={{ ...inter, margin: "20px 0 0", fontSize: 14.5, lineHeight: 1.65, color: ds.navy }}>
                          Your weakest area is <strong>{weakest.label.toLowerCase()}</strong>, at{" "}
                          {weakest.got} of {weakest.max}. That&rsquo;s the one worth fixing first.
                        </p>
                      </div>
                    );
                  })()}

                  {/* ── Closing insight, his wording verbatim. Deliberately a
                       light pull-quote, not navy: the offer box directly below is
                       navy, and two dark blocks in a row merged into one slab and
                       cost the offer its emphasis. ── */}
                  <div style={{ marginTop: 30, padding: "22px 24px", background: ds.surface, border: `1px solid ${ds.border}`, borderLeft: `3px solid ${ds.orange}`, borderRadius: 14 }}>
                    <p style={{ ...sora, margin: "0 0 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ds.orange }}>
                      ShipTime insight
                    </p>
                    <p style={{ ...inter, margin: 0, fontSize: 15.5, lineHeight: 1.7, color: ds.navy }}>
                      {INSIGHT}
                    </p>
                  </div>

                  <div ref={offerRef} style={{ marginTop: 20 }}>
                    <OfferBox variant={variant} rounded email={email} />
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <section style={{ background: ds.surface, borderTop: `1px solid ${ds.border}`, padding: "68px 20px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <p style={{ ...sora, margin: "0 0 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ds.orange }}>How it works</p>
            <h2 style={{ ...h2Style, maxWidth: 620 }}>Three steps, no sales call</h2>
          </Reveal>
          <div className="gm-3col" style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr", marginTop: 36 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 110}>
                <div style={{ background: ds.white, border: `1px solid ${ds.border}`, borderRadius: 20, overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "relative", aspectRatio: "16 / 10", background: ds.lightBlue }}>
                    <Image src={s.img} alt="" fill sizes="(min-width:900px) 33vw, 100vw" style={{ objectFit: "cover" }} />
                    <span style={{ ...sora, position: "absolute", top: 14, left: 14, width: 32, height: 32, borderRadius: 10, background: ds.orange, color: ds.white, fontSize: 14.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(28,30,61,0.25)" }}>
                      {s.n}
                    </span>
                  </div>
                  <div style={{ padding: "22px 22px 24px" }}>
                    <p style={{ ...sora, margin: "0 0 8px", fontWeight: 800, fontSize: 17, color: ds.navy }}>{s.title}</p>
                    <p style={{ ...inter, margin: 0, fontSize: 14.5, lineHeight: 1.65, color: ds.muted }}>{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY SHIPTIME ── */}
      <section style={{ background: ds.white, padding: "68px 20px" }}>
        <div className="gm-why" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gap: 44, gridTemplateColumns: "1fr", alignItems: "center" }}>
          <Reveal>
            <p style={{ ...sora, margin: "0 0 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ds.orange }}>Why ShipTime</p>
            <h2 style={h2Style}>Built for brands shipping their first few thousand orders</h2>
            <p style={{ ...inter, margin: "16px 0 30px", fontSize: 15.5, lineHeight: 1.7, color: ds.muted, maxWidth: 520 }}>
              We work with thousands of Canadian and North American businesses — a lot of them
              at exactly your stage.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {TRUST.map((t) => (
                <div key={t.title} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 25, height: 25, borderRadius: 999, background: ds.orange, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    <svg width="13" height="10" viewBox="0 0 12 9" fill="none"><path d="M1 4.5l3.2 3.2L11 1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <div>
                    <p style={{ ...sora, margin: "0 0 5px", fontWeight: 800, fontSize: 16.5, color: ds.navy }}>{t.title}</p>
                    <p style={{ ...inter, margin: 0, fontSize: 14.5, lineHeight: 1.65, color: ds.muted }}>{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", maxWidth: 460, margin: "0 auto", boxShadow: "0 20px 60px rgba(28,30,61,0.16)" }}>
              {/* Lifestyle photography to match the hero — the studio-portrait
                  set (core-include-*) sits on synthetic pastel gradients and
                  clashes badly next to it. */}
              <Image src="/generated/grommet-why.png" alt="A brand owner with shipping under control" width={1024} height={1024} sizes="(min-width:940px) 42vw, 100vw" style={{ display: "block", width: "100%", height: "auto", objectFit: "cover" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 5. OFFER (repeated at the foot) ── */}
      <section id="create-account" style={{ background: ds.surface, borderTop: `1px solid ${ds.border}`, padding: "68px 20px", scrollMarginTop: 70 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Reveal>
            <OfferBox variant={variant} rounded cta="form" email={email} />
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: ds.navyDeep, padding: "34px 20px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Reversed lockup: the standard logo's wordmark is #151515, which
                  was all but invisible on this navy — it only became obvious once
                  a white Grommet mark sat beside it. shiptime-logo-white.svg is
                  the same file with the 23 wordmark paths switched to white; the
                  icon keeps its orange, so the brand colour survives. */}
              <Image src="/shiptime-logo-white.svg" alt="ShipTime" width={120} height={30} style={{ height: 27, width: "auto", opacity: 0.92 }} />
              <span aria-hidden style={{ ...inter, fontSize: 14, lineHeight: 1, color: "rgba(255,255,255,0.4)" }}>×</span>
              {/* Grommet publish this wordmark as a single black path, so one
                  asset covers both surfaces: invert() reverses it to white here
                  rather than shipping a second file. */}
              <Image src="/grommet-logo.svg" alt="Grommet" width={128} height={18} style={{ height: 13, width: "auto", filter: "invert(1)", opacity: 0.86 }} />
            </div>
            <p style={{ ...inter, margin: "12px 0 0", fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", maxWidth: 420 }}>
              ShipTime gives growing brands discounted rates across every major carrier, parcel
              and freight, from one screen — with a support team based in Canada.
            </p>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <a href="https://shiptime.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ ...inter, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Privacy</a>
            <a href="https://shiptime.com/terms-of-service/" target="_blank" rel="noopener noreferrer" style={{ ...inter, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Terms</a>
            <span style={{ ...inter, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© {new Date().getFullYear()} ShipTime</span>
          </div>
        </div>
      </footer>

      {/* Single stacked column on mobile (most of this traffic is email clicks);
          two columns and a 3-up step row from the breakpoints below. */}
      {/* ── Docked running score ──────────────────────────────────────────────
           Only while the scorecard header is out of view and the offer hasn't
           arrived yet, so it fills the stretch where the total would otherwise
           be invisible. Rendered outside the section (not position: sticky
           inside it) because the section's own transforms would trap a fixed
           child, the same containing-block trap the nav's backdrop-filter set
           for the lead modal. */}
      {step === "done" && (
        <div
          aria-live="polite"
          style={{
            position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 40,
            display: "flex", justifyContent: "center",
            padding: "0 14px calc(14px + env(safe-area-inset-bottom, 0px))",
            pointerEvents: showDock ? "auto" : "none",
            opacity: showDock ? 1 : 0,
            transform: showDock ? "translateY(0)" : "translateY(115%)",
            transition: "opacity .22s ease, transform .28s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 14, flexWrap: "nowrap",
            maxWidth: 720, width: "100%",
            background: "rgba(22,24,47,0.97)", backdropFilter: "blur(8px)",
            borderRadius: 16, padding: "11px 12px 11px 18px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.32)",
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ ...sora, fontSize: 19, fontWeight: 800, color: ds.white, lineHeight: 1 }}>
                  {shownTotal}
                  <span style={{ color: "rgba(255,255,255,0.45)" }}> / {MAX_SCORE}</span>
                </span>
                <span className="gm-dock-band" style={{ ...sora, fontSize: 11.5, fontWeight: 700, color: verdict(total, answeredCount > 0).tone, background: verdict(total, answeredCount > 0).bg, borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {verdict(total, answeredCount > 0).label}
                </span>
              </div>
              <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.16)", overflow: "hidden", marginTop: 8 }} aria-hidden>
                <div style={{ width: `${(total / MAX_SCORE) * 100}%`, height: "100%", borderRadius: 999, background: ds.orange, transition: "width .25s" }} />
              </div>
            </div>

            {nextUnanswered !== undefined ? (
              <button
                type="button"
                onClick={jumpToNext}
                style={{ ...sora, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 7, background: ds.orange, color: ds.white, border: 0, borderRadius: 999, padding: "10px 15px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <span className="gm-dock-full">{ESSENTIALS.length - answeredCount} left</span>
                <span className="gm-dock-short">{ESSENTIALS.length - answeredCount}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              </button>
            ) : (
              <a
                href="#create-account"
                style={{ ...sora, flexShrink: 0, background: ds.orange, color: ds.white, borderRadius: 999, padding: "10px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}
              >
                Claim your credit
              </a>
            )}
          </div>
        </div>
      )}
      <style>{`
        @media (min-width: 760px) {
          .gm-3col { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 940px) {
          .gm-hero    { grid-template-columns: 1.1fr 0.9fr !important; gap: 60px !important; }
          .gm-why     { grid-template-columns: 1fr 0.82fr !important; gap: 64px !important; }
          .gm-capture { grid-template-columns: 1fr 0.82fr !important; gap: 56px !important; align-items: start !important; }
          /* The checklist document is roughly twice the form's height, which left
             a large empty navy block beside it. Sticking the form keeps the CTA
             in view the whole way down the document instead. Needs the
             align-items: start above — a stretched grid item can't stick. */
          .gm-form-col { position: sticky; top: 88px; }
        }
        /* The checklist document stays on phones — it's the interactive part of
           the section and most of this traffic is mobile email clicks, so hiding
           it would hide the whole hook. It sits above the form, and its lock
           seal links to #gm-form, so the form is always one tap away. Just
           tighten it up at small sizes. */
        @media (max-width: 640px) {
          .gm-peek { margin-top: 26px !important; }
        }
        @media (max-width: 939px) {
          .gm-hero-visual { max-width: 420px; margin: 0 auto; }
        }
        /* Two wordmarks plus the header CTA is a lot for a narrow phone. The
           lockup is ~20px wider than the "× Grommet" text it replaced, which is
           enough to overflow a 320px screen, so the logos and the button shrink
           together in two tiers. At 24px/11px the two wordmarks are both 78px
           wide, which keeps them optically matched as they scale. */
        .gm-cta-short { display: none; }
        @media (max-width: 520px) {
          .gm-brand    { gap: 8px !important; }
          .gm-brand-st { height: 24px !important; }
          .gm-brand-gm { height: 11px !important; }
          .gm-nav-cta  { padding: 8px 14px !important; font-size: 12.5px !important; }
        }
        /* Focus ring for the score buttons — the card is fully keyboard-driven
           (arrows move along the scale), so focus has to be visible. */
        .gm-score-btn:focus-visible {
          outline: 2px solid #EC5A26;
          outline-offset: 2px;
        }
        /* The docked bar's band label is the first thing to give up room. */
        .gm-dock-short { display: none; }
        @media (max-width: 460px) {
          .gm-dock-band  { max-width: 110px; }
          .gm-dock-full  { display: none; }
          .gm-dock-short { display: inline; }
        }
        @media (max-width: 380px) {
          .gm-brand     { gap: 6px !important; }
          .gm-brand-st  { height: 21px !important; }
          .gm-brand-gm  { height: 10px !important; }
          .gm-nav-cta   { padding: 8px 13px !important; }
          .gm-cta-long  { display: none !important; }
          .gm-cta-short { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
