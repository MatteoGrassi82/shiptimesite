import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import {
  ArrowRight,
  Globe2,
  Layers,
  MapPinOff,
  Network,
  PackageSearch,
  Repeat,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { LeadForm } from "@/components/sections/LeadForm";
import { Reveal } from "@/components/ui/reveal";
import DotPattern from "@/components/ui/dot-pattern-1";

// ── /warehouse — the wrong-location wedge ────────────────────────────────────
// Same structural family as /parcelforum (problem → who → solution → how it
// works → offer → talk), same chromeless treatment for a hand-off/outreach
// landing page, but this page has no printed banner to match, so it uses the
// real Plus brand tokens (--brand, --brand-2, --ink, --font-display) instead
// of parcelforum's banner-sampled PF palette. See app/(plus)/parcelforum for
// that page's own note on why its colors are local to it.
//
// The pitch, from the warehouse strategy note (Austin's call, 2026-08-25):
// not "20% off shipping" — "you're shipping from the wrong location." The
// signals below (cross-border, freight/bulky, multi-channel, multi-location)
// are the same four the ecom-lead signal dataset classifies as Plus-fit
// candidates for this pitch specifically.
//
// Deliberately no case-study section: unlike parcelforum's two proof cases
// (Michael's own, anonymized pending permission), there is no verified
// customer result for the location-audit pitch yet. Nothing here should read
// as a specific customer outcome until one is signed off — the "network"
// claim below stays qualitative, matching parcelforum's own restraint, not
// the "2,600+" figure floated on the strategy call, which hasn't been vetted
// for public copy.
//
// noindex for now: this is prep for an outreach flow, not a launched page —
// drop the noindex once sign-off happens per the campaign package's "still
// open, check before launching" note.

export const metadata: Metadata = {
  title: "The Free Shipping Audit | ShipTime",
  description:
    "Most brands optimize their carrier. Few ever check their location. A free audit of where you ship from, and what moving would actually be worth.",
  robots: "noindex",
};

const BOOK_HREF =
  process.env.NEXT_PUBLIC_PLUS_CALENDAR_URL ||
  process.env.NEXT_PUBLIC_LEAD_CALENDAR_URL ||
  "/plus/book-a-call";
const bookProps = BOOK_HREF.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

const container: CSSProperties = { maxWidth: 1220, margin: "0 auto", padding: "clamp(64px, 8vw, 128px) clamp(22px, 4vw, 56px)" };

function Kicker({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p
      className="st-eyebrow"
      style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, margin: 0, color: onDark ? "rgba(255,255,255,0.74)" : undefined }}
    >
      <span style={{ width: 7, height: 7, background: "var(--brand)", flex: "none" }} />
      {children}
    </p>
  );
}

function H2({ children, onDark = false, size = "clamp(2.1rem, 4.4vw, 3.4rem)" }: { children: ReactNode; onDark?: boolean; size?: string }) {
  return (
    <h2 className="st-display" style={{ fontSize: size, color: onDark ? "#fff" : "var(--ink)", margin: "18px 0 0" }}>
      {children}
    </h2>
  );
}

function Lead({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p
      className="st-body"
      style={{ fontSize: "clamp(1.02rem, 1.4vw, 1.18rem)", fontWeight: 500, lineHeight: 1.62, color: onDark ? "rgba(255,255,255,0.78)" : "var(--ink-2)", margin: "16px 0 0", maxWidth: "58ch" }}
    >
      {children}
    </p>
  );
}

const btnBase: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, borderRadius: "var(--radius-pill)", padding: "14px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none" };
const btnPrimary: CSSProperties = { ...btnBase, background: "var(--brand)", color: "var(--on-brand)" };
const btnOnDark: CSSProperties = { ...btnBase, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 600 };
const btnOnLight: CSSProperties = { ...btnBase, border: "1px solid var(--line)", background: "var(--card)", color: "var(--ink)", fontWeight: 600 };

// The four signals the outreach dataset actually classifies as location-fit
// (see the warehouse-wedge strategy note): cross-border, freight/bulky,
// multi-channel, multi-location. Kept in that source order.
const SIGNALS = [
  { icon: Globe2, t: "You ship across borders", d: "Every cross-border order carries a customs and duties cost that a location on the other side of that border wouldn't." },
  { icon: PackageSearch, t: "You carry bulky or oversized items", d: "Standard parcel carriers charge dimensional weight the farther a heavy item has to travel." },
  { icon: Layers, t: "You run wholesale and DTC together", d: "Two channels often means two shipping setups, and neither one designed around where the other ships from." },
  { icon: MapPinOff, t: "You run more than one location already", d: "Multiple sites usually means nobody has gone back to check whether each one is still shipping the right orders." },
];

const PROCESS = [
  { icon: Scale, t: "Tell us how you ship today", d: "Where you fulfill from, what you carry, and where your orders actually go. No CSV, no integration, just the shape of your operation." },
  { icon: Network, t: "We check it against the network", d: "Your setup compared against certified fulfillment options across the network, not a rate card." },
  { icon: ShieldCheck, t: "You get a plain read, free", d: "What we found, whether location is actually costing you, and what moving would realistically be worth. No commitment either way." },
];

export default function WarehouseAuditPage() {
  return (
    <main className="st-body" style={{ background: "var(--page)" }}>
      {/* ── hero ──────────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--contrast)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1.4px, transparent 2px)", backgroundSize: "14px 14px" }} />
        <div aria-hidden style={{ position: "absolute", right: -220, top: -240, width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(closest-side, color-mix(in oklab, var(--brand) 42%, transparent), color-mix(in oklab, var(--brand) 12%, transparent) 55%, transparent 72%)" }} />

        <div style={{ position: "relative", maxWidth: 1220, margin: "0 auto", padding: "22px clamp(22px, 4vw, 56px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <img src="/shiptime-logo-white.svg" alt="ShipTime" width={163} height={50} style={{ height: 40, width: "auto", display: "block" }} />
          <a href={BOOK_HREF} {...bookProps} style={{ ...btnOnDark, padding: "12px 20px", fontSize: 14 }}>
            Book a call
          </a>
        </div>

        <div style={{ ...container, position: "relative", paddingTop: "clamp(48px, 6vw, 88px)" }}>
          <div className="wh-split" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "clamp(36px, 5vw, 80px)", alignItems: "end" }}>
            <div>
              <Kicker onDark>The free shipping audit</Kicker>
              <h1
                style={{
                  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  letterSpacing: "0.005em",
                  lineHeight: 0.98,
                  fontSize: "clamp(3rem, 7.6vw, 5.8rem)",
                  color: "#fff",
                  margin: "18px 0 0",
                }}
              >
                You're probably shipping from
                <span style={{ display: "block", color: "var(--brand)" }}>the wrong location.</span>
              </h1>
              <Lead onDark>
                Most brands optimize the carrier and never check the location. We'll run the audit for free: what we
                find, what it's costing you, and what a better location would actually be worth. No commitment either
                way.
              </Lead>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40 }}>
                <a href="#audit" style={btnPrimary}>
                  Get your free audit <ArrowRight size={15} />
                </a>
                <a href={BOOK_HREF} {...bookProps} style={btnOnDark}>
                  Talk to us instead
                </a>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: "clamp(22px, 2.6vw, 34px)", backdropFilter: "blur(6px)" }}>
              <Kicker onDark>What the audit checks</Kicker>
              {SIGNALS.map((s, i) => (
                <div key={s.t} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderTop: i ? "1px solid rgba(255,255,255,0.14)" : "none", marginTop: i ? 0 : 14 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 11, background: "var(--brand)", color: "#fff", flex: "none" }}>
                    <s.icon size={18} strokeWidth={2} />
                  </span>
                  <div>
                    <div className="st-display" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.2rem)", color: "#fff" }}>{s.t}</div>
                    <p className="st-body" style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.72)", margin: "5px 0 0" }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── the reframe ───────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--page)" }}>
        <div style={container}>
          <Reveal>
            <div style={{ maxWidth: 720 }}>
              <Kicker>The reframe</Kicker>
              <H2>A rate is a number. A location is a decision.</H2>
              <Lead>
                Shaving a percent off a carrier rate is a negotiation you have every year. Shipping from the wrong
                place is a decision made once, usually early, rarely revisited, and it compounds on every single
                order after it. That's the one worth checking.
              </Lead>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── who it's for ─────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={container}>
          <Reveal>
            <div style={{ maxWidth: 720 }}>
              <Kicker>Signs it's worth checking</Kicker>
              <H2>If any of these sound familiar.</H2>
              <Lead>These are the setups where location usually turns out to matter more than rate.</Lead>
            </div>
          </Reveal>
          <div className="wh-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: "clamp(40px, 5vw, 60px)" }}>
            {SIGNALS.map((s, i) => (
              <Reveal key={s.t} delay={i * 90}>
                <div className="st-lift" style={{ height: "100%", background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--radius-card)", padding: "24px 22px 26px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 11, background: "var(--st-orange-tint, #fff4ef)", color: "var(--brand)" }}>
                    <s.icon size={18} strokeWidth={2} />
                  </span>
                  <h3 className="st-body" style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.25, color: "var(--ink)", margin: "14px 0 0", letterSpacing: "-0.01em" }}>{s.t}</h3>
                  <p className="st-body" style={{ fontSize: 13, lineHeight: 1.58, color: "var(--ink-2)", margin: "7px 0 0" }}>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── the network ──────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--contrast)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1.4px, transparent 2px)", backgroundSize: "14px 14px" }} />
        <div style={{ ...container, position: "relative" }}>
          <div className="wh-split" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "center" }}>
            <Reveal>
              <div>
                <Kicker onDark>What we check it against</Kicker>
                <H2 onDark>A large network of certified fulfillment locations, not a guess.</H2>
                <Lead onDark>
                  The audit isn't "move to a bigger warehouse." It's your actual order pattern checked against real,
                  certified fulfillment options across the network, so what comes back is a specific answer, not a
                  rule of thumb.
                </Lead>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <img
                src="/generated/wh-network.webp"
                alt="A warehouse worker checking a pallet with a handheld scanner in a long aisle of racking"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", borderRadius: 22, display: "block", border: "1px solid rgba(255,255,255,0.14)" }}
              />
            </Reveal>
          </div>
          <div className="wh-cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(44px, 5vw, 64px)" }}>
            {[
              { icon: Network, t: "Certified warehouses", d: "Across the US and Canada, so inventory can sit where demand actually is." },
              { icon: Globe2, t: "Connected carriers", d: "Couriers, final mile, and freight providers compared on every shipment." },
              { icon: Repeat, t: "Re-checked as you grow", d: "The right location today isn't necessarily the right one at 5X volume." },
            ].map((o, i) => (
              <Reveal key={o.t} delay={i * 100}>
                <div style={{ height: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: "26px 24px 28px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "var(--brand)", color: "#fff" }}>
                    <o.icon size={20} strokeWidth={2} />
                  </span>
                  <h3 className="st-display" style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.4rem)", color: "#fff", margin: "16px 0 0" }}>{o.t}</h3>
                  <p className="st-body" style={{ fontSize: 13.5, lineHeight: 1.58, color: "rgba(255,255,255,0.72)", margin: "6px 0 0" }}>{o.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── how it works ─────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--page)" }}>
        <div style={container}>
          <Reveal>
            <div style={{ maxWidth: 720 }}>
              <Kicker>How the audit works</Kicker>
              <H2>Three steps. Nothing to integrate.</H2>
            </div>
          </Reveal>
          <div className="wh-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "center", marginTop: "clamp(40px, 5vw, 60px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {PROCESS.map((p, i) => (
                <Reveal key={p.t} delay={i * 90}>
                  <div className="st-lift" style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--radius-card)", padding: "22px 22px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span className="st-display" style={{ fontSize: 18, color: "var(--brand)", flex: "none" }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="st-body" style={{ fontSize: 16.5, fontWeight: 800, lineHeight: 1.25, color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>{p.t}</h3>
                      <p className="st-body" style={{ fontSize: 13.5, lineHeight: 1.58, color: "var(--ink-2)", margin: "6px 0 0" }}>{p.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <img
                src="/generated/wh-audit-review.webp"
                alt="Two logistics colleagues reviewing a highlighted map on a warehouse desk"
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", borderRadius: 22, display: "block", border: "1px solid var(--line)" }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── the belief plate ─────────────────────────────────────────────────── */}
      <section style={{ background: "var(--page)", paddingBottom: "clamp(40px, 6vw, 80px)" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto", padding: "0 clamp(22px, 4vw, 56px)" }}>
          <Reveal>
            <div style={{ position: "relative", border: "1px solid var(--line)", background: "var(--card)" }}>
              <DotPattern width={7} height={7} cr={0.7} className="fill-[#1c1e3d]/[0.06] md:fill-[#1c1e3d]/[0.08]" />
              {[{ top: -4, left: -4 }, { bottom: -4, left: -4 }, { top: -4, right: -4 }, { bottom: -4, right: -4 }].map((pos, i) => (
                <span key={i} aria-hidden style={{ position: "absolute", width: 8, height: 8, background: "var(--brand)", ...pos }} />
              ))}
              <div style={{ position: "relative", zIndex: 1, padding: "clamp(32px, 5vw, 72px) clamp(24px, 4vw, 64px)", textAlign: "center" }}>
                <Kicker>What we believe</Kicker>
                <div className="st-display" style={{ fontSize: "clamp(1.9rem, 5vw, 3.8rem)", color: "var(--ink)", marginTop: "clamp(18px, 2.5vw, 30px)", lineHeight: 1.1 }}>
                  A cheaper carrier fixes a symptom.{" "}
                  <span style={{ color: "var(--brand)" }}>The right location fixes the cause.</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── the offer ─────────────────────────────────────────────────────────── */}
      <section id="audit" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <div style={container}>
          <div className="wh-split" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(36px, 5vw, 72px)", alignItems: "center" }}>
            <div>
              <Kicker>Your free shipping audit</Kicker>
              <H2>Get your read.</H2>
              <Lead>
                Tell us how you ship today. We'll check it against the network and send back a plain read on whether
                location is costing you, and what moving would realistically be worth. Free, no commitment.
              </Lead>
            </div>
            <LeadForm
              source="warehouse-audit"
              submitLabel="Request my free audit"
              successHeading="Request received."
              successBody="We'll take a look at your setup and get back to you with what we find."
              fields={[
                { name: "firstName", label: "First name", type: "text", required: true },
                { name: "lastName", label: "Last name", type: "text", required: true },
                { name: "email", label: "Work email", type: "email", required: true },
                { name: "company", label: "Company", type: "text", required: true },
                {
                  name: "shippingProfile",
                  label: "How do you ship today?",
                  type: "textarea",
                  required: false,
                  placeholder: "Where you fulfill from, what you carry, and where most orders go.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── talk to us ────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--contrast)" }}>
        <img
          src="/generated/wh-cta.webp"
          alt=""
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }}
        />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(28,30,61,0.4) 0%, rgba(28,30,61,0.1) 45%, rgba(28,30,61,0.3) 100%)" }} />
        <div style={{ ...container, position: "relative", minHeight: "min(64svh, 560px)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 22, padding: "clamp(28px, 3.4vw, 44px)", maxWidth: 520, width: "100%", boxShadow: "0 30px 70px -30px rgba(28,30,61,0.6)" }}>
            <Kicker>Talk to us</Kicker>
            <H2 size="clamp(1.9rem, 3.2vw, 2.6rem)">Prefer to just talk it through?</H2>
            <Lead>
              Thirty minutes with a logistics engineer: what you ship, where it hurts, and whether location is
              actually the issue. No audit required first.
            </Lead>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
              <a href={BOOK_HREF} {...bookProps} style={btnPrimary}>
                Book a call <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── footer ────────────────────────────────────────────────────────────── */}
      <footer style={{ background: "var(--contrast)", borderTop: "1px solid rgba(255,255,255,0.14)" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto", padding: "30px clamp(22px, 4vw, 56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="/shiptime-logo-white.svg" alt="ShipTime" width={163} height={50} style={{ height: 30, width: "auto", display: "block" }} />
            <span className="st-body" style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)" }}>The free shipping audit: where you ship from, checked.</span>
          </div>
          <span className="st-body" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>© 2026 ShipTime Canada Inc.</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 980px) {
          .wh-split { grid-template-columns: minmax(0, 1fr) !important; }
          .wh-cards { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .wh-cards-3 { grid-template-columns: minmax(0, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .wh-cards { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}
