"use client";

import { useEffect, useState } from "react";
import { CHEV, K, mono, sans } from "./koherent-brand";

// ── ScrollIndex — the sticky contents beside a long page ─────────────────────
// The steps motif as navigation: one chevron per block, lit up to the block
// in view, so the visitor always sees where they are and how much is left.
// Used on /koherent/what-we-bring. Hidden below 960px, where the page is one
// column and the blocks carry their own numbers.

export function ScrollIndex({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    // The block being read is the last one whose top has passed a line 40%
    // down the screen; above the first block, that's the first one.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let n = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) n = i;
      });
      setActive(n);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className="ki-nav" style={{ position: "sticky", top: 108 }}>
      <p style={{ ...mono, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: K.stone, margin: "0 0 14px" }}>On this page</p>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 2 }}>
        {items.map((it, i) => {
          const on = i === active;
          const done = i <= active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                className="ki-link"
                style={{ ...sans, display: "flex", alignItems: "center", gap: 12, padding: "9px 0", fontSize: 15, fontWeight: on ? 700 : 500, color: on ? K.plum : done ? K.ink : K.stone, textDecoration: "none", transition: "color .2s ease" }}
              >
                <svg viewBox="0 0 8 12" aria-hidden style={{ width: 8, height: 12, flex: "none", transition: "transform .25s ease", transform: on ? "translateX(3px)" : "none" }}>
                  <path d={CHEV} fill={done ? K.plum : K.line} style={{ transition: "fill .25s ease" }} />
                </svg>
                <span style={{ ...mono, fontSize: 11.5, color: on ? K.plum : K.stone, width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                {it.label}
              </a>
            </li>
          );
        })}
      </ol>
      <style>{`
        .ki-link:hover { color: ${K.plum} !important; }
        .ki-link:focus-visible { outline: 2px solid ${K.violet}; outline-offset: 2px; }
        @media (max-width: 960px) { .ki-nav { display: none; } }
      `}</style>
    </nav>
  );
}
