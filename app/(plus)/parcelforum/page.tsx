import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Cpu,
  Gauge,
  LayoutGrid,
  Network,
  Package,
  RotateCcw,
  Route,
  ShieldCheck,
  Tags,
  Truck,
  UserCheck,
  Warehouse,
} from "lucide-react";
import { LpsShiplet } from "@/components/sections/lps-shiplet";
import { Reveal } from "@/components/ui/reveal";
import DotPattern from "@/components/ui/dot-pattern-1";

// ── /parcelforum — the booth QR target ───────────────────────────────────────
// The banner says "Scan To Learn More", so this page's first job is to explain
// ShipTime; the assessment is the offer at the end, not the headline. That
// inversion is Michael's review of 2026-09-10 and it drives the whole order
// below: problem → who → solution → what we do → proof → people → offer → talk.
//
// Continuity with the printed banner (DO-76059 proof, approved for print):
//  · ground blue #07225B and orange #E55021, both sampled from the final PNG
//  · Anton for headlines — the same heavy condensed uppercase as the banner
//  · the banner's own words reused verbatim: "LOGISTICS. DESIGNED FOR GROWTH.",
//    the three outcomes (Lower Costs / Improved Efficiency / Better Customer
//    Experience) and the five capability labels along its bottom edge
//  · the ShipTime logo top-left, as on the banner
//
// Name: the company is ShipTime One (Matteo, 2026-09-10). The banner still
// reads "ShipTime", so the logo stays as printed and "One" is introduced in the
// copy with Michael's gloss: one distributed network, one system, one point of
// responsibility.
//
// Deliberately absent, all per the same review: any "before the show" wording
// (nobody sees this page before they scan), the assessment's scoring weights,
// the "find us" event card, a footer nav, blog/network links, and any link back
// to the Core site. Two proof cases, both from Michael's own notes and both
// anonymized pending permission — no invented customers, and no figure that
// isn't his.
//
// Report delivery: score on screen, written read by email within the hour
// (2026-08-20 call, reaffirmed the 24th) — hence reportDelivery="email".

export const metadata: Metadata = {
  title: "ShipTime One | Logistics. Designed for Growth. | Parcel Forum '26",
  description:
    "One distributed network, one system, one point of responsibility. ShipTime One designs and runs logistics for progressive businesses that expect more from it: lower costs, improved efficiency, better customer experience.",
  robots: "noindex",
};

// Straight to HubSpot scheduling; the booking page only if the env is unset.
// Michael, 2026-09-14. The show is running, so this is a "come find us" fact,
// not the "before the show" framing he asked us to drop.
const BOOTH = "641";

const BOOK_HREF =
  process.env.NEXT_PUBLIC_PLUS_CALENDAR_URL ||
  process.env.NEXT_PUBLIC_LEAD_CALENDAR_URL ||
  "/plus/book-a-call";
const bookProps = BOOK_HREF.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

// ── banner-matched system ────────────────────────────────────────────────────
const PF = {
  blue: "#07225B",
  blueDeep: "#03153C",
  orange: "#E55021",
  orangeTint: "#FCEAE3",
  paper: "#F7F8FB",
  card: "#FFFFFF",
  line: "#E1E5EE",
  ink: "#0B1B45",
  sub: "#4A5470",
  faint: "#8B94AD",
  onBlue: "#FFFFFF",
  onBlueDim: "rgba(255,255,255,0.74)",
  blueLine: "rgba(255,255,255,0.14)",
};

const display: CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
};
const body: CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const container: CSSProperties = { maxWidth: 1220, margin: "0 auto", padding: "clamp(64px, 8vw, 128px) clamp(22px, 4vw, 56px)" };

function Kicker({ children, onBlue = false }: { children: ReactNode; onBlue?: boolean }) {
  return (
    <p style={{ ...body, display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: onBlue ? PF.onBlueDim : PF.sub, margin: 0 }}>
      <span style={{ width: 7, height: 7, background: PF.orange, flex: "none" }} />
      {children}
    </p>
  );
}

function H2({ children, onBlue = false, size = "clamp(2.2rem, 4.6vw, 3.6rem)" }: { children: ReactNode; onBlue?: boolean; size?: string }) {
  return <h2 style={{ ...display, fontSize: size, color: onBlue ? PF.onBlue : PF.ink, margin: "18px 0 0" }}>{children}</h2>;
}

// ── Case study ────────────────────────────────────────────────────────────────
// Both proof sections share this anatomy so they read as two entries in one
// series rather than two separate claims: a numbered header, the client facts
// as chips, the story in labelled rows (situation, what we designed, where it
// landed), the headline figure, three result cards and the anonymization note.
// Media sits opposite the copy and swaps sides between entries.
type CaseStudyProps = {
  id: string;
  n: string;
  deep?: boolean;
  mediaSide?: "left" | "right";
  chips: string[];
  title: ReactNode;
  rows: [label: string, text: ReactNode][];
  figure: ReactNode;
  cards: [value: string, label: string][];
  note: ReactNode;
  media: ReactNode;
};

function CaseStudy({ id, n, deep = false, mediaSide = "left", chips, title, rows, figure, cards, note, media }: CaseStudyProps) {
  const copy = (
    <div>
      <Kicker onBlue>Case study {n}</Kicker>
      <H2 onBlue size="clamp(2rem, 3.8vw, 3rem)">{title}</H2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {chips.map((c) => (
          <span key={c} style={{ ...body, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.02em", color: "rgba(255,255,255,0.86)", border: `1px solid ${PF.blueLine}`, background: "rgba(255,255,255,0.06)", borderRadius: 999, padding: "5px 11px" }}>
            {c}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 26 }}>
        {rows.map(([l, t], i) => (
          <div key={l} className="pf-cs-row" style={{ display: "grid", gridTemplateColumns: "132px minmax(0, 1fr)", gap: 18, padding: "15px 0", borderTop: i === 0 ? `1px solid ${PF.blueLine}` : undefined, borderBottom: `1px solid ${PF.blueLine}` }}>
            <div style={{ ...body, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PF.orange, paddingTop: 4 }}>{l}</div>
            <p style={{ ...body, fontSize: 15, lineHeight: 1.62, color: "rgba(255,255,255,0.84)", margin: 0 }}>{t}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26 }}>{figure}</div>
      <div className="pf-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
        {cards.map(([v, l]) => (
          <div key={l} style={{ borderRadius: 14, border: `1px solid ${PF.blueLine}`, background: "rgba(255,255,255,0.05)", padding: "16px 16px 18px" }}>
            <div style={{ ...display, fontSize: "clamp(1.3rem, 2vw, 1.7rem)", color: "#fff" }}>{v}</div>
            <div style={{ ...body, fontSize: 12.5, lineHeight: 1.5, color: PF.onBlueDim, marginTop: 5 }}>{l}</div>
          </div>
        ))}
      </div>
      <p style={{ ...body, fontSize: 12.5, color: "rgba(255,255,255,0.5)", margin: "18px 0 0" }}>{note}</p>
    </div>
  );
  const glow = mediaSide === "left"
    ? { right: -200, top: -220, background: "radial-gradient(closest-side, rgba(229,80,33,0.36), transparent 72%)" }
    : { left: -220, bottom: -240, background: "radial-gradient(closest-side, rgba(229,80,33,0.22), transparent 72%)" };
  return (
    <section id={id} style={{ position: "relative", overflow: "hidden", background: deep ? PF.blueDeep : PF.blue }}>
      <div aria-hidden style={{ position: "absolute", width: 620, height: 620, borderRadius: "50%", ...glow }} />
      <div style={{ ...container, position: "relative" }}>
        <div className="pf-split" style={{ display: "grid", gridTemplateColumns: mediaSide === "left" ? "0.85fr 1.15fr" : "1.15fr 0.85fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "center" }}>
          {mediaSide === "left" ? media : copy}
          {mediaSide === "left" ? copy : media}
        </div>
      </div>
    </section>
  );
}

function Lead({ children, onBlue = false }: { children: ReactNode; onBlue?: boolean }) {
  return (
    <p style={{ ...body, fontSize: "clamp(1.02rem, 1.4vw, 1.18rem)", fontWeight: 500, lineHeight: 1.62, color: onBlue ? PF.onBlueDim : PF.sub, margin: "16px 0 0", maxWidth: "58ch" }}>
      {children}
    </p>
  );
}

const btnBase: CSSProperties = { ...body, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, padding: "14px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none" };
const btnPrimary: CSSProperties = { ...btnBase, background: PF.orange, color: "#fff" };
const btnOnBlue: CSSProperties = { ...btnBase, border: `1px solid ${PF.blueLine}`, background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 600 };
const btnOnLight: CSSProperties = { ...btnBase, border: `1px solid ${PF.line}`, background: PF.card, color: PF.ink, fontWeight: 600 };

// ── content (sourced) ────────────────────────────────────────────────────────
// Banner, bottom edge, verbatim.
const CAPABILITIES = [
  { icon: Package, t: "Parcel & Freight" },
  { icon: Truck, t: "Multi Carrier" },
  { icon: Warehouse, t: "Fulfillment Network" },
  { icon: Cpu, t: "Smart Technology" },
  { icon: UserCheck, t: "Logistics Expertise" },
];

// Six of Michael's nine problems (brief, 2026-08-04), consequence spelled out.
const PROBLEMS = [
  { t: "Shipping costs keep rising", d: "Carrier increases and surcharges land faster than you can reprice." },
  { t: "Customers expect Amazon level delivery", d: "Two day delivery and live tracking are the baseline now, whether your operation was built for it or not." },
  { t: "Hard to find a competent 3PL", d: "DIY doesn't scale, but outsourcing feels like losing control of your customer promise." },
  { t: "Complexity grows with you", d: "Every channel, SKU and region adds moving parts, and service slips exactly when volume spikes." },
  { t: "Where should inventory go?", d: "Placement gets decided by habit and available space, not by demand." },
  { t: "Returns and experience degrade", d: "Reverse logistics grows faster than forward, and the customer feels every crack." },
];

const AUDIENCE = [
  { t: "Growing fast", d: "Order volume compounding past what the current setup was built for.", img: "plus-aud-growing", alt: "A small team packing a surge of orders in a bright studio" },
  { t: "Growth minded", d: "Logistics is the next constraint between you and the plan.", img: "plus-aud-growth", alt: "A founder and an operations lead walking a new warehouse space" },
  { t: "Profit minded", d: "You want logistics to make you money, not just cost less.", img: "plus-aud-profit", alt: "A business owner reviewing margins at a bright desk" },
];

// Michael's highlights (2026-09-14): compact in the hero card, one line each in
// the solution section. US before Canada, his order.
const ONES = [
  {
    icon: Network,
    t: "One distributed network",
    highlights: ["Certified warehouses across the US and Canada", "Connected couriers and final mile providers", "Connected LTL and FTL freight providers"],
    expanded: [
      ["Certified warehouses", "A large network of certified warehouses across the US and Canada, so inventory sits where demand is."],
      ["Couriers and final mile", "Connected couriers and final mile providers, compared on every shipment."],
      ["LTL and FTL freight", "Connected less than truckload and full truckload providers for everything beyond parcel."],
    ],
  },
  {
    icon: LayoutGrid,
    t: "One system",
    highlights: ["Shipping: discounted rates and BYOR", "Warehousing", "Fulfillment", "Integrations", "Optimization"],
    expanded: [
      ["Shipping", "Discounted rates across the network, or bring your own."],
      ["Warehousing", "Inventory placed and managed across the network from one view."],
      ["Fulfillment", "Pick, pack and ship from the node that wins on cost, availability and speed."],
      ["Integrations", "Your storefront, ERP and warehouse systems connected."],
      ["Optimization", "Routing, placement and carrier mix tuned continuously."],
    ],
  },
  {
    icon: ShieldCheck,
    t: "One point of responsibility",
    highlights: ["Logistics design", "Dedicated support", "One responsible company"],
    expanded: [
      ["Logistics design", "Engineers who assess your operation and design the system around it."],
      ["Dedicated support", "A team that knows your network by name and stays on it."],
      ["One responsible company", "One partner accountable for the outcome, not a chain of vendors."],
    ],
  },
];

const SERVICES = [
  { icon: Warehouse, t: "Warehousing & fulfillment", d: "Certified partner network, run with our ops team." },
  { icon: Boxes, t: "Inventory placement", d: "Stock positioned by demand, not by who has space." },
  { icon: Tags, t: "Multi carrier rate shopping", d: "Our negotiated rates and yours, compared per shipment." },
  { icon: Route, t: "Zone skipping & injection", d: "Bulk the linehaul, inject regionally, cut transit." },
  { icon: Gauge, t: "Cross border", d: "Canada and US, in both directions, customs brokerage included." },
  { icon: RotateCcw, t: "Returns", d: "Flexible labels and routing, restocked into the network." },
];

export default function ParcelForumPage() {
  return (
    <main className="pf-flow" style={{ ...body, background: PF.paper }}>
      {/* ── hero — the banner, continued ─────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: PF.blue }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1.4px, transparent 2px)", backgroundSize: "14px 14px" }} />
        <div aria-hidden style={{ position: "absolute", right: -220, top: -240, width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(229,80,33,0.42), rgba(229,80,33,0.12) 55%, transparent 72%)" }} />

        {/* header: logo as on the banner, one action */}
        <div style={{ position: "relative", maxWidth: 1220, margin: "0 auto", padding: "22px clamp(22px, 4vw, 56px) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <img src="/shiptime-logo-white.svg" alt="ShipTime" width={163} height={50} style={{ height: 40, width: "auto", display: "block" }} />
          <a href={BOOK_HREF} {...bookProps} style={{ ...btnOnBlue, padding: "12px 20px", fontSize: 14 }}>
            Book a call
          </a>
        </div>

        <div style={{ ...container, position: "relative", paddingTop: "clamp(48px, 6vw, 88px)" }}>
          <div className="pf-split" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "clamp(36px, 5vw, 80px)", alignItems: "end" }}>
            <div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 26 }}>
                  <span style={{ display: "inline-flex", background: "#fff", borderRadius: 10, padding: "9px 14px" }}>
                  <img src="/generated/parcel-forum-logo.webp" alt="Parcel Forum '26, September 14 to 16" width={820} height={200} style={{ width: "clamp(150px, 16vw, 200px)", height: "auto", display: "block" }} />
                  </span>
                  <span style={{ ...body, display: "inline-flex", alignItems: "center", background: PF.orange, color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    Booth {BOOTH}
                  </span>
                </div>
              <h1 style={{ ...display, fontSize: "clamp(3.8rem, 9.5vw, 7.6rem)", color: PF.onBlue, margin: 0 }}>
                Logistics.
                <span style={{ display: "block", color: PF.orange, fontSize: "0.5em", letterSpacing: "0.02em", marginTop: "0.08em" }}>Designed for growth.</span>
              </h1>
              <p style={{ ...body, fontSize: "clamp(1.08rem, 1.5vw, 1.28rem)", fontWeight: 500, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", margin: "24px 0 0", maxWidth: "50ch" }}>
                Meet <strong style={{ color: "#fff" }}>ShipTime One</strong>: one distributed network, one system, one
                point of responsibility, for progressive businesses that expect more from logistics.
              </p>
              <ul style={{ listStyle: "none", margin: "22px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {["Lower Logistics Costs", "Improve Operational Efficiency", "Deliver a Better Customer Experience"].map((t) => (
                  <li key={t} style={{ ...body, display: "flex", alignItems: "center", gap: 10, fontSize: "clamp(1.08rem, 1.5vw, 1.28rem)", fontWeight: 700, color: "#fff" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: PF.orange, flex: "none" }} />
                    {t}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 46 }}>
                <a href={BOOK_HREF} {...bookProps} style={btnPrimary}>
                  Book a call <ArrowRight size={15} />
                </a>
                <Link href="/parcelforum/score" style={btnOnBlue}>
                  Get your Logistics Performance Score
                </Link>
              </div>
            </div>

            {/* the name, explained */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${PF.blueLine}`, borderRadius: 20, padding: "clamp(22px, 2.6vw, 34px)", backdropFilter: "blur(6px)" }}>
              <Kicker onBlue>Why &ldquo;One&rdquo;?</Kicker>
              {ONES.map((o, i) => (
                <div key={o.t} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "18px 0", borderTop: i ? `1px solid ${PF.blueLine}` : "none", marginTop: i ? 0 : 14 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: 11, background: PF.orange, color: "#fff", flex: "none" }}>
                    <o.icon size={20} strokeWidth={2} />
                  </span>
                  <div>
                    <div style={{ ...display, fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)", color: "#fff", letterSpacing: "0.02em" }}>{o.t}</div>
                    <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                      {o.highlights.map((h) => (
                        <li key={h} style={{ ...body, display: "flex", gap: 9, alignItems: "baseline", fontSize: 13.5, lineHeight: 1.5, color: PF.onBlueDim }}>
                          <span style={{ width: 5, height: 5, background: PF.orange, flex: "none", transform: "translateY(-2px)" }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* the banner's bottom edge */}
        <div style={{ position: "relative", borderTop: `1px solid ${PF.blueLine}`, background: PF.blueDeep }}>
          <div style={{ maxWidth: 1220, margin: "0 auto", padding: "18px clamp(22px, 4vw, 56px)", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px clamp(22px, 4vw, 56px)" }}>
            {CAPABILITIES.map((c) => (
              <div key={c.t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <c.icon size={18} strokeWidth={1.9} color="#fff" />
                <span style={{ ...body, fontSize: 12.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.86)" }}>{c.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── the problem ──────────────────────────────────────────────────────── */}
      <section style={{ background: PF.paper }}>
        <div style={container}>
          <Reveal>
            <div style={{ maxWidth: 720 }}>
              <Kicker>The problem</Kicker>
              <H2>Growth makes logistics harder.</H2>
              <Lead>The symptoms are the same in almost every growing business, because they share a cause. Nobody designed the system; it accumulated.</Lead>
            </div>
          </Reveal>
          <div className="pf-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: "clamp(40px, 5vw, 60px)" }}>
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.t} delay={(i % 3) * 90 + Math.floor(i / 3) * 60}>
                <div className="pk-lift" style={{ height: "100%", background: PF.card, border: `1px solid ${PF.line}`, borderRadius: 18, padding: "26px 26px 28px" }}>
                  <span style={{ ...display, fontSize: 18, color: PF.orange }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ ...body, fontSize: 18.5, fontWeight: 800, lineHeight: 1.22, color: PF.ink, margin: "10px 0 0", letterSpacing: "-0.01em" }}>{p.t}</h3>
                  <p style={{ ...body, fontSize: 14, lineHeight: 1.6, color: PF.sub, margin: "8px 0 0" }}>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── who it's for ─────────────────────────────────────────────────────── */}
      <section style={{ background: PF.card, borderTop: `1px solid ${PF.line}`, borderBottom: `1px solid ${PF.line}` }}>
        <div style={container}>
          <Reveal>
            <div style={{ maxWidth: 720 }}>
              <Kicker>Who we work with</Kicker>
              <H2>Built for businesses on the way up.</H2>
              <Lead>Rapidly growing businesses that want to grow, and want their logistics to make them money. We work with organizations up to and over $100M in revenue.</Lead>
            </div>
          </Reveal>
          <div className="pf-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(40px, 5vw, 60px)" }}>
            {AUDIENCE.map((a, i) => (
              <Reveal key={a.t} delay={i * 100}>
                <div className="pk-lift" style={{ height: "100%", display: "flex", flexDirection: "column", background: PF.paper, border: `1px solid ${PF.line}`, borderRadius: 20, overflow: "hidden" }}>
                  <img src={`/generated/${a.img}.webp`} alt={a.alt} width={1536} height={1024} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", display: "block", borderBottom: `1px solid ${PF.line}` }} />
                  <div style={{ padding: "22px 26px 26px" }}>
                    <h3 style={{ ...display, fontSize: "clamp(1.5rem, 2.2vw, 1.9rem)", color: PF.ink, margin: 0 }}>{a.t}</h3>
                    <p style={{ ...body, fontSize: 14.5, lineHeight: 1.6, color: PF.sub, margin: "8px 0 0" }}>{a.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── the solution: ShipTime One ───────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: PF.blue }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1.4px, transparent 2px)", backgroundSize: "14px 14px" }} />
        <div style={{ ...container, position: "relative" }}>
          <Reveal>
            <div style={{ maxWidth: 820 }}>
              <Kicker onBlue>The solution</Kicker>
              <H2 onBlue size="clamp(2.4rem, 5.2vw, 4.2rem)">
                <span className="pf-clause">One network.</span>{" "}
                <span className="pf-clause">One system.</span>{" "}
                <span className="pf-clause" style={{ color: PF.orange }}>One point of responsibility.</span>
              </H2>
              <Lead onBlue>
                ShipTime One designs your logistics operating system and helps you run it, unifying the right technology,
                networks and expertise so it stops being the thing holding back your growth.
              </Lead>
            </div>
          </Reveal>
          <div className="pf-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(44px, 5vw, 64px)" }}>
            {ONES.map((o, i) => (
              <Reveal key={o.t} delay={i * 100}>
                <div style={{ height: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${PF.blueLine}`, borderRadius: 20, padding: "28px 28px 32px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 12, background: PF.orange, color: "#fff" }}>
                    <o.icon size={22} strokeWidth={2} />
                  </span>
                  <h3 style={{ ...display, fontSize: "clamp(1.5rem, 2.2vw, 1.9rem)", color: "#fff", margin: "18px 0 0" }}>{o.t}</h3>
                  <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {o.expanded.map(([t, d]) => (
                      <li key={t} style={{ borderTop: `1px solid ${PF.blueLine}`, paddingTop: 12 }}>
                        <div style={{ ...body, fontSize: 14, fontWeight: 800, color: "#fff" }}>{t}</div>
                        <div style={{ ...body, fontSize: 13.5, lineHeight: 1.58, color: PF.onBlueDim, marginTop: 3 }}>{d}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div style={{ marginTop: "clamp(36px, 4vw, 52px)", paddingTop: 28, borderTop: `1px solid ${PF.blueLine}`, display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "12px 28px" }}>
              <span style={{ ...body, fontSize: 15, fontWeight: 500, color: PF.onBlueDim }}>Every system we design is built to do three things:</span>
              {["Lower Logistics Costs", "Improve Operational Efficiency", "Deliver a Better Customer Experience"].map((t) => (
                <span key={t} style={{ ...display, fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)", color: "#fff", letterSpacing: "0.03em" }}>
                  <span style={{ color: PF.orange }}>/ </span>{t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── what we actually do ──────────────────────────────────────────────── */}
      <section style={{ background: PF.paper }}>
        <div style={container}>
          <Reveal>
            <div style={{ maxWidth: 720 }}>
              <Kicker>What we do</Kicker>
              <H2>We design the system, then help you run it.</H2>
              <Lead>An integrated network reaches efficiencies a standalone warehouse or parcel provider can&rsquo;t.</Lead>
            </div>
          </Reveal>
          <div className="pf-services" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: "clamp(40px, 5vw, 60px)" }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.t} delay={(i % 3) * 90}>
                <div className="pk-lift" style={{ height: "100%", background: PF.card, border: `1px solid ${PF.line}`, borderRadius: 18, padding: "24px 24px 28px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 11, background: PF.orangeTint, color: PF.orange }}>
                    <s.icon size={19} strokeWidth={2} />
                  </span>
                  <h3 style={{ ...body, fontSize: 18, fontWeight: 800, lineHeight: 1.2, color: PF.ink, margin: "14px 0 0", letterSpacing: "-0.01em" }}>{s.t}</h3>
                  <p style={{ ...body, fontSize: 13.5, lineHeight: 1.6, color: PF.sub, margin: "7px 0 0" }}>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── the belief plate ─────────────────────────────────────────────────── */}
      <section style={{ background: PF.paper, paddingBottom: "clamp(40px, 6vw, 80px)" }}>
        <div style={{ maxWidth: 1220, margin: "0 auto", padding: "0 clamp(22px, 4vw, 56px)" }}>
          <Reveal>
            <div style={{ position: "relative", border: `1px solid ${PF.line}`, background: PF.card }}>
              <DotPattern width={7} height={7} cr={0.7} className="fill-[#07225B]/[0.07] md:fill-[#07225B]/[0.09]" />
              {[{ top: -4, left: -4 }, { bottom: -4, left: -4 }, { top: -4, right: -4 }, { bottom: -4, right: -4 }].map((pos, i) => (
                <span key={i} aria-hidden style={{ position: "absolute", width: 8, height: 8, background: PF.orange, ...pos }} />
              ))}
              <div style={{ position: "relative", zIndex: 1, padding: "clamp(32px, 5vw, 72px) clamp(24px, 4vw, 64px)", textAlign: "center" }}>
                <Kicker>What we believe</Kicker>
                <div style={{ ...display, fontSize: "clamp(2rem, 5.4vw, 4.4rem)", color: PF.ink, marginTop: "clamp(18px, 2.5vw, 30px)", lineHeight: 1.02 }}>
                  <div className="pf-line"><span>Nobody sold you</span><span style={{ color: PF.orange }}>a system.</span></div>
                  <div className="pf-line"><span style={{ color: PF.sub }}>They sold you tools</span><span>and left</span></div>
                  <div className="pf-line"><span style={{ color: PF.sub }}>the hard part</span><span>to you.</span></div>
                  <div className="pf-line pf-line-last" style={{ marginTop: "clamp(10px, 1.6vw, 22px)" }}><span>That&rsquo;s the part</span><span style={{ color: PF.orange }}>we design.</span></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── case study 01 ────────────────────────────────────────────────────── */}
      {/* Michael's first case. Facts and figures exactly as in his delivered
          proposal; the 44% and $15.28 are computed from his $34.42 / $19.14. */}
      <CaseStudy
        id="proof-01"
        n="01"
        mediaSide="left"
        chips={["US brand", "Direct to consumer into Canada", "Redesign of a live operation"]}
        title={<>A US brand entering Canada, <span style={{ color: PF.orange }}>redesigned.</span></>}
        rows={[
          ["The situation", "Every order shipped from Texas at premium cross border rates. Customs delays landed on their customers, and the cost landed on margin."],
          ["What we designed", "A four phase entry: bulk shipping into Canada, Canadian fulfillment, last mile injection, then expansion across the network as volume grew."],
          ["The result", "Delivered cost per shipment down 44%, from $34.42 to $19.14, with faster delivery and no customs delays at the customer's door."],
        ]}
        figure={
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <span style={{ ...display, fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", color: "rgba(255,255,255,0.45)", textDecoration: "line-through", textDecorationColor: PF.orange }}>$34.42</span>
            <span style={{ ...display, fontSize: "clamp(3.2rem, 6vw, 4.8rem)", color: PF.orange }}>$19.14</span>
            <span style={{ ...body, fontSize: 12.5, color: PF.onBlueDim }}>delivered cost per shipment</span>
          </div>
        }
        cards={[["44%", "lower cost per shipment"], ["$15.28", "saved on every shipment"], ["Faster", "delivery, no customs delays"]]}
        note="Anonymized pending customer permission. Figures from the delivered proposal."
        media={
          <img src="/generated/pf-proof-packing.webp" alt="A fulfillment worker taping a plain cardboard box shut at a packing bench" width={1024} height={1024} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 22, display: "block", border: `1px solid ${PF.blueLine}` }} />
        }
      />

      {/* ── case study 02 ────────────────────────────────────────────────────── */}
      {/* Michael's second case (2026-09-15). A tone deeper and mirrored so the
          two read as a series. The dashboard card rides on the photo because
          the case is about what the dashboard shows, but a mocked dashboard
          would mean inventing this customer's numbers, so the card names the
          tracked metrics and shows no values. The only figures are his two,
          10,000+ a month and the 5X, and the 5X is labelled a forecast. */}
      <CaseStudy
        id="proof-02"
        n="02"
        deep
        mediaSide="right"
        chips={["Large promotional company", "Direct to consumer campaign", "Designed and run by us"]}
        title={<>A campaign with no logistics yet, <span style={{ color: PF.orange }}>designed from zero.</span></>}
        rows={[
          ["The situation", "Running a campaign for one of their customers: new demand, over ten thousand shipments a month, and a set of parameters for how the product had to be distributed."],
          ["What we designed", "The operating system around it: the right location and the right carriers to minimize cost and time to deliver. We provide the warehousing and fulfillment at that location, from our partner network."],
          ["What's next", "The program is expected to reach five times its volume within a year. As that lands the system adapts into a multi warehouse solution that keeps reducing cost and time to deliver, and the next campaign gets the same design pass."],
        ]}
        figure={
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <span style={{ ...display, fontSize: "clamp(3.2rem, 6vw, 4.8rem)", color: PF.orange }}>10,000+</span>
            <span style={{ ...body, fontSize: 12.5, color: PF.onBlueDim }}>shipments a month, direct to consumer</span>
          </div>
        }
        cards={[["5X", "the growth the program is built to absorb"], ["Multi warehouse", "the network adapts as volume lands"], ["Repeatable", "the next campaign gets the same design pass"]]}
        note={<>Anonymized pending customer permission. Program in flight; the 5X is the campaign&rsquo;s forecast, not a result.</>}
        media={
          <div style={{ position: "relative" }}>
            <img src="/generated/pf-proof-campaign.webp" alt="A long packing line in a fulfillment warehouse, hundreds of identical plain kraft mailer boxes stacked on pallets and carts" width={1024} height={1024} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 22, display: "block", border: `1px solid ${PF.blueLine}` }} />
            {/* the dashboard card sits on the photo on desktop and drops below it on a phone (.pf-dash) */}
            <div className="pf-dash" style={{ position: "absolute", left: 16, right: 16, bottom: 16, borderRadius: 16, border: `1px solid ${PF.blueLine}`, background: "rgba(3,21,60,0.9)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", padding: "16px 18px 17px" }}>
              <div style={{ ...body, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PF.orange }}>Run from one dashboard</div>
              <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                {[
                  ["Avg. cost per order", ""],
                  ["Avg. time in transit", "incl. processing and pick and pack"],
                  ["Exceptions", "what went wrong, how often"],
                ].map(([t, d]) => (
                  <div key={t} className="pf-dash-row" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ ...body, fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{t}</span>
                    {d && <span style={{ ...body, fontSize: 12, color: PF.onBlueDim, textAlign: "right" }}>{d}</span>}
                  </div>
                ))}
              </div>
              <p style={{ ...body, fontSize: 12, lineHeight: 1.5, color: PF.onBlueDim, margin: "10px 0 0", paddingTop: 10, borderTop: `1px solid ${PF.blueLine}` }}>
                All of it trended over time, not just today&rsquo;s number.
              </p>
            </div>
          </div>
        }
      />

      {/* ── the people ───────────────────────────────────────────────────────── */}
      <section style={{ background: PF.paper }}>
        <div style={container}>
          <div className="pf-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(36px, 5vw, 80px)", alignItems: "center" }}>
            <div>
              <Kicker>The people</Kicker>
              <H2 size="clamp(2rem, 3.8vw, 3rem)">Experience at <span style={{ color: PF.orange }}>every step.</span></H2>
              <Lead>
                From logistics design through account management to dedicated support, one experienced team, all
                working to make your logistics work for you and drive your growth.
              </Lead>
            </div>
            <img src="/generated/plus-ops-team.webp" alt="Two ShipTime operators reviewing a logistics plan together" width={1024} height={1024} loading="lazy" style={{ width: "100%", height: "auto", borderRadius: 22, display: "block", border: `1px solid ${PF.line}` }} />
          </div>
        </div>
      </section>

      {/* ── the offer: Logistics Performance Score ───────────────────────────── */}
      <section style={{ background: PF.card, borderTop: `1px solid ${PF.line}` }}>
        <div style={container}>
          <div className="pf-split" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(36px, 5vw, 72px)", alignItems: "center" }}>
            <div>
              <Kicker>Your Logistics Performance Score</Kicker>
              <H2>Find out where you stand.</H2>
              <Lead>
                Sixteen questions about how your logistics actually runs. You get a score out of 100 on screen, across cost,
                efficiency and customer experience, and a short written read on where the leverage is, in your inbox
                within the hour.
              </Lead>
              <p style={{ ...body, fontSize: 14, lineHeight: 1.6, color: PF.faint, margin: "18px 0 0", maxWidth: "48ch" }}>
                Every completed assessment also feeds the Logistics Performance Index, the benchmark behind our State of
                Logistics Performance Report.
              </p>
            </div>
            <LpsShiplet startHref="/parcelforum/score" reportDelivery="email" />
          </div>
        </div>
      </section>

      {/* ── talk to us — standalone, not chained to the assessment ───────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: PF.blue }}>
        <img src="/generated/plus-cta-operator.webp" alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(7,34,91,0.35) 0%, rgba(7,34,91,0.08) 45%, rgba(7,34,91,0.25) 100%)" }} />
        <div style={{ ...container, position: "relative", minHeight: "min(74svh, 640px)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 22, padding: "clamp(30px, 3.6vw, 46px)", maxWidth: 540, width: "100%", boxShadow: "0 30px 70px -30px rgba(3,21,60,0.6)" }}>
            <Kicker>Talk to us</Kicker>
            <H2 size="clamp(2rem, 3.4vw, 2.8rem)">Tell us about your situation.</H2>
            <p style={{ ...body, fontSize: 15.5, lineHeight: 1.62, color: PF.sub, margin: "14px 0 0" }}>
              Thirty minutes with a logistics engineer: what you ship, where it hurts, and what a designed system would
              change. No assessment required.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
              <a href={BOOK_HREF} {...bookProps} style={btnPrimary}>
                Book a call <ArrowRight size={15} />
              </a>
              <Link href="/parcelforum/score" style={btnOnLight}>
                Get your score
              </Link>
            </div>
            <p style={{ ...body, fontSize: 14, lineHeight: 1.55, color: PF.sub, margin: "20px 0 0", paddingTop: 18, borderTop: `1px solid ${PF.line}` }}>
              At the show? We&rsquo;re at <strong style={{ color: PF.ink }}>booth {BOOTH}</strong>. Come talk to us in person.
            </p>
          </div>
        </div>
      </section>

      {/* ── footer: who we are, nothing to wander off to ─────────────────────── */}
      <footer style={{ background: PF.blueDeep, borderTop: `1px solid ${PF.blueLine}` }}>
        <div style={{ maxWidth: 1220, margin: "0 auto", padding: "30px clamp(22px, 4vw, 56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="/shiptime-logo-white.svg" alt="ShipTime" width={163} height={50} style={{ height: 30, width: "auto", display: "block" }} />
            <span style={{ ...body, fontSize: 12.5, color: PF.onBlueDim }}>ShipTime One: one distributed network, one system, one point of responsibility.</span>
          </div>
          <span style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>© 2026 ShipTime Canada Inc.</span>
        </div>
      </footer>

      <style>{`
        /* The shiplet is shared with the Plus site and sets its headings in the
           kit's serif. Inside this flow we resolve that font variable to Manrope
           so the widget matches the banner-aligned page around it. */
        .pf-flow { --font-instrument-serif: var(--font-manrope); }
        .pf-line { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.18em 0.28em; }
        /* 7: the shiplet's serif is remapped to Manrope here, which has no italic —
           stop the browser faking one. */
        .pf-flow [style*="font-style:italic"] { font-style: normal !important; }
        /* keep each "One …" clause whole on a phone rather than breaking mid-phrase */
        @media (max-width: 640px) {
          .pf-clause { display: block; }
          /* let the quote flow as prose instead of ragging one word per line */
          .pf-line:not(.pf-line-last), .pf-line:not(.pf-line-last) > span { display: inline; }
          .pf-line:not(.pf-line-last) > span { margin-right: 0.28em; }
          .pf-line-last { margin-top: 0.5em !important; }
        }
        @media (max-width: 980px) {
          .pf-split { grid-template-columns: minmax(0, 1fr) !important; }
          .pf-cards { grid-template-columns: minmax(0, 1fr) !important; }
          .pf-services { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          /* proof 02: the dashboard card leaves the photo and stacks under it */
          .pf-dash { position: static !important; margin-top: 12px; background: rgba(255,255,255,0.05) !important; }
          /* case study rows: label above text instead of beside it */
          .pf-cs-row { grid-template-columns: minmax(0, 1fr) !important; gap: 6px !important; }
        }
        @media (max-width: 640px) {
          .pf-services { grid-template-columns: minmax(0, 1fr) !important; }
          /* dashboard card: metric and its note stack instead of fighting for one line */
          .pf-dash-row { flex-direction: column; align-items: flex-start !important; gap: 1px !important; }
          .pf-dash-row > span:last-child { text-align: left !important; }
        }
      `}</style>
    </main>
  );
}
