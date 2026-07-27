import Image from "next/image";
import { Container, CtaButton, Eyebrow, Heading } from "./primitives";
import type { MediaSplitBlock } from "./types";

// A real photo/illustration next to a block of copy. Exists specifically so
// narrative sections (phases, partnership, fulfillment) aren't forced into the
// icon-only FeatureGrid pattern — this is where actual imagery lives.
export function MediaSplit({ eyebrow, heading, body, bullets, image, imageSide = "right", tone = "page", cta, secondaryCta }: MediaSplitBlock) {
  const imageFirst = imageSide === "left";
  const background = tone === "surface" ? "var(--surface)" : "var(--page)";
  return (
    <section style={{ background, color: "var(--ink)", padding: "clamp(56px, 8vw, 104px) 0" }}>
      <Container>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "clamp(28px, 5vw, 64px)",
            alignItems: "center",
          }}
          className="st-media-split"
        >
          <div style={{ order: imageFirst ? 2 : 1 }}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {heading && <Heading style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)" }}>{heading}</Heading>}
            {body && (
              <p className="st-body" style={{ marginTop: 18, fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: "52ch" }}>
                {body}
              </p>
            )}
            {!!bullets?.length && (
              <ul style={{ marginTop: 18, paddingLeft: 20, display: "grid", gap: 10, maxWidth: "52ch" }}>
                {bullets.map((b, i) => (
                  <li key={i} className="st-body" style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {(cta?.label || secondaryCta?.label) && (
              <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18 }}>
                <CtaButton cta={cta} />
                <CtaButton cta={secondaryCta} />
              </div>
            )}
          </div>
          <div style={{ order: imageFirst ? 1 : 2 }}>
            <div
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: "var(--radius-section)",
                overflow: "hidden",
                border: "1px solid var(--line)",
                background: "var(--surface-2)",
              }}
            >
              {image?.asset?.url ? (
                <Image
                  src={image.asset.url}
                  alt={image.alt || heading || ""}
                  fill
                  sizes="(max-width: 900px) 100vw, 560px"
                  placeholder={image.asset.metadata?.lqip ? "blur" : "empty"}
                  blurDataURL={image.asset.metadata?.lqip}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(120% 100% at 20% 10%, color-mix(in oklab, var(--brand) 16%, transparent) 0%, transparent 55%), radial-gradient(110% 100% at 85% 90%, color-mix(in oklab, var(--brand-2) 18%, transparent) 0%, transparent 55%)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
      <style>{`@media (max-width: 780px){ .st-media-split{ grid-template-columns: 1fr !important; } .st-media-split > div{ order: unset !important; } }`}</style>
    </section>
  );
}
