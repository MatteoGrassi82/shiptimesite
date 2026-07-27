import { Container, Heading, Lead } from "./primitives";
import type { NumberedStepsBlock } from "./types";

// A phased walkthrough / engagement model — "three phases", "how it works",
// "the engagement, step by step". Reused across the homepage, LOS, and
// how-we-work rather than building a bespoke layout per page.
export function NumberedSteps({ heading, intro, steps }: NumberedStepsBlock) {
  return (
    <section style={{ background: "var(--surface)", color: "var(--ink)", padding: "clamp(56px, 8vw, 112px) 0" }}>
      <Container>
        {heading && <Heading>{heading}</Heading>}
        {intro && <Lead>{intro}</Lead>}
        <div
          style={{
            marginTop: heading || intro ? 44 : 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {(steps || []).map((s, i) => (
            <div key={s._key || i} style={{ position: "relative", paddingLeft: 0 }}>
              <div
                className="st-display"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--brand)",
                  color: "var(--on-brand)",
                  fontSize: 16,
                  marginBottom: 16,
                }}
              >
                {i + 1}
              </div>
              {s.label && (
                <h3 className="st-display" style={{ fontSize: 18, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                  {s.label}
                </h3>
              )}
              {s.body && (
                <p className="st-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-2)" }}>
                  {s.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
