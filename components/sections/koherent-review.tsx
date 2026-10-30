"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { K, PAGES, mono, sans } from "./koherent-brand";

// ── The review layer (revision 2, Oct 30) ────────────────────────────────────
// Jenny edits best on the page, so the open questions sit on the page too:
// every bracketed "Confirm…" in her copy is a tag where it applies (Note in
// koherent-ui.tsx), this switch hides or shows them all, and /koherent/review
// lists them in one place. It only renders while REVIEW is on
// (koherent-brand.tsx). The choice is remembered per browser. Bottom right,
// clear of the Next dev badge.

const KEY = "k-notes";
const EVENT = "k-notes-change";

// The choice lives in localStorage, read through useSyncExternalStore so the
// server render (notes on) and the browser's saved choice don't clash. If
// storage is blocked, the choice still holds for the visit, in memory.
let memo: boolean | null = null;
const read = () => {
  if (memo !== null) return memo;
  try {
    return window.localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
};
const write = (on: boolean) => {
  memo = on;
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
};
const subscribe = (change: () => void) => {
  window.addEventListener(EVENT, change);
  window.addEventListener("storage", change);
  return () => {
    window.removeEventListener(EVENT, change);
    window.removeEventListener("storage", change);
  };
};

export function NotesToggle({ count }: { count: number }) {
  const on = useSyncExternalStore(subscribe, read, () => true);

  useEffect(() => {
    document.documentElement.dataset.knotes = on ? "on" : "off";
  }, [on]);

  return (
    <div className="k-notes-dock" role="region" aria-label="Review notes" style={{ position: "fixed", right: 16, bottom: 16, zIndex: 70, display: "flex", alignItems: "center", gap: 10, background: K.ink, color: K.onDark, borderRadius: 999, padding: "7px 8px 7px 14px", boxShadow: "0 16px 40px -18px rgba(23,16,28,0.7)" }}>
      <span style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac }}>Review</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => write(!on)}
        style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: K.onDark, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span aria-hidden style={{ position: "relative", width: 30, height: 17, borderRadius: 99, background: on ? "#F2CF66" : "rgba(246,243,238,0.25)", transition: "background .2s ease" }}>
          <span style={{ position: "absolute", top: 2, left: on ? 15 : 2, width: 13, height: 13, borderRadius: 99, background: K.ink, transition: "left .2s ease" }} />
        </span>
        <span className="k-notes-label">{on ? "Notes on" : "Notes off"}</span>
      </button>
      <Link href={PAGES.review} style={{ ...sans, fontSize: 13, fontWeight: 700, color: K.ink, background: "#F2CF66", borderRadius: 999, padding: "5px 11px", textDecoration: "none", whiteSpace: "nowrap" }}>
        {count} open
      </Link>
      <style>{`
        html[data-knotes="off"] .k-note { display: none !important; }
        @media (max-width: 520px) {
          .k-notes-dock { right: 10px !important; bottom: 10px !important; }
          .k-notes-label { display: none; }
        }
        @media print { .k-notes-dock { display: none !important; } }
      `}</style>
    </div>
  );
}

// The headline is the first decision on the page: Jenny's draft, the line her
// copy opens its second section with, or the one on the live site today
// (Michael's ask, Oct 27). The page renders Jenny's; while notes are on, a
// switch under the buttons tries the others in place.
export type Headline = { key: string; label: string; text: string };

export function HeroHeadline({ options, style, className }: { options: Headline[]; style: CSSProperties; className?: string }) {
  const [i, setI] = useState(0);
  // the outcome line is three sentences: it sets a size smaller
  const long = options[i].text.length > 60;
  return (
    <>
      <h1 key={options[i].key} className={className} style={long ? { ...style, fontSize: "clamp(2rem, 3.6vw, 3.05rem)", lineHeight: 1.06, letterSpacing: "-0.028em" } : style}>
        {options[i].text}
      </h1>
      <HeadlineSwitch options={options} value={i} onChange={setI} />
    </>
  );
}

function HeadlineSwitch({ options, value, onChange }: { options: Headline[]; value: number; onChange: (i: number) => void }) {
  return (
    <div className="k-note k-hl" role="group" aria-label="Try another headline" style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 18, background: "#FFF6DB", border: "1px solid #F2CF66", borderRadius: 10, padding: "6px 8px 6px 12px" }}>
      <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "#5C4300", marginRight: 4 }}>Headline to decide</span>
      {options.map((o, n) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === n}
          onClick={() => onChange(n)}
          style={{ ...sans, fontSize: 12.5, fontWeight: 700, color: value === n ? "#FFF6DB" : "#5C4300", background: value === n ? "#5C4300" : "transparent", border: "1px solid #E5BE4D", borderRadius: 999, padding: "4px 10px", cursor: "pointer" }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
