import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { BlockScroller } from "@/components/sections/koherent-scroller";
import { MethodPlayer } from "@/components/sections/koherent-method";
import { TargetTriangle } from "@/components/sections/koherent-target";
import { NetworkLattice } from "@/components/sections/koherent-lattice";
import { CountUp } from "@/components/sections/koherent-fx";
import { KbStyles } from "@/components/sections/koherent-live";
import { HOME, HOW } from "@/components/sections/koherent-copy";
import { R2Styles, WidgetView, wrap } from "@/components/sections/koherent-page";
import { CHAPTERS, Head, K, KoherentShell, Label, PAGES, ScoreClose, Sect, Steps, display, mono, sans } from "@/components/sections/koherent-ui";

// /koherent/how-it-works — revision 2 (Oct 30). Jenny's four solutions
// (Ship, Fulfill, Optimize, Manage) as the first revision's scroller, words
// left and the widget pinned right, then Chris's six steps and four
// ingredients (how we work is the product), then the design target. It takes
// over from the first revision's What we bring and How we work pages, which
// redirect here, so Michael's lattice and blocks and Chris's method all live
// on this one page. The hero is What we bring's network hero (Matteo, Oct 28),
// with the home page's numbers so both pages say the same thing.

export const metadata: Metadata = {
  title: "How it works",
  description: "Ship, Fulfill, Optimize and Manage, designed together and run with you by one team.",
};

export default function KoherentHowItWorksPage() {
  const blocks = HOW.four.map((b, i) => ({
    id: b.id,
    n: String(i + 1).padStart(2, "0"),
    name: b.name,
    line: b.line,
    points: b.points,
    widget: <WidgetView name={b.widget} />,
    link: "link" in b ? b.link : undefined,
  }));
  return (
    <KoherentShell>
      {/* the hero is the network (Matteo, Oct 28: "Our network is good"): the
          heading over Michael's lattice, then the numbers behind it */}
      <Sect bg={K.ink}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(48px, 6vw, 88px) clamp(20px, 4vw, 56px) 0", textAlign: "center" }}>
          <Reveal style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <Steps total={CHAPTERS.length} done={1} size={13} onDark />
            <Label onDark>{HOW.label}</Label>
          </Reveal>
          <h1 className="k-fade" style={{ ...display, fontSize: "clamp(2.5rem, 5.4vw, 4.4rem)", color: K.onDark, margin: "20px auto 0", maxWidth: "22ch", textWrap: "balance", animationDelay: "0.08s" }}>
            {HOW.headline}
          </h1>
          <p className="k-fade" style={{ ...sans, fontSize: "clamp(1.05rem, 1.35vw, 1.2rem)", lineHeight: 1.6, color: K.onDarkDim, margin: "20px auto 0", maxWidth: "52ch", animationDelay: "0.16s" }}>
            {HOW.lead}
          </p>
          <div className="k-fade" style={{ marginTop: "clamp(24px, 3vw, 40px)", animationDelay: "0.24s" }}>
            <NetworkLattice />
          </div>
        </div>
        <Reveal className="k-netfacts" style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(28px, 3.5vw, 44px) clamp(20px, 4vw, 56px) clamp(40px, 5vw, 60px)", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 18, textAlign: "center" }}>
          {HOME.facts.map(([v, l]) => (
            <div key={l}>
              <div style={{ ...mono, fontSize: "clamp(2rem, 3.6vw, 2.8rem)", fontWeight: 500, lineHeight: 1, color: K.onDark, whiteSpace: "nowrap" }}><CountUp value={v} /></div>
              <p style={{ ...sans, fontSize: 15, color: K.onDarkDim, margin: "10px 0 0" }}>{l}</p>
            </div>
          ))}
        </Reveal>
        <style>{`@media (max-width: 760px) { .k-netfacts { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; row-gap: 28px !important; } }`}</style>
      </Sect>

      {/* overflow visible: a clipping section would stop the widget pinning */}
      <Sect style={{ overflow: "visible" }}>
        <div style={{ ...wrap, paddingTop: "clamp(8px, 1.5vw, 24px)" }}>
          <BlockScroller blocks={blocks} />
        </div>
        <KbStyles />
      </Sect>

      <Sect id="method">
        <div style={wrap}>
          <Reveal>
            <Head label={HOW.method.label} heading={HOW.method.heading} lead={HOW.method.lead} />
          </Reveal>
          <Reveal delay={80}>
            <div style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
              <MethodPlayer />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <ul style={{ listStyle: "none", padding: 0, margin: "30px 0 0", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
              {HOW.ingredients.map((t) => (
                <li key={t} style={{ ...sans, fontSize: 14.5, fontWeight: 500, color: K.ink, border: `1px solid ${K.line}`, background: K.wash, borderRadius: 999, padding: "9px 16px" }}>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Sect>

      <Sect id="target" bg={K.ink}>
        <div style={wrap}>
          <Reveal>
            <Head label={HOW.target.label} onDark heading={HOW.target.heading} lead={HOW.target.lead} />
          </Reveal>
          <Reveal delay={100}>
            <div style={{ marginTop: "clamp(44px, 5vw, 72px)" }}>
              <TargetTriangle />
            </div>
          </Reveal>
        </div>
      </Sect>

      <ScoreClose next={{ href: PAGES.cases, name: "Customer stories" }} />
      <R2Styles />
    </KoherentShell>
  );
}
