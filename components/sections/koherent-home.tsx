import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { KoherentHeroArt } from "./koherent-hero-art";
import { BringBento } from "./koherent-bring";
import { MethodPlayer } from "./koherent-method";
import { TargetTriangle } from "./koherent-target";
import { CASES } from "./koherent-cases";
import { Head, inner, K, KMark, KoherentShell, Label, More, PAGES, Primary, ScoreClose, Secondary, Sect, display, mono, sans, title } from "./koherent-ui";

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
// The deck's one idea as the headline, then who it's for and what we do in one
// plain sentence (Michael's 15-second test), then Chris's category: not
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
            <Label>Managed logistics network</Label>
          </div>
          <h1 className="k-fade" style={{ ...display, fontSize: "clamp(3.3rem, 8.4vw, 6.6rem)", color: K.plum, margin: "22px 0 0", animationDelay: "0.12s" }}>
            Make it coherent.
          </h1>
          {/* who it's for and what we do, first: Michael's 15-second test */}
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.2rem, 1.8vw, 1.42rem)", fontWeight: 500, lineHeight: 1.45, color: K.ink, margin: "26px 0 0", maxWidth: "36ch", animationDelay: "0.24s" }}>
            We cut shipping costs and simplify fulfillment for businesses sending 500+ orders a month to consumers.
          </p>
          {/* Chris's category, in the first panel */}
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.02rem, 1.3vw, 1.12rem)", lineHeight: 1.65, color: K.stone, margin: "16px 0 0", maxWidth: "50ch", animationDelay: "0.32s" }}>
            Not another 3PL, not another shipping platform. One team designs your network from your own order data and
            runs it with you: no rebuild, and you stay in control.
          </p>
          <div className="k-fade k-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34, animationDelay: "0.42s" }}>
            <Primary href={PAGES.score}>
              <span className="k-long">Get your Logistics Performance Score</span>
              <span className="k-short">Get your score</span> <ArrowRight size={16} />
            </Primary>
            <Secondary href={PAGES.contact}>Talk to our team</Secondary>
          </div>
        </div>

        <div className="k-heroart" style={{ paddingLeft: 38 }}>
          {/* illustrative: the photo carries a visible label instead */}
          <KoherentHeroArt src="/generated/plus-ops-team.webp" alt="" />
        </div>
      </div>
    </Sect>
  );
}

// ── the problem ──────────────────────────────────────────────────────────────
// Michael: one sentence that sums up the problem, then the questions become
// the specifics of it. His three questions are in (bold), and "one system
// answers all nine" becomes "these, and more". One static set, readable at
// once: the marquee froze cut off under reduced motion and read every
// question four times to a screen reader. A phone shows the six marked
// `phone`, Michael's three among them.
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
    <Sect bg={K.mist}>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            label="The problem"
            heading={<>Logistics isn&rsquo;t hard because it&rsquo;s big.{" "}<span className="k-br">It&rsquo;s hard because it&rsquo;s in pieces.</span></>}
            lead="Carriers here, warehouses there, spreadsheets everywhere, and nobody accountable for the whole. So the same questions keep coming back."
          />
        </Reveal>

        <Reveal delay={120}>
          <ul style={{ listStyle: "none", padding: 0, margin: "clamp(36px, 4.5vw, 52px) auto 0", maxWidth: 1040, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
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
              <span style={{ color: K.plum }}>One system answers these, and more.</span>
            </p>
            <p style={{ ...sans, fontSize: 16, lineHeight: 1.6, color: K.stone, maxWidth: "52ch", margin: "12px auto 0" }}>
              Carriers, warehouses, inventory, returns and data, designed together instead of patched one by one.
            </p>
          </div>
        </Reveal>
      </div>
      <style>{`
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
// One visual, the 500+ band; the lead is the first of Jennie's enterprise-fit
// profiles. The 500-a-month line is the deck's ShipTime → Koherent fork
// (slide 15), stated in plain words. The band also carries how Koherent sits
// next to ShipTime (Michael: re-orient this with ShipTime's offering). The
// 500–5,000 rule comes from the deck and is flagged for Michael.
const PATH: { who: string; body: ReactNode }[] = [
  {
    who: "Under 500 a month",
    body: (
      <>
        <a href="https://www.shiptime.com" style={{ color: K.onDark, textDecoration: "underline", textDecorationColor: K.lilac, textUnderlineOffset: 3 }}>ShipTime</a>: discounted labels, every carrier, one dashboard.
      </>
    ),
  },
  { who: "500 to 5,000", body: "Start on ShipTime, and move up once your inventory is in our network." },
  { who: "5,000+, or more than one site", body: "Koherent from day one." },
];

function WhoItsFor() {
  return (
    <Sect>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            label="Who it's for"
            heading={<>For businesses with a lot of orders going to consumers.</>}
            lead="Online brands, and businesses that deliver to consumers for someone else: gifts, programs, subscriptions, store to door."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="k-band" data-k-dark="" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, marginTop: "clamp(36px, 4.5vw, 52px)", background: K.plum, borderRadius: 4, padding: "clamp(30px, 3.6vw, 44px) clamp(26px, 3.4vw, 44px)", position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "26%", background: K.violet, clipPath: "polygon(48% 0, 100% 0, 100% 100%, 48% 100%, 0 50%)", opacity: 0.45 }} />
            <div style={{ ...mono, position: "relative", fontSize: "clamp(2.2rem, 4.2vw, 3.2rem)", fontWeight: 500, lineHeight: 1, color: K.onDark }}>500+</div>
            <p style={{ ...sans, position: "relative", fontSize: "clamp(1rem, 1.35vw, 1.14rem)", lineHeight: 1.6, color: K.onDarkDim, margin: 0, maxWidth: "56ch" }}>
              <strong style={{ color: K.onDark }}>You don&rsquo;t need to be huge.</strong>{" "}Koherent starts to pay off at
              around 500 orders a month, and there&rsquo;s no ceiling.
            </p>
            <div className="k-three" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%", maxWidth: 900, marginTop: 10 }}>
              {PATH.map((p, i) => (
                <div key={p.who} style={{ borderTop: `2px solid ${i === 2 ? K.lilac : K.darkLine}`, paddingTop: 14 }}>
                  <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: K.lilac, margin: 0 }}>{p.who}</p>
                  <p style={{ ...sans, fontSize: 15, lineHeight: 1.5, color: i === 2 ? K.onDark : K.onDarkDim, fontWeight: i === 2 ? 600 : 400, margin: "6px 0 0" }}>{p.body}</p>
                </div>
              ))}
            </div>
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
function WhatWeBring() {
  return (
    <Sect id="bring">
      <div style={{ ...inner, paddingTop: 0 }}>
        <Reveal>
          <Head
            label="What we bring"
            heading={<>Everything a coherent operation needs.{" "}<span className="k-br">Already connected.</span></>}
            lead="The building blocks we design with. You use the ones you need, and we connect them into one network you can see in one place."
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
// ingredients (Oct 22) are on /koherent/how-we-work, not repeated here.
function HowWeWork() {
  return (
    <Sect id="how" bg={K.mist}>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
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
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
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
    <Sect bg={K.ink}>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
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
    <Sect>
      <div style={{ ...inner }}>
        <Reveal>
          <Head
            label="The people behind it"
            heading={<>Experienced operators, not account managers.</>}
            lead="Every account has named people on it: an operator, a support lead and a project manager."
          />
        </Reveal>
        <Reveal delay={140}>
          <blockquote style={{ margin: "clamp(32px, 4vw, 48px) auto 0", padding: 0, maxWidth: 720, textAlign: "center" }}>
            <p style={{ ...title, fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)", lineHeight: 1.3, color: K.ink, margin: 0 }}>
              &ldquo;One team of experienced operators, one plan across warehousing, fulfillment, carriers and borders, optimized as you scale.&rdquo;
            </p>
            <footer style={{ ...mono, fontSize: 12.5, letterSpacing: "0.08em", color: K.stone, marginTop: 14 }}>MICHAEL TRUEMAN · PRESIDENT</footer>
          </blockquote>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ position: "relative", maxWidth: 1000, margin: "clamp(44px, 5.5vw, 72px) auto 0", clipPath: "polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)", background: K.mist }}>
            <img
              src="/generated/koherent-bring-people-a.webp"
              alt=""
              width={1024}
              height={1536}
              loading="lazy"
              className="k-wideimg" style={{ width: "100%", height: "auto", aspectRatio: "16 / 7", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
            />
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
    { label: "Koherent", head: "Deliberately in between.", body: "The design and technology of the global giants, with named people who know your operation.", us: true },
    { label: "The global giants", head: "Capable, but you're a number.", body: "One account among thousands, at prices built for the very largest shippers." },
  ];
  return (
    <Sect bg={K.mist}>
      <div style={{ ...inner, textAlign: "center" }}>
        <Reveal>
          <Head
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
            <span style={{ color: K.plum }}>A partner that designs your logistics and runs it with you.</span>
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
          <Head label="Case studies" heading={<>What we&rsquo;re designing right now.</>} lead="Three businesses, three shapes of the same problem. Names stay private until the work is live, and every figure is from our proposals." />
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
