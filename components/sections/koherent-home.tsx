import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import { KoherentHeroArt } from "./koherent-hero-art";
import { BringBento } from "./koherent-bring";
import { FitSlider } from "./koherent-fit";
import { CountUp } from "./koherent-fx";
import { LogoRow } from "./koherent-logos";
import { HOME } from "./koherent-copy";
import { CardGrid, CasesRow, R2Styles, wrap } from "./koherent-page";
import { box, K, KMark, KoherentShell, Label, More, PAGES, Primary, ScoreClose, Secondary, Sect, display, mono, sans, title } from "./koherent-ui";

// ── /koherent — revision 2 (Oct 30), "our story, her structure" ──────────────
// The first revision's story, the one Michael and Chris shaped, in white:
// what we are and who it's for (Michael's 15-second test), the problem and
// his moving questions, who it's for, what we bring, the cases, the people,
// the score. From Jenny's draft (Oct 29): her best line ("a label / a
// building / the outcome") as the problem's heading, her three doors with
// the door finder sending smaller shippers to ShipTime, white with boxes.
// One idea and one visual per section. The hero stays Hero C, Matteo's Oct 28
// pick: Jenny's "looks AI" (Oct 29 L10) was about the tan, not the picture.

const para = { ...sans, fontSize: "clamp(1.02rem, 1.25vw, 1.12rem)", lineHeight: 1.7, color: K.stone, margin: "18px auto 0", maxWidth: "60ch" };
const h2 = { ...title, fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)", color: K.ink, margin: "14px auto 0", maxWidth: "26ch" };

function SectionHead({ label, heading, lead }: { label?: string; heading: ReactNode; lead?: string }) {
  return (
    <Reveal style={{ textAlign: "center" }}>
      {label && <Label>{label}</Label>}
      <h2 style={{ ...h2, marginTop: label ? 14 : 0 }}>{heading}</h2>
      {lead && <p style={para}>{lead}</p>}
    </Reveal>
  );
}

// ── hero ─────────────────────────────────────────────────────────────────────
// Hero C from the Oct 28 lab (Matteo's pick), as on the first revision: words
// left, the picture right, tall and off the page edge, with the pieces, the
// K, the sweep and the cost card (koherent-hero-art.tsx). The words are
// Michael's headline and 15-second sentence, then Chris's category.
function Hero() {
  return (
    <Sect style={{ overflow: "hidden" }}>
      <div className="k-hero" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0 0 clamp(20px, 4vw, 56px)", display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "clamp(24px, 4vw, 56px)", alignItems: "center", minHeight: "min(84vh, 760px)" }}>
        <div className="k-hero-text" style={{ padding: "clamp(44px, 6vw, 80px) 0" }}>
          <div className="k-fade" style={{ animationDelay: "0.05s" }}>
            <Label>{HOME.label}</Label>
          </div>
          <h1 className="k-fade" style={{ ...display, fontSize: "clamp(2.7rem, 5.6vw, 4.7rem)", color: K.plum, margin: "20px 0 0", animationDelay: "0.12s" }}>
            {HOME.headline}
          </h1>
          {/* who it's for and what we do, first: Michael's 15-second test */}
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)", fontWeight: 500, lineHeight: 1.45, color: K.ink, margin: "22px 0 0", maxWidth: "34ch", animationDelay: "0.24s" }}>
            {HOME.lead}
          </p>
          {/* Chris's category, in the first panel */}
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1rem, 1.2vw, 1.08rem)", lineHeight: 1.6, color: K.stone, margin: "14px 0 0", maxWidth: "46ch", animationDelay: "0.32s" }}>
            {HOME.sub}
          </p>
          <div className="k-fade k-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30, animationDelay: "0.42s" }}>
            <Primary href={PAGES.score}>
              Get your logistics score <ArrowRight size={16} />
            </Primary>
            <Secondary href={PAGES.contact}>Talk to an advisor</Secondary>
          </div>
        </div>

        {/* the dusk aisle is a generated placeholder, labelled, until our own shoot */}
        <KoherentHeroArt src="/generated/koherent-hero-a.webp" alt="" />
      </div>
    </Sect>
  );
}

// The numbers, straight after the hero: every competitor shows proof early
// (Oct 30), and until customer logos are approved these are ours, with the
// systems we connect to.
function Facts() {
  return (
    <Sect>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(28px, 3.5vw, 48px) clamp(20px, 4vw, 56px) clamp(24px, 3vw, 40px)" }}>
        <Reveal>
          <div className="k-facts" style={{ ...box, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {HOME.facts.map(([v, l]) => (
              <div key={l} className="k-fact" style={{ padding: "22px 24px", borderRight: `1px solid ${K.line}` }}>
                <div style={{ ...mono, fontSize: "clamp(1.7rem, 2.6vw, 2.3rem)", fontWeight: 500, lineHeight: 1, color: K.plum }}>
                  <CountUp value={v} />
                </div>
                <p style={{ ...sans, fontSize: 14, color: K.stone, margin: "8px 0 0" }}>{l}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px 18px", marginTop: 22 }}>
            <span style={{ ...mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: K.stone }}>Connects to the systems you already run</span>
            <LogoRow more="+ 30 more" style={{ justifyContent: "center" }} />
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── the problem: Jenny's line, then Michael's questions ──────────────────────
// Michael: one sentence that sums up the problem, then the questions become
// its specifics, and "one system answers these, and more". The questions move
// on a desktop and pause under the pointer (Michael, Oct 19: "I like the idea
// of the moving questions"); on a phone, with reduced motion and for screen
// readers they're one still list (the six marked `phone` on a phone, his
// three among them).
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
    <span className="k-qchip" style={{ ...sans, display: "inline-flex", alignItems: "center", fontSize: 15, fontWeight: strong ? 600 : 500, color: K.ink, background: K.card, border: `1px solid ${strong ? K.violet : K.line}`, borderRadius: 999, padding: "10px 18px", whiteSpace: "nowrap", boxShadow: "0 6px 16px -12px rgba(23,16,28,0.3)" }}>
      {children}
    </span>
  );
}

function Outcome() {
  const three: { who: string; what: string; us?: boolean }[] = [
    { who: "Shipping software", what: "A label." },
    { who: "A 3PL", what: "A building." },
    { who: "Koherent", what: "The outcome.", us: true },
  ];
  return (
    <Sect id="outcome">
      <div style={{ ...wrap, paddingBottom: "clamp(36px, 4.5vw, 56px)" }}>
        <SectionHead label="The problem" heading={HOME.outcome.heading} />
        <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, marginTop: "clamp(32px, 4.5vw, 48px)" }}>
          {three.map((c, n) => (
            <Reveal key={c.who} delay={n * 90}>
              <div data-k-dark={c.us ? "" : undefined} style={{ ...box, height: "100%", textAlign: "center", padding: "26px 22px", background: c.us ? K.plum : K.card, borderColor: c.us ? K.plum : K.line }}>
                <Label onDark={c.us}>{c.who}</Label>
                <p style={{ ...display, fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", color: c.us ? K.onDark : K.ink, margin: "12px 0 0" }}>{c.what}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p style={{ ...para, textAlign: "center", marginTop: 28 }}>{HOME.outcome.body}</p>
        </Reveal>
      </div>

      <Reveal delay={80}>
        <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", color: K.violet, textAlign: "center", margin: 0 }}>The questions that keep coming back</p>
        <div aria-hidden className="k-mq" style={{ position: "relative", margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "clamp(40px, 8vw, 140px)", zIndex: 2, background: `linear-gradient(90deg, ${K.paper}, transparent)` }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "clamp(40px, 8vw, 140px)", zIndex: 2, background: `linear-gradient(270deg, ${K.paper}, transparent)` }} />
          {[0, 1, 2].map((row) => (
            <Marquee key={row} pauseOnHover reverse={row === 1} className={["[--duration:52s]", "[--duration:60s]", "[--duration:48s]"][row] + " [--gap:0.75rem]"} repeat={4}>
              {QUESTIONS.filter((_, i) => i % 3 === row).map((q) => (
                <QuestionChip key={q.q} strong={q.michael}>
                  {q.q}
                </QuestionChip>
              ))}
            </Marquee>
          ))}
        </div>
        <ul className="k-qlist" style={{ listStyle: "none", padding: "0 clamp(20px, 4vw, 56px)", margin: "22px auto 0", maxWidth: 1100, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {QUESTIONS.map((q) => (
            <li key={q.q} className={q.phone ? undefined : "k-q-more"}>
              <QuestionChip strong={q.michael}>{q.q}</QuestionChip>
            </li>
          ))}
        </ul>
      </Reveal>

      <div style={{ ...wrap, paddingTop: "clamp(32px, 4vw, 48px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ ...title, fontSize: "clamp(1.3rem, 2vw, 1.65rem)", lineHeight: 1.3, color: K.ink, maxWidth: "36ch", margin: "0 auto" }}>
            We’ve heard every one. It’s a design problem. <span style={{ color: K.plum }}>One coherent system answers these, and more.</span>
          </p>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── who it's for: Jenny's doors, and the finder ──────────────────────────────
function Doors() {
  return (
    <Sect id="doors">
      <div style={wrap}>
        <SectionHead label={HOME.doors.label} heading={HOME.doors.heading} />
        <div style={{ marginTop: "clamp(32px, 4.5vw, 48px)" }}>
          <CardGrid cards={HOME.doors.cards} cols={3} />
        </div>
        <Reveal delay={120}>
          <div data-k-dark="" style={{ position: "relative", overflow: "hidden", marginTop: 18, background: K.plum, borderRadius: 14, padding: "clamp(28px, 3.6vw, 44px) clamp(22px, 3.4vw, 44px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
            <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "26%", background: K.violet, clipPath: "polygon(48% 0, 100% 0, 100% 100%, 48% 100%, 0 50%)", opacity: 0.45 }} />
            <p style={{ ...title, position: "relative", fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", color: K.onDark, margin: 0 }}>Grow your network, not your overhead.</p>
            <FitSlider />
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── how it works: the six building blocks ────────────────────────────────────
// Michael's building blocks as the bento Matteo picked (Oct 23), under Chris's
// "not what we sell, but what we design with". The detail is on How it works.
function How() {
  return (
    <Sect id="how">
      <div style={wrap}>
        <SectionHead label={HOME.how.label} heading={HOME.how.heading} lead={HOME.how.lead} />
        <BringBento />
        <Reveal delay={120}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <More href={PAGES.works}>Ship, Fulfill, Optimize and Manage, in detail</More>
          </div>
        </Reveal>
      </div>
    </Sect>
  );
}

// ── customer stories ─────────────────────────────────────────────────────────
function Stories() {
  return (
    <Sect id="stories">
      <div style={wrap}>
        <SectionHead label={HOME.stories.label} heading={HOME.stories.heading} lead={HOME.stories.lead} />
        <div style={{ marginTop: "clamp(32px, 4.5vw, 48px)" }}>
          <CasesRow />
        </div>
      </div>
    </Sect>
  );
}

// ── the people ───────────────────────────────────────────────────────────────
// Chris's "experienced operators, not account managers" (Aug 7), Michael's
// "our technology is the superpower" (Aug 6) and his own line with his photo
// (Oct 19), the three named roles on every account (deck slide 11), and
// Jenny's ask: talk to someone who has run a logistics operation.
const TEAM: { role: string; does: string }[] = [
  { role: "Account manager", does: "Owns the relationship, knows your plans. One call for anything." },
  { role: "Operator on the ground", does: "At your sites, in the daily rhythm with your team." },
  { role: "Support lead", does: "Direct lines to customer service, technical and logistics support." },
];

function People() {
  return (
    <Sect id="people">
      <div style={wrap}>
        <SectionHead label={HOME.people.label} heading={HOME.people.heading} lead={HOME.people.lead} />
        <div className="k-two" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18, marginTop: "clamp(32px, 4.5vw, 48px)", alignItems: "stretch" }}>
          <Reveal style={{ height: "100%" }}>
            <div style={{ ...box, height: "100%", padding: "clamp(22px, 3vw, 32px)", display: "grid", gap: 10, alignContent: "start" }}>
              {TEAM.map((t) => (
                <div key={t.role} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: K.wash, border: `1px solid ${K.line}`, borderRadius: 10, padding: "14px 16px" }}>
                  <span aria-hidden style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", background: K.mist, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <KMark color={K.plum} style={{ width: 16, height: 16 }} />
                  </span>
                  <span>
                    <span style={{ ...title, display: "block", fontSize: "1.05rem", color: K.ink }}>{t.role}</span>
                    <span style={{ ...sans, display: "block", fontSize: 14.5, lineHeight: 1.5, color: K.stone, marginTop: 3 }}>{t.does}</span>
                    <span style={{ ...mono, display: "block", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: K.violet, marginTop: 6 }}>Named when you join</span>
                  </span>
                </div>
              ))}
              <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.ink, margin: "8px 0 0" }}>One partner accountable for the whole: we take the issue, own it, and keep you informed until it’s resolved.</p>
            </div>
          </Reveal>
          <Reveal delay={120} style={{ height: "100%" }}>
            <figure data-k-dark="" style={{ position: "relative", overflow: "hidden", height: "100%", margin: 0, background: K.plum, borderRadius: 12, padding: "clamp(28px, 3.6vw, 44px) clamp(22px, 3.4vw, 40px)", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
              <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "34%", background: K.violet, clipPath: "polygon(48% 0, 100% 0, 100% 100%, 48% 100%, 0 50%)", opacity: 0.45 }} />
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- a 200px headshot */}
                <img src="/team/michael-trueman.jpg" alt="Michael Trueman" width={200} height={200} loading="lazy" style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto", border: `3px solid ${K.paper}`, boxShadow: "0 16px 36px -16px rgba(23,16,28,0.7)" }} />
                <blockquote style={{ margin: "20px auto 0", padding: 0, maxWidth: 520 }}>
                  <p style={{ ...title, fontSize: "clamp(1.25rem, 1.9vw, 1.55rem)", lineHeight: 1.3, color: K.onDark, margin: 0 }}>
                    &ldquo;Our team of experienced operators, one plan across warehousing, fulfillment, carriers and borders, optimized as you scale.&rdquo;
                  </p>
                  <footer style={{ ...mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: K.lilac, marginTop: 14 }}>Michael Trueman · President</footer>
                </blockquote>
                <p style={{ ...sans, fontSize: "clamp(0.98rem, 1.2vw, 1.05rem)", lineHeight: 1.6, color: K.onDarkDim, margin: "22px auto 0", maxWidth: "46ch", paddingTop: 20, borderTop: `1px solid ${K.darkLine}` }}>
                  <strong style={{ color: K.onDark }}>Why we get up every day:</strong> to help our customers grow their business through logistics done smarter. Same side of the table, for the long run.
                </p>
              </div>
            </figure>
          </Reveal>
        </div>
        <Reveal>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <p style={{ ...title, fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)", color: K.ink, margin: 0 }}>{HOME.people.ask}</p>
            {/* Jenny's line from her copy doc (it sat under the hero buttons until Oct 30) */}
            <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.6, color: K.stone, margin: "8px 0 0" }}>{HOME.people.askNote}</p>
            <div className="k-cta" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 18 }}>
              <Primary href={PAGES.contact}>
                Talk to an advisor <ArrowRight size={16} />
              </Primary>
            </div>
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
      <Facts />
      <Outcome />
      <Doors />
      <How />
      <Stories />
      <People />
      <ScoreClose next={{ href: PAGES.works, name: "How it works" }} />
      <R2Styles />
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
        @media (max-width: 760px) {
          .k-facts { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .k-fact:nth-child(2n) { border-right: none !important; }
          .k-fact:nth-child(-n + 2) { border-bottom: 1px solid ${K.line}; }
        }
        @media (min-width: 761px) { .k-fact:last-child { border-right: none !important; } }
      `}</style>
    </KoherentShell>
  );
}
