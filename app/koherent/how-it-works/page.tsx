import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BlockScroller } from "@/components/sections/koherent-scroller";
import { MethodPlayer } from "@/components/sections/koherent-method";
import { TargetTriangle } from "@/components/sections/koherent-target";
import { NetworkLattice } from "@/components/sections/koherent-lattice";
import { KbStyles } from "@/components/sections/koherent-live";
import { HOW } from "@/components/sections/koherent-copy";
import { R2Styles, WidgetView, wrap } from "@/components/sections/koherent-page";
import { Head, K, KoherentShell, PAGES, PageHead, Primary, ScoreClose, Secondary, Sect, sans } from "@/components/sections/koherent-ui";

// /koherent/how-it-works — revision 2 (Oct 30). Jenny's four solutions
// (Ship, Fulfill, Optimize, Manage) as the first revision's scroller, words
// left and the widget pinned right, then Chris's six steps and four
// ingredients (how we work is the product), then the design target. It takes
// over from the first revision's What we bring and How we work pages, which
// redirect here, so Michael's lattice and blocks and Chris's method all live
// on this one page.

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
      <PageHead chapter={1} label={HOW.label} heading={HOW.headline} lead={HOW.lead} aside={<NetworkLattice compact />}>
        <Primary href={PAGES.contact}>
          Talk to an advisor <ArrowRight size={16} />
        </Primary>
        <Secondary href={PAGES.score}>Get your logistics score</Secondary>
      </PageHead>

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
