import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { CASES } from "@/components/sections/koherent-cases";
import { MethodScreen } from "@/components/sections/koherent-method";
import { inner, K, KoherentShell, Label, PageHead, ScoreClose, Sect, Steps, mono, sans, title } from "@/components/sections/koherent-ui";

// /koherent/case-studies — rethought on Oct 28 (Matteo: "doesn't look like a
// case study page at all"). Each case is now its own study, in the shape a
// buyer expects: a header strip with the business, where it stands and the
// one figure; then the story in Michael's rows (email "Case study – proof",
// Sep 15) on the left and a screen of what it looks like on the right. The
// screens are the How we work step screens for the stage each case is at
// (design, test, go-live), so the pages agree; every one is captioned as
// illustrative. Anonymized until the work is live (koherent-cases.ts).

export const metadata: Metadata = {
  title: "Case studies",
  description: "Three businesses, three goals: what we're designing right now.",
};

// Which step screen stands for each case: the golf brand is at the design
// stage, the promotional company tests at its own dock, the workshop is live.
const SCREEN: Record<string, { n: number; caption: string }> = {
  "entering-canada": { n: 2, caption: "Design · the network we proposed, priced before they commit" },
  "campaigns-to-consumers": { n: 3, caption: "Test · their orders replayed on the new design before anything changes" },
  "jobs-from-every-counter": { n: 4, caption: "Go live · switched on at the counters, nothing paused" },
};

const STEP_NAMES = ["Assess", "Plan", "Design", "Test", "Go live", "Improve"];
const STAGE_OF: Record<string, number> = { "Proposed, not yet realized": 3, "In design": 3, Built: 5 };

export default function KoherentCaseStudiesPage() {
  return (
    <KoherentShell>
      <PageHead
        chapter={2}
        label="Case studies"
        heading={<>Three businesses, three goals.</>}
        lead="Names stay private until the work is live, and every figure is from our proposals."
        aside={
          <div data-k-dark="" style={{ background: K.ink, borderRadius: 8, padding: "10px 12px", display: "grid", gap: 10 }}>
            {CASES.map((c, i) => (
              <a key={c.id} href={`#${c.id}`} className="k-lift" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 14, alignItems: "center", textDecoration: "none", background: i === 0 ? K.plum : "rgba(246,243,238,0.06)", border: `1px solid ${i === 0 ? K.plum : "rgba(199,174,230,0.18)"}`, borderRadius: 6, padding: "16px 18px" }}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ ...mono, display: "block", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: K.lilac }}>{String(i + 1).padStart(2, "0")} · {c.sector}</span>
                  <span style={{ ...title, display: "block", fontSize: "1.2rem", color: K.onDark, margin: "6px 0 0" }}>{c.shape}</span>
                  <span style={{ ...sans, display: "block", fontSize: 13.5, lineHeight: 1.5, color: K.onDarkDim, margin: "6px 0 0" }}>{c.short.split(". ")[0]}.</span>
                </span>
                <span style={{ textAlign: "right" }}>
                  {c.figure ? (
                    <>
                      <span style={{ ...mono, display: "block", fontSize: 26, fontWeight: 500, lineHeight: 1, color: K.onDark }}>{c.figure.to}</span>
                      <span style={{ ...mono, display: "block", fontSize: 12, color: K.onDarkDim, textDecoration: "line-through", textDecorationColor: K.lilac, marginTop: 4 }}>{c.figure.from}</span>
                      <span style={{ ...mono, display: "block", fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac, marginTop: 6 }}>proposed</span>
                    </>
                  ) : (
                    <span style={{ ...mono, display: "inline-block", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: K.lilac, border: "1px solid rgba(199,174,230,0.3)", borderRadius: 999, padding: "5px 10px" }}>{c.status}</span>
                  )}
                </span>
              </a>
            ))}
          </div>
        }
      />

      {CASES.map((c, i) => {
        const screen = SCREEN[c.id];
        const stage = STAGE_OF[c.status] ?? 3;
        const dark = i === 1;
        const fg = dark ? K.onDark : K.ink;
        const dim = dark ? K.onDarkDim : K.stone;
        const line = dark ? K.darkLine : K.line;
        return (
          <Sect key={c.id} id={c.id} bg={dark ? K.ink : i === 0 ? K.mist : K.paper} style={{ overflow: "visible" }}>
            <div style={{ ...inner, paddingTop: "clamp(56px, 7vw, 96px)", paddingBottom: "clamp(56px, 7vw, 96px)" }}>
              {/* the header strip: who, where it stands, the figure */}
              <Reveal>
                <div className="k-case-head" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr) auto", gap: "clamp(20px, 3vw, 44px)", alignItems: "end", paddingBottom: 24, borderBottom: `1px solid ${line}`, textAlign: "left" }}>
                  <div>
                    <Label onDark={dark}>
                      {String(i + 1).padStart(2, "0")} · {c.sector}
                    </Label>
                    <h2 style={{ ...title, fontSize: "clamp(2rem, 3.8vw, 3.1rem)", color: fg, margin: "14px 0 0" }}>{c.shape}</h2>
                  </div>
                  <div>
                    <p style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: dark ? K.lilac : K.violet, margin: 0 }}>Where it stands</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                      <Steps total={6} done={stage} size={13} onDark={dark} />
                      <span style={{ ...sans, fontSize: 14.5, fontWeight: 600, color: fg }}>{c.status}</span>
                    </div>
                    <p style={{ ...sans, fontSize: 13, color: dim, margin: "6px 0 0" }}>{STEP_NAMES[stage - 1]} of six steps</p>
                  </div>
                  <div className="k-case-fig" style={{ textAlign: "right" }}>
                    {c.figure ? (
                      <>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 10 }}>
                          <span style={{ ...mono, fontSize: "clamp(2.2rem, 3.6vw, 3rem)", fontWeight: 500, lineHeight: 1, color: dark ? K.onDark : K.plum }}>{c.figure.to}</span>
                          <span className="sr-only">down from </span>
                          <s style={{ ...mono, fontSize: 15, color: dim, textDecorationColor: K.lilac }}>{c.figure.from}</s>
                        </div>
                        <p style={{ ...sans, fontSize: 13, color: dim, margin: "6px 0 0" }}>{c.figure.unit} · proposed</p>
                      </>
                    ) : (
                      <p style={{ ...sans, fontSize: 13.5, color: dim, margin: 0, maxWidth: "22ch" }}>No figure until it&rsquo;s live. We publish what we measure, not what we hope.</p>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* the story on the left, what it looks like on the right */}
              <div className="k-case-body" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "clamp(28px, 5vw, 72px)", alignItems: "start", marginTop: "clamp(28px, 4vw, 48px)" }}>
                <Reveal delay={80}>
                  <dl style={{ margin: 0, textAlign: "left" }}>
                    {c.detail.map(([k, v], n) => (
                      <div key={k} style={{ paddingTop: n ? 18 : 0, marginTop: n ? 18 : 0, borderTop: n ? `1px solid ${line}` : "none" }}>
                        <dt style={{ ...mono, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: dark ? K.lilac : K.violet }}>{k}</dt>
                        <dd style={{ ...sans, fontSize: 16, lineHeight: 1.6, color: fg, margin: "6px 0 0" }}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
                <Reveal delay={160}>
                  <div className="k-case-screen" style={{ position: "sticky", top: 96 }}>
                    <MethodScreen n={screen.n} />
                    <p style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: dim, margin: "12px 0 0", textAlign: "left" }}>{screen.caption} · example account, illustrative</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </Sect>
        );
      })}

      <ScoreClose />
      <style>{`
        @media (max-width: 960px) {
          .k-case-head { grid-template-columns: 1fr !important; align-items: start !important; }
          .k-case-fig { text-align: left !important; }
          .k-case-fig > div { justify-content: flex-start !important; }
          .k-case-body { grid-template-columns: 1fr !important; }
          .k-case-screen { position: relative !important; top: auto !important; }
        }
      `}</style>
    </KoherentShell>
  );
}
