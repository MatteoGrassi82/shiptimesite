"use client";

import { useState } from "react";
import { Container, Heading } from "./primitives";
import type { FaqBlock } from "./types";

export function Faq({ heading, intro, items }: FaqBlock) {
  const [open, setOpen] = useState(0);
  const list = items || [];

  return (
    <section style={{ background: "var(--surface)", color: "var(--ink)", padding: "clamp(56px, 8vw, 112px) 0" }}>
      <Container style={{ maxWidth: 860 }}>
        {heading && <Heading style={{ textAlign: "center" }}>{heading}</Heading>}
        {intro && (
          <p
            className="st-body"
            style={{ textAlign: "center", color: "var(--ink-2)", fontSize: 16, lineHeight: 1.6, margin: "16px auto 0", maxWidth: "52ch" }}
          >
            {intro}
          </p>
        )}
        <div
          style={{
            marginTop: 34,
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-section)",
            background: "var(--card)",
            overflow: "hidden",
          }}
        >
          {list.map((it, i) => {
            const isOpen = i === open;
            return (
              <div key={it._key || i} style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                    textAlign: "left",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ink)",
                  }}
                >
                  <span className="st-body" style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.4 }}>
                    {it.question}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      color: "var(--brand)",
                      flexShrink: 0,
                      fontSize: 24,
                      lineHeight: 1,
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.25s ease",
                    }}
                  >
                    +
                  </span>
                </button>
                <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.35s ease" }}>
                  <div style={{ overflow: "hidden" }}>
                    <p
                      className="st-body"
                      style={{ margin: 0, padding: "0 24px 22px", fontSize: 15, lineHeight: 1.65, color: "var(--ink-2)" }}
                    >
                      {it.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
