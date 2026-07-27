"use client";

import type React from "react";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, Shield, RotateCcw, Truck } from "lucide-react";

// ── Core 2 feature toolkit — pinned sticky-card scroll tour (skiper17-style) ──
// The Fluz-style feature strip rebuilt as a GSAP ScrollTrigger pinned section:
// scrolling swaps the portrait card (current scales down + tilts away, next
// slides up) while the copy crossfades in sync. Keeps Core 2's design language:
// warm-grey field, Bricolage headings, sunset portraits, product widgets and
// pill chips riding on each card. Mobile gets a simple stacked list.

const ds = {
  navy:   "#1C1E3D",
  body:   "#4B4F66",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  lightBlue: "#E3EEFC",
  green:  "#3FA864",
  white:  "#FFFFFF",
  field:  "#ECEAE7",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const heading: React.CSSProperties = { ...sans, fontFamily: "var(--font-bricolage), var(--font-manrope), system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, color: ds.navy };
const widgetShadow = "0 18px 44px rgba(28,30,61,0.20)";

// ── Floating widgets (same as the non-sticky strip) ──────────────────────────

const blue = "#2F80ED";

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

// ── Feature data (same content as the non-sticky strip) ──────────────────────

type Feature = {
  badge: string;
  title: string;
  blurb: string;
  points: string[];
  photo: string;
  alt: string;
  widget: React.ReactNode;
  chip: string;
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

// ── Bits ──────────────────────────────────────────────────────────────────────

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

function FeatureCopy({ f }: { f: Feature }) {
  return (
    <div>
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
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function ShipTimeCoreFeaturesSticky({ background = ds.field }: { background?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.registerPlugin(ScrollTrigger);

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const copies = copyRefs.current.filter(Boolean) as HTMLDivElement[];
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
      const total = cards.length;
      if (total < 2 || !pinRef.current) return;

      gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
      gsap.set(copies[0], { autoAlpha: 1, y: 0 });
      gsap.set(dots[0], { backgroundColor: ds.orange });
      for (let i = 1; i < total; i++) {
        gsap.set(cards[i], { y: "105%", scale: 1, rotation: 0 });
        gsap.set(copies[i], { autoAlpha: 0, y: 28 });
        gsap.set(dots[i], { backgroundColor: "#CBC7C0" });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (total - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < total - 1; i++) {
        tl.to(cards[i], { scale: 0.7, rotation: 5, duration: 1, ease: "none" }, i);
        tl.to(cards[i + 1], { y: "0%", duration: 1, ease: "none" }, i);
        tl.to(copies[i], { autoAlpha: 0, y: -28, duration: 0.45, ease: "none" }, i + 0.1);
        tl.to(copies[i + 1], { autoAlpha: 1, y: 0, duration: 0.45, ease: "none" }, i + 0.5);
        tl.to(dots[i], { backgroundColor: "#CBC7C0", duration: 0.2, ease: "none" }, i + 0.5);
        tl.to(dots[i + 1], { backgroundColor: ds.orange, duration: 0.2, ease: "none" }, i + 0.5);
      }

      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      if (container.current) resizeObserver.observe(container.current);

      return () => {
        resizeObserver.disconnect();
        tl.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: container },
  );

  return (
    <section ref={container} style={{ background }}>
      {/* header */}
      <div className="px-5 md:px-10 pt-20 md:pt-28 pb-4 md:pb-0">
        <div className="text-center" style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ ...sans, color: ds.orange }}>The toolkit</p>
          <h2 className="mx-auto" style={{ ...heading, fontSize: "clamp(2rem, 4.6vw, 3rem)", maxWidth: 660 }}>
            Everything you need to ship — and keep growing
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.55, color: ds.body, maxWidth: 500 }}>
            Start with a single label. Add carriers, stores, and automation as you scale.
          </p>
        </div>
      </div>

      {/* ── Desktop: pinned scroll tour ── */}
      <div ref={pinRef} className="hidden md:flex items-center" style={{ height: "100vh" }}>
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center w-full px-5 md:px-10" style={{ maxWidth: 1140, margin: "0 auto" }}>

          {/* left: stacked copy panels (crossfade) */}
          <div className="relative" style={{ minHeight: 420 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                ref={(el) => { copyRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center"
                style={{ visibility: i === 0 ? "visible" : "hidden" }}
              >
                <FeatureCopy f={f} />
              </div>
            ))}
            {/* progress dots */}
            <div className="absolute left-0 -bottom-2 flex items-center gap-2">
              {FEATURES.map((f, i) => (
                <span
                  key={f.badge}
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: i === 0 ? ds.orange : "#CBC7C0" }}
                />
              ))}
            </div>
          </div>

          {/* right: sticky portrait-card stack */}
          <div className="relative overflow-hidden mx-auto w-full" style={{ height: "76vh", maxHeight: 680, maxWidth: 480, borderRadius: 28 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.photo}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="absolute inset-0 overflow-hidden"
                style={{ borderRadius: 28, boxShadow: "0 24px 60px rgba(28,30,61,0.22)", willChange: "transform" }}
              >
                <Image src={f.photo} alt={f.alt} fill className="object-cover" style={{ objectPosition: "center 18%" }} sizes="(max-width: 768px) 90vw, 480px" priority={i === 0} />
                {/* top-right chip */}
                <div className="absolute right-4 top-5">
                  <Chip label={f.chip} tone={f.chipTone} />
                </div>
                {/* bottom-left widget */}
                <div className="absolute left-4 bottom-5">
                  <div className="p-3" style={{ background: ds.white, borderRadius: 16, boxShadow: widgetShadow, border: `1px solid ${ds.border}`, minWidth: 176 }}>
                    {f.widget}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: plain stacked list ── */}
      <div className="md:hidden px-5 pb-20 pt-8 flex flex-col gap-16">
        {FEATURES.map((f) => (
          <div key={f.title}>
            <div className="relative overflow-hidden mb-6 mx-auto" style={{ borderRadius: 24, aspectRatio: "3 / 4", maxWidth: 440, boxShadow: "0 16px 44px rgba(28,30,61,0.18)" }}>
              <Image src={f.photo} alt={f.alt} fill className="object-cover" style={{ objectPosition: "center 18%" }} sizes="90vw" />
              <div className="absolute right-3 top-4">
                <Chip label={f.chip} tone={f.chipTone} />
              </div>
              <div className="absolute left-3 bottom-4">
                <div className="p-3" style={{ background: ds.white, borderRadius: 16, boxShadow: widgetShadow, border: `1px solid ${ds.border}`, minWidth: 176 }}>
                  {f.widget}
                </div>
              </div>
            </div>
            <FeatureCopy f={f} />
          </div>
        ))}
      </div>
    </section>
  );
}
