"use client";

import type React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  Cell,
} from "recharts";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  orangeSoft: "#F0845B",
  lightBlue: "#E3EEFC",
  green: "#3FA864",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
};

const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

// White card floating over a bold colored offset block (Wave-style technique).
function OffsetCard({
  offset,
  children,
  style,
  className = "",
}: {
  offset: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={style}>
      <div className="absolute inset-0" style={{ background: offset, borderRadius: 16, transform: "translate(12px, 14px)" }} />
      <div
        className="relative overflow-hidden"
        style={{ background: ds.white, borderRadius: 16, border: `1px solid ${ds.border}`, boxShadow: "0 8px 30px rgba(28,30,61,0.10)" }}
      >
        {children}
      </div>
    </div>
  );
}

// ── 1. RATE SHOPPING ────────────────────────────────────────
// A bar chart of carrier prices (cheapest in orange) + a highlighted winner row,
// with a second small "savings" card overlapping at the bottom.
const RATE_DATA = [
  { name: "UPS", price: 11.85, best: true },
  { name: "FedEx", price: 13.1, best: false },
  { name: "CPC", price: 14.2, best: false },
  { name: "Puro", price: 16.4, best: false },
];

export function RateShopMock() {
  return (
    <div className="relative w-full" style={{ paddingBottom: 56, paddingRight: 14 }}>
      <OffsetCard offset={ds.orange}>
        <div className="px-5 pt-4 pb-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${ds.border}` }}>
          <div>
            <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>Rate comparison</div>
            <div className="text-[11px]" style={{ color: ds.muted, ...inter }}>Toronto → Vancouver · 2.4 kg</div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ background: ds.lightBlue, color: ds.navy, ...sora }}>
            4 carriers
          </span>
        </div>
        <div style={{ height: 130, padding: "12px 10px 0" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RATE_DATA} margin={{ top: 8, right: 6, left: 6, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: ds.muted, fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false} />
              <Bar dataKey="price" radius={[6, 6, 0, 0]} maxBarSize={34}>
                {RATE_DATA.map((d, i) => (
                  <Cell key={i} fill={d.best ? ds.orange : ds.lightBlue} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="px-4 py-3" style={{ background: ds.surface, borderTop: `1px solid ${ds.border}` }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "#FFF4EF", border: `1px solid ${ds.orange}` }}>
            <div className="w-7 h-7 rounded-md" style={{ background: ds.orange }} />
            <div className="flex-1">
              <div className="text-[12px] font-bold" style={{ color: ds.navy, ...sora }}>UPS Standard</div>
              <div className="text-[10px]" style={{ color: ds.muted, ...inter }}>2-3 business days</div>
            </div>
            <div className="text-[15px] font-extrabold" style={{ color: ds.orange, ...sora }}>$11.85</div>
          </div>
        </div>
      </OffsetCard>

      {/* Overlapping savings card */}
      <div className="absolute" style={{ bottom: 0, right: 0, width: "52%" }}>
        <OffsetCard offset={ds.navy}>
          <div className="px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ds.muted, ...sora }}>You saved</div>
            <div className="text-[22px] font-extrabold leading-tight" style={{ color: ds.orange, ...sora }}>$4.55</div>
            <div className="text-[10px]" style={{ color: ds.muted, ...inter }}>vs. walk-in rate</div>
          </div>
        </OffsetCard>
      </div>
    </div>
  );
}

// ── 2. ONE PLATFORM ─────────────────────────────────────────
// A "dashboard": shipment volume area chart + a layered tracking-status card.
const VOLUME_DATA = [
  { d: "Mon", v: 42 }, { d: "Tue", v: 58 }, { d: "Wed", v: 51 },
  { d: "Thu", v: 73 }, { d: "Fri", v: 89 }, { d: "Sat", v: 64 }, { d: "Sun", v: 38 },
];

export function PlatformMock() {
  return (
    <div className="relative w-full" style={{ paddingBottom: 64, paddingRight: 14 }}>
      <OffsetCard offset={ds.navy}>
        <div className="px-5 pt-4 pb-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${ds.border}` }}>
          <div>
            <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>Shipments this week</div>
            <div className="text-[11px]" style={{ color: ds.muted, ...inter }}>Parcel · LTL · Canada Post</div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-extrabold leading-none" style={{ color: ds.navy, ...sora }}>415</div>
            <div className="text-[10px] font-semibold" style={{ color: ds.green, ...inter }}>↑ 12%</div>
          </div>
        </div>
        <div style={{ height: 120, padding: "10px 4px 0" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={VOLUME_DATA} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ds.orange} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={ds.orange} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: ds.muted, fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false} />
              <Area type="monotone" dataKey="v" stroke={ds.orange} strokeWidth={2.5} fill="url(#volFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </OffsetCard>

      {/* Overlapping tracking card */}
      <div className="absolute" style={{ bottom: 0, right: 0, width: "60%" }}>
        <OffsetCard offset={ds.orange}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold" style={{ color: ds.navy, ...sora }}>#ST-48201</div>
              <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: ds.lightBlue, color: ds.navy, ...sora }}>On time</span>
            </div>
            {[["Picked up", true], ["In transit", true], ["Out for delivery", false]].map(([label, done], i, a) => (
              <div key={label as string} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: done ? ds.orange : ds.border }}>
                    {done && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                  {i < a.length - 1 && <div className="w-0.5 h-4" style={{ background: done ? ds.orange : ds.border }} />}
                </div>
                <span className="text-[10.5px] font-medium" style={{ color: done ? ds.navy : ds.muted, ...inter }}>{label}</span>
              </div>
            ))}
          </div>
        </OffsetCard>
      </div>
    </div>
  );
}

// ── 3. BILLING & VISIBILITY ─────────────────────────────────
// A spend line chart + an invoice card, with a small "audit" win card on top.
const SPEND_DATA = [
  { m: "Apr", s: 3.1 }, { m: "May", s: 2.8 }, { m: "Jun", s: 2.4 },
  { m: "Jul", s: 2.2 }, { m: "Aug", s: 1.9 }, { m: "Sep", s: 1.55 },
];

export function BillingMock() {
  return (
    <div className="relative w-full" style={{ paddingBottom: 60, paddingRight: 14 }}>
      <OffsetCard offset={ds.navy}>
        <div className="px-5 pt-4 pb-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${ds.border}` }}>
          <div>
            <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>Carrier spend</div>
            <div className="text-[11px]" style={{ color: ds.muted, ...inter }}>One invoice, all carriers</div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-extrabold leading-none" style={{ color: ds.navy, ...sora }}>$1,551</div>
            <div className="text-[10px] font-semibold" style={{ color: ds.green, ...inter }}>↓ 24%</div>
          </div>
        </div>
        <div style={{ height: 104, padding: "12px 6px 4px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SPEND_DATA} margin={{ top: 6, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: ds.muted, fontFamily: "var(--font-inter)" }} axisLine={false} tickLine={false} />
              <Line type="monotone" dataKey="s" stroke={ds.orange} strokeWidth={2.5} dot={{ r: 3, fill: ds.orange, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="px-4 py-3 flex flex-col gap-1.5" style={{ background: ds.surface, borderTop: `1px solid ${ds.border}` }}>
          {[["UPS", "$842.10"], ["Canada Post", "$418.55"], ["FedEx", "$291.00"]].map(([c, v]) => (
            <div key={c} className="flex items-center justify-between text-[11.5px]" style={{ color: ds.navy, ...inter }}>
              <span>{c}</span><span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </OffsetCard>

      {/* Overlapping audit win card */}
      <div className="absolute" style={{ bottom: 0, right: 0, width: "56%" }}>
        <OffsetCard offset={ds.orange}>
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#E8F5E9" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ds.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div>
              <div className="text-[12px] font-bold" style={{ color: ds.navy, ...sora }}>Audit complete</div>
              <div className="text-[10px]" style={{ color: ds.muted, ...inter }}>
                <span className="font-bold" style={{ color: ds.orange }}>$214</span> recovered
              </div>
            </div>
          </div>
        </OffsetCard>
      </div>
    </div>
  );
}

export function FeatureMock({ image }: { image?: string }) {
  if (image === "feature-one-platform") return <PlatformMock />;
  if (image === "feature-billing-visibility") return <BillingMock />;
  return <RateShopMock />;
}
