import Image from "next/image";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";

const ds = {
  navy: "#1C1E3D",
  muted: "#52566C",
  orange: "#EC5A26",
  red: "#D9534F",
  redSoft: "#FBE3E0",
  highlight: "#FFF6F2",
  surface: "#F8FAFB",
  border: "#E8E8E8",
  white: "#FFFFFF",
};

const sora = { fontFamily: "var(--font-manrope), sans-serif" };
const inter = { fontFamily: "var(--font-inter), sans-serif" };

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill={ds.orange} />
      <path d="M5.5 10l2.8 2.8L14.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIconGray() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#DDE1EA" />
      <path d="M5.5 10l2.8 2.8L14.5 6.5" stroke="#6B7086" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill={ds.redSoft} />
      <path d="M6.8 6.8l6.4 6.4M13.2 6.8l-6.4 6.4" stroke={ds.red} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export type MultiCompareRow = {
  feature: string;
  shiptime: string;
  shiptimeWin?: boolean;
  freightcom: string;
  freightcomWin?: boolean;
  eshipper: string;
  eshipperWin?: boolean;
  shipstation: string;
  shipstationWin?: boolean;
};

export type MultiCompareCompetitor = {
  key: "freightcom" | "eshipper" | "shipstation";
  name: string;
  price: string;
  logo?: string;
};

const noSet = new Set(["no", "not supported", "none", "no."]);
const yesSet = new Set(["yes", "yes.", "none"]);

function Cell({
  value,
  win,
  spotlight,
}: {
  value: string;
  win?: boolean;
  spotlight?: boolean;
}) {
  const norm = value.toLowerCase().trim();
  const isWin = !!win || yesSet.has(norm);
  const isNo = noSet.has(norm);
  const text = !yesSet.has(norm) && !noSet.has(norm) ? value : null;

  return (
    <div
      className="py-3.5 px-2 flex flex-col items-center justify-center gap-1"
      style={{ background: spotlight ? ds.highlight : "transparent", borderLeft: `1px solid ${ds.border}` }}
    >
      {isNo ? <CrossIcon /> : isWin ? (spotlight ? <CheckIcon /> : <CheckIconGray />) : <CrossIcon />}
      {text && (
        <span
          style={{ ...inter, fontSize: 10.5, color: spotlight ? ds.orange : ds.muted, fontWeight: spotlight ? 700 : 500, textAlign: "center", lineHeight: 1.3 }}
        >
          {text}
        </span>
      )}
    </div>
  );
}

// Four-way comparison table (ShipTime + all three competitors on one screen).
// Rows are a curated, cross-checked subset of the per-competitor data in
// lib/competitors.ts — every cell here has a matching claim on that
// competitor's own /vs page, so nothing is asserted here that isn't already
// backed up one click away.
export function MultiCompareTable({
  rows,
  competitors,
  ctaSource = "compare-table",
}: {
  rows: MultiCompareRow[];
  competitors: MultiCompareCompetitor[];
  ctaSource?: string;
}) {
  const COLS = "minmax(150px,1.6fr) repeat(4, minmax(78px, 1fr))";

  return (
    <div
      className="overflow-x-auto"
      style={{ borderRadius: 16, border: `1px solid ${ds.border}`, background: ds.white, boxShadow: "0 8px 30px rgba(28,30,61,0.08)" }}
    >
      <div style={{ minWidth: 640 }}>
        {/* Header */}
        <div className="grid" style={{ gridTemplateColumns: COLS, background: ds.white, borderBottom: `1px solid ${ds.border}` }}>
          <div className="px-4 md:px-6 py-4" />
          <div className="py-4 flex flex-col items-center gap-1" style={{ background: ds.highlight, borderLeft: `1px solid ${ds.border}` }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: ds.orange, color: ds.white, ...sora }}>
              ShipTime
            </span>
            <span className="text-[10px]" style={{ color: ds.orange, ...inter, fontWeight: 700 }}>Free forever</span>
          </div>
          {competitors.map((c) => (
            <div key={c.key} className="py-4 flex flex-col items-center justify-center gap-1" style={{ borderLeft: `1px solid ${ds.border}` }}>
              {c.logo ? (
                <Image src={c.logo} alt={c.name} width={90} height={22} className="h-3.5 w-auto object-contain" style={{ maxWidth: "88%", opacity: 0.7 }} />
              ) : (
                <span className="text-[10.5px] font-semibold text-center px-1" style={{ color: ds.muted, ...sora }}>{c.name}</span>
              )}
              <span className="text-[9.5px] text-center px-1" style={{ color: ds.muted, ...inter }}>{c.price}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <div key={row.feature} className="grid items-center" style={{ gridTemplateColumns: COLS, borderTop: `1px solid ${ds.border}`, background: ds.white }}>
            <div className="px-4 md:px-6 py-3.5">
              <span style={{ ...inter, fontSize: 13, color: ds.navy, fontWeight: 500 }}>{row.feature}</span>
            </div>
            <Cell value={row.shiptime} win={row.shiptimeWin} spotlight />
            <Cell value={row.freightcom} win={row.freightcomWin} />
            <Cell value={row.eshipper} win={row.eshipperWin} />
            <Cell value={row.shipstation} win={row.shipstationWin} />
          </div>
        ))}

        {/* Footer CTA */}
        <div className="grid items-center" style={{ gridTemplateColumns: COLS, borderTop: `1px solid ${ds.border}`, background: ds.white }}>
          <div className="px-4 md:px-6 py-4">
            <span style={{ ...sora, fontSize: 12.5, fontWeight: 700, color: ds.navy }}>Ready to switch?</span>
          </div>
          <div className="py-4 flex justify-center" style={{ background: ds.highlight, borderLeft: `1px solid ${ds.border}` }}>
            <LeadCaptureButton source={ctaSource} className="text-white text-[11px] font-semibold px-3.5 py-2 transition-opacity hover:opacity-90 whitespace-nowrap" style={{ background: ds.orange, borderRadius: 999, ...sora }}>
              Get in touch
            </LeadCaptureButton>
          </div>
          <div className="py-4" style={{ borderLeft: `1px solid ${ds.border}` }} />
          <div className="py-4" style={{ borderLeft: `1px solid ${ds.border}` }} />
          <div className="py-4" style={{ borderLeft: `1px solid ${ds.border}` }} />
        </div>
      </div>
    </div>
  );
}
