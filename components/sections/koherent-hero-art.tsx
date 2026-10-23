"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

// The hero's right-hand visual for /koherent, played once on load (~3s):
//   1. the deck's problem pieces appear scattered (slide 04: carriers,
//      warehouses, spreadsheets, a 3PL price list),
//   2. they pull together into the K at the photo's arrow tip ("everything
//      coming together at one point", slide 16),
//   3. the photo opens from that point, left to right, behind the steps,
//      which sweep across once and stop (slide 26),
//   4. the cost card rises and counts $25.00 → $13.22 (PG Golf, proposed).
// With reduced motion everything renders in its final state. All motion is
// CSS except the count, which needs a few frames of JS.

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

// Start positions (% of the art box); all end at the arrow tip (0%, 50%).
const PIECES: { label: string; x: string; y: string; delay: number }[] = [
  { label: "Carriers", x: "24%", y: "14%", delay: 0 },
  { label: "Warehouses", x: "66%", y: "26%", delay: 0.08 },
  { label: "Spreadsheets", x: "34%", y: "74%", delay: 0.16 },
  { label: "A 3PL price list", x: "68%", y: "86%", delay: 0.24 },
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
    <div className="kh-art" style={{ position: "relative", width: "100%" }}>
      {/* the photo, opened from the arrow tip */}
      <div className="kh-photo" style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%)", background: C.mist }}>
        <img src={src} alt={alt} width={1024} height={1024} style={{ width: "100%", height: "auto", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} />
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
      <div aria-hidden className="kh-k" style={{ position: "absolute", left: 0, top: "50%", width: 76, height: 76, marginLeft: -38, marginTop: -38, background: C.plum, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px -20px rgba(23,16,28,0.6)" }}>
        <svg viewBox="0 0 12 12" style={{ width: 36, height: 36 }}>
          <path d={K_BAR} fill={C.paper} />
          <path d={K_ARROW} fill={C.paper} />
        </svg>
      </div>

      {/* one number per order */}
      <div className="kh-card k-numcard" style={{ position: "absolute", right: "4%", bottom: "-5%", width: "min(300px, 72%)", background: C.ink, color: C.onDark, borderRadius: 4, padding: "20px 22px 18px", boxShadow: "0 30px 60px -30px rgba(23,16,28,0.6)" }}>
        <p style={{ ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.lilac, margin: 0 }}>Your cost per order</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 10 }}>
          <span style={{ ...mono, fontSize: 40, fontWeight: 500, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>${value.toFixed(2)}</span>
          <span className="kh-was" style={{ ...mono, position: "relative", fontSize: 15, color: C.onDarkDim }}>
            $25.00
            <span className="kh-strike" style={{ position: "absolute", left: 0, top: "52%", height: 1.5, width: "100%", background: C.lilac, transformOrigin: "left center" }} />
          </span>
        </div>
        <p style={{ ...sans, fontSize: 13, lineHeight: 1.5, color: C.onDarkDim, margin: "10px 0 0" }}>
          Shipping, warehousing and our fee in one number. Proposed for PG Golf, not yet realized.
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
            to   { clip-path: polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%); }
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
      `}</style>
    </div>
  );
}
