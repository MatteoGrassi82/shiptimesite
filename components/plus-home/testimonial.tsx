"use client";

import { useRef } from "react";
import { type Variants } from "motion/react";
import { Play } from "lucide-react";
import { TimelineContent } from "./timeline-animation";

/* ── Proof bento — two clusters, placements matched to the Federato reference ──
   ShipTime palette: navy tiles, orange accents, warm light quote cards, orange
   duotone portraits, orange/cream geometric decor motifs. TimelineContent
   forwards className only (bg via classes). Quotes/name/company are placeholders;
   the video thumbnail + one portrait use the provided images, extras are reused. */

const ORANGE = "#EC5A26";
const CREAM = "#F7EFE0";
const FAINT = "rgba(255,255,255,0.45)";
const WHITE_DIM = "rgba(255,255,255,0.72)";
const INK = "#1C1E3D";
const SUB = "#6E728A";

const SCREENSHOT = "https://cdn.prod.website-files.com/68d409d44c688815ba593b39/68da895dbf8aae503335f72a_Screenshot%202025-09-09%20at%201.06.28%E2%80%AFPM%201.avif";
const ROB = "https://cdn.prod.website-files.com/68d409d44c688815ba593b39/69d6836ea4fef6ae2d0b278d_Rob%20Harden.webp";
const VID2 = "https://cdn.prod.website-files.com/68d409d44c688815ba593b39/68da895ed9686423b9592071_Screenshot%202025-09-15%20at%203.18.31%E2%80%AFPM.avif";
const VID3 = "https://cdn.prod.website-files.com/68d409d44c688815ba593b39/68da895d734fdf3aef2dcaeb_Screenshot%202025-09-15%20at%203.22.56%E2%80%AFPM.avif";
const VID4 = "https://cdn.prod.website-files.com/68d409d44c688815ba593b39/68da895d1a09fc0b7ca96b0f_Screenshot%202025-09-15%20at%203.21.46%E2%80%AFPM.avif";

const revealVariants: Variants = {
  visible: (i: number) => ({ y: 0, opacity: 1, filter: "blur(0px)", transition: { delay: (i % 6) * 0.06, duration: 0.5 } }),
  hidden: { filter: "blur(10px)", y: -18, opacity: 0 },
};

/* ── decorative geometric motifs (orange + cream, on navy) ── */
function GeoDecor({ variant }: { variant: "bar" | "squares" | "circle" | "rects" }) {
  const dash = { stroke: FAINT, strokeWidth: 1.3, strokeDasharray: "2 6", fill: "none" as const };
  if (variant === "bar")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <rect x="10" y="8" width="15" height="72" rx="4" fill={ORANGE} />
        <line x1="25" y1="40" x2="140" y2="40" {...dash} />
        <circle cx="140" cy="40" r="4" fill={ORANGE} />
        <rect x="120" y="6" width="44" height="70" rx="6" fill="none" stroke={FAINT} strokeWidth="1" />
      </svg>
    );
  if (variant === "squares")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <path d="M60 78 L150 10" {...dash} />
        <rect x="104" y="8" width="52" height="52" rx="7" fill={ORANGE} />
        <rect x="74" y="34" width="38" height="38" rx="6" fill={CREAM} />
        <circle cx="150" cy="10" r="4" fill={ORANGE} />
      </svg>
    );
  if (variant === "circle")
    return (
      <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <circle cx="52" cy="44" r="34" fill={ORANGE} />
        <circle cx="66" cy="44" r="20" fill={CREAM} />
        <circle cx="18" cy="70" r="3.5" fill={ORANGE} />
        <circle cx="18" cy="18" r="3.5" fill={ORANGE} />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 88" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect x="30" y="6" width="120" height="74" rx="6" fill="none" stroke={FAINT} strokeWidth="1" />
      <rect x="108" y="12" width="30" height="62" rx="5" fill={ORANGE} />
      <rect x="86" y="24" width="26" height="50" rx="4" fill={CREAM} />
      <line x1="40" y1="68" x2="150" y2="10" {...dash} />
      <circle cx="150" cy="10" r="4" fill={ORANGE} />
    </svg>
  );
}

function Gauge() {
  return (
    <svg viewBox="0 0 120 120" width="84" height="84" aria-hidden>
      <circle cx="60" cy="60" r="46" fill="none" stroke={FAINT} strokeWidth="1.4" />
      <path d="M60 14 A46 46 0 0 1 88 26" fill="none" stroke={ORANGE} strokeWidth="7" strokeLinecap="round" />
      <circle cx="60" cy="14" r="3.5" fill={ORANGE} />
      <circle cx="60" cy="60" r="34" fill="none" stroke={FAINT} strokeWidth="1.2" strokeDasharray="1.5 5" />
      <circle cx="30" cy="72" r="3" fill={ORANGE} />
    </svg>
  );
}

function Stat({ v, suf, label }: { v: string; suf: string; label: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-5xl leading-none text-white md:text-6xl">{v}</span>
        <span className="font-serif text-3xl" style={{ color: ORANGE }}>{suf}</span>
      </div>
      <p className="mt-2 text-sm leading-snug" style={{ color: WHITE_DIM }}>{label}</p>
    </div>
  );
}

function Duotone({ src }: { src: string | null }) {
  return (
    <div className="relative h-[92px] w-[80px] shrink-0 overflow-hidden rounded-lg" style={{ background: ORANGE }}>
      {src ? (
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "grayscale(1) contrast(1.1)", mixBlendMode: "multiply" }} />
      ) : (
        <svg viewBox="0 0 80 92" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle cx="40" cy="34" r="17" fill="#B8431A" />
          <path d="M10 92 C10 66 24 55 40 55 C56 55 70 66 70 92 Z" fill="#B8431A" />
        </svg>
      )}
    </div>
  );
}

type Tile =
  | { k: "statDecor"; span: string; bg: string; decor: "bar" | "squares" | "circle" | "rects"; v: string; suf: string; label: React.ReactNode }
  | { k: "gauge"; span: string; bg: string; v: string; suf: string; label: React.ReactNode }
  | { k: "video"; span: string; caption: string; img: string }
  | { k: "quote"; span: string; company: string; quote: string; name: string; role: string; img: string | null }
  | { k: "label"; span: string; text: string }
  | { k: "empty"; span: string };

const NAVY = "bg-[#1C1E3D]";
const NAVY2 = "bg-[#111327]";

const TILES: Tile[] = [
  // ── cluster 1 ──
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "bar", v: "90", suf: "%", label: <>fewer tools<br />to run</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "Customer story", img: SCREENSHOT },
  { k: "quote", span: "col-span-2 lg:col-span-6 lg:row-span-2", company: "Northwind Goods", name: "Rob Harden", role: "President & Head of Operations", img: ROB,
    quote: "Our biggest leak was quietly overpaying every carrier. ShipTime Plus shops UPS, FedEx, and Purolator on every order, prints the cheapest qualified label in one click, and the audit claws back the surcharges we used to eat — further extending our margin while building trust with our carriers, customers, and partners." },
  { k: "label", span: "col-span-1 lg:col-span-3", text: "Results" },
  { k: "gauge", span: "col-span-1 lg:col-span-3", bg: NAVY2, v: "89", suf: "%", label: <>less time to a<br />booked label</> },
  // ── cluster 2 ──
  { k: "quote", span: "col-span-2 lg:col-span-6 lg:row-span-2", company: "Cedar & Co", name: "Priya Nair", role: "VP Operations, Cedar & Co", img: null,
    quote: "Prior to ShipTime Plus, we ran nine different tools across quoting, labels, tracking, and reconciliation. We've consolidated that down to one — and every order now routes to the cheapest carrier automatically, no contract, no lock-in." },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "Inside the platform", img: VID2 },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "squares", v: "3", suf: "x", label: <>faster to a<br />booked label</> },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY2, decor: "squares", v: "30", suf: "%", label: <>fewer support<br />tickets</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "A founder's take", img: VID3 },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY, decor: "circle", v: "2", suf: "x", label: <>the volume,<br />same headcount</> },
  { k: "video", span: "col-span-1 lg:col-span-3", caption: "From the warehouse", img: VID4 },
  { k: "empty", span: "col-span-1 lg:col-span-3" },
  { k: "statDecor", span: "col-span-1 lg:col-span-3", bg: NAVY2, decor: "rects", v: "11", suf: "%", label: <>more margin<br />recovered</> },
];

function Cell({ t, i, timelineRef }: { t: Tile; i: number; timelineRef: React.RefObject<HTMLElement | null> }) {
  const tc = (cls: string) => ({ animationNum: i, customVariants: revealVariants, timelineRef, className: `overflow-hidden rounded-2xl ${cls}` });

  if (t.k === "statDecor")
    return (
      <TimelineContent {...tc(`${t.span} ${t.bg} flex flex-col p-6`)}>
        <div className="min-h-0 flex-1"><GeoDecor variant={t.decor} /></div>
        <Stat v={t.v} suf={t.suf} label={t.label} />
      </TimelineContent>
    );
  if (t.k === "gauge")
    return (
      <TimelineContent {...tc(`${t.span} ${t.bg} flex flex-col justify-between p-6`)}>
        <Gauge />
        <Stat v={t.v} suf={t.suf} label={t.label} />
      </TimelineContent>
    );
  if (t.k === "video")
    return (
      <TimelineContent {...tc(`${t.span} relative`)}>
        <img src={t.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#1C1E3D]/30" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-800">
          <Play className="size-3 fill-current" /> Play video
        </div>
        <span className="absolute bottom-5 left-5 text-sm font-medium text-white">{t.caption}</span>
      </TimelineContent>
    );
  if (t.k === "quote")
    return (
      <TimelineContent {...tc(`${t.span} flex flex-col justify-between p-8 bg-[#FFF4EF]`)}>
        <div>
          <div className="font-serif text-2xl leading-none" style={{ color: INK }}>{t.company}</div>
          <p className="mt-7 text-[17px] leading-relaxed md:text-lg" style={{ color: INK }}>&ldquo;{t.quote}&rdquo;</p>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <Duotone src={t.img} />
          <div>
            <div className="text-sm font-semibold" style={{ color: INK }}>{t.name}</div>
            <div className="text-[13px]" style={{ color: SUB }}>{t.role}</div>
          </div>
        </div>
      </TimelineContent>
    );
  if (t.k === "label")
    return (
      <TimelineContent {...tc(`${t.span} ${NAVY} flex items-center p-6`)}>
        <span className="text-5xl font-bold uppercase tracking-tight text-white md:text-6xl" style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}>{t.text}</span>
      </TimelineContent>
    );
  return <TimelineContent {...tc(`${t.span} ${NAVY}`)}><span /></TimelineContent>;
}

export function ClientFeedback() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const tc = (n: number, cls: string, as: "h2" | "p") => ({ animationNum: n, customVariants: revealVariants, timelineRef, className: cls, as });
  return (
    <section ref={timelineRef} className="w-full bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <TimelineContent {...tc(0, "font-serif text-4xl text-foreground md:text-5xl", "h2")}>
            Proven by the teams shipping <span className="italic">at scale</span>
          </TimelineContent>
          <TimelineContent {...tc(1, "mx-auto text-lg leading-relaxed text-slate-600", "p")}>
            Real outcomes, in the words of the operators and founders running ShipTime Plus.
          </TimelineContent>
        </div>

        <div className="grid grid-cols-2 gap-3 auto-rows-[minmax(215px,1fr)] lg:grid-cols-12">
          {TILES.map((t, i) => (
            <Cell key={i} t={t} i={i} timelineRef={timelineRef} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientFeedback;
