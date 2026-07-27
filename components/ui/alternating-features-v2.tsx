import type React from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icons";

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
const inter = { fontFamily: "var(--font-manrope), sans-serif" };
const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};

// ── Photo + floating widget visual (comparison-page recipe) ──────────────────
// A real photo panel with a compact product widget and a check chip floating
// over it — same treatment as the /vs and /alternative reason visuals.

const widgetShadow = "0 16px 44px rgba(28,30,61,0.18)";

function Chip({ label, accent = ds.orange }: { label: string; accent?: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{ background: ds.white, borderRadius: 12, boxShadow: "0 8px 24px rgba(28,30,61,0.14)", border: `1px solid ${ds.border}` }}
    >
      <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
        <Icon.Check size={12} style={{ stroke: "white" }} />
      </span>
      <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: ds.navy, ...sora }}>{label}</span>
    </div>
  );
}

function PhotoWidget({
  photo,
  alt,
  chip,
  children,
}: {
  photo: string;
  alt: string;
  chip: string;
  children: React.ReactNode; // the floating widget card
}) {
  return (
    <div className="relative mx-auto px-3 pb-8" style={{ maxWidth: 420 }}>
      <div className="relative w-full overflow-hidden" style={{ borderRadius: 22, aspectRatio: "4 / 5" }}>
        <Image src={photo} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 90vw, 420px" />
      </div>
      <div className="absolute -right-1 top-6 md:-right-6">
        <Chip label={chip} />
      </div>
      <div className="absolute -left-1 bottom-0 md:-left-8" style={{ maxWidth: "85%" }}>
        <div className="p-3.5" style={{ background: ds.white, borderRadius: 16, boxShadow: widgetShadow, border: `1px solid ${ds.border}`, width: 250 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Compact widgets ──────────────────────────────────────────

function RateWidget() {
  const rows: [string, string, boolean][] = [
    ["UPS Standard", "$11.85", true],
    ["FedEx Ground", "$13.10", false],
  ];
  return (
    <div className="flex flex-col gap-2">
      {rows.map(([name, price, best]) => (
        <div
          key={name}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: best ? "#FFF4EF" : ds.surface, border: `1px solid ${best ? ds.orange : ds.border}` }}
        >
          <span className="w-5 h-5 rounded-md flex-shrink-0" style={{ background: best ? ds.orange : ds.lightBlue }} />
          <span className="text-[12px] font-bold flex-1 truncate" style={{ color: ds.navy, ...sora }}>{name}</span>
          {best && (
            <span className="text-[8.5px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full text-white" style={{ background: ds.orange, ...sora }}>
              Best
            </span>
          )}
          <span className="text-[13px] font-extrabold" style={{ color: best ? ds.orange : ds.navy, ...sora }}>{price}</span>
        </div>
      ))}
    </div>
  );
}

function OwnRatesWidget() {
  return (
    <div className="flex flex-col gap-2">
      {(["UPS — Negotiated", "FedEx — Negotiated"] as const).map(title => (
        <div key={title} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
          <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: ds.navy }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <span className="text-[12px] font-bold flex-1 truncate" style={{ color: ds.navy, ...sora }}>{title}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "#E8F5E9", color: ds.green, ...sora }}>Active</span>
        </div>
      ))}
    </div>
  );
}

function PickupWidget() {
  const days = ["M", "T", "W", "T", "F"];
  return (
    <div>
      <div className="grid grid-cols-5 gap-1 mb-2">
        {days.map((d, i) => (
          <div
            key={i}
            className="flex flex-col items-center py-1.5 rounded-lg"
            style={{ background: i === 2 ? ds.orange : ds.surface, border: `1px solid ${i === 2 ? ds.orange : ds.border}` }}
          >
            <span className="text-[9px] font-bold" style={{ color: i === 2 ? ds.white : ds.muted, ...sora }}>{d}</span>
            <span className="text-[12px] font-extrabold" style={{ color: i === 2 ? ds.white : ds.navy, ...sora }}>{8 + i}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#FFF4EF", border: `1px solid ${ds.orange}` }}>
        <span className="w-2 h-2 rounded-full" style={{ background: ds.orange }} />
        <span className="text-[11.5px] font-semibold" style={{ color: ds.navy, ...inter }}>Pickup · Wed 2:00 PM</span>
      </div>
    </div>
  );
}

function AuditWidget() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: "#FFF4EF", border: `1px solid ${ds.orange}` }}>
        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ds.orange }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4M12 16h.01" /></svg>
        </span>
        <span className="text-[12px] font-bold flex-1 truncate" style={{ color: ds.navy, ...sora }}>INV-4822 · FedEx</span>
        <span className="text-[10.5px] font-semibold" style={{ color: ds.orange, ...inter }}>+$14.20</span>
      </div>
      <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: ds.navy }}>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: ds.lightBlue, ...sora }}>Recovered</span>
        <span className="text-[13px] font-extrabold" style={{ color: ds.orangeSoft, ...sora }}>$23.75</span>
      </div>
    </div>
  );
}

function TrackingWidget() {
  const steps: [string, boolean][] = [
    ["Picked up", true],
    ["In transit", true],
    ["Delivered", false],
  ];
  return (
    <div className="px-1">
      {steps.map(([label, done], i, a) => (
        <div key={label} className="flex items-center gap-2.5">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: done ? ds.orange : ds.border }}>
              {done && <div className="w-1 h-1 rounded-full bg-white" />}
            </div>
            {i < a.length - 1 && <div className="w-0.5 h-3.5" style={{ background: done ? ds.orange : ds.border }} />}
          </div>
          <span className="text-[11.5px] font-semibold py-0.5" style={{ color: done ? ds.navy : ds.muted, ...inter }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function FreightWidget() {
  return (
    <div className="flex flex-col gap-2">
      {([["Parcel · 18", "$842.10"], ["Freight · 3", "$1,206.00"]] as const).map(([title, amt]) => (
        <div key={title} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
          <span className="text-[11.5px] font-bold" style={{ color: ds.navy, ...sora }}>{title}</span>
          <span className="text-[12px] font-extrabold" style={{ color: ds.navy, ...sora }}>{amt}</span>
        </div>
      ))}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: ds.navy }}>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: ds.lightBlue, ...sora }}>Total due</span>
        <span className="text-[13px] font-extrabold" style={{ color: ds.white, ...sora }}>$2,048.10</span>
      </div>
    </div>
  );
}

// ── Feature data ────────────────────────────────────────────
type Block = {
  eyebrow: string;
  title: string;
  subhead: string;
  body: string;
  photo: string;
  alt: string;
  chip: string;
  widget: React.ReactNode;
};

const BLOCKS: Block[] = [
  {
    eyebrow: "Rate shopping",
    title: "Compare Every Carrier On One Screen",
    subhead: "Stop tabbing between five carrier websites.",
    body: "Put UPS, FedEx, Purolator, Canada Post and LTL freight side by side on a single screen, then print the cheapest qualified label in seconds.",
    photo: "/generated/core-include-rate.png",
    alt: "Warehouse shelves stocked with parcels",
    chip: "Best rate found",
    widget: <RateWidget />,
  },
  {
    eyebrow: "Bring your own rates",
    title: "Your Negotiated Pricing, Built In",
    subhead: "Already cut a deal? Bring it.",
    body: "Plug in the rates you've negotiated and shop them against ours on every shipment, so you always pay the lowest qualified price.",
    photo: "/generated/core-include-byor.png",
    alt: "Team reviewing negotiated rates together",
    chip: "Your account connected",
    widget: <OwnRatesWidget />,
  },
  {
    eyebrow: "Pickup scheduling",
    title: "Pickups That Fit Your Day",
    subhead: "No more racing to the depot.",
    body: "Book carrier pickups right after you print, on your schedule. Parcel or freight, one flow, no phone calls.",
    photo: "/generated/core-include-pickup.png",
    alt: "Courier collecting a scheduled pickup",
    chip: "Pickup booked",
    widget: <PickupWidget />,
  },
  {
    eyebrow: "Automatic rate audit",
    title: "Overcharges, Caught And Recovered",
    subhead: "Stop paying for billing mistakes you never see.",
    body: "ShipTime checks every carrier invoice line against what you were quoted, flags the gaps, and recovers the difference — automatically.",
    photo: "/generated/core-include-audit.png",
    alt: "Reviewing carrier invoices for overcharges",
    chip: "Audited automatically",
    widget: <AuditWidget />,
  },
  {
    eyebrow: "Live tracking",
    title: "One Dashboard For Every Shipment",
    subhead: "Where is everything? Right here.",
    body: "Follow every parcel and freight load on a single timeline, from label created to delivered, with rates synced beside each one.",
    photo: "/generated/core-include-tracking.png",
    alt: "Shipment in transit on the highway",
    chip: "On time",
    widget: <TrackingWidget />,
  },
  {
    eyebrow: "Freight & LTL",
    title: "Parcel And Freight, One Invoice",
    subhead: "No separate freight broker required.",
    body: "Quote, book and track LTL freight in the same place as your parcels, and settle it all on one clean invoice.",
    photo: "/generated/core-include-freight.png",
    alt: "Freight containers stacked in a yard",
    chip: "One invoice",
    widget: <FreightWidget />,
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

                  {/* Visual side — photo + floating widget + chip */}
                  <div className={textFirst ? "md:order-2" : "md:order-1"}>
                    <PhotoWidget photo={b.photo} alt={b.alt} chip={b.chip}>
                      {b.widget}
                    </PhotoWidget>
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
