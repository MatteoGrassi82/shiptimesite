import Link from "next/link";
import type { CSSProperties, ElementType, ReactNode } from "react";
import type { Cta } from "./types";

// Layout + typographic primitives shared by every section. They read only the
// semantic tokens (var(--ink), var(--brand), …) so a section built once wears
// whichever brand the surrounding [data-zone] sets.

export function Container({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", ...style }}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p className="st-eyebrow" style={{ fontSize: 12.5, margin: "0 0 16px", ...style }}>
      {children}
    </p>
  );
}

export function Heading({
  children,
  as: Tag = "h2",
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  style?: CSSProperties;
}) {
  return (
    <Tag
      className="st-display"
      style={{ fontSize: "clamp(1.9rem, 4vw, 2.9rem)", margin: 0, ...style }}
    >
      {children}
    </Tag>
  );
}

export function Lead({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p
      className="st-body"
      style={{
        fontSize: "clamp(1.02rem, 1.5vw, 1.18rem)",
        lineHeight: 1.6,
        color: "var(--ink-2)",
        maxWidth: "60ch",
        margin: "18px 0 0",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

const ctaBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-label)",
  fontWeight: 600,
  fontSize: 15,
  padding: "13px 26px",
  borderRadius: "var(--radius-pill)",
  textDecoration: "none",
  lineHeight: 1,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

// Resolves the visual variant against the tokens. `onContrast` flips outline/
// secondary colors when the button sits on a dark contrast band.
function ctaStyle(style: Cta["style"], onContrast?: boolean): CSSProperties {
  switch (style) {
    case "secondary":
      return onContrast
        ? { background: "rgba(255,255,255,0.12)", color: "var(--on-contrast)" }
        : { background: "var(--contrast)", color: "var(--on-contrast)" };
    case "ghost":
      return {
        background: "transparent",
        color: onContrast ? "var(--on-contrast)" : "var(--ink)",
        border: `1px solid ${onContrast ? "var(--contrast-line)" : "var(--line)"}`,
      };
    default:
      return { background: "var(--brand)", color: "var(--on-brand)" };
  }
}

export function CtaButton({ cta, onContrast }: { cta?: Cta; onContrast?: boolean }) {
  if (!cta?.label) return null;
  const style = { ...ctaBase, ...ctaStyle(cta.style, onContrast) };
  const href = cta.href || "#";
  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link href={href} className="st-cta" style={style}>
        {cta.label}
      </Link>
    );
  }
  return (
    <a href={href} className="st-cta" style={style} target="_blank" rel="noopener noreferrer">
      {cta.label}
    </a>
  );
}

// Standard vertical rhythm for a section band. `tone` maps to a token surface.
export function bandStyle(
  tone: "page" | "surface" | "surface-2" | "contrast" | "brand" = "page",
): CSSProperties {
  const map: Record<string, { background: string; color: string }> = {
    page: { background: "var(--page)", color: "var(--ink)" },
    surface: { background: "var(--surface)", color: "var(--ink)" },
    "surface-2": { background: "var(--surface-2)", color: "var(--ink)" },
    contrast: { background: "var(--contrast)", color: "var(--on-contrast)" },
    brand: { background: "var(--brand)", color: "var(--on-brand)" },
  };
  return {
    ...map[tone],
    padding: "clamp(56px, 8vw, 112px) 0",
    fontFamily: "var(--font-body)",
  };
}
