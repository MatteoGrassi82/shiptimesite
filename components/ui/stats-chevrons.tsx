"use client";

import type React from "react";
import { motion, useReducedMotion } from "motion/react";
import { LeadCaptureButton } from "@/components/ui/lead-capture-form";

// ── "What switching to ShipTime sets in motion" — chevron flow band ──────────
// Navy section. Four interlocking chevron segments tell the switching story
// (you switch → costs drop → margins grow → you scale), each with an eyebrow,
// a big stat, and a supporting line. On scroll the chevrons cascade in left to
// right (the "flow"), then the quote card and CTA follow. Honors
// prefers-reduced-motion.

const ds = {
  navy: "#1C1E3D",
  navyDeep: "#16182F",
  orange: "#EC5A26",
  white: "#FFFFFF",
};

const heading: React.CSSProperties = {
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  fontWeight: 800,
};
const inter = { fontFamily: "var(--font-inter), sans-serif" };
const sora = { fontFamily: "var(--font-manrope), sans-serif" };

type Step = { eyebrow: string; big: string; label: string; bg: string; fg: string; fgSub: string };

const STEPS: Step[] = [
  {
    eyebrow: "You switch",
    big: "15 min",
    label: "Connect a store and start shipping — nothing to migrate",
    bg: "#E3EEFC", fg: ds.navy, fgSub: "rgba(28,30,61,0.75)",
  },
  {
    eyebrow: "Costs drop",
    big: "70% off",
    label: "walk-in carrier rates, from your very first label",
    bg: "#B6E04A", fg: ds.navy, fgSub: "rgba(28,30,61,0.75)",
  },
  {
    eyebrow: "Margins grow",
    big: "$0 fees",
    label: "no platform fee, so every dollar you save stays yours",
    bg: ds.navyDeep, fg: ds.white, fgSub: "rgba(255,255,255,0.75)",
  },
  {
    eyebrow: "You scale",
    big: "Grow",
    label: "reinvest the savings and ship more for less",
    bg: "#A9A2F2", fg: ds.navy, fgSub: "rgba(28,30,61,0.75)",
  },
];

// Right-pointing arrow notch. First segment is flat on the left, the rest are
// notched so they interlock; all point on the right.
function chevronClip(first: boolean) {
  const notch = 28; // px depth of the arrow point
  const left = first ? "0" : `${notch}px`;
  return `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%, ${left} 50%)`;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function StatsChevrons({
  title = "What switching to ShipTime sets in motion",
  subtitle = "One move, and the rest follows — the flow our customers see after they come over.",
  ctaLabel = "See what switching looks like",
  source = "switch-flow",
}: {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  source?: string;
}) {
  const reduce = useReducedMotion();
  const slide = (x: number, y = 0) => (reduce ? { opacity: 0 } : { opacity: 0, x, y });
  const shown = reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 };

  return (
    <section className="px-5 md:px-10 py-16 md:py-24 overflow-hidden" style={{ background: ds.navy }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <motion.h2
          initial={slide(0, 24)}
          whileInView={shown}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-4"
          style={{ ...heading, color: ds.white, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", maxWidth: 760 }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={slide(0, 20)}
          whileInView={shown}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mb-10 md:mb-12"
          style={{ ...inter, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", maxWidth: 460 }}
        >
          {subtitle}
        </motion.p>

        {/* Desktop: interlocking chevrons cascade in left → right */}
        <div className="hidden md:flex">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.eyebrow}
              initial={slide(-56)}
              whileInView={shown}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.65, delay: 0.15 + i * 0.16, ease: EASE }}
              className="flex flex-col justify-center"
              style={{
                background: s.bg,
                flex: 1,
                minHeight: 220,
                padding: "28px 30px 28px 56px",
                marginLeft: i === 0 ? 0 : -24,
                clipPath: chevronClip(i === 0),
                zIndex: STEPS.length - i,
              }}
            >
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
                whileInView={shown}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.16, ease: EASE }}
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2" style={{ ...sora, color: s.fgSub }}>{s.eyebrow}</div>
                <div style={{ ...heading, fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)", color: s.fg }}>{s.big}</div>
                <div className="mt-2" style={{ ...inter, fontSize: 13.5, color: s.fgSub, maxWidth: 190, lineHeight: 1.5 }}>{s.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: stacked color blocks, staggered fade-up */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.eyebrow}
              initial={slide(0, 24)}
              whileInView={shown}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              className="flex flex-col justify-center"
              style={{ background: s.bg, borderRadius: 14, padding: "22px 20px", minHeight: 140 }}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ ...sora, color: s.fgSub }}>{s.eyebrow}</div>
              <div style={{ ...heading, fontSize: "1.8rem", color: s.fg }}>{s.big}</div>
              <div className="mt-1.5" style={{ ...inter, fontSize: 12.5, color: s.fgSub, lineHeight: 1.45 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Customer quote card */}
        <motion.div
          initial={slide(0, 28)}
          whileInView={shown}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-8 md:mt-10 px-7 py-7 md:px-10 md:py-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 20 }}
        >
          <div className="flex items-start gap-4 md:gap-6">
            <span aria-hidden className="flex-shrink-0 leading-none" style={{ ...sora, fontSize: 44, fontWeight: 800, color: ds.orange, marginTop: 6 }}>“</span>
            <div>
              <p style={{ ...inter, fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.55, color: "rgba(255,255,255,0.92)" }}>
                Seeing every carrier&rsquo;s rate side by side — and being able to drop in our own
                negotiated pricing — changed how we ship. Wish we&rsquo;d switched sooner.&rdquo;
              </p>
              <p className="mt-4" style={{ ...inter, fontSize: 13.5, color: "rgba(255,255,255,0.5)" }}>
                <strong style={{ ...sora, color: ds.white, fontWeight: 700 }}>Lena B.</strong> · CEO, Wellness Brand
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={slide(0, 20)}
          whileInView={shown}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="mt-8"
        >
          <LeadCaptureButton
            source={source}
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3.5 transition-colors hover:opacity-90"
            style={{ background: ds.orange, borderRadius: 12, ...sora }}
          >
            {ctaLabel} <span aria-hidden>→</span>
          </LeadCaptureButton>
        </motion.div>
      </div>
    </section>
  );
}
