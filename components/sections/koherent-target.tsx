"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { C, Chevrons, Label, mono, sans, title, useInView, useReducedMotion } from "./koherent-motion";

// ── TargetTriangle — "The design target" ─────────────────────────────────────
// The deck's triangle (slide 26) as a quick score. Matteo picked it on Oct 23
// out of three ideas on /koherent/lab. Visitors put in three numbers, with the
// sliders or by dragging a corner, and their triangle takes shape inside the
// target: the band where all three are at level 5.
//
// It speaks the full Logistics Performance Score's language: the same
// weighting (lib/lps.ts: Costs 42, Operational Excellence 34, Customer
// Experience 24) and the same five bands (lps-shiplet.tsx), so the quick
// number and the real one never argue. The scales are a ten-second estimate,
// not the LPS: $8 all in per order counts as best and $30 as worst; 99.5% on
// time as best and 85% as worst; 90% of customers within 2 days as best and
// 20% as worst.

type Axis = { pillar: string; corner: string; ask: string; unit: string; min: number; max: number; step: number; start: number; weight: number; lowIsBest?: boolean; fmt: (v: number) => string };

const AXES: Axis[] = [
  { pillar: "Lower cost", corner: "Cost", ask: "What you pay per order, all in", unit: "per order", min: 8, max: 30, step: 0.25, start: 14.5, weight: 42, lowIsBest: true, fmt: (v) => `$${v.toFixed(2)}` },
  { pillar: "Smoother operations", corner: "Operations", ask: "Orders delivered on time", unit: "on time", min: 85, max: 99.5, step: 0.1, start: 93, weight: 34, fmt: (v) => `${v.toFixed(1)}%` },
  { pillar: "Better customer experience", corner: "Experience", ask: "Customers you reach within 2 days", unit: "within 2 days", min: 20, max: 90, step: 1, start: 45, weight: 24, fmt: (v) => `${Math.round(v)}%` },
];
const BANDS = ["Foundational", "Reactive", "Developing", "Advancing", "Optimized"];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
// How far along its scale a value is, from 0 (worst) to 1 (best), and back.
const shareOf = (a: Axis, v: number) => clamp((a.lowIsBest ? a.max - v : v - a.min) / (a.max - a.min));
const valueAt = (a: Axis, s: number) => {
  const raw = a.lowIsBest ? a.max - s * (a.max - a.min) : a.min + s * (a.max - a.min);
  return Number((Math.round(raw / a.step) * a.step).toFixed(2));
};

// Geometry, in viewBox units. The triangle points left like the K's arrowhead
// closed: cost top right, operations at the point, experience bottom right.
// The margins either side hold the corner labels.
const W = 606;
const H = 460;
const CORNERS: [number, number][] = [[476, 30], [130, 230], [476, 430]];
const G: [number, number] = [(CORNERS[0][0] + CORNERS[1][0] + CORNERS[2][0]) / 3, 230]; // the centre, where the spokes meet
const FLOOR = 0.12; // the smallest a triangle gets, so its corners never meet
const along = (s: number) => FLOOR + (1 - FLOOR) * s; // share → distance out along the spoke
const pointAt = (n: number, t: number): [number, number] => [G[0] + (CORNERS[n][0] - G[0]) * t, G[1] + (CORNERS[n][1] - G[1]) * t];
const shape = (ts: number[]) => ts.map((t, n) => pointAt(n, t)).map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + " Z";
const ring = (s: number) => shape([along(s), along(s), along(s)]);
const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

// Each corner's label sits beside its corner, outside the triangle.
const TAGS: CSSProperties[] = [
  { left: pct((CORNERS[0][0] + 20) / W), top: pct((CORNERS[0][1] - 12) / H) },
  { right: pct(1 - (CORNERS[1][0] - 20) / W), top: pct(CORNERS[1][1] / H), transform: "translateY(-50%)", textAlign: "right" },
  { left: pct((CORNERS[2][0] + 20) / W), bottom: pct((H - CORNERS[2][1] - 12) / H) },
];
const DARK_LINE = "rgba(246,243,238,0.16)";
const BAND_FILL = "rgba(110,58,128,0.34)";
const BAND_ON = "rgba(199,174,230,0.3)"; // all three corners inside the target

export function TargetTriangle() {
  const reduced = useReducedMotion();
  const { ref, armed, inView } = useInView<HTMLDivElement>(0.35);
  const svg = useRef<SVGSVGElement>(null);
  const [values, setValues] = useState(() => AXES.map((a) => a.start));
  const [drag, setDrag] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [g, setG] = useState(0);

  // The first time it's on screen, the triangle grows out of the centre and
  // the score counts up with it. Any input skips straight to the end.
  useEffect(() => {
    if (reduced || touched || !inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = clamp((now - t0 - 250) / 1100);
      setG(1 - Math.pow(1 - k, 3));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, touched, inView]);
  const grow = reduced || touched || !armed ? 1 : inView ? g : 0;

  const shares = AXES.map((a, n) => shareOf(a, values[n]));
  const full = Math.round(AXES.reduce((sum, a, n) => sum + a.weight * shares[n], 0));
  const score = Math.round(full * grow);
  const level = Math.min(5, Math.floor(score / 20) + 1);
  const ts = shares.map((s) => along(s * grow));
  const yours = shape(ts);
  const onTarget = grow === 1 && shares.every((s) => s >= 0.8);

  const set = (n: number, v: number) => {
    setTouched(true);
    setValues((vs) => vs.map((x, k) => (k === n ? v : x)));
  };

  // Dragging a corner moves it along its own spoke: the pointer is projected
  // onto the line from the centre to that corner.
  const dragTo = (n: number, e: ReactPointerEvent<SVGGElement>) => {
    const m = svg.current?.getScreenCTM();
    if (!m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    const vx = CORNERS[n][0] - G[0];
    const vy = CORNERS[n][1] - G[1];
    const t = ((p.x - G[0]) * vx + (p.y - G[1]) * vy) / (vx * vx + vy * vy);
    set(n, valueAt(AXES[n], clamp((t - FLOOR) / (1 - FLOOR))));
  };

  return (
    <div ref={ref} className={`kt${armed ? " armed" : ""}${inView ? " is-in" : ""}`} style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "clamp(36px, 6vw, 88px)", alignItems: "center", textAlign: "left" }}>
      <div>
        <div style={{ position: "relative" }}>
          <svg
            ref={svg}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`Your triangle: ${AXES.map((a, n) => `${a.corner.toLowerCase()} ${a.fmt(values[n])} ${a.unit}`).join(", ")}. Quick score ${full} out of 100.`}
            style={{ width: "100%", height: "auto", display: "block", overflow: "visible", userSelect: "none", WebkitUserSelect: "none" }}
          >
            <defs>
              <linearGradient id="kt-fill" gradientUnits="userSpaceOnUse" x1={CORNERS[1][0]} y1={G[1]} x2={CORNERS[0][0]} y2={G[1]}>
                <stop offset="0" stopColor={C.violet} />
                <stop offset="1" stopColor={C.lilac} />
              </linearGradient>
              <filter id="kt-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>

            {/* the target: level 5 on all three */}
            <path d={`${ring(1)} ${ring(0.8)}`} fillRule="evenodd" fill={onTarget ? BAND_ON : BAND_FILL} style={{ transition: "fill .4s ease" }} />
            {/* one ring per band, Foundational to Advancing */}
            {[0.2, 0.4, 0.6, 0.8].map((s, k) => (
              <path key={s} className="kt-ring" d={ring(s)} fill="none" stroke="rgba(199,174,230,0.16)" style={{ animationDelay: `${k * 90}ms` }} />
            ))}
            <path d={ring(1)} fill="none" stroke={C.lilac} strokeOpacity="0.65" strokeWidth="1.5" />
            {CORNERS.map(([x, y], n) => (
              <g key={n}>
                <line x1={G[0]} y1={G[1]} x2={x} y2={y} stroke="rgba(199,174,230,0.2)" strokeDasharray="2 6" />
                <circle cx={x} cy={y} r="4.5" fill={C.lilac} opacity="0.8" />
              </g>
            ))}

            {/* yours */}
            <path d={yours} fill={C.lilac} opacity="0.3" filter="url(#kt-glow)" />
            <path d={yours} fill="url(#kt-fill)" fillOpacity="0.92" stroke={C.lilac} strokeWidth="2" strokeLinejoin="round" />
            {ts.map((t, n) => {
              const [x, y] = pointAt(n, t);
              return (
                <g
                  key={n}
                  className={`kt-handle${drag === n ? " is-drag" : ""}`}
                  transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setDrag(n);
                    dragTo(n, e);
                  }}
                  onPointerMove={(e) => {
                    if (drag === n) dragTo(n, e);
                  }}
                  onPointerUp={() => setDrag(null)}
                  onPointerCancel={() => setDrag(null)}
                >
                  {n === 0 && !touched && <circle className="kt-hint" r="12" fill="none" stroke={C.lilac} strokeWidth="2" />}
                  <circle className="kt-halo" r="22" fill={C.lilac} />
                  <circle r="11" fill={C.ink} stroke={C.lilac} strokeWidth="2.5" />
                  <circle r="4" fill={C.lilac} />
                  <circle r="24" fill="transparent" />
                </g>
              );
            })}
          </svg>
          {AXES.map((a, n) => (
            <div key={a.corner} aria-hidden style={{ position: "absolute", pointerEvents: "none", whiteSpace: "nowrap", ...TAGS[n] }}>
              <span className="kt-tag-l" style={{ ...mono, display: "block", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.lilac }}>{a.corner}</span>
              <span className="kt-tag-v" style={{ ...mono, display: "block", fontSize: 22, color: drag === n ? C.lilac : C.onDark, marginTop: 4, fontVariantNumeric: "tabular-nums", transition: "color .2s ease" }}>{a.fmt(values[n])}</span>
              <span className="kt-tag-u" style={{ ...sans, display: "block", fontSize: 12.5, color: C.onDarkDim, marginTop: 1 }}>{a.unit}</span>
            </div>
          ))}
        </div>
        <div aria-hidden style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 26px", marginTop: 20, ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.onDarkDim }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 18, height: 10, background: BAND_FILL, border: `1px solid ${C.lilac}`, borderRadius: 2 }} />
            The target: level 5 on all three
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 12, height: 12, borderRadius: 99, background: C.ink, border: `2px solid ${C.lilac}` }} />
            Drag a corner
          </span>
        </div>
      </div>

      <div>
        <Label onDark>Your quick score</Label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 12 }}>
          <span style={{ ...mono, fontSize: "clamp(3.6rem, 6.4vw, 5rem)", fontWeight: 500, lineHeight: 0.9, letterSpacing: "-0.04em", color: C.onDark, fontVariantNumeric: "tabular-nums" }}>{score}</span>
          <span style={{ ...mono, fontSize: 16, color: C.lilac }}>/100</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <Chevrons total={5} done={level} size={15} onDark />
          <span style={{ ...mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: C.lilac }}>
            Level {level} of 5 · {BANDS[level - 1]}
          </span>
        </div>

        <div style={{ marginTop: 28 }}>
          {AXES.map((a, n) => (
            <div key={a.corner} style={{ padding: "16px 0 6px", borderTop: `1px solid ${DARK_LINE}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <span style={{ ...title, fontSize: "1.1rem", color: C.onDark }}>{a.pillar}</span>
                <span style={{ ...mono, fontSize: 16, color: C.lilac, fontVariantNumeric: "tabular-nums" }}>{a.fmt(values[n])}</span>
              </div>
              <p style={{ ...sans, fontSize: 14, color: C.onDarkDim, margin: "3px 0 0" }}>{a.ask}</p>
              <input
                className="kt-range"
                type="range"
                min={a.min}
                max={a.max}
                step={a.step}
                value={values[n]}
                aria-label={`${a.pillar}: ${a.ask}`}
                aria-valuetext={a.fmt(values[n])}
                onChange={(e) => set(n, Number(e.target.value))}
                style={{ "--p": pct((values[n] - a.min) / (a.max - a.min)) } as CSSProperties}
              />
            </div>
          ))}
        </div>

        <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.6, color: C.onDarkDim, margin: "16px 0 0" }}>
          A quick estimate from three numbers. The full score takes sixteen questions and five minutes, and shows where you&rsquo;re losing money.
        </p>
        <Link href="/plus/assessment" className="k-btn" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15.5, fontWeight: 700, color: C.plum, background: C.paper, borderRadius: 6, padding: "14px 22px", textDecoration: "none", marginTop: 20 }}>
          Get your full score <ArrowRight size={16} />
        </Link>
      </div>

      <style>{`
        .kt-handle { cursor: grab; touch-action: none; }
        .kt-handle.is-drag { cursor: grabbing; }
        .kt-halo { opacity: 0; transition: opacity .2s ease; }
        .kt-handle:hover .kt-halo, .kt-handle.is-drag .kt-halo { opacity: .22; }
        .kt-range { -webkit-appearance: none; appearance: none; display: block; width: 100%; height: 30px; margin: 6px 0 0; background: transparent; cursor: pointer; }
        .kt-range:focus { outline: none; }
        .kt-range:focus-visible { outline: 2px solid ${C.lilac}; outline-offset: 2px; border-radius: 6px; }
        .kt-range::-webkit-slider-runnable-track { height: 4px; border-radius: 99px; background: linear-gradient(to right, ${C.lilac} var(--p), rgba(246,243,238,0.16) var(--p)); }
        .kt-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; margin-top: -8px; border-radius: 50%; background: ${C.ink}; border: 2.5px solid ${C.lilac}; transition: box-shadow .2s ease; }
        .kt-range:hover::-webkit-slider-thumb, .kt-range:active::-webkit-slider-thumb { box-shadow: 0 0 0 7px rgba(199,174,230,0.22); }
        .kt-range::-moz-range-track { height: 4px; border-radius: 99px; background: rgba(246,243,238,0.16); }
        .kt-range::-moz-range-progress { height: 4px; border-radius: 99px; background: ${C.lilac}; }
        .kt-range::-moz-range-thumb { width: 15px; height: 15px; border-radius: 50%; background: ${C.ink}; border: 2.5px solid ${C.lilac}; }
        .kt-hint { opacity: 0; transform-box: fill-box; transform-origin: center; }
        @media (prefers-reduced-motion: no-preference) {
          .kt.armed:not(.is-in) .kt-ring { opacity: 0; }
          @keyframes kt-ring-kf { from { opacity: 0; } to { opacity: 1; } }
          .kt.is-in .kt-ring { animation: kt-ring-kf .6s ease both; }
          @keyframes kt-hint-kf { from { transform: scale(1); opacity: .9; } to { transform: scale(2.8); opacity: 0; } }
          .kt.is-in .kt-hint { animation: kt-hint-kf 1.5s ease-out 1.5s 3; }
        }
        @media (max-width: 900px) { .kt { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) {
          .kt-tag-l { font-size: 9px !important; letter-spacing: 0.06em !important; }
          .kt-tag-v { font-size: 15px !important; margin-top: 2px !important; }
          .kt-tag-u { display: none !important; }
        }
      `}</style>
    </div>
  );
}
