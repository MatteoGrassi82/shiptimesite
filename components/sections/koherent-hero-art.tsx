"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

// The hero's right half for /koherent: "Hero C, split tall" (Matteo's pick,
// Oct 28, from the lab). A tall picture that runs the full height of the hero
// and off the right edge of the page, cut by the K's arrowhead on its left,
// played once on load (~3s):
//   1. the deck's problem pieces appear scattered (slide 04: carriers,
//      warehouses, spreadsheets, a 3PL price list),
//   2. they pull together into the K at the arrow tip ("everything coming
//      together at one point", slide 16),
//   3. the picture opens from that point, left to right, behind the steps,
//      which sweep across once and stop (slide 26),
//   4. the cost card rises over the picture's corner and counts $25.00 →
//      $13.22: the delivered cost per shipment from our proposal for the US
//      golf brand (koherent-cases.ts), labelled proposed.
// On a phone (≤960px) the picture sits under the words, edge to edge at 4:5,
// the card below it, and only the card's count plays. With reduced motion
// everything renders in its final state.

const C = {
  ink: "#17101C",
  plum: "#461948",
  violet: "#6E3A80",
  lilac: "#C7AEE6",
  mist: "#EEE8F3",
  paper: "#F6F3EE",
  line: "#DCD4E2",
  onDark: "#F6F3EE",
  onDarkDim: "rgba(246,243,238,0.74)",
};
const sans: CSSProperties = { fontFamily: "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif" };
const mono: CSSProperties = { fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace" };

const K_BAR = "M0 0 H3 V12 H0 Z";
const K_ARROW = "M8.6 0 H12 L7.9 6 L12 12 H8.6 L4.5 6 Z";
const ARROW = "polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)";

// Start positions (% of the art box); all end at the arrow tip (0%, 50%).
const PIECES: { label: string; x: string; y: string; delay: number }[] = [
  { label: "Carriers", x: "30%", y: "16%", delay: 0 },
  { label: "Warehouses", x: "70%", y: "30%", delay: 0.08 },
  { label: "Spreadsheets", x: "36%", y: "72%", delay: 0.16 },
  { label: "A 3PL price list", x: "72%", y: "84%", delay: 0.24 },
];

const FROM = 25.0;
const TO = 13.22;
const COUNT_START_MS = 2350;
const COUNT_MS = 900;

function useCountdown() {
  // Server and first client render agree on the final value; the effect only
  // rewinds it while the card is still invisible (it fades in at ~2.2s).
  const [value, setValue] = useState(TO);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0 - COUNT_START_MS) / COUNT_MS));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(FROM + (TO - FROM) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return value;
}

export function KoherentHeroArt({ src, alt }: { src: string; alt: string }) {
  const value = useCountdown();
  return (
    <div className="kh-art" style={{ position: "relative", alignSelf: "stretch", minHeight: 580 }}>
      {/* the picture: tall, off the right edge, opened from the arrow tip */}
      <div className="kh-photo" style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: "calc(-1 * max(0px, (100vw - 1200px) / 2))", clipPath: ARROW, background: C.mist }}>
        <img src={src} alt={alt} width={1536} height={1024} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "58% 50%", display: "block" }} />
        {/* an AI placeholder until our own shoot, so it says so (as the bento's do) */}
        <span style={{ ...mono, position: "absolute", top: 14, right: "calc(14px + max(0px, (100vw - 1200px) / 2))", fontSize: 10.5, lineHeight: 1.4, letterSpacing: "0.04em", color: C.onDark, background: "rgba(23,16,28,0.55)", borderRadius: 8, padding: "5px 10px" }}>Illustrative photo</span>
      </div>

      {/* the steps, sweeping across once */}
      <div aria-hidden className="kh-sweep" style={{ position: "absolute", top: "50%", left: 0, display: "flex", gap: 10, transform: "translateY(-50%)" }}>
        {[0, 1, 2].map((i) => (
          <svg key={i} viewBox="0 0 8 12" style={{ width: 46, height: 69 }}>
            <path d="M0 0 H3.4 L8 6 L3.4 12 H0 L4.6 6 Z" fill={i === 2 ? C.plum : i === 1 ? C.violet : C.lilac} />
          </svg>
        ))}
      </div>

      {/* the pieces, pulling together */}
      {PIECES.map((p) => (
        <span
          key={p.label}
          aria-hidden
          className="kh-piece"
          style={{
            ...sans,
            ["--x" as string]: p.x,
            ["--y" as string]: p.y,
            animationDelay: `${p.delay}s`,
            position: "absolute",
            left: "0%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            fontSize: 15,
            fontWeight: 600,
            color: C.ink,
            background: "#FFFDFA",
            border: `1px solid ${C.line}`,
            borderRadius: 999,
            padding: "9px 16px",
            boxShadow: "0 12px 30px -18px rgba(23,16,28,0.45)",
          }}
        >
          {p.label}
        </span>
      ))}

      {/* the K at the arrow tip, where the pieces arrive */}
      <div aria-hidden className="kh-k" style={{ position: "absolute", left: 0, top: "50%", width: 80, height: 80, marginLeft: -40, marginTop: -40, background: C.plum, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px -20px rgba(23,16,28,0.6)" }}>
        <svg viewBox="0 0 12 12" style={{ width: 38, height: 38 }}>
          <path d={K_BAR} fill={C.paper} />
          <path d={K_ARROW} fill={C.paper} />
        </svg>
      </div>

      {/* the golf case's proposed cost per shipment (koherent-cases.ts) */}
      <div className="kh-card" style={{ position: "absolute", left: "-6%", bottom: "9%", width: "min(300px, 78%)", background: C.ink, color: C.onDark, borderRadius: 4, padding: "20px 22px 18px", boxShadow: "0 30px 60px -30px rgba(23,16,28,0.6)" }}>
        <p style={{ ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.lilac, margin: 0 }}>Cost per shipment · proposed</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 10 }}>
          {/* the count and the struck-out figure are visual; a screen reader
              gets the one stable sentence, never "$25.00 $25.00" mid-count */}
          <span aria-hidden style={{ ...mono, fontSize: 40, fontWeight: 500, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>${value.toFixed(2)}</span>
          <span aria-hidden className="kh-was" style={{ ...mono, position: "relative", fontSize: 15, color: C.onDarkDim }}>
            $25.00
            <span className="kh-strike" style={{ position: "absolute", left: 0, top: "52%", height: 1.5, width: "100%", background: C.lilac, transformOrigin: "left center" }} />
          </span>
          <span className="sr-only">$13.22, down from $25.00</span>
        </div>
        <p style={{ ...sans, fontSize: 13, lineHeight: 1.5, color: C.onDarkDim, margin: "10px 0 0" }}>
          Delivered cost per shipment, from our proposal for a US golf brand entering Canada. Not yet realized.
        </p>
      </div>

      <style>{`
        .kh-piece { opacity: 0; }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes kh-piece-kf {
            0%   { left: var(--x); top: var(--y); opacity: 0; transform: translate(-50%, -30%) scale(0.96); }
            14%  { left: var(--x); top: var(--y); opacity: 1; transform: translate(-50%, -50%) scale(1); }
            46%  { left: var(--x); top: var(--y); opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { left: 0%; top: 50%; opacity: 0; transform: translate(-50%, -50%) scale(0.35); }
          }
          .kh-piece { animation: kh-piece-kf 1.7s cubic-bezier(.65,0,.35,1) both; }

          @keyframes kh-k-kf { 0% { opacity: 0; transform: scale(0.4); } 70% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
          .kh-k { animation: kh-k-kf .5s cubic-bezier(.22,1,.36,1) 1.45s both; }

          @keyframes kh-photo-kf {
            from { clip-path: polygon(0% 0, 0% 0, 0% 100%, 0% 100%, 0 50%); }
            to   { clip-path: ${ARROW}; }
          }
          .kh-photo { animation: kh-photo-kf .95s cubic-bezier(.65,0,.35,1) 1.75s both; }

          @keyframes kh-sweep-kf {
            0%   { left: 0%; opacity: 0; }
            12%  { opacity: 1; }
            85%  { opacity: 1; }
            100% { left: 100%; opacity: 0; }
          }
          .kh-sweep { opacity: 0; animation: kh-sweep-kf .95s cubic-bezier(.65,0,.35,1) 1.75s both; }

          @keyframes kh-card-kf { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
          .kh-card { animation: kh-card-kf .6s cubic-bezier(.22,1,.36,1) 2.2s both; }

          @keyframes kh-strike-kf { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          .kh-strike { animation: kh-strike-kf .5s ease 2.55s both; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kh-sweep { display: none; }
        }
        /* phones and tablets: the picture under the words, the card under the picture */
        @media (max-width: 960px) {
          .k-hero { grid-template-columns: 1fr !important; min-height: 0 !important; padding-right: clamp(20px, 4vw, 56px) !important; }
          .k-hero-text { padding-bottom: 24px !important; }
          .kh-art { min-height: 0 !important; margin-right: calc(-1 * clamp(20px, 4vw, 56px)); }
          .kh-photo { position: relative !important; right: 0 !important; aspect-ratio: 4 / 5; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) !important; animation: none !important; }
          .kh-photo > span { right: 14px !important; }
          .kh-piece, .kh-sweep { display: none !important; }
          .kh-k { left: 16px !important; top: 16px !important; margin: 0 !important; width: 56px !important; height: 56px !important; animation: none !important; opacity: 1 !important; }
          .kh-k svg { width: 26px !important; height: 26px !important; }
          .kh-card { position: relative !important; left: auto !important; bottom: auto !important; width: auto !important; margin: 14px clamp(20px, 4vw, 56px) 0 0; }
        }
        /* tablets: a wider crop, so the picture doesn't run a whole screen tall */
        @media (min-width: 641px) and (max-width: 960px) {
          .kh-photo { aspect-ratio: 16 / 10; }
        }
      `}</style>
    </div>
  );
}
