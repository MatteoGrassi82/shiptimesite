"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CHEV, K, Logo, NAV, PAGES, mono, sans, title } from "./koherent-brand";
import type { NavItem, NavMenu } from "./koherent-brand";

// ── The nav ──────────────────────────────────────────────────────────────────
// Revision 2: Who we help (Jenny's three doors, as a short menu), How it
// works, Customer stories, Pricing. Michael's ask stays: a strong, prominent
// logo top left. The filled button is the score (Chris: the score is the
// ask), with "Talk to an advisor" beside it where the row has room. Below
// 940px the menu folds into one panel, Who we help as an accordion.
// The bottom border only shows once the page scrolls, so the top of the page
// is one clean white field (Jenny asked to smooth the line at the top).

const isOnHref = (path: string, href?: string) => {
  if (!href) return false;
  const base = href.split("#")[0];
  return base !== PAGES.home && (path === base || path.startsWith(`${base}/`));
};
const menuOn = (path: string, m: NavMenu) => isOnHref(path, m.href) || m.groups.some((g) => g.items.some((i) => isOnHref(path, i.href)));

function PanelItem({ item, onPick }: { item: NavItem; onPick: () => void }) {
  if (!item.href) return null;
  return (
    <Link href={item.href} onClick={onPick} className="kn-item" style={{ display: "block", padding: item.line ? "11px 12px" : "9px 12px", borderRadius: 8, textDecoration: "none" }}>
      <span style={{ ...sans, display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: K.ink }}>
        <svg viewBox="0 0 8 12" aria-hidden style={{ width: 6, height: 9, flex: "none" }}>
          <path d={CHEV} fill={K.violet} />
        </svg>
        {item.name}
      </span>
      {item.line && <span style={{ ...sans, display: "block", fontSize: 13.5, lineHeight: 1.45, color: K.stone, margin: "3px 0 0 14px" }}>{item.line}</span>}
    </Link>
  );
}

function Panel({ menu, onPick }: { menu: NavMenu; onPick: () => void }) {
  const wide = menu.groups.length > 1;
  return (
    <div className="kn-panel" style={{ position: "absolute", top: "100%", left: 0, paddingTop: 10, zIndex: 60 }}>
      <div style={{ width: wide ? 720 : menu.groups.some((g) => g.items.some((i) => i.line)) ? 380 : 300, background: K.paper, border: `1px solid ${K.line}`, borderRadius: 12, boxShadow: "0 28px 60px -28px rgba(23,16,28,0.35), 0 2px 6px rgba(23,16,28,0.05)", overflow: "hidden" }}>
        {menu.href && (
          <Link href={menu.href} onClick={onPick} className="kn-over" style={{ ...sans, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "14px 22px", borderBottom: `1px solid ${K.line}`, fontSize: 14.5, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
            {menu.name} overview <ArrowRight size={15} />
          </Link>
        )}
        <div style={{ display: "grid", gridTemplateColumns: wide ? "1fr 1fr" : "1fr", gap: wide ? 18 : 0, padding: wide ? "18px 14px 14px" : "8px 10px" }}>
          {menu.groups.map((g, gi) => (
            <div key={gi}>
              {g.title && <p style={{ ...mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: K.violet, margin: "0 12px 6px" }}>{g.title}</p>}
              {g.items.map((it) => (
                <PanelItem key={it.name} item={it} onPick={onPick} />
              ))}
            </div>
          ))}
        </div>
        {menu.foot?.href && (
          <Link href={menu.foot.href} onClick={onPick} className="kn-over" style={{ ...sans, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "14px 26px", background: K.wash, borderTop: `1px solid ${K.line}`, fontSize: 14.5, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
            {menu.foot.name} <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}

export function KoherentNav() {
  const path = usePathname();
  const [open, setOpen] = useState<number | null>(null);
  const [phone, setPhone] = useState(false);
  const [phoneMenu, setPhoneMenu] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closer = useRef<number | undefined>(undefined);
  // a click right after the hover opened a menu shouldn't close it again
  const viaHover = useRef(false);

  // a new page closes whatever was open (state adjusted during render, the
  // way React suggests, rather than in an effect)
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(null);
    setPhone(false);
    setPhoneMenu(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setPhone(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // hover opens at once and closes after a beat, so the pointer can cross
  // the gap between the button and the panel
  const enter = (i: number) => {
    window.clearTimeout(closer.current);
    if (open !== i) viaHover.current = true;
    setOpen(i);
  };
  const leave = () => {
    window.clearTimeout(closer.current);
    closer.current = window.setTimeout(() => setOpen(null), 140);
  };
  const pick = () => {
    setOpen(null);
    setPhone(false);
  };

  // The score is the ask on every page; on the score page itself it falls
  // back to the team, as before.
  const onScore = isOnHref(path, PAGES.score);
  // Menus cross-link (Platform's Freight is on the Ship page, Network's
  // partner program is a Solutions page), so only the first menu that holds
  // the page is marked: Solutions wins.
  const active = NAV.findIndex((m) => menuOn(path, m));
  const ask = onScore ? { href: PAGES.contact, label: "Talk to an advisor", short: "Talk to us" } : { href: PAGES.score, label: "Get your logistics score", short: "Your score" };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.94)", backdropFilter: "saturate(1.4) blur(10px)", borderBottom: `1px solid ${scrolled || phone ? K.line : "transparent"}`, transition: "border-color .25s ease" }}>
      <div className="kn-row" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 3vw, 40px)", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <Link href={PAGES.home} aria-label="Koherent home" style={{ textDecoration: "none", display: "inline-flex", flex: "none" }} onClick={pick}>
          <Logo size={30} />
        </Link>

        <nav aria-label="Main" className="kn-links" style={{ display: "flex", alignItems: "center", gap: 4, height: "100%" }}>
          {NAV.map((m, i) => {
            const on = i === active;
            const bar = <span aria-hidden className="kn-bar" style={{ position: "absolute", left: 12, right: 12, bottom: 0, height: 2, background: K.plum, transform: on ? "scaleX(1)" : "scaleX(0)" }} />;
            const label = { ...sans, position: "relative" as const, display: "inline-flex", alignItems: "center", gap: 5, height: "100%", padding: "0 12px", fontSize: 15, fontWeight: on ? 700 : 500, color: on ? K.plum : K.ink, textDecoration: "none", background: "transparent", border: "none", cursor: "pointer" };
            if (!m.groups.length && m.href) {
              return (
                <Link key={m.name} href={m.href} aria-current={on ? "page" : undefined} className="kn-link" style={label}>
                  {m.name}
                  {bar}
                </Link>
              );
            }
            return (
              <div key={m.name} style={{ position: "relative", height: "100%" }} onMouseEnter={() => enter(i)} onMouseLeave={leave}>
                <button
                  type="button"
                  className="kn-link"
                  aria-expanded={open === i}
                  onClick={() => {
                    setOpen(open === i && !viaHover.current ? null : i);
                    viaHover.current = false;
                  }}
                  style={label}
                >
                  {m.name}
                  <ChevronDown size={14} aria-hidden style={{ transition: "transform .2s ease", transform: open === i ? "rotate(180deg)" : "none", opacity: 0.6 }} />
                  {bar}
                </button>
                {open === i && <Panel menu={m} onPick={pick} />}
              </div>
            );
          })}
        </nav>

        <div className="kn-actions" style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
          {!onScore && (
            <Link href={PAGES.contact} className="k-btn kn-talk" style={{ ...sans, fontSize: 14.5, fontWeight: 700, color: K.ink, border: `1.5px solid ${K.line}`, borderRadius: 6, padding: "8.5px 14px", textDecoration: "none", whiteSpace: "nowrap" }}>
              Talk to an advisor
            </Link>
          )}
          <Link href={ask.href} className="k-btn kn-cta" style={{ ...sans, fontSize: 14.5, fontWeight: 700, color: K.paper, background: K.plum, borderRadius: 6, padding: "10px 16px", textDecoration: "none", whiteSpace: "nowrap" }}>
            <span className="kn-long">{ask.label}</span>
            <span className="kn-short">{ask.short}</span>
          </Link>
          <button
            type="button"
            className="kn-toggle"
            aria-expanded={phone}
            aria-controls="kn-menu"
            aria-label={phone ? "Close menu" : "Open menu"}
            onClick={() => setPhone((o) => !o)}
            style={{ ...sans, display: "none", alignItems: "center", gap: 8, height: 40, padding: "0 14px", fontSize: 14.5, fontWeight: 700, color: K.ink, background: "transparent", border: `1.5px solid ${K.line}`, borderRadius: 6, cursor: "pointer" }}
          >
            <span className="kn-toggle-text">{phone ? "Close" : "Menu"}</span>
            <span aria-hidden style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
              <span style={{ width: 16, height: 1.5, background: K.ink, transition: "transform .2s ease", transform: phone ? "translateY(2.75px) rotate(45deg)" : "none" }} />
              <span style={{ width: 16, height: 1.5, background: K.ink, transition: "transform .2s ease", transform: phone ? "translateY(-2.75px) rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>
      </div>

      {/* the folded menu: each of Jenny's menus as an accordion, then both asks */}
      <div id="kn-menu" hidden={!phone} className="kn-menu" style={{ maxHeight: "calc(100dvh - 70px)", overflowY: "auto", background: K.paper, padding: "4px clamp(20px, 4vw, 56px) 28px" }}>
        <nav aria-label="Main">
          {NAV.map((m, i) => {
            const on = i === active;
            if (!m.groups.length && m.href) {
              return (
                <Link key={m.name} href={m.href} onClick={pick} style={{ ...title, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${K.line}`, fontSize: "1.35rem", color: on ? K.plum : K.ink, textDecoration: "none" }}>
                  {m.name}
                </Link>
              );
            }
            const expanded = phoneMenu === i;
            return (
              <div key={m.name} style={{ borderBottom: `1px solid ${K.line}` }}>
                <button type="button" aria-expanded={expanded} onClick={() => setPhoneMenu(expanded ? null : i)} style={{ ...title, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", fontSize: "1.35rem", color: on ? K.plum : K.ink, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  {m.name}
                  <ChevronDown size={20} aria-hidden style={{ transition: "transform .2s ease", transform: expanded ? "rotate(180deg)" : "none", color: K.violet }} />
                </button>
                {expanded && (
                  <div style={{ paddingBottom: 12 }}>
                    {m.href && (
                      <Link href={m.href} onClick={pick} style={{ ...sans, display: "flex", alignItems: "center", gap: 7, padding: "6px 12px 10px", fontSize: 15, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
                        {m.name} overview <ArrowRight size={15} />
                      </Link>
                    )}
                    {m.groups.map((g, gi) => (
                      <div key={gi} style={{ marginTop: gi ? 10 : 0 }}>
                        {g.title && <p style={{ ...mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: K.violet, margin: "6px 12px 4px" }}>{g.title}</p>}
                        {g.items.map((it) => (
                          <PanelItem key={it.name} item={{ ...it, line: undefined }} onPick={pick} />
                        ))}
                      </div>
                    ))}
                    {m.foot?.href && (
                      <Link href={m.foot.href} onClick={pick} style={{ ...sans, display: "flex", alignItems: "center", gap: 7, padding: "10px 12px 4px", fontSize: 15, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
                        {m.foot.name} <ArrowRight size={15} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <Link href={ask.href} onClick={pick} className="k-btn" style={{ ...sans, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 22, fontSize: 16, fontWeight: 700, color: K.paper, background: K.plum, borderRadius: 6, padding: "15px 20px", textDecoration: "none" }}>
          {ask.label} <ArrowRight size={16} />
        </Link>
        {!onScore && (
          <Link href={PAGES.contact} onClick={pick} className="k-btn" style={{ ...sans, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 10, fontSize: 16, fontWeight: 700, color: K.ink, background: "transparent", border: `1.5px solid ${K.line}`, borderRadius: 6, padding: "13.5px 20px", textDecoration: "none" }}>
            Talk to an advisor
          </Link>
        )}
      </div>

      <style>{`
        .kn-short { display: none; }
        .kn-bar { transform-origin: left center; transition: transform .25s cubic-bezier(.22,1,.36,1); }
        .kn-link:hover .kn-bar, .kn-link[aria-expanded="true"] .kn-bar { transform: scaleX(1) !important; }
        .kn-item:hover, .kn-item:focus-visible { background: ${K.wash}; }
        .kn-over:hover { background: ${K.wash}; }
        .kn-link:focus-visible, .kn-toggle:focus-visible, .kn-item:focus-visible { outline: 2px solid ${K.violet}; outline-offset: 2px; }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes kn-panel-kf { from { opacity: 0; translate: 0 6px; } to { opacity: 1; translate: 0 0; } }
          .kn-panel { animation: kn-panel-kf .18s ease both; }
        }
        .kn-menu[hidden] { display: none !important; }
        @media (min-width: 941px) { .kn-menu { display: none !important; } }
        @media (max-width: 1180px) { .kn-talk { display: none; } }
        @media (max-width: 940px) {
          .kn-links { display: none !important; }
          .kn-toggle { display: inline-flex !important; }
        }
        @media (max-width: 520px) {
          .kn-row { gap: 12px !important; }
          .kn-actions { gap: 8px !important; }
          .kn-cta { padding: 9px 10px !important; font-size: 14px !important; }
          .kn-long { display: none; }
          .kn-short { display: inline; }
          .kn-toggle-text { display: none; }
          .kn-toggle { width: 40px; padding: 0 !important; justify-content: center; }
        }
      `}</style>
    </header>
  );
}
