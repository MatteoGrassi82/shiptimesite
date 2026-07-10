"use client";

// Live preview of the three ShipTime Plus films, playing the real Remotion
// compositions via @remotion/player (no MP4 render needed). Used both on the
// home index (top) and the dedicated /plus-films route.

import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { ShipAuditFilm } from "@/remotion/plus/ShipAuditFilm";
import { CrossBorderFilm } from "@/remotion/plus/CrossBorderFilm";
import { SmartRoutingFilm } from "@/remotion/plus/SmartRoutingFilm";

const ds = {
  bg: "#0A0C0D",
  frame: "#111517",
  line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.14)",
  text: "#F2F6F5",
  muted: "#8C9699",
  muted2: "#596366",
  teal: "#33A89C",
};
const font = 'var(--font-inter), "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';
const mono = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

type FilmDef = {
  key: string;
  comp: React.FC;
  dur: number;
  role: string;
  title: string;
  beats: string[];
};

const FILMS: FilmDef[] = [
  {
    key: "audit",
    comp: ShipAuditFilm,
    dur: 240,
    role: "Film 01 · carriers & cost",
    title: "Best rate in, overcharges out",
    beats: [
      "A scan line sweeps the carrier invoice ledger.",
      "Two lines flag with the exact reason.",
      "Recovered climbs to $1,240 — best rate + audit.",
    ],
  },
  {
    key: "border",
    comp: CrossBorderFilm,
    dur: 270,
    role: "Film 02 · the reach",
    title: "One account, every border",
    beats: [
      "The globe turns; lanes arc between countries.",
      "Duty and tax resolve into a landed cost up front.",
      "220+ countries, parcel + freight, one report.",
    ],
  },
  {
    key: "routing",
    comp: SmartRoutingFilm,
    dur: 270,
    role: "Film 03 · operations · new flowchart style",
    title: "It routes itself",
    beats: [
      "Orders flow into the routing rules.",
      "Each auto-routes to the right carrier, then a label.",
      "One exception peels off to your account lead.",
    ],
  },
];

const CAPS: { name: string; on: boolean }[] = [
  { name: "ShipAudit", on: true },
  { name: "Cross-border", on: true },
  { name: "Smart routing", on: true },
];

function FilmCard({ film }: { film: FilmDef }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <figure style={{ margin: 0 }}>
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${ds.line2}`, background: ds.frame, aspectRatio: "4 / 5" }}>
        {mounted ? (
          <Player
            component={film.comp}
            durationInFrames={film.dur}
            compositionWidth={1080}
            compositionHeight={1350}
            fps={30}
            loop
            autoPlay
            controls
            style={{ width: "100%", height: "100%" }}
          />
        ) : null}
      </div>
      <figcaption style={{ padding: "20px 4px 0" }}>
        <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: ds.teal, marginBottom: 8 }}>{film.role}</div>
        <h3 style={{ fontFamily: font, fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", margin: "0 0 14px", color: ds.text }}>{film.title}</h3>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
          {film.beats.map((b, i) => (
            <li key={i} style={{ display: "flex", gap: 11, fontSize: 13.5, color: ds.muted, lineHeight: 1.45 }}>
              <span style={{ fontFamily: mono, fontSize: 11, color: ds.teal, width: 16, flex: "none", paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{b}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

export default function PlusFilmsPreview() {
  return (
    <section style={{ background: `radial-gradient(900px 500px at 85% -10%, rgba(51,168,156,0.10), transparent 60%), ${ds.bg}`, color: ds.text, fontFamily: font }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 56px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: ds.teal, boxShadow: `0 0 14px ${ds.teal}` }} />
          <b style={{ fontFamily: font, fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>ShipTime</b>
        </div>

        <p style={{ fontFamily: mono, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: ds.teal, margin: "0 0 18px" }}>
          Plus · video direction · dev preview
        </p>
        <h1 style={{ fontFamily: font, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.02, fontSize: "clamp(2.2rem, 5.4vw, 3.6rem)", margin: "0 0 18px", maxWidth: "15ch" }}>
          Three films for the <span style={{ color: ds.teal }}>network</span> story.
        </h1>
        <p style={{ fontSize: "clamp(1rem, 1.6vw, 1.12rem)", color: ds.muted, maxWidth: "62ch", margin: 0 }}>
          Live Remotion comps, 1080&times;1350. Three workflows — the carrier, reach, and operations layers a brand plugs into instead of building. Film 03 is the new flowchart style.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center", margin: "30px 0 2px" }}>
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: ds.muted2, marginRight: 6 }}>3 workflows · done for you</span>
          {CAPS.map((c) => (
            <span
              key={c.name}
              style={{
                fontFamily: font,
                fontSize: 13,
                fontWeight: c.on ? 700 : 500,
                padding: "7px 13px",
                borderRadius: 999,
                border: `1px solid ${c.on ? ds.teal : ds.line}`,
                color: c.on ? "#04110F" : ds.muted,
                background: c.on ? ds.teal : "transparent",
                whiteSpace: "nowrap",
              }}
            >
              {c.name}
            </span>
          ))}
        </div>

        <div className="films-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 42 }}>
          {FILMS.map((f) => (
            <FilmCard key={f.key} film={f} />
          ))}
        </div>

        <p style={{ marginTop: 48, paddingTop: 22, borderTop: `1px solid ${ds.line}`, color: ds.muted2, fontSize: 12.5, fontFamily: mono, letterSpacing: "0.02em" }}>
          Live dev preview · hover a film for scrub controls · Film 03 is the new flowchart style — 01 & 02 convert next if this lands.
        </p>
      </div>

      <style>{`@media (max-width: 940px){ .films-grid{ grid-template-columns: 1fr !important; max-width: 460px; margin-left: auto; margin-right: auto; } }`}</style>
    </section>
  );
}
