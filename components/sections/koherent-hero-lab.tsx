import type { CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { K, KMark, Label, PAGES, Primary, Secondary, Sect, display, inner, mono, sans } from "./koherent-ui";

// ── Hero lab (Oct 28) ────────────────────────────────────────────────────────
// Matteo: "I don't like the way it's designed at all… the image in the hero
// should be bigger… everything needs to be really good for mobile." Three
// directions, each with a much bigger picture, stacked on /koherent/lab for
// him to pick from, as on Oct 23. The copy is the live hero's. The picture
// is a prop, so the same three can be tried with any candidate image. Still
// pictures here; the chosen one gets the motion back.

export const HERO_COPY = {
  eyebrow: "Logistics, designed and run with you",
  h1: "Your managed logistics network.",
  line: "We cut shipping costs, improve operations and simplify fulfillment for businesses sending 500+ orders a month to individuals.",
  sub: "Not another 3PL, not another shipping platform. One team designs your network from your own order data and runs it with you: no rebuild, and you stay in control.",
};

function Buttons({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="k-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
      <Primary href={PAGES.score} onDark={onDark}>
        <span className="k-long">Get your Logistics Performance Score</span>
        <span className="k-short">Get your logistics score</span> <ArrowRight size={16} />
      </Primary>
      <Secondary href={PAGES.contact} onDark={onDark}>
        Talk to our team
      </Secondary>
    </div>
  );
}

function CostCard({ style }: { style?: CSSProperties }) {
  return (
    <div className="k-numcard" style={{ background: K.ink, color: K.onDark, borderRadius: 4, padding: "18px 20px 16px", boxShadow: "0 30px 60px -30px rgba(23,16,28,0.6)", ...style }}>
      <p style={{ ...mono, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: K.lilac, margin: 0 }}>Cost per shipment · proposed</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 8 }}>
        <span style={{ ...mono, fontSize: 36, fontWeight: 500, lineHeight: 1 }}>$13.22</span>
        <span style={{ ...mono, fontSize: 14, color: K.onDarkDim, textDecoration: "line-through", textDecorationColor: K.lilac }}>$25.00</span>
      </div>
      <p style={{ ...sans, fontSize: 12.5, lineHeight: 1.45, color: K.onDarkDim, margin: "8px 0 0" }}>From our proposal for a US golf brand entering Canada. Not yet realized.</p>
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span style={{ ...mono, position: "absolute", top: 14, right: 14, zIndex: 3, fontSize: 10.5, letterSpacing: "0.04em", color: K.onDark, background: "rgba(23,16,28,0.55)", borderRadius: 8, padding: "5px 10px" }}>{children}</span>
  );
}

function LabLabel({ letter, name, note }: { letter: string; name: string; note: string }) {
  return (
    <div style={{ background: K.ink, color: K.onDark, padding: "14px clamp(20px, 4vw, 56px)", display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
      <span style={{ ...mono, fontSize: 13, color: K.lilac }}>Hero {letter}</span>
      <span style={{ ...sans, fontSize: 16, fontWeight: 700 }}>{name}</span>
      <span style={{ ...sans, fontSize: 14, color: K.onDarkDim }}>{note}</span>
    </div>
  );
}

// ── A · Full-bleed ───────────────────────────────────────────────────────────
// The picture is the hero: edge to edge, nearly the whole screen, with the
// text on a plum gradient over its left side. On a phone the picture fills
// the top and the text sits on the gradient below it.
export function HeroFullBleed({ src }: { src: string }) {
  return (
    <Sect bg={K.ink} style={{ minHeight: "min(88vh, 820px)", display: "flex", alignItems: "stretch" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0 }}>
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(23,16,28,0.94) 0%, rgba(23,16,28,0.86) 34%, rgba(23,16,28,0.42) 62%, rgba(23,16,28,0.12) 100%)" }} />
        <div className="k-lab-a-bottom" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(23,16,28,0) 45%, rgba(23,16,28,0.65) 100%)" }} />
      </div>
      <Tag>Illustrative photo</Tag>
      <div style={{ ...inner, position: "relative", zIndex: 2, width: "100%", display: "grid", gridTemplateColumns: "minmax(0, 620px) 1fr", alignItems: "end", paddingTop: "clamp(56px, 8vw, 120px)", paddingBottom: "clamp(40px, 5vw, 72px)" }} className="k-lab-a">
        <div>
          <Label onDark>{HERO_COPY.eyebrow}</Label>
          <h1 style={{ ...display, fontSize: "clamp(2.8rem, 6.4vw, 5.4rem)", color: K.onDark, margin: "20px 0 0" }}>{HERO_COPY.h1}</h1>
          <p style={{ ...sans, fontSize: "clamp(1.1rem, 1.6vw, 1.32rem)", fontWeight: 500, lineHeight: 1.45, color: K.onDark, margin: "22px 0 0", maxWidth: "36ch" }}>{HERO_COPY.line}</p>
          <p style={{ ...sans, fontSize: "clamp(1rem, 1.2vw, 1.08rem)", lineHeight: 1.6, color: K.onDarkDim, margin: "14px 0 0", maxWidth: "50ch" }}>{HERO_COPY.sub}</p>
          <Buttons onDark />
        </div>
        <div className="k-lab-a-side" style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: 18 }}>
          <span aria-hidden style={{ display: "inline-flex", gap: 8 }}>
            {[K.lilac, K.violet, K.plum].map((c, i) => (
              <svg key={i} viewBox="0 0 8 12" style={{ width: 22, height: 33 }}>
                <path d="M0 0 H3.4 L8 6 L3.4 12 H0 L4.6 6 Z" fill={c} />
              </svg>
            ))}
          </span>
          <CostCard style={{ width: 300 }} />
        </div>
      </div>
    </Sect>
  );
}

// ── B · Stacked, centered ────────────────────────────────────────────────────
// Everything centered, as the first version was, with the picture below the
// words as one wide arrowhead-cut panel the full width of the page. The K sits
// at the arrow tip, the cost card on the picture's corner.
export function HeroStacked({ src }: { src: string }) {
  return (
    <Sect>
      <div style={{ ...inner, paddingTop: "clamp(48px, 6vw, 88px)", paddingBottom: "clamp(56px, 7vw, 96px)", textAlign: "center" }}>
        <Label>{HERO_COPY.eyebrow}</Label>
        <h1 style={{ ...display, fontSize: "clamp(2.9rem, 7.2vw, 6.2rem)", color: K.plum, margin: "20px auto 0", maxWidth: "14ch" }}>{HERO_COPY.h1}</h1>
        <p style={{ ...sans, fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)", fontWeight: 500, lineHeight: 1.45, color: K.ink, margin: "24px auto 0", maxWidth: "44ch" }}>{HERO_COPY.line}</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Buttons />
        </div>
        <div style={{ position: "relative", marginTop: "clamp(40px, 5vw, 64px)" }}>
          <div className="k-lab-b-photo" style={{ clipPath: "polygon(9% 0, 100% 0, 100% 100%, 9% 100%, 0 50%)", background: K.mist }}>
            <img src={src} alt="" style={{ width: "100%", height: "auto", aspectRatio: "21 / 9", objectFit: "cover", objectPosition: "center 45%", display: "block" }} />
          </div>
          <Tag>Illustrative photo</Tag>
          <div aria-hidden style={{ position: "absolute", left: 0, top: "50%", width: 84, height: 84, marginLeft: -42, marginTop: -42, background: K.plum, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px -20px rgba(23,16,28,0.6)" }}>
            <KMark color={K.paper} style={{ width: 40, height: 40 }} />
          </div>
          <CostCard style={{ position: "absolute", right: "3%", bottom: "-8%", width: "min(300px, 70%)", textAlign: "left" }} />
        </div>
        <p style={{ ...sans, fontSize: "clamp(1rem, 1.2vw, 1.08rem)", lineHeight: 1.6, color: K.stone, margin: "clamp(56px, 7vw, 80px) auto 0", maxWidth: "52ch" }}>{HERO_COPY.sub}</p>
      </div>
    </Sect>
  );
}

// ── C · Split, tall ──────────────────────────────────────────────────────────
// Text left, the picture right and tall: it runs the full height of the hero
// and off the right edge of the page, cut by the arrowhead on its left. The
// cost card hangs over its bottom-left corner. On a phone the picture goes
// under the words at 4:5, still edge to edge.
export function HeroSplitTall({ src }: { src: string }) {
  return (
    <Sect style={{ overflow: "hidden" }}>
      <div className="k-lab-c" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0 0 clamp(20px, 4vw, 56px)", display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: "clamp(24px, 4vw, 56px)", alignItems: "center", minHeight: "min(84vh, 760px)" }}>
        <div className="k-lab-c-text" style={{ padding: "clamp(48px, 6vw, 88px) 0" }}>
          <Label>{HERO_COPY.eyebrow}</Label>
          <h1 style={{ ...display, fontSize: "clamp(2.8rem, 6vw, 5rem)", color: K.plum, margin: "20px 0 0" }}>{HERO_COPY.h1}</h1>
          <p style={{ ...sans, fontSize: "clamp(1.1rem, 1.6vw, 1.3rem)", fontWeight: 500, lineHeight: 1.45, color: K.ink, margin: "22px 0 0", maxWidth: "34ch" }}>{HERO_COPY.line}</p>
          <p style={{ ...sans, fontSize: "clamp(1rem, 1.2vw, 1.08rem)", lineHeight: 1.6, color: K.stone, margin: "14px 0 0", maxWidth: "46ch" }}>{HERO_COPY.sub}</p>
          <Buttons />
        </div>
        <div className="k-lab-c-photo" style={{ position: "relative", alignSelf: "stretch", minHeight: 560 }}>
          <div style={{ position: "absolute", inset: 0, left: 0, right: "calc(-1 * max(0px, (100vw - 1200px) / 2))", clipPath: "polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)", background: K.mist }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 50%", display: "block" }} />
          </div>
          <Tag>Illustrative photo</Tag>
          <span aria-hidden style={{ position: "absolute", left: "12%", bottom: 28, display: "inline-flex", gap: 8 }}>
            {[K.lilac, K.violet, K.plum].map((c, i) => (
              <svg key={i} viewBox="0 0 8 12" style={{ width: 22, height: 33 }}>
                <path d="M0 0 H3.4 L8 6 L3.4 12 H0 L4.6 6 Z" fill={c} />
              </svg>
            ))}
          </span>
          <CostCard style={{ position: "absolute", left: "-6%", bottom: "9%", width: "min(300px, 78%)" }} />
        </div>
      </div>
    </Sect>
  );
}

export function HeroLab({ images }: { images: { src: string; name: string }[] }) {
  const main = images[0].src;
  return (
    <>
      <LabLabel letter="A" name="Full-bleed" note="The picture is the whole hero; the words sit on a plum gradient over its left side." />
      <HeroFullBleed src={main} />
      <LabLabel letter="B" name="Stacked, centered" note="Words centered, then one wide arrowhead-cut picture the full width of the page, the K at its tip." />
      <HeroStacked src={main} />
      <LabLabel letter="C" name="Split, tall" note="Words left; the picture right, full height, running off the edge of the page." />
      <HeroSplitTall src={main} />

      <LabLabel letter="·" name="Picture candidates" note="Any of these can go into A, B or C." />
      <Sect bg={K.mist}>
        <div className="k-lab-pics" style={{ ...inner, paddingTop: 40, paddingBottom: 56, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
          {images.map((im, i) => (
            <figure key={im.src} style={{ margin: 0 }}>
              <img src={im.src} alt="" style={{ width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover", display: "block", borderRadius: 4 }} />
              <figcaption style={{ ...mono, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: K.stone, marginTop: 10 }}>
                {i + 1} · {im.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </Sect>
      <style>{`
        @media (max-width: 960px) {
          .k-lab-a { grid-template-columns: 1fr !important; }
          .k-lab-a-side { justify-content: flex-start !important; margin-top: 28px; }
          .k-lab-c { grid-template-columns: 1fr !important; padding-right: clamp(20px, 4vw, 56px) !important; }
          .k-lab-c-photo { min-height: 0 !important; aspect-ratio: 4 / 5; margin: 0 calc(-1 * clamp(20px, 4vw, 56px)) 0 0; }
          .k-lab-c-photo > div { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%) !important; right: 0 !important; }
          .k-lab-c-text { padding-bottom: 24px !important; }
        }
        @media (max-width: 640px) {
          .k-lab-pics { grid-template-columns: 1fr !important; }
          .k-lab-b-photo img { aspect-ratio: 4 / 3 !important; }
        }
      `}</style>
    </>
  );
}
