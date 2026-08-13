"use client";

// ShipTime x Grommet co-marketing lander. Grommet links here from three
// automated emails (pre-launch, post-launch, Product of the Week winner), so
// the page has to work for cold mobile traffic: photo-led hero, a form section
// that saves after step 1, then the checklist revealed in place.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { captureAttribution, readAttribution, submitLead, trackLeadConversion } from "@/components/ui/lead-capture-form";
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

const CHECKLIST: string[] = [
  "Do you know your average package weight and dimensions, or are you guessing at checkout?",
  "Have you compared parcel rates from more than one carrier in the last 6 months?",
  "Do you know the point at which shipping from home stops being cheaper than a 3PL? (Hint: it's earlier than most brands think.)",
  "If a carrier misses a delivery window in December, do you have a backup plan?",
  "Do you know your return rate, and what it's costing you in reverse shipping?",
  "Are you shipping any orders LTL (pallets, bulky items), and if so, do you know that market moves differently than parcel?",
  "Do you have insurance or declared value coverage on shipments over a certain dollar amount?",
  "Can you generate a shipping label in under 2 minutes, or is it still a manual, per-order process?",
  "Do you know your carrier's Q4 cutoff dates for guaranteed delivery?",
  "If your order volume doubled next month, would your current shipping setup hold up?",
];

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

// Teased preview of the gated asset — the first few questions readable, the
// rest blurred behind a lock. Showing what's behind the gate converts far
// better than an unexplained form.
function ChecklistPeek() {
  const shown = CHECKLIST.slice(0, 3);
  const hidden = CHECKLIST.slice(3);
  return (
    <div style={{ position: "relative", background: ds.white, borderRadius: 18, boxShadow: "0 28px 70px rgba(0,0,0,0.35)", overflow: "hidden" }}>
      <div style={{ padding: "22px 24px 16px", borderBottom: `1px solid ${ds.border}` }}>
        <p style={{ ...sora, margin: 0, fontWeight: 800, fontSize: 14.5, color: ds.navy, lineHeight: 1.3 }}>
          The New Brand Shipping Readiness Checklist
        </p>
        <p style={{ ...inter, margin: "6px 0 0", fontSize: 12.5, color: ds.muted }}>10 questions · 2 minute read</p>
      </div>

      <div style={{ padding: "18px 24px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {shown.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
            <span style={{ ...sora, flexShrink: 0, width: 22, height: 22, borderRadius: 7, background: ds.lightBlue, color: ds.navy, fontSize: 11.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
            <span style={{ ...inter, fontSize: 13, lineHeight: 1.5, color: ds.navy }}>{q}</span>
          </div>
        ))}
      </div>

      {/* Locked remainder — blurred so it reads as real content, not filler */}
      <div style={{ position: "relative", padding: "14px 24px 34px", display: "flex", flexDirection: "column", gap: 14 }}>
        {hidden.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", filter: "blur(4.5px)", opacity: 0.55, userSelect: "none" }} aria-hidden>
            <span style={{ ...sora, flexShrink: 0, width: 22, height: 22, borderRadius: 7, background: ds.border, color: ds.navy, fontSize: 11.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 4}</span>
            <span style={{ ...inter, fontSize: 13, lineHeight: 1.5, color: ds.navy }}>{q}</span>
          </div>
        ))}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.82) 42%, ${ds.white} 78%)`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 22 }}>
          <span style={{ ...sora, display: "inline-flex", alignItems: "center", gap: 8, background: ds.navy, color: ds.white, borderRadius: 999, padding: "9px 18px", fontSize: 12.5, fontWeight: 700, boxShadow: "0 8px 22px rgba(28,30,61,0.28)" }}>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
              <rect x="1" y="6" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.4 6V4.2a2.6 2.6 0 015.2 0V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            7 more questions
          </span>
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
  { n: "2", title: "Get your checklist and score", body: "All 10 questions and the scoring guide appear right on this page, so you can work through them straight away.", img: "/generated/grommet-step-2.png" },
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
  const resultsRef = useRef<HTMLDivElement>(null);

  // Grommet's emails carry their own UTMs; store first-touch on arrival so the
  // values survive the two-step transition and aren't lost on submit.
  useEffect(() => {
    captureAttribution();
  }, []);

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
    try {
      await submitLead({
        email: email.trim(),
        firstname: parts[0],
        ...(parts.length > 1 ? { lastname: parts.slice(1).join(" ") } : {}),
        ...partnerFields,
        ...readAttribution(),
      });
    } catch {
      /* fail-soft: never block the visitor; step 2 writes again */
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
    // Bring the revealed checklist into view rather than leaving them staring
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
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <Image src="/shiptime-logo.svg" alt="ShipTime" width={130} height={32} style={{ height: 30, width: "auto" }} />
            <span style={{ ...inter, fontSize: 13, color: ds.muted }}>× Grommet</span>
          </div>
          <a href="#get-checklist" style={{ ...sora, background: ds.orange, color: ds.white, borderRadius: 999, padding: "9px 18px", fontSize: 13.5, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
            Get the checklist
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
              The New Brand Shipping{" "}
              <em style={{ fontStyle: "italic", fontWeight: 300, color: "#8B90A8" }}>Readiness</em> Checklist
            </h1>
            <p style={{ ...inter, margin: "20px 0 0", fontSize: 19, lineHeight: 1.55, color: ds.navy, fontWeight: 500, maxWidth: 480 }}>
              10 questions to answer before your first order ships.
            </p>
            <p style={{ ...inter, margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: ds.muted, maxWidth: 480 }}>
              Built for Grommet brands getting their first orders out the door. Answer these
              honestly and you&rsquo;ll know exactly where shipping is quietly costing you money.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 30 }}>
              <a href="#get-checklist" style={{ ...sora, background: ds.navy, color: ds.white, borderRadius: 999, padding: "15px 30px", fontSize: 15.5, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9 }}>
                Get the free checklist
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
            <div style={{ position: "absolute", top: 26, right: -6 }}><PillChip label="10-question checklist" /></div>
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
          background: step === "done" ? ds.white : ds.navy,
          padding: "68px 20px",
          scrollMarginTop: 70,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {step !== "done" && (
          <div aria-hidden style={{ position: "absolute", top: "-28%", right: "-14%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,90,38,0.30) 0%, rgba(236,90,38,0) 68%)", pointerEvents: "none" }} />
        )}

        <div style={{ maxWidth: step === "done" ? 720 : 1060, margin: "0 auto", position: "relative" }}>
          {step !== "done" ? (
            <Reveal>
              <div className="gm-capture" style={{ display: "grid", gap: 40, gridTemplateColumns: "1fr", alignItems: "center" }}>

                {/* LEFT — the pitch + the teased asset */}
                <div>
                  <span style={{ ...sora, display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: ds.orange, marginBottom: 14 }}>
                    Free download
                  </span>
                  <h2 style={{ ...h2Style, color: ds.white }}>
                    {step === 1 ? "Get your checklist" : "Almost there"}
                  </h2>
                  <p style={{ ...inter, margin: "14px 0 26px", fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.75)", maxWidth: 420 }}>
                    {step === 1
                      ? "Ten questions that surface where shipping is quietly costing you money. Free, no strings — you'll have it in about a minute."
                      : "Two quick details about your volume and the full checklist unlocks on this page."}
                  </p>
                  <div className="gm-peek"><ChecklistPeek /></div>
                </div>

                {/* RIGHT — the form */}
                <div style={{ borderRadius: 22, background: ds.white, boxShadow: "0 24px 70px rgba(0,0,0,0.32)", padding: "30px 28px" }}>
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
                      {busy ? "Unlocking…" : "Show me the checklist"}
                    </button>
                  </form>
                )}
                </div>
              </div>
            </Reveal>
          ) : (
            /* ── Results: the checklist as real content ── */
            <div>
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <span style={{ width: 46, height: 46, borderRadius: 999, background: "#EAF7EE", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon.Check size={23} style={{ stroke: "#3FA864" }} />
                </span>
                <h2 style={h2Style}>Here&rsquo;s your checklist</h2>
                <p style={{ ...inter, margin: "12px 0 0", fontSize: 15.5, color: ds.muted }}>
                  Yours to keep — bookmark this page so you can come back to it.
                </p>
              </div>

              <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {CHECKLIST.map((q, i) => (
                  <li key={i} style={{ display: "flex", gap: 15, alignItems: "flex-start", background: ds.white, border: `1px solid ${ds.border}`, borderRadius: 14, padding: "17px 19px", boxShadow: "0 2px 10px rgba(28,30,61,0.04)" }}>
                    <span style={{ ...sora, flexShrink: 0, width: 28, height: 28, borderRadius: 9, background: ds.lightBlue, color: ds.navy, fontSize: 13.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {i + 1}
                    </span>
                    <span style={{ ...inter, fontSize: 15.5, lineHeight: 1.6, color: ds.navy }}>{q}</span>
                  </li>
                ))}
              </ol>

              <div style={{ marginTop: 22, padding: "22px 24px", background: ds.surface, borderRadius: 16, border: `1px solid ${ds.border}` }}>
                <p style={{ ...sora, margin: "0 0 10px", fontWeight: 800, fontSize: 15.5, color: ds.navy }}>Score yourself</p>
                <p style={{ ...inter, margin: 0, fontSize: 15, lineHeight: 1.7, color: ds.navy }}>
                  7+ yes answers means you&rsquo;re in good shape. Below that, a few of these are
                  probably costing you money right now.
                </p>
                <p style={{ ...inter, margin: "14px 0 0", fontSize: 15, lineHeight: 1.7, color: ds.muted }}>
                  Most of the brands we talk to answer honestly on 3 or 4 of these. That&rsquo;s
                  normal at your stage, it&rsquo;s exactly why we built this.
                </p>
              </div>

              <div style={{ marginTop: 24 }}>
                <OfferBox variant={variant} rounded email={email} />
              </div>
            </div>
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
            <Image src="/shiptime-logo.svg" alt="ShipTime" width={120} height={30} style={{ height: 27, width: "auto", opacity: 0.9 }} />
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
      <style>{`
        @media (min-width: 760px) {
          .gm-3col { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 940px) {
          .gm-hero    { grid-template-columns: 1.1fr 0.9fr !important; gap: 60px !important; }
          .gm-why     { grid-template-columns: 1fr 0.82fr !important; gap: 64px !important; }
          .gm-capture { grid-template-columns: 1fr 0.82fr !important; gap: 56px !important; align-items: start !important; }
        }
        /* The teased preview is a nice-to-have — drop it on small screens so the
           form stays the first thing a phone visitor sees. */
        @media (max-width: 640px) {
          .gm-peek { display: none; }
        }
        @media (max-width: 939px) {
          .gm-hero-visual { max-width: 420px; margin: 0 auto; }
        }
      `}</style>
    </div>
  );
}
