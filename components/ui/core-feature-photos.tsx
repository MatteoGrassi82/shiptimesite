import type React from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icons";

// ── "Every ShipTime account includes" — landing-page style feature blocks ────
// Mixes the /vs reasons layout (photo panel + floating check chips) with the
// /alternative feature deep-dives (eyebrow + title + checklist, alternating,
// Reveal on scroll). Uses the generated portrait photos in public/generated.

const ds = {
  navy: "#1C1E3D",
  muted: "#6E728A",
  orange: "#EC5A26",
  green: "#3FA864",
  lightBlue: "#E3EEFC",
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
  /** intrinsic dimensions of the photo file */
  size: [number, number];
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
    size: [1024, 1024],
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
    size: [1024, 1024],
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
    size: [1024, 1024],
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
    size: [1024, 1024],
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
    size: [1536, 1024],
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

function PhotoPanel({ src, alt, size }: { src: string; alt: string; size: [number, number] }) {
  const [w, h] = size;
  return (
    <div className="relative w-full overflow-hidden mx-auto" style={{ borderRadius: 20, maxWidth: w > h ? 500 : 440, boxShadow: "0 20px 60px rgba(28,30,61,0.14)" }}>
      <Image src={src} alt={alt} width={w} height={h} className="block w-full h-auto object-cover" />
    </div>
  );
}

export default function CoreFeaturePhotos({ background = ds.white }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div className="text-center mb-14 md:mb-20">
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

        <div className="flex flex-col gap-16 md:gap-24">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Copy */}
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
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

              {/* Photo + floating chips */}
              <div className={`relative ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <PhotoPanel src={f.photo} alt={f.alt} size={f.size} />
                <div className="absolute -left-2 md:-left-3 top-8">
                  <Chip label={f.chips[0]} accent={ds.orange} />
                </div>
                <div className="absolute -right-2 md:-right-3 bottom-10">
                  <Chip label={f.chips[1]} accent={ds.green} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
