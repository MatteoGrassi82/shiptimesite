import type React from "react";
import { Reveal } from "@/components/ui/reveal";

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  orangeSoft: "#F0845B",
  lightBlue: "#E3EEFC",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
  green: "#3FA864",
};
const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

// ── Shared mock chrome ──────────────────────────────────────
// A framed window matching product-mocks.tsx aesthetic: rounded, 1px border,
// soft shadow, surface/white bg. Used by every block's visual.
function MockFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: ds.white,
        borderRadius: 20,
        border: `1px solid ${ds.border}`,
        boxShadow: "0 30px 80px -40px rgba(28,30,61,0.3)",
        aspectRatio: "5 / 4",
        maxHeight: 420,
      }}
    >
      {/* Faux window bar */}
      <div
        className="flex items-center gap-1.5 px-4"
        style={{ height: 34, background: ds.surface, borderBottom: `1px solid ${ds.border}` }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E8B4A6" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E8D9A6" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#A6D6B4" }} />
      </div>
      <div className="p-4 md:p-5" style={{ height: "calc(100% - 34px)" }}>
        {children}
      </div>
    </div>
  );
}

function StatusPill({ label, tone = "blue" }: { label: string; tone?: "blue" | "green" | "orange" }) {
  const map = {
    blue: { bg: ds.lightBlue, fg: ds.navy },
    green: { bg: "#E8F5E9", fg: ds.green },
    orange: { bg: "#FFF4EF", fg: ds.orange },
  } as const;
  const c = map[tone];
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
      style={{ background: c.bg, color: c.fg, ...sora }}
    >
      {label}
    </span>
  );
}

// ── 1. RATE SHOPPING ────────────────────────────────────────
function RateShoppingMock() {
  const rows: [string, string, boolean][] = [
    ["UPS Standard", "$11.85", true],
    ["FedEx Ground", "$13.10", false],
    ["Canada Post", "$14.20", false],
    ["Purolator", "$16.40", false],
  ];
  return (
    <MockFrame>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>Rate comparison</div>
          <div className="text-[11px]" style={{ color: ds.muted, ...inter }}>Toronto → Vancouver · 2.4 kg</div>
        </div>
        <StatusPill label="4 carriers" />
      </div>
      <div className="flex flex-col gap-2">
        {rows.map(([name, price, best]) => (
          <div
            key={name}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{
              background: best ? "#FFF4EF" : ds.surface,
              border: `1px solid ${best ? ds.orange : ds.border}`,
            }}
          >
            <span className="w-6 h-6 rounded-md flex-shrink-0" style={{ background: best ? ds.orange : ds.lightBlue }} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold truncate" style={{ color: ds.navy, ...sora }}>{name}</div>
              <div className="text-[10px]" style={{ color: ds.muted, ...inter }}>2–3 business days</div>
            </div>
            {best && <span className="hidden sm:inline-block"><StatusPill label="Cheapest" tone="orange" /></span>}
            <span className="text-[14px] font-extrabold" style={{ color: best ? ds.orange : ds.navy, ...sora }}>{price}</span>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

// ── 2. BRING YOUR OWN RATES ─────────────────────────────────
function OwnRatesMock() {
  return (
    <MockFrame>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>Your rate cards</div>
        <StatusPill label="Connected" tone="green" />
      </div>
      <div className="flex flex-col gap-2.5">
        {([
          ["UPS — Negotiated", "Your account", true],
          ["FedEx — Negotiated", "Your account", true],
          ["ShipTime member rates", "Built in", false],
        ] as [string, string, boolean][]).map(([title, sub, owned]) => (
          <div
            key={title}
            className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ background: ds.surface, border: `1px solid ${ds.border}` }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: owned ? ds.navy : ds.orange }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ds.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold truncate" style={{ color: ds.navy, ...sora }}>{title}</div>
              <div className="text-[10px]" style={{ color: ds.muted, ...inter }}>{sub}</div>
            </div>
            <StatusPill label="Active" tone="green" />
          </div>
        ))}
      </div>
      <div className="mt-3 px-3 py-2.5 rounded-xl" style={{ background: "#FFF4EF", border: `1px solid ${ds.orange}` }}>
        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ds.muted, ...sora }}>Shopped on every shipment</div>
        <div className="text-[12px] font-semibold" style={{ color: ds.navy, ...inter }}>You always pay the lowest qualified price.</div>
      </div>
    </MockFrame>
  );
}

// ── 3. PICKUP SCHEDULING ────────────────────────────────────
function PickupMock() {
  const days = ["M", "T", "W", "T", "F"];
  const slots = ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
  return (
    <MockFrame>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>Schedule a pickup</div>
        <StatusPill label="Today" />
      </div>
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {days.map((d, i) => (
          <div
            key={i}
            className="flex flex-col items-center py-2 rounded-lg"
            style={{
              background: i === 2 ? ds.orange : ds.surface,
              border: `1px solid ${i === 2 ? ds.orange : ds.border}`,
            }}
          >
            <span className="text-[10px] font-bold" style={{ color: i === 2 ? ds.white : ds.muted, ...sora }}>{d}</span>
            <span className="text-[13px] font-extrabold" style={{ color: i === 2 ? ds.white : ds.navy, ...sora }}>{8 + i}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {slots.map((s, i) => (
          <div
            key={s}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{
              background: i === 0 ? "#FFF4EF" : ds.surface,
              border: `1px solid ${i === 0 ? ds.orange : ds.border}`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: i === 0 ? ds.orange : ds.border }} />
            <span className="text-[11.5px] font-semibold" style={{ color: ds.navy, ...inter }}>{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: ds.navy }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ds.orangeSoft} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        <span className="text-[11.5px] font-semibold" style={{ color: ds.white, ...inter }}>Parcel & freight · one flow, no phone calls</span>
      </div>
    </MockFrame>
  );
}

// ── 4. AUTOMATIC RATE AUDIT ─────────────────────────────────
function AuditMock() {
  const lines: [string, string, "ok" | "flag"][] = [
    ["INV-4821 · UPS", "Matches quote", "ok"],
    ["INV-4822 · FedEx", "Overcharge $14.20", "flag"],
    ["INV-4823 · Puro", "Matches quote", "ok"],
    ["INV-4824 · UPS", "Overcharge $9.55", "flag"],
  ];
  return (
    <MockFrame>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>Invoice audit</div>
        <StatusPill label="Auto" tone="orange" />
      </div>
      <div className="flex flex-col gap-2">
        {lines.map(([inv, note, kind]) => (
          <div
            key={inv}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{
              background: kind === "flag" ? "#FFF4EF" : ds.surface,
              border: `1px solid ${kind === "flag" ? ds.orange : ds.border}`,
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: kind === "flag" ? ds.orange : "#E8F5E9" }}
            >
              {kind === "flag" ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ds.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4M12 16h.01" /></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ds.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              )}
            </div>
            <span className="text-[12px] font-bold flex-1 min-w-0 truncate" style={{ color: ds.navy, ...sora }}>{inv}</span>
            <span className="text-[10.5px] font-semibold" style={{ color: kind === "flag" ? ds.orange : ds.muted, ...inter }}>{note}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: ds.navy }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ds.lightBlue, ...sora }}>Recovered this cycle</span>
        <span className="text-[15px] font-extrabold" style={{ color: ds.orangeSoft, ...sora }}>$23.75</span>
      </div>
    </MockFrame>
  );
}

// ── 5. LIVE TRACKING ────────────────────────────────────────
function TrackingMock() {
  const steps: [string, boolean][] = [
    ["Label created", true],
    ["Picked up", true],
    ["In transit", true],
    ["Out for delivery", false],
    ["Delivered", false],
  ];
  return (
    <MockFrame>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>#ST-48201</div>
          <div className="text-[11px]" style={{ color: ds.muted, ...inter }}>UPS Standard · $11.85</div>
        </div>
        <StatusPill label="On time" tone="green" />
      </div>
      <div className="px-1">
        {steps.map(([label, done], i, a) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: done ? ds.orange : ds.border }}>
                {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              {i < a.length - 1 && <div className="w-0.5 h-5" style={{ background: done ? ds.orange : ds.border }} />}
            </div>
            <span className="text-[12px] font-medium py-1" style={{ color: done ? ds.navy : ds.muted, ...inter }}>{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
        <span className="w-2 h-2 rounded-full" style={{ background: ds.orange }} />
        <span className="text-[11px] font-semibold" style={{ color: ds.navy, ...inter }}>Rate synced beside every shipment</span>
      </div>
    </MockFrame>
  );
}

// ── 6. FREIGHT & LTL ────────────────────────────────────────
function FreightMock() {
  return (
    <MockFrame>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] font-bold" style={{ color: ds.navy, ...sora }}>One invoice</div>
        <StatusPill label="Parcel + Freight" />
      </div>
      <div className="flex flex-col gap-2 mb-3">
        {[
          ["Parcel · 18 shipments", "$842.10", "blue"],
          ["LTL Freight · 3 loads", "$1,206.00", "orange"],
        ].map(([title, amt, tone]) => (
          <div
            key={title}
            className="flex items-center gap-3 px-3 py-3 rounded-xl"
            style={{ background: ds.surface, border: `1px solid ${ds.border}` }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tone === "orange" ? ds.orange : ds.lightBlue }}>
              {tone === "orange" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ds.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ds.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12l8.73-5.04M12 22.08V12" /></svg>
              )}
            </div>
            <span className="text-[12px] font-bold flex-1 min-w-0 truncate" style={{ color: ds.navy, ...sora }}>{title}</span>
            <span className="text-[13px] font-extrabold" style={{ color: ds.navy, ...sora }}>{amt}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-3 py-3 rounded-xl" style={{ background: ds.navy }}>
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: ds.lightBlue, ...sora }}>Total due</span>
        <span className="text-[16px] font-extrabold" style={{ color: ds.white, ...sora }}>$2,048.10</span>
      </div>
    </MockFrame>
  );
}

// ── Feature data ────────────────────────────────────────────
type Block = {
  eyebrow: string;
  title: string;
  subhead: string;
  body: string;
  visual: React.ReactNode;
};

const BLOCKS: Block[] = [
  {
    eyebrow: "Rate shopping",
    title: "Compare Every Carrier On One Screen",
    subhead: "Stop tabbing between five carrier websites.",
    body: "Put UPS, FedEx, Purolator, Canada Post and LTL freight side by side on a single screen, then print the cheapest qualified label in seconds.",
    visual: <RateShoppingMock />,
  },
  {
    eyebrow: "Bring your own rates",
    title: "Your Negotiated Pricing, Built In",
    subhead: "Already cut a deal? Bring it.",
    body: "Plug in the rates you've negotiated and shop them against ours on every shipment, so you always pay the lowest qualified price.",
    visual: <OwnRatesMock />,
  },
  {
    eyebrow: "Pickup scheduling",
    title: "Pickups That Fit Your Day",
    subhead: "No more racing to the depot.",
    body: "Book carrier pickups right after you print, on your schedule. Parcel or freight, one flow, no phone calls.",
    visual: <PickupMock />,
  },
  {
    eyebrow: "Automatic rate audit",
    title: "Overcharges, Caught And Recovered",
    subhead: "Stop paying for billing mistakes you never see.",
    body: "ShipTime checks every carrier invoice line against what you were quoted, flags the gaps, and recovers the difference — automatically.",
    visual: <AuditMock />,
  },
  {
    eyebrow: "Live tracking",
    title: "One Dashboard For Every Shipment",
    subhead: "Where is everything? Right here.",
    body: "Follow every parcel and freight load on a single timeline, from label created to delivered, with rates synced beside each one.",
    visual: <TrackingMock />,
  },
  {
    eyebrow: "Freight & LTL",
    title: "Parcel And Freight, One Invoice",
    subhead: "No separate freight broker required.",
    body: "Quote, book and track LTL freight in the same place as your parcels, and settle it all on one clean invoice.",
    visual: <FreightMock />,
  },
];

export default function AlternatingFeatures({ background = ds.white }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Header */}
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>
            The shipping OS that grows with you
          </p>
          <h2 style={{ ...heading, fontSize: "clamp(1.9rem, 4.4vw, 2.9rem)" }}>
            Every ShipTime Account Includes
          </h2>
        </Reveal>

        {/* Feature rows — alternate text/visual sides by index parity */}
        <div className="flex flex-col gap-16 md:gap-24">
          {BLOCKS.map((b, i) => {
            const textFirst = i % 2 === 0;
            return (
              <Reveal key={b.title} delay={60}>
                <div className="grid items-center gap-8 md:gap-16 md:grid-cols-2">
                  {/* Text side */}
                  <div className={textFirst ? "md:order-1" : "md:order-2"}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2.5" style={{ color: ds.orange, ...sora }}>
                      {b.eyebrow}
                    </p>
                    <h3 className="mb-3" style={{ ...heading, fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}>
                      {b.title}
                    </h3>
                    <p
                      className="mb-3.5 italic"
                      style={{ ...inter, color: ds.muted, fontSize: 16, lineHeight: 1.5, fontStyle: "italic" }}
                    >
                      {b.subhead}
                    </p>
                    <p style={{ ...inter, color: ds.muted, fontSize: 15.5, lineHeight: 1.65, maxWidth: 460 }}>
                      {b.body}
                    </p>
                  </div>

                  {/* Visual side */}
                  <div className={textFirst ? "md:order-2" : "md:order-1"}>
                    {b.visual}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
