"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Check } from "lucide-react";

// Compact lucide-style icon paths (24×24) used across the page.
export const RI = {
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  truck: "M1 3h15v13H1z M16 8h4l3 3v5h-7 M5.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M18.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  package: "M12 2 3 7v10l9 5 9-5V7l-9-5z M3 7l9 5 9-5 M12 12v10",
  cycle: "M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.57L21 8 M21 3v5h-5",
  dollar: "M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3z M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5 M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3",
  mapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  alert: "M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3.6 9h16.8 M3.6 15h16.8 M12 3a15 15 0 0 1 0 18 M12 3a15 15 0 0 0 0 18",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  building: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4",
};

export function Glyph({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

// ── Dashboard mock data (stylized, illustrative) ─────────────────────────────

// Priority queue — each row is a shipment to work, not a static list entry: why
// it surfaced (reason) + the next best action, ranked by delivery risk + spend.
const TASK_ROWS = [
  { initials: "TR", name: "TRK-4821 · Toronto", program: "Parcel · UPS", reason: "No scan in 3 days", level: "red", act: "Call carrier" },
  { initials: "DV", name: "TRK-5107 · Denver", program: "LTL · Freight", reason: "Delivery exception — reweigh", level: "red", act: "Escalate" },
  { initials: "MI", name: "TRK-3390 · Miami", program: "Cross-border · FedEx", reason: "Held at customs day 7", level: "red", act: "Review" },
  { initials: "SE", name: "TRK-6644 · Seattle", program: "Parcel · Purolator", reason: "Address correction fee applied", level: "amber", act: "Review" },
  { initials: "BO", name: "TRK-2218 · Boston", program: "Parcel · Canada Post", reason: "Dimensional weight mismatch", level: "amber", act: "Review" },
  { initials: "AU", name: "TRK-7712 · Austin", program: "LTL · Freight", reason: "2 days from SLA breach", level: "amber", act: "Nudge" },
  { initials: "CA", name: "TRK-1980 · Calgary", program: "Parcel · UPS", reason: "Overcharge confirmed — refund due", level: "green", act: "Ready to recover" },
  { initials: "PH", name: "TRK-8455 · Phoenix", program: "Parcel · FedEx", reason: "Delivered · POD captured", level: "green", act: "Done" },
];

// Rate audit — the savings + recovery view. Each shipment audits against its own
// carrier's guarantees and rate card, so a row shows the invoice reference and
// the requirement that gates a credit. "req" is the human-readable rule; "met"
// is what ShipTime Plus has verified against it this cycle.
//   UPS  — on-time guarantee · dim-weight rule · surcharge audit
//   FEDEX — service guarantee · residential surcharge · fuel audit
//   CANPOST — delivery standard · dim rule · manifest match
//   PUROLATOR — service guarantee · surcharge audit
//   LTL  — freight class match · reweigh dispute · accessorial audit
//   BROKER — cross-border duty + brokerage reconciliation
type AuditLane = "UPS" | "FEDEX" | "CANPOST" | "PUROLATOR" | "LTL" | "BROKER";
const BILLING_ROWS: {
  initials: string; name: string; program: AuditLane;
  codes: string; req: string; met: string; pct: number; status: string;
}[] = [
  { initials: "CA", name: "TRK-1980 · Calgary",  program: "UPS",       codes: "GSR · Dim",       req: "On-time guarantee met",     met: "Late 41 min · refund",  pct: 100, status: "billable" },
  { initials: "PH", name: "TRK-8455 · Phoenix",  program: "FEDEX",     codes: "Fuel · Res",      req: "Fuel + residential audit",  met: "$4.20 surcharge void",  pct: 100, status: "billable" },
  { initials: "OT", name: "TRK-9021 · Ottawa",   program: "CANPOST",   codes: "Std · Manifest",  req: "Manifest vs invoice match", met: "Matched · $6.10 back",  pct: 100, status: "billable" },
  { initials: "VA", name: "TRK-6210 · Vancouver",program: "PUROLATOR", codes: "GSR",             req: "Service guarantee met",     met: "On-time refund",        pct: 100, status: "billable" },
  { initials: "AU", name: "TRK-7712 · Austin",   program: "LTL",       codes: "Class · Reweigh", req: "Freight class verified",    met: "Reweigh disputed",      pct: 82,  status: "atrisk" },
  { initials: "BO", name: "TRK-2218 · Boston",   program: "UPS",       codes: "Dim · Surcharge", req: "Dim-weight rule checked",   met: "Under review",          pct: 68,  status: "needtime" },
  { initials: "MI", name: "TRK-3390 · Miami",    program: "BROKER",    codes: "Duty · Broker",   req: "Duty + brokerage recon",    met: "Reconciled",            pct: 100, status: "billable" },
  { initials: "DV", name: "TRK-5107 · Denver",   program: "LTL",       codes: "Class · Accessor",req: "Accessorial audit",         met: "9 of 20 lines · $12",   pct: 45,  status: "atrisk" },
];

const ANALYTICS_KPIS = [
  { label: "On-time delivery", value: "94%", sub: "vs 81% pre-ShipTime", trend: "up" },
  { label: "Avg cost per parcel", value: "$8.40", sub: "down $2.10 QoQ", trend: "down" },
  { label: "Recovered this month", value: "$142K", sub: "218 shipments credited", trend: "up" },
  { label: "Exception rate", value: "3%", sub: "of shipments need a human", trend: "flat" },
];
// monthly on-time delivery % trend (12 pts) — climbs as routing tightens
const ANALYTICS_TREND = [38, 44, 49, 55, 58, 63, 68, 71, 74, 78, 81, 85];
const ANALYTICS_MIX = [
  { label: "UPS", pct: 31, color: "#EC5A26" },
  { label: "FedEx", pct: 27, color: "#2E4C8F" },
  { label: "Canada Post", pct: 21, color: "#1C1E3D" },
  { label: "Purolator", pct: 13, color: "#f0a48a" },
  { label: "LTL freight", pct: 8, color: "#9fd9d5" },
];

const DASH_TABS = ["Shipment queue", "Rate audit", "Analytics"] as const;

// ── Dashboard panes ──────────────────────────────────────────────────────────

function LevelDot({ level }: { level: string }) {
  const c = level === "red" ? "bg-red-400" : level === "amber" ? "bg-amber-400" : "bg-emerald-400";
  return <span className={`w-2 h-2 rounded-full ${c} shrink-0`} aria-hidden="true" />;
}

// ACT-color helpers for the shipment actions.
function actClasses(level: string, primary: boolean) {
  if (level === "green") return "bg-[color:var(--st-teal-tint)] text-[color:var(--st-teal)] border border-[color:var(--st-teal)]/20";
  if (level === "amber") return "bg-amber-50 text-amber-600 border border-amber-100";
  return primary
    ? "bg-[#EC5A26] text-white border border-[#EC5A26]" // red → the one you act on
    : "bg-red-50 text-red-500 border border-red-100";
}

// SHIPMENT QUEUE — the priority worklist: reason it surfaced + a next-best action
// button, ranked by delivery risk + spend at stake. You work the queue top-down.
function TaskQueuePane({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const rows = compact ? TASK_ROWS.slice(0, 4) : TASK_ROWS;
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[1px] text-slate-500 border-b border-slate-100 bg-[#fbfcfe]">
        <span>Priority queue · 38 of 412 need action</span>
        {!compact && <span className="hidden sm:block">Ranked by risk + spend</span>}
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: reduce ? 0 : 0.15 + i * 0.08 }}
          className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-[#fafbfe] transition-colors"
        >
          <span className="text-[11px] font-semibold text-slate-300 w-4 shrink-0 tabular-nums">{i + 1}</span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#fdece4] text-[#EC5A26] text-[11px] font-bold shrink-0">
            {r.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <LevelDot level={r.level} />
              <span className="text-[13px] font-semibold text-slate-900 truncate">{r.name}</span>
              <span className="text-[11px] text-slate-500 truncate hidden md:block">{r.program}</span>
            </div>
            <p className="text-[12px] text-slate-600 m-0 mt-0.5 truncate">{r.reason}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg shrink-0 ${actClasses(r.level, true)}`}>
            {r.act === "Call carrier" && <Glyph d={RI.phone} className="w-3 h-3" />}
            {r.act}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Mini progress bar toward a threshold (audit lines cleared / dispute progress).
function Meter({ value, max, tone }: { value: number; max: number; tone: string }) {
  const reduce = useReducedMotion();
  const pct = Math.min(100, (value / max) * 100);
  const color = tone === "billable" ? "#1A7A4A" : tone === "atrisk" ? "#f59e0b" : "#EC5A26";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden min-w-[52px]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: reduce ? `${pct}%` : 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
      <span className="text-[11px] font-semibold text-slate-600 tabular-nums w-11 text-right shrink-0">{value}/{max}</span>
    </div>
  );
}


// RATE AUDIT — savings + recovery readiness. Per shipment: progress toward that
// carrier's rule (on-time guarantee for UPS·FedEx·Purolator, freight-class +
// reweigh for LTL, duty/brokerage reconciliation for cross-border), with a live
// status you can act on.
const BILL_STATUS = {
  billable: { chip: "bg-[color:var(--st-teal-tint)] text-[color:var(--st-teal)]", label: "Recoverable" },
  atrisk: { chip: "bg-amber-50 text-amber-600", label: "Disputing" },
  needtime: { chip: "bg-[#fdece4] text-[#EC5A26]", label: "Auditing" },
} as const;

// Per-lane accent for the audit chip — keeps the six carriers visually distinct.
const PROGRAM_CHIP: Record<AuditLane, string> = {
  UPS:       "bg-[#fdece4] text-[#EC5A26]",
  FEDEX:     "bg-[color:var(--st-teal-tint)] text-[color:var(--st-teal)]",
  CANPOST:   "bg-[#eaf3fb] text-[#3b82c4]",
  PUROLATOR: "bg-[#eafaf1] text-emerald-600",
  LTL:       "bg-slate-100 text-slate-600",
  BROKER:    "bg-[#fdf3ea] text-amber-600",
};

function BillingPane() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col h-full">
      {/* cycle-readiness summary strip */}
      <div className="grid grid-cols-3 border-b border-slate-100 bg-[#fbfcfe]">
        {[
          { v: "218", l: "Ready to recover", c: "text-[color:var(--st-teal)]" },
          { v: "34", l: "Under dispute", c: "text-amber-600" },
          { v: "$142K", l: "Across UPS · FedEx · LTL · Broker", c: "text-[#1C1E3D]" },
        ].map((s, i) => (
          <div key={s.l} className={`px-4 py-3.5 ${i > 0 ? "border-l border-slate-100" : ""}`}>
            <div className={`font-serif text-[24px] leading-none ${s.c}`}>{s.v}</div>
            <div className="text-[11px] text-slate-500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>
      {/* column header */}
      <div className="hidden md:grid grid-cols-[1.5fr_1.1fr_1.4fr_0.9fr] gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-[1px] text-slate-300 border-b border-slate-100">
        <span>Shipment</span>
        <span>Carrier · checks</span>
        <span>Audit result</span>
        <span className="text-right">Status</span>
      </div>
      <div className="flex-1">
        {BILLING_ROWS.map((b) => {
          const st = BILL_STATUS[b.status as keyof typeof BILL_STATUS];
          const tone = b.status === "billable" ? "#1A7A4A" : b.status === "needtime" ? "#EC5A26" : "#f59e0b";
          return (
            <div key={b.name} className="grid grid-cols-[1fr_auto] md:grid-cols-[1.5fr_1.1fr_1.4fr_0.9fr] gap-3 items-center px-4 py-3 border-b border-slate-100 hover:bg-[#fafbfe] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fdece4] text-[#EC5A26] text-[10px] font-bold shrink-0">{b.initials}</span>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-slate-900 truncate">{b.name}</div>
                  <div className="text-[11px] text-slate-500 md:hidden">{b.program} · {b.codes}</div>
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-1">
                <span className={`inline-flex w-fit items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${PROGRAM_CHIP[b.program]}`}>{b.program}</span>
                <span className="text-[11px] text-slate-500 tabular-nums">{b.codes}</span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-slate-600">{b.req}</span>
                  <span className="text-[11px] font-semibold text-slate-600 tabular-nums">{b.met}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: tone }}
                    initial={{ width: reduce ? `${b.pct}%` : 0 }}
                    whileInView={{ width: `${b.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${st.chip}`}>
                  {b.status === "billable" && <Check className="w-3 h-3" strokeWidth={3} />}
                  {st.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between px-4 py-3 mt-auto border-t border-slate-100 bg-[#fbfcfe]">
        <span className="text-[12px] text-slate-600">One click files the cycle's claims — UPS, FedEx, LTL &amp; brokerage credits, proof attached.</span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white bg-[#EC5A26] rounded-lg px-3 py-1.5 shrink-0">Recover overcharges</span>
      </div>
    </div>
  );
}

// ANALYTICS — network health at a glance: KPI tiles, on-time trend, carrier mix.
function AnalyticsPane() {
  const reduce = useReducedMotion();
  const W = 320, H = 90;
  const pts = ANALYTICS_TREND.map((v, i) => {
    const x = (i / (ANALYTICS_TREND.length - 1)) * W;
    const y = H - ((v - 30) / 60) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const areaPts = `0,${H} ${pts} ${W},${H}`;
  return (
    <div className="flex flex-col h-full p-4 md:p-5">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 shrink-0">
        {ANALYTICS_KPIS.map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-100 bg-white p-3.5">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.5px] text-slate-500">{k.label}</div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-serif text-[28px] leading-none text-[#1C1E3D]">{k.value}</span>
              {k.trend === "up" && <span className="text-[11px] font-semibold text-[color:var(--st-teal)]">▲</span>}
              {k.trend === "down" && <span className="text-[11px] font-semibold text-[color:var(--st-teal)]">▼</span>}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 leading-snug">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 flex-1 min-h-0">
        {/* On-time delivery trend */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="text-[12px] font-semibold text-slate-700">On-time delivery trend</span>
            <span className="text-[11px] text-slate-500">12 months</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full flex-1 min-h-0" aria-label="On-time delivery climbing to 94% over 12 months">
            <defs>
              <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EC5A26" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#EC5A26" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.polygon
              points={areaPts}
              fill="url(#analyticsFill)"
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <motion.polyline
              points={pts}
              fill="none"
              stroke="#EC5A26"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 shrink-0"><span>81%</span><span className="text-[#EC5A26] font-semibold">94% now</span></div>
        </div>
        {/* Carrier mix */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700 shrink-0">Carrier mix</span>
          <div className="mt-3.5 flex-1 flex flex-col justify-between gap-2.5">
            {ANALYTICS_MIX.map((m) => (
              <div key={m.label} className="flex items-center gap-2.5">
                <span className="text-[11px] font-medium text-slate-600 w-12 shrink-0">{m.label}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: m.color }}
                    initial={{ width: reduce ? `${m.pct}%` : 0 }}
                    whileInView={{ width: `${m.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-600 w-8 text-right tabular-nums shrink-0">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// A light "seen on a computer" SaaS window: browser chrome (traffic lights +
// address bar) and an app sidebar. When onNav is provided the sidebar items are
// the live navigation for the tour; without it the window is a static peek.
const DASH_NAV = [
  { label: "Shipment queue", icon: RI.alert, path: "queue" },
  { label: "Rate audit", icon: RI.dollar, path: "audit" },
  { label: "Analytics", icon: RI.activity, path: "analytics" },
];

// KPI mini-stats shown in the sidebar rail — makes it read like a real product.
const DASH_KPIS = [
  { label: "On-time", value: "94%", trend: "up" },
  { label: "Flagged today", value: "38", trend: "flat" },
  { label: "Recovered this mo.", value: "$142K", trend: "up" },
];

// A full-application desktop screen (laptop 16:10 proportions): browser chrome +
// app top bar (search / bell / avatar) + rich left rail + the active view. Sized
// like a real dashboard rather than a small card.
function SaaSWindow({ active, onNav, children }: { active: number; onNav?: (i: number) => void; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-[0_50px_110px_rgba(28,30,61,0.22)] overflow-hidden text-left">
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#eef0f4] border-b border-slate-200">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <div className="flex-1 flex justify-center min-w-0 px-2">
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-3 py-1 text-[11px] text-slate-500 font-medium max-w-full truncate">
            <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            app.shiptimeplus.com/compass/{DASH_NAV[active].path}
          </span>
        </div>
        <span className="w-12 shrink-0" aria-hidden="true" />
      </div>

      {/* App body — readable fixed height on mobile; laptop aspect on sm+ so it
          reads as a full desktop screen without cramping on phones. */}
      <div className="flex items-stretch h-[440px] sm:h-auto sm:aspect-[16/10] sm:max-h-[640px]">
        {/* Left rail */}
        <div className="hidden sm:flex flex-col w-52 lg:w-56 shrink-0 bg-[#fbfcfe] border-r border-slate-100">
          <div className="flex items-center gap-2.5 px-4 h-14 border-b border-slate-100">
            {/* Compass app mark — three ascending bars in an orange tile */}
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#EC5A26] to-[#c9430f] shadow-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 15v3 M12 9v9 M18 5v13" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-slate-800">Compass</div>
              <div className="text-[10px] text-slate-500">by ShipTime Plus</div>
            </div>
          </div>
          <div className="px-3 py-4 flex flex-col flex-1">
            <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-300">Account team</p>
            {DASH_NAV.map((n, i) => (
              <button
                key={n.label}
                onClick={onNav ? () => onNav(i) : undefined}
                disabled={!onNav}
                aria-pressed={i === active}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors text-left mb-0.5 ${
                  i === active ? "bg-[#fdece4] text-[#EC5A26]" : `text-slate-600 ${onNav ? "hover:bg-slate-100 cursor-pointer" : "cursor-default"}`
                }`}
              >
                <Glyph d={n.icon} className="w-[18px] h-[18px]" />
                {n.label}
                {i === active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EC5A26]" />}
              </button>
            ))}
            {/* KPI mini-cards */}
            <div className="mt-6 space-y-2.5">
              {DASH_KPIS.map((k) => (
                <div key={k.label} className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.5px] text-slate-500">{k.label}</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-[18px] font-semibold text-[#1C1E3D] leading-none">{k.value}</span>
                    {k.trend === "up" && <span className="text-[11px] font-semibold text-[color:var(--st-teal)]">▲</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-100">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fdece4] text-[#EC5A26] text-[10px] font-bold">JM</span>
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-slate-700 truncate">Jordan M.</div>
                <div className="text-[10.5px] text-slate-500">Your ShipTime rep</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main column: app top bar + scrolling view */}
        <div className="flex-1 min-w-0 flex flex-col bg-white">
          <div className="flex items-center gap-3 px-5 h-14 border-b border-slate-100 shrink-0">
            <span className="text-[15px] font-semibold text-[#1C1E3D]">{DASH_NAV[active].label}</span>
            <div className="ml-auto hidden md:flex items-center gap-2 bg-[#f6f7fb] border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] text-slate-500 w-56">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              Track a shipment…
            </div>
            <span className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-500" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EC5A26]" />
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

// The interactive dashboard tour — the sidebar is the navigation; auto-advances.
function DashboardTour() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setTab((t) => (t + 1) % DASH_TABS.length), 4500);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  return (
    <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="max-w-[1100px] mx-auto">
        {/* Top tab bar — the switcher above the window. Auto-cycles through the
            three panels (pauses on hover); each pill carries a fill bar that
            drains over the dwell so the "pa pa pa" advance reads on screen. */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex gap-1 p-1.5 rounded-full bg-[#F0F0EC] border border-border shadow-sm">
            {DASH_TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                aria-pressed={tab === i}
                className={`relative overflow-hidden px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${
                  tab === i ? "bg-[#1C1E3D] text-white shadow-sm" : "text-slate-500 hover:text-[#1C1E3D]"
                }`}
              >
                {tab === i && !reduce && !paused && (
                  <motion.span
                    key={`fill-${tab}`}
                    aria-hidden
                    className="absolute inset-0 bg-[#EC5A26]/45"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 4.5, ease: "linear" }}
                    style={{ originX: 0 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <SaaSWindow active={tab}>
          <div className="h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                className="h-full"
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                transition={{ duration: 0.35 }}
              >
                {tab === 0 && <TaskQueuePane />}
                {tab === 1 && <BillingPane />}
                {tab === 2 && <AnalyticsPane />}
              </motion.div>
            </AnimatePresence>
          </div>
        </SaaSWindow>
        <p className="text-center text-[12px] text-white/70 mt-4">Illustrative interface. Your team reviews what matters — the rest is handled.</p>
      </div>
    </div>
  );
}

// Public entry point for the Compass dashboard visual.
export function CompassDashboard() {
  return <DashboardTour />;
}
