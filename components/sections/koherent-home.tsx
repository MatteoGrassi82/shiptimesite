import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import { KoherentHeroArt } from "./koherent-hero-art";
import { BringBento } from "./koherent-bring";
import { MethodPlayer } from "./koherent-method";
import { TargetTriangle } from "./koherent-target";
import { CASES } from "./koherent-cases";
import { FitSlider } from "./koherent-fit";
import { ChapterProgress, Drift } from "./koherent-fx";
import { Head, inner, K, KMark, KoherentShell, Label, More, PAGES, Primary, ScoreClose, Secondary, Sect, Steps, display, mono, sans, title } from "./koherent-ui";

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
//
// Second pass (Oct 25), from every website email since Aug 4 (Michael, Chris):
//   - the case studies are anonymized, as Michael asked ("less specific") and
//     as his own Sep 15 write-up of the promotional-company case does;
//   - Why we're different is the "in between" positioning both of them asked
//     for, in our customers' words (Chris's markup), not "a prospect's";
//   - Michael's "one team… optimized as you scale" is the People quote;
//   - the score is the main button (Chris, Aug 7), and the hero says who it's
//     for, for Michael's 15-second test;
//   - shorter: the ShipTime ladder folds into the 500+ band, the console demo
//     moves to /koherent/how-we-work, and each section hands off to a detail
//     page (PAGES in koherent-ui.tsx) instead of the old ShipTime Plus pages.

// Tokens, the K, nav, footer and buttons are shared with the detail pages
// (koherent-ui.tsx).

// ── hero ─────────────────────────────────────────────────────────────────────
// The headline says what we are, "Your managed logistics network" (Michael,
// Oct 27: make it prominent; Oct 28: "Make it coherent" reads as generic, a
// cold reader took the site for personal finance). The deck's line stays as
// the tagline in the footer and in the question lines. Then who it's for and
// what we do in one plain sentence (Michael's 15-second test), then Chris's category: not
// another 3PL, not another shipping platform. Text left, the visual right
// (Matteo, Oct 23): the problem pieces pull together into the K, the photo
// opens from the arrow tip behind the steps, and the cost card counts down to
// the golf brand's proposed figure. See koherent-hero-art.tsx. Everything
// below the hero stays centered.
function Hero() {
  return (
    <Sect>
      {/* top padding kept small enough that the score button sits above the
          fold on a 1280×720 laptop */}
      <div className="k-hero" style={{ ...inner, paddingTop: "clamp(40px, 5vw, 72px)", display: "grid", gridTemplateColumns: "1.12fr 0.88fr", gap: "clamp(32px, 5vw, 64px)", alignItems: "center" }}>
        <div>
          <div className="k-fade" style={{ animationDelay: "0.05s" }}>
            <Label>Logistics, designed and run with you</Label>
          </div>
          <h1 className="k-fade" style={{ ...display, fontSize: "clamp(2.9rem, 7vw, 5.5rem)", color: K.plum, margin: "22px 0 0", animationDelay: "0.12s" }}>
            Your managed logistics network.
          </h1>
          {/* who it's for and what we do, first: Michael's 15-second test */}
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.2rem, 1.8vw, 1.42rem)", fontWeight: 500, lineHeight: 1.45, color: K.ink, margin: "26px 0 0", maxWidth: "36ch", animationDelay: "0.24s" }}>
            We cut shipping costs, improve operations and simplify fulfillment for businesses sending 500+ orders a month to individuals.
          </p>
          {/* Chris's category, in the first panel */}
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.02rem, 1.3vw, 1.12rem)", lineHeight: 1.65, color: K.stone, margin: "16px 0 0", maxWidth: "50ch", animationDelay: "0.32s" }}>
            Not another 3PL, not another shipping platform. One team designs your network from your own order data and
            runs it with you: no rebuild, and you stay in control.
          </p>
          <div className="k-fade k-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34, animationDelay: "0.42s" }}>
            <Primary href={PAGES.score}>
              <span className="k-long">Get your Logistics Performance Score</span>
              <span className="k-short">Get your logistics score</span> <ArrowRight size={16} />
            </Primary>
            <Secondary href={PAGES.contact}>Talk to our team</Secondary>
          </div>
        </div>

        <div className="k-heroart" style={{ paddingLeft: 38 }}>
          {/* illustrative: the photo carries a visible label instead */}
          {/* a packing bench, so the first picture says logistics (Michael, Oct 28:
              a cold reader took the laptop photo and the score button for personal finance) */}
          <KoherentHeroArt src="/generated/pf-proof-packing.webp" alt="" />
        </div>
      </div>
    </Sect>
  );
}

// ── the problem ──────────────────────────────────────────────────────────────
// Michael: one sentence that sums up the problem, then the questions become
// the specifics of it. His three questions are in (bold), and "one system
// answers all nine" becomes "these, and more".
// The questions move on a desktop, as Michael asked ("I like the idea of the
// moving questions", Oct 19), and pause under the pointer so any one can be
// read. On a phone, with reduced motion and for screen readers they are one
// still list instead (the six marked `phone` on a phone, his three among
// them), because a marquee there shows a chip and a half and reads every
// question four times.
const QUESTIONS: { q: string; michael?: boolean; phone?: boolean }[] = [
  { q: "Why do our shipping costs keep rising?", phone: true },
  { q: "Should we be using regional carriers?", michael: true, phone: true },
  { q: "How much inventory should we carry, and where?", michael: true, phone: true },
  { q: "How do we get the numbers we need to manage our logistics?", michael: true, phone: true },
  { q: "Customers expect two-day delivery. Can we afford it?", phone: true },
  { q: "Which carriers actually bring the best value?" },
  { q: "Why does service slip exactly when we grow?" },
  { q: "What is this surcharge on our invoice?", phone: true },
  { q: "DIY or outsource? Where's a 3PL we can trust?" },
  { q: "Why are returns becoming unmanageable?" },
  { q: "Why does every warehouse quote look different?" },
  { q: "Are we set up for where we are, or where we're going?" },
];

function QuestionChip({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return (
    <span className="k-qchip" style={{ ...sans, display: "inline-flex", alignItems: "center", fontSize: 15, fontWeight: strong ? 600 : 500, color: K.ink, background: K.card, border: `1px solid ${strong ? K.violet : K.line}`, borderRadius: 999, padding: "10px 18px", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Problem() {
  return (
    <Sect id="problem" bg={K.mist}>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            n={1}
            label="The problem"
            heading={<>Logistics isn&rsquo;t hard because it&rsquo;s big.{" "}<span className="k-br">It&rsquo;s hard because it&rsquo;s in pieces.</span></>}
            lead="Carriers here, warehouses there, spreadsheets everywhere, and nobody accountable for the whole. So the same questions keep coming back."
          />
        </Reveal>

        <Reveal delay={120}>
          <div aria-hidden className="k-mq" style={{ position: "relative", margin: "clamp(36px, 4.5vw, 52px) calc(-1 * clamp(20px, 4vw, 56px)) 0", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "clamp(40px, 8vw, 140px)", zIndex: 2, background: `linear-gradient(90deg, ${K.mist}, transparent)` }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "clamp(40px, 8vw, 140px)", zIndex: 2, background: `linear-gradient(270deg, ${K.mist}, transparent)` }} />
            {[0, 1, 2].map((row) => (
              <Marquee key={row} pauseOnHover reverse={row === 1} className={["[--duration:52s]", "[--duration:60s]", "[--duration:48s]"][row] + " [--gap:0.75rem]"} repeat={4}>
                {QUESTIONS.filter((_, i) => i % 3 === row).map((q) => (
                  <QuestionChip key={q.q} strong={q.michael}>{q.q}</QuestionChip>
                ))}
              </Marquee>
            ))}
          </div>
          <ul className="k-qlist" style={{ listStyle: "none", padding: 0, margin: "clamp(36px, 4.5vw, 52px) auto 0", maxWidth: 1040, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {QUESTIONS.map((q) => (
              <li key={q.q} className={q.phone ? undefined : "k-q-more"}>
                <QuestionChip strong={q.michael}>{q.q}</QuestionChip>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* the pivot: one centered answer under the questions */}
        <Reveal delay={200}>
          <div style={{ marginTop: "clamp(44px, 5.5vw, 64px)", textAlign: "center" }}>
            <p style={{ ...title, fontSize: "clamp(1.3rem, 2vw, 1.65rem)", lineHeight: 1.3, color: K.ink, maxWidth: "36ch", margin: "0 auto" }}>
              We&rsquo;ve heard every one. It&rsquo;s a design problem.{" "}
              <span style={{ color: K.plum }}>One coherent system answers these, and more.</span>
            </p>
            <p style={{ ...sans, fontSize: 16, lineHeight: 1.6, color: K.stone, maxWidth: "52ch", margin: "12px auto 0" }}>
              Carriers, warehouses, inventory, returns and data, designed together instead of piecemeal.
            </p>
          </div>
        </Reveal>
      </div>
      <style>{`
        /* desktop with motion: the moving rows show, the list is for screen readers */
        @media (min-width: 641px) and (prefers-reduced-motion: no-preference) {
          .k-qlist { position: absolute !important; width: 1px; height: 1px; margin: 0 !important; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        }
        @media (max-width: 640px), (prefers-reduced-motion: reduce) {
          .k-mq { display: none !important; }
        }
        @media (max-width: 640px) {
          .k-q-more { display: none !important; }
          .k-qchip { white-space: normal !important; text-align: center; }
        }
      `}</style>
    </Sect>
  );
}

// ── who it's for ─────────────────────────────────────────────────────────────
// Michael: broaden past e-commerce to anyone with a lot of orders going to
// consumers (InnoWave is a gift-box shipper, not a DTC brand), and replace the
// "$100M+" banner, which read as if we only work with very large companies.
// Michael (Aug 6) found "who we work with" too generic, and Chris wants the
// first panels to answer "is this built for companies like me?", so the three
// enterprise-fit profiles (Jennie's) say who, at what stage, and why. The
// third carries Chris's line, "Grow your network, not your overhead" (Oct 22),
// the bigger promise behind the first step. The lead is Michael's Aug 4 brief
// in a sentence. The 500-a-month line is the deck's ShipTime → Koherent fork
// (slide 15), stated in plain words. The band also carries how Koherent sits
// next to ShipTime (Michael: re-orient this with ShipTime's offering). The
// tiers were revised on Oct 28 after both flagged the 500 vs 5,000 clash:
// Koherent starts at 500 at the customer's own dock (cost first, Chris's entry
// point, and how InnoWave starts), and runs the whole network from 5,000 or a
// second site. For Michael to confirm.
const TRAITS: { title: string; body: string }[] = [
  { title: "You ship to people's doors.", body: "Online brands, and businesses that deliver to individuals for someone else: gifts, programs, subscriptions, store to door." },
  { title: "You've outgrown a shipping app.", body: "A warehouse or a 3PL today, more than one site soon, and a shipping bill that matters to the plan." },
  { title: "Grow your network, not your overhead.", body: "New regions, faster delivery, a new channel, without adding the people and systems to run it all." },
];


function WhoItsFor() {
  return (
    <Sect id="who">
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            n={2}
            label="Who it's for"
            heading={<>For businesses with a lot of orders going to individuals.</>}
            lead="Growing businesses that want their logistics to make them more money, not hold their growth back."
          />
        </Reveal>
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(36px, 4.5vw, 52px)" }}>
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

        <Reveal delay={120}>
          <div className="k-band" data-k-dark="" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, marginTop: 18, background: K.plum, borderRadius: 4, padding: "clamp(30px, 3.6vw, 44px) clamp(26px, 3.4vw, 44px)", position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "26%", background: K.violet, clipPath: "polygon(48% 0, 100% 0, 100% 100%, 48% 100%, 0 50%)", opacity: 0.45 }} />
            <div style={{ ...mono, position: "relative", fontSize: "clamp(2.2rem, 4.2vw, 3.2rem)", fontWeight: 500, lineHeight: 1, color: K.onDark }}>500+</div>
            <p style={{ ...sans, position: "relative", fontSize: "clamp(1rem, 1.35vw, 1.14rem)", lineHeight: 1.6, color: K.onDarkDim, margin: 0, maxWidth: "56ch" }}>
              <strong style={{ color: K.onDark }}>You don&rsquo;t need to be huge.</strong>{" "}Koherent starts to pay off at
              around 500 orders a month, and there&rsquo;s no ceiling.
            </p>
            {/* the three tiers as a slider: drag your volume, see where you start */}
            <FitSlider />
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── what we bring ────────────────────────────────────────────────────────────
// Michael's building blocks, in his order, as one bento with a map, the
// buying power behind the rates, photos and the stats in the tiles they prove
// (koherent-bring.tsx). Matteo picked the bento on Oct 23 over the lattice in
// the arrowhead frame, which How we work right below already uses. It hands
// off to the detail page the same way How we work and Case studies do.
// The lead is Chris's point (Aug 7): we don't sell warehouses, rates or
// technology; they're the capabilities that prove we can design the whole.
function WhatWeBring() {
  return (
    <Sect id="bring">
      <div style={{ ...inner, paddingTop: 0 }}>
        <Reveal>
          <Head
            n={3}
            label="What we bring"
            heading={<>Everything a coherent operation needs.{" "}<span className="k-br">Already connected.</span></>}
            lead="Not what we sell, but what we design and run with. We connect the blocks you need into a single network, and you see all of it in one place."
          />
        </Reveal>
        <BringBento />
        <Reveal delay={120}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <More href={PAGES.bring}>Every block, in detail</More>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── how we work ──────────────────────────────────────────────────────────────
// Chris: "how we work" is the enterprise product. His method, in his words:
// assess, plan, design, test, strategize and execute alongside the customer,
// "as if it was our business"; we suggest, they stay in control. His four
// ingredients, "the secret sauce" (Oct 22), sit under the player.
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
            n={4}
            label="How we work"
            heading={<>Alongside your team, as if it were our business.{" "}<span className="k-br">You stay in control.</span></>}
            lead="We suggest, you approve. Start with one piece, like your shipping costs, or design the whole network. Either way it's the same six steps."
          />
        </Reveal>
        <Reveal delay={80}>
          <div style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
            <MethodPlayer />
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, marginTop: 30 }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
              {INGREDIENTS.map((t) => (
                <li key={t} style={{ ...sans, fontSize: 14.5, fontWeight: 500, color: K.ink, border: `1px solid ${K.line}`, background: K.paper, borderRadius: 999, padding: "9px 16px" }}>
                  {t}
                </li>
              ))}
            </ul>
            <More href={PAGES.how}>How an engagement runs</More>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── the design target ────────────────────────────────────────────────────────
// The triangle carries all three pillars, always (deck slide 26): never "pick
// two". Pillars as agreed on Oct 16: direct cost, operational efficiency,
// customer experience. Interactive since Oct 23: visitors put in their own
// numbers and see their triangle against the target (koherent-target.tsx).
function DesignTarget() {
  return (
    <Sect id="target" bg={K.ink}>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            n={5}
            label="The design target"
            onDark
            heading={<>Always all three. Never pick two.</>}
            lead="Every network we design is held to lower cost, smoother operations and a better customer experience, all at once. Put in your numbers to see your triangle."
          />
        </Reveal>
        <Reveal delay={100}>
          <div style={{ marginTop: "clamp(44px, 5vw, 72px)" }}>
            <TargetTriangle />
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── the people ───────────────────────────────────────────────────────────────
// Chris (Aug 7): "experienced operators, not account managers". The account
// team is from the deck (slide 11). The quote is Michael's own line (email
// "New website", Oct 19), with "optimized" over "tuned" as he asked. The photo
// (koherent-bring-people-a, made with the bento's) is a labelled placeholder
// until our own shoot.
function People() {
  return (
    <Sect id="people">
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            n={6}
            label="The people behind it"
            heading={<>Experienced operators, not account managers.</>}
            lead="Our technology is the superpower. Our people make it work for you: a named account manager who owns the relationship, direct access to the operators and support teams behind them, and one partner accountable for the whole. And we look after your customers as if they were our own."
          />
        </Reveal>
        <Reveal delay={140}>
          <blockquote style={{ margin: "clamp(32px, 4vw, 48px) auto 0", padding: 0, maxWidth: 720, textAlign: "center" }}>
            <p style={{ ...title, fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)", lineHeight: 1.3, color: K.ink, margin: 0 }}>
              &ldquo;Our team of experienced operators, one plan across warehousing, fulfillment, carriers and borders, optimized as you scale.&rdquo;
            </p>
            <footer style={{ ...mono, fontSize: 12.5, letterSpacing: "0.08em", color: K.stone, marginTop: 14 }}>MICHAEL TRUEMAN · PRESIDENT</footer>
          </blockquote>
          {/* why we get up every day (Michael, Oct 27) */}
          <p style={{ ...sans, fontSize: "clamp(1.02rem, 1.3vw, 1.12rem)", lineHeight: 1.6, color: K.stone, textAlign: "center", margin: "28px auto 0", maxWidth: "52ch" }}>
            Why we get up every day: to help our customers grow their business through logistics done smarter. Same side of the table, for the long run.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ position: "relative", maxWidth: 1000, margin: "clamp(44px, 5.5vw, 72px) auto 0", clipPath: "polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)", background: K.mist }}>
            <Drift amount={32}>
            <img
              src="/generated/koherent-bring-people-a.webp"
              alt=""
              width={1024}
              height={1536}
              loading="lazy"
              className="k-wideimg" style={{ width: "100%", height: "auto", aspectRatio: "16 / 7", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
            />
            </Drift>
            <span style={{ ...mono, position: "absolute", top: 14, right: 14, fontSize: 10.5, lineHeight: 1.4, letterSpacing: "0.04em", color: K.onDark, background: "rgba(23,16,28,0.55)", borderRadius: 8, padding: "5px 10px" }}>Illustrative photo</span>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── why we're different ──────────────────────────────────────────────────────
// Moved after the solution (Michael). Where we sit in the market, as both
// Michael (Aug 6) and Chris (Aug 7) asked: between the independent 3PLs and
// the big asset-based ones, drawn as one line with us on it, not as a fifth
// row of three cards. "The global giants" is the one name for the big end all
// the way through. It's how our customers put it, so it says "our customers"
// (Chris's markup on v3), and it closes on Chris's new category: not a 3PL,
// not a shipping platform. The console demo that sat here is on
// /koherent/how-we-work now.
function WhyDifferent() {
  const cols: { label: string; head: string; body: string; us?: boolean }[] = [
    { label: "Independent 3PLs", head: "Willing, but limited.", body: "A small network, and no one to design the whole operation or the technology to run it." },
    { label: "Koherent", head: "Deliberately in between.", body: "The design and technology of the global giants, named people who know your operation, and Shiplets built for the way you work.", us: true },
    { label: "The global giants", head: "Capable, but you're a number.", body: "One account among thousands, at prices built for the very largest shippers." },
  ];
  return (
    <Sect id="different" bg={K.mist}>
      <div style={{ ...inner, textAlign: "center" }}>
        <Reveal>
          <Head
            n={7}
            label="Why we're different"
            heading={<>More capable than the independents.{" "}<span className="k-br">More personal than the giants.</span></>}
            lead="That's how our customers describe us, and it's the gap we're built for."
          />
        </Reveal>
        {/* the spectrum: one line from the independents to the giants, with
            the K sitting on it in between */}
        <div className="k-spec" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, maxWidth: 1040, margin: "clamp(44px, 5.5vw, 64px) auto 0" }}>
          <div aria-hidden className="k-spec-line" style={{ position: "absolute", top: 12, left: "16.67%", right: "16.67%", height: 2, background: K.line }} />
          {cols.map((c, i) => (
            <Reveal key={c.label} delay={i * 90}>
              <div style={{ position: "relative", textAlign: "center" }}>
                <div aria-hidden style={{ height: 26, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  {c.us ? (
                    <span style={{ display: "inline-flex", background: K.mist, padding: "0 10px" }}>
                      <KMark color={K.plum} style={{ width: 26, height: 26 }} />
                    </span>
                  ) : (
                    <span className="k-spec-tick" style={{ width: 2, height: 16, background: K.stone }} />
                  )}
                </div>
                <Label style={{ color: c.us ? K.plum : K.stone }}>{c.label}</Label>
                <h3 style={{ ...title, fontSize: "clamp(1.3rem, 1.9vw, 1.55rem)", color: c.us ? K.plum : K.ink, margin: "12px 0 0" }}>{c.head}</h3>
                <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.stone, margin: "10px auto 0", maxWidth: "30ch" }}>{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={240}>
          <p style={{ ...title, fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", lineHeight: 1.25, color: K.ink, margin: "clamp(36px, 4.5vw, 52px) auto 0", maxWidth: "44ch" }}>
            <span style={{ color: K.plum }}>Operations, technology and a network, combined in one team that designs your logistics and runs it with you.</span>{" "}Most providers bring one of the three.
          </p>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .k-spec { grid-template-columns: 1fr !important; gap: 32px !important; }
          .k-spec-line, .k-spec-tick { display: none; }
        }
      `}</style>
    </Sect>
  );
}

// ── case studies ─────────────────────────────────────────────────────────────
// Three cases, as Michael asked, anonymized (koherent-cases.ts). None is live,
// so the label says "Case studies", as the nav and the detail page do, not
// "Proof"; the one figure shown is labelled "proposed" and none is a realized
// saving. The rest show what's being built.
function Proof() {
  return (
    <Sect id="proof">
      <div style={{ ...inner }}>
        <Reveal>
          <Head n={8} label="Case studies" heading={<>What we&rsquo;re designing right now.</>} lead="Three businesses, three goals. Names stay private until the work is live, and every figure is from our proposals." />
        </Reveal>
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: "clamp(40px, 5vw, 60px)" }}>
          {CASES.map((c, i) => (
            <Reveal key={c.id} delay={i * 90}>
              <div style={{ height: "100%", display: "flex", flexDirection: "column", textAlign: "center", background: K.card, border: `1px solid ${K.line}`, borderRadius: 4, padding: "28px 28px 26px" }}>
                <Label>{c.sector}</Label>
                <h3 style={{ ...title, fontSize: "clamp(1.5rem, 2.2vw, 1.85rem)", color: K.ink, margin: "12px 0 0" }}>{c.shape}</h3>
                <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.stone, margin: "10px 0 0" }}>{c.short}</p>
                <div style={{ marginTop: "auto", paddingTop: 22 }}>
                  {c.figure ? (
                    <div style={{ background: K.ink, borderRadius: 4, padding: "16px 18px 14px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ ...mono, fontSize: 30, fontWeight: 500, lineHeight: 1, color: K.onDark }}>{c.figure.to}</span>
                        <span className="sr-only">down from </span>
                        <s style={{ ...mono, fontSize: 14, color: K.onDarkDim, textDecorationColor: K.lilac }}>{c.figure.from}</s>
                        <span style={{ ...sans, fontSize: 13, color: K.onDarkDim }}>{c.figure.unit}</span>
                      </div>
                      <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac, margin: "10px 0 0" }}>{c.status}</p>
                    </div>
                  ) : (
                    <div style={{ background: K.mist, borderRadius: 4, padding: "16px 18px 14px" }}>
                      <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.plum, margin: 0 }}>{c.status}</p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <More href={PAGES.cases}>Read the case studies</More>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export function KoherentHome() {
  return (
    <KoherentShell>
      <ChapterProgress ids={["problem", "who", "bring", "how", "target", "people", "different", "proof"]} />
      <Hero />
      <Problem />
      <WhoItsFor />
      <WhatWeBring />
      <HowWeWork />
      <DesignTarget />
      <People />
      <WhyDifferent />
      <Proof />
      <ScoreClose />
    </KoherentShell>
  );
}
