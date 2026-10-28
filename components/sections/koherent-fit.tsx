"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHEV, K, PAGES, mono, sans, title } from "./koherent-brand";

// ── FitSlider — "Where do you fit?" ──────────────────────────────────────────
// The three tiers as something to try: drag the monthly orders, tick "more
// than one site", and the band says ShipTime or Koherent, and what switches
// on. Answers Chris's and Michael's question (Oct 27) of when a company
// should choose which. The verdicts are the same three as the tiers they
// replace; the thresholds (500, 5,000 or a second site) are the deck's fork,
// revised Oct 28 and still for Michael to confirm.

const STOPS = [100, 250, 500, 1000, 2000, 5000, 10000, 20000];

type Verdict = { name: string; body: string; href?: string; on: number };
function verdict(orders: number, multi: boolean): Verdict {
  if (!multi && orders < 500) {
    return { name: "ShipTime", body: "Our shipping platform: discounted labels from every carrier, in one dashboard. Self-serve, no minimum.", href: "https://www.shiptime.com", on: 1 };
  }
  if (!multi && orders < 5000) {
    return { name: "Koherent, at your own dock", body: "We take cost out of what you ship today, with our rates and our engine, and a named team on your account. No new warehouse yet.", on: 2 };
  }
  return { name: "Koherent, the whole network", body: "We design and run the network with you: partner warehouses placed where your customers are, a go-live plan with owners on both sides, and one number per order.", on: 3 };
}

const SWITCHES = [
  "Discounted rates from every carrier, one dashboard",
  "Routing rules, your sites and reports, with a named team on your account",
  "Partner warehouses, a go-live plan and the whole network run with you",
];

const dim: CSSProperties = { ...sans, color: K.onDarkDim };

export function FitSlider() {
  const [i, setI] = useState(3); // 1,000 a month
  const [multi, setMulti] = useState(false);
  const orders = STOPS[i];
  const v = verdict(orders, multi);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 900, marginTop: 10, textAlign: "left" }}>
      <div className="k-fit" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(20px, 3vw, 40px)", borderTop: `1px solid ${K.darkLine}`, paddingTop: 22 }}>
        {/* the dials */}
        <div>
          <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: K.lilac, margin: 0 }}>Where do you fit?</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
            <span style={{ ...mono, fontSize: "clamp(2rem, 3.6vw, 2.8rem)", fontWeight: 500, lineHeight: 1, color: K.onDark, fontVariantNumeric: "tabular-nums" }}>
              {orders.toLocaleString("en-US")}
              {i === STOPS.length - 1 ? "+" : ""}
            </span>
            <span style={{ ...dim, fontSize: 14.5 }}>orders a month</span>
          </div>
          <input
            type="range"
            className="k-fit-range"
            min={0}
            max={STOPS.length - 1}
            step={1}
            value={i}
            aria-label="Orders a month"
            aria-valuetext={`${orders.toLocaleString("en-US")} orders a month`}
            onChange={(e) => setI(Number(e.target.value))}
            style={{ "--p": `${(i / (STOPS.length - 1)) * 100}%` } as CSSProperties}
          />
          <div style={{ display: "flex", justifyContent: "space-between", ...mono, fontSize: 10.5, color: K.lilac, marginTop: 4 }}>
            <span>100</span>
            <span>500</span>
            <span>5,000</span>
            <span>20,000+</span>
          </div>
          <label style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 10, marginTop: 18, fontSize: 14.5, color: K.onDark, cursor: "pointer" }}>
            <input type="checkbox" checked={multi} onChange={(e) => setMulti(e.target.checked)} className="k-fit-check" />
            We ship from more than one site, or need to
          </label>
        </div>

        {/* the verdict */}
        <div>
          <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: K.lilac, margin: 0 }}>You&rsquo;d start on</p>
          <p key={v.name} className="k-fit-in" style={{ ...title, fontSize: "clamp(1.3rem, 2vw, 1.6rem)", color: K.onDark, margin: "10px 0 0" }}>
            {v.href ? (
              <a href={v.href} style={{ color: K.onDark, textDecoration: "underline", textDecorationColor: K.lilac, textUnderlineOffset: 4 }}>{v.name}</a>
            ) : (
              v.name
            )}
          </p>
          <p style={{ ...dim, fontSize: 15, lineHeight: 1.55, margin: "8px 0 0" }}>{v.body}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "grid", gap: 8 }}>
            {SWITCHES.map((s, n) => {
              const on = n < v.on;
              return (
                <li key={s} style={{ ...sans, display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5, color: on ? K.onDark : "rgba(246,243,238,0.42)", transition: "color .3s ease" }}>
                  <svg viewBox="0 0 8 12" aria-hidden style={{ width: 7, height: 11, flex: "none", marginTop: 5 }}>
                    <path d={CHEV} fill={on ? K.lilac : "rgba(199,174,230,0.25)"} style={{ transition: "fill .3s ease" }} />
                  </svg>
                  {s}
                </li>
              );
            })}
          </ul>
          <Link href={PAGES.score} className="k-more" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, marginTop: 18, fontSize: 14.5, fontWeight: 700, color: K.lilac, textDecoration: "none" }}>
            Not sure? Get your logistics score <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <style>{`
        .k-fit-range { -webkit-appearance: none; appearance: none; display: block; width: 100%; height: 28px; margin: 14px 0 0; background: transparent; cursor: pointer; }
        .k-fit-range::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; background: linear-gradient(90deg, ${K.lilac} var(--p), rgba(199,174,230,0.25) var(--p)); }
        .k-fit-range::-moz-range-track { height: 4px; border-radius: 2px; background: rgba(199,174,230,0.25); }
        .k-fit-range::-moz-range-progress { height: 4px; border-radius: 2px; background: ${K.lilac}; }
        .k-fit-range::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; margin-top: -9px; border-radius: 50%; background: ${K.paper}; border: 3px solid ${K.plum}; box-shadow: 0 0 0 3px ${K.lilac}; }
        .k-fit-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: ${K.paper}; border: 3px solid ${K.plum}; box-shadow: 0 0 0 3px ${K.lilac}; }
        .k-fit-range:focus-visible { outline: 2px solid ${K.lilac}; outline-offset: 4px; }
        .k-fit-check { width: 18px; height: 18px; accent-color: ${K.lilac}; }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes k-fit-in-kf { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
          .k-fit-in { animation: k-fit-in-kf .3s ease both; }
        }
        @media (max-width: 760px) { .k-fit { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
