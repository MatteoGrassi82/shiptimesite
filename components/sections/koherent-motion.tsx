"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";

// Motion pieces for /koherent sections below the hero (the hero itself is
// koherent-hero-art.tsx). They were hero options B, C and D on Oct 23; Matteo
// picked A for the hero and asked for these ideas further down the page:
//   MethodPlayer — "How we work": a photo per step wiping in through the
//                  arrowhead behind the steps, the six step cards in sync.
//   NetworkLive  — "What we bring": carriers, warehouses and systems with
//                  orders flowing into the K (Michael's lattice, animated).
//   ConsoleView  — "Why we're different": what one view looks like, with
//                  "we suggest, you approve".
// Each starts when it scrolls into view, and renders its final state with
// reduced motion or without JS.

const C = {
  ink: "#17101C",
  plum: "#461948",
  violet: "#6E3A80",
  lilac: "#C7AEE6",
  mist: "#EEE8F3",
  paper: "#F6F3EE",
  card: "#FFFDFA",
  stone: "#6A6272",
  line: "#DCD4E2",
  onDark: "#F6F3EE",
  onDarkDim: "rgba(246,243,238,0.74)",
};
const sans: CSSProperties = { fontFamily: "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif" };
const mono: CSSProperties = { fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace" };
const title: CSSProperties = { ...sans, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08 };
const K_BAR = "M0 0 H3 V12 H0 Z";
const K_ARROW = "M8.6 0 H12 L7.9 6 L12 12 H8.6 L4.5 6 Z";
const CHEV = "M0 0 H3.4 L8 6 L3.4 12 H0 L4.6 6 Z";
const WIDE_ARROWHEAD = "polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 50%)";

// ── shared hooks ─────────────────────────────────────────────────────────────
const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const m = window.matchMedia(REDUCED);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
}
function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
}

// `armed` turns true once JS is running (so CSS may hide things until they
// play); `inView` turns true the first time the element is on screen.
function useInView<T extends Element>(threshold = 0.3): { ref: RefObject<T | null>; armed: boolean; inView: boolean } {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setArmed(true);
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, armed, inView };
}

// Counts from `from` to `to` once `start` turns true. Renders `to` until then
// (the static page is right without JS); the element should be hidden by CSS
// while armed and not yet in view, so the rewind is never seen.
function useCount(from: number, to: number, start: boolean, delay = 0, ms = 900) {
  const [v, setV] = useState(to);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0 - delay) / ms));
      setV(from + (to - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, start, delay, ms, reduced]);
  return reduced ? to : v;
}

function Label({ children, onDark = false, style }: { children: ReactNode; onDark?: boolean; style?: CSSProperties }) {
  return (
    <p style={{ ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: onDark ? C.lilac : C.violet, margin: 0, ...style }}>
      {children}
    </p>
  );
}

function Chevrons({ total, done, size = 11, onDark = false }: { total: number; done: number; size?: number; onDark?: boolean }) {
  return (
    <span aria-hidden style={{ display: "inline-flex", gap: size * 0.28 }}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 8 12" style={{ width: size * 0.67, height: size }}>
          <path d={CHEV} fill={i < done ? (onDark ? C.lilac : C.plum) : onDark ? "rgba(199,174,230,0.25)" : C.line} />
        </svg>
      ))}
    </span>
  );
}

// ── MethodPlayer — "How we work" ─────────────────────────────────────────────
// Chris's method. One photo per step (AI placeholders until our own shoot).
const STEPS: { name: string; body: string; src: string }[] = [
  { name: "Assess", body: "We start from your own orders: every lane, carrier and cost.", src: "/generated/plus-ops-team.webp" },
  { name: "Plan", body: "We agree the goals with you, and what comes first.", src: "/generated/plus-people-portrait.webp" },
  { name: "Design", body: "Carriers, warehouses and routes, priced before you commit.", src: "/generated/plus-aud-growth.webp" },
  { name: "Test", body: "We prove it on your real shipments before anything changes.", src: "/generated/plus-aud-growing.webp" },
  { name: "Go live", body: "Switched on alongside your team. Nothing pauses.", src: "/generated/plus-cta-operator.webp" },
  { name: "Improve", body: "Reviewed with you every month, and tuned as you grow.", src: "/generated/plus-aud-profit.webp" },
];
const STEP_MS = 3800;

export function MethodPlayer() {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  // The current step and the one it replaces (shown underneath during the wipe).
  const [{ i, prev }, setStep] = useState({ i: 0, prev: STEPS.length - 1 });
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (reduced || !auto || !inView) return;
    const id = window.setInterval(() => {
      setStep((s) => ({ prev: s.i, i: (s.i + 1) % STEPS.length }));
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced, auto, inView]);

  // Choosing a step stops the autoplay; the visitor is in charge from then on.
  const pick = (n: number) => {
    setAuto(false);
    setStep((s) => (s.i === n ? s : { prev: s.i, i: n }));
  };

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto" }}>
        <div className="km-frame" style={{ position: "relative", clipPath: WIDE_ARROWHEAD, background: C.mist, aspectRatio: "16 / 7" }}>
          <img src={STEPS[prev].src} alt="" width={1024} height={1024} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
          <img
            key={i}
            className="km-in"
            src={STEPS[i].src}
            alt={`${STEPS[i].name}: ${STEPS[i].body}`}
            width={1024}
            height={1024}
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div key={`s${i}`} aria-hidden className="km-sweep" style={{ position: "absolute", top: "50%", left: 0, display: "flex", gap: 12, transform: "translateY(-50%)" }}>
            {[C.lilac, C.violet, C.plum].map((f) => (
              <svg key={f} viewBox="0 0 8 12" style={{ width: 60, height: 90 }}>
                <path d={CHEV} fill={f} />
              </svg>
            ))}
          </div>
        </div>
        <div key={`c${i}`} className="km-cap k-numcard" style={{ position: "absolute", right: "3%", bottom: "-8%", width: "min(330px, 70%)", background: C.ink, color: C.onDark, borderRadius: 4, padding: "18px 20px 16px", boxShadow: "0 30px 60px -30px rgba(23,16,28,0.6)", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Label onDark>Step {String(i + 1).padStart(2, "0")} of 06</Label>
            <Chevrons total={STEPS.length} done={i + 1} onDark />
          </div>
          <p style={{ ...title, fontSize: 24, margin: "10px 0 0" }}>{STEPS[i].name}</p>
          <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.5, color: C.onDarkDim, margin: "4px 0 0" }}>{STEPS[i].body}</p>
        </div>
      </div>

      <div className="km-steps" role="group" aria-label="The six steps" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginTop: "clamp(56px, 7vw, 84px)" }}>
        {STEPS.map((s, n) => {
          const on = n === i;
          return (
            <button
              key={s.name}
              type="button"
              aria-pressed={on}
              onClick={() => pick(n)}
              className="km-step"
              style={{ ...sans, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", textAlign: "center", background: on ? C.card : "transparent", border: `1.5px solid ${on ? C.plum : C.line}`, borderRadius: 4, padding: "20px 16px 22px", transition: "background .25s ease, border-color .25s ease" }}
            >
              <Chevrons total={6} done={n + 1} />
              <span style={{ ...title, display: "block", fontSize: "1.2rem", color: on ? C.plum : C.ink, marginTop: 14 }}>{s.name}</span>
              <span className="km-body" style={{ display: "block", fontSize: 14, lineHeight: 1.5, color: C.stone, marginTop: 6, opacity: on ? 1 : 0.8 }}>{s.body}</span>
            </button>
          );
        })}
      </div>
      <style>{`
        .km-step:hover { border-color: ${C.violet} !important; }
        .km-step:focus-visible { outline: 2px solid ${C.violet}; outline-offset: 2px; }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes km-in-kf { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
          .km-in { animation: km-in-kf .9s cubic-bezier(.65,0,.35,1) both; }
          @keyframes km-sweep-kf { 0% { left: -12%; opacity: 0; } 12% { opacity: 1; } 85% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
          .km-sweep { opacity: 0; animation: km-sweep-kf .9s cubic-bezier(.65,0,.35,1) both; }
          @keyframes km-cap-kf { from { opacity: .4; transform: translateY(6px); } to { opacity: 1; transform: none; } }
          .km-cap { animation: km-cap-kf .5s ease .35s both; }
        }
        @media (prefers-reduced-motion: reduce) { .km-sweep { display: none; } }
        @media (max-width: 960px) { .km-steps { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) {
          .km-frame { aspect-ratio: 4 / 3 !important; clip-path: polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%) !important; }
          .km-steps { gap: 8px !important; }
          .km-step { padding: 14px 6px !important; }
          .km-body { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── NetworkLive — "What we bring" ────────────────────────────────────────────
// Labels stay generic (no warehouse cities) until the partner list is
// confirmed. Paths are drawn once and reused for the moving order dots, so
// the dots always ride exactly on the lines.
const HUB = { x: 175, y: 210 };
const NET: { x: number; y: number; label: string; kind: "carrier" | "site" | "system" | "door" }[] = [
  { x: 420, y: 70, label: "Couriers", kind: "carrier" },
  { x: 520, y: 165, label: "Regional carriers", kind: "carrier" },
  { x: 430, y: 330, label: "LTL & FTL", kind: "carrier" },
  { x: 700, y: 95, label: "Partner warehouses", kind: "site" },
  { x: 745, y: 230, label: "Your store & ERP", kind: "system" },
  { x: 640, y: 350, label: "Customs & borders", kind: "system" },
  { x: 860, y: 320, label: "Your customers", kind: "door" },
];

function netPath(n: { x: number; y: number }) {
  const mx = (n.x + HUB.x) / 2;
  return `M${n.x} ${n.y} C ${mx + 60} ${n.y}, ${mx - 60} ${HUB.y}, ${HUB.x + 44} ${HUB.y}`;
}

export function NetworkLive() {
  const reduced = useReducedMotion();
  const { ref, armed, inView } = useInView<HTMLDivElement>(0.3);
  const orders = useCount(0, 12480, inView, 300, 2200);
  return (
    <div ref={ref} className={`kn-wrap${armed ? " armed" : ""}${inView ? " is-in" : ""}`} style={{ position: "relative", maxWidth: 1000, margin: "0 auto" }}>
      <div className="kn-frame" style={{ clipPath: WIDE_ARROWHEAD, background: C.ink, aspectRatio: "1000 / 420", position: "relative" }}>
        <svg viewBox="0 0 1000 420" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} role="img" aria-label="Couriers, regional carriers, LTL and FTL, partner warehouses, your systems, customs and your customers, connected into one network with one view">
          <defs>
            <pattern id="kn-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="rgba(199,174,230,0.15)" />
            </pattern>
            <radialGradient id="kn-glow" cx="18%" cy="50%" r="55%">
              <stop offset="0%" stopColor={C.plum} stopOpacity="0.95" />
              <stop offset="100%" stopColor={C.ink} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1000" height="420" fill="url(#kn-dots)" />
          <rect width="1000" height="420" fill="url(#kn-glow)" />
          {NET.map((n) => (
            <path key={`p${n.label}`} d={netPath(n)} stroke="rgba(199,174,230,0.3)" strokeWidth="1.5" fill="none" />
          ))}
          {!reduced &&
            NET.map((n, idx) => (
              <circle key={`d${n.label}`} r="4.5" fill={C.lilac}>
                <animateMotion dur={`${2.4 + (idx % 4) * 0.5}s`} begin={`${(idx * 0.41) % 2}s`} repeatCount="indefinite" path={netPath(n)} />
              </circle>
            ))}
          {NET.map((n) => {
            const w = n.label.length * 8.6 + 22;
            return (
              <g key={`n${n.label}`}>
                {n.kind === "site" ? (
                  <rect x={n.x - 8} y={n.y - 8} width="16" height="16" fill={C.lilac} />
                ) : n.kind === "carrier" ? (
                  <circle cx={n.x} cy={n.y} r="8" fill={C.violet} stroke={C.lilac} strokeWidth="2" />
                ) : n.kind === "system" ? (
                  <rect x={n.x - 8} y={n.y - 8} width="16" height="16" rx="3" fill="none" stroke={C.lilac} strokeWidth="2" />
                ) : (
                  <circle cx={n.x} cy={n.y} r="6" fill={C.onDark} />
                )}
                <g className="kn-label">
                  <rect x={n.x + 16} y={n.y - 15} width={w} height="30" rx="15" fill="rgba(246,243,238,0.08)" stroke="rgba(199,174,230,0.28)" />
                  <text x={n.x + 27} y={n.y} dominantBaseline="central" style={sans} fontSize="14.5" fontWeight="600" fill={C.onDark}>
                    {n.label}
                  </text>
                </g>
              </g>
            );
          })}
          <g transform={`translate(${HUB.x - 40} ${HUB.y - 40})`}>
            <rect width="80" height="80" rx="6" fill={C.plum} stroke={C.lilac} strokeOpacity="0.45" />
            <g transform="translate(21 21) scale(3.17)">
              <path d={K_BAR} fill={C.paper} />
              <path d={K_ARROW} fill={C.paper} />
            </g>
          </g>
        </svg>
      </div>
      <div className="kn-card k-numcard" style={{ position: "absolute", left: "9%", bottom: "-9%", width: "min(320px, 72%)", background: C.card, border: `1px solid ${C.line}`, borderRadius: 4, padding: "18px 20px 16px", boxShadow: "0 30px 60px -30px rgba(23,16,28,0.45)", textAlign: "left" }}>
        <Label>One view · example network</Label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
          <span style={{ ...mono, fontSize: 34, fontWeight: 500, lineHeight: 1, color: C.plum, fontVariantNumeric: "tabular-nums" }}>{Math.round(orders).toLocaleString("en-US")}</span>
          <span style={{ ...sans, fontSize: 14, color: C.stone }}>orders this week</span>
        </div>
        <p style={{ ...sans, fontSize: 13, lineHeight: 1.5, color: C.stone, margin: "8px 0 0" }}>Every piece connected, every order in one place. Illustrative figures.</p>
      </div>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .kn-wrap.armed:not(.is-in) .kn-card { opacity: 0; }
          @keyframes kn-card-kf { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
          .kn-wrap.is-in .kn-card { animation: kn-card-kf .6s cubic-bezier(.22,1,.36,1) both; }
        }
        @media (max-width: 640px) {
          .kn-label { display: none; }
          .kn-frame { clip-path: polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%) !important; }
        }
      `}</style>
    </div>
  );
}

// ── ConsoleView — "Why we're different" ──────────────────────────────────────
// A made-up account (Alder & Stone, the same example the /dashboard mockup
// uses). Score figures are the deck's illustrative ones (slide 29); the cost
// figure is PG Golf's proposal, labelled.
const SITES: [string, string, boolean][] = [
  ["Toronto", "On track", true],
  ["Columbus", "On track", true],
  ["Las Vegas", "Going live Dec", false],
];

export function ConsoleView() {
  const { ref, armed, inView } = useInView<HTMLDivElement>(0.4);
  const cost = useCount(25, 13.22, inView, 400);
  const score = useCount(0, 68, inView, 700, 1100);
  return (
    <div ref={ref} className={`kd-wrap${armed ? " armed" : ""}${inView ? " is-in" : ""}`} style={{ position: "relative", width: "100%", maxWidth: 640, margin: "0 auto", textAlign: "left" }}>
      <div aria-hidden style={{ position: "absolute", inset: "7% -5% -7% 22%", background: C.plum, clipPath: "polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%)", opacity: 0.95 }} />
      <div className="kd-card" style={{ position: "relative", background: C.card, border: `1px solid ${C.line}`, borderRadius: 6, boxShadow: "0 40px 80px -40px rgba(23,16,28,0.55)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, background: C.plum, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg viewBox="0 0 12 12" style={{ width: 12, height: 12 }}>
                <path d={K_BAR} fill={C.paper} />
                <path d={K_ARROW} fill={C.paper} />
              </svg>
            </div>
            <span style={{ ...sans, fontSize: 14, fontWeight: 700, color: C.ink }}>Alder &amp; Stone · Your network</span>
          </div>
          <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: C.stone, whiteSpace: "nowrap" }}>Example account</span>
        </div>

        <div className="kd-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr" }}>
          <div className="kd-rise" style={{ padding: "18px 18px 16px", borderRight: `1px solid ${C.line}`, animationDelay: "0.2s" }}>
            <Label>Cost per order</Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
              <span style={{ ...mono, fontSize: 36, fontWeight: 500, lineHeight: 1, color: C.ink, fontVariantNumeric: "tabular-nums" }}>${cost.toFixed(2)}</span>
              <span style={{ ...mono, fontSize: 13, color: C.stone, textDecoration: "line-through", textDecorationColor: C.violet }}>$25.00</span>
            </div>
            <p style={{ ...sans, fontSize: 12.5, lineHeight: 1.45, color: C.stone, margin: "8px 0 0" }}>Shipping, warehousing and fee. PG Golf&rsquo;s proposal, not yet realized.</p>
          </div>
          <div className="kd-rise" style={{ padding: "18px 18px 16px", animationDelay: "0.4s" }}>
            <Label>Performance score</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <svg viewBox="0 0 60 64" style={{ width: 48, height: 52, flex: "none" }} aria-hidden>
                <path d="M54 4 L54 60 L6 32 Z" fill="none" stroke={C.line} strokeWidth="1.5" />
                <path className="kd-tri" d="M54 14 L54 52 L20 33 Z" fill={C.lilac} stroke={C.plum} strokeWidth="1.5" />
              </svg>
              <div>
                <span style={{ ...mono, fontSize: 30, fontWeight: 500, lineHeight: 1, color: C.plum, fontVariantNumeric: "tabular-nums" }}>{Math.round(score)}</span>
                <span style={{ ...mono, fontSize: 12, color: C.stone }}> /100</span>
              </div>
            </div>
            <p style={{ ...sans, fontSize: 12.5, color: C.stone, margin: "6px 0 0" }}>Cost, operations, experience</p>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.line}` }}>
          {SITES.map(([site, status, ok], n) => (
            <div key={site} className="kd-rise" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", borderTop: n ? `1px solid ${C.line}` : "none", animationDelay: `${0.6 + n * 0.12}s` }}>
              <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: C.ink }}>
                <span style={{ width: 9, height: 9, background: ok ? C.plum : C.lilac, display: "inline-block" }} />
                {site}
              </span>
              <span style={{ ...mono, fontSize: 11, letterSpacing: "0.06em", color: ok ? C.plum : C.violet, background: C.mist, borderRadius: 999, padding: "4px 10px" }}>{status}</span>
            </div>
          ))}
        </div>

        <div className="kd-rise kd-suggest" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: C.mist, padding: "14px 18px", animationDelay: "1.1s" }}>
          <div>
            <Label>We suggest</Label>
            <p style={{ ...sans, fontSize: 14, fontWeight: 600, color: C.ink, margin: "4px 0 0" }}>Move West Coast parcels to a regional carrier</p>
          </div>
          <span className="kd-approve" style={{ ...sans, fontSize: 13.5, fontWeight: 700, color: C.paper, background: C.plum, borderRadius: 5, padding: "8px 14px", whiteSpace: "nowrap" }}>You approve</span>
        </div>
      </div>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .kd-wrap.armed:not(.is-in) .kd-card { opacity: 0; }
          @keyframes kd-card-kf { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
          .kd-wrap.is-in .kd-card { animation: kd-card-kf .7s cubic-bezier(.22,1,.36,1) both; }
          @keyframes kd-rise-kf { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
          .kd-wrap.is-in .kd-rise { animation: kd-rise-kf .5s cubic-bezier(.22,1,.36,1) both; }
          @keyframes kd-tri-kf { from { transform: scale(.2); } to { transform: none; } }
          .kd-wrap.is-in .kd-tri { transform-origin: 54px 33px; animation: kd-tri-kf .9s cubic-bezier(.22,1,.36,1) .7s both; }
          @keyframes kd-approve-kf { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,58,128,.45); } 50% { box-shadow: 0 0 0 7px rgba(110,58,128,0); } }
          .kd-wrap.is-in .kd-approve { animation: kd-approve-kf 2.4s ease 1.8s infinite; }
        }
        @media (max-width: 520px) {
          .kd-grid { grid-template-columns: 1fr !important; }
          .kd-grid > div { border-right: none !important; border-bottom: 1px solid ${C.line}; }
          .kd-suggest { flex-direction: column; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  );
}
