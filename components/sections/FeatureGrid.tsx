import { Container, Heading, Lead } from "./primitives";
import type { FeatureGridBlock } from "./types";

// Minimal inline icon set so feature blocks get an icon without pulling a whole
// icon library into the bundle. Unknown names fall back to a brand dot.
const ICONS: Record<string, string> = {
  truck: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  shield: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
  zap: "M13 2L4 14h6l-1 8 9-12h-6z",
  globe: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2",
  check: "M4 12l5 5L20 6",
  dollar: "M12 2v20M17 6.5C17 4.6 14.8 3 12 3S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  route: "M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4zM8 17h6a3 3 0 003-3V9",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5",
  refresh: "M4 12a8 8 0 0114-5l2 2M20 12a8 8 0 01-14 5l-2-2M18 5v4h-4M6 19v-4h4",
};

function FeatureIcon({ name }: { name?: string }) {
  const d = name ? ICONS[name.toLowerCase()] : undefined;
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: 12,
        background: "color-mix(in oklab, var(--brand) 12%, transparent)",
        color: "var(--brand)",
        marginBottom: 18,
      }}
    >
      {d ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d={d} />
        </svg>
      ) : (
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--brand)" }} />
      )}
    </span>
  );
}

export function FeatureGrid({ heading, intro, columns = "3", features }: FeatureGridBlock) {
  const cols = Number(columns) || 3;
  return (
    <section style={{ background: "var(--surface)", color: "var(--ink)", padding: "clamp(56px, 8vw, 112px) 0" }}>
      <Container>
        {heading && <Heading>{heading}</Heading>}
        {intro && <Lead>{intro}</Lead>}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(${cols >= 4 ? 200 : 240}px, 1fr))`,
            gap: 20,
            marginTop: heading || intro ? 44 : 0,
          }}
        >
          {(features || []).map((f, i) => (
            <div
              key={f._key || i}
              className="st-lift"
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-card)",
                padding: "26px 24px",
              }}
            >
              <FeatureIcon name={f.icon} />
              {f.title && (
                <h3 className="st-display" style={{ fontSize: 19, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                  {f.title}
                </h3>
              )}
              {f.body && (
                <p className="st-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  {f.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
