"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CHEV, K, mono } from "./koherent-brand";
import { useInView, useReducedMotion } from "./koherent-motion";

// ── Small effects shared by the /koherent pages ──────────────────────────────
// All three respect prefers-reduced-motion by rendering their final state.
//   CountUp          a number that counts up once, when it scrolls into view
//   Drift            a photo that scrolls a little slower than the page
//   ChapterProgress  the steps motif as a page progress strip under the nav

// ── CountUp ──────────────────────────────────────────────────────────────────
// Takes the number as written on the page ("2M+", "1,000+", "20 years", "93%")
// and counts the leading figure up from zero, keeping its formatting and
// whatever follows it.
const NUM = /^(\D*?)([\d,]+(?:\.\d+)?)(.*)$/;

export function CountUp({ value, ms = 1100, style }: { value: string; ms?: number; style?: CSSProperties }) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  const m = value.match(NUM);
  const target = m ? Number(m[2].replace(/,/g, "")) : NaN;
  const decimals = m && m[2].includes(".") ? m[2].split(".")[1].length : 0;
  const grouped = m ? m[2].includes(",") : false;
  const [shown, setShown] = useState(0);
  const started = useRef(false);

  // Counts once, the first time it's on screen. With reduced motion the
  // render below shows the target straight away, so nothing runs here.
  useEffect(() => {
    if (!m || Number.isNaN(target) || reduced || started.current || !inView) return;
    started.current = true;
    const t0 = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(target * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, target, ms, m]);

  if (!m) return <span style={style}>{value}</span>;
  const n = reduced ? target : shown;
  const text = grouped ? Math.round(n).toLocaleString("en-US") : n.toFixed(decimals);
  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {m[1]}
      {text}
      {m[3]}
    </span>
  );
}

// ── Drift ────────────────────────────────────────────────────────────────────
// The child moves against the scroll by up to `amount` px, and is scaled a
// touch so its edges never show. Wrap something with a fixed box, like a
// clipped photo.
export function Drift({ amount = 36, children, style }: { amount?: number; children: ReactNode; style?: CSSProperties }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 at the bottom of the screen, +1 at the top
      const t = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2)));
      setY(t * amount);
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
  }, [reduced, amount]);

  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: reduced ? undefined : `translate3d(0, ${y.toFixed(1)}px, 0) scale(1.08)`, willChange: "transform" }}>{children}</div>
    </div>
  );
}

// ── ChapterProgress ──────────────────────────────────────────────────────────
// One chevron per home-page section, lit as each one scrolls past. The same
// shape as the steps everywhere else on the site, so it reads as "how far
// through the story". Sticks under the nav.
export function ChapterProgress({ ids }: { ids: string[] }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let n = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) n = i + 1;
      });
      setDone(n);
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
  }, [ids]);

  return (
    <div className="k-progress" style={{ position: "sticky", top: 68, zIndex: 40, background: "rgba(246,243,238,0.88)", backdropFilter: "saturate(1.4) blur(8px)", borderBottom: `1px solid ${K.line}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)", height: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <span aria-hidden style={{ display: "inline-flex", gap: 5 }}>
          {ids.map((id, i) => (
            <svg key={id} viewBox="0 0 8 12" style={{ width: 7, height: 11 }}>
              <path d={CHEV} fill={i < done ? K.plum : K.line} style={{ transition: "fill .3s ease" }} />
            </svg>
          ))}
        </span>
        <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: K.stone }}>
          {String(Math.max(1, done)).padStart(2, "0")} / {String(ids.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
