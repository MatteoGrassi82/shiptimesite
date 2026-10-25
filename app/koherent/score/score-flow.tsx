"use client";

import { useEffect, useRef, type ReactNode } from "react";

// ── ScoreFlow — keeps the current question in view ───────────────────────────
// The shiplet swaps one screen for the next in place. On a phone, or after a
// long answer list, the new question can start above the fold, under the
// sticky nav. When the screen changes and its top has gone under the nav, this
// scrolls it back into view. The shiplet itself isn't touched: a screen is
// keyed by its heading, and the result by its .lps-shell, so the report
// streaming in doesn't keep pulling the page back up.

const NAV = 84; // the 68px nav, plus a margin

export function ScoreFlow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const keyOf = () => (el.querySelector(".lps-shell") ? "result" : (el.querySelector("h2, h3")?.textContent ?? ""));
    let key = keyOf();
    const observer = new MutationObserver(() => {
      const next = keyOf();
      if (next === key) return;
      key = next;
      const rect = el.getBoundingClientRect();
      if (rect.top < NAV) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: window.scrollY + rect.top - NAV, behavior: reduced ? "auto" : "smooth" });
      }
    });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
