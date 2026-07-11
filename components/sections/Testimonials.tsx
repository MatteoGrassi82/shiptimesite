import { Container, Heading } from "./primitives";
import type { TestimonialsBlock } from "./types";

export function Testimonials({ heading, quotes }: TestimonialsBlock) {
  return (
    <section style={{ background: "var(--surface)", color: "var(--ink)", padding: "clamp(56px, 8vw, 112px) 0" }}>
      <Container>
        {heading && <Heading style={{ marginBottom: 40 }}>{heading}</Heading>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {(quotes || []).map((q, i) => (
            <figure
              key={q._key || i}
              style={{
                margin: 0,
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-card)",
                padding: "28px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <span aria-hidden style={{ fontFamily: "var(--font-display)", fontSize: 40, lineHeight: 0.6, color: "var(--brand)" }}>
                &ldquo;
              </span>
              {q.quote && (
                <blockquote className="st-body" style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--ink)" }}>
                  {q.quote}
                </blockquote>
              )}
              {(q.author || q.role) && (
                <figcaption style={{ marginTop: "auto", fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink-2)" }}>
                  {q.author && <span style={{ color: "var(--ink)", fontWeight: 600 }}>{q.author}</span>}
                  {q.author && q.role ? " · " : ""}
                  {q.role}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
