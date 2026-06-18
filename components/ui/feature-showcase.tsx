"use client";

import { useState, useEffect, useRef } from "react";

const NAVY   = "#1B2240";
const ORANGE = "#F04E23";
const LIGHT  = "#F5F5F2";
const WHITE  = "#FFFFFF";

const CSS = `
@keyframes panelIn {
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}
@keyframes copyIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes badgePop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.45); }
  68%  { transform: scale(0.88); }
  88%  { transform: scale(1.08); }
  100% { transform: scale(1); }
}
@keyframes rowFlash {
  0%   { background: white; }
  25%  { background: #FFF0EC; box-shadow: 0 0 0 2px #F04E2344 inset; }
  100% { background: #FFF7F5; }
}
@keyframes urgentRing {
  0%,100% { box-shadow: 0 0 0 0px rgba(192,57,43,0.30); }
  50%     { box-shadow: 0 0 0 6px rgba(192,57,43,0.0);  }
}
@keyframes tickFlip {
  0%   { opacity: 0.3; transform: translateY(-4px); }
  100% { opacity: 1;   transform: translateY(0);    }
}
@keyframes flagPop {
  0%   { transform: scale(1);    }
  35%  { transform: scale(1.025); }
  100% { transform: scale(1);    }
}
@keyframes metricIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

const tabs = [
  {
    id: "shipping",
    label: "Shipping & Warehouse",
    headline: "Print the cheapest label in seconds",
    desc: "No carrier tabs, no rate spreadsheet — just the next box.",
    points: [
      { title: "Every carrier, one screen", body: "Compare courier, LTL and Canada Post side by side, then print the cheapest qualified label without leaving ShipTime.", icon: <LayoutIcon /> },
      { title: "Your rates, ready to go", body: "Bring your own negotiated rates and they shop automatically against ours on every shipment.", icon: <TagIcon /> },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    headline: "Run the whole carrier mix from one place",
    desc: "See where every dollar goes before the package moves.",
    points: [
      { title: "Right carrier, every time", body: "UPS, FedEx, Purolator, Canada Post and LTL freight, priced live so the cheapest qualified option is never a guess.", icon: <ShuffleIcon /> },
      { title: "Pickups on schedule", body: "Book pickups across carriers in a few clicks and stop building the day around courier cutoffs.", icon: <ClockIcon /> },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    headline: "Stop paying for billing mistakes you never see",
    desc: "Every carrier invoice, audited line by line — automatically.",
    points: [
      { title: "Every invoice, scanned", body: "ShipTime checks each carrier charge against what you were quoted and flags the gaps the moment they appear.", icon: <FileIcon /> },
      { title: "Money back, automatically", body: "Overcharges are surfaced and recovered, and freight lands on one invoice instead of a pile of them.", icon: <RefreshIcon /> },
    ],
  },
  {
    id: "owners",
    label: "Owners",
    headline: "See your real shipping numbers",
    desc: "The full picture — not the carrier's version.",
    points: [
      { title: "Decisions on facts, not fiction", body: "Recovered overcharges, true landed cost per shipment, and carrier performance, all in one view.", icon: <ChartIcon /> },
      { title: "Backed by real humans", body: "Real human support when it matters, so the savings show up without a new headcount.", icon: <HeadsetIcon /> },
    ],
  },
];

const VISUALS = [RateSliderVisual, CountdownVisual, InvoiceScanVisual, SavingsCounterVisual];

export default function DashboardSection() {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  const Visual = VISUALS[active];

  return (
    <section className="w-full py-20 px-6" style={{ background: WHITE }}>
      <style>{CSS}</style>
      <div className="max-w-6xl mx-auto">

        <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: ORANGE }}>
          One Dashboard
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-10 max-w-2xl mx-auto leading-tight text-center" style={{ color: NAVY }}>
          One dashboard the whole team actually trusts
        </h2>

        {/* Tab nav */}
        <div className="flex justify-center border-b" style={{ borderColor: "#E2E2DE" }}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              className="relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap"
              style={{ color: i === active ? NAVY : "#999", background: "none", border: "none", cursor: "pointer" }}
            >
              {t.label}
              {i === active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: ORANGE }} />
              )}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="rounded-2xl overflow-hidden" style={{ background: LIGHT, border: "1px solid #E2E2DE" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[460px]">

            {/* Left: copy — re-animates on tab change */}
            <div
              key={`copy-${active}`}
              className="flex flex-col justify-center p-10 md:p-12"
              style={{ animation: "copyIn 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <h3 className="text-3xl font-bold mb-3 leading-snug" style={{ color: NAVY }}>
                {tab.headline}
              </h3>
              <p className="text-base mb-8" style={{ color: "#5A5A5A" }}>
                {tab.desc}
              </p>
              <div className="flex flex-col gap-6">
                {tab.points.map((pt, pi) => (
                  <div
                    key={pt.title}
                    className="flex gap-4 items-start"
                    style={{ animation: `copyIn 0.4s cubic-bezier(0.22,1,0.36,1) ${80 + pi * 60}ms both` }}
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#E8E8E3" }}>
                      {pt.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>{pt.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "#6B6B6B" }}>{pt.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual — remounts on tab change so all animations restart */}
            <div
              key={`visual-${active}`}
              className="relative flex items-center justify-center p-8 rounded-2xl m-3"
              style={{
                background: WHITE,
                minHeight: 380,
                animation: "panelIn 0.45s cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              <Visual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Visual 1: Live Rate Slider ───────────────────────────────────────────────
function RateSliderVisual() {
  const [weight, setWeight] = useState(12);
  const [bestPop, setBestPop] = useState(false);
  const [flashRow, setFlashRow] = useState<string | null>(null);
  const prevBestRef = useRef<string | null>(null);

  const baseRates = [
    { carrier: "UPS Ground",       baseRate: 6.80, perLb: 0.14, transit: "2 days" },
    { carrier: "Canada Post Exp.", baseRate: 7.20, perLb: 0.16, transit: "2 days" },
    { carrier: "Purolator Gnd",    baseRate: 8.10, perLb: 0.18, transit: "3 days" },
    { carrier: "FedEx Ground",     baseRate: 8.90, perLb: 0.19, transit: "3 days" },
    { carrier: "GLS Standard",     baseRate: 7.60, perLb: 0.17, transit: "4 days" },
  ];

  const rates = baseRates
    .map((r) => ({ ...r, price: r.baseRate + r.perLb * weight }))
    .sort((a, b) => a.price - b.price);

  const currentBest = rates[0].carrier;

  useEffect(() => {
    if (prevBestRef.current !== null && prevBestRef.current !== currentBest) {
      setBestPop(true);
      setFlashRow(currentBest);
      const t1 = setTimeout(() => setBestPop(false), 700);
      const t2 = setTimeout(() => setFlashRow(null), 700);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prevBestRef.current = currentBest;
  }, [currentBest]);

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <div className="rounded-xl px-5 py-4" style={{ background: NAVY }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium" style={{ color: "#A0A8C0" }}>Package weight</span>
          <span className="text-lg font-bold" style={{ color: WHITE }}>{weight} lbs</span>
        </div>
        <input
          type="range" min={1} max={70} step={1} value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full" style={{ accentColor: ORANGE }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "#5A6278" }}>1 lb</span>
          <span className="text-xs" style={{ color: "#5A6278" }}>70 lbs</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#E2E2DE" }}>
        {rates.map((r, i) => (
          <div
            key={r.carrier}
            className="flex items-center justify-between px-4 py-3"
            style={{
              background: i === 0 ? "#FFF7F5" : WHITE,
              borderBottom: i < rates.length - 1 ? "0.5px solid #F0F0EC" : "none",
              animation: flashRow === r.carrier ? "rowFlash 0.65s ease forwards" : undefined,
              transition: "background 0.3s",
            }}
          >
            <div className="flex items-center gap-2">
              {i === 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-semibold inline-block"
                  style={{
                    background: ORANGE,
                    color: WHITE,
                    animation: bestPop ? "badgePop 0.55s cubic-bezier(0.22,1,0.36,1) forwards" : undefined,
                  }}
                >
                  Best
                </span>
              )}
              <span className="text-sm" style={{ color: NAVY, fontWeight: i === 0 ? 600 : 400 }}>
                {r.carrier}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: "#AAA" }}>{r.transit}</span>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{
                  color: i === 0 ? ORANGE : NAVY,
                  transition: "color 0.25s",
                }}
              >
                ${r.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Visual 2: Countdown Clocks ───────────────────────────────────────────────
function CountdownVisual() {
  const cutoffs = [
    { carrier: "UPS",         hour: 16, minute: 0  },
    { carrier: "FedEx",       hour: 15, minute: 30 },
    { carrier: "Purolator",   hour: 17, minute: 0  },
    { carrier: "Canada Post", hour: 14, minute: 0  },
  ];

  const [now, setNow] = useState(new Date());
  const [tickKey, setTickKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
      setTickKey((k) => k + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  function secondsUntil(hour: number, minute: number) {
    const target = new Date(now);
    target.setHours(hour, minute, 0, 0);
    let diff = Math.floor((target.getTime() - now.getTime()) / 1000);
    if (diff < 0) diff += 86400;
    return diff;
  }

  function fmt(secs: number) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return {
      h: String(h).padStart(2, "0"),
      m: String(m).padStart(2, "0"),
      s: String(s).padStart(2, "0"),
    };
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <div className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "#999" }}>
        Today&apos;s pickup cutoffs
      </div>
      {cutoffs.map(({ carrier, hour, minute }) => {
        const secs = secondsUntil(hour, minute);
        const urgent = secs < 3600;
        const almost = secs < 7200;
        const color = urgent ? "#C0392B" : almost ? "#B35900" : "#1A7A4A";
        const bg    = urgent ? "#FFEAEA" : almost ? "#FFF4E5" : "#EBF7F0";
        const { h, m, s } = fmt(secs);

        return (
          <div
            key={carrier}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: bg,
              border: `1px solid ${color}22`,
              animation: urgent ? "urgentRing 1.6s ease-in-out infinite" : undefined,
            }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: NAVY }}>{carrier}</p>
              <p className="text-xs mt-0.5" style={{ color: "#888" }}>
                Cutoff {String(hour % 12 || 12).padStart(2, "0")}:{String(minute).padStart(2, "0")} {hour >= 12 ? "PM" : "AM"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold tabular-nums tracking-tight" style={{ color }}>
                {h}:{m}:
                <span
                  key={`${carrier}-${tickKey}`}
                  style={{ display: "inline-block", animation: "tickFlip 0.18s ease-out both" }}
                >
                  {s}
                </span>
              </p>
              <p className="text-xs font-medium" style={{ color }}>
                {urgent ? "Book now" : almost ? "Running low" : "On track"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Visual 3: Invoice Scan Animation ────────────────────────────────────────
function InvoiceScanVisual() {
  const [scanY, setScanY] = useState(-10);
  const [flagged, setFlagged] = useState<number[]>([]);
  const [justFlagged, setJustFlagged] = useState<number[]>([]);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const prevFlaggedRef = useRef<number[]>([]);
  const DURATION = 2800;
  const CARD_HEIGHT = 288;

  const rows = [
    { label: "UPS Ground – Jun 3",    quoted: "$8.42",  charged: "$11.60", flag: true  },
    { label: "FedEx Exp – Jun 3",     quoted: "$14.10", charged: "$14.10", flag: false },
    { label: "Purolator – Jun 4",     quoted: "$10.55", charged: "$13.00", flag: true  },
    { label: "Canada Post – Jun 4",   quoted: "$9.10",  charged: "$9.10",  flag: false },
    { label: "UPS Express – Jun 5",   quoted: "$18.00", charged: "$18.00", flag: false },
    { label: "Purolator Exp – Jun 5", quoted: "$22.40", charged: "$27.80", flag: true  },
  ];

  useEffect(() => {
    function animate(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % (DURATION + 1400);
      const progress = Math.min(elapsed / DURATION, 1);
      const y = progress * (CARD_HEIGHT + 20) - 10;
      setScanY(y);

      const rowH = (CARD_HEIGHT - 40) / rows.length;
      const newFlagged = rows
        .map((r, i) => ({ ...r, i }))
        .filter((r) => r.flag && y > (r.i + 0.75) * rowH + 40)
        .map((r) => r.i);

      const fresh = newFlagged.filter((i) => !prevFlaggedRef.current.includes(i));
      if (fresh.length > 0) {
        setJustFlagged(fresh);
        prevFlaggedRef.current = newFlagged;
        setTimeout(() => setJustFlagged([]), 500);
      }
      setFlagged(newFlagged);

      if (elapsed > DURATION + 800) {
        startRef.current = null;
        prevFlaggedRef.current = [];
      }
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const rowH = (CARD_HEIGHT - 40) / rows.length;

  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <div className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: "#999" }}>
        Invoice audit — live scan
      </div>

      <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: "#E2E2DE", height: CARD_HEIGHT }}>
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between" style={{ background: NAVY, height: 40 }}>
          <span className="text-xs font-semibold text-white">Carrier invoice — June 2025</span>
          <span
            className="text-xs tabular-nums"
            style={{ color: flagged.length > 0 ? "#FF8A75" : "#A0A8C0", transition: "color 0.3s" }}
          >
            {flagged.length > 0 ? `${flagged.length} issue${flagged.length > 1 ? "s" : ""} found` : "Scanning…"}
          </span>
        </div>

        {/* Rows */}
        <div style={{ background: WHITE }}>
          {rows.map((r, i) => {
            const isFlagged = flagged.includes(i);
            const isJust = justFlagged.includes(i);
            return (
              <div
                key={r.label}
                className="flex items-center justify-between px-4"
                style={{
                  height: rowH,
                  background: isFlagged ? "#FFF0EE" : WHITE,
                  borderBottom: "0.5px solid #F0F0EC",
                  transition: "background 0.35s",
                  animation: isJust ? "flagPop 0.45s cubic-bezier(0.22,1,0.36,1) both" : undefined,
                }}
              >
                <span className="text-xs truncate max-w-[140px]" style={{ color: NAVY, fontWeight: isFlagged ? 600 : 400 }}>
                  {r.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "#BBB" }}>{r.quoted}</span>
                  <span className="text-xs font-semibold" style={{ color: isFlagged ? "#C0392B" : "#1A7A4A", transition: "color 0.3s" }}>
                    {r.charged}
                  </span>
                  {isFlagged && (
                    <span
                      className="text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                      style={{ background: "#C0392B", color: WHITE, fontSize: 9 }}
                    >
                      !
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scan line + wide glow */}
        {scanY <= CARD_HEIGHT && (
          <>
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: scanY + 40,
                height: 2,
                background: `linear-gradient(90deg, transparent 0%, ${ORANGE} 15%, ${ORANGE} 85%, transparent 100%)`,
                boxShadow: `0 0 14px 3px ${ORANGE}66`,
                opacity: 0.9,
              }}
            />
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: scanY + 30,
                height: 24,
                background: `linear-gradient(180deg, transparent 0%, ${ORANGE}18 50%, transparent 100%)`,
              }}
            />
          </>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: NAVY }}>
        <span className="text-xs font-medium" style={{ color: "#A0A8C0" }}>Recovered this month</span>
        <span className="text-lg font-bold" style={{ color: ORANGE }}>$847.20</span>
      </div>
    </div>
  );
}

// ─── Visual 4: Savings Counter ────────────────────────────────────────────────
function SavingsCounterVisual() {
  const TARGET = 2847;
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      const DURATION = 1800;
      const start = performance.now();
      function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
      function tick(now: number) {
        const t = Math.min((now - start) / DURATION, 1);
        setValue(Math.round(easeOut(t) * TARGET));
        if (t < 1) frameRef.current = requestAnimationFrame(tick);
      }
      frameRef.current = requestAnimationFrame(tick);
    }, 200);
    return () => {
      clearTimeout(delay);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const metrics = [
    { label: "Avg. landed cost",  value: "$11.42", delta: "↓ 8%",   good: true  },
    { label: "On-time delivery",  value: "97.3%",  delta: "↑ 2%",   good: true  },
    { label: "Carriers active",   value: "5",      delta: "",        good: null  },
    { label: "Invoices audited",  value: "312",    delta: "this mo", good: null  },
  ];

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <div className="rounded-xl px-6 py-6 text-center" style={{ background: NAVY }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#A0A8C0" }}>
          Saved this month
        </p>
        <p className="text-5xl font-bold tabular-nums leading-none" style={{ color: ORANGE, fontVariantNumeric: "tabular-nums" }}>
          ${value.toLocaleString()}
        </p>
        <p className="text-xs mt-2" style={{ color: "#5A6278" }}>
          recovered overcharges + rate optimisation
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="rounded-xl px-4 py-3"
            style={{
              background: LIGHT,
              border: "0.5px solid #E2E2DE",
              animation: `metricIn 0.4s cubic-bezier(0.22,1,0.36,1) ${300 + i * 80}ms both`,
            }}
          >
            <p className="text-xs mb-1" style={{ color: "#999" }}>{m.label}</p>
            <p className="text-lg font-bold" style={{ color: NAVY }}>{m.value}</p>
            {m.delta && (
              <p className="text-xs font-medium mt-0.5" style={{ color: m.good ? "#1A7A4A" : m.good === false ? "#C0392B" : "#888" }}>
                {m.delta}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function LayoutIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>;
}
function TagIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
}
function ShuffleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>;
}
function ClockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function FileIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
}
function RefreshIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>;
}
function ChartIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function HeadsetIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>;
}
