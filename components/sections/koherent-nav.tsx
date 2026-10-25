"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CHAPTERS, CHEV, K, Logo, PAGES, mono, sans, title } from "./koherent-brand";

// ── The nav ──────────────────────────────────────────────────────────────────
// Michael: "In the top left we need a strong, prominent logo." The current
// page is marked, and below 960px the links fold into a menu, so the detail
// pages stay reachable on a phone.

export function KoherentNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isOn = (href: string) => path === href || path.startsWith(`${href}/`);
  // The score is the ask on every page, so it's the filled button and not a
  // fourth text link. On the score page itself the button would point at the
  // page you're on, so there it falls back to the team.
  const onScore = isOn(PAGES.score);
  const ask = onScore ? { href: PAGES.contact, label: "Talk to our team" } : { href: PAGES.score, label: "Get your score" };
  const links = CHAPTERS.slice(0, 3);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(246,243,238,0.92)", backdropFilter: "saturate(1.4) blur(10px)", borderBottom: `1px solid ${K.line}` }}>
      <div className="kn-row" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <Link href={PAGES.home} aria-label="Koherent home" style={{ textDecoration: "none", display: "inline-flex" }} onClick={() => setOpen(false)}>
          <Logo size={30} />
        </Link>

        <nav aria-label="Main" className="kn-links" style={{ display: "flex", alignItems: "center", gap: 30, height: "100%" }}>
          {links.map((c) => {
            const on = isOn(c.href);
            return (
              <Link key={c.href} href={c.href} aria-current={on ? "page" : undefined} className="kn-link" style={{ ...sans, position: "relative", display: "inline-flex", alignItems: "center", height: "100%", fontSize: 15, fontWeight: on ? 600 : 500, color: on ? K.plum : K.ink, textDecoration: "none" }}>
                {c.name}
                <span aria-hidden className="kn-bar" style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, background: K.plum, transform: on ? "scaleX(1)" : "scaleX(0)" }} />
              </Link>
            );
          })}
        </nav>

        <div className="kn-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href={ask.href} className="k-btn kn-cta" style={{ ...sans, fontSize: 14.5, fontWeight: 700, color: K.paper, background: K.plum, borderRadius: 6, padding: "10px 16px", textDecoration: "none", whiteSpace: "nowrap" }}>
            {ask.label}
          </Link>
          <button
            type="button"
            className="kn-toggle"
            aria-expanded={open}
            aria-controls="kn-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            style={{ ...sans, display: "none", alignItems: "center", gap: 8, height: 40, padding: "0 14px", fontSize: 14.5, fontWeight: 700, color: K.ink, background: "transparent", border: `1.5px solid ${K.line}`, borderRadius: 6, cursor: "pointer" }}
          >
            <span className="kn-toggle-text">{open ? "Close" : "Menu"}</span>
            <span aria-hidden style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
              <span style={{ width: 16, height: 1.5, background: K.ink, transition: "transform .2s ease", transform: open ? "translateY(2.75px) rotate(45deg)" : "none" }} />
              <span style={{ width: 16, height: 1.5, background: K.ink, transition: "transform .2s ease", transform: open ? "translateY(-2.75px) rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>
      </div>

      {/* the phone menu: the story in order, then the ask */}
      <div id="kn-menu" hidden={!open} className="kn-menu" style={{ borderTop: `1px solid ${K.line}`, background: K.paper, padding: "8px clamp(20px, 4vw, 56px) 28px" }}>
        <nav aria-label="Main">
          {links.map((c, i) => {
            const on = isOn(c.href);
            return (
              <Link key={c.href} href={c.href} aria-current={on ? "page" : undefined} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: `1px solid ${K.line}`, textDecoration: "none" }}>
                <span style={{ ...mono, fontSize: 12, color: K.violet, width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ ...title, fontSize: "1.55rem", color: on ? K.plum : K.ink }}>{c.name}</span>
                <svg viewBox="0 0 8 12" aria-hidden style={{ width: 9, height: 13, marginLeft: "auto", opacity: on ? 1 : 0.35 }}>
                  <path d={CHEV} fill={K.plum} />
                </svg>
              </Link>
            );
          })}
        </nav>
        <Link href={ask.href} onClick={() => setOpen(false)} className="k-btn" style={{ ...sans, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 22, fontSize: 16, fontWeight: 700, color: K.paper, background: K.plum, borderRadius: 6, padding: "15px 20px", textDecoration: "none" }}>
          {ask.label} <ArrowRight size={16} />
        </Link>
        {!onScore && (
          <Link href={PAGES.contact} onClick={() => setOpen(false)} className="k-btn" style={{ ...sans, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 10, fontSize: 16, fontWeight: 700, color: K.ink, background: "transparent", border: `1.5px solid ${K.line}`, borderRadius: 6, padding: "13.5px 20px", textDecoration: "none" }}>
            Talk to our team
          </Link>
        )}
      </div>

      <style>{`
        .kn-bar { transform-origin: left center; transition: transform .25s cubic-bezier(.22,1,.36,1); }
        .kn-link:hover .kn-bar { transform: scaleX(1) !important; }
        .kn-link:focus-visible, .kn-toggle:focus-visible { outline: 2px solid ${K.violet}; outline-offset: 3px; }
        .kn-menu[hidden] { display: none !important; }
        @media (min-width: 961px) { .kn-menu { display: none !important; } }
        @media (max-width: 960px) {
          .kn-links { display: none !important; }
          .kn-toggle { display: inline-flex !important; }
        }
        /* phones keep the ask: the toggle drops its word and the row tightens
           so logo, button and toggle fit 360px */
        @media (max-width: 520px) {
          .kn-row { gap: 12px !important; }
          .kn-actions { gap: 8px !important; }
          .kn-cta { padding: 9px 10px !important; font-size: 14px !important; }
          .kn-toggle-text { display: none; }
          .kn-toggle { width: 40px; padding: 0 !important; justify-content: center; }
        }
        /* on the score page the ask is "Talk to our team", 30px wider; at 360
           that needs the last 4px of the row gap to keep the right gutter */
        @media (max-width: 370px) { .kn-row { gap: 8px !important; } }
      `}</style>
    </header>
  );
}
