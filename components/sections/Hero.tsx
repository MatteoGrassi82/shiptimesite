import Image from "next/image";
import { Container, CtaButton, Eyebrow, Heading, Lead } from "./primitives";
import type { HeroBlock } from "./types";

// Marketing hero. One component, either brand: Core renders navy/orange on
// white with Manrope; Plus renders teal on near-black with uppercase Inter —
// purely from the [data-zone] tokens.
export function Hero({
  eyebrow,
  heading,
  subheading,
  primaryCta,
  secondaryCta,
  media,
}: HeroBlock) {
  return (
    <section
      style={{
        background: "var(--page)",
        color: "var(--ink)",
        padding: "clamp(64px, 9vw, 128px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Warm/cool brand glow behind the headline */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          width: "min(900px, 120vw)",
          height: 520,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--brand) 16%, transparent) 0%, transparent 68%)",
          pointerEvents: "none",
        }}
      />
      <Container style={{ position: "relative" }}>
        <div style={{ maxWidth: 820 }}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {heading && (
            <Heading as="h1" style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", lineHeight: 1.02 }}>
              {heading}
            </Heading>
          )}
          {subheading && <Lead style={{ maxWidth: "54ch" }}>{subheading}</Lead>}
          {(primaryCta?.label || secondaryCta?.label) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34 }}>
              <CtaButton cta={primaryCta} />
              <CtaButton cta={secondaryCta} />
            </div>
          )}
        </div>

        {media?.asset?.url && (
          <div
            style={{
              marginTop: 56,
              borderRadius: "var(--radius-section)",
              overflow: "hidden",
              border: "1px solid var(--line)",
            }}
          >
            <Image
              src={media.asset.url}
              alt={media.alt || heading || ""}
              width={media.asset.metadata?.dimensions?.width || 1600}
              height={media.asset.metadata?.dimensions?.height || 900}
              placeholder={media.asset.metadata?.lqip ? "blur" : "empty"}
              blurDataURL={media.asset.metadata?.lqip}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />
          </div>
        )}
      </Container>
    </section>
  );
}
