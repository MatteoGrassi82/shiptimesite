"use client";

import type React from "react";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/ui/icons";

// ── "Everything you need to ship smarter" — pinned sticky-card feature tour ──
// Adapted from skiper-ui's Skiper17 (GSAP ScrollTrigger sticky card stack).
// The section pins to the viewport; scrolling swaps the feature photo (current
// card scales down and rotates away while the next slides up from below) and
// crossfades the matching copy on the left. Mobile gets a simple stacked list.

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  green: "#3FA864",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  color: ds.navy,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};
const body: React.CSSProperties = { fontFamily: "var(--font-inter), system-ui, sans-serif", color: ds.muted, lineHeight: 1.6 };
const sora = { fontFamily: "var(--font-manrope), sans-serif" };

type Feature = {
  eyebrow: string;
  title: string;
  blurb: string;
  points: string[];
  photo: string;
  alt: string;
  chips: [string, string];
};

const FEATURES: Feature[] = [
  {
    eyebrow: "Rate shopping",
    title: "Every carrier's best rate, one screen",
    blurb: "Canada Post, UPS, FedEx, Purolator, DHL and more — compared side by side the moment you enter a shipment.",
    points: [
      "Live rates from every major carrier in one quote",
      "Pre-negotiated discounts up to 70% off walk-in prices",
      "Cheapest, fastest, or best-value — you pick per shipment",
    ],
    photo: "/generated/freightcom-vs-reason-1.png",
    alt: "Small business owner comparing carrier rates",
    chips: ["Best rate found", "Up to 70% off"],
  },
  {
    eyebrow: "Bring your own rates",
    title: "Keep your rates. Gain a platform.",
    blurb: "Already negotiated carrier discounts? Connect them and compare your rates against ours — the better one wins, every time.",
    points: [
      "Connect existing carrier accounts in minutes",
      "Your rates and ShipTime rates compete per shipment",
      "No repricing games, no forced migration",
    ],
    photo: "/generated/stallion-express-vs-reason-2.png",
    alt: "Team reviewing their negotiated carrier rates",
    chips: ["Your rates connected", "Best of both"],
  },
  {
    eyebrow: "Protection & refunds",
    title: "Insurance up front, refunds behind the scenes",
    blurb: "Cover shipments for less at checkout, and let the invoice audit claw back money you didn't know you were owed.",
    points: [
      "Discounted shipment insurance on every label",
      "Every carrier invoice audited automatically",
      "Overcharges and late deliveries claimed for you",
    ],
    photo: "/generated/shipstation-vs-reason-2.png",
    alt: "Business owners reviewing audited shipping invoices",
    chips: ["Invoice audited", "Refund claimed"],
  },
  {
    eyebrow: "Delivery experience",
    title: "Tracking that carries your brand",
    blurb: "Branded tracking pages and proactive notifications keep customers informed — and out of your inbox.",
    points: [
      "Tracking pages with your logo, not the carrier's",
      "Proactive delivery updates cut “where's my order?” emails",
      "Returns your customers can start themselves",
    ],
    photo: "/generated/shipstation-vs-reason-1.png",
    alt: "Merchant checking branded tracking updates",
    chips: ["Out for delivery", "Fewer WISMO emails"],
  },
  {
    eyebrow: "Parcel + freight",
    title: "From envelopes to pallets",
    blurb: "When orders outgrow parcel, quote LTL freight in the same flow — same login, same invoice, no separate broker.",
    points: [
      "Courier and LTL freight quotes side by side",
      "One invoice across every carrier and mode",
      "Grow into freight without new software",
    ],
    photo: "/generated/stallion-express-vs-hero.png",
    alt: "Merchant preparing shipments for pickup",
    chips: ["LTL quote ready", "One invoice"],
  },
];

function Chip({ label, accent }: { label: string; accent: string }) {
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

function FeatureCopy({ f }: { f: Feature }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>{f.eyebrow}</p>
      <h3 className="mb-4" style={{ ...heading, fontSize: "clamp(1.4rem, 3.2vw, 1.9rem)" }}>{f.title}</h3>
      <p className="mb-6" style={{ ...body, fontSize: 15.5 }}>{f.blurb}</p>
      <ul className="flex flex-col gap-3">
        {f.points.map((p) => (
          <li key={p} className="flex items-start gap-3">
            <Icon.Check size={18} style={{ stroke: ds.orange, marginTop: 2, flexShrink: 0 }} />
            <span style={{ ...body, fontSize: 15, color: ds.navy }}>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CoreFeaturesSticky({ background = ds.white }: { background?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      // Desktop only — mobile gets the plain stacked list.
      if (window.matchMedia("(max-width: 767px)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.registerPlugin(ScrollTrigger);

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const copies = copyRefs.current.filter(Boolean) as HTMLDivElement[];
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
      const total = cards.length;
      if (total < 2 || !pinRef.current) return;

      // initial states
      gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
      gsap.set(copies[0], { autoAlpha: 1, y: 0 });
      gsap.set(dots[0], { backgroundColor: ds.orange });
      for (let i = 1; i < total; i++) {
        gsap.set(cards[i], { y: "105%", scale: 1, rotation: 0 });
        gsap.set(copies[i], { autoAlpha: 0, y: 28 });
        gsap.set(dots[i], { backgroundColor: "#D9DCE5" });
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
        // photo: current shrinks + tilts away, next slides up over it
        tl.to(cards[i], { scale: 0.7, rotation: 5, duration: 1, ease: "none" }, i);
        tl.to(cards[i + 1], { y: "0%", duration: 1, ease: "none" }, i);
        // copy: crossfade
        tl.to(copies[i], { autoAlpha: 0, y: -28, duration: 0.45, ease: "none" }, i + 0.1);
        tl.to(copies[i + 1], { autoAlpha: 1, y: 0, duration: 0.45, ease: "none" }, i + 0.5);
        // progress dots
        tl.to(dots[i], { backgroundColor: "#D9DCE5", duration: 0.2, ease: "none" }, i + 0.5);
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
        <div className="text-center" style={{ maxWidth: 1040, margin: "0 auto" }}>
          <p className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: ds.orange, ...sora }}>
            Every account includes
          </p>
          <h2 className="mb-4" style={{ ...heading, fontSize: "clamp(1.7rem, 4.2vw, 2.5rem)" }}>
            Everything you need to ship smarter
          </h2>
          <p className="mx-auto" style={{ ...body, maxWidth: 480, fontSize: 15.5 }}>
            No tiers, no add-ons, no platform fee. Every free account gets the full toolkit.
          </p>
        </div>
      </div>

      {/* ── Desktop: pinned scroll tour ── */}
      <div ref={pinRef} className="hidden md:flex items-center" style={{ height: "100vh" }}>
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center w-full px-5 md:px-10" style={{ maxWidth: 1080, margin: "0 auto" }}>

          {/* left: stacked copy panels (crossfade) */}
          <div className="relative" style={{ minHeight: 380 }}>
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
                  key={f.eyebrow}
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: i === 0 ? ds.orange : "#D9DCE5" }}
                />
              ))}
            </div>
          </div>

          {/* right: sticky card stack */}
          <div className="relative overflow-hidden" style={{ height: "72vh", maxHeight: 640, borderRadius: 24 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.photo}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="absolute inset-0 overflow-hidden"
                style={{ borderRadius: 24, boxShadow: "0 20px 60px rgba(28,30,61,0.18)", willChange: "transform" }}
              >
                <Image src={f.photo} alt={f.alt} fill className="object-cover" sizes="(max-width: 768px) 90vw, 540px" priority={i === 0} />
                {/* chips inside the card so they travel with it */}
                <div className="absolute left-4 top-4">
                  <Chip label={f.chips[0]} accent={ds.orange} />
                </div>
                <div className="absolute right-4 bottom-4">
                  <Chip label={f.chips[1]} accent={ds.green} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: plain stacked list ── */}
      <div className="md:hidden px-5 pb-20 pt-8 flex flex-col gap-14">
        {FEATURES.map((f) => (
          <div key={f.title}>
            <div className="relative overflow-hidden mb-6" style={{ borderRadius: 20, boxShadow: "0 16px 44px rgba(28,30,61,0.14)" }}>
              <Image src={f.photo} alt={f.alt} width={1024} height={1024} className="block w-full h-auto object-cover" />
              <div className="absolute left-3 top-3">
                <Chip label={f.chips[0]} accent={ds.orange} />
              </div>
              <div className="absolute right-3 bottom-3">
                <Chip label={f.chips[1]} accent={ds.green} />
              </div>
            </div>
            <FeatureCopy f={f} />
          </div>
        ))}
      </div>
    </section>
  );
}
