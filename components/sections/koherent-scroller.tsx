"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CHEV, K, mono, sans, title } from "./koherent-brand";

// ── BlockScroller — "What we bring", text one side, a widget the other ───────
// The pattern Matteo liked on ShipTime Core (PlusCapabilities: a pinned column
// while cards pass it), turned round: the words scroll on the left, one per
// block, and the widget on the right stays pinned and swaps as the block in
// view changes. On phones there's nothing to pin, so each block shows its own
// widget under its words.

export type Block = {
  id: string;
  n: string;
  name: string;
  line: string;
  points: string[];
  tag?: string;
  widget: ReactNode;
  link?: { href: string; label: string };
};

export function BlockScroller({ blocks }: { blocks: Block[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // The block whose text is nearest the middle of the screen owns the widget.
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight * 0.5;
      let best = 0;
      let dist = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ks" style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: "clamp(32px, 5vw, 80px)", alignItems: "start" }}>
      {/* the words, one block after another */}
      <div>
        {blocks.map((b, i) => (
          <section
            key={b.id}
            id={b.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="ks-block"
            style={{ scrollMarginTop: 96, padding: "clamp(40px, 6vw, 96px) 0", borderTop: i ? `1px solid ${K.line}` : "none", textAlign: "left" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span aria-hidden style={{ display: "inline-flex", gap: 4 }}>
                {blocks.map((_, k) => (
                  <svg key={k} viewBox="0 0 8 12" style={{ width: 7, height: 11 }}>
                    <path d={CHEV} fill={k <= i ? K.plum : K.line} />
                  </svg>
                ))}
              </span>
              <span style={{ ...mono, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: K.violet }}>{b.n} of {String(blocks.length).padStart(2, "0")}</span>
              {b.tag && <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: K.plum, background: K.mist, borderRadius: 3, padding: "3px 7px" }}>{b.tag}</span>}
            </div>
            <h2 style={{ ...title, fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", color: K.ink, margin: "16px 0 0" }}>{b.name}</h2>
            <p style={{ ...sans, fontSize: "clamp(1.02rem, 1.3vw, 1.12rem)", lineHeight: 1.6, color: K.stone, margin: "12px 0 0", maxWidth: "40ch" }}>{b.line}</p>
            {/* on a phone the widget sits here, under its own words */}
            <div className="ks-inline is-in" aria-hidden style={{ display: "none", margin: "22px 0 4px" }}>
              {b.widget}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "grid", gap: 12 }}>
              {b.points.map((p) => (
                <li key={p} style={{ ...sans, display: "flex", gap: 12, fontSize: 15.5, lineHeight: 1.6, color: K.ink }}>
                  <span aria-hidden style={{ width: 10, height: 2, background: K.plum, flex: "none", marginTop: 11 }} />
                  {p}
                </li>
              ))}
            </ul>
            {b.link && (
              <a href={b.link.href} className="k-more" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, marginTop: 20, fontSize: 15, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
                {b.link.label} &rarr;
              </a>
            )}
          </section>
        ))}
      </div>

      {/* the pinned widget: every block's widget is mounted, one is shown */}
      <div className="ks-pin" style={{ position: "sticky", top: 84, height: "calc(100vh - 84px)", display: "flex", alignItems: "center" }}>
        <div style={{ position: "relative", width: "100%" }}>
          {blocks.map((b, i) => (
            <div
              key={b.id}
              aria-hidden={i !== active}
              className={i === active ? "ks-w is-in is-on" : "ks-w"}
              style={{ gridArea: "1 / 1", position: i === active ? "relative" : "absolute", inset: 0, opacity: i === active ? 1 : 0, transform: i === active ? "none" : "translateY(12px)", pointerEvents: i === active ? "auto" : "none", transition: "opacity .45s ease, transform .45s cubic-bezier(.22,1,.36,1)" }}
            >
              {b.widget}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .ks { grid-template-columns: 1fr !important; }
          .ks-pin { display: none !important; }
          .ks-inline { display: block !important; }
        }
      `}</style>
    </div>
  );
}
