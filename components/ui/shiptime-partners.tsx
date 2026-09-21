import type React from "react";
import Image from "next/image";

// ── Partnerships + third-party ratings ────────────────────────────────────────
// The credibility shiptime.com leads on and these pages had none of. Two of the
// testimonials on shiptime.com's own homepage say the writer found ShipTime
// *through* one of these programmes ("through my Costco membership", "through
// their partnership with CFIB") — for a Canadian SMB audience this is a
// shortcut to trust, not decoration.
//
// Logos: same optional pattern as lib/competitors.ts — pass a path under
// /public/logos and it renders the mark, otherwise the name sets as a wordmark.
// No partner marks are in the repo yet, so the wordmark path is what ships.

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

export type Partner = { name: string; logo?: string; note?: string };

const PARTNERS: Partner[] = [
  { name: "Costco",  note: "Member shipping benefit" },
  { name: "CFIB",    note: "Canadian Federation of Independent Business" },
  { name: "CanGift", note: "Canadian Gift Association" },
];

/** Scores as published on shiptime.com. The platforms there are logo images,
 *  so the marks they belong to are NOT confirmed — pass `platform` once known. */
export type Rating = { score: string; count: string; platform?: string };

const RATINGS: Rating[] = [
  { score: "4.5", count: "900+ reviews" },
  { score: "4.8", count: "500+ reviews" },
];

function Stars({ score }: { score: string }) {
  const n = Math.round(parseFloat(score));
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={13} height={13} viewBox="0 0 24 24" fill={i < n ? ds.orange : "#DCD8D2"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function ShipTimePartners({
  partners = PARTNERS,
  ratings = RATINGS,
  background = ds.white,
}: {
  partners?: Partner[];
  ratings?: Rating[];
  background?: string;
}) {
  return (
    <section className="px-5 md:px-10 py-16 md:py-20" style={{ background }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div className="text-center mb-10 md:mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ ...sans, color: ds.orange }}>
            Partnerships that deliver
          </p>
          <h2 className="mx-auto" style={{ ...display, color: ds.navy, fontSize: "clamp(1.6rem, 3.8vw, 2.4rem)", maxWidth: 620 }}>
            Trusted by the groups your business already belongs to
          </h2>
          <p className="mt-4 mx-auto" style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: ds.muted, maxWidth: 500 }}>
            Members of Costco, CFIB and CanGift ship with ShipTime through their
            membership — often at rates they could not negotiate alone.
          </p>
        </div>

        {/* partner row */}
        <div className="flex flex-wrap items-stretch justify-center gap-3 md:gap-4">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center justify-center text-center px-7 py-6 flex-1"
              style={{ background: ds.white, border: `1px solid ${ds.border}`, borderRadius: 16, minWidth: 220, boxShadow: "0 2px 14px rgba(28,30,61,0.05)" }}
            >
              {p.logo ? (
                <Image src={p.logo} alt={p.name} width={140} height={38} className="h-7 w-auto object-contain" style={{ opacity: 0.85 }} />
              ) : (
                <span style={{ ...display, color: ds.navy, fontSize: "1.45rem" }}>{p.name}</span>
              )}
              {p.note && (
                <span className="mt-2 text-[12px] leading-snug" style={{ ...sans, color: ds.muted }}>{p.note}</span>
              )}
            </div>
          ))}
        </div>

        {/* ratings */}
        {ratings.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {ratings.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Stars score={r.score} />
                <span className="text-[15px] font-extrabold" style={{ ...sans, color: ds.navy }}>{r.score}</span>
                <span className="text-[13px]" style={{ ...sans, color: ds.muted }}>
                  {r.platform ? `on ${r.platform} · ${r.count}` : r.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
