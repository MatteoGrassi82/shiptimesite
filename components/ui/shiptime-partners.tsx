"use client";

import type React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import FloatProp from "@/components/ui/float-prop";

// ── Partnerships + third-party ratings ────────────────────────────────────────
// Two testimonials on shiptime.com's own homepage say the writer found ShipTime
// *through* one of these programmes — "through my Costco membership", "through
// their partnership with CFIB". That makes this an acquisition channel, not a
// logo wall, so it gets the page's card language rather than a plain strip:
// beige tiles carrying a membership-card object, props breaking the edges.
//
// Logos use the same optional pattern as lib/competitors.ts — a path under
// /public/logos renders the mark, otherwise the name sets as an Anton wordmark.
// No partner marks are in the repo, so the wordmark path is what ships.

const ds = {
  navy:   "#1C1E3D",
  body:   "#4B4F66",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  white:  "#FFFFFF",
  field:  "#ECEAE7",
};

const CARD_BG = "linear-gradient(180deg, #E8E2DA 0%, #DBD3C8 100%)";

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
  color: ds.navy,
};

export type Partner = { name: string; logo?: string; note?: string; tint: string };

const PARTNERS: Partner[] = [
  { name: "Costco",  note: "Member shipping benefit",                    tint: "#E3EEFC" },
  { name: "CFIB",    note: "Canadian Federation of Independent Business", tint: "#FAF0EB" },
  { name: "CanGift", note: "Canadian Gift Association",                   tint: "#E7F0E6" },
];

/** Scores as published on shiptime.com. The platforms there are logo images, so
 *  which marks they belong to is NOT confirmed — pass `platform` once known. */
export type Rating = { score: string; count: string; platform?: string };

const RATINGS: Rating[] = [
  { score: "4.5", count: "900+ reviews" },
  { score: "4.8", count: "500+ reviews" },
];

// A membership card — the object the partnership actually puts in someone's
// wallet, which is what makes the tile read as a benefit rather than a badge.
function MemberCard({ name, tint }: { name: string; tint: string }) {
  return (
    <div
      className="relative flex flex-col justify-between p-5"
      style={{
        width: 236, height: 148, borderRadius: 18,
        transform: "rotate(-5deg)",
        background: `linear-gradient(140deg, ${tint} 0%, #FFFFFF 78%)`,
        boxShadow: "0 24px 46px rgba(28,30,61,0.20)",
        border: "1px solid rgba(255,255,255,0.7)",
      }}
    >
      <div className="flex items-start justify-between">
        <span style={{ ...display, fontSize: "1.3rem" }}>{name}</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ ...sans, color: ds.muted }}>Member</span>
      </div>
      <div>
        <div className="flex gap-1 mb-2.5" aria-hidden>
          {[26, 18, 22, 14].map((w, i) => (
            <span key={i} className="h-1.5 rounded-full" style={{ width: w, background: "rgba(28,30,61,0.16)" }} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold" style={{ ...sans, color: ds.navy }}>Shipping benefit</span>
          <span className="text-[11px] font-extrabold" style={{ ...sans, color: ds.orange }}>Active</span>
        </div>
      </div>
    </div>
  );
}

function Stars({ score }: { score: string }) {
  const n = Math.round(parseFloat(score));
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} style={{ fill: i < n ? ds.orange : "#D8D3CC", stroke: "none" }} />
      ))}
    </span>
  );
}

export default function ShipTimePartners({
  partners = PARTNERS,
  ratings = RATINGS,
  background = ds.field,
}: {
  partners?: Partner[];
  ratings?: Rating[];
  background?: string;
}) {
  return (
    <section className="relative overflow-hidden px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div className="relative" style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Reveal className="text-center mb-12 md:mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ ...sans, color: ds.orange }}>
            Partnerships that deliver
          </p>
          <h2 className="mx-auto" style={{ ...display, fontSize: "clamp(1.9rem, 4.6vw, 3rem)", maxWidth: 660 }}>
            Trusted by the groups you already belong to
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.6, color: ds.body, maxWidth: 500 }}>
            Costco, CFIB and CanGift members ship with ShipTime through their
            membership — often at rates they could never negotiate alone.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {partners.map((p) => (
            <div
              key={p.name}
              className="relative flex flex-col overflow-hidden p-7 md:p-8"
              style={{ background: CARD_BG, borderRadius: 28, minHeight: 330 }}
            >
              <div className="relative z-10">
                {p.logo ? (
                  <Image src={p.logo} alt={p.name} width={150} height={40} className="h-8 w-auto object-contain" />
                ) : (
                  <h3 style={{ ...display, fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)" }}>{p.name}</h3>
                )}
                {p.note && (
                  <p className="mt-1.5" style={{ ...sans, fontSize: 14.5, color: "rgba(28,30,61,0.62)" }}>{p.note}</p>
                )}
              </div>
              <div className="flex-1 flex items-center justify-center pt-6">
                <MemberCard name={p.name} tint={p.tint} />
              </div>
            </div>
          ))}
        </div>

        {ratings.length > 0 && (
          <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {ratings.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-5 py-3"
                style={{ background: ds.white, borderRadius: 999, border: `1px solid ${ds.border}`, boxShadow: "0 6px 20px rgba(28,30,61,0.07)" }}
              >
                <Stars score={r.score} />
                <span className="text-[15px] font-extrabold" style={{ ...sans, color: ds.navy }}>{r.score}</span>
                <span className="text-[13px]" style={{ ...sans, color: ds.muted }}>
                  {r.platform ? `on ${r.platform} · ${r.count}` : r.count}
                </span>
              </div>
            ))}
          </Reveal>
        )}
      </div>

      <FloatProp prop="label" size={96} rotate={-15} style={{ right: "-1%", top: "10%" }} />
      <FloatProp prop="coin" size={60} rotate={18} style={{ left: "3%", bottom: "9%" }} />
    </section>
  );
}
