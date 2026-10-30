"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHEV, K, PAGES, mono, sans, title } from "./koherent-brand";

// ── FitSlider — "Which door is yours?" ───────────────────────────────────────
// Drag the monthly orders, tick "more than one site" or "we run a warehouse",
// and the band names the door (Jenny's three, Oct 29) and which of the four
// solutions switch on, from her navigation doc: Growing brands start on Ship
// with Optimize as the upsell; Enterprise is Manage with the other three
// underneath; 3PL partners join Fulfill and use Ship. Below the first
// threshold it says ShipTime, the "not big enough for Koherent yet" feeder
// Jenny asked for in the Oct 29 L10. Started as Chris's and Michael's
// question (Oct 27) of when to choose which. The thresholds are the Oct 28
// tiers (500, 5,000 or a second site); Jenny's draft starts Growing brands at
// 50, so the two numbers below are the decision, in one place.
const SHIPTIME_BELOW = 500;
const ENTERPRISE_FROM = 5000;

const STOPS = [100, 250, 500, 1000, 2000, 5000, 10000, 20000];
const SOLUTIONS = ["Ship", "Fulfill", "Optimize", "Manage"] as const;
type Solution = (typeof SOLUTIONS)[number];

type Verdict = { name: string; body: string; href: string; on: Solution[] };
function verdict(orders: number, multi: boolean, warehouse: boolean): Verdict {
  if (warehouse) {
    return { name: "3PL and fulfillment partners", body: "We bring the demand and the technology, and you keep running the floor.", href: PAGES.partners, on: ["Ship", "Fulfill"] };
  }
  if (!multi && orders < SHIPTIME_BELOW) {
    return { name: "ShipTime", body: "ShipTime is built for you, with the same discounted rates and Heroic Support™ on a self-serve platform.", href: "https://www.shiptime.com", on: [] };
  }
  if (!multi && orders < ENTERPRISE_FROM) {
    return { name: "Growing brands", body: "We give you better rates, one platform and a team that answers the phone.", href: PAGES.growing, on: ["Ship", "Optimize"] };
  }
  return { name: "Enterprise brands", body: "We run it for you, with your rates or ours.", href: PAGES.enterprise, on: ["Ship", "Fulfill", "Optimize", "Manage"] };
}

const dim: CSSProperties = { ...sans, color: K.onDarkDim };

export function FitSlider() {
  const [i, setI] = useState(3); // 1,000 a month
  const [multi, setMulti] = useState(false);
  const [warehouse, setWarehouse] = useState(false);
  const orders = STOPS[i];
  const v = verdict(orders, multi, warehouse);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 900, marginTop: 10, textAlign: "left" }}>
      <div className="k-fit" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(20px, 3vw, 40px)", borderTop: `1px solid ${K.darkLine}`, paddingTop: 22 }}>
        {/* the dials */}
        <div>
          <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: K.lilac, margin: 0 }}>Which door is yours?</p>
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
          <label style={{ ...sans, display: "flex", alignItems: "center", gap: 10, marginTop: 18, fontSize: 14.5, color: K.onDark, cursor: "pointer" }}>
            <input type="checkbox" checked={multi} onChange={(e) => setMulti(e.target.checked)} className="k-fit-check" />
            We ship from more than one site, or need to
          </label>
          <label style={{ ...sans, display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontSize: 14.5, color: K.onDark, cursor: "pointer" }}>
            <input type="checkbox" checked={warehouse} onChange={(e) => setWarehouse(e.target.checked)} className="k-fit-check" />
            We run a warehouse for other brands
          </label>
        </div>

        {/* the verdict */}
        <div>
          <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: K.lilac, margin: 0 }}>Your door</p>
          <p key={v.name} className="k-fit-in" style={{ ...title, fontSize: "clamp(1.3rem, 2vw, 1.6rem)", color: K.onDark, margin: "10px 0 0" }}>
            <Link href={v.href} style={{ color: K.onDark, textDecoration: "underline", textDecorationColor: K.lilac, textUnderlineOffset: 4 }}>
              {v.name}
            </Link>
          </p>
          <p style={{ ...dim, fontSize: 15, lineHeight: 1.55, margin: "8px 0 0" }}>{v.body}</p>
          <p style={{ ...mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: K.lilac, margin: "18px 0 0" }}>{v.on.length ? "Switches on" : "Koherent, when you grow"}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SOLUTIONS.map((s) => {
              const on = v.on.includes(s);
              return (
                <li key={s} style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: on ? K.ink : "rgba(246,243,238,0.5)", background: on ? K.lilac : "transparent", border: `1px solid ${on ? K.lilac : "rgba(199,174,230,0.3)"}`, borderRadius: 999, padding: "6px 12px", transition: "background .3s ease, color .3s ease" }}>
                  <svg viewBox="0 0 8 12" aria-hidden style={{ width: 6, height: 9, flex: "none" }}>
                    <path d={CHEV} fill={on ? K.plum : "rgba(199,174,230,0.35)"} />
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
