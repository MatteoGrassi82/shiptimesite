import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ClientFeedback } from "@/components/plus-home/testimonial";

// ── /plus/v2 — Federato-inspired editorial build ─────────────────────────────
// Direction from Matteo (2026-07-12): copy the Federato section language —
// stacked rounded panels, serif editorial display, halftone dot textures,
// CONCEPTUAL art built from primitive shapes (scattered squares, orbit rings,
// maturity staircase, wired diagrams) instead of dashboard screenshots — but
// translated to an enterprisey LIGHT look: soft gray + orange, not cream/kraft.
//
// Motion layer: staggered scroll-reveals (shared [data-reveal] system) plus
// continuous CSS ambience — the orbit ring spins, agents pulse in sequence,
// dashed connectors "flow", scattered fragments float, halftone blobs breathe.
// All keyframes are gated behind prefers-reduced-motion.

const P = {
  gutter: "#E7E9EE", // page behind the panels (visible gaps = the panel-stack look)
  panel: "#FBFBFC",
  panelSoft: "#F3F4F7",
  card: "#FFFFFF",
  ink: "#1C1E3D",
  sub: "#5C6270",
  faint: "#9AA0AD",
  line: "#E3E5EA",
  dark: "#1C1E3D",
  darkLine: "rgba(255,255,255,0.14)",
  onDark: "#F4F5F8",
  onDarkDim: "rgba(244,245,248,0.66)",
  orange: "#EC5A26",
  orangeTint: "#FDEFE8",
};

const serif: CSSProperties = {
  fontFamily: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif',
  fontWeight: 400,
  letterSpacing: "-0.01em",
};
const sans: CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };

const dots = (color: string, size = 9, dot = 1.5): CSSProperties => ({
  backgroundImage: `radial-gradient(circle, ${color} ${dot}px, transparent ${dot + 0.5}px)`,
  backgroundSize: `${size}px ${size}px`,
});

// A "flowing" dashed line: repeating gradient whose background-position marches.
const flowLine = (vertical = false): CSSProperties => ({
  height: vertical ? undefined : 2,
  width: vertical ? 2 : undefined,
  backgroundImage: vertical
    ? "repeating-linear-gradient(180deg, #C9CDD6 0 5px, transparent 5px 10px)"
    : "repeating-linear-gradient(90deg, #C9CDD6 0 5px, transparent 5px 10px)",
});

// Soft halftone blob: dotted field masked to a radial falloff. Breathes slowly.
function HalftoneBlob({ color, style, delay = "0s" }: { color: string; style?: CSSProperties; delay?: string }) {
  return (
    <div
      aria-hidden
      className="v2-breathe"
      style={{
        position: "absolute",
        ...dots(color, 10, 2),
        WebkitMaskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
        maskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
        animationDelay: delay,
        ...style,
      }}
    />
  );
}

function Sparkle({ size = 16, color = P.orange, pulse = false, delay = "0s" }: { size?: number; color?: string; pulse?: boolean; delay?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden className={pulse ? "v2-pulse" : undefined} style={pulse ? { animationDelay: delay } : undefined}>
      <path d="M12 1.5 L14.4 9.6 L22.5 12 L14.4 14.4 L12 22.5 L9.6 14.4 L1.5 12 L9.6 9.6 Z" />
    </svg>
  );
}

function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p style={{ ...sans, display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: onDark ? P.onDarkDim : P.sub, margin: 0 }}>
      <span style={{ width: 6, height: 6, background: P.orange, flex: "none" }} />
      {children}
    </p>
  );
}

function PillLink({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link
      href={href}
      className="st-cta"
      style={{
        ...sans,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 10,
        background: dark ? P.ink : P.orange,
        color: "#fff",
        padding: "12px 22px",
        fontSize: 14.5,
        fontWeight: 700,
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

function GhostLink({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className="st-cta"
      style={{
        ...sans,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 10,
        border: `1px solid ${onDark ? P.darkLine : P.line}`,
        background: onDark ? "rgba(255,255,255,0.06)" : P.card,
        color: onDark ? P.onDark : P.ink,
        padding: "12px 22px",
        fontSize: 14.5,
        fontWeight: 600,
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

// Rounded full-width panel with the visible-gutter stacking Federato uses.
function Panel({ children, bg = P.panel, style }: { children: ReactNode; bg?: string; style?: CSSProperties }) {
  return (
    <section style={{ padding: "6px 10px" }}>
      <div style={{ position: "relative", overflow: "hidden", maxWidth: 1440, margin: "0 auto", background: bg, borderRadius: 26, ...style }}>
        {children}
      </div>
    </section>
  );
}

const inner: CSSProperties = { maxWidth: 1160, margin: "0 auto", padding: "clamp(52px, 7vw, 96px) clamp(20px, 4vw, 48px)" };

// ── §1 HERO — full-bleed centered statement over the ambient loop ───────────
const MODES_TICKER = ["Courier", "LTL", "Full truckload", "Ocean", "Customs", "Brokerage", "Fulfillment", "Inventory", "Bring your own rates", "Open API"];

function HeroFed() {
  return (
    <Panel bg={P.dark}>
      {/* ambient background: HyperFrames-rendered 8s seamless loop
          (videos/plus-hero-loop → public/generated/plus-hero-loop.mp4).
          Grid, halftone, and packet ambience are baked into the video;
          reduced-motion users get the plain navy panel instead. */}
      <video
        className="v2-herovid"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src="/generated/plus-hero-loop.mp4" type="video/mp4" />
      </video>

      {/* readability scrim so the loop never fights the type */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(75% 55% at 50% 46%, rgba(28,30,61,0.42) 0%, rgba(28,30,61,0.78) 62%, rgba(28,30,61,0.93) 100%)",
        }}
      />

      <div
        style={{
          ...inner,
          position: "relative",
          minHeight: "min(92svh, 940px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          paddingTop: "clamp(76px, 10vw, 150px)",
          paddingBottom: "clamp(44px, 6vw, 84px)",
        }}
      >
        <div className="v2-fade" style={{ animationDelay: "0.05s", display: "flex", justifyContent: "center" }}>
          <Eyebrow onDark>ShipTime Plus</Eyebrow>
        </div>

        <h1 style={{ ...serif, fontSize: "clamp(3.3rem, 8.8vw, 7.2rem)", lineHeight: 0.97, color: P.onDark, margin: "24px 0 0" }}>
          <span className="v2-line"><span className="v2-line-in" style={{ animationDelay: "0.1s" }}>Your logistics,</span></span>
          <span className="v2-line"><span className="v2-line-in" style={{ animationDelay: "0.26s", fontStyle: "italic" }}>on autopilot<span style={{ color: P.orange }}>.</span></span></span>
        </h1>

        <div className="v2-fade" style={{ animationDelay: "0.58s" }}>
          <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.5vw, 1.28rem)", lineHeight: 1.62, color: P.onDarkDim, maxWidth: "54ch", margin: "28px auto 0" }}>
            A logistics operating system designed around your operation — every mode, every carrier, every warehouse,
            orchestrated by embedded experts and AI built on your data.
          </p>
        </div>

        <div className="v2-fade" style={{ animationDelay: "0.76s" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 38, justifyContent: "center" }}>
            <PillLink href="/plus/book-a-call">
              Book a call <ArrowRight size={15} />
            </PillLink>
            <GhostLink href="/plus/assessment" onDark>
              Take the assessment
            </GhostLink>
          </div>
        </div>
      </div>

      {/* modes ticker along the hero's bottom edge */}
      <div style={{ position: "relative", borderTop: `1px solid ${P.darkLine}`, overflow: "hidden", padding: "15px 0" }}>
        <div className="v2-marq" style={{ display: "flex", width: "max-content" }}>
          {[...MODES_TICKER, ...MODES_TICKER].map((m, i) => (
            <span key={i} aria-hidden={i >= MODES_TICKER.length} style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 14, paddingRight: 46, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(244,245,248,0.42)", whiteSpace: "nowrap" }}>
              <span style={{ width: 5, height: 5, background: P.orange, opacity: 0.75, flex: "none" }} />
              {m}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ── §2 PROOF BENTO — the v1 testimonial block, reused ────────────────────────
// The Federato-style proof bento ported from the shiptime-plus v1 homepage
// (navy tiles, duotone portraits, geo decor). Its headings use the Tailwind
// `font-serif` utility, which the plus zone maps to Bricolage — re-point the
// variable to Instrument Serif inside this subtree so it matches v2's serif.
function ProofBento() {
  return (
    <Panel bg="#FFFFFF">
      <div style={{ ["--font-serif" as string]: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif' } as CSSProperties}>
        <ClientFeedback />
      </div>
    </Panel>
  );
}

// ── §3 PROBLEM band + contrast cards ─────────────────────────────────────────
function ProblemBand() {
  return (
    <Panel bg={P.dark}>
      <div className="v2-split" style={{ ...inner, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }}>
        <div style={{ position: "relative", minHeight: 220 }}>
          <HalftoneBlob color="rgba(236,90,38,0.5)" style={{ width: 300, height: 300, left: -20, top: -40 }} />
          <HalftoneBlob color="rgba(244,245,248,0.28)" style={{ width: 220, height: 220, left: 150, top: 40 }} delay="-5s" />
        </div>
        <div>
          <Reveal>
            <h2 style={{ ...serif, fontSize: "clamp(2rem, 4.2vw, 3.1rem)", lineHeight: 1.08, color: P.onDark, margin: 0 }}>
              Once, spreadsheets ran your logistics.
              <br />
              Now they&rsquo;re the bottleneck.
            </h2>
          </Reveal>
          <Reveal delay={110}>
            <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.65, color: P.onDarkDim, maxWidth: "52ch", margin: "16px 0 0" }}>
              Too fragmented to use all your data, too manual to scale, and too dependent on the two people who carry
              the logic in their heads.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div style={{ marginTop: 26 }}>
              <PillLink href="/plus/book-a-call">Design the system</PillLink>
            </div>
          </Reveal>
        </div>
      </div>
    </Panel>
  );
}

function ScatterVisual() {
  const squares = [
    { l: "14%", t: "18%" }, { l: "64%", t: "10%" }, { l: "38%", t: "38%" },
    { l: "80%", t: "44%" }, { l: "22%", t: "62%" }, { l: "56%", t: "72%" }, { l: "8%", t: "84%" },
  ];
  const tags = [
    { label: "Separate contracts", l: "48%", t: "16%" },
    { label: "Fragmented data", l: "12%", t: "44%" },
    { label: "Surprise surcharges", l: "44%", t: "86%" },
  ];
  return (
    <div style={{ position: "relative", background: P.dark, borderRadius: 18, minHeight: 320, overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, ...dots("rgba(255,255,255,0.06)", 12, 1.6) }} />
      <span style={{ ...sans, position: "absolute", left: 18, top: 16, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: P.onDarkDim }}>The old way</span>
      {squares.map((s, i) => (
        <span key={i} className="v2-float" style={{ position: "absolute", left: s.l, top: s.t, width: 18, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.22)", animationDelay: `${(i % 5) * -1.3}s`, animationDuration: `${4 + (i % 3)}s` }} />
      ))}
      {tags.map((t, i) => (
        <span key={t.label} className="v2-float" style={{ ...sans, position: "absolute", left: t.l, top: t.t, fontSize: 11, fontWeight: 700, color: P.ink, background: "#fff", borderRadius: 6, padding: "5px 10px", whiteSpace: "nowrap", animationDelay: `${i * -2.1}s`, animationDuration: "6s" }}>
          • {t.label}
        </span>
      ))}
    </div>
  );
}

function OrbitVisual() {
  const N = 8;
  return (
    <div style={{ position: "relative", background: P.dark, borderRadius: 18, minHeight: 320, overflow: "hidden" }}>
      <span style={{ ...sans, position: "absolute", left: 18, top: 16, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: P.onDarkDim }}>ShipTime Plus</span>
      {/* rotating ring of modules */}
      <div className="v2-orbit" style={{ position: "absolute", left: "50%", top: "52%", width: 230, height: 230, marginLeft: -115, marginTop: -115, borderRadius: "50%", border: `1.5px dashed ${P.darkLine}` }}>
        {Array.from({ length: N }).map((_, i) => {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: `calc(50% + ${Math.cos(a) * 115}px - 9px)`,
                top: `calc(50% + ${Math.sin(a) * 115}px - 9px)`,
                width: 18,
                height: 18,
                borderRadius: 5,
                background: P.orange,
              }}
            />
          );
        })}
      </div>
      {/* static center */}
      <span className="v2-pulse" style={{ position: "absolute", left: "50%", top: "52%", transform: "translate(-50%, -50%)", width: 56, height: 56, borderRadius: 14, background: P.orange, display: "grid", placeItems: "center" }}>
        <Sparkle size={26} color="#fff" />
      </span>
    </div>
  );
}

function ContrastCards() {
  const rows = [
    {
      eyebrow: "The old way",
      title: <>Twelve tools, none of them talking.</>,
      bullets: [
        "Separate carrier contracts, portals, and invoices — re-shopped by whoever's at the desk.",
        "Courier in one tool, LTL in another, a broker on speed dial for anything heavy.",
        "The operating logic lives in spreadsheets, inboxes, and two people's heads.",
      ],
      visual: <ScatterVisual />,
    },
    {
      eyebrow: "ShipTime Plus",
      title: <>One operating system. Zero drift.</>,
      bullets: [
        "Every mode and carrier rate-shopped on one layer — your negotiated contracts included.",
        "Custom intelligence on your lanes, your seasonality, your exceptions history.",
        "Every automated decision logged, auditable, and reversible.",
      ],
      visual: <OrbitVisual />,
    },
  ];
  return (
    <Panel>
      <div style={{ ...inner, display: "flex", flexDirection: "column", gap: "clamp(36px, 5vw, 64px)" }}>
        {rows.map((r, ri) => (
          <Reveal key={r.eyebrow} delay={ri * 60}>
            <div className="v2-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px, 4vw, 64px)", alignItems: "center" }}>
              <div>
                <Eyebrow>{r.eyebrow}</Eyebrow>
                <h3 style={{ ...serif, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.12, color: P.ink, margin: "14px 0 0" }}>{r.title}</h3>
                <ul style={{ ...sans, margin: "18px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
                  {r.bullets.map((b) => (
                    <li key={b} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.6, color: P.sub }}>
                      <span style={{ marginTop: 7, width: 6, height: 6, background: P.orange, flex: "none" }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              {r.visual}
            </div>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}

// ── §4 STATEMENT band ────────────────────────────────────────────────────────
function StatementBand() {
  return (
    <Panel bg={P.dark}>
      <div style={{ ...inner, textAlign: "center" }}>
        <Reveal>
          <p style={{ ...serif, fontSize: "clamp(1.9rem, 4.4vw, 3.3rem)", lineHeight: 1.15, color: P.onDark, maxWidth: "26ch", margin: "0 auto" }}>
            {"The system books, routes, audits, and recovers — in the background, on your data.".split(" ").map((w, i) => (
              <span key={i} className="v2-word" style={{ transitionDelay: `${i * 45}ms` }}>
                {w}
                {"\u00A0"}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </Panel>
  );
}

// ── §5 MATURITY LADDER ───────────────────────────────────────────────────────
const LEVELS = [
  { tag: "Level 01", name: "FIFO", quote: "Whoever's at the desk picks the carrier.", body: "Manual, order by order. Mostly habit.", heat: 0 },
  { tag: "Level 02", name: "Rate shopping", quote: "Cheapest of the carriers we already use.", body: "Per-shipment comparison, still hand-driven.", heat: 0.16 },
  { tag: "Level 03", name: "Decision support", quote: "Suggest lane, mode, and carrier for my review.", body: "The system recommends; your team approves each move.", heat: 0.38 },
  { tag: "Level 04", name: "Supervised autopilot", quote: "Book the routine ones. Bring me the exceptions.", body: "Routine shipments book themselves; exceptions arrive with context.", heat: 0.66 },
  { tag: "Level 05", name: "True autopilot", quote: "Run my logistics within the guardrails.", body: "Booking, routing, audit, and recovery run in the background. Every decision logged.", heat: 1 },
];

function Ladder() {
  return (
    <Panel>
      <div style={{ ...inner }}>
        <div className="v2-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "end", marginBottom: 44 }}>
          <Reveal>
            <h2 style={{ ...serif, fontSize: "clamp(2rem, 4.4vw, 3.2rem)", lineHeight: 1.06, color: P.ink, margin: 0 }}>
              Scale operating discipline with a designed system
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ justifySelf: "start" }}>
              <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: P.sub, maxWidth: "44ch", margin: "0 0 16px" }}>
                Most operations sit at level one or two. Plus is how you climb — phase by phase, with autopilot earned,
                not assumed.
              </p>
              <PillLink href="/plus/assessment" dark>
                Where are you? Take the assessment <ArrowRight size={15} />
              </PillLink>
            </div>
          </Reveal>
        </div>

        <div className="v2-ladder" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, alignItems: "end", borderBottom: `2px solid ${P.ink}`, paddingBottom: 0 }}>
          {LEVELS.map((l, i) => (
            <Reveal key={l.tag} delay={i * 110} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ ...sans, alignSelf: "flex-start", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: P.ink, background: P.panelSoft, border: `1px solid ${P.line}`, borderRadius: 5, padding: "3px 7px" }}>
                {l.tag}
              </span>
              <span style={{ ...sans, fontSize: 11, color: P.sub }}>{l.name}</span>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: P.card,
                  border: `1px solid ${P.line}`,
                  borderBottom: "none",
                  borderRadius: "12px 12px 0 0",
                  padding: "14px 14px 18px",
                  minHeight: 120 + i * 46,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {l.heat > 0 && (
                  <div
                    aria-hidden
                    className="v2-heat"
                    style={{
                      position: "absolute",
                      inset: 0,
                      ...dots(`rgba(236,90,38,${0.25 + l.heat * 0.45})`, 8, 1.4),
                      WebkitMaskImage: `linear-gradient(to top, black ${l.heat * 62}%, transparent ${l.heat * 100 + 8}%)`,
                      maskImage: `linear-gradient(to top, black ${l.heat * 62}%, transparent ${l.heat * 100 + 8}%)`,
                      pointerEvents: "none",
                    }}
                  />
                )}
                {i >= 3 && (
                  <span className="v2-pulse" style={{ position: "absolute", right: 10, top: 10, width: 20, height: 20, borderRadius: 999, background: P.orange, display: "grid", placeItems: "center", animationDelay: `${i * 0.6}s` }}>
                    <Sparkle size={10} color="#fff" />
                  </span>
                )}
                <p style={{ ...sans, position: "relative", fontSize: 12, fontWeight: 800, lineHeight: 1.45, color: P.ink, margin: 0, paddingRight: i >= 3 ? 22 : 0 }}>
                  &ldquo;{l.quote}&rdquo;
                </p>
                <p style={{ ...sans, position: "relative", fontSize: 11.5, lineHeight: 1.5, color: P.sub, margin: "8px 0 0" }}>{l.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ── §6 MODULE BENTO ──────────────────────────────────────────────────────────
const MODULES = [
  { title: "Rate shopping", body: "Every carrier, every mode — your contracts included", href: "/plus/platform" },
  { title: "Freight brokerage", body: "Instant quote, then the spot board bids it down", href: "/plus/platform" },
  { title: "Fulfillment & inventory", body: "Orders ship from the node that wins", href: "/plus/fulfillment" },
  { title: "ShipAudit recovery", body: "Every invoice checked, overcharges clawed back", href: "/plus/platform" },
];

function Bento() {
  return (
    <Panel bg={P.panelSoft}>
      <div style={{ ...inner }}>
        <Reveal>
          <h2 style={{ ...serif, fontSize: "clamp(2rem, 4.4vw, 3.2rem)", lineHeight: 1.08, color: P.ink, margin: "0 0 36px" }}>
            Everything you ship.
            <br />
            Seamlessly connected.
          </h2>
        </Reveal>
        <div className="v2-bento" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.1fr", gap: 12 }}>
          {MODULES.slice(0, 2).map((m, i) => (
            <Reveal key={m.title} delay={i * 80}>
              <BentoCard m={m} />
            </Reveal>
          ))}
          <Reveal delay={160} className="v2-bento-tall" style={{ gridRow: "span 2" }}>
            <div style={{ position: "relative", height: "100%", overflow: "hidden", background: P.dark, borderRadius: 16, padding: "22px 22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 260 }}>
              <div aria-hidden className="v2-breathe" style={{ position: "absolute", right: -30, top: -20, width: 260, height: 300, ...dots("rgba(236,90,38,0.5)", 13, 2.2), WebkitMaskImage: "radial-gradient(closest-side, black 40%, transparent 75%)", maskImage: "radial-gradient(closest-side, black 40%, transparent 75%)" }} />
              <h3 style={{ ...serif, position: "relative", fontSize: 26, lineHeight: 1.15, color: P.onDark, margin: 0 }}>
                The Logistics
                <br />
                Operating System
              </h3>
              <div style={{ position: "relative" }}>
                <p style={{ ...sans, fontSize: 12.5, lineHeight: 1.55, color: P.onDarkDim, margin: "0 0 14px", maxWidth: "26ch" }}>
                  One operating layer over every mode, run with your team.
                </p>
                <Link href="/plus/los" className="st-cta" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: P.onDark, textDecoration: "none", borderBottom: `1px solid ${P.darkLine}`, paddingBottom: 2 }}>
                  Inside the LOS <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </Reveal>
          {MODULES.slice(2).map((m, i) => (
            <Reveal key={m.title} delay={240 + i * 80}>
              <BentoCard m={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function BentoCard({ m }: { m: (typeof MODULES)[number] }) {
  return (
    <Link
      href={m.href}
      className="st-lift v2-bento-card"
      style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 26, height: "100%", background: P.card, border: `1px solid ${P.line}`, borderRadius: 16, padding: "20px 22px", minHeight: 150, textDecoration: "none" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ ...serif, fontSize: 22, color: P.ink }}>{m.title}</span>
        <span className="v2-arrow" style={{ width: 26, height: 26, borderRadius: 7, border: `1px solid ${P.line}`, display: "grid", placeItems: "center", color: P.ink, flex: "none", transition: "background 0.2s, color 0.2s, transform 0.2s" }}>
          <ArrowRight size={13} />
        </span>
      </div>
      <p style={{ ...sans, fontSize: 12.5, lineHeight: 1.5, color: P.sub, margin: 0, maxWidth: "24ch" }}>{m.body}</p>
    </Link>
  );
}

// ── §7 PLATFORM DIAGRAM ──────────────────────────────────────────────────────
const D_INPUTS = ["ERP & finance", "Storefronts & OMS", "Carrier accounts", "WMS / 3PLs"];
const D_MODULES = ["Rate engine", "Multimodal booking", "ShipAudit", "Fulfillment network", "Open API"];
const D_OUTCOMES = ["No default-carrier tax", "Every invoice audited", "One system of record", "Autopilot within guardrails"];

function Diagram() {
  const chip: CSSProperties = { ...sans, fontSize: 11.5, fontWeight: 700, color: P.ink, background: P.card, border: `1px solid ${P.line}`, borderRadius: 6, padding: "7px 11px", whiteSpace: "nowrap" };
  return (
    <Panel>
      <div style={{ ...inner }}>
        <Reveal>
          <h2 style={{ ...serif, fontSize: "clamp(2rem, 4.2vw, 3rem)", lineHeight: 1.08, color: P.ink, margin: "0 0 34px", maxWidth: "22ch" }}>
            The operating layer that spans your whole operation
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ border: `1px solid ${P.line}`, borderRadius: 18, background: P.panelSoft, padding: "clamp(18px, 3vw, 34px)" }}>
            {/* column labels */}
            <div className="v2-diagram-heads" style={{ ...sans, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, borderBottom: `1px solid ${P.line}`, paddingBottom: 12, marginBottom: 24 }}>
              {[["Unify", "your fragmented stack"], ["Orchestrate", "every move it makes"], ["Drive", "the outcomes that pay"]].map(([t, s]) => (
                <div key={t} style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                  <span style={{ width: 6, height: 6, background: P.orange, flex: "none" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: P.ink }}>{t}</span>
                  <span style={{ fontSize: 11.5, color: P.sub }}>{s}</span>
                </div>
              ))}
            </div>

            <div className="v2-diagram" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "clamp(16px, 3vw, 36px)", alignItems: "center" }}>
              {/* inputs — packets travel the connector into the core */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                {D_INPUTS.map((x, i) => (
                  <div key={x} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={chip}>{x}</span>
                    <span aria-hidden style={{ position: "relative", width: "clamp(14px, 3vw, 34px)", height: 2 }}>
                      <span className="v2-flow" style={{ position: "absolute", inset: 0, ...flowLine() }} />
                      <span className="v2-packet" style={{ animationDelay: `${i * 0.85}s` }} />
                    </span>
                    <Sparkle size={9} pulse delay={`${i * 0.5}s`} />
                  </div>
                ))}
              </div>

              {/* center card — modules light up as work moves through */}
              <div className="v2-coreglow" style={{ background: P.dark, borderRadius: 16, padding: "18px 18px 20px", minWidth: 230 }}>
                <div style={{ ...sans, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: P.onDark, marginBottom: 12, textAlign: "center" }}>
                  ShipTime Plus
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {D_MODULES.map((mrow, i) => (
                    <div key={mrow} className="v2-modrow" style={{ ...sans, display: "flex", alignItems: "center", gap: 9, border: `1px solid ${P.darkLine}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 700, color: P.onDark, animationDelay: `${i * 0.7}s` }}>
                      <Sparkle size={10} pulse delay={`${i * 0.4}s`} />
                      {mrow}
                    </div>
                  ))}
                </div>
              </div>

              {/* outcomes — packets flow out to the results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                {D_OUTCOMES.map((x, i) => (
                  <div key={x} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkle size={9} pulse delay={`${0.2 + i * 0.5}s`} />
                    <span aria-hidden style={{ position: "relative", width: "clamp(14px, 3vw, 34px)", height: 2 }}>
                      <span className="v2-flow" style={{ position: "absolute", inset: 0, ...flowLine() }} />
                      <span className="v2-packet" style={{ animationDelay: `${0.4 + i * 0.85}s` }} />
                    </span>
                    <span style={{ ...chip, borderColor: "#F3C7B3", background: P.orangeTint }}>{x}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Panel>
  );
}

// ── §8 ICON TRIO ─────────────────────────────────────────────────────────────
// Each icon animates its own idea, continuously:
//  0 — rates funnel down through narrowing rings onto the winning lane
//  1 — scattered systems feed inward along flowing dashed lines to one core
//  2 — an audit sweep steps around the grid while the ring scans
function TrioIcon({ variant }: { variant: 0 | 1 | 2 }) {
  const stroke = P.ink;
  if (variant === 0)
    return (
      <svg width="132" height="110" viewBox="0 0 96 80" fill="none" aria-hidden>
        {[30, 22, 14, 7].map((r, i) => (
          <ellipse
            key={r}
            cx="48"
            cy={14 + i * 12}
            rx={r}
            ry={5.5}
            stroke={stroke}
            strokeWidth="1.4"
            className="v2-funnel-ring"
            style={{ animationDelay: `${i * 0.28}s` }}
          />
        ))}
        <path d="M48 61 L48 66" stroke={stroke} strokeWidth="1.4" />
        <path
          d="M48 78 L44.8 68.6 L38 74 L43 66.8 L48 64 L53 66.8 L58 74 L51.2 68.6 Z"
          fill={P.orange}
          className="v2-pulse-svg"
          style={{ animationDelay: "1.1s" }}
        />
      </svg>
    );
  if (variant === 1)
    return (
      <svg width="132" height="110" viewBox="0 0 96 80" fill="none" aria-hidden>
        {[[10, 10], [86, 10], [10, 70], [86, 70]].map(([x, y], i) => (
          <path
            key={`l${i}`}
            d={`M${x} ${y} L48 40`}
            stroke={P.orange}
            strokeWidth="1.1"
            strokeDasharray="2 4"
            className="v2-feed-line"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
        {[[10, 10], [86, 10], [10, 70], [86, 70], [48, 4], [48, 76], [8, 40], [88, 40]].map(([x, y], i) => (
          <rect
            key={`s${i}`}
            x={x - 3}
            y={y - 3}
            width="6"
            height="6"
            fill={stroke}
            className="v2-feed-node"
            style={{ animationDelay: `${i * 0.22}s` }}
          />
        ))}
        <path
          d="M48 26 L51.5 36.5 L62 40 L51.5 43.5 L48 54 L44.5 43.5 L34 40 L44.5 36.5 Z"
          fill={P.orange}
          className="v2-pulse-svg"
        />
      </svg>
    );
  return (
    <svg width="132" height="110" viewBox="0 0 96 80" fill="none" aria-hidden>
      {[[24, 16], [48, 12], [72, 16], [20, 40], [76, 40], [24, 64], [48, 68], [72, 64]].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 7} L${x + 2.4} ${y - 2.4} L${x + 7} ${y} L${x + 2.4} ${y + 2.4} L${x} ${y + 7} L${x - 2.4} ${y + 2.4} L${x - 7} ${y} L${x - 2.4} ${y - 2.4} Z`}
          stroke={stroke}
          strokeWidth="1.2"
          fill="none"
          className="v2-audit-mark"
          style={{ animationDelay: `${i * 0.32}s` }}
        />
      ))}
      <circle
        cx="48"
        cy="40"
        r="17"
        stroke={stroke}
        strokeWidth="1.2"
        strokeDasharray="2.5 4"
        className="v2-spin-svg"
        style={{ transformOrigin: "48px 40px" }}
      />
      <path d="M48 31 L50.7 37.3 L57 40 L50.7 42.7 L48 49 L45.3 42.7 L39 40 L45.3 37.3 Z" fill={P.orange} className="v2-pulse-svg" />
    </svg>
  );
}

function Trio() {
  const items = [
    { icon: 0 as const, kicker: "01 — Rate discipline", title: "Cheaper on every lane", body: "Every carrier and mode rate-shopped against what the shipment should cost — your negotiated contracts included, ours where they win." },
    { icon: 1 as const, kicker: "02 — One data layer", title: "Stable as you scale", body: "Add modes, warehouses, and borders without re-platforming. Up to thirty systems orchestrated into one operating layer." },
    { icon: 2 as const, kicker: "03 — Earned autonomy", title: "Defensible by default", body: "Every automated decision logged with its reasoning — auditable, reversible, and yours. Pull any workflow back to manual." },
  ];
  return (
    <Panel bg={P.panelSoft}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(80px, 11vw, 156px) clamp(20px, 4vw, 48px)", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow>The whole point</Eyebrow>
          </div>
        </Reveal>
        <Reveal delay={70}>
          <h2 style={{ ...serif, fontSize: "clamp(2.4rem, 5.6vw, 4.2rem)", lineHeight: 1.04, color: P.ink, margin: "20px auto 0", maxWidth: "16ch" }}>
            Orchestration without the <span style={{ fontStyle: "italic" }}>fragmentation</span>
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p style={{ ...sans, fontSize: "clamp(1rem, 1.35vw, 1.15rem)", lineHeight: 1.65, color: P.sub, maxWidth: "58ch", margin: "22px auto 0" }}>
            The old stack scatters your logistics across tools. Plus aligns rating, booking, audit, and fulfillment
            from the start — one system of record from quote to delivered.
          </p>
        </Reveal>

        <div
          className="v2-trio"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginTop: "clamp(56px, 7vw, 88px)" }}
        >
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 130}>
              <div
                className="v2-trio-col"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  height: "100%",
                  padding: "0 clamp(16px, 2.6vw, 40px)",
                  borderLeft: i === 0 ? "none" : `1px solid ${P.line}`,
                }}
              >
                <div style={{ height: 118, display: "flex", alignItems: "center" }}>
                  <TrioIcon variant={it.icon} />
                </div>
                <span style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.faint }}>
                  {it.kicker}
                </span>
                <h3 style={{ ...serif, fontSize: "clamp(1.5rem, 2.3vw, 1.95rem)", lineHeight: 1.15, color: P.ink, margin: 0 }}>{it.title}</h3>
                <p style={{ ...sans, fontSize: 14, lineHeight: 1.68, color: P.sub, margin: 0, maxWidth: "32ch" }}>{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ── §9 WHO WE WORK WITH ──────────────────────────────────────────────────────
const PERSONAS = [
  {
    label: "DTC & CPG brands",
    pitch: "You outgrew self-serve six months ago. We design store-to-door orchestration so the growth curve stops being a logistics problem.",
    href: "/plus/solutions/dtc",
    proof: { stat: "3 people", note: "no longer running shipping as a part-time job" },
  },
  {
    label: "3PLs",
    pitch: "Multi-client rate and label infrastructure, brokerage for overflow, one operational layer across your whole book.",
    href: "/plus/solutions/3pl",
    proof: { stat: "One layer", note: "across every client's carriers, rates, and reporting" },
  },
  {
    label: "Enterprise shippers",
    pitch: "You already have rates — good ones. What you don't have is one system. BYOR, unified data, and a proposal with the savings quantified before you commit.",
    href: "/plus/solutions/enterprise",
    proof: { stat: "$500K+/yr", note: "saved by some accounts on a full LOS engagement" },
  },
  {
    label: "US brands entering Canada",
    pitch: "Launch in Canada without building in Canada — bulk shipping, Canadian fulfillment, last-mile, expansion. A smaller step than a warehouse lease.",
    href: "/plus/solutions/market-entry",
    proof: { stat: "$25 → $13.22", note: "delivered cost per shipment on a real Canada entry" },
  },
];

function Personas() {
  return (
    <Panel>
      <div style={{ ...inner }}>
        <Reveal>
          <h2 style={{ ...serif, fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)", lineHeight: 1.05, color: P.ink, margin: "0 0 40px" }}>
            Who we design for
          </h2>
        </Reveal>
        <div className="v2-personas" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "clamp(20px, 3vw, 48px)", alignItems: "start" }}>
          <nav className="v2-persona-rail" style={{ ...sans, position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 10 }}>
            {PERSONAS.map((p) => (
              <span key={p.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: P.sub }}>
                <span style={{ width: 5, height: 5, background: P.orange, flex: "none" }} />
                {p.label}
              </span>
            ))}
          </nav>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PERSONAS.map((p, i) => (
              <Reveal key={p.label} delay={i * 70}>
                <div className="v2-split" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", borderRadius: 16, overflow: "hidden", border: `1px solid ${P.line}` }}>
                  <div style={{ background: P.card, padding: "26px 28px" }}>
                    <Eyebrow>{p.label}</Eyebrow>
                    <p style={{ ...serif, fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)", lineHeight: 1.3, color: P.ink, margin: "12px 0 18px" }}>{p.pitch}</p>
                    <PillLink href={p.href} dark>
                      Learn more
                    </PillLink>
                  </div>
                  <div style={{ position: "relative", overflow: "hidden", background: P.panelSoft, borderLeft: `1px solid ${P.line}`, padding: "26px 28px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                    <div aria-hidden className="v2-breathe" style={{ position: "absolute", right: -40, bottom: -50, width: 200, height: 200, ...dots("rgba(236,90,38,0.35)", 10, 1.8), WebkitMaskImage: "radial-gradient(closest-side, black 35%, transparent 72%)", maskImage: "radial-gradient(closest-side, black 35%, transparent 72%)", animationDelay: `${i * -2}s` }} />
                    <span style={{ ...serif, position: "relative", fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", color: P.orange }}>{p.proof.stat}</span>
                    <span style={{ ...sans, position: "relative", fontSize: 12.5, lineHeight: 1.5, color: P.sub, maxWidth: "26ch" }}>{p.proof.note}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ── §10 RESOURCES strip ──────────────────────────────────────────────────────
const RESOURCES = [
  { title: "The Smart Logistics Playbook", href: "/plus/resources/smart-logistics-playbook" },
  { title: "What your freight should cost — spot vs contract", href: "/plus/resources/what-your-freight-should-cost" },
  { title: "The multi-location inventory untangling guide", href: "/plus/resources/multi-location-inventory-guide" },
];

function ResourcesStrip() {
  return (
    <Panel bg={P.panelSoft}>
      <div style={{ ...inner, paddingTop: 34, paddingBottom: 34 }}>
        <Reveal>
          <Eyebrow>Related resources</Eyebrow>
        </Reveal>
        <div className="v2-resources" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginTop: 16, borderTop: `1px solid ${P.line}` }}>
          {RESOURCES.map((r, i) => (
            <Reveal key={r.href} delay={i * 80}>
              <Link
                href={r.href}
                className="v2-resource-row"
                style={{ ...sans, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "18px 16px 18px 4px", borderLeft: i ? `1px solid ${P.line}` : "none", paddingLeft: i ? 20 : 4, fontSize: 14.5, fontWeight: 700, lineHeight: 1.4, color: P.ink, textDecoration: "none", height: "100%" }}
              >
                {r.title}
                <span className="v2-arrow" style={{ width: 26, height: 26, borderRadius: 7, background: P.ink, color: "#fff", display: "grid", placeItems: "center", flex: "none", transition: "background 0.2s, transform 0.2s" }}>
                  <ArrowRight size={13} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ── §11 FINAL CTA ────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <Panel bg={P.dark}>
      <div style={{ ...inner, textAlign: "center", position: "relative" }}>
        <HalftoneBlob color="rgba(236,90,38,0.4)" style={{ width: 420, height: 420, left: "50%", top: -180, transform: "translateX(-50%)" }} />
        <Reveal>
          <h2 style={{ ...serif, position: "relative", fontSize: "clamp(2.1rem, 4.6vw, 3.4rem)", lineHeight: 1.08, color: P.onDark, maxWidth: "22ch", margin: "0 auto" }}>
            Tell us what you ship. We&rsquo;ll show you the system.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ ...sans, position: "relative", fontSize: 15.5, lineHeight: 1.65, color: P.onDarkDim, maxWidth: "52ch", margin: "16px auto 0" }}>
            A 30-minute call. No pitch deck — questions about your operation, and a first read on where the savings
            are.
          </p>
        </Reveal>
        <Reveal delay={190}>
          <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 30 }}>
            <PillLink href="/plus/book-a-call">
              Book a call <ArrowRight size={15} />
            </PillLink>
            <GhostLink href="/plus/assessment" onDark>
              Take the assessment
            </GhostLink>
          </div>
        </Reveal>
      </div>
    </Panel>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export async function PlusHomeV2() {
  return (
    <div style={{ background: P.gutter, padding: "10px 0 16px", fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
      <HeroFed />
      <ProofBento />
      <ProblemBand />
      <ContrastCards />
      <StatementBand />
      <Ladder />
      <Bento />
      <Diagram />
      <Trio />
      <Personas />
      <ResourcesStrip />
      <FinalCta />

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes v2-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes v2-pulse-kf {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.14); }
          }
          @keyframes v2-pulse-center-kf {
            0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 0 0 rgba(236,90,38,0.4); }
            50% { transform: translate(-50%, -50%) scale(1.08); box-shadow: 0 0 0 14px rgba(236,90,38,0); }
          }
          @keyframes v2-breathe-kf {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.06); }
          }
          @keyframes v2-float-kf {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-7px) rotate(3deg); }
          }
          @keyframes v2-flow-kf { from { background-position: 0 0; } to { background-position: 10px 0; } }
          .v2-orbit { animation: v2-spin 44s linear infinite; }
          .v2-pulse { animation: v2-pulse-kf 2.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
          span.v2-pulse[style*="translate"] { animation: v2-pulse-center-kf 2.6s ease-in-out infinite; }
          .v2-breathe { animation: v2-breathe-kf 7s ease-in-out infinite; }
          .v2-float { animation: v2-float-kf 5s ease-in-out infinite; }
          .v2-flow { animation: v2-flow-kf 0.7s linear infinite; }
          .v2-pulse-svg { animation: v2-pulse-kf 2.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }

          /* reveal-keyed choreography (fires when the shared reveal system lands) */
          .v2-heat { opacity: 0; transform: translateY(32%); transition: opacity 0.9s ease 0.4s, transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s; }
          [data-reveal="in"] .v2-heat { opacity: 1; transform: none; }
          .v2-word { display: inline-block; opacity: 0; transform: translateY(16px); filter: blur(5px); transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s ease; }
          [data-reveal="in"] .v2-word { opacity: 1; transform: none; filter: none; }
          .v2-spin-svg { animation: v2-spin 24s linear infinite; }

          /* — trio icons: each animates its own idea — */
          /* 0 · rates funnel down through narrowing rings */
          @keyframes v2-funnel-kf {
            0%, 62%, 100% { opacity: 0.34; transform: translateY(0); }
            14% { opacity: 1; transform: translateY(1.4px); }
            34% { opacity: 0.55; transform: translateY(0); }
          }
          .v2-funnel-ring { animation: v2-funnel-kf 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          /* 1 · scattered systems feed inward along flowing lines */
          @keyframes v2-feed-kf { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -18; } }
          .v2-feed-line { animation: v2-feed-kf 1.5s linear infinite; opacity: 0.85; }
          @keyframes v2-node-kf {
            0%, 70%, 100% { opacity: 0.4; }
            18% { opacity: 1; }
          }
          .v2-feed-node { animation: v2-node-kf 3.4s ease-in-out infinite; }
          /* 2 · the audit sweep steps around the grid */
          @keyframes v2-audit-kf {
            0%, 74%, 100% { opacity: 0.28; stroke: #1C1E3D; }
            12% { opacity: 1; stroke: #EC5A26; }
          }
          .v2-audit-mark { animation: v2-audit-kf 3.6s ease-in-out infinite; }

          /* hero entrance */
          @keyframes v2-rise-kf { to { transform: translateY(0); } }
          .v2-line { display: block; overflow: hidden; padding-bottom: 0.06em; }
          .v2-line-in { display: block; transform: translateY(115%); animation: v2-rise-kf 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
          @keyframes v2-fadeup-kf { to { opacity: 1; transform: translateY(0); } }
          .v2-fade { opacity: 0; transform: translateY(16px); animation: v2-fadeup-kf 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

          /* hero ambience */
          @keyframes v2-drift-kf {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(46px, 30px) rotate(7deg); }
          }
          .v2-drift { animation: v2-drift-kf 22s ease-in-out infinite; }
          @keyframes v2-marq-kf { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .v2-marq { animation: v2-marq-kf 30s linear infinite; }
          @keyframes v2-livepip-kf { 0%, 100% { box-shadow: 0 0 0 0 rgba(236,90,38,0.45); } 50% { box-shadow: 0 0 0 6px rgba(236,90,38,0); } }
          .v2-livepip { animation: v2-livepip-kf 1.8s ease-out infinite; }

          /* diagram flow */
          @keyframes v2-packet-kf {
            0% { left: -8%; opacity: 0; }
            12% { opacity: 1; }
            88% { opacity: 1; }
            100% { left: 102%; opacity: 0; }
          }
          .v2-packet { position: absolute; top: -3px; left: -8%; width: 8px; height: 8px; border-radius: 999px; background: ${P.orange}; box-shadow: 0 0 10px rgba(236,90,38,0.9); animation: v2-packet-kf 3.4s ease-in-out infinite; }
          @keyframes v2-modrow-kf {
            0%, 16%, 100% { background: transparent; border-color: ${P.darkLine}; }
            6% { background: rgba(236,90,38,0.16); border-color: rgba(236,90,38,0.75); }
          }
          .v2-modrow { animation: v2-modrow-kf 3.5s ease-in-out infinite; }
          @keyframes v2-coreglow-kf {
            0%, 100% { box-shadow: 0 0 0 0 rgba(236,90,38,0.0); }
            50% { box-shadow: 0 0 44px -6px rgba(236,90,38,0.35); }
          }
          .v2-coreglow { animation: v2-coreglow-kf 4.5s ease-in-out infinite; }
        }
        /* outside the media query: reduced-motion users still see the packet hidden */
        @media (prefers-reduced-motion: reduce) {
          .v2-packet, .v2-herovid { display: none; }
        }
        .v2-bento-card:hover .v2-arrow { background: ${P.orange}; border-color: ${P.orange}; color: #fff; transform: translateX(2px); }
        .v2-resource-row:hover .v2-arrow { background: ${P.orange} !important; transform: translateX(2px); }

        @media (max-width: 880px) {
          .v2-split { grid-template-columns: 1fr !important; }
          .v2-trio { grid-template-columns: 1fr !important; }
          .v2-bento { grid-template-columns: 1fr !important; }
          .v2-bento-tall { grid-row: auto !important; }
          .v2-personas { grid-template-columns: 1fr !important; }
          .v2-persona-rail { position: static !important; flex-direction: row !important; flex-wrap: wrap; gap: 14px !important; }
          .v2-diagram { grid-template-columns: 1fr !important; justify-items: stretch; }
          .v2-diagram > div { align-items: flex-start !important; }
          .v2-diagram-heads { grid-template-columns: 1fr !important; }
          .v2-ladder { grid-template-columns: repeat(2, 1fr) !important; align-items: end; border-bottom: none !important; }
          .v2-ladder > div > div { min-height: 130px !important; border-bottom: 1px solid ${P.line} !important; border-radius: 12px !important; }
          .v2-resources { grid-template-columns: 1fr !important; }
          .v2-resources a { border-left: none !important; padding-left: 4px !important; border-bottom: 1px solid ${P.line}; }
        }
      `}</style>
    </div>
  );
}
