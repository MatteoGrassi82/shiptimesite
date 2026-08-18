import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Compass, MessagesSquare, Orbit, Target } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import OrbitingIntegrations from "@/components/ui/orbiting-circles-02";
import { Marquee } from "@/components/ui/marquee";
import {
  P,
  serif,
  sans,
  dots,
  inner,
  HalftoneBlob,
  Sparkle,
  Eyebrow,
  PillLink,
  GhostLink,
  SectionHead,
  PlusKitMotion,
} from "./plus-v2-kit";

// ── /plus/v3 — the ShipTime + page ───────────────────────────────────────────
// Content v2, per PLUS-V3-CONTENT.md — the merge of Michael's brief
// (2026-08-04), his feedback (2026-08-06) and Chris Jarvis's feedback
// (2026-08-07) on the "ShipTime + (first website pages)" thread.
//
// The governing frame (Chris): a consulting firm that happens to have the
// ability to execute. Capabilities are PROOF, not pitch. The page sells
// confidence that we can architect a logistics operating system that supports
// growth. Michael's test: within 15-20 seconds a visitor knows we address
// their problem and that they're the right kind of customer.
//
// Order = Chris's three questions, then the sell process as the spine:
//   Hero        is this built for companies like me?
//   01 Problems do they understand what I'm experiencing?  (front, per both)
//   02 Who      who we're for (stratification = OPEN, Michael to send segments)
//   03 Different market position made explicit (the prospect quote)
//   04 How      the five-step sell process; LOS + Performance Triangle
//   05 Bring    capabilities as evidence (Michael's "at our disposal" list)
//   06 Infra    proposal slide-4 numbers
//   07 Proof    the case, design-first framing
//   LPS         closing offer: Logistics Performance Score (not "assessment")
//
// Standing rules: never claim we run their logistics department (Michael) —
// team-oriented, design-and-help-run. The customer in Proof stays anonymised
// until permission. Mock-UI figures are real proposal numbers; don't invent.
// This pass is COPY AND ORDER ONLY — section redesign (people shots, killing
// treatments Michael dislikes) is the next pass.

// ── section shell ────────────────────────────────────────────────────────────
function Sect({ children, bg = P.panel, style }: { children: ReactNode; bg?: string; style?: CSSProperties }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: bg, ...style }}>{children}</section>
  );
}

// ── HERO — is this built for companies like me? ──────────────────────────────
function Hero() {
  return (
    <Sect bg={P.dark}>
      <video className="pk-herovid" autoPlay muted loop playsInline aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
        <source src="/generated/plus-hero-loop.mp4" type="video/mp4" />
      </video>
      {/* moving shader — three drifting brand-glow fields, screen-blended over
          the loop, under the scrim so the type keeps its contrast */}
      <div aria-hidden className="pk-herovid" style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: 0.5, overflow: "hidden" }}>
        <div className="v3-aur-a" style={{ position: "absolute", width: "58vw", height: "58vw", left: "-12%", top: "-24%", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,90,38,0.55) 0%, transparent 62%)" }} />
        <div className="v3-aur-b" style={{ position: "absolute", width: "52vw", height: "52vw", right: "-16%", top: "6%", borderRadius: "50%", background: "radial-gradient(circle, rgba(74,111,165,0.6) 0%, transparent 62%)" }} />
        <div className="v3-aur-c" style={{ position: "absolute", width: "48vw", height: "48vw", left: "18%", bottom: "-32%", borderRadius: "50%", background: "radial-gradient(circle, rgba(143,180,221,0.45) 0%, transparent 62%)" }} />
      </div>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(75% 55% at 50% 46%, rgba(28,30,61,0.52) 0%, rgba(28,30,61,0.84) 62%, rgba(28,30,61,0.96) 100%)" }} />

      <div style={{ ...inner, position: "relative", minHeight: "calc(100svh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div className="pk-fade" style={{ animationDelay: "0.05s", display: "flex", justifyContent: "center" }}>
          {/* "ShipTime Plus" is a placeholder — enterprise name still open with Michael */}
          <Eyebrow onDark>ShipTime Plus · For growing e-commerce</Eyebrow>
        </div>
        <h1 style={{ ...serif, fontSize: "clamp(2.7rem, 6.8vw, 5.7rem)", lineHeight: 1.03, color: "#FFFFFF", textShadow: "0 2px 28px rgba(16,18,38,0.55)", margin: "24px 0 0" }}>
          <span className="pk-line"><span className="pk-line-in" style={{ animationDelay: "0.1s" }}>Logistics is holding your growth back.</span></span>
          <span className="pk-line"><span className="pk-line-in" style={{ animationDelay: "0.26s", fontStyle: "italic" }}>We design the way out<span style={{ color: P.orange }}>.</span></span></span>
        </h1>
        <div className="pk-fade" style={{ animationDelay: "0.58s" }}>
          <p style={{ ...sans, fontSize: "clamp(1.1rem, 1.6vw, 1.34rem)", fontWeight: 500, lineHeight: 1.6, color: "rgba(248,249,252,0.92)", textShadow: "0 1px 16px rgba(16,18,38,0.5)", maxWidth: "56ch", margin: "26px auto 0" }}>
            For rapidly growing e-commerce businesses, we design — and help run — the logistics operating system
            behind your growth: one team of experienced operators, one plan across warehousing, carriers and borders,
            tuned as you scale.
          </p>
        </div>
        <div className="pk-fade" style={{ animationDelay: "0.76s" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36, justifyContent: "center" }}>
            <PillLink href="/plus/book-a-call">
              Book a call <ArrowRight size={15} />
            </PillLink>
            <GhostLink href="/plus/assessment" onDark>
              Get your Logistics Performance Score
            </GhostLink>
          </div>
        </div>
      </div>
    </Sect>
  );
}

// ── 01 THE PROBLEMS — do they understand what I'm experiencing? ──────────────
// The "roadblocks" marquee pattern: Michael's nine problems voiced as the
// questions a growing shipper actually asks (three scrolling rows), then a
// four-column dashed grid that lands the pivot. The last marquee line is the
// real one from Chris's Teams screenshot (2026-08-07).
const QUESTIONS: string[][] = [
  [
    "Why do shipping costs keep rising?",
    "Customers expect Amazon-like delivery — how do we keep up?",
    "DIY or outsource? Where's a competent 3PL?",
    "Why does service slip exactly when we grow?",
  ],
  [
    "Where should our inventory go?",
    "Which carriers actually bring the best value?",
    "Are we optimized for where we are — or where we're going?",
    "Why are returns becoming unmanageable?",
  ],
  [
    "Why is our customer experience degrading?",
    "What is this surcharge on our invoice?",
    "Can we even afford two-day delivery?",
    "Shipping is the worst. Can we just use Amazon?",
  ],
];

const ROADBLOCKS: { icon: typeof Orbit; title: string; body: string }[] = [
  { icon: MessagesSquare, title: "We've heard every one", body: "These aren't edge cases. They're the standard symptoms of growth outpacing logistics." },
  { icon: Compass, title: "It's a design problem", body: "Not a discipline problem. Nobody sold you a system — everyone sold you tools." },
  { icon: Orbit, title: "One system answers all nine", body: "Rating, routing, inventory, fulfillment and returns — engineered together, not patched separately." },
  { icon: Target, title: "Sound familiar?", body: "If three or more hit home, you're exactly who we built this for." },
];

function QuestionChip({ children }: { children: ReactNode }) {
  return (
    <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 14, fontWeight: 600, color: "#4A5060", background: P.panelSoft, border: `1px solid ${P.line}`, borderRadius: 999, padding: "10px 18px", whiteSpace: "nowrap" }}>
      <span style={{ width: 5, height: 5, background: P.orange, flex: "none" }} />
      {children}
    </span>
  );
}

function Problems() {
  return (
    <Sect>
      <div style={{ ...inner, paddingLeft: 0, paddingRight: 0 }}>
        <div style={{ padding: "0 clamp(22px, 4vw, 56px)" }}>
          <Reveal>
            <SectionHead
              eyebrow="01 · The problems"
              heading={<>Growth makes logistics harder. <span style={{ fontStyle: "italic" }}>You can hear it.</span></>}
              lead="The questions every growing shipper ends up asking — usually all at once."
            />
          </Reveal>
        </div>

        {/* three counter-scrolling rows of the customer's own questions */}
        <Reveal delay={140}>
          <div className="v3-mq" style={{ position: "relative", marginTop: "clamp(44px, 5vw, 64px)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div aria-hidden style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "clamp(48px, 8vw, 140px)", zIndex: 2, background: `linear-gradient(90deg, ${P.panel}, transparent)` }} />
            <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "clamp(48px, 8vw, 140px)", zIndex: 2, background: `linear-gradient(270deg, ${P.panel}, transparent)` }} />
            <Marquee pauseOnHover className="[--duration:45s] [--gap:0.75rem]" repeat={4}>
              {QUESTIONS[0].map((q) => <QuestionChip key={q}>{q}</QuestionChip>)}
            </Marquee>
            <Marquee pauseOnHover reverse className="[--duration:52s] [--gap:0.75rem]" repeat={4}>
              {QUESTIONS[1].map((q) => <QuestionChip key={q}>{q}</QuestionChip>)}
            </Marquee>
            <Marquee pauseOnHover className="[--duration:41s] [--gap:0.75rem]" repeat={4}>
              {QUESTIONS[2].map((q) => <QuestionChip key={q}>{q}</QuestionChip>)}
            </Marquee>
          </div>
        </Reveal>

        {/* the pivot: four dashed-divided responses */}
        <div style={{ margin: "clamp(52px, 6vw, 80px) clamp(22px, 4vw, 56px) 0" }}>
          <div className="grid grid-cols-1 border-t border-dashed border-[#C9CDD6] divide-dashed divide-[#C9CDD6] divide-y sm:grid-cols-2 sm:divide-y lg:grid-cols-4 lg:divide-y-0 sm:divide-x">
            {ROADBLOCKS.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "clamp(26px, 3vw, 40px) clamp(18px, 2vw, 26px) clamp(30px, 3.5vw, 44px)", height: "100%" }}>
                  <f.icon size={40} strokeWidth={1.6} color={i === 3 ? P.orange : P.ink} />
                  <div style={{ paddingTop: "clamp(20px, 4vw, 64px)" }}>
                    <h3 style={{ ...serif, fontSize: "clamp(1.4rem, 2.1vw, 1.75rem)", lineHeight: 1.14, color: P.ink, margin: 0 }}>{f.title}</h3>
                    <p style={{ ...sans, fontSize: 14, lineHeight: 1.62, color: "#4A5060", margin: "10px 0 0" }}>{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Sect>
  );
}

// ── 02 WHO WE'RE FOR — the growth curve ──────────────────────────────────────
// OPEN QUESTION (Michael): reads "too generic" — waiting on his real segments
// to replace the three types below. Curve stays; it's the piece he likes.
const AXIS_Y = 424;
const MARKS: { x: number; y: number; label: string; w: number }[] = [
  { x: 420, y: 300, label: "$5M", w: 74 },
  { x: 700, y: 148, label: "$30M", w: 88 },
  { x: 900, y: 66, label: "$100M+", w: 108 },
];

// Each cubic segment ENDS on a marker, so the nodes sit exactly on the line
// rather than being eyeballed against it.
const CURVE = "M 70 388 C 230 384, 330 352, 420 300 C 530 238, 620 190, 700 148 C 780 108, 850 82, 900 66";

function GrowthCurve() {
  return (
    <svg viewBox="0 0 1000 486" fill="none" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Shipping volume and complexity rising with revenue, past $100M with no ceiling">
      <defs>
        <linearGradient id="v3-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={P.orange} stopOpacity="0.20" />
          <stop offset="100%" stopColor={P.orange} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[120, 225, 330].map((y) => (
        <line key={y} x1="60" y1={y} x2="970" y2={y} stroke={P.line} strokeWidth="1" strokeDasharray="2 9" />
      ))}
      <line x1="60" y1={AXIS_Y} x2="970" y2={AXIS_Y} stroke={P.line} strokeWidth="1.5" />

      <path d={`${CURVE} L 900 ${AXIS_Y} L 70 ${AXIS_Y} Z`} fill="url(#v3-area)" />
      <path d={CURVE} stroke={P.orange} strokeWidth="2.5" strokeLinecap="round" />
      <circle className="v3-travel" r="6" fill={P.orange} style={{ offsetPath: `path("${CURVE}")` }} />

      {/* keeps climbing past the frame — Michael's "we don't want to limit ourselves here" */}
      <path d="M900 66 L963 41" stroke={P.orange} strokeWidth="2.5" strokeDasharray="7 7" strokeLinecap="round" />
      <path d="M970 38 l-13 0.5 M970 38 l-3 12.5" stroke={P.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <g>
        <rect x="726" y="12" width="118" height="34" rx="17" fill={P.orange} />
        <text x="785" y="30" textAnchor="middle" dominantBaseline="central" style={sans} fontSize="13" fontWeight="700" letterSpacing="1.2" fill="#fff">NO CEILING</text>
      </g>

      {MARKS.map((m, i) => (
        <g key={m.label}>
          <line x1={m.x} y1={m.y + 16} x2={m.x} y2={AXIS_Y - 6} stroke={P.line} strokeWidth="1.5" strokeDasharray="3 6" />
          <circle cx={m.x} cy={m.y} r="15" fill={P.card} stroke={P.orange} strokeWidth="2" />
          <circle className="pk-pulse" cx={m.x} cy={m.y} r="5.5" fill={P.orange} style={{ animationDelay: `${i * 0.8}s` }} />
          <rect x={m.x - m.w / 2} y={AXIS_Y + 12} width={m.w} height="38" rx="10" fill={P.card} stroke={P.line} strokeWidth="1.5" />
          <text x={m.x} y={AXIS_Y + 31} textAnchor="middle" dominantBaseline="central" style={serif} fontSize="20" fill={P.ink}>{m.label}</text>
        </g>
      ))}

      <text x="60" y="24" style={sans} fontSize="12.5" fontWeight="700" letterSpacing="1.3" fill={P.sub}>SHIPPING VOLUME &amp; COMPLEXITY</text>
      <text x="60" y={AXIS_Y + 34} style={sans} fontSize="12.5" fontWeight="700" letterSpacing="1.3" fill={P.faint}>REVENUE</text>
    </svg>
  );
}

// Shopify solutions-card pattern: left-aligned head, three photo-topped
// audience cards (Michael's three customer types), each linking into the
// persona pages. Placeholder photos until Michael's segments + real shots.
const AUDIENCE = [
  {
    kicker: "Growing fast",
    body: "Order volume is compounding past what the current setup was built for — every month adds channels, SKUs and promises to keep.",
    img: "/generated/plus-aud-growing.webp",
    alt: "A small e-commerce team packing a surge of orders in a bright studio",
  },
  {
    kicker: "Growth-minded",
    body: "You want to grow the business, and logistics is the next constraint between you and the plan — the next market, channel or warehouse.",
    img: "/generated/plus-aud-growth.webp",
    alt: "A founder and an operations lead walking a new warehouse space",
  },
  {
    kicker: "Profit-minded",
    body: "You want logistics to make you money, not just cost less — margin back on every shipment, and an experience that brings customers back.",
    img: "/generated/plus-aud-profit.webp",
    alt: "A business owner reviewing margins at a bright desk",
  },
];

function WhoItsFor() {
  return (
    <Sect bg={P.panelSoft} style={{ borderTop: `1px solid ${P.line}`, borderBottom: `1px solid ${P.line}` }}>
      <div style={{ ...inner }}>
        <Reveal>
          <SectionHead
            align="left"
            eyebrow="02 · Who we're for"
            heading={<>Built for commerce on the <span style={{ fontStyle: "italic" }}>way up.</span></>}
            lead="Rapidly growing e-commerce businesses that want to grow — and want their logistics to make them money."
          />
        </Reveal>

        <div className="v3-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(44px, 5vw, 64px)" }}>
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.kicker} delay={i * 110}>
              <div className="pk-lift" style={{ height: "100%", background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <img
                  src={a.img}
                  alt={a.alt}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  style={{ width: "100%", aspectRatio: "3 / 2", objectFit: "cover", display: "block", borderBottom: `1px solid ${P.line}` }}
                />
                <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "24px 28px 28px" }}>
                  <h3 style={{ ...serif, fontSize: "clamp(1.6rem, 2.4vw, 2rem)", lineHeight: 1.12, color: P.ink, margin: 0 }}>{a.kicker}</h3>
                  <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.64, color: "#4A5060", margin: "10px 0 0" }}>{a.body}</p>
                  <Link href="/plus/solutions" className="st-cta" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, marginTop: "auto", paddingTop: 20, fontSize: 14, fontWeight: 700, color: P.ink, textDecoration: "none" }}>
                    See how we help <ArrowRight size={14} color={P.orange} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <div className="v3-ceiling" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px 30px", marginTop: 18, background: P.dark, borderRadius: 20, padding: "clamp(28px, 3.5vw, 40px) clamp(28px, 3.5vw, 46px)", position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", right: -50, top: -60, width: 210, height: 210, ...dots("rgba(236,90,38,0.4)", 10, 1.8), WebkitMaskImage: "radial-gradient(closest-side, black 35%, transparent 72%)", maskImage: "radial-gradient(closest-side, black 35%, transparent 72%)" }} />
            <div style={{ ...serif, position: "relative", fontSize: "clamp(2.4rem, 4.4vw, 3.4rem)", lineHeight: 1, color: P.orange, flex: "none" }}>$100M+</div>
            <p style={{ ...sans, position: "relative", fontSize: "clamp(1rem, 1.4vw, 1.16rem)", fontWeight: 500, lineHeight: 1.6, color: "rgba(244,245,248,0.86)", margin: 0, maxWidth: "56ch" }}>
              We work effectively with businesses doing up to and over $100 million in revenue — and we don&rsquo;t want
              to limit ourselves there.
            </p>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 03 WHY WE'RE DIFFERENT — market position made explicit ───────────────────
// Michael's prospect quote, stated rather than inferred (Chris). New section.
function WhyDifferent() {
  return (
    <Sect>
      <div style={{ ...inner }}>
        <Reveal>
          <SectionHead
            eyebrow="03 · Why we're different"
            heading={<>More capable than the independents. <span style={{ fontStyle: "italic" }}>More personal than the giants.</span></>}
            lead="Our customers put it best — so we'll say it plainly."
          />
        </Reveal>

        <div className="v3-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(52px, 7vw, 84px)", alignItems: "stretch" }}>
          <Reveal delay={0}>
            <div style={{ height: "100%", background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, padding: "30px 30px 34px" }}>
              <span style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.faint }}>Independent 3PLs</span>
              <h3 style={{ ...serif, fontSize: "clamp(1.4rem, 2.1vw, 1.7rem)", lineHeight: 1.16, color: P.ink, margin: "12px 0 0" }}>Willing, but limited.</h3>
              <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.64, color: "#4A5060", margin: "10px 0 0" }}>
                A limited network, and without the sophistication to design logistics — or the technology to support it.
              </p>
            </div>
          </Reveal>
          <Reveal delay={110}>
            <div style={{ height: "100%", position: "relative", overflow: "hidden", background: P.dark, borderRadius: 20, padding: "30px 30px 34px" }}>
              <div aria-hidden style={{ position: "absolute", right: -44, top: -48, width: 165, height: 165, ...dots("rgba(236,90,38,0.4)", 10, 1.8), WebkitMaskImage: "radial-gradient(closest-side, black 35%, transparent 72%)", maskImage: "radial-gradient(closest-side, black 35%, transparent 72%)" }} />
              <span style={{ position: "relative", display: "inline-flex" }}><Sparkle size={15} pulse /></span>
              <h3 style={{ ...serif, position: "relative", fontSize: "clamp(1.4rem, 2.1vw, 1.7rem)", lineHeight: 1.16, color: P.onDark, margin: "12px 0 0" }}>
                Deliberately in between.
              </h3>
              <p style={{ ...sans, position: "relative", fontSize: 14.5, lineHeight: 1.64, color: "rgba(244,245,248,0.8)", margin: "10px 0 0" }}>
                The design sophistication and technology of the majors — with the attention and flexibility of a
                partner who knows your network.
              </p>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div style={{ height: "100%", background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, padding: "30px 30px 34px" }}>
              <span style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.faint }}>Asset-based giants</span>
              <h3 style={{ ...serif, fontSize: "clamp(1.4rem, 2.1vw, 1.7rem)", lineHeight: 1.16, color: P.ink, margin: "12px 0 0" }}>Capable, but distant.</h3>
              <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.64, color: "#4A5060", margin: "10px 0 0" }}>
                The scale is real — but you won&rsquo;t get their attention, and you may not afford their rates.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={280}>
          <p style={{ ...sans, textAlign: "center", fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", fontWeight: 500, lineHeight: 1.65, color: "#464C5C", maxWidth: "56ch", margin: "clamp(44px, 5vw, 64px) auto 0" }}>
            Not another 3PL. Not another shipping platform. A partner who <strong style={{ color: P.ink }}>designs and
            continuously operates</strong> modern logistics systems for growing businesses.
          </p>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── INTERLUDE — the human element as a moment (Retell "Talks Like People") ───
// Oversized serif words around one quiet portrait tile. Michael: the page was
// missing the human element; Chris: the human side is a competitive advantage.
function PeopleInterlude() {
  const word: CSSProperties = { ...serif, display: "inline-block", fontSize: "clamp(3.2rem, 9vw, 7.6rem)", lineHeight: 1.08, color: P.ink };
  // Each word rises out of its own mask on scroll-in; the portrait scales up
  // between them; the caption follows. All keyed off the wrapper's
  // [data-reveal="in"] so the whole moment fires as one choreography.
  const Word = ({ children, delay, italic = false }: { children: ReactNode; delay: string; italic?: boolean }) => (
    <span className="v3-word" style={{ ...word, fontStyle: italic ? "italic" : undefined }}>
      <span className="v3-word-in" style={{ transitionDelay: delay }}>{children}</span>
    </span>
  );
  return (
    <Sect>
      <div style={{ ...inner, paddingTop: "clamp(88px, 11vw, 180px)", paddingBottom: "clamp(88px, 11vw, 180px)" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(26px, 5vw, 72px)", flexWrap: "wrap" }}>
            <Word delay="0.05s">Designed</Word>
            <img
              className="v3-face"
              src="/generated/plus-people-portrait.webp"
              alt=""
              width={1024}
              height={1024}
              loading="lazy"
              style={{ width: "clamp(140px, 18vw, 244px)", height: "auto", borderRadius: 18, display: "block" }}
            />
            <Word delay="0.34s">by</Word>
          </div>
          <div style={{ textAlign: "center", marginTop: "clamp(10px, 2vw, 24px)" }}>
            <Word delay="0.5s" italic>people<span style={{ color: P.orange }}>.</span></Word>
          </div>
          <p className="v3-caption-in" style={{ ...sans, textAlign: "center", fontSize: "clamp(1rem, 1.4vw, 1.16rem)", fontWeight: 500, lineHeight: 1.6, color: "#464C5C", maxWidth: "44ch", margin: "clamp(36px, 5vw, 56px) auto 0" }}>
            Not a portal and a support queue. Logistics operators who know your network by name.
          </p>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 04 HOW WE WORK — the sell process as the spine (Chris's five steps) ──────
// Rows in the Retell pattern: step name left, body middle, small abstract
// glyph tile right, hairline dividers. Glyphs stay static — Michael: dynamic
// elements as accents only.
type GlyphKind = "understand" | "assess" | "design" | "implement" | "optimize";

function StepGlyph({ kind }: { kind: GlyphKind }) {
  return (
    <div aria-hidden style={{ width: 116, height: 116, flex: "none", borderRadius: 16, background: P.panelSoft, border: `1px solid ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        {kind === "understand" && (
          <>
            <circle cx="14" cy="19" r="3.5" fill={P.ink} />
            <circle cx="45" cy="13" r="3.5" fill={P.ink} />
            <circle cx="51" cy="42" r="3.5" fill={P.ink} />
            <circle cx="17" cy="47" r="3.5" fill={P.ink} />
            <circle cx="32" cy="32" r="9" stroke={P.orange} strokeWidth="2.5" />
            <circle cx="32" cy="32" r="3" fill={P.ink} />
          </>
        )}
        {kind === "assess" && (
          <>
            <line x1="8" y1="32" x2="56" y2="32" stroke={P.line} strokeWidth="2.5" />
            <circle cx="18" cy="32" r="4" fill="#C2C7D1" />
            <circle cx="33" cy="32" r="5" fill={P.ink} />
            <circle cx="49" cy="32" r="6.5" fill={P.orange} />
          </>
        )}
        {kind === "design" && (
          <>
            <path d="M32 12 L52 48 L12 48 Z" stroke={P.ink} strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="32" cy="37" r="4.5" fill={P.orange} />
          </>
        )}
        {kind === "implement" && (
          <>
            <line x1="18" y1="44" x2="32" y2="19" stroke={P.line} strokeWidth="2" />
            <line x1="32" y1="19" x2="46" y2="44" stroke={P.line} strokeWidth="2" strokeDasharray="3 5" />
            <line x1="18" y1="44" x2="46" y2="44" stroke={P.line} strokeWidth="2" />
            <circle cx="18" cy="44" r="5" fill={P.ink} />
            <circle cx="46" cy="44" r="5" fill={P.ink} />
            <circle cx="32" cy="19" r="6" fill={P.orange} />
          </>
        )}
        {kind === "optimize" && (
          <>
            <circle cx="32" cy="32" r="16" stroke={P.ink} strokeWidth="2.5" />
            <circle cx="43.5" cy="20.5" r="5.5" fill={P.orange} />
          </>
        )}
      </svg>
    </div>
  );
}

// Each step carries the detail of HOW it's done (drawn from the engagement
// phases in the live proposal, slide 11) and the outcome it buys — per
// Michael's note on v1 of this section: "really dig into the details …
// showcasing 'how' we get at better outcomes."
const STEPS: { name: string; body: string; details: string[]; outcome: string; glyph: GlyphKind; note?: string }[] = [
  {
    name: "Understand",
    body: "First, we learn everything.",
    details: [
      "Every order. Every lane. Every season.",
      "Your carriers, your rates, your promises.",
      "Where your inventory lives — and why.",
    ],
    outcome: "Decisions start from your reality. Not somebody's average.",
    glyph: "understand",
  },
  {
    name: "Assess",
    body: "Then we measure what's possible.",
    details: [
      "Your setup, benchmarked against world class.",
      "DIY, outsourced, hybrid — modelled side by side.",
      "Carriers, compared on your real shipments.",
    ],
    outcome: "You see where every dollar leaks. And what to fix first.",
    glyph: "assess",
    note: "Your Logistics Performance Score lives here.",
  },
  {
    name: "Design",
    body: "Then we design the system.",
    details: [
      "Inventory, placed where demand is.",
      "Carriers, chosen lane by lane.",
      "Costs, projected before you commit.",
    ],
    outcome: "A plan you can hold us to. All of it — or one piece first.",
    glyph: "design",
  },
  {
    name: "Implement",
    body: "Then we build it. Together.",
    details: [
      "Warehouse set up. Inventory moved.",
      "Your systems, connected.",
      "Every shipment validated before go-live.",
    ],
    outcome: "You go live. Nothing pauses.",
    glyph: "implement",
  },
  {
    name: "Optimize",
    body: "And we never stop tuning.",
    details: [
      "Performance, reviewed against the plan.",
      "Lanes, re-shopped as markets move.",
      "Placement, re-tuned as demand shifts.",
    ],
    outcome: "Better every quarter. By design.",
    glyph: "optimize",
  },
];

function OutcomeTriangle() {
  const V = { apex: [320, 124], right: [470, 344], left: [170, 344] };
  const tri = `M${V.apex[0]} ${V.apex[1]} L${V.right[0]} ${V.right[1]} L${V.left[0]} ${V.left[1]} Z`;
  const labels = [
    { cx: 320, cy: 62, w: 150, text: "Lower costs" },
    { cx: 502, cy: 400, w: 178, text: "Faster delivery" },
    { cx: 138, cy: 400, w: 200, text: "Better experience" },
  ];
  return (
    <svg viewBox="0 0 640 450" fill="none" style={{ width: "100%", maxWidth: 560, height: "auto", display: "block", margin: "0 auto" }} aria-hidden>
      <path d={tri} stroke={P.line} strokeWidth="1.5" />
      <path className="pk-dash" d={tri} stroke={P.orange} strokeWidth="1.5" strokeDasharray="6 14" />
      <circle className="v3-travel" r="5.5" fill={P.orange} style={{ offsetPath: `path("${tri}")`, animationDuration: "10s" }} />
      {Object.values(V).map(([x, y], i) => (
        <line key={`c${i}`} x1={x} y1={y} x2="320" y2="267" stroke={P.line} strokeWidth="1" strokeDasharray="2 6" />
      ))}
      {Object.values(V).map(([x, y], i) => (
        <g key={`v${i}`}>
          <circle cx={x} cy={y} r="24" fill={P.card} stroke={P.line} strokeWidth="1.5" />
          <circle cx={x} cy={y} r="6.5" fill={P.orange} />
        </g>
      ))}
      <path className="pk-pulse" d="M320 241 L326 261 L346 267 L326 273 L320 293 L314 273 L294 267 L314 261 Z" fill={P.orange} />
      {labels.map((l) => (
        <g key={l.text}>
          <rect x={l.cx - l.w / 2} y={l.cy - 20} width={l.w} height="40" rx="20" fill={P.card} stroke={P.line} strokeWidth="1.5" />
          <text x={l.cx} y={l.cy} textAnchor="middle" dominantBaseline="central" style={sans} fontSize="13" fontWeight="700" letterSpacing="1.3" fill={P.ink}>
            {l.text.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

function HowWeWork() {
  // shares one continuous panelSoft band with Integrations directly below —
  // no bottom border here, no top border there.
  return (
    <Sect bg={P.panelSoft} style={{ borderTop: `1px solid ${P.line}` }}>
      <div style={{ ...inner }}>
        <Reveal>
          <SectionHead
            eyebrow="04 · How we work"
            heading={<>We design <span style={{ fontStyle: "italic" }}>Logistics Operating Systems.</span></>}
            lead="Five steps. Run by operators, not account managers. With you the whole way."
          />
        </Reveal>

        {/* the five steps as editorial rows: name | body | glyph */}
        <div style={{ maxWidth: 1040, margin: "clamp(52px, 7vw, 84px) auto 0", borderBottom: `1px solid ${P.line}` }}>
          {STEPS.map((st, i) => (
            <Reveal key={st.name} delay={i * 80}>
              <div className="v3-steprow" style={{ display: "grid", gridTemplateColumns: "minmax(190px, 0.75fr) 1.25fr 116px", gap: "clamp(20px, 4vw, 60px)", alignItems: "start", padding: "clamp(26px, 3.5vw, 40px) 0", borderTop: `1px solid ${P.line}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ ...serif, fontSize: 19, color: P.orange, flex: "none" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ ...serif, fontSize: "clamp(1.55rem, 2.4vw, 2rem)", lineHeight: 1.12, color: P.ink, margin: 0 }}>{st.name}</h3>
                </div>
                <div>
                  <p style={{ ...sans, fontSize: 15, fontWeight: 600, lineHeight: 1.6, color: P.ink, margin: 0, maxWidth: "46ch" }}>{st.body}</p>
                  <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                    {st.details.map((d) => (
                      <li key={d} style={{ ...sans, display: "flex", gap: 10, alignItems: "baseline", fontSize: 14, lineHeight: 1.55, color: "#4A5060" }}>
                        <span style={{ width: 5, height: 5, background: P.orange, flex: "none", transform: "translateY(-2px)" }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p style={{ ...sans, fontSize: 13.5, fontWeight: 700, color: P.orange, margin: "14px 0 0" }}>
                    → {st.outcome}
                  </p>
                  {st.note && (
                    <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, marginTop: 12, fontSize: 12, fontWeight: 700, color: P.orange, background: P.orangeTint, borderRadius: 999, padding: "5px 12px" }}>
                      <Sparkle size={11} /> {st.note}
                    </span>
                  )}
                </div>
                <div className="v3-stepglyph" style={{ justifySelf: "end" }}>
                  <StepGlyph kind={st.glyph} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* the operators band (Retell split-highlight): Chris's line, verbatim */}
        <div className="v3-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(36px, 5vw, 80px)", alignItems: "center", marginTop: "clamp(64px, 8vw, 112px)" }}>
          <div>
            <Reveal>
              <Eyebrow>The people</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h3 style={{ ...serif, fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", lineHeight: 1.1, color: P.ink, margin: "18px 0 0" }}>
                Experienced operators, <span style={{ fontStyle: "italic" }}>not account managers.</span>
              </h3>
            </Reveal>
            <Reveal delay={150}>
              <p style={{ ...sans, fontSize: "clamp(1rem, 1.4vw, 1.16rem)", fontWeight: 500, lineHeight: 1.65, color: "#464C5C", margin: "16px 0 0", maxWidth: "48ch" }}>
                Strategy sessions, solution design, scenario building, implementation and ongoing optimization — run
                with the people who built your system, alongside the technology that powers it.
              </p>
            </Reveal>
          </div>
          <Reveal delay={180}>
            <img
              src="/generated/plus-ops-team.webp"
              alt="A ShipTime Plus operator and a customer's operations manager reviewing a logistics plan together"
              width={1024}
              height={1024}
              loading="lazy"
              style={{ width: "100%", height: "auto", borderRadius: 22, display: "block", border: `1px solid ${P.line}` }}
            />
          </Reveal>
        </div>

        {/* the design target — split, statement beside the triangle */}
        <div className="v3-split" style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: "clamp(40px, 6vw, 88px)", alignItems: "center", marginTop: "clamp(64px, 8vw, 112px)" }}>
          <div>
            <Reveal>
              <Eyebrow>The design target</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h3 style={{ ...serif, fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", lineHeight: 1.1, color: P.ink, margin: "18px 0 0" }}>
                Every system optimizes the <span style={{ fontStyle: "italic" }}>Performance Triangle.</span>
              </h3>
            </Reveal>
            <div style={{ marginTop: "clamp(24px, 3vw, 36px)" }}>
              {["Reduce shipping costs", "Improve delivery times", "Improve the customer experience"].map((t, i) => (
                <Reveal key={t} delay={160 + i * 90}>
                  <div style={{ display: "flex", gap: 18, alignItems: "baseline", padding: "17px 0", borderTop: `1px solid ${P.line}` }}>
                    <span style={{ ...serif, fontSize: 20, color: P.orange, flex: "none", width: 32 }}>{String(i + 1).padStart(2, "0")}</span>
                    <h4 style={{ ...serif, fontSize: "clamp(1.25rem, 1.9vw, 1.5rem)", lineHeight: 1.2, color: P.ink, margin: 0 }}>{t}</h4>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={180}>
            <OutcomeTriangle />
          </Reveal>
        </div>
      </div>
    </Sect>
  );
}

// ── 06 WHAT WE BRING — capabilities as proof, not pitch ──────────────────────
// Michael's "at our disposal" list, complete (incl. customs brokerage — new).
// The UI vignettes are illustrative mocks — every figure is a real proposal
// number: $9.63/$16.71/$19.28 lane averages (slide 9), 20%+ same-day reach
// (slide 7). Do not invent new numbers here.
const DISPOSAL = [
  "Network of warehouses",
  "Multi-modal — package through to FTL",
  "Discounted carrier rates",
  "Leading couriers and LTL/FTL carriers",
  "Customs brokerage services",
  "Technology platform + integration library",
  "Analytics and continuous optimization",
  "Expert and responsive support",
];

// tiny mock-UI primitives for the bento vignettes
function UiPanel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${P.line}`, borderRadius: 12, boxShadow: "0 14px 30px -22px rgba(28,30,61,0.4)", ...style }}>
      {children}
    </div>
  );
}

function Toggle({ on }: { on?: boolean }) {
  return (
    <span aria-hidden style={{ width: 27, height: 16, borderRadius: 999, background: on ? P.orange : "#D6D9E0", position: "relative", flex: "none", display: "inline-block" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 13 : 2, width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
    </span>
  );
}

function CarrierMock() {
  const carriers: [string, boolean][] = [["FedEx", true], ["Purolator", true], ["Canada Post", true], ["UPS", false], ["Your rates · BYOR", true]];
  const lanes: [string, string][] = [["GTA", "$9.63"], ["Eastern Canada", "$16.71"], ["Western Canada", "$19.28"]];
  return (
    <div className="v3-mockrow" style={{ display: "flex", gap: 12, width: "100%", maxWidth: 480, justifyContent: "center" }}>
      <UiPanel style={{ flex: 1.15, padding: "5px 15px", minWidth: 0 }}>
        {carriers.map(([name, on], i) => (
          <div key={name} style={{ ...sans, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontSize: 13.5, fontWeight: 600, color: name.includes("BYOR") ? P.orange : P.ink, padding: "10px 0", borderTop: i ? `1px solid ${P.line}` : "none", whiteSpace: "nowrap" }}>
            {name} <Toggle on={on} />
          </div>
        ))}
      </UiPanel>
      <UiPanel style={{ flex: 1, padding: "11px 15px", alignSelf: "center", minWidth: 0 }}>
        <div style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P.sub }}>Avg cost / parcel</div>
        {lanes.map(([lane, price]) => (
          <div key={lane} style={{ ...sans, display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, color: "#4A5060", padding: "9px 0", borderBottom: `1px solid ${P.line}`, whiteSpace: "nowrap" }}>
            <span>{lane}</span>
            <span style={{ fontWeight: 700, color: P.ink }}>{price}</span>
          </div>
        ))}
        <div style={{ ...sans, fontSize: 11.5, color: P.sub, paddingTop: 9 }}>Negotiated rates, passed through</div>
      </UiPanel>
    </div>
  );
}

function OrderMock() {
  const steps: { s: string; d: string; live?: boolean }[] = [
    { s: "Out for delivery", d: "GTA last mile", live: true },
    { s: "Picked & packed", d: "Toronto warehouse" },
    { s: "Inventory placed", d: "YYZ node" },
    { s: "Order received", d: "Shopify · #48122" },
  ];
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 280 }}>
      <UiPanel style={{ padding: "7px 16px" }}>
        {steps.map((st, i) => (
          <div key={st.s} style={{ display: "flex", gap: 11, alignItems: "baseline", padding: "9px 0", borderTop: i ? `1px solid ${P.line}` : "none" }}>
            <span className={st.live ? "pk-pulse" : undefined} style={{ width: 8, height: 8, borderRadius: "50%", background: st.live ? P.orange : "#C9CDD6", flex: "none", transform: "translateY(-1px)" }} />
            <div>
              <div style={{ ...sans, fontSize: 13.5, fontWeight: 700, color: P.ink }}>{st.s}</div>
              <div style={{ ...sans, fontSize: 12, color: P.sub }}>{st.d}</div>
            </div>
          </div>
        ))}
      </UiPanel>
      <span style={{ ...sans, position: "absolute", top: -11, right: -6, transform: "rotate(2deg)", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#fff", background: P.orange, borderRadius: 6, padding: "4px 9px" }}>
        ShipTime ops
      </span>
    </div>
  );
}

function NodesMock() {
  const nodes = [
    { x: 48, y: 60, l: "YVR", hot: false },
    { x: 125, y: 32, l: "YYZ", hot: true },
    { x: 204, y: 64, l: "YUL", hot: false },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 280 }}>
      <UiPanel style={{ padding: "12px 15px 6px" }}>
        <svg viewBox="0 0 250 96" fill="none" style={{ width: "100%", height: "auto", display: "block" }} aria-hidden>
          <line x1="48" y1="60" x2="125" y2="32" stroke={P.line} strokeDasharray="2 5" />
          <line x1="125" y1="32" x2="204" y2="64" stroke={P.line} strokeDasharray="2 5" />
          {nodes.map((n) => (
            <g key={n.l}>
              <rect x={n.x - 21} y={n.y - 13} width="42" height="26" rx="7" fill={n.hot ? P.orange : P.panelSoft} stroke={n.hot ? P.orange : P.line} />
              <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" style={sans} fontSize="11.5" fontWeight="700" fill={n.hot ? "#fff" : P.ink}>{n.l}</text>
              {n.hot && <circle className="pk-pulse" cx={n.x + 21} cy={n.y - 13} r="4" fill={P.orange} />}
            </g>
          ))}
        </svg>
        {[["SKU 4812", "YYZ · demand east"], ["SKU 1177", "YVR · demand west"]].map(([sku, to]) => (
          <div key={sku} style={{ ...sans, display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12.5, color: "#4A5060", padding: "8px 2px", borderTop: `1px solid ${P.line}` }}>
            <span style={{ fontWeight: 700, color: P.ink }}>{sku}</span>
            <span>→ {to}</span>
          </div>
        ))}
      </UiPanel>
    </div>
  );
}

function RouteMock() {
  const stops: [number, number, string][] = [[336, 16, "GTA"], [352, 46, "Ottawa"], [336, 76, "Montréal"]];
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <UiPanel style={{ padding: "18px 18px 14px" }}>
        <svg viewBox="0 0 440 96" fill="none" style={{ width: "100%", height: "auto", display: "block" }} aria-hidden>
          <rect x="4" y="31" width="72" height="30" rx="8" fill={P.panelSoft} stroke={P.line} />
          <text x="40" y="46" textAnchor="middle" dominantBaseline="central" style={sans} fontSize="12" fontWeight="700" fill={P.ink}>US DC</text>
          <line x1="76" y1="46" x2="184" y2="46" stroke={P.line} strokeWidth="2" />
          <line className="pk-dash" x1="76" y1="46" x2="184" y2="46" stroke={P.orange} strokeWidth="2" strokeDasharray="5 9" />
          <text x="130" y="28" textAnchor="middle" style={sans} fontSize="10.5" fontWeight="700" letterSpacing="1.2" fill={P.sub}>BULK LINEHAUL</text>
          <rect x="184" y="27" width="100" height="38" rx="10" fill={P.dark} />
          <text x="234" y="46" textAnchor="middle" dominantBaseline="central" style={sans} fontSize="12" fontWeight="700" fill="#fff">Toronto hub</text>
          {stops.map(([x, y, l]) => (
            <g key={l}>
              <line x1="284" y1="46" x2={x - 8} y2={y} stroke={P.line} strokeWidth="1.5" strokeDasharray="2 5" />
              <circle cx={x} cy={y} r="4" fill={P.orange} />
              <text x={x + 10} y={y} dominantBaseline="central" style={sans} fontSize="11.5" fontWeight="600" fill={P.ink}>{l}</text>
            </g>
          ))}
        </svg>
      </UiPanel>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        <span style={{ ...sans, fontSize: 12.5, fontWeight: 700, color: P.orange, background: P.orangeTint, borderRadius: 999, padding: "7px 15px" }}>
          20%+ of Canada within same-day reach
        </span>
      </div>
    </div>
  );
}

function ReturnsMock() {
  return (
    <div style={{ width: "100%", maxWidth: 260 }}>
      <UiPanel style={{ padding: "15px 17px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div>
            <div style={{ ...sans, fontSize: 13.5, fontWeight: 700, color: P.ink }}>RMA-2481</div>
            <div style={{ ...sans, fontSize: 12, color: P.sub }}>Return label created</div>
          </div>
          <div aria-hidden style={{ width: 54, height: 26, background: `repeating-linear-gradient(90deg, ${P.ink} 0 2px, transparent 2px 5px)`, borderRadius: 3, opacity: 0.7 }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 13, flexWrap: "wrap" }}>
          <span style={{ ...sans, fontSize: 11.5, fontWeight: 700, color: P.orange, background: P.orangeTint, borderRadius: 999, padding: "5px 11px" }}>Approved</span>
          <span style={{ ...sans, fontSize: 11.5, fontWeight: 600, color: "#4A5060", background: P.panelSoft, border: `1px solid ${P.line}`, borderRadius: 999, padding: "5px 11px" }}>Restock → Toronto</span>
        </div>
      </UiPanel>
    </div>
  );
}

function PerfMock() {
  const bars = [62, 56, 58, 47, 42, 36, 30];
  return (
    <div style={{ width: "100%", maxWidth: 260 }}>
      <UiPanel style={{ padding: "14px 17px 12px" }}>
        <div style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P.sub }}>Cost / shipment</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 64, marginTop: 10 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: h, borderRadius: 4, background: i === bars.length - 1 ? P.orange : "#D8DBE2" }} />
          ))}
        </div>
        <div style={{ ...sans, fontSize: 12, color: "#4A5060", marginTop: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
          <span>Reviewed continuously</span>
          <span style={{ color: P.orange, fontWeight: 700 }}>↓ trending</span>
        </div>
      </UiPanel>
    </div>
  );
}

function Bento({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="pk-lift" style={{ height: "100%", background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", flex: 1, minHeight: 248, background: P.panelSoft, borderBottom: `1px solid ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "34px 26px" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, ...dots("rgba(28,30,61,0.05)", 11, 1.4) }} />
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>{children}</div>
      </div>
      <div style={{ padding: "24px 30px 30px" }}>
        <h3 style={{ ...serif, fontSize: "clamp(1.45rem, 2.1vw, 1.75rem)", lineHeight: 1.12, color: P.ink, margin: 0 }}>{title}</h3>
        <p style={{ ...sans, fontSize: 14, lineHeight: 1.62, color: "#4A5060", margin: "8px 0 0" }}>{body}</p>
      </div>
    </div>
  );
}

function StatementCard() {
  return (
    <div style={{ position: "relative", overflow: "hidden", height: "100%", minHeight: 290, background: P.dark, borderRadius: 20, display: "flex", flexDirection: "column", justifyContent: "center", padding: "38px 36px" }}>
      <div aria-hidden style={{ position: "absolute", right: -50, top: -55, width: 190, height: 190, ...dots("rgba(236,90,38,0.4)", 10, 1.8), WebkitMaskImage: "radial-gradient(closest-side, black 35%, transparent 72%)", maskImage: "radial-gradient(closest-side, black 35%, transparent 72%)" }} />
      <span style={{ position: "relative", display: "inline-flex" }}><Sparkle size={15} pulse /></span>
      <p style={{ ...serif, fontStyle: "italic", position: "relative", fontSize: "clamp(1.35rem, 2.1vw, 1.7rem)", lineHeight: 1.28, color: P.onDark, margin: "14px 0 0" }}>
        Efficiencies a standalone warehouse or parcel provider can&rsquo;t reach.
      </p>
      <p style={{ ...sans, position: "relative", fontSize: 12.5, color: P.onDarkDim, margin: "12px 0 0" }}>— the point of one integrated network</p>
    </div>
  );
}

const BENTO: { span: 2 | 4; title: string; body: string; mock: ReactNode }[] = [
  { span: 4, title: "Every carrier, one decision.", body: "Rules-based rate shopping across our negotiated rates and yours — balancing cost, speed and service on each shipment.", mock: <CarrierMock /> },
  { span: 2, title: "Fulfillment, run with you.", body: "Warehousing and order fulfillment in the certified partner network, handled alongside our ops team.", mock: <OrderMock /> },
  { span: 2, title: "Inventory where demand is.", body: "Stock placed by demand patterns, and every order shipped from the node that wins.", mock: <NodesMock /> },
  { span: 4, title: "Skip zones. Inject direct.", body: "Consolidate the linehaul, inject into regional networks — less transit time and less cost per order.", mock: <RouteMock /> },
  { span: 2, title: "Returns without the fire drill.", body: "Flexible return labels and routing, restocked straight back into the network.", mock: <ReturnsMock /> },
  { span: 2, title: "Performance you can see.", body: "Carrier management and reporting, reviewed continuously — never set-and-forget.", mock: <PerfMock /> },
];

function WhatWeBring() {
  return (
    <Sect>
      <div style={{ ...inner }}>
        <Reveal>
          <SectionHead
            eyebrow="06 · What we bring"
            heading={<>The capabilities <span style={{ fontStyle: "italic" }}>behind the design.</span></>}
            lead="None of this is the pitch. It's what makes the design credible — everything at our disposal when we build your operating system."
          />
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: "clamp(30px, 4vw, 44px)", maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
            {DISPOSAL.map((t) => (
              <span key={t} style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 14, fontWeight: 600, color: P.ink, background: P.card, border: `1px solid ${P.line}`, borderRadius: 999, padding: "10px 18px" }}>
                <span style={{ width: 5, height: 5, background: P.orange, flex: "none" }} />
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="v3-bento" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 18, marginTop: "clamp(52px, 7vw, 84px)" }}>
          {BENTO.map((b, i) => (
            <Reveal key={b.title} className={b.span === 4 ? "v3-s4" : "v3-s2"} delay={(i % 3) * 90}>
              <Bento title={b.title} body={b.body}>{b.mock}</Bento>
            </Reveal>
          ))}
          <Reveal className="v3-s2" delay={180}>
            <StatementCard />
          </Reveal>
        </div>

        {/* the technology superpower + the Shiplets dashboard deliverable
            (Michael OK'd showing it pre-implementation, labelled as coming) */}
        <Reveal delay={220}>
          <div className="v3-ceiling" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "18px 30px", marginTop: 18, background: P.dark, borderRadius: 20, padding: "clamp(26px, 3.5vw, 38px) clamp(28px, 3.5vw, 46px)", position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", left: -50, bottom: -60, width: 210, height: 210, ...dots("rgba(236,90,38,0.4)", 10, 1.8), WebkitMaskImage: "radial-gradient(closest-side, black 35%, transparent 72%)", maskImage: "radial-gradient(closest-side, black 35%, transparent 72%)" }} />
            <p style={{ ...sans, position: "relative", fontSize: "clamp(1rem, 1.4vw, 1.16rem)", fontWeight: 500, lineHeight: 1.6, color: "rgba(244,245,248,0.86)", margin: 0, maxWidth: "58ch" }}>
              The platform underneath is ours — built in-house over 15 years, powerful, easy to use and malleable, with
              a large library of integrations.
            </p>
            <span style={{ ...sans, position: "relative", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 700, color: "#fff", background: P.orange, borderRadius: 999, padding: "8px 16px", whiteSpace: "nowrap" }}>
              <Sparkle size={12} color="#fff" /> Custom dashboards with Shiplets — rolling out
            </span>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 05 THE INTEGRATION LIBRARY — plugs into what you already run ─────────────
// Michael's "technology platform … large library of integrations", shown as
// orbiting integration categories around the network globe. Names below stay
// generic-category until marketing signs off specific logos ("and more" per
// the 2026-07-30 marketing sync).
const INTEGRATION_NAMES = [
  "Shopify", "Amazon", "WooCommerce", "BigCommerce", "NetSuite", "QuickBooks", "FedEx", "Purolator", "Canada Post", "UPS",
];

function Integrations() {
  return (
    <Sect bg={P.panelSoft} style={{ borderBottom: `1px solid ${P.line}` }}>
      <div style={{ ...inner, paddingBottom: 0 }}>
        <Reveal>
          <SectionHead
            eyebrow="05 · The integration library"
            heading={<>Plugs into what you <span style={{ fontStyle: "italic" }}>already run.</span></>}
            lead="Storefronts, marketplaces, ERPs and carriers — a large library of integrations, connected through one malleable platform."
          />
        </Reveal>
        <Reveal delay={120}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 9, marginTop: "clamp(26px, 3.5vw, 40px)" }}>
            {INTEGRATION_NAMES.map((n) => (
              <span key={n} style={{ ...sans, fontSize: 13, fontWeight: 600, color: "#4A5060", background: P.card, border: `1px solid ${P.line}`, borderRadius: 999, padding: "7px 15px" }}>
                {n}
              </span>
            ))}
            <span style={{ ...sans, fontSize: 13, fontWeight: 700, color: P.orange, background: P.orangeTint, borderRadius: 999, padding: "7px 15px" }}>
              + 30 more
            </span>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ marginTop: "clamp(20px, 3vw, 36px)" }}>
            <OrbitingIntegrations />
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 07 THE INFRASTRUCTURE — credibility, straight from the proposal ──────────
const STATS = [
  { v: "2M+", l: "shipments managed per year" },
  { v: "20 yrs", l: "shipping and logistics experience" },
  { v: "1,000+", l: "active platform merchants" },
  { v: "8", l: "in-house software engineers" },
];

const BACKING = [
  "Long-standing carrier relationships and buying power",
  "Full-stack technology owned and built over 15 years",
  "Certified warehouse partners across the network",
  "In-house Canadian support team — calls, texts and email",
  "Offices in Canada and the US",
  "Well funded, public company",
];

function Infrastructure() {
  return (
    <Sect bg={P.dark}>
      <HalftoneBlob color="rgba(236,90,38,0.28)" style={{ width: 440, height: 440, right: -130, bottom: -170 }} />
      <div style={{ ...inner, position: "relative" }}>
        <Reveal>
          <SectionHead
            eyebrow="07 · The infrastructure behind it"
            heading={<>Not a startup experiment. <span style={{ fontStyle: "italic" }}>A network already running.</span></>}
            onDark
          />
        </Reveal>
        <div className="v3-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginTop: "clamp(56px, 7vw, 88px)" }}>
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 90}>
              <div style={{ height: "100%", borderRadius: 18, border: `1px solid ${P.darkLine}`, background: "rgba(255,255,255,0.04)", padding: "32px 28px 34px" }}>
                <div style={{ ...serif, fontSize: "clamp(2rem, 3.6vw, 2.9rem)", lineHeight: 1, color: P.orange }}>{s.v}</div>
                <div style={{ ...sans, fontSize: 13, lineHeight: 1.5, color: P.onDarkDim, marginTop: 10 }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="v3-backing" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px 40px", marginTop: "clamp(44px, 5vw, 62px)" }}>
          {BACKING.map((b, i) => (
            <Reveal key={b} delay={(i % 3) * 80}>
              <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                <Sparkle size={14} />
                <span style={{ ...sans, fontSize: 14, lineHeight: 1.55, color: P.onDarkDim }}>{b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Sect>
  );
}

// ── 08 PROOF — the case, design-first framing (Chris: not "money we save") ───
function Proof() {
  return (
    <Sect bg={P.panelSoft} style={{ borderTop: `1px solid ${P.line}` }}>
      <div style={{ ...inner }}>
        <Reveal>
          <SectionHead eyebrow="08 · Proof" heading={<>A designed system, <span style={{ fontStyle: "italic" }}>measured.</span></>} />
        </Reveal>

        <Reveal delay={120}>
          <div className="v3-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px, 4vw, 60px)", alignItems: "center", marginTop: "clamp(52px, 7vw, 84px)", borderRadius: 22, border: `1px solid ${P.line}`, background: P.card, padding: "clamp(32px, 4.5vw, 60px)" }}>
            <div>
              <span style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.sub }}>
                US consumer brand · entering Canada
              </span>
              <h3 style={{ ...serif, fontSize: "clamp(1.6rem, 3vw, 2.3rem)", lineHeight: 1.15, color: P.ink, margin: "14px 0 0" }}>
                They didn&rsquo;t need a cheaper label. They needed a Canadian operation designed from scratch.
              </h3>
              <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.68, color: P.sub, margin: "14px 0 0", maxWidth: "46ch" }}>
                Every order was shipping from Texas at premium cross-border rates, with customs delays their customers
                felt. We designed a four-phase entry: bulk shipping first, then Canadian fulfillment, then last-mile
                injection, then expansion across the network.
              </p>
              <Link href="/plus/case-studies/market-entry-canada" className="st-cta" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, fontSize: 14, fontWeight: 700, color: P.ink, textDecoration: "none", borderBottom: `1px solid ${P.line}`, paddingBottom: 3 }}>
                Read the case study <ArrowRight size={14} />
              </Link>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                <span style={{ ...serif, fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", color: P.faint, textDecoration: "line-through", textDecorationColor: P.orange }}>$25.00</span>
                <span style={{ ...serif, fontSize: "clamp(3rem, 6vw, 4.6rem)", lineHeight: 1, color: P.orange }}>$13.22</span>
                <span style={{ ...sans, fontSize: 12.5, color: P.sub }}>delivered cost per shipment</span>
              </div>
              <div className="v3-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 26 }}>
                {[
                  ["40–50%", "lower transportation costs"],
                  ["~$600K", "saved per year on shipping"],
                  ["Faster", "delivery, no customs delays"],
                ].map(([v, l]) => (
                  <div key={l} style={{ borderRadius: 14, border: `1px solid ${P.line}`, background: P.panelSoft, padding: "16px 16px 18px" }}>
                    <div style={{ ...serif, fontSize: "clamp(1.2rem, 2vw, 1.7rem)", color: P.ink }}>{v}</div>
                    <div style={{ ...sans, fontSize: 11.5, lineHeight: 1.5, color: P.sub, marginTop: 5 }}>{l}</div>
                  </div>
                ))}
              </div>
              <p style={{ ...sans, fontSize: 11.5, color: P.faint, margin: "14px 0 0" }}>
                Anonymized pending customer permission. Figures from the delivered proposal.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── CLOSE — the Logistics Performance Score offer ────────────────────────────
// Retell's photo-backed CTA: full-bleed lifestyle shot, floating light card.
// Chris: stronger than a contact form. Michael: rates them against world-class
// logistics. Routes to the existing /plus/assessment questionnaire.
function LpsCta() {
  return (
    <Sect bg={P.dark}>
      <img
        src="/generated/plus-cta-operator.webp"
        alt=""
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }}
      />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(28,30,61,0.18) 0%, rgba(28,30,61,0.02) 45%, rgba(28,30,61,0.12) 100%)" }} />

      <div style={{ ...inner, position: "relative", minHeight: "min(92svh, 860px)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        {/* Retell card anatomy: heading top-left + portrait tile top-right,
            generous quiet middle, short line + buttons at the bottom. */}
        <div className="v3-ctacard" style={{ background: "rgba(251,251,252,0.97)", borderRadius: 22, padding: "clamp(30px, 3.6vw, 46px)", maxWidth: 560, width: "100%", minHeight: "min(64svh, 560px)", display: "flex", flexDirection: "column", boxShadow: "0 30px 70px -30px rgba(16,18,38,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
            <h2 style={{ ...serif, fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", lineHeight: 1.1, color: P.ink, margin: 0, maxWidth: "13ch" }}>
              How close is your logistics to <span style={{ fontStyle: "italic" }}>world class?</span>
            </h2>
            <img
              src="/generated/plus-people-portrait.webp"
              alt=""
              width={1024}
              height={1024}
              loading="lazy"
              style={{ width: "clamp(84px, 9vw, 124px)", height: "auto", borderRadius: 14, display: "block", flex: "none" }}
            />
          </div>
          <div style={{ flex: 1, minHeight: 48 }} />
          <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: "#4A5060", margin: 0, maxWidth: "30ch" }}>
            Twelve questions. Your Logistics Performance Score, in minutes.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
            <PillLink href="/plus/assessment">
              Get your score <ArrowRight size={15} />
            </PillLink>
            <GhostLink href="/plus/book-a-call">Book a call</GhostLink>
          </div>
        </div>
      </div>
    </Sect>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export function PlusHomeV3() {
  return (
    <div style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
      <Hero />
      <Problems />
      <WhoItsFor />
      <WhyDifferent />
      <PeopleInterlude />
      <HowWeWork />
      <Integrations />
      <WhatWeBring />
      <Infrastructure />
      <Proof />
      <LpsCta />

      <PlusKitMotion />
      <style>{`
        @media (prefers-reduced-motion: reduce) { .pk-herovid { display: none; } .v3-mq [class*="animate-"] { animation: none !important; } }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes v3-travel-kf { from { offset-distance: 0%; } to { offset-distance: 100%; } }
          .v3-travel { animation: v3-travel-kf 12s linear infinite; }
          /* hero aurora drift */
          @keyframes v3-aur-a-kf { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(9vw, 7vh) scale(1.18); } }
          @keyframes v3-aur-b-kf { 0%, 100% { transform: translate(0, 0) scale(1.12); } 50% { transform: translate(-7vw, 9vh) scale(0.94); } }
          @keyframes v3-aur-c-kf { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(6vw, -8vh) scale(1.22); } }
          .v3-aur-a { animation: v3-aur-a-kf 17s ease-in-out infinite; }
          .v3-aur-b { animation: v3-aur-b-kf 23s ease-in-out infinite; }
          .v3-aur-c { animation: v3-aur-c-kf 29s ease-in-out infinite; }
          /* interlude choreography — keyed off the Reveal wrapper */
          .v3-word { overflow: hidden; }
          .v3-word-in { display: inline-block; transform: translateY(108%); transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1); }
          [data-reveal="in"] .v3-word-in { transform: translateY(0); }
          .v3-face { opacity: 0; transform: scale(0.82); transition: opacity 0.9s ease 0.2s, transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s; }
          [data-reveal="in"] .v3-face { opacity: 1; transform: scale(1); }
          .v3-caption-in { opacity: 0; transform: translateY(14px); transition: opacity 0.8s ease 0.75s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.75s; }
          [data-reveal="in"] .v3-caption-in { opacity: 1; transform: translateY(0); }
        }
        .v3-s4 { grid-column: span 4; }
        .v3-s2 { grid-column: span 2; }
        @media (max-width: 880px) {
          .v3-cards, .v3-stats, .v3-backing { grid-template-columns: 1fr !important; }
          .v3-split { grid-template-columns: 1fr !important; }
          .v3-steprow { grid-template-columns: 1fr !important; gap: 14px !important; }
          .v3-stepglyph { justify-self: start !important; }
          .v3-bento { grid-template-columns: 1fr !important; }
          .v3-s4, .v3-s2 { grid-column: auto; }
          .v3-mockrow { flex-direction: column; align-items: center; }
        }
        @media (min-width: 881px) and (max-width: 1100px) {
          .v3-cards, .v3-stats, .v3-backing { grid-template-columns: repeat(2, 1fr) !important; }
          .v3-bento { grid-template-columns: repeat(2, 1fr) !important; }
          .v3-s4 { grid-column: 1 / -1; }
          .v3-s2 { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
