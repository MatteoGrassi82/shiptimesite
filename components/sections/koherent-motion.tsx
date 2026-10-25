"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";

// The tokens and hooks the /koherent sections share (koherent-bring.tsx "What
// we bring", koherent-method.tsx "How we work", koherent-target.tsx "The
// design target"; the hero is koherent-hero-art.tsx), plus ConsoleView for
// "Why we're different": what one view looks like, with "we suggest, you
// approve". ConsoleView was a hero option on Oct 23; Matteo picked A for the
// hero and asked for the other ideas further down the page. It starts when it
// scrolls into view, and renders its final state with reduced motion or
// without JS.

export const C = {
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
export const sans: CSSProperties = { fontFamily: "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif" };
export const mono: CSSProperties = { fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace" };
export const title: CSSProperties = { ...sans, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08 };
export const K_BAR = "M0 0 H3 V12 H0 Z";
export const K_ARROW = "M8.6 0 H12 L7.9 6 L12 12 H8.6 L4.5 6 Z";
export const CHEV = "M0 0 H3.4 L8 6 L3.4 12 H0 L4.6 6 Z";

// ── shared hooks ─────────────────────────────────────────────────────────────
const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(onChange: () => void) {
  const m = window.matchMedia(REDUCED);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
}

// `armed` turns true once JS is running (so CSS may hide things until they
// play); `inView` turns true the first time the element is on screen.
export function useInView<T extends Element>(threshold = 0.3): { ref: RefObject<T | null>; armed: boolean; inView: boolean } {
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
export function useCount(from: number, to: number, start: boolean, delay = 0, ms = 900) {
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

export function Label({ children, onDark = false, style }: { children: ReactNode; onDark?: boolean; style?: CSSProperties }) {
  return (
    <p style={{ ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: onDark ? C.lilac : C.violet, margin: 0, ...style }}>
      {children}
    </p>
  );
}

export function Chevrons({ total, done, size = 11, onDark = false }: { total: number; done: number; size?: number; onDark?: boolean }) {
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

// ── ConsoleView — "Why we're different" ──────────────────────────────────────
// A made-up account, Alder & Stone, with the same sites and numbers as the
// /dashboard mockup (components/console/scenarios.ts): Columbus and Reno live,
// Atlanta going live Nov 25, cost per order $11.21 (−$1.09). The score is the
// deck's illustrative 68 (slide 29). Illustrative throughout, and labelled.
export const SITES: [string, string, boolean][] = [
  ["Columbus, OH", "Live", true],
  ["Reno, NV", "Live", true],
  ["Atlanta, GA", "Going live Nov 25", false],
];

export function ConsoleView() {
  const { ref, armed, inView } = useInView<HTMLDivElement>(0.4);
  const cost = useCount(12.3, 11.21, inView, 400);
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
              {/* the count and the old price are for the eye; screen readers get one sentence */}
              <span className="sr-only">$11.21 per order, down from $12.30</span>
              <span aria-hidden style={{ ...mono, fontSize: 36, fontWeight: 500, lineHeight: 1, color: C.ink, fontVariantNumeric: "tabular-nums" }}>${cost.toFixed(2)}</span>
              <span aria-hidden style={{ ...mono, fontSize: 13, color: C.stone, textDecoration: "line-through", textDecorationColor: C.violet }}>$12.30</span>
            </div>
            <p style={{ ...sans, fontSize: 12.5, lineHeight: 1.45, color: C.stone, margin: "8px 0 0" }}>Shipping, warehousing and fee, in one number. Illustrative figures.</p>
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
            <p style={{ ...sans, fontSize: 14, fontWeight: 600, color: C.ink, margin: "4px 0 0" }}>Ship West Coast orders from Reno: 2.4 days faster</p>
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
          /* three pulses, then still: motion only as an accent (Michael, Aug 6) */
          .kd-wrap.is-in .kd-approve { animation: kd-approve-kf 2.4s ease 1.8s 3; }
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
