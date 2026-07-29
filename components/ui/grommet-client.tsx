"use client";

// ShipTime x Grommet co-marketing lander. Grommet links here from three
// automated emails (pre-launch, post-launch, Product of the Week winner), so
// the page has to work for cold mobile traffic: lead magnet up front, two-step
// capture that saves after step 1, checklist revealed on completion.

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icons";
import { captureAttribution, readAttribution, submitLead } from "@/components/ui/lead-capture-form";

const ds = {
  navy: "#1C1E3D",
  muted: "#52566C",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface: "#F8FAFB",
  lightBlue: "#E3EEFC",
  white: "#FFFFFF",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

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

const OFFERS = {
  default: {
    eyebrow: "Your ShipTime offer",
    body: "Sign up with ShipTime within 30 days and get $20 in shipping credit toward your first shipments, issued as 2 x $10 credits so nothing goes to waste on smaller orders.",
  },
  winner: {
    eyebrow: "Product of the Week prize",
    body: "As part of your Product of the Week prize, get $50 in shipping credit toward scaling your fulfillment, issued as 5 x $10 credits. Redeem it when you sign up.",
  },
} as const;

export type OfferVariant = keyof typeof OFFERS;

const SIGNUP_URL = "https://app.shiptime.com/";
const SIGNUP_TAGGED = `${SIGNUP_URL}?utm_source=grommet&utm_medium=web&utm_campaign=grommet_checklist`;

// Offer block. Rendered in the form panel and again at the foot of the page, so
// someone who reads all the way down still has the incentive and a way to act.
function OfferBox({ variant, rounded = false }: { variant: OfferVariant; rounded?: boolean }) {
  const offer = OFFERS[variant];
  return (
    <div style={{ background: ds.navy, padding: 24, borderRadius: rounded ? 18 : 0 }}>
      <p style={{ ...sora, margin: "0 0 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ds.orange }}>
        {offer.eyebrow}
      </p>
      <p style={{ ...inter, margin: 0, fontSize: 14.5, lineHeight: 1.65, color: "rgba(255,255,255,0.9)" }}>
        {offer.body}
      </p>
      <a
        href={SIGNUP_TAGGED}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...sora, display: "block", textAlign: "center", marginTop: 18, background: ds.orange, color: ds.white, borderRadius: 999, padding: "13px 20px", fontSize: 14.5, fontWeight: 700, textDecoration: "none" }}
      >
        Create your free account
      </a>
      <p style={{ ...inter, margin: "10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
        No platform fee. No contract.
      </p>
    </div>
  );
}

// ── How it works: three steps, so the page has a reason to keep scrolling ──
const STEPS = [
  { n: "1", title: "Answer the questions", body: "Two quick details about your volume — parcel and LTL. Takes under a minute." },
  { n: "2", title: "Get your checklist and score", body: "All 10 questions and the scoring guide appear right on this page, and we send you a copy to keep." },
  { n: "3", title: "Sign up if it's useful", body: "If shipping is one of the gaps, create a free account and your shipping credit is applied." },
];

function HowItWorks() {
  return (
    <section style={{ background: ds.surface, borderTop: `1px solid ${ds.border}`, padding: "56px 20px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h2 style={{ ...sora, margin: "0 0 8px", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.1rem)", letterSpacing: "-0.02em", color: ds.navy }}>
          How it works
        </h2>
        <p style={{ ...inter, margin: "0 0 32px", fontSize: 15.5, color: ds.muted, maxWidth: 520 }}>
          Three steps, no sales call.
        </p>
        <div className="gm-3col" style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ background: ds.white, border: `1px solid ${ds.border}`, borderRadius: 16, padding: "24px 24px 26px" }}>
              <span style={{ ...sora, display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 10, background: ds.orange, color: ds.white, fontSize: 15, fontWeight: 800, marginBottom: 14 }}>
                {s.n}
              </span>
              <p style={{ ...sora, margin: "0 0 7px", fontWeight: 800, fontSize: 16.5, color: ds.navy }}>{s.title}</p>
              <p style={{ ...inter, margin: 0, fontSize: 14.5, lineHeight: 1.65, color: ds.muted }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why ShipTime: credibility below the form ──
const TRUST = [
  { title: "Deeply discounted rates", body: "Pre-negotiated pricing across every major carrier from your very first label — no volume minimum to unlock it." },
  { title: "No platform fee, no contract", body: "You pay for the labels you print and nothing else. Nothing to cancel if it isn't for you." },
  { title: "Every carrier on one screen", body: "Canada Post, Purolator, UPS, FedEx, GLS and LTL freight compared side by side, so the cheapest option is never a guess." },
  { title: "Real support, based in Canada", body: "Over 10,000 calls answered this year with an average time to answer of 26 seconds. You reach a person, not a queue." },
];

function WhyShipTime() {
  return (
    <section style={{ background: ds.white, borderTop: `1px solid ${ds.border}`, padding: "56px 20px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h2 style={{ ...sora, margin: "0 0 8px", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.1rem)", letterSpacing: "-0.02em", color: ds.navy }}>
          Why ShipTime
        </h2>
        <p style={{ ...inter, margin: "0 0 32px", fontSize: 15.5, color: ds.muted, maxWidth: 560 }}>
          We work with thousands of Canadian and North American businesses, a lot of them
          shipping their first few thousand orders.
        </p>
        <div className="gm-2col" style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }}>
          {TRUST.map((t) => (
            <div key={t.title} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 999, background: ds.orange, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                <svg width="13" height="10" viewBox="0 0 12 9" fill="none"><path d="M1 4.5l3.2 3.2L11 1" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div>
                <p style={{ ...sora, margin: "0 0 5px", fontWeight: 800, fontSize: 16, color: ds.navy }}>{t.title}</p>
                <p style={{ ...inter, margin: 0, fontSize: 14.5, lineHeight: 1.65, color: ds.muted }}>{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GrommetClient({ variant }: { variant: OfferVariant }) {
  const [step, setStep] = useState<1 | 2 | "done">(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [parcel, setParcel] = useState("");
  const [ltl, setLtl] = useState("");
  const [busy, setBusy] = useState(false);

  // Grommet's emails carry their own UTMs; store first-touch on arrival so the
  // values survive the two-step transition and aren't lost on submit.
  useEffect(() => {
    captureAttribution();
  }, []);

  // Tags every lead from this page as Grommet-sourced, distinct from other
  // sources, so referrals can be traced back to the partnership.
  const partnerFields = {
    partner_source: "grommet",
    grommet_offer: variant,
    lead_source: "grommet-checklist",
  };

  // Step 1 saves immediately — if they drop before answering the volume
  // questions we still have the lead.
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
  }

  const inputStyle: React.CSSProperties = {
    ...inter,
    width: "100%",
    borderRadius: 10,
    border: `1.5px solid ${ds.border}`,
    padding: "13px 15px",
    fontSize: 16, // 16px avoids iOS zoom-on-focus
    color: ds.navy,
    background: ds.white,
    outline: "none",
  };
  const labelStyle: React.CSSProperties = { ...inter, fontSize: 13, fontWeight: 600, color: ds.muted, marginBottom: 6, display: "block" };
  const btnStyle: React.CSSProperties = {
    ...sora, width: "100%", background: ds.orange, color: ds.white,
    border: 0, borderRadius: 999, padding: "15px 24px", fontSize: 15,
    fontWeight: 700, cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", background: ds.white, ...inter, color: ds.navy }}>
      {/* ── Header: logo only, no nav — nothing competing with the form ── */}
      <header style={{ borderBottom: `1px solid ${ds.border}`, padding: "16px 20px", background: ds.white }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/shiptime-logo.svg" alt="ShipTime" width={130} height={32} style={{ height: 30, width: "auto" }} />
          <span style={{ ...inter, fontSize: 13, color: ds.muted }}>× Grommet</span>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 72px" }}>
        <div style={{ display: "grid", gap: 40, gridTemplateColumns: "1fr", alignItems: "start" }} className="gm-grid">

          {/* ── LEFT: hero + checklist / reveal ── */}
          <div>
            <span style={{ ...sora, display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ds.orange, background: "#FBEEE9", padding: "6px 12px", borderRadius: 999, marginBottom: 18 }}>
              ShipTime × Grommet
            </span>
            <h1 style={{ ...sora, margin: 0, fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3.1rem)", lineHeight: 1.08, letterSpacing: "-0.03em", color: ds.navy }}>
              The New Brand Shipping Readiness Checklist
            </h1>
            <p style={{ ...inter, margin: "16px 0 0", fontSize: 18, lineHeight: 1.6, color: ds.muted, maxWidth: 520 }}>
              10 questions to answer before your first order ships.
            </p>
            <p style={{ ...inter, margin: "14px 0 0", fontSize: 15, lineHeight: 1.7, color: ds.muted, maxWidth: 520 }}>
              Built by ShipTime for Grommet brands getting their first orders out the door.
              Answer these honestly and you&rsquo;ll know exactly where shipping is quietly
              costing you money.
            </p>

            {step !== "done" ? (
              <div style={{ marginTop: 30, padding: "22px 24px", background: ds.surface, borderRadius: 16, border: `1px solid ${ds.border}`, maxWidth: 520 }}>
                <p style={{ ...sora, margin: 0, fontWeight: 700, fontSize: 15, color: ds.navy, marginBottom: 12 }}>What&rsquo;s inside</p>
                {["Where new brands overpay on parcel", "When a 3PL beats shipping from home", "What to lock down before Q4"].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}><Icon.Check size={17} style={{ stroke: ds.orange }} /></span>
                    <span style={{ ...inter, fontSize: 14.5, color: ds.navy }}>{t}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* ── Checklist reveal ── */
              <div style={{ marginTop: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 999, background: "#EAF7EE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon.Check size={19} style={{ stroke: "#3FA864" }} />
                  </span>
                  <p style={{ ...sora, margin: 0, fontWeight: 800, fontSize: 17, color: ds.navy }}>Here&rsquo;s your checklist</p>
                </div>
                <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {CHECKLIST.map((q, i) => (
                    <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: ds.white, border: `1px solid ${ds.border}`, borderRadius: 12, padding: "15px 17px" }}>
                      <span style={{ ...sora, flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: ds.lightBlue, color: ds.navy, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {i + 1}
                      </span>
                      <span style={{ ...inter, fontSize: 15, lineHeight: 1.6, color: ds.navy }}>{q}</span>
                    </li>
                  ))}
                </ol>
                <div style={{ marginTop: 20, padding: "18px 20px", background: ds.surface, borderRadius: 14, border: `1px solid ${ds.border}` }}>
                  <p style={{ ...inter, margin: 0, fontSize: 14.5, lineHeight: 1.7, color: ds.navy, fontStyle: "italic" }}>
                    Score yourself: 7+ yes answers means you&rsquo;re in good shape. Below that,
                    a few of these are probably costing you money right now.
                  </p>
                  <p style={{ ...inter, margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.7, color: ds.muted }}>
                    Most of the brands we talk to answer honestly on 3 or 4 of these.
                    That&rsquo;s normal at your stage, it&rsquo;s exactly why we built this.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: form / offer (sticky on desktop) ── */}
          <aside className="gm-aside">
            <div style={{ border: `1px solid ${ds.border}`, borderRadius: 18, background: ds.white, boxShadow: "0 10px 40px rgba(28,30,61,0.08)", overflow: "hidden" }}>

              {step === 1 && (
                <form onSubmit={onStep1} style={{ padding: "26px 24px" }}>
                  <p style={{ ...sora, margin: "0 0 4px", fontWeight: 800, fontSize: 19, color: ds.navy }}>Get the checklist</p>
                  <p style={{ ...inter, margin: "0 0 20px", fontSize: 14, color: ds.muted, lineHeight: 1.55 }}>
                    Free, and yours in two clicks.
                  </p>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle} htmlFor="gm-name">Name</label>
                    <input id="gm-name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Your name" />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle} htmlFor="gm-email">Email</label>
                    <input id="gm-email" type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@yourbrand.com" />
                  </div>
                  <button type="submit" disabled={busy} style={{ ...btnStyle, opacity: busy ? 0.6 : 1 }}>
                    {busy ? "Sending…" : "Continue"}
                  </button>
                  <p style={{ ...inter, margin: "12px 0 0", fontSize: 12, color: "#8A8FA3", textAlign: "center" }}>
                    No spam. Unsubscribe any time.
                  </p>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={onStep2} style={{ padding: "26px 24px" }}>
                  <p style={{ ...sora, margin: "0 0 4px", fontWeight: 800, fontSize: 19, color: ds.navy }}>Two quick questions</p>
                  <p style={{ ...inter, margin: "0 0 20px", fontSize: 14, color: ds.muted, lineHeight: 1.55 }}>
                    So we can point you at what actually applies to your volume.
                  </p>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle} htmlFor="gm-parcel">Parcel shipments per month</label>
                    <select id="gm-parcel" style={{ ...inputStyle, color: parcel ? ds.navy : "#9AA0B0" }} value={parcel} onChange={(e) => setParcel(e.target.value)} required>
                      <option value="" disabled>Select a range…</option>
                      {PARCEL_BANDS.map((b) => <option key={b} value={b} style={{ color: ds.navy }}>{b}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
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

              {step === "done" && (
                <div style={{ padding: "26px 24px" }}>
                  <p style={{ ...sora, margin: "0 0 6px", fontWeight: 800, fontSize: 19, color: ds.navy }}>You&rsquo;re all set</p>
                  <p style={{ ...inter, margin: 0, fontSize: 14, color: ds.muted, lineHeight: 1.6 }}>
                    The checklist is on this page — and we&rsquo;ve emailed a copy to {email}.
                  </p>
                </div>
              )}

              {/* ── Offer block (swaps on ?src=winner) ── */}
              <OfferBox variant={variant} />
            </div>
          </aside>
        </div>
      </main>

      <HowItWorks />
      <WhyShipTime />

      {/* ── Offer repeated at the foot, so anyone who scrolls the whole page
             still has the incentive and a way to act on it. ── */}
      <section style={{ background: ds.surface, borderTop: `1px solid ${ds.border}`, padding: "56px 20px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <OfferBox variant={variant} rounded />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: ds.navy, padding: "26px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <Image src="/shiptime-logo.svg" alt="ShipTime" width={120} height={30} style={{ height: 26, width: "auto", opacity: 0.9 }} />
            <p style={{ ...inter, margin: "10px 0 0", fontSize: 13, color: "rgba(255,255,255,0.55)", maxWidth: 420 }}>
              ShipTime gives growing brands discounted rates across every major carrier,
              parcel and freight, from one screen — with a support team based in Canada.
            </p>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <a href="https://shiptime.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ ...inter, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Privacy</a>
            <a href="https://shiptime.com/terms-of-service/" target="_blank" rel="noopener noreferrer" style={{ ...inter, fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Terms</a>
            <span style={{ ...inter, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© {new Date().getFullYear()} ShipTime</span>
          </div>
        </div>
      </footer>

      {/* Two columns from 900px up; single stacked column on mobile, where most
          of this traffic lands (email clicks). */}
      <style>{`
        @media (min-width: 700px) {
          .gm-2col { grid-template-columns: 1fr 1fr !important; gap: 26px 34px !important; }
        }
        @media (min-width: 900px) {
          .gm-grid { grid-template-columns: 1.15fr 0.85fr !important; gap: 56px !important; }
          .gm-aside { position: sticky; top: 28px; }
          .gm-3col { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
