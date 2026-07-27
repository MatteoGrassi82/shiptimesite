import { Container, Heading, Lead } from "./primitives";
import type { ComparisonTableBlock } from "./types";

// Row-per-aspect comparison (Plus vs 3PL vs TMS vs broker). Plain HTML table,
// horizontally scrollable on small screens rather than collapsing to cards —
// the whole point is scanning across approaches.
export function ComparisonTable({ heading, intro, approaches, rows }: ComparisonTableBlock) {
  if (!approaches?.length && !rows?.length) return null;
  return (
    <section style={{ background: "var(--page)", color: "var(--ink)", padding: "clamp(56px, 8vw, 112px) 0" }}>
      <Container>
        {heading && <Heading>{heading}</Heading>}
        {intro && <Lead>{intro}</Lead>}
        <div style={{ marginTop: heading || intro ? 40 : 0, overflowX: "auto", border: "1px solid var(--line)", borderRadius: "var(--radius-card)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "16px 20px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }} />
                {(approaches || []).map((a, i) => (
                  <th
                    key={i}
                    className="st-display"
                    style={{
                      textAlign: "left",
                      padding: "16px 20px",
                      background: i === 0 ? "color-mix(in oklab, var(--brand) 10%, var(--surface))" : "var(--surface)",
                      borderBottom: "1px solid var(--line)",
                      fontSize: 15,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(rows || []).map((row, ri) => (
                <tr key={row._key || ri}>
                  <th
                    scope="row"
                    className="st-body"
                    style={{
                      textAlign: "left",
                      padding: "16px 20px",
                      fontWeight: 600,
                      fontSize: 13.5,
                      color: "var(--ink-3)",
                      borderBottom: ri === (rows?.length || 0) - 1 ? "none" : "1px solid var(--line)",
                      whiteSpace: "nowrap",
                      verticalAlign: "top",
                    }}
                  >
                    {row.aspect}
                  </th>
                  {(approaches || []).map((_, ci) => (
                    <td
                      key={ci}
                      className="st-body"
                      style={{
                        padding: "16px 20px",
                        fontSize: 14,
                        lineHeight: 1.55,
                        color: "var(--ink-2)",
                        borderBottom: ri === (rows?.length || 0) - 1 ? "none" : "1px solid var(--line)",
                        background: ci === 0 ? "color-mix(in oklab, var(--brand) 4%, transparent)" : undefined,
                        verticalAlign: "top",
                        minWidth: 200,
                      }}
                    >
                      {row.values?.[ci] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
