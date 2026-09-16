"use client";

import type React from "react";
import Image from "next/image";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";
import { HandwritingText } from "@/components/ui/handwriting-text";
import ExplainerPlayer from "@/components/ui/explainer-player";

// ── /home-2 hero — Fluz-style ─────────────────────────────────────────────────
// Full-bleed painted dawn sky, centered pill badge, and a two-part headline:
// Anton caps over a handwritten line that draws itself. Below it, the product
// film in a single rounded player, with the matte 3D props floating around and
// over its edges.
//
// Type follows the Parcel Forum standard now shared across the property: Anton
// uppercase for display, Manrope for everything else.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
};

// Hero display face — Anton uppercase, matching the Parcel Forum page so the
// Core and Plus zones read as one property.
const display: React.CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
};

// ── Painted sky + clouds ──────────────────────────────────────────────────────

function PaintedSky() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {/* dawn gradient: blue top → warm peach mid → lavender base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #4E97F2 0%, #6E9BEB 26%, #A9A6DE 46%, #E7AE9C 62%, #F2B98E 71%, #D9A9C4 84%, #9E93DE 100%)",
        }}
      />
      {/* soft painted clouds hugging the bottom */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" style={{ height: "42%" }}>
        <defs>
          <linearGradient id="fluz-cloud-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B9A9E6" />
            <stop offset="100%" stopColor="#8E7FD6" />
          </linearGradient>
          <linearGradient id="fluz-cloud-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9CFF2" />
            <stop offset="100%" stopColor="#A99EE2" />
          </linearGradient>
          <filter id="fluz-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g filter="url(#fluz-soft)">
          <path fill="url(#fluz-cloud-b)" opacity="0.9" d="M-40 260 C 120 190, 260 250, 420 220 C 560 195, 700 250, 900 225 C 1080 205, 1240 255, 1480 220 L 1480 340 L -40 340 Z" />
          <path fill="url(#fluz-cloud-a)" d="M-40 300 C 140 250, 300 300, 520 285 C 720 272, 900 312, 1120 292 C 1280 278, 1400 305, 1480 292 L 1480 340 L -40 340 Z" />
          <ellipse cx="230" cy="270" rx="180" ry="70" fill="url(#fluz-cloud-b)" opacity="0.85" />
          <ellipse cx="1180" cy="262" rx="210" ry="78" fill="url(#fluz-cloud-b)" opacity="0.85" />
          <ellipse cx="720" cy="285" rx="240" ry="72" fill="url(#fluz-cloud-a)" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

// ── Composition pieces ────────────────────────────────────────────────────────

// Floating prop — a matte 3D cut-out (generated, transparent PNG) that drifts
// over the gradients and overlaps card edges, Fluz-style. Deliberately matte
// rather than candy-gloss. A soft drop shadow seats it against the background.
type PropName = "parcel" | "coin" | "label" | "plane";

function FloatProp({
  prop,
  size = 96,
  rotate = 0,
  style,
}: {
  prop: PropName;
  size?: number;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}
      aria-hidden
    >
      <Image
        src={`/generated/prop-${prop}.png`}
        alt=""
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-contain"
        style={{ filter: "drop-shadow(0 14px 22px rgba(28,30,61,0.28))" }}
      />
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

export default function ShipTimeHeroFluz({
  badge = "For your business",
  headline = "Save More",
  handwritten = ["on every shipment", "on every label", "on every pallet"],
  subhead = "Compare live rates from every major carrier and save up to 70% on every shipment — labels, freight, and tracking in one place.",
  ctaLabel = "Get started",
  ctaHref,
}: {
  badge?: string;
  /** First headline line, set in the heavy display face. */
  headline?: string;
  /** Second line, written out by hand and cycled. */
  handwritten?: string[];
  subhead?: string;
  ctaLabel?: string;
  /** When set, the primary CTA links straight to sign-up; otherwise it opens the lead-capture modal. */
  ctaHref?: string;
}) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "clamp(720px, 96vh, 1040px)" }}>
      <PaintedSky />

      {/* Copy */}
      <div className="relative z-10 px-5 md:px-10 pt-24 md:pt-28 text-center flex flex-col items-center">
        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-7" style={{ ...sans, background: ds.white, color: ds.navy }}>
          {badge}
        </span>
        <h1 style={{ ...display, color: ds.white, fontSize: "clamp(2.6rem, 6.4vw, 5rem)", textShadow: "0 2px 30px rgba(28,30,61,0.15)" }}>
          {headline}
          <br />
          <HandwritingText words={handwritten} height="1.55em" strokeWidth={1.5} />
        </h1>
        <p className="mt-5 mx-auto text-white/90" style={{ ...sans, fontSize: "clamp(1rem, 1.5vw, 1.15rem)", lineHeight: 1.55, maxWidth: 520, textShadow: "0 1px 12px rgba(28,30,61,0.18)" }}>
          {subhead}
        </p>
        <div className="mt-7">
          {ctaHref ? (
            <a
              href={ctaHref}
              className="inline-flex items-center px-8 py-3.5 rounded-full text-white text-[15px] font-bold transition-opacity hover:opacity-90"
              style={{ ...sans, background: ds.navy, boxShadow: "0 10px 30px rgba(28,30,61,0.30)" }}
            >
              {ctaLabel}
            </a>
          ) : (
            <LeadCaptureButton
              source="home-hero-v2"
              className="inline-flex items-center px-8 py-3.5 rounded-full text-white text-[15px] font-bold transition-opacity hover:opacity-90"
              style={{ ...sans, background: ds.navy, boxShadow: "0 10px 30px rgba(28,30,61,0.30)" }}
            >
              {ctaLabel}
            </LeadCaptureButton>
          )}
        </div>
      </div>

      {/* ── The explainer, one rounded player ───────────────────────────────
          The 90-second film lives here. Until it renders this is a labelled
          placeholder at the player's exact size, so nothing below moves when the
          MP4 lands — pass `src` (and `poster`) to go live. The matte props still
          float around and over its edges so the Fluz composition survives. */}
      <div className="relative z-10 mx-auto mt-10 md:mt-14 px-5" style={{ maxWidth: 1180 }}>
        <div className="relative mx-auto" style={{ maxWidth: 1000 }}>
          <ExplainerPlayer
            note="The 90-second film drops in here as an MP4."
          />

          {/* props, strewn around and over the player */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <FloatProp prop="parcel" size={118} rotate={14} style={{ left: -54, top: -46 }} />
            <FloatProp prop="coin" size={72} rotate={-16} style={{ left: 64, bottom: -34 }} />
            <FloatProp prop="label" size={104} rotate={-14} style={{ right: -42, top: -34 }} />
            <FloatProp prop="plane" size={92} rotate={-10} style={{ right: -30, bottom: "18%" }} />
            <FloatProp prop="coin" size={46} rotate={22} style={{ right: "26%", top: -58 }} />
          </div>
        </div>
      </div>

    </section>
  );
}
