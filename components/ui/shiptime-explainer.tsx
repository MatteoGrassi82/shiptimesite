"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Play } from "lucide-react";

// ── Explainer video section ───────────────────────────────────────────────────
// Holds the 90-second Core explainer. Until that film is rendered, `src` is
// undefined and the section renders a labelled placeholder at the exact size
// and shape the real player will occupy — so the page's rhythm is already
// correct and dropping the film in is a one-prop change.
//
// With a src set it is a click-to-play MP4: a poster frame under a play button,
// swapped for the real <video> with controls on first click. Deliberately NOT
// autoplay — this is a 90-second watch someone opts into, unlike the muted
// loop in the hero.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
};

export default function ShipTimeExplainer({
  /** Path to the rendered MP4. Leave undefined to show the placeholder. */
  src,
  poster,
  eyebrow = "Watch",
  headline = "See it in 90 seconds",
  blurb = "The whole thing, end to end — from five carrier tabs to one screen, one label, and an invoice that finally adds up.",
  background = "#ECEAE7",
}: {
  src?: string;
  poster?: string;
  eyebrow?: string;
  headline?: string;
  blurb?: string;
  background?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function start() {
    setPlaying(true);
    // The element mounts in the same commit; play on the next frame.
    requestAnimationFrame(() => videoRef.current?.play());
  }

  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        {/* header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ ...sans, color: ds.orange }}>
            {eyebrow}
          </p>
          <h2 className="mx-auto" style={{ ...display, color: ds.navy, fontSize: "clamp(2rem, 5vw, 3.4rem)", maxWidth: 720 }}>
            {headline}
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.6, color: ds.muted, maxWidth: 520 }}>
            {blurb}
          </p>
        </div>

        {/* player */}
        <div
          className="relative overflow-hidden mx-auto"
          style={{
            aspectRatio: "16 / 9",
            borderRadius: 24,
            background: ds.navy,
            boxShadow: "0 40px 90px rgba(28,30,61,0.26)",
          }}
        >
          {src ? (
            playing ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full"
                src={src}
                poster={poster}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <button
                type="button"
                onClick={start}
                className="group absolute inset-0 w-full h-full cursor-pointer"
                aria-label={`Play: ${headline}`}
              >
                {poster && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <span className="absolute inset-0" style={{ background: "rgba(28,30,61,0.28)" }} />
                <PlayBadge />
              </button>
            )
          ) : (
            <Placeholder />
          )}
        </div>
      </div>
    </section>
  );
}

function PlayBadge() {
  return (
    <span
      className="absolute left-1/2 top-1/2 flex items-center justify-center transition-transform group-hover:scale-105"
      style={{
        width: 84,
        height: 84,
        marginLeft: -42,
        marginTop: -42,
        borderRadius: 999,
        background: ds.orange,
        boxShadow: "0 16px 40px rgba(236,90,38,0.45)",
      }}
    >
      <Play size={32} style={{ stroke: "none", fill: "#fff", marginLeft: 4 }} />
    </span>
  );
}

// The waiting state: the real player's exact footprint, clearly marked as
// pending so nobody mistakes it for a broken embed.
function Placeholder() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6"
      style={{ background: "linear-gradient(150deg, #23264A 0%, #1C1E3D 55%, #14162B 100%)" }}
    >
      <div
        className="absolute inset-5 pointer-events-none"
        style={{ border: "2px dashed rgba(255,255,255,0.22)", borderRadius: 16 }}
      />
      <span
        className="flex items-center justify-center"
        style={{
          width: 84,
          height: 84,
          borderRadius: 999,
          background: "rgba(236,90,38,0.16)",
          border: "1px solid rgba(236,90,38,0.45)",
        }}
      >
        <Play size={30} style={{ stroke: "none", fill: ds.orange, marginLeft: 4 }} />
      </span>
      <p style={{ ...display, color: ds.white, fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}>
        Explainer video
      </p>
      <p style={{ ...sans, fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,255,255,0.62)", maxWidth: 360 }}>
        The 90-second film drops in here as an MP4. Placeholder holds its exact
        size and shape so nothing below shifts when it lands.
      </p>
    </div>
  );
}
