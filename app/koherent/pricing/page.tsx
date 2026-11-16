import { Reveal } from "@/components/ui/reveal";
import { pageByKey } from "@/components/sections/koherent-copy";
import { BlockView, CloseBand, PageHero, R2Styles, r2Metadata, wrap } from "@/components/sections/koherent-page";
import { SavingsCalculator } from "@/components/sections/koherent-pricing";
import { box, Head, K, KoherentShell, mono, Sect, sans, title } from "@/components/sections/koherent-ui";

// /koherent/pricing — Pelago's shape (pelagohealth.com/pricing, Matteo,
// Nov 16): savings first, the proof, how pricing works, the calculator, how
// we calculate it, then the questions people ask. Jenny's headline and her
// three cards stay. The four figures are the home page's (Michael confirms).
export const metadata = r2Metadata("pricing");

const FACTS: [string, string][] = [
  ["2M+", "shipments a year"],
  ["1,000+", "businesses on the platform"],
  ["20 years", "in shipping and logistics"],
  ["800+", "partner warehouse locations"],
];

const HOW: [string, string][] = [
  ["You see the rate before you ship", "The price on screen is the price on your invoice, with our discount in it. Every invoice is checked against the quote, and adjustments are disputed for you."],
  ["Your rates or ours, the best value wins", "Bring your own carrier contracts. We compare them with our rates on every order and pick the one that meets your rules."],
  ["It starts with a free audit", "We go through your last invoices and show you, line by line, what the same shipments cost on Koherent. Most enterprise brands then start with a pilot."],
];

const FAQ: [string, string][] = [
  ["Where do these estimates come from?", "From your answers and two inputs we show you. The rate saving is our assumption, 10% by default, and you can move it. The cross-border figure comes from a proposal for a US golf brand entering Canada: $25.00 a shipment from Texas, $13.22 shipped inside Canada. That figure is proposed, not yet realized."],
  ["Why is it only an estimate?", "Every shipping profile is different: weights, zones, surcharges, the carriers you already have. The free audit replaces every assumption with the numbers from your own invoices."],
  ["How does billing work?", "Growing brands pay the shipping rate they see on screen, with no monthly platform fee and no volume commitment. Enterprise brands pay a platform subscription plus a per-label fee, scoped to their volume and locations. 3PL partners join for free."],
  ["Do I have to change my carriers or my store?", "No. Your store, your listings, your warehouse and your carrier contracts stay. We connect to them, and labels print from one screen."],
  ["Is anything I enter here stored?", "No. The calculator runs in your browser, and nothing you enter is saved or sent anywhere."],
];

export default function KoherentPricingPage() {
  const page = pageByKey("pricing");
  const [tiers, shiptime] = page.blocks;
  return (
    <KoherentShell>
      <PageHero page={page} />

      {/* the proof, as Pelago's three numbers under its hero */}
      <Sect>
        <div style={{ ...wrap, paddingTop: "clamp(28px, 4vw, 48px)" }}>
          <div className="k-c4" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 1, background: K.line, border: `1px solid ${K.line}`, borderRadius: 12, overflow: "hidden" }}>
            {FACTS.map(([n, l]) => (
              <div key={l} style={{ background: K.card, padding: "22px 22px 20px" }}>
                <span style={{ ...mono, display: "block", fontSize: "clamp(1.7rem, 2.6vw, 2.2rem)", fontWeight: 500, color: K.plum }}>{n}</span>
                <span style={{ ...sans, display: "block", fontSize: 14.5, color: K.stone, marginTop: 6 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Sect>

      {/* how our pricing works */}
      <Sect bg={K.wash}>
        <div style={wrap}>
          <Reveal>
            <Head label="How our pricing works" heading="Built around what you save, not what you sign." />
          </Reveal>
          <div className="k-c4" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18, marginTop: 40 }}>
            {HOW.map(([h, b], i) => (
              <Reveal key={h} delay={i * 80} style={{ height: "100%" }}>
                <div style={{ ...box, height: "100%", padding: "26px 24px" }}>
                  <span style={{ ...mono, fontSize: 12, letterSpacing: "0.1em", color: K.violet }}>0{i + 1}</span>
                  <h3 style={{ ...title, fontSize: "1.25rem", color: K.ink, margin: "10px 0 0" }}>{h}</h3>
                  <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.stone, margin: "10px 0 0" }}>{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Sect>

      {/* the calculator */}
      <Sect id="calculator">
        <div style={wrap}>
          <Reveal>
            <Head label="Calculate your savings" heading="See what Koherent could save you." lead="Five questions, about a minute. The free audit then replaces every assumption with your own invoices." />
          </Reveal>
          <div style={{ marginTop: 40 }}>
            <SavingsCalculator />
          </div>
        </div>
      </Sect>

      {/* Jenny's three cards, one per door */}
      <BlockView b={{ ...tiers, label: "By door", heading: "What each kind of business pays." }} i={1} />

      {/* how we calculate this, then the questions */}
      <Sect bg={K.wash}>
        <div style={{ ...wrap, maxWidth: 860 }}>
          <Reveal>
            <Head label="Questions" heading="How we calculate this, and what people ask." />
          </Reveal>
          <div style={{ marginTop: 34, display: "grid", gap: 10 }}>
            {FAQ.map(([q, a]) => (
              <details key={q} style={{ ...box, padding: "18px 22px" }}>
                <summary style={{ ...sans, fontSize: 16.5, fontWeight: 700, color: K.ink, cursor: "pointer" }}>{q}</summary>
                <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.65, color: K.stone, margin: "12px 0 0" }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Sect>

      <BlockView b={shiptime} i={3} />
      <CloseBand close={page.close} />
      <R2Styles />
    </KoherentShell>
  );
}
