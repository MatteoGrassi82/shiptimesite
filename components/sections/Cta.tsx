import { Container, CtaButton, Heading } from "./primitives";
import { bandStyle } from "./primitives";
import type { CtaBlock } from "./types";

// Closing call-to-action band. `tone` picks the surface; contrast + brand tones
// flip the button styling to read on a dark/colored background.
export function Cta({ heading, body, primaryCta, secondaryCta, tone = "contrast" }: CtaBlock) {
  const onContrast = tone === "contrast" || tone === "brand";
  return (
    <section style={bandStyle(tone)}>
      <Container>
        <div style={{ maxWidth: 720 }}>
          {heading && (
            <Heading style={{ color: onContrast ? "var(--on-contrast)" : "var(--ink)" }}>{heading}</Heading>
          )}
          {body && (
            <p
              className="st-body"
              style={{
                fontSize: "clamp(1.02rem, 1.5vw, 1.18rem)",
                lineHeight: 1.6,
                margin: "18px 0 0",
                color: onContrast ? "color-mix(in oklab, var(--on-contrast) 78%, transparent)" : "var(--ink-2)",
                maxWidth: "56ch",
              }}
            >
              {body}
            </p>
          )}
          {(primaryCta?.label || secondaryCta?.label) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 30 }}>
              <CtaButton cta={primaryCta} onContrast={onContrast} />
              <CtaButton cta={secondaryCta} onContrast={onContrast} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
