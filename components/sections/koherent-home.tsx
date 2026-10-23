import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import { KoherentHeroArt } from "./koherent-hero-art";
import { ConsoleView, MethodPlayer, NetworkLive } from "./koherent-motion";

// ── /koherent — first revision (Oct 23, 2026) ────────────────────────────────
// The enterprise site under the Koherent name, replacing ShipTime One (Oct 22
// L10). Sources, in order of authority:
//   - Michael's notes on /plus/v3 (email "New website", Oct 19): strong logo
//     top left; one sentence that sums up the problem before the questions;
//     his three extra questions; "one system answers these and more"; drop the
//     $100M+ banner; broaden to anyone shipping to consumers (InnoWave); order
//     = what we bring → how we work → the design target → the people, and
//     only then why we're different; three case studies; less content per
//     section with a way to go deeper.
//   - The brand deck "Make it coherent." (Oct 22): the idea, the K, plum,
//     Schibsted Grotesk + JetBrains Mono, triangle and steps as the only
//     shapes, "one number per order", the positioning statement.
//   - Chris (Oct 22): the first step is taking cost out, from their own order
//     data and our network, not "cheaper rates"; we work alongside them and
//     they keep control; "how we work" is the product.
// Case-study figures are proposals, labelled as such on the page. PG Golf's
// "~$600K a year" is left out on purpose: its real volume is a fraction of the
// model it came from.

// ── tokens (deck slide 36) ───────────────────────────────────────────────────
const K = {
  ink: "#17101C",
  plum: "#461948",
  violet: "#6E3A80",
  lilac: "#C7AEE6",
  mist: "#EEE8F3",
  paper: "#F6F3EE",
  card: "#FFFDFA",
  stone: "#6A6272",
  line: "#DCD4E2",
  onDark: "#F6F3EE",
  onDarkDim: "rgba(246,243,238,0.74)",
  darkLine: "rgba(246,243,238,0.16)",
};

const sans: CSSProperties = { fontFamily: "var(--font-schibsted), 'Schibsted Grotesk', system-ui, sans-serif" };
const mono: CSSProperties = { fontFamily: "var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace" };
const display: CSSProperties = { ...sans, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 0.98 };
const title: CSSProperties = { ...sans, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.08 };

const inner: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "clamp(76px, 9vw, 140px) clamp(20px, 4vw, 56px)",
};

// ── the K and the shapes cut from it (deck slides 16–17, 26) ─────────────────
// Drawn on a 12×12 grid: an upright bar, then an arrowhead whose tip stops
// short of the bar. The gap is the point ("where our people sit at your
// table"), so it never closes.
const K_BAR = "M0 0 H3 V12 H0 Z";
const K_ARROW = "M8.6 0 H12 L7.9 6 L12 12 H8.6 L4.5 6 Z";

function KMark({ color = K.plum, style }: { color?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden style={{ display: "inline-block", ...style }}>
      <path d={K_BAR} fill={color} />
      <path d={K_ARROW} fill={color} />
    </svg>
  );
}

// The K is the first letter of the name (deck slide 18): one K, as tall as the
// capitals and as thick as the letters, never a K next to the word.
function Logo({ size = 28, color = K.plum }: { size?: number; color?: string }) {
  return (
    <span
      aria-label="Koherent"
      role="img"
      style={{ ...sans, fontSize: size, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color, whiteSpace: "nowrap" }}
    >
      <KMark color={color} style={{ height: "0.71em", width: "0.71em", marginRight: "0.035em", verticalAlign: "baseline" }} />
      <span aria-hidden>oherent</span>
    </span>
  );
}

// The steps: the arrowhead turned and repeated. Only ever shows progress.
function Steps({ total, done, size = 14, onDark = false }: { total: number; done: number; size?: number; onDark?: boolean }) {
  return (
    <span aria-hidden style={{ display: "inline-flex", gap: size * 0.28 }}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} className="k-chev" viewBox="0 0 8 12" style={{ width: size * 0.67, height: size, transitionDelay: `${i * 70}ms` }}>
          <path d="M0 0 H3.4 L8 6 L3.4 12 H0 L4.6 6 Z" fill={i < done ? (onDark ? K.lilac : K.plum) : onDark ? "rgba(199,174,230,0.25)" : K.line} />
        </svg>
      ))}
    </span>
  );
}

// ── small primitives ─────────────────────────────────────────────────────────
function Sect({ id, children, bg = K.paper, style }: { id?: string; children: ReactNode; bg?: string; style?: CSSProperties }) {
  return (
    <section id={id} style={{ position: "relative", overflow: "hidden", background: bg, scrollMarginTop: 72, ...style }}>
      {children}
    </section>
  );
}

function Label({ children, onDark = false, style }: { children: ReactNode; onDark?: boolean; style?: CSSProperties }) {
  return (
    <p style={{ ...mono, fontSize: 12.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: onDark ? K.lilac : K.violet, margin: 0, ...style }}>
      {children}
    </p>
  );
}

function Head({ label, heading, lead, onDark = false, center = true }: { label: string; heading: ReactNode; lead?: ReactNode; onDark?: boolean; center?: boolean }) {
  return (
    <div style={{ maxWidth: center ? 820 : 760, margin: center ? "0 auto" : undefined, textAlign: center ? "center" : "left" }}>
      <Label onDark={onDark}>{label}</Label>
      <h2 style={{ ...title, fontSize: "clamp(2.1rem, 4.4vw, 3.5rem)", color: onDark ? K.onDark : K.ink, margin: "18px 0 0" }}>{heading}</h2>
      {lead && (
        <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", lineHeight: 1.6, color: onDark ? K.onDarkDim : K.stone, margin: "18px 0 0", maxWidth: "58ch", marginLeft: center ? "auto" : undefined, marginRight: center ? "auto" : undefined }}>
          {lead}
        </p>
      )}
    </div>
  );
}

function Primary({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className="k-btn"
      style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15.5, fontWeight: 700, color: onDark ? K.plum : K.paper, background: onDark ? K.paper : K.plum, borderRadius: 6, padding: "14px 22px", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}

function Secondary({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className="k-btn"
      style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15.5, fontWeight: 700, color: onDark ? K.onDark : K.ink, border: `1.5px solid ${onDark ? K.darkLine : K.line}`, borderRadius: 6, padding: "12.5px 20px", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}

// "Each key section lets the viewer go to a page with more detail" (Michael).
function More({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link href={href} className="k-more" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 700, color: onDark ? K.lilac : K.plum, textDecoration: "none" }}>
      {children} <ArrowRight size={15} />
    </Link>
  );
}

// ── nav ──────────────────────────────────────────────────────────────────────
// Michael: "In the top left we need a strong, prominent logo."
function Nav() {
  const links: [string, string][] = [
    ["What we bring", "#bring"],
    ["How we work", "#how"],
    ["Proof", "#proof"],
    ["Your score", "/plus/assessment"],
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(246,243,238,0.92)", backdropFilter: "saturate(1.4) blur(10px)", borderBottom: `1px solid ${K.line}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <Link href="/koherent" style={{ textDecoration: "none", display: "inline-flex" }}>
          <Logo size={30} />
        </Link>
        <nav className="k-navlinks" style={{ display: "flex", alignItems: "center", gap: 30 }}>
          {links.map(([l, h]) => (
            <Link key={l} href={h} className="k-navlink" style={{ ...sans, fontSize: 15, fontWeight: 500, color: K.ink, textDecoration: "none" }}>
              {l}
            </Link>
          ))}
        </nav>
        <Link href="/plus/book-a-call" className="k-btn" style={{ ...sans, fontSize: 14.5, fontWeight: 700, color: K.paper, background: K.plum, borderRadius: 6, padding: "10px 16px", textDecoration: "none", whiteSpace: "nowrap" }}>
          Talk to our team
        </Link>
      </div>
    </header>
  );
}

// ── hero ─────────────────────────────────────────────────────────────────────
// The deck's one idea as the headline; Chris's grounded first step under it.
// Text left, the visual right (Matteo, Oct 23): the problem pieces pull
// together into the K, the photo opens from the arrow tip behind the steps,
// and the cost card counts down to PG Golf's proposed figure. See
// koherent-hero-art.tsx. Everything below the hero stays centered.
function Hero() {
  return (
    <Sect>
      <div className="k-hero" style={{ ...inner, paddingTop: "clamp(56px, 7vw, 104px)", display: "grid", gridTemplateColumns: "1.12fr 0.88fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "center" }}>
        <div>
          <div className="k-fade" style={{ animationDelay: "0.05s" }}>
            <Label>Managed logistics network</Label>
          </div>
          <h1 className="k-fade" style={{ ...display, fontSize: "clamp(3.3rem, 8.4vw, 6.6rem)", color: K.plum, margin: "22px 0 0", animationDelay: "0.12s" }}>
            Make it coherent.
          </h1>
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.2rem, 1.9vw, 1.5rem)", fontWeight: 500, lineHeight: 1.45, color: K.ink, margin: "26px 0 0", maxWidth: "30ch", animationDelay: "0.24s" }}>
            One network. One view. One number per order. Run with you.
          </p>
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.02rem, 1.3vw, 1.12rem)", lineHeight: 1.65, color: K.stone, margin: "16px 0 0", maxWidth: "50ch", animationDelay: "0.32s" }}>
            We cut your shipping costs and simplify fulfillment with a plan built from your own order data and our
            network of carriers and warehouses. No rebuild, no new investment, and you stay in control.
          </p>
          <div className="k-fade" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34, animationDelay: "0.42s" }}>
            <Primary href="/plus/book-a-call">
              Talk to our team <ArrowRight size={16} />
            </Primary>
            <Secondary href="/plus/assessment">Get your Logistics Performance Score</Secondary>
          </div>
        </div>

        <div className="k-heroart" style={{ paddingLeft: 38 }}>
          <KoherentHeroArt
            src="/generated/plus-ops-team.webp"
            alt="An operator and a customer's operations lead reviewing a logistics plan together"
          />
        </div>
      </div>
    </Sect>
  );
}

// ── 01 the problem ───────────────────────────────────────────────────────────
// Michael: one sentence that sums up the problem, then the questions become
// the specifics of it. His three questions are in, and "one system answers
// all nine" becomes "these, and more".
const QUESTIONS: string[][] = [
  [
    "Why do our shipping costs keep rising?",
    "Should we be using regional carriers?",
    "Customers expect two-day delivery. Can we afford it?",
    "Why does service slip exactly when we grow?",
  ],
  [
    "How much inventory should we carry, and where?",
    "Which carriers actually bring the best value?",
    "How do we get the numbers we need to manage our logistics?",
    "DIY or outsource? Where's a 3PL we can trust?",
  ],
  [
    "What is this surcharge on our invoice?",
    "Why are returns becoming unmanageable?",
    "Are we set up for where we are, or where we're going?",
    "Why does every warehouse quote look different?",
  ],
];

const PIVOT: { title: string; body: string }[] = [
  { title: "We've heard every one.", body: "These aren't edge cases. They're what happens when growth outpaces logistics." },
  { title: "It's a design problem.", body: "Not a discipline problem. Everyone sold you a tool. Nobody designed the whole." },
  { title: "One system answers these, and more.", body: "Carriers, warehouses, inventory, returns and data, designed together instead of patched one by one." },
];

function QuestionChip({ children }: { children: ReactNode }) {
  return (
    <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500, color: K.ink, background: K.card, border: `1px solid ${K.line}`, borderRadius: 999, padding: "11px 20px", whiteSpace: "nowrap" }}>
      <KMark color={K.violet} style={{ width: 9, height: 9, flex: "none" }} />
      {children}
    </span>
  );
}

function Problem() {
  return (
    <Sect bg={K.mist}>
      <div style={{ ...inner, paddingLeft: 0, paddingRight: 0 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 56px)" }}>
          <Reveal>
            <Head
              label="01 · The problem"
              heading={<>Logistics isn&rsquo;t hard because it&rsquo;s big. It&rsquo;s hard because it&rsquo;s in pieces.</>}
              lead="Carriers here, warehouses there, spreadsheets everywhere, and nobody accountable for the whole. So the same questions keep coming back."
            />
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="k-mq" style={{ position: "relative", marginTop: "clamp(40px, 5vw, 60px)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div aria-hidden style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "clamp(40px, 8vw, 140px)", zIndex: 2, background: `linear-gradient(90deg, ${K.mist}, transparent)` }} />
            <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "clamp(40px, 8vw, 140px)", zIndex: 2, background: `linear-gradient(270deg, ${K.mist}, transparent)` }} />
            <Marquee pauseOnHover className="[--duration:46s] [--gap:0.75rem]" repeat={4}>
              {QUESTIONS[0].map((q) => <QuestionChip key={q}>{q}</QuestionChip>)}
            </Marquee>
            <Marquee pauseOnHover reverse className="[--duration:54s] [--gap:0.75rem]" repeat={4}>
              {QUESTIONS[1].map((q) => <QuestionChip key={q}>{q}</QuestionChip>)}
            </Marquee>
            <Marquee pauseOnHover className="[--duration:42s] [--gap:0.75rem]" repeat={4}>
              {QUESTIONS[2].map((q) => <QuestionChip key={q}>{q}</QuestionChip>)}
            </Marquee>
          </div>
        </Reveal>

        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, margin: "clamp(48px, 6vw, 72px) clamp(20px, 4vw, 56px) 0" }}>
          {PIVOT.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div style={{ height: "100%", borderTop: `2px solid ${i === 2 ? K.plum : K.line}`, paddingTop: 22, textAlign: "center" }}>
                <h3 style={{ ...title, fontSize: "clamp(1.3rem, 1.9vw, 1.55rem)", color: i === 2 ? K.plum : K.ink, margin: 0 }}>{p.title}</h3>
                <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.stone, margin: "10px 0 0" }}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Sect>
  );
}

// ── 02 who it's for ──────────────────────────────────────────────────────────
// Michael: broaden past e-commerce to anyone with a lot of orders going to
// consumers (InnoWave is a gift-box shipper, not a DTC brand), and replace the
// "$100M+" banner, which read as if we only work with very large companies.
// The traits come from Jennie's enterprise-fit profiles; the 500-a-month line
// is the deck's ShipTime → Koherent fork (slide 15), stated in plain words.
const TRAITS: { title: string; body: string }[] = [
  { title: "You ship to people's doors.", body: "Online brands, and businesses that deliver to consumers for someone else: gifts, programs, subscriptions, store to door." },
  { title: "You've outgrown a shipping app.", body: "A warehouse or a 3PL today, more than one site soon, and a shipping bill that matters to the plan." },
  { title: "You want to grow without the overhead.", body: "New regions, faster delivery, a new channel, without adding the people and systems to run it all." },
];

function WhoItsFor() {
  return (
    <Sect>
      <div style={{ ...inner }}>
        <Reveal>
          <Head label="02 · Who it's for" heading={<>For businesses with a lot of orders going to consumers.</>} />
        </Reveal>
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(40px, 5vw, 60px)" }}>
          {TRAITS.map((t, i) => (
            <Reveal key={t.title} delay={i * 90}>
              <div style={{ height: "100%", background: K.card, border: `1px solid ${K.line}`, borderRadius: 4, padding: "28px 28px 30px", textAlign: "center" }}>
                <Steps total={3} done={i + 1} />
                <h3 style={{ ...title, fontSize: "clamp(1.3rem, 1.9vw, 1.55rem)", color: K.ink, margin: "20px 0 0" }}>{t.title}</h3>
                <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.stone, margin: "10px 0 0" }}>{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="k-band" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, marginTop: 18, background: K.plum, borderRadius: 4, padding: "clamp(30px, 3.6vw, 44px) clamp(26px, 3.4vw, 44px)", position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "26%", background: K.violet, clipPath: "polygon(48% 0, 100% 0, 100% 100%, 48% 100%, 0 50%)", opacity: 0.45 }} />
            <div style={{ ...mono, position: "relative", fontSize: "clamp(2.2rem, 4.2vw, 3.2rem)", fontWeight: 500, lineHeight: 1, color: K.onDark }}>500+</div>
            <p style={{ ...sans, position: "relative", fontSize: "clamp(1rem, 1.35vw, 1.14rem)", lineHeight: 1.6, color: K.onDarkDim, margin: 0, maxWidth: "56ch" }}>
              <strong style={{ color: K.onDark }}>You don&rsquo;t need to be huge.</strong>{" "}Koherent starts to pay off at
              around 500 orders a month, and there&rsquo;s no ceiling. Smaller than that? ShipTime is built for you.
            </p>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 03 what we bring ─────────────────────────────────────────────────────────
// Michael's building blocks, in his order, with the lattice he asked for: our
// carriers, warehouses and systems coming together at one point, which is
// also what the K's arrowhead means. Labels stay generic (no warehouse
// cities) until the partner list is confirmed.
const BLOCKS: { title: string; body: string; tag?: string }[] = [
  { title: "Integrated carriers", body: "Couriers, regional carriers, LTL and FTL, compared on every shipment for cost and speed." },
  { title: "Discounted rates", body: "Our buying power, passed through to you. Or bring your own rates and we'll use those too." },
  { title: "A warehouse network", body: "Certified partner warehouses in Canada and the US. We don't own them; we pick the right ones for you." },
  { title: "The integration library", body: "Shopify, Amazon, NetSuite, QuickBooks and 30 more. It plugs into what you already run." },
  { title: "Shiplets", body: "Small custom apps for the one workflow that's yours alone, built in days on the same platform.", tag: "Rolling out" },
  { title: "People and support", body: "Experienced operators and a support team that knows your account. Calls, texts and email." },
];

const STATS: [string, string][] = [
  ["2M+", "shipments managed a year"],
  ["20 yrs", "in shipping and logistics"],
  ["1,000+", "businesses on the platform"],
];

function WhatWeBring() {
  return (
    <Sect id="bring">
      <div style={{ ...inner, paddingTop: 0 }}>
        <Reveal>
          <Head
            label="03 · What we bring"
            heading={<>Everything a coherent operation needs. Already connected.</>}
            lead="The building blocks we design with. You use the ones you need, and we connect them into one network you can see in one place."
          />
        </Reveal>
        <Reveal delay={100}>
          <div style={{ marginTop: "clamp(28px, 4vw, 48px)" }}>
            <NetworkLive />
          </div>
        </Reveal>
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 36px", marginTop: "clamp(28px, 4vw, 48px)" }}>
          {BLOCKS.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 80}>
              <div style={{ borderTop: `1px solid ${K.line}`, padding: "22px 0 26px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                  <h3 style={{ ...title, fontSize: "clamp(1.15rem, 1.6vw, 1.3rem)", color: K.ink, margin: 0 }}>{b.title}</h3>
                  {b.tag && (
                    <span style={{ ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: K.plum, background: K.mist, borderRadius: 999, padding: "4px 10px" }}>
                      {b.tag}
                    </span>
                  )}
                </div>
                <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.stone, margin: "8px 0 0" }}>{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={160}>
          <div className="k-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: "clamp(24px, 3vw, 36px)", borderTop: `1px solid ${K.line}`, paddingTop: 30, textAlign: "center" }}>
            {STATS.map(([v, l]) => (
              <div key={l}>
                <div style={{ ...mono, fontSize: "clamp(1.9rem, 3.2vw, 2.5rem)", fontWeight: 500, lineHeight: 1, color: K.plum }}>{v}</div>
                <div style={{ ...sans, fontSize: 14, color: K.stone, marginTop: 8 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <More href="/plus/technology">See the platform</More>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 04 how we work ───────────────────────────────────────────────────────────
// Chris: "how we work" is the enterprise product. His method, in his words:
// assess, plan, design, test, strategize and execute alongside the customer,
// "as if it was our business"; we suggest, they stay in control. The four
// ingredients are from his Oct 22 reply.
const INGREDIENTS: string[] = [
  "A control tower watching every order",
  "Experts on the ground at your sites",
  "A daily rhythm with your team",
  "Technology that shows you everything",
];

function HowWeWork() {
  return (
    <Sect id="how" bg={K.mist}>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            label="04 · How we work"
            heading={<>Alongside your team, as if it were our business. You stay in control.</>}
            lead="We suggest, you approve. Start with one piece, like your shipping costs, or design the whole network. Either way it's the same six steps."
          />
        </Reveal>
        <Reveal delay={80}>
          <div style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
            <MethodPlayer />
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="k-ingr" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, marginTop: 30 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
              {INGREDIENTS.map((t) => (
                <span key={t} style={{ ...sans, fontSize: 14.5, fontWeight: 500, color: K.ink, border: `1px solid ${K.line}`, background: K.paper, borderRadius: 999, padding: "9px 16px" }}>
                  {t}
                </span>
              ))}
            </div>
            <More href="/plus/how-we-work">How an engagement runs</More>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 05 the design target ─────────────────────────────────────────────────────
// The triangle carries all three pillars, always (deck slide 26): never "pick
// two". Pillars as agreed on Oct 16: direct cost, operational efficiency,
// customer experience.
const PILLARS: { name: string; body: string }[] = [
  { name: "Lower cost", body: "Priced from your own shipping data, before you sign." },
  { name: "Smoother operations", body: "One price per order you can compare against anyone." },
  { name: "Better customer experience", body: "Faster, more reliable delivery your customers notice." },
];

function DesignTarget() {
  return (
    <Sect bg={K.ink}>
      <div style={{ ...inner }}>
        <Reveal>
          <Head label="05 · The design target" onDark heading={<>Always all three. Never pick two.</>} lead="Every network we design is held to the same three results, and you see all three in one view." />
        </Reveal>
        <Reveal delay={100}>
          <div style={{ maxWidth: 300, margin: "clamp(40px, 5vw, 64px) auto 0" }}>
            <svg viewBox="28 8 314 404" fill="none" aria-hidden style={{ width: "100%", height: "auto", display: "block" }}>
              <path d="M330 20 L330 400 L40 210 Z" fill={K.plum} />
              <path d="M330 20 L330 400 L40 210 Z" stroke={K.lilac} strokeWidth="1.5" strokeDasharray="3 8" opacity="0.6" />
              <circle cx="330" cy="20" r="8" fill={K.lilac} />
              <circle cx="40" cy="210" r="8" fill={K.lilac} />
              <circle cx="330" cy="400" r="8" fill={K.lilac} />
              <text x="318" y="64" textAnchor="end" style={mono} fontSize="15" fontWeight="500" letterSpacing="1.4" fill={K.lilac}>COST</text>
              <text x="96" y="215" dominantBaseline="central" style={mono} fontSize="15" fontWeight="500" letterSpacing="1.4" fill={K.lilac}>OPERATIONS</text>
              <text x="318" y="366" textAnchor="end" style={mono} fontSize="15" fontWeight="500" letterSpacing="1.4" fill={K.lilac}>EXPERIENCE</text>
            </svg>
          </div>
        </Reveal>
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(40px, 5vw, 60px)" }}>
          {PILLARS.map((p, i) => (
            <Reveal key={p.name} delay={120 + i * 90}>
              <div style={{ height: "100%", textAlign: "center", borderTop: `1px solid ${K.darkLine}`, paddingTop: 22 }}>
                <span style={{ ...mono, fontSize: 14, fontWeight: 500, color: K.lilac }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 style={{ ...title, fontSize: "clamp(1.25rem, 1.8vw, 1.45rem)", color: K.onDark, margin: "10px 0 0" }}>{p.name}</h3>
                <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.onDarkDim, margin: "8px auto 0", maxWidth: "30ch" }}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Sect>
  );
}

// ── 06 the people ────────────────────────────────────────────────────────────
// Chris (Aug 7): "experienced operators, not account managers". The account
// team is from the deck (slide 11). The photo is a placeholder until our own
// shoot; real names and roles go in the [Name] slots then.
function People() {
  return (
    <Sect>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            label="06 · The people behind it"
            heading={<>Experienced operators, not account managers.</>}
            lead="Every Koherent account has named people on it: an experienced operator, a support lead and a project manager. They designed your network, so they run it with you."
          />
        </Reveal>
        <Reveal delay={140}>
          <blockquote style={{ margin: "clamp(32px, 4vw, 48px) auto 0", padding: 0, maxWidth: 720, textAlign: "center" }}>
            <KMark color={K.plum} style={{ width: 22, height: 22 }} />
            <p style={{ ...title, fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)", lineHeight: 1.3, color: K.ink, margin: "14px 0 0" }}>
              &ldquo;Technology is our superpower. Customer operations makes it real.&rdquo;
            </p>
            <footer style={{ ...mono, fontSize: 12.5, letterSpacing: "0.08em", color: K.stone, marginTop: 14 }}>MICHAEL TRUEMAN · PRESIDENT</footer>
          </blockquote>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ maxWidth: 1000, margin: "clamp(44px, 5.5vw, 72px) auto 0", clipPath: "polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)", background: K.mist }}>
            <img
              src="/generated/plus-people-portrait.webp"
              alt=""
              width={1024}
              height={1024}
              loading="lazy"
              className="k-wideimg" style={{ width: "100%", height: "auto", aspectRatio: "16 / 7", objectFit: "cover", objectPosition: "center 28%", display: "block" }}
            />
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 07 why we're different ───────────────────────────────────────────────────
// Moved after the solution (Michael). The deck's positioning, slide 10.
function WhyDifferent() {
  const cols: { label: string; body: string; us?: boolean }[] = [
    { label: "Software platforms", body: "Hand your team another tool to run." },
    { label: "Traditional 3PLs", body: "Hand you a price list and leave the math to you." },
    { label: "Koherent", body: "Designs the network, runs it with you and keeps improving it. One view, one number per order.", us: true },
  ];
  return (
    <Sect bg={K.mist}>
      <div style={{ ...inner, textAlign: "center" }}>
        <Reveal>
          <Label>07 · Why we&rsquo;re different</Label>
        </Reveal>
        <Reveal delay={80}>
          <p style={{ ...title, fontSize: "clamp(1.6rem, 3.1vw, 2.5rem)", lineHeight: 1.2, color: K.ink, margin: "18px auto 0", maxWidth: "34ch" }}>
            For operations and finance leaders whose logistics has outgrown a shipping app,{" "}
            <span style={{ color: K.plum }}>Koherent is the managed logistics network</span>{" "}that brings carriers,
            warehouses and data into one coherent operation, run with you by people who know logistics.
          </p>
        </Reveal>
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(40px, 5vw, 60px)" }}>
          {cols.map((c, i) => (
            <Reveal key={c.label} delay={i * 90}>
              <div style={{ height: "100%", borderTop: `3px solid ${c.us ? K.plum : K.line}`, paddingTop: 20 }}>
                <Label style={{ color: c.us ? K.plum : K.stone }}>{c.label}</Label>
                <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.4vw, 1.18rem)", fontWeight: c.us ? 600 : 400, lineHeight: 1.55, color: c.us ? K.ink : K.stone, margin: "12px auto 0", maxWidth: "30ch" }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        {/* the proof of "one view, one number per order": what it looks like */}
        <div style={{ marginTop: "clamp(56px, 7vw, 88px)" }}>
          <Label>What one view looks like</Label>
          <div style={{ marginTop: 26 }}>
            <ConsoleView />
          </div>
        </div>
      </div>
    </Sect>
  );
}

// ── 08 proof ─────────────────────────────────────────────────────────────────
// Three cases, as Michael asked (PG Golf, InnoWave, Plak-IT). None is live, so
// every figure is labelled "proposed" and none is a realized saving. Figures:
// PG Golf $25.00 → $13.22 per shipment (proposal; deck slide 37); InnoWave
// $10.14 → $9.83 all-in per package (first proposal). Plak-IT has no proposal
// figure, so it shows what's being built.
const CASES: { name: string; what: string; story: string; from?: string; to?: string; unit?: string; status: string }[] = [
  {
    name: "PG Golf",
    what: "A US golf brand entering Canada",
    story: "Every order shipped from Texas at cross-border rates, with customs delays customers felt. We designed a phased entry, starting with bulk shipping into Canada.",
    from: "$25.00",
    to: "$13.22",
    unit: "per shipment",
    status: "Proposed, not yet realized",
  },
  {
    name: "InnoWave",
    what: "A gift-box company shipping to consumers",
    story: "Not an e-commerce brand, but thousands of boxes to people's homes. We start at their own dock with one platform, then add a second warehouse closer to their customers.",
    from: "$10.14",
    to: "$9.83",
    unit: "all-in per package",
    status: "Proposed, not yet realized",
  },
  {
    name: "Plak-IT",
    what: "A dental lab, about 275 cases a month",
    story: "Dental offices send cases to the lab every day. We're building them a simple “send a case” page on our network, so any office can ship in a few clicks.",
    status: "In design",
  },
];

function Proof() {
  return (
    <Sect id="proof">
      <div style={{ ...inner }}>
        <Reveal>
          <Head label="08 · Proof" heading={<>What we&rsquo;re designing right now.</>} lead="Three businesses, three different shapes of the same problem. Every figure below is from our proposals; none of these networks is live yet." />
        </Reveal>
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(40px, 5vw, 60px)" }}>
          {CASES.map((c, i) => (
            <Reveal key={c.name} delay={i * 90}>
              <div style={{ height: "100%", display: "flex", flexDirection: "column", textAlign: "center", background: K.card, border: `1px solid ${K.line}`, borderRadius: 4, padding: "28px 28px 26px" }}>
                <Label>{c.what}</Label>
                <h3 style={{ ...title, fontSize: "clamp(1.5rem, 2.2vw, 1.85rem)", color: K.ink, margin: "12px 0 0" }}>{c.name}</h3>
                <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.stone, margin: "10px 0 0" }}>{c.story}</p>
                <div style={{ marginTop: "auto", paddingTop: 22 }}>
                  {c.from && c.to ? (
                    <div style={{ background: K.ink, borderRadius: 4, padding: "16px 18px 14px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ ...mono, fontSize: 30, fontWeight: 500, lineHeight: 1, color: K.onDark }}>{c.to}</span>
                        <span style={{ ...mono, fontSize: 14, color: K.onDarkDim, textDecoration: "line-through", textDecorationColor: K.lilac }}>{c.from}</span>
                        <span style={{ ...sans, fontSize: 13, color: K.onDarkDim }}>{c.unit}</span>
                      </div>
                      <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac, margin: "10px 0 0" }}>{c.status}</p>
                    </div>
                  ) : (
                    <div style={{ background: K.mist, borderRadius: 4, padding: "16px 18px 14px" }}>
                      <Steps total={5} done={2} />
                      <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.plum, margin: "10px 0 0" }}>{c.status}</p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <More href="/plus/case-studies">Read the case studies</More>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── 09 how it fits with ShipTime ─────────────────────────────────────────────
// Michael: re-orient this with ShipTime's offering. The deck's ladder (slides
// 14–15) in plain words, without the internal profile names.
const LADDER: { brand: string; who: string; promise: string; href: string; us?: boolean }[] = [
  { brand: "ShipTime", who: "Under 500 orders a month", promise: "We make shipping easy: discounted labels, every carrier, one dashboard.", href: "https://www.shiptime.com" },
  { brand: "ShipTime, then Koherent", who: "500 to 5,000 a month", promise: "Start on ShipTime. Once your inventory is in our network, you move up to Koherent.", href: "/plus/book-a-call" },
  { brand: "Koherent", who: "5,000+ a month, more than one site", promise: "We run your network with you, from day one.", href: "/plus/book-a-call", us: true },
];

function Ladder() {
  return (
    <Sect bg={K.mist}>
      <div style={{ ...inner }}>
        <Reveal>
          <Head label="09 · Koherent and ShipTime" heading={<>Start on ShipTime. Grow into Koherent.</>} lead="Same platform, same people. You move up when your operation does." />
        </Reveal>
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(40px, 5vw, 60px)" }}>
          {LADDER.map((s, i) => (
            <Reveal key={s.brand} delay={i * 90}>
              <Link href={s.href} className="k-lift" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", textDecoration: "none", background: s.us ? K.plum : K.card, border: `1px solid ${s.us ? K.plum : K.line}`, borderRadius: 4, padding: "26px 26px 24px" }}>
                <Steps total={3} done={i + 1} onDark={s.us} />
                <p style={{ ...mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: s.us ? K.lilac : K.violet, margin: "18px 0 0" }}>{s.who}</p>
                <h3 style={{ ...title, fontSize: "clamp(1.3rem, 1.9vw, 1.55rem)", color: s.us ? K.onDark : K.ink, margin: "8px 0 0" }}>{s.brand}</h3>
                <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: s.us ? K.onDarkDim : K.stone, margin: "8px 0 0" }}>{s.promise}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Sect>
  );
}

// ── close ────────────────────────────────────────────────────────────────────
// The ask is always the same (deck slides 33–34): get your Logistics
// Performance Score. Routes to the existing /plus/assessment questionnaire.
function Close() {
  return (
    <Sect bg={K.plum}>
      <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", background: K.violet, clipPath: "polygon(55% 0, 100% 0, 100% 100%, 55% 100%, 0 50%)", opacity: 0.4 }} />
      <div style={{ ...inner, position: "relative", textAlign: "center" }}>
        <Reveal>
          <Label onDark>Your Logistics Performance Score</Label>
          <h2 style={{ ...display, fontSize: "clamp(2.6rem, 6vw, 4.8rem)", color: K.onDark, margin: "20px auto 0", maxWidth: "14ch" }}>How coherent is your logistics?</h2>
          <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", lineHeight: 1.6, color: K.onDarkDim, margin: "20px auto 0", maxWidth: "46ch" }}>
            Twelve questions. A score out of 100 across cost, operations and experience, and where you&rsquo;re losing
            money.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 32 }}>
            <Primary href="/plus/assessment" onDark>
              Get your score <ArrowRight size={16} />
            </Primary>
            <Secondary href="/plus/book-a-call" onDark>
              Talk to our team
            </Secondary>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

function Footer() {
  return (
    <footer style={{ background: K.ink, color: K.onDarkDim }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(48px, 6vw, 72px) clamp(20px, 4vw, 56px) 36px" }}>
        <div className="k-foot" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 32 }}>
          <div>
            <Logo size={34} color={K.onDark} />
            <p style={{ ...mono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: K.lilac, margin: "12px 0 0" }}>Managed logistics network</p>
            <p style={{ ...title, fontSize: "1.25rem", color: K.onDark, margin: "26px 0 0" }}>Make it coherent.</p>
          </div>
          <nav style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px 28px" }}>
            {([
              ["What we bring", "#bring"],
              ["How we work", "#how"],
              ["Proof", "#proof"],
              ["Your score", "/plus/assessment"],
              ["Talk to our team", "/plus/book-a-call"],
              ["ShipTime", "https://www.shiptime.com"],
            ] as [string, string][]).map(([l, h]) => (
              <Link key={l} href={h} className="k-footlink" style={{ ...sans, fontSize: 15, color: K.onDark, textDecoration: "none" }}>
                {l}
              </Link>
            ))}
          </nav>
        </div>
        <div style={{ borderTop: `1px solid ${K.darkLine}`, marginTop: 40, paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 24px", textAlign: "center" }}>
          <span style={{ ...sans, fontSize: 13 }}>ShipTime and Warehowz are part of Koherent.</span>
          <span style={{ ...mono, fontSize: 12 }}>© 2026 Koherent</span>
        </div>
      </div>
    </footer>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export function KoherentHome() {
  return (
    <div className="k-root" style={{ ...sans, background: K.paper, color: K.ink }}>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <WhoItsFor />
        <WhatWeBring />
        <HowWeWork />
        <DesignTarget />
        <People />
        <WhyDifferent />
        <Proof />
        <Ladder />
        <Close />
      </main>
      <Footer />
      <style>{`
        .k-root ::selection { background: ${K.lilac}; color: ${K.ink}; }
        .k-navlink:hover, .k-footlink:hover { text-decoration: underline; text-underline-offset: 4px; }
        .k-btn { transition: transform .18s ease, opacity .18s ease; }
        .k-btn:hover { transform: translateY(-1px); opacity: .92; }
        .k-more:hover { text-decoration: underline; text-underline-offset: 4px; }
        .k-lift { transition: transform .2s ease, box-shadow .2s ease; }
        .k-lift:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -26px rgba(23,16,28,.45); }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes k-fade-kf { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
          .k-fade { animation: k-fade-kf .8s cubic-bezier(.22,1,.36,1) both; }
          @keyframes k-flow-kf { to { stroke-dashoffset: -36; } }
          .k-flow { animation: k-flow-kf 1.6s linear infinite; }
          /* the steps appear once, left to right, then stop (deck slide 26) */
          .k-chev { opacity: 0; transform: translateX(-4px); transition: opacity .4s ease, transform .4s ease; }
          [data-reveal="in"] .k-chev { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) { .k-mq [class*="animate-"] { animation: none !important; } }
        @media (max-width: 960px) {
          .k-navlinks { display: none !important; }
          .k-hero { grid-template-columns: 1fr !important; }
          .k-heroart { max-width: 540px; width: 100%; }
          .k-three { grid-template-columns: 1fr !important; }
          .k-six { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .k-wideimg { aspect-ratio: 4 / 3 !important; }
          .k-six { grid-template-columns: 1fr !important; }
          .k-stats { grid-template-columns: 1fr !important; }
          .k-numcard { position: relative !important; left: auto !important; right: auto !important; bottom: auto !important; width: 100% !important; margin-top: -24px; }
        }
      `}</style>
    </div>
  );
}
