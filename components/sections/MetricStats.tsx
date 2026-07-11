import { Container, Heading } from "./primitives";
import type { MetricStatsBlock } from "./types";

// Big-number proof band. Core: orange figures on white cards. Plus: teal figures
// on dark frames — same component.
export function MetricStats({ heading, stats }: MetricStatsBlock) {
  return (
    <section style={{ background: "var(--page)", color: "var(--ink)", padding: "clamp(56px, 8vw, 112px) 0" }}>
      <Container>
        {heading && <Heading style={{ marginBottom: 40 }}>{heading}</Heading>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {(stats || []).map((s, i) => (
            <div
              key={s._key || i}
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-card)",
                padding: "26px 26px 28px",
              }}
            >
              {s.label && (
                <div
                  className="st-eyebrow"
                  style={{
                    fontSize: 11,
                    paddingBottom: 12,
                    marginBottom: 16,
                    borderBottom: "1px solid var(--brand)",
                  }}
                >
                  {s.label}
                </div>
              )}
              {s.value && (
                <div
                  className="st-display"
                  style={{ fontSize: "clamp(2rem, 3.4vw, 2.9rem)", lineHeight: 1, color: "var(--brand)", marginBottom: 12 }}
                >
                  {s.value}
                </div>
              )}
              {s.caption && (
                <p className="st-body" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
                  {s.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
