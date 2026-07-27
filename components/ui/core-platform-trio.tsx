import type React from "react";
import { ArrowUpRight, Wifi, Plus } from "lucide-react";

// ── "Three ways in" trio, landing-page skin ───────────────────────────────────
// Core 2's platform trio (For me / For my business / Enterprise) restyled to
// match the /alternative and /vs landing pages: surface field, white cards with
// borders and soft shadows, Manrope headings. Same three product widgets.
// The third card is the Plus self-select lane.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  lightBlue: "#E3EEFC",
  blue:   "#2F80ED",
  green:  "#3FA864",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const inter: React.CSSProperties = { fontFamily: "var(--font-inter), system-ui, sans-serif" };
const mono: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" };
const heading: React.CSSProperties = { ...sans, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: ds.navy };

// ── Card 1 — tilted shipping label ────────────────────────────────────────────

function ShippingLabel() {
  const bars = [3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2];
  return (
    <div className="relative flex items-center justify-center w-full" style={{ height: 250 }}>
      <div
        className="rounded-3xl p-5 flex flex-col justify-between"
        style={{
          width: 268, height: 178,
          transform: "rotate(-6deg)",
          background: "linear-gradient(135deg, #F0845B 0%, #EC5A26 60%, #D64E1F 100%)",
          boxShadow: "0 28px 55px rgba(236,90,38,0.30)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[17px] font-extrabold text-white" style={sans}>
            shiptime <Wifi size={13} className="opacity-80" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/85" style={sans}>Priority</span>
        </div>
        <div className="flex items-end gap-[2.5px] h-9">
          {bars.map((w, i) => (
            <div key={i} style={{ width: w, height: "100%", background: "rgba(255,255,255,0.94)" }} />
          ))}
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[12px] font-semibold text-white/85" style={sans}>Label ready</span>
          <span className="text-[22px] font-extrabold text-white leading-none" style={sans}>$8.42</span>
        </div>
      </div>
    </div>
  );
}

// ── Card 2 — shipments dashboard ──────────────────────────────────────────────

function ShipmentsDashboard() {
  const rows: { id: string; carrier: string; status: string; tone: string; price: string }[] = [
    { id: "#10428", carrier: "Canada Post", status: "In transit",  tone: ds.blue,   price: "$12.40" },
    { id: "#10427", carrier: "UPS",         status: "Delivered",   tone: ds.green,  price: "$18.90" },
    { id: "#10425", carrier: "FedEx",       status: "Label ready", tone: ds.orange, price: "$9.10" },
  ];
  return (
    <div className="w-full" style={{ maxWidth: 336 }}>
      <div className="p-4" style={{ background: ds.white, borderRadius: 20, boxShadow: "0 30px 60px rgba(28,30,61,0.16)", border: `1px solid ${ds.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[15px] font-extrabold" style={{ ...sans, color: ds.navy }}>shiptime</span>
          <span className="text-[12px] font-semibold" style={{ ...sans, color: ds.muted }}>Shipments</span>
        </div>
        {/* stat tiles */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="px-3 py-2.5 rounded-xl" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ ...sans, color: ds.muted }}>This month</p>
            <p className="text-[19px] font-extrabold leading-none" style={{ ...sans, color: ds.navy }}>128</p>
          </div>
          <div className="px-3 py-2.5 rounded-xl" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ ...sans, color: ds.muted }}>Saved</p>
            <p className="text-[19px] font-extrabold leading-none" style={{ ...sans, color: ds.navy }}>$2,140</p>
          </div>
        </div>
        {/* shipment rows */}
        <div className="flex flex-col">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2.5 py-2" style={{ borderTop: i === 0 ? "none" : `1px solid ${ds.surface}` }}>
              <span className="text-[11px] font-bold" style={{ ...sans, color: ds.navy, width: 44 }}>{r.id}</span>
              <span className="text-[11.5px] flex-1" style={{ ...sans, color: ds.muted }}>{r.carrier}</span>
              <span className="flex items-center gap-1.5 text-[10.5px] font-semibold" style={{ ...sans, color: r.tone }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.tone }} />
                {r.status}
              </span>
              <span className="text-[11.5px] font-bold" style={{ ...sans, color: ds.navy, width: 44, textAlign: "right" }}>{r.price}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-bold text-white" style={{ ...sans, background: ds.orange }}>
          <Plus size={14} strokeWidth={3} /> New shipment
        </button>
      </div>
    </div>
  );
}

// ── Card 3 — API request window ───────────────────────────────────────────────

function ApiWindow() {
  return (
    <div className="w-full" style={{ maxWidth: 340 }}>
      <div className="overflow-hidden" style={{ background: ds.white, borderRadius: 18, boxShadow: "0 30px 60px rgba(28,30,61,0.16)", border: `1px solid ${ds.border}` }}>
        {/* window chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${ds.surface}` }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E0E2E8" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E0E2E8" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E0E2E8" }} />
          <span className="ml-2 text-[11px] font-semibold" style={{ ...sans, color: ds.muted }}>shiptime API</span>
        </div>
        {/* request line */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded text-white" style={{ ...sans, background: ds.orange }}>POST</span>
          <span className="text-[12.5px]" style={{ ...mono, color: ds.navy }}>/v2/shipments</span>
        </div>
        {/* json body */}
        <div className="px-4 pb-3 text-[12px] leading-[1.7]" style={mono}>
          <div style={{ color: ds.muted }}>{"{"}</div>
          <div className="pl-4">
            <span style={{ color: ds.navy }}>"origin"</span><span style={{ color: ds.muted }}>: </span><span style={{ color: ds.orange }}>"Toronto, ON"</span><span style={{ color: ds.muted }}>,</span>
          </div>
          <div className="pl-4">
            <span style={{ color: ds.navy }}>"carrier"</span><span style={{ color: ds.muted }}>: </span><span style={{ color: ds.orange }}>"cheapest"</span><span style={{ color: ds.muted }}>,</span>
          </div>
          <div className="pl-4">
            <span style={{ color: ds.navy }}>"insured"</span><span style={{ color: ds.muted }}>: </span><span style={{ color: ds.green }}>true</span>
          </div>
          <div style={{ color: ds.muted }}>{"}"}</div>
        </div>
        {/* response footer */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${ds.surface}` }}>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ ...sans, color: ds.green }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ds.green }} />
            201 label ready
          </span>
          <span className="text-[15px] font-extrabold" style={{ ...sans, color: ds.navy }}>$8.42</span>
        </div>
      </div>
    </div>
  );
}

// ── Card shell — landing style: white, bordered, soft shadow ─────────────────

function TrioCard({
  href, label, blurb, labelAtBottom = false, bleedTop = false, children, plus = false,
}: {
  href: string; label: string; blurb: string; labelAtBottom?: boolean; bleedTop?: boolean; children: React.ReactNode; plus?: boolean;
}) {
  const head = (
    <div className="relative z-10">
      <div className="flex items-center gap-2">
        <h3 style={{ ...heading, fontSize: "clamp(1.2rem, 2vw, 1.45rem)" }}>{label}</h3>
        {plus && <ArrowUpRight size={19} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ stroke: ds.orange }} />}
      </div>
      <p className="mt-1.5" style={{ ...inter, fontSize: 14.5, color: ds.muted, lineHeight: 1.55 }}>{blurb}</p>
    </div>
  );
  return (
    <a
      href={href}
      className={`group relative flex flex-col p-7 md:p-8 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(28,30,61,0.10)] ${bleedTop ? "" : "overflow-hidden"}`}
      style={{ background: ds.white, borderRadius: 20, minHeight: 460, border: `1px solid ${ds.border}`, boxShadow: "0 2px 20px rgba(28,30,61,0.06)" }}
    >
      {!labelAtBottom && head}
      <div className={`flex-1 flex items-center justify-center ${bleedTop ? "-mt-8" : "py-5"}`}>{children}</div>
      {labelAtBottom && head}
    </a>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function CorePlatformTrio({
  signupHref = "https://app.shiptime.com/",
  plusHref = "/plus",
  background = ds.surface,
}: {
  signupHref?: string;
  plusHref?: string;
  background?: string;
}) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ ...sans, color: ds.orange, fontWeight: 700 }}>The Platform</p>
          <h2 className="mx-auto" style={{ ...heading, fontSize: "clamp(1.8rem, 4.4vw, 2.8rem)", maxWidth: 720 }}>
            One platform for everything you ship
          </h2>
          <p className="mt-5 mx-auto" style={{ ...inter, fontSize: 16, lineHeight: 1.6, color: ds.muted, maxWidth: 480 }}>
            Ship more, spend less, or scale up — three ways to grow without changing
            how you already work.
          </p>
        </div>

        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <TrioCard href={signupHref} label="For me" blurb="Ship the odd parcel at member rates.">
            <ShippingLabel />
          </TrioCard>
          <TrioCard href={signupHref} label="For my business" blurb="Run all your shipping from one dashboard." labelAtBottom bleedTop>
            <ShipmentsDashboard />
          </TrioCard>
          <TrioCard href={plusHref} label="Enterprise" blurb="Custom logistics built around your operation." plus>
            <ApiWindow />
          </TrioCard>
        </div>
      </div>
    </section>
  );
}
