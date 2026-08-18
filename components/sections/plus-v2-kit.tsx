import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ── The /plus/v2 design kit ──────────────────────────────────────────────────
// The primitives that make a page look like the Federato-inspired v2 build:
// stacked rounded panels over a gray gutter, Instrument Serif display with
// italic emphasis, Manrope body, orange as the only accent, halftone dot
// texture, and conceptual shape art (never photos or screenshots).
//
// Extracted here so every new Plus page in this style shares one source of
// truth instead of re-deriving the palette. Pure CSS — safe in server
// components; the scroll-reveal wrapper (components/ui/reveal) is the only
// client piece and is imported per page.

export const P = {
  gutter: "#E7E9EE",
  panel: "#FBFBFC",
  panelSoft: "#F3F4F7",
  card: "#FFFFFF",
  ink: "#1C1E3D",
  sub: "#5C6270",
  faint: "#9AA0AD",
  line: "#E3E5EA",
  dark: "#1C1E3D",
  darkLine: "rgba(255,255,255,0.14)",
  onDark: "#F4F5F8",
  onDarkDim: "rgba(244,245,248,0.66)",
  orange: "#EC5A26",
  orangeTint: "#FDEFE8",
};

export const serif: CSSProperties = {
  fontFamily: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif',
  fontWeight: 400,
  letterSpacing: "-0.01em",
};

export const sans: CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };

export const dots = (color: string, size = 9, dot = 1.5): CSSProperties => ({
  backgroundImage: `radial-gradient(circle, ${color} ${dot}px, transparent ${dot + 0.5}px)`,
  backgroundSize: `${size}px ${size}px`,
});

export const inner: CSSProperties = {
  maxWidth: 1220,
  margin: "0 auto",
  padding: "clamp(80px, 10vw, 164px) clamp(22px, 4vw, 56px)",
};

/** Dotted field masked to a radial falloff; breathes slowly. */
export function HalftoneBlob({ color, style, delay = "0s" }: { color: string; style?: CSSProperties; delay?: string }) {
  return (
    <div
      aria-hidden
      className="pk-breathe"
      style={{
        position: "absolute",
        ...dots(color, 10, 2),
        WebkitMaskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
        maskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
        animationDelay: delay,
        ...style,
      }}
    />
  );
}

export function Sparkle({ size = 16, color = P.orange, pulse = false, delay = "0s" }: { size?: number; color?: string; pulse?: boolean; delay?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden className={pulse ? "pk-pulse" : undefined} style={pulse ? { animationDelay: delay } : undefined}>
      <path d="M12 1.5 L14.4 9.6 L22.5 12 L14.4 14.4 L12 22.5 L9.6 14.4 L1.5 12 L9.6 9.6 Z" />
    </svg>
  );
}

export function Eyebrow({ children, onDark = false, center = false }: { children: ReactNode; onDark?: boolean; center?: boolean }) {
  return (
    <p
      style={{
        ...sans,
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : undefined,
        gap: 8,
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: onDark ? "rgba(244,245,248,0.8)" : P.sub,
        margin: 0,
      }}
    >
      <span style={{ width: 6, height: 6, background: P.orange, flex: "none" }} />
      {children}
    </p>
  );
}

export function PillLink({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link
      href={href}
      className="st-cta"
      style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, background: dark ? P.ink : P.orange, color: "#fff", padding: "12px 22px", fontSize: 14.5, fontWeight: 700, textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}

export function GhostLink({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className="st-cta"
      style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, border: `1px solid ${onDark ? P.darkLine : P.line}`, background: onDark ? "rgba(255,255,255,0.06)" : P.card, color: onDark ? P.onDark : P.ink, padding: "12px 22px", fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}

/** Rounded full-width panel with the visible-gutter stacking. */
export function Panel({ children, bg = P.panel, style }: { children: ReactNode; bg?: string; style?: CSSProperties }) {
  return (
    <section style={{ padding: "6px 10px" }}>
      <div style={{ position: "relative", overflow: "hidden", maxWidth: 1440, margin: "0 auto", background: bg, borderRadius: 26, ...style }}>
        {children}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  heading,
  lead,
  align = "center",
  onDark = false,
}: {
  eyebrow?: string;
  heading: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  onDark?: boolean;
}) {
  const centered = align === "center";
  return (
    <div style={{ textAlign: centered ? "center" : "left", maxWidth: centered ? 780 : 720, margin: centered ? "0 auto" : undefined }}>
      {eyebrow && (
        <div style={{ display: "flex", justifyContent: centered ? "center" : "flex-start" }}>
          <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 style={{ ...serif, fontSize: "clamp(2.4rem, 5.2vw, 3.9rem)", lineHeight: 1.05, color: onDark ? P.onDark : P.ink, margin: "20px 0 0" }}>{heading}</h2>
      {lead && (
        <p style={{ ...sans, fontSize: "clamp(1.08rem, 1.5vw, 1.24rem)", fontWeight: 500, lineHeight: 1.62, color: onDark ? "rgba(244,245,248,0.82)" : "#464C5C", margin: "18px auto 0", maxWidth: "58ch" }}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** Light-blue-card style closing CTA used at the foot of every page. */
export function CtaPanel({ heading, body, primary, secondary }: { heading: ReactNode; body?: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  const p = primary || { label: "Book a call", href: "/plus/book-a-call" };
  return (
    <Panel bg={P.dark}>
      <div style={{ ...inner, textAlign: "center", position: "relative" }}>
        <HalftoneBlob color="rgba(236,90,38,0.4)" style={{ width: 420, height: 420, left: "50%", top: -180, transform: "translateX(-50%)" }} />
        <h2 style={{ ...serif, position: "relative", fontSize: "clamp(2.1rem, 4.6vw, 3.4rem)", lineHeight: 1.08, color: P.onDark, maxWidth: "22ch", margin: "0 auto" }}>{heading}</h2>
        {body && <p style={{ ...sans, position: "relative", fontSize: 15.5, lineHeight: 1.65, color: P.onDarkDim, maxWidth: "54ch", margin: "16px auto 0" }}>{body}</p>}
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 30 }}>
          <PillLink href={p.href}>
            {p.label} <ArrowRight size={15} />
          </PillLink>
          {secondary && (
            <GhostLink href={secondary.href} onDark>
              {secondary.label}
            </GhostLink>
          )}
        </div>
      </div>
    </Panel>
  );
}

/** The shared keyframe set. Render once per page, inside the page wrapper. */
export function PlusKitMotion() {
  return (
    <style>{`
      @media (prefers-reduced-motion: no-preference) {
        @keyframes pk-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pk-pulse-kf { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
        @keyframes pk-breathe-kf { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
        @keyframes pk-float-kf { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-7px) rotate(3deg); } }
        @keyframes pk-flow-kf { from { background-position: 0 0; } to { background-position: 10px 0; } }
        @keyframes pk-dash-kf { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -20; } }
        @keyframes pk-rise-kf { to { transform: translateY(0); } }
        @keyframes pk-fadeup-kf { to { opacity: 1; transform: translateY(0); } }
        .pk-pulse { animation: pk-pulse-kf 2.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .pk-breathe { animation: pk-breathe-kf 7s ease-in-out infinite; }
        .pk-float { animation: pk-float-kf 5s ease-in-out infinite; }
        .pk-flow { animation: pk-flow-kf 0.7s linear infinite; }
        .pk-dash { animation: pk-dash-kf 1.6s linear infinite; }
        .pk-spin-svg { animation: pk-spin 26s linear infinite; }
        .pk-line { display: block; overflow: hidden; padding-bottom: 0.06em; }
        .pk-line-in { display: block; transform: translateY(115%); animation: pk-rise-kf 0.95s cubic-bezier(0.22,1,0.36,1) forwards; }
        .pk-fade { opacity: 0; transform: translateY(16px); animation: pk-fadeup-kf 0.85s cubic-bezier(0.22,1,0.36,1) forwards; }
      }
      .pk-lift { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, box-shadow 0.25s ease; }
      .pk-lift:hover { transform: translateY(-3px); border-color: ${P.orange}; box-shadow: 0 18px 40px -24px rgba(28,30,61,0.4); }
    `}</style>
  );
}
