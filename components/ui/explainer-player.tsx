"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Play } from "lucide-react";

// ── Explainer player ──────────────────────────────────────────────────────────
// The slot the 90-second Core explainer will occupy. Until that film renders,
// `src` is undefined and this draws a labelled placeholder at the exact size and
// shape the real player takes — so the page's rhythm is already correct and the
// film landing shifts nothing around it.
//
// With a src it is click-to-play, not autoplay: a poster under a play button,
// swapped for a real <video controls> on first click. Ninety seconds is a watch
// someone opts into, not something that should start under them.

const ds = {
  navy:   "#1C1E3D",
  orange: "#EC5A26",
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

export default function ExplainerPlayer({
  /** Path to the rendered MP4. Leave undefined to show the placeholder. */
  src,
  poster,
  label = "Explainer video",
  /** Shown in the placeholder under the label. */
  note = "The 90-second film drops in here as an MP4.",
  radius = 26,
}: {
  src?: string;
  poster?: string;
  label?: string;
  note?: string;
  radius?: number;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function start() {
    setPlaying(true);
    // The element mounts in this same commit; play on the next frame.
    requestAnimationFrame(() => videoRef.current?.play());
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: "16 / 9",
        borderRadius: radius,
        background: ds.navy,
        boxShadow: "0 50px 110px rgba(28,30,61,0.34)",
        border: "1px solid rgba(255,255,255,0.35)",
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
            aria-label={`Play: ${label}`}
          >
            {poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <span className="absolute inset-0" style={{ background: "rgba(28,30,61,0.28)" }} />
            <PlayBadge live />
          </button>
        )
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6"
          style={{ background: "linear-gradient(150deg, #23264A 0%, #1C1E3D 55%, #14162B 100%)" }}
        >
          <div
            className="absolute inset-5 pointer-events-none"
            style={{ border: "2px dashed rgba(255,255,255,0.22)", borderRadius: 16 }}
          />
          <PlayBadge />
          <p style={{ ...display, color: ds.white, fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}>{label}</p>
          <p style={{ ...sans, fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,255,255,0.62)", maxWidth: 380 }}>
            {note}
          </p>
        </div>
      )}
    </div>
  );
}

// `live` is the solid state used over a poster; the hollow one marks the wait.
function PlayBadge({ live = false }: { live?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center ${live ? "absolute left-1/2 top-1/2 transition-transform group-hover:scale-105" : ""}`}
      style={{
        width: 84,
        height: 84,
        ...(live ? { marginLeft: -42, marginTop: -42 } : {}),
        borderRadius: 999,
        background: live ? ds.orange : "rgba(236,90,38,0.16)",
        border: live ? "none" : "1px solid rgba(236,90,38,0.45)",
        boxShadow: live ? "0 16px 40px rgba(236,90,38,0.45)" : "none",
      }}
    >
      <Play size={live ? 32 : 30} style={{ stroke: "none", fill: live ? "#fff" : ds.orange, marginLeft: 4 }} />
    </span>
  );
}
