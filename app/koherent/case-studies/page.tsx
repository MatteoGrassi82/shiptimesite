import type { Metadata } from "next";
import { Reveal } from "@/components/ui/reveal";
import { CASES } from "@/components/sections/koherent-cases";
import { inner, K, KoherentShell, Label, PageHead, ScoreClose, Sect, mono, sans, title } from "@/components/sections/koherent-ui";

// /koherent/case-studies — the three cases from the home page, each in
// Michael's format (email "Case study – proof", Sep 15). Anonymized until the
// work is live; the data and what sits behind it are in koherent-cases.ts.
// The heading and lead are this page's own, not the home Proof section's. A
// case still in design shows its status in words: a five-stage meter nobody
// can name would only raise a question.

export const metadata: Metadata = {
  title: "Case studies",
  description: "Three businesses, three shapes of the same problem: what we're designing right now.",
};

export default function KoherentCaseStudiesPage() {
  return (
    <KoherentShell>
      <PageHead
        chapter={3}
        label="Case studies"
        heading={<>Three shapes of the same problem.</>}
        lead="Names stay private until the work is live, and every figure is from our proposals."
      />
      {CASES.map((c, i) => (
        <Sect key={c.id} id={c.id} bg={i % 2 === 0 ? K.mist : K.paper}>
          <div className="k-two" style={{ ...inner, paddingTop: "clamp(56px, 7vw, 96px)", paddingBottom: "clamp(56px, 7vw, 96px)", display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "clamp(28px, 4.5vw, 64px)", alignItems: "start" }}>
            <Reveal style={{ textAlign: "left" }}>
              <Label>
                {String(i + 1).padStart(2, "0")} · {c.sector}
              </Label>
              <h2 style={{ ...title, fontSize: "clamp(2rem, 3.6vw, 2.9rem)", color: K.ink, margin: "16px 0 0" }}>{c.shape}</h2>
              <p style={{ ...sans, fontSize: "clamp(1.02rem, 1.3vw, 1.12rem)", lineHeight: 1.6, color: K.stone, margin: "14px 0 0", maxWidth: "40ch" }}>{c.short}</p>
              <div style={{ marginTop: 26, maxWidth: 380 }}>
                {c.figure ? (
                  <div style={{ background: K.ink, borderRadius: 4, padding: "18px 20px 16px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ ...mono, fontSize: 34, fontWeight: 500, lineHeight: 1, color: K.onDark }}>{c.figure.to}</span>
                      {/* <s> plus the hidden words, so a screen reader doesn't hear two prices in a row */}
                      <span className="sr-only">down from </span>
                      <s style={{ ...mono, fontSize: 15, color: K.onDarkDim, textDecorationColor: K.lilac }}>{c.figure.from}</s>
                    </div>
                    <p style={{ ...sans, fontSize: 13.5, color: K.onDarkDim, margin: "8px 0 0" }}>{c.figure.unit}</p>
                    <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac, margin: "10px 0 0" }}>{c.status}</p>
                  </div>
                ) : (
                  <div style={{ display: "inline-block", background: i % 2 === 0 ? K.card : K.mist, borderRadius: 4, padding: "10px 14px" }}>
                    <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.plum, margin: 0 }}>{c.status}</p>
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <dl style={{ margin: 0, textAlign: "left" }}>
                {c.detail.map(([k, v], n) => (
                  <div key={k} className="k-caserow" style={{ display: "grid", gridTemplateColumns: "minmax(140px, 0.36fr) 1fr", gap: 18, padding: "18px 0", borderTop: `1px solid ${K.line}`, borderBottom: n === c.detail.length - 1 ? `1px solid ${K.line}` : undefined }}>
                    <dt style={{ ...mono, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: K.violet, paddingTop: 3 }}>{k}</dt>
                    <dd style={{ ...sans, fontSize: 16, lineHeight: 1.6, color: K.ink, margin: 0 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Sect>
      ))}
      {/* the next chapter is the score, which ScoreClose already is */}
      <ScoreClose />
      <style>{`@media (max-width: 640px) { .k-caserow { grid-template-columns: 1fr !important; gap: 6px !important; } }`}</style>
    </KoherentShell>
  );
}
