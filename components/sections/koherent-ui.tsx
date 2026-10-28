import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CHAPTERS, CHEV, K, K_ARROW, Logo, PAGES, display, inner, mono, sans, title } from "./koherent-brand";
import { KoherentNav } from "./koherent-nav";

// ── The pieces every /koherent page shares ───────────────────────────────────
// Buttons, the section frame, the page frame (nav, footer), the detail-page
// header, the hand-on to the next chapter and the score CTA. The home page
// (koherent-home.tsx) and the detail pages under app/koherent/* all build from
// these, so the site reads as one. Tokens and the K are in koherent-brand.tsx.
//
// No "use client" here on purpose: server components read the plain values
// (K, sans, title…) directly. A "use client" file would hand them over as
// references and every style spread would come through empty.

export { CHAPTERS, K, KMark, Logo, PAGES, display, inner, mono, sans, title } from "./koherent-brand";

// The steps: the arrowhead turned and repeated. Only ever shows progress.
// They draw in when their Reveal comes into view, so keep them inside one.
export function Steps({ total, done, size = 14, onDark = false }: { total: number; done: number; size?: number; onDark?: boolean }) {
  return (
    <span aria-hidden style={{ display: "inline-flex", gap: size * 0.28 }}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} className="k-chev" viewBox="0 0 8 12" style={{ width: size * 0.67, height: size, transitionDelay: `${i * 70}ms` }}>
          <path d={CHEV} fill={i < done ? (onDark ? K.lilac : K.plum) : onDark ? "rgba(199,174,230,0.25)" : K.line} />
        </svg>
      ))}
    </span>
  );
}

// ── small primitives ─────────────────────────────────────────────────────────
export function Sect({ id, children, bg = K.paper, style }: { id?: string; children: ReactNode; bg?: string; style?: CSSProperties }) {
  // data-k-dark turns the focus ring lilac, so it still shows on plum and ink.
  return (
    <section id={id} data-k-dark={bg === K.ink || bg === K.plum ? "" : undefined} style={{ position: "relative", overflow: "hidden", background: bg, scrollMarginTop: 72, ...style }}>
      {children}
    </section>
  );
}

export function Label({ children, onDark = false, style }: { children: ReactNode; onDark?: boolean; style?: CSSProperties }) {
  return (
    <p style={{ ...mono, fontSize: 13.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: onDark ? K.lilac : K.violet, margin: 0, ...style }}>
      {children}
    </p>
  );
}

export function Head({ n, label, heading, lead, onDark = false, center = true }: { n?: number; label: string; heading: ReactNode; lead?: ReactNode; onDark?: boolean; center?: boolean }) {
  // Wide and a step smaller, so a two-sentence heading sets as two lines
  // (one per sentence, via .k-br) instead of three ragged ones. `n` sets a
  // faint oversized chapter numeral behind the heading (below the label, so
  // the label stays clean): editorial, and it makes the section titles read
  // bigger (Michael, Oct 27) without shouting.
  return (
    <div style={{ position: "relative", maxWidth: center ? 1088 : 760, margin: center ? "0 auto" : undefined, textAlign: center ? "center" : "left" }}>
      {n !== undefined && (
        <span aria-hidden style={{ ...mono, position: "absolute", left: center ? "50%" : 0, top: 30, transform: center ? "translateX(-50%)" : undefined, fontSize: "clamp(5rem, 11vw, 8.5rem)", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.04em", color: onDark ? "rgba(199,174,230,0.09)" : "rgba(70,25,72,0.065)", userSelect: "none", pointerEvents: "none", zIndex: 0 }}>
          {String(n).padStart(2, "0")}
        </span>
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
      <Label onDark={onDark}>{label}</Label>
      <h2 style={{ ...title, fontSize: "clamp(2rem, 3.6vw, 3rem)", color: onDark ? K.onDark : K.ink, margin: "18px 0 0" }}>{heading}</h2>
      {lead && (
        <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", lineHeight: 1.6, color: onDark ? K.onDarkDim : K.stone, margin: "18px 0 0", maxWidth: "58ch", marginLeft: center ? "auto" : undefined, marginRight: center ? "auto" : undefined }}>
          {lead}
        </p>
      )}
      </div>
    </div>
  );
}

export function Primary({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className="k-btn"
      style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15.5, fontWeight: 700, color: onDark ? K.plum : K.paper, background: onDark ? K.paper : K.plum, borderRadius: 6, padding: "14px 22px", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}

export function Secondary({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className="k-btn"
      style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15.5, fontWeight: 700, color: onDark ? K.onDark : K.ink, border: `1.5px solid ${onDark ? K.darkLine : K.line}`, borderRadius: 6, padding: "12.5px 20px", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}

// "Each key section lets the viewer go to a page with more detail" (Michael).
export function More({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link href={href} className="k-more" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 700, color: onDark ? K.lilac : K.plum, textDecoration: "none" }}>
      {children} <ArrowRight size={15} />
    </Link>
  );
}

// ── footer ───────────────────────────────────────────────────────────────────
// Centered, like the rest of the site (Matteo, Oct 23), and it ends on the
// wordmark, set huge and cropped: the last thing on every page is the name.
function Footer() {
  const links: [string, string][] = [...CHAPTERS.map((c): [string, string] => [c.name, c.href]), ["Talk to our team", PAGES.contact], ["ShipTime", "https://www.shiptime.com"]];
  return (
    <footer data-k-dark="" style={{ background: K.ink, color: K.onDarkDim, overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(56px, 7vw, 88px) clamp(20px, 4vw, 56px) 0", textAlign: "center" }}>
        <Label onDark style={{ fontSize: 12 }}>Your managed logistics network</Label>
        <p style={{ ...title, fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", color: K.onDark, margin: "16px 0 0" }}>Make it coherent.</p>
        <nav aria-label="Footer" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px 28px", marginTop: 30 }}>
          {links.map(([l, h]) => (
            <Link key={l} href={h} className="k-footlink" style={{ ...sans, fontSize: 15, color: K.onDark, textDecoration: "none" }}>
              {l}
            </Link>
          ))}
        </nav>
        <div style={{ borderTop: `1px solid ${K.darkLine}`, marginTop: "clamp(40px, 5vw, 56px)", paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 24px" }}>
          <span style={{ ...sans, fontSize: 13 }}>ShipTime and Warehowz are part of Koherent.</span>
          <span style={{ ...mono, fontSize: 12 }}>© 2026 Koherent</span>
        </div>
      </div>
      <div aria-hidden style={{ display: "flex", justifyContent: "center", height: "clamp(64px, 15vw, 214px)", overflow: "hidden", marginTop: "clamp(24px, 3.5vw, 44px)" }}>
        <Logo size="clamp(90px, 21vw, 300px)" color="rgba(199,174,230,0.13)" />
      </div>
    </footer>
  );
}

// ── page frame ───────────────────────────────────────────────────────────────
export function KoherentShell({ children }: { children: ReactNode }) {
  return (
    <div className="k-root" style={{ ...sans, background: K.paper, color: K.ink }}>
      <KoherentNav />
      <main>{children}</main>
      <Footer />
      <style>{`
        .k-root ::selection { background: ${K.lilac}; color: ${K.ink}; }
        /* one focus ring for every control on the site, in the brand violet.
           (0,3,0) beats the ShipTime-orange ring in globals.css, and it reaches
           the shared form and the score shiplet; lilac where the ground is dark */
        .k-root :is(a, button, input, select, textarea, summary, [tabindex]):focus-visible { outline: 2px solid ${K.violet}; outline-offset: 3px; }
        .k-root [data-k-dark] :focus-visible { outline-color: ${K.lilac}; }
        .k-root h1, .k-root h2, .k-root h3 { text-wrap: balance; }
        /* a heading's second sentence starts its own line on desktop */
        .k-br { display: block; }
        /* phone-width labels for long buttons (.k-long / .k-short) */
        .k-short { display: none; }
        .k-root p, .k-root li, .k-root dd { text-wrap: pretty; }
        .k-footlink:hover { text-decoration: underline; text-underline-offset: 4px; }
        .k-btn { transition: transform .18s ease, opacity .18s ease; }
        .k-btn:hover { transform: translateY(-1px); opacity: .92; }
        .k-more:hover { text-decoration: underline; text-underline-offset: 4px; }
        .k-lift { transition: transform .2s ease, box-shadow .2s ease; }
        .k-lift:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -26px rgba(23,16,28,.45); }
        .k-next .k-next-arrow { transition: transform .35s cubic-bezier(.22,1,.36,1); }
        .k-next:hover .k-next-arrow { transform: translateX(10px); }
        .k-next:hover .k-next-name { color: ${K.plum}; }
        .k-next:focus-visible { outline: 2px solid ${K.violet}; outline-offset: 6px; }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes k-fade-kf { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
          .k-fade { animation: k-fade-kf .8s cubic-bezier(.22,1,.36,1) both; }
          @keyframes k-flow-kf { to { stroke-dashoffset: -36; } }
          .k-flow { animation: k-flow-kf 1.6s linear infinite; }
          /* the steps appear once, left to right, then stop (deck slide 26) */
          .k-chev { opacity: 0; transform: translateX(-4px); transition: opacity .4s ease, transform .4s ease; }
          [data-reveal="in"] .k-chev { opacity: 1; transform: none; }
          /* the page header has no Reveal (it fades in with CSS), so its steps
             arrive with the header instead of waiting for one */
          .k-ph-chapter .k-chev { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) { .k-mq [class*="animate-"] { animation: none !important; } }
        @media (max-width: 960px) {
          .k-hero { grid-template-columns: 1fr !important; }
          .k-three { grid-template-columns: 1fr !important; }
          .k-two { grid-template-columns: 1fr !important; }
          .k-six { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .k-wideimg { aspect-ratio: 4 / 3 !important; }
          .k-six { grid-template-columns: 1fr !important; }
          .k-numcard { position: relative !important; left: auto !important; right: auto !important; bottom: auto !important; width: 100% !important; margin-top: -24px; }
          .k-ph-chapter { flex-direction: column; gap: 10px !important; }
          .k-br { display: inline; }
          /* paired CTAs go full width and equal; long labels swap to short */
          .k-cta > a { width: 100%; justify-content: center; }
          .k-long { display: none; }
          .k-short { display: inline; }
        }
      `}</style>
    </div>
  );
}

// ── detail-page header ───────────────────────────────────────────────────────
// Where the page sits in the story (chapter n of 4, as the steps), then the
// page's own h1, a size above every section heading. One arrowhead, cut from
// the K and far larger than the page, anchors the right edge.
// It fades in with CSS (.k-fade) rather than a Reveal: the h1 is the first
// thing on the page, so it shouldn't wait for hydration, or for JS at all.
// `compact` is for a page whose work starts right under the header (the score:
// question one should sit above the fold).
export function PageHead({ chapter, label, heading, lead, compact = false, children }: { chapter?: number; label: string; heading: ReactNode; lead?: ReactNode; compact?: boolean; children?: ReactNode }) {
  return (
    <Sect>
      <svg aria-hidden viewBox="4.5 0 7.5 12" preserveAspectRatio="xMaxYMid meet" style={{ position: "absolute", right: "-6vw", top: "-8%", height: "116%", width: "auto", opacity: 0.55 }}>
        <path d={K_ARROW} fill={K.mist} />
      </svg>
      <div
        className="k-fade"
        style={{ ...inner, position: "relative", paddingTop: compact ? "clamp(36px, 4.5vw, 64px)" : "clamp(56px, 7vw, 104px)", paddingBottom: compact ? "clamp(24px, 3vw, 40px)" : "clamp(56px, 7vw, 96px)", textAlign: "center" }}
      >
        <div className="k-ph-chapter" style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
          {chapter ? <Steps total={CHAPTERS.length} done={chapter} size={13} /> : null}
          <Label>
            {chapter ? `${String(chapter).padStart(2, "0")} / ${String(CHAPTERS.length).padStart(2, "0")} · ` : ""}
            {label}
          </Label>
        </div>
        <h1 style={{ ...display, fontSize: compact ? "clamp(2.2rem, 4.6vw, 3.6rem)" : "clamp(2.7rem, 6vw, 4.9rem)", color: K.ink, margin: "26px auto 0", maxWidth: compact ? "20ch" : "17ch" }}>{heading}</h1>
        {lead && (
          <p style={{ ...sans, fontSize: "clamp(1.08rem, 1.5vw, 1.28rem)", lineHeight: 1.6, color: K.stone, margin: compact ? "18px auto 0" : "26px auto 0", maxWidth: "54ch" }}>{lead}</p>
        )}
        {children && <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 34 }}>{children}</div>}
      </div>
    </Sect>
  );
}

// ── the hand-on ──────────────────────────────────────────────────────────────
// The bottom of each detail page points at the next chapter, set big, so the
// visitor keeps going instead of hitting a dead end (Michael: "we don't want
// to lose the viewer before they get through the story").
export function NextChapter({ href, name, note }: { href: string; name: string; note: string }) {
  return (
    <Sect style={{ borderTop: `1px solid ${K.line}` }}>
      <Reveal style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(56px, 7vw, 96px) clamp(20px, 4vw, 56px)" }}>
        <Link href={href} className="k-next" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <Steps total={3} done={3} size={12} />
            <Label>Next</Label>
          </span>
          <span className="k-next-name" style={{ ...display, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25em", fontSize: "clamp(2.6rem, 7vw, 5.6rem)", color: K.ink, margin: "18px 0 0", transition: "color .25s ease" }}>
            {name}
            <ArrowRight className="k-next-arrow" style={{ width: "0.7em", height: "0.7em", flex: "none" }} strokeWidth={2.4} />
          </span>
          <span style={{ ...sans, display: "block", fontSize: "clamp(1rem, 1.3vw, 1.12rem)", color: K.stone, margin: "14px auto 0", maxWidth: "48ch" }}>{note}</span>
        </Link>
      </Reveal>
    </Sect>
  );
}

// ── close ────────────────────────────────────────────────────────────────────
// The ask is always the same (deck slides 33–34): get your Logistics
// Performance Score. On a detail page, `next` adds a quiet hand-on to the next
// chapter under the buttons, in place of a whole NextChapter section.
export function ScoreClose({ next }: { next?: { href: string; name: string } } = {}) {
  return (
    <Sect bg={K.plum}>
      <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", background: K.violet, clipPath: "polygon(55% 0, 100% 0, 100% 100%, 55% 100%, 0 50%)", opacity: 0.4 }} />
      <div style={{ ...inner, position: "relative", textAlign: "center" }}>
        <Reveal>
          <Label onDark>Your Logistics Performance Score</Label>
          <h2 style={{ ...display, fontSize: "clamp(2.6rem, 6vw, 4.8rem)", color: K.onDark, margin: "20px auto 0", maxWidth: "14ch" }}>How coherent is your logistics?</h2>
          <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", lineHeight: 1.6, color: K.onDarkDim, margin: "20px auto 0", maxWidth: "46ch" }}>
            Sixteen questions, five minutes. A score out of 100 against world-class logistics, across cost, operations
            and customer experience, and where the leverage is.
          </p>
          <div className="k-cta" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 32 }}>
            <Primary href={PAGES.score} onDark>
              Get your logistics score <ArrowRight size={16} />
            </Primary>
            <Secondary href={PAGES.contact} onDark>
              Talk to our team
            </Secondary>
          </div>
          {next && (
            <div style={{ marginTop: 30, paddingTop: 22, borderTop: `1px solid ${K.darkLine}`, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
              <More href={next.href} onDark>
                Next: {next.name}
              </More>
            </div>
          )}
        </Reveal>
      </div>
    </Sect>
  );
}
