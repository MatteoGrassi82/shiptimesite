"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Check, Shield, RotateCcw, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

// ── Core feature strip (Core homepage §3.2), Fluz-style parallax splits ───────
// Four features as alternating text/visual splits on the warm-grey Fluz field.
// The visual is a retro people portrait (pastel backdrop = the Fluz colorful-
// panel look) with a product widget that PARALLAXES over it as you scroll.
// Rates demoted to one feature; insurance promoted; developer API removed.

const ds = {
  navy:   "#1C1E3D",
  body:   "#4B4F66",   // darker than muted for readable body copy
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  lightBlue: "#E3EEFC",
  green:  "#3FA864",
  white:  "#FFFFFF",
  field:  "#ECEAE7",   // warm grey section field (matches the trio + Fluz)
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const heading: React.CSSProperties = { ...sans, fontFamily: "var(--font-bricolage), var(--font-manrope), system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: ds.navy };
const widgetShadow = "0 18px 44px rgba(28,30,61,0.20)";

// ── Floating widgets ──────────────────────────────────────────────────────────

const blue = "#2F80ED";

// 1 — live rate comparison with eta + savings
function RateWidget() {
  const rows = [
    { c: "Canada Post", eta: "2 days", p: "$8.42", best: true },
    { c: "Purolator",   eta: "2 days", p: "$9.18", best: false },
    { c: "UPS",         eta: "1 day",  p: "$11.05", best: false },
  ];
  return (
    <div style={{ width: 196 }}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[12px] font-extrabold" style={{ ...sans, color: ds.navy }}>Live rates</span>
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ ...sans, background: ds.lightBlue, color: ds.navy }}>TOR → VAN</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map(r => (
          <div key={r.c} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: r.best ? "#FFF4EF" : ds.surface, border: `1px solid ${r.best ? ds.orange : ds.border}` }}>
            <div>
              <p className="text-[11.5px] font-bold leading-tight" style={{ ...sans, color: ds.navy }}>{r.c}</p>
              <p className="text-[9.5px] leading-tight" style={{ ...sans, color: ds.muted }}>{r.eta}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-extrabold" style={{ ...sans, color: r.best ? ds.orange : ds.navy }}>{r.p}</span>
              {r.best && <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full text-white" style={{ ...sans, background: ds.orange }}>Best</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        <Check size={12} style={{ stroke: ds.green, strokeWidth: 3 }} />
        <span className="text-[11px] font-semibold" style={{ ...sans, color: ds.green }}>You save $5.68 vs retail</span>
      </div>
    </div>
  );
}

// 2 — connected stores with live sync status
function StoreWidget() {
  const stores = [
    { n: "Shopify", c: "#5E8E3E", sub: "24 orders today" },
    { n: "WooCommerce", c: "#7F54B3", sub: "Synced 2m ago" },
    { n: "Amazon", c: "#FF9900", sub: "Synced" },
  ];
  return (
    <div style={{ width: 202 }}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[12px] font-extrabold" style={{ ...sans, color: ds.navy }}>Stores connected</span>
        <span className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider" style={{ ...sans, color: ds.green }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ds.green }} /> Live
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {stores.map(s => (
          <div key={s.n} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
            <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0" style={{ ...sans, background: s.c }}>{s.n[0]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-bold leading-tight" style={{ ...sans, color: ds.navy }}>{s.n}</p>
              <p className="text-[9.5px] leading-tight" style={{ ...sans, color: ds.muted }}>{s.sub}</p>
            </div>
            <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(63,168,100,0.14)" }}>
              <Check size={10} style={{ stroke: ds.green, strokeWidth: 3.5 }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3 — insurance: premium vs carrier declared-value cost
function InsuranceWidget() {
  return (
    <div style={{ width: 196 }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(63,168,100,0.12)" }}>
          <Shield size={14} style={{ stroke: ds.green }} />
        </span>
        <div>
          <p className="text-[12px] font-extrabold leading-tight" style={{ ...sans, color: ds.navy }}>Parcel insured</p>
          <p className="text-[9.5px] leading-tight" style={{ ...sans, color: ds.muted }}>Declared value $500</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg" style={{ background: ds.surface, border: `1px solid ${ds.border}` }}>
          <span className="text-[10.5px] font-semibold" style={{ ...sans, color: ds.muted }}>Carrier declared value</span>
          <span className="text-[11px] font-bold line-through" style={{ ...sans, color: ds.muted }}>$7.50</span>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg" style={{ background: "#FFF4EF", border: `1px solid ${ds.orange}` }}>
          <span className="text-[10.5px] font-bold" style={{ ...sans, color: ds.navy }}>ShipTime insurance</span>
          <span className="text-[12px] font-extrabold" style={{ ...sans, color: ds.orange }}>$1.20</span>
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        <Check size={12} style={{ stroke: ds.green, strokeWidth: 3 }} />
        <span className="text-[11px] font-semibold" style={{ ...sans, color: ds.green }}>Claims paid in 48h</span>
      </div>
    </div>
  );
}

// 4 — branded tracking card with progress + returns
function TrackingWidget() {
  return (
    <div style={{ width: 200 }}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#EC5A26,#F0845B)" }}>
          <Truck size={12} style={{ stroke: "#fff" }} />
        </span>
        <div className="flex-1">
          <p className="text-[11.5px] font-extrabold leading-tight" style={{ ...sans, color: ds.navy }}>Acme Co.</p>
          <p className="text-[9.5px] leading-tight" style={{ ...sans, color: ds.muted }}>#ST-48201</p>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ ...sans, background: "rgba(47,128,237,0.12)", color: blue }}>Out for delivery</span>
      </div>
      {/* progress */}
      <div className="flex items-center gap-1 mb-1.5">
        {[true, true, true, false].map((on, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: on ? ds.orange : ds.border }} />
        ))}
      </div>
      <p className="text-[10.5px] font-semibold mb-2.5" style={{ ...sans, color: ds.navy }}>Arriving today by 5:00 PM</p>
      <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold" style={{ ...sans, background: ds.surface, border: `1px solid ${ds.border}`, color: ds.navy }}>
        <RotateCcw size={12} /> Start a return
      </button>
    </div>
  );
}

// ── Feature data ────────────────────────────────────────────────────────────

type Feature = {
  badge: string;
  title: string;
  blurb: string;
  points: string[];
  photo: string;
  alt: string;
  widget: React.ReactNode;   // bottom-left card
  chip: string;              // top-right pill
  chipTone: string;
  tag?: string;
};

const FEATURES: Feature[] = [
  {
    badge: "Rate shopping",
    title: "Every carrier, one screen",
    blurb: "See live rates from every major carrier side by side, then print the cheapest qualified label in a click — no more tabbing between five websites.",
    points: [
      "UPS, FedEx, Canada Post, Purolator, DHL & more",
      "Up to 70% off walk-in carrier rates",
      "Parcel and LTL freight in the same view",
    ],
    photo: "/generated/core-include-rate.png",
    alt: "Small business owner shipping with ShipTime",
    widget: <RateWidget />,
    chip: "Best rate found",
    chipTone: "#EC5A26",
  },
  {
    badge: "Integrations",
    title: "Your store, already connected",
    blurb: "Link the store you already sell on and let orders flow straight into ShipTime. No copy-paste, no exports, no extra tabs to babysit.",
    points: [
      "Shopify, WooCommerce, Amazon, eBay & more",
      "Orders sync in automatically",
      "Batch-print a whole day's labels at once",
    ],
    photo: "/generated/core-include-byor.png",
    alt: "Business owner connecting their store",
    widget: <StoreWidget />,
    chip: "Auto-sync on",
    chipTone: "#3FA864",
  },
  {
    badge: "Insurance",
    title: "Cover every parcel for pennies",
    blurb: "Insure shipments for a fraction of what carriers charge to declare value — and if something breaks or goes missing, you're made whole fast.",
    points: [
      "Coverage from about $1.20 per parcel",
      "Cheaper than carrier declared value",
      "Simple claims, quick payouts",
    ],
    photo: "/generated/core-include-audit.png",
    alt: "Customer covered by shipping insurance",
    widget: <InsuranceWidget />,
    chip: "Fully insured",
    chipTone: "#3FA864",
    tag: "Cheaper than carriers",
  },
  {
    badge: "Post-purchase",
    title: "Make the delivery yours",
    blurb: "Put your brand on the part customers actually see. Tracking pages carry your logo, and a self-serve returns portal keeps them out of your inbox.",
    points: [
      "Your logo on every tracking page",
      "Self-serve branded returns portal",
      "Fewer “where's my order?” tickets",
    ],
    photo: "/generated/core-include-tracking.png",
    alt: "Customer tracking a branded shipment",
    widget: <TrackingWidget />,
    chip: "On time",
    chipTone: "#2F80ED",
  },
];

// ── Visual panel — the widget card parallaxes over the portrait on scroll ─────

function Chip({ label, tone }: { label: string; tone: string }) {
  return (
    <div className="flex items-center gap-2 pl-2 pr-3.5 py-2" style={{ background: ds.white, borderRadius: 999, boxShadow: widgetShadow, border: `1px solid ${ds.border}` }}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: tone }}>
        <Check size={11} style={{ stroke: "#fff", strokeWidth: 3.5 }} />
      </span>
      <span className="text-[12px] font-bold whitespace-nowrap" style={{ ...sans, color: ds.navy }}>{label}</span>
    </div>
  );
}

function FeatureVisual({ photo, alt, widget, chip, chipTone }: { photo: string; alt: string; widget: React.ReactNode; chip: string; chipTone: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const card = cardRef.current;
    const chipEl = chipRef.current;
    if (!wrap || !img || !card || !chipEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 as the panel enters from the bottom → 1 as it leaves past the top
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const t = 0.5 - p;
      // background image drifts slowly; the two floating cards drift more, at
      // different rates and opposite corners for a layered parallax.
      img.style.transform = `translate3d(0, ${(t * 40).toFixed(1)}px, 0)`;
      card.style.transform = `translate3d(0, ${(t * 128).toFixed(1)}px, 0)`;
      chipEl.style.transform = `translate3d(0, ${(t * 92).toFixed(1)}px, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto w-full" style={{ maxWidth: 440 }}>
      <div className="relative w-full overflow-hidden" style={{ borderRadius: 28, aspectRatio: "3 / 4" }}>
        {/* lightly over-sized so vertical parallax never reveals an edge */}
        <div ref={imgRef} className="absolute left-0 right-0 will-change-transform" style={{ top: "-5%", height: "110%" }}>
          <Image src={photo} alt={alt} fill className="object-cover" style={{ objectPosition: "center 18%" }} sizes="(max-width: 768px) 90vw, 440px" />
        </div>
      </div>
      {/* top-right chip */}
      <div ref={chipRef} className="absolute -right-2 top-6 md:-right-5 will-change-transform">
        <Chip label={chip} tone={chipTone} />
      </div>
      {/* bottom-left widget */}
      <div ref={cardRef} className="absolute -left-3 bottom-6 md:-left-6 will-change-transform">
        <div className="p-3" style={{ background: ds.white, borderRadius: 16, boxShadow: widgetShadow, border: `1px solid ${ds.border}`, minWidth: 176 }}>
          {widget}
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function ShipTimeCoreFeatures({ background = ds.field }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* header */}
        <Reveal className="text-center mb-16 md:mb-24">
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ ...sans, color: ds.orange }}>The toolkit</p>
          <h2 className="mx-auto" style={{ ...heading, fontSize: "clamp(2rem, 4.6vw, 3rem)", maxWidth: 660 }}>
            Everything you need to ship — and keep growing
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.55, color: ds.body, maxWidth: 500 }}>
            Start with a single label. Add carriers, stores, and automation as you scale.
          </p>
        </Reveal>

        {/* alternating splits */}
        <div className="flex flex-col gap-20 md:gap-28">
          {FEATURES.map((f, i) => {
            const textFirst = i % 2 === 0;
            return (
              <div key={f.title} className="grid items-center gap-10 md:gap-16 md:grid-cols-2">
                {/* text */}
                <Reveal className={textFirst ? "md:order-1" : "md:order-2"}>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5" style={{ ...sans, background: ds.surface, border: `1px solid ${ds.border}`, color: ds.navy }}>
                    {f.badge}
                  </span>
                  <h3 className="mb-4" style={{ ...heading, fontSize: "clamp(1.6rem, 3.4vw, 2.3rem)" }}>{f.title}</h3>
                  <p style={{ ...sans, fontSize: 17, lineHeight: 1.65, color: ds.body, maxWidth: 440 }}>{f.blurb}</p>
                  <ul className="mt-6 flex flex-col gap-3" style={{ maxWidth: 420 }}>
                    {f.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(236,90,38,0.12)" }}>
                          <Check size={12} style={{ stroke: ds.orange, strokeWidth: 3 }} />
                        </span>
                        <span style={{ ...sans, fontSize: 15, lineHeight: 1.5, color: ds.navy, fontWeight: 600 }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  {f.tag && (
                    <span className="inline-flex mt-6 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider" style={{ ...sans, background: "rgba(236,90,38,0.1)", color: ds.orange }}>
                      {f.tag}
                    </span>
                  )}
                </Reveal>
                {/* visual */}
                <div className={textFirst ? "md:order-2" : "md:order-1"}>
                  <FeatureVisual photo={f.photo} alt={f.alt} widget={f.widget} chip={f.chip} chipTone={f.chipTone} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
