import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ConsoleView } from "./koherent-motion";
import { BringBento, NetworkMap, RateCard, RateSwitches, ShipletScreen } from "./koherent-bring";
import { IntegrationsWall, TeamCard } from "./koherent-bring-page";
import { MethodPlayer } from "./koherent-method";
import { TargetTriangle } from "./koherent-target";
import { INTEGRATIONS, LogoChip, LogoRow, chip } from "./koherent-logos";
import { Live } from "./koherent-live";
import { CASES } from "./koherent-cases";
import { CHEV } from "./koherent-brand";
import { GROUPS, pageByKey } from "./koherent-copy";
import type { Block, Card, Page, Widget } from "./koherent-copy";
import { box, K, KMark, KoherentShell, Label, More, Notes, PAGES, Primary, Secondary, Sect, Steps, display, mono, sans, title } from "./koherent-ui";

// ── Revision 2 pages (Oct 30) ────────────────────────────────────────────────
// One renderer for Jenny's pages (koherent-copy.ts): her headline and subhead
// on the left with her button, the page's own object on the right, then each
// of her sections in the shape its words suggest (a split row with a widget,
// a row of cards, steps, a list), then her closing ask on the plum band with
// the score beside it (Chris: the score is the ask on every page).
// White throughout, with boxes and soft shadows instead of the tan ground.
// The widgets are the first revision's own (console, map, rates, the applet,
// the account team…), so the site still shows the product working instead of
// describing it.

export const wrap: CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "clamp(48px, 6vw, 84px) clamp(20px, 4vw, 56px)" };
const para: CSSProperties = { ...sans, fontSize: "clamp(1.02rem, 1.25vw, 1.12rem)", lineHeight: 1.7, color: K.stone, margin: "18px 0 0", maxWidth: "62ch" };
const panel: CSSProperties = { background: K.wash, border: `1px solid ${K.line}`, borderRadius: 14, padding: "clamp(16px, 2.4vw, 28px)" };
const chev = (fill: string, size = 8) => (
  <svg viewBox="0 0 8 12" aria-hidden style={{ width: size * 0.67, height: size, flex: "none" }}>
    <path d={CHEV} fill={fill} />
  </svg>
);

// ── small widgets new in revision 2 ──────────────────────────────────────────

// "Your logistics has no operating system", drawn from Jenny's own four
// sentences: two pieces that talk to each other, two that don't.
function Pieces() {
  const rows: { a: string; link: string; b: string; broken?: boolean }[] = [
    { a: "Your store", link: "talks to", b: "Your shipping software" },
    { a: "Your shipping software", link: "talks to", b: "Six carriers" },
    { a: "Your warehouse", link: "runs on", b: "Something else", broken: true },
    { a: "Your returns", link: "run on", b: "Email", broken: true },
  ];
  const pill = (t: string, faint = false): CSSProperties => ({ ...sans, fontSize: 14.5, fontWeight: 600, lineHeight: 1.3, color: faint ? K.stone : K.ink, background: K.card, border: `1.5px ${faint ? "dashed" : "solid"} ${faint ? K.lilac : K.line}`, borderRadius: 10, padding: "11px 12px", textAlign: "center", minWidth: 0 });
  return (
    <div style={{ ...box, padding: "clamp(18px, 2.6vw, 30px)" }}>
      <Label style={{ fontSize: 11.5 }}>Your logistics today</Label>
      <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
        {rows.map((r) => (
          <div key={r.a} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 84px minmax(0, 1fr)", alignItems: "center", gap: 8 }}>
            <span style={pill(r.a)}>{r.a}</span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ ...mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: r.broken ? K.violet : K.stone, whiteSpace: "nowrap" }}>{r.link}</span>
              <span aria-hidden style={{ width: "100%", height: 0, borderTop: `2px ${r.broken ? "dashed" : "solid"} ${r.broken ? K.lilac : K.line}` }} />
            </span>
            <span style={pill(r.b, r.broken)}>{r.b}</span>
          </div>
        ))}
      </div>
      <p style={{ ...title, fontSize: "1.1rem", color: K.plum, margin: "20px 0 0", paddingTop: 16, borderTop: `1px solid ${K.line}` }}>Nobody can see the whole system.</p>
    </div>
  );
}

// The invoice audit (Ship, Optimize, Growing brands): what was quoted, what
// was billed, and what happened. Figures are illustrative and say so.
function AuditCard() {
  const rows: { to: string; quoted: string; billed: string; result: string; tone: "ok" | "flag" | "won" }[] = [
    { to: "Order to Denver", quoted: "$14.20", billed: "$18.95", result: "Disputed", tone: "flag" },
    { to: "Order to Austin", quoted: "$9.80", billed: "$9.80", result: "Matches", tone: "ok" },
    { to: "Order to Miami", quoted: "$22.10", billed: "$27.40", result: "Credited $5.30", tone: "won" },
  ];
  const tone = { ok: { c: K.stone, bg: K.wash }, flag: { c: "#5C4300", bg: "#FFF6DB" }, won: { c: K.paper, bg: K.plum } };
  return (
    <div style={{ ...box, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${K.line}` }}>
        <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 14, fontWeight: 700, color: K.ink }}>
          <KMark style={{ width: 13, height: 13 }} /> Invoice audit
        </span>
        <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.stone }}>Illustrative</span>
      </div>
      <div className="k-audit-head" style={{ ...mono, display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.8fr 1.2fr", gap: 10, padding: "10px 18px 6px", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: K.stone }}>
        <span>Shipment</span>
        <span>Quoted</span>
        <span>Billed</span>
        <span>Result</span>
      </div>
      {rows.map((r) => (
        <div key={r.to} className="k-audit-row" style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.8fr 1.2fr", gap: 10, alignItems: "center", padding: "12px 18px", borderTop: `1px solid ${K.line}` }}>
          <span style={{ ...sans, fontSize: 14, fontWeight: 600, color: K.ink }}>{r.to}</span>
          <span style={{ ...mono, fontSize: 13, color: K.ink }}>{r.quoted}</span>
          <span style={{ ...mono, fontSize: 13, color: r.billed === r.quoted ? K.ink : K.violet, fontWeight: r.billed === r.quoted ? 400 : 700 }}>{r.billed}</span>
          <span>
            <span style={{ ...mono, display: "inline-block", fontSize: 11, letterSpacing: "0.04em", color: tone[r.tone].c, background: tone[r.tone].bg, borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap" }}>{r.result}</span>
          </span>
        </div>
      ))}
      <p style={{ ...sans, fontSize: 13.5, lineHeight: 1.5, color: K.stone, margin: 0, padding: "12px 18px 14px", background: K.wash, borderTop: `1px solid ${K.line}` }}>You see the dispute, the outcome and the credit in your account.</p>
    </div>
  );
}

// The API, as one request and its answer. Illustrative, and labelled so.
function ApiCard() {
  const k = (s: string) => <span style={{ color: K.lilac }}>{s}</span>;
  const v = (s: string) => <span style={{ color: "#F2CF66" }}>{s}</span>;
  return (
    <div data-k-dark="" style={{ background: K.ink, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 60px -36px rgba(23,16,28,0.6)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${K.darkLine}` }}>
        <span style={{ ...sans, fontSize: 14, fontWeight: 700, color: K.onDark }}>REST API</span>
        <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac }}>Sandbox · illustrative</span>
      </div>
      <pre style={{ ...mono, margin: 0, padding: "18px 18px 20px", fontSize: 13, lineHeight: 1.7, color: K.onDark, whiteSpace: "pre-wrap", overflowX: "auto" }}>
        <span style={{ color: "#9BE2B4" }}>POST</span> /rates{"\n"}
        {"{"}
        {"\n  "}
        {k('"from"')}: {v('"Columbus, OH"')},{"\n  "}
        {k('"to"')}: {v('"Seattle, WA"')},{"\n  "}
        {k('"weight_lb"')}: {v("2.4")},{"\n  "}
        {k('"deliver_by"')}: {v('"2 days"')}
        {"\n}\n\n"}
        <span style={{ color: "#9BE2B4" }}>200 OK</span>
        {"\n{\n  "}
        {k('"service"')}: {v('"Regional carrier · Ground"')},{"\n  "}
        {k('"days"')}: {v("2")},{"\n  "}
        {k('"label"')}: {v('"ready"')}
        {"\n}"}
      </pre>
    </div>
  );
}

// Jenny's integration groups: the real marks where we have them, her names
// for the rest. Each group is an anchor for the Integrations menu.
function IntegrationGroups() {
  return (
    <div className="k-c4" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
      {GROUPS.map((g) => (
        <div key={g.id} id={g.id} style={{ ...box, padding: "22px 20px", textAlign: "left", scrollMarginTop: 96 }}>
          {chev(K.violet, 12)}
          <h3 style={{ ...title, fontSize: "1.15rem", color: K.ink, margin: "12px 0 0" }}>{g.title}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {g.items.map((it) => {
              const mark = INTEGRATIONS.find((l) => l.name === it.logo);
              return mark ? (
                <LogoChip key={it.name} {...mark} />
              ) : (
                <span key={it.name} style={{ ...chip, ...sans, fontSize: 13.5, fontWeight: 600, color: it.name.startsWith("and ") ? K.stone : K.ink, background: it.name.startsWith("and ") ? "transparent" : K.wash, border: `1px ${it.name.startsWith("and ") ? "dashed" : "solid"} ${it.name.startsWith("and ") ? K.lilac : K.line}` }}>
                  {it.name}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// The score as something to start: an example result and the button.
function ScoreTeaser() {
  const bars: [string, number][] = [
    ["Cost", 61],
    ["Operations", 74],
    ["Customer experience", 69],
  ];
  return (
    <div style={{ ...box, padding: "clamp(20px, 2.8vw, 32px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <Label style={{ fontSize: 11.5 }}>Logistics Performance Score</Label>
        <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.stone }}>Example result</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
        <svg viewBox="0 0 60 64" aria-hidden style={{ width: 64, height: 68, flex: "none" }}>
          <path d="M54 4 L54 60 L6 32 Z" fill="none" stroke={K.line} strokeWidth="1.5" />
          <path d="M54 12 L54 54 L16 33 Z" fill={K.lilac} stroke={K.plum} strokeWidth="1.5" />
        </svg>
        <div>
          <span style={{ ...mono, fontSize: 44, fontWeight: 500, lineHeight: 1, color: K.plum }}>68</span>
          <span style={{ ...mono, fontSize: 14, color: K.stone }}> /100</span>
          <p style={{ ...sans, fontSize: 13.5, color: K.stone, margin: "6px 0 0" }}>Advancing. Two changes would move it most.</p>
        </div>
      </div>
      <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
        {bars.map(([n, v]) => (
          <div key={n} style={{ display: "grid", gridTemplateColumns: "150px 1fr 30px", alignItems: "center", gap: 10 }}>
            <span style={{ ...sans, fontSize: 13.5, color: K.ink }}>{n}</span>
            <span style={{ height: 8, background: K.mist, borderRadius: 99, overflow: "hidden" }}>
              <span style={{ display: "block", width: `${v}%`, height: "100%", background: K.plum, borderRadius: 99 }} />
            </span>
            <span style={{ ...mono, fontSize: 12, color: K.stone, textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 22, paddingTop: 18, borderTop: `1px solid ${K.line}` }}>
        <span style={{ ...mono, fontSize: 11.5, letterSpacing: "0.06em", color: K.stone }}>16 questions · about 5 minutes · free</span>
        <More href={PAGES.score}>Start the score</More>
      </div>
    </div>
  );
}

// Where Koherent sits (Michael, Aug 6; Chris, Aug 7): between the independent
// 3PLs and the global giants, in our customers' words. Was the home page's
// "Why we're different" in the first revision.
export function Spectrum() {
  const cols: { label: string; head: string; body: string; us?: boolean }[] = [
    { label: "Independent 3PLs", head: "Willing, but limited.", body: "A small network, and no one to design the whole operation or the technology to run it." },
    { label: "Koherent", head: "Deliberately in between.", body: "The design and technology of the global giants, named people who know your operation, and custom shipping applets built for the way you work.", us: true },
    { label: "The global giants", head: "Capable, but you’re a number.", body: "One account among thousands, at prices built for the very largest shippers." },
  ];
  return (
    <div style={{ ...box, padding: "clamp(28px, 4vw, 48px) clamp(20px, 3vw, 40px)", textAlign: "center" }}>
      <p style={{ ...title, fontSize: "clamp(1.25rem, 2vw, 1.6rem)", color: K.ink, margin: 0 }}>
        More capable than the independents. <span style={{ color: K.plum }}>More personal than the giants.</span>
      </p>
      <p style={{ ...sans, fontSize: 15, color: K.stone, margin: "8px 0 0" }}>That’s how our customers describe us, and it’s the gap we’re built for.</p>
      <div className="k-spec" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 36 }}>
        <div aria-hidden className="k-spec-line" style={{ position: "absolute", top: 12, left: "16.67%", right: "16.67%", height: 2, background: K.line }} />
        {cols.map((c) => (
          <div key={c.label} style={{ position: "relative" }}>
            <div aria-hidden style={{ height: 26, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              {c.us ? (
                <span style={{ display: "inline-flex", background: K.card, padding: "0 10px" }}>
                  <KMark color={K.plum} style={{ width: 26, height: 26 }} />
                </span>
              ) : (
                <span className="k-spec-tick" style={{ width: 2, height: 16, background: K.stone }} />
              )}
            </div>
            <Label style={{ color: c.us ? K.plum : K.stone }}>{c.label}</Label>
            <h3 style={{ ...title, fontSize: "clamp(1.2rem, 1.7vw, 1.4rem)", color: c.us ? K.plum : K.ink, margin: "10px 0 0" }}>{c.head}</h3>
            <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.stone, margin: "8px auto 0", maxWidth: "30ch" }}>{c.body}</p>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 760px) {
          .k-spec { grid-template-columns: 1fr !important; gap: 28px !important; }
          .k-spec-line, .k-spec-tick { display: none; }
        }
      `}</style>
    </div>
  );
}

// The three anonymized cases (Michael), as on the first revision's home page.
export function CasesRow() {
  return (
    <>
      <div className="k-three" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {CASES.map((c) => (
          <div key={c.id} style={{ ...box, height: "100%", display: "flex", flexDirection: "column", textAlign: "left", padding: "26px 24px 22px" }}>
            <Label>{c.sector}</Label>
            <h3 style={{ ...title, fontSize: "clamp(1.35rem, 2vw, 1.65rem)", color: K.ink, margin: "12px 0 0" }}>{c.shape}</h3>
            <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.stone, margin: "10px 0 0" }}>{c.short}</p>
            <div style={{ marginTop: "auto", paddingTop: 20 }}>
              {c.figure ? (
                <div style={{ background: K.ink, borderRadius: 8, padding: "14px 16px 12px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ ...mono, fontSize: 28, fontWeight: 500, lineHeight: 1, color: K.onDark }}>{c.figure.to}</span>
                    <span className="sr-only">down from </span>
                    <s style={{ ...mono, fontSize: 14, color: K.onDarkDim, textDecorationColor: K.lilac }}>{c.figure.from}</s>
                    <span style={{ ...sans, fontSize: 13, color: K.onDarkDim }}>{c.figure.unit}</span>
                  </div>
                  <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac, margin: "10px 0 0" }}>{c.status}</p>
                </div>
              ) : (
                <div style={{ background: K.mist, borderRadius: 8, padding: "14px 16px 12px" }}>
                  <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: K.plum, margin: 0 }}>{c.status}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <More href={PAGES.cases}>Read the customer stories</More>
      </div>
    </>
  );
}

// ── the widget for a name ────────────────────────────────────────────────────
export function WidgetView({ name }: { name: Widget }) {
  switch (name) {
    case "console":
      return <ConsoleView />;
    case "rateCard":
      return (
        <Live style={panel}>
          <RateCard />
        </Live>
      );
    case "rateSwitches":
      return (
        <Live style={{ background: K.ink, borderRadius: 14, padding: "clamp(18px, 2.6vw, 30px)" }}>
          <p style={{ ...mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: K.lilac, margin: "0 0 12px" }}>Our rates and yours, on every order</p>
          <RateSwitches />
        </Live>
      );
    case "map":
      return (
        <Live style={{ ...box, padding: "clamp(16px, 2.2vw, 26px)" }}>
          <NetworkMap />
        </Live>
      );
    case "applet":
      return (
        <Live style={{ background: K.mist, borderRadius: 14, padding: "clamp(18px, 2.6vw, 28px)" }}>
          <p style={{ ...mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: K.violet, margin: "0 0 12px" }}>A custom shipping applet</p>
          <ShipletScreen />
        </Live>
      );
    case "team":
      return (
        <Live>
          <TeamCard />
        </Live>
      );
    case "integrations":
      return (
        <Live>
          <IntegrationsWall />
        </Live>
      );
    case "logos":
      return (
        <div style={{ ...box, padding: "clamp(20px, 2.6vw, 28px)" }}>
          <Label style={{ fontSize: 11.5 }}>Keeps your setup</Label>
          <LogoRow more="+ 30 more" style={{ marginTop: 16 }} />
          <p style={{ ...sans, fontSize: 14, lineHeight: 1.5, color: K.stone, margin: "16px 0 0" }}>Your store, your marketplace listings and your warehouse, connected. Labels print from one screen.</p>
        </div>
      );
    case "triangle":
      return <TargetTriangle />;
    case "method":
      return <MethodPlayer />;
    case "bento":
      return <BringBento />;
    case "cases":
      return <CasesRow />;
    case "spectrum":
      return <Spectrum />;
    case "pieces":
      return <Pieces />;
    case "score":
      return <ScoreTeaser />;
    case "audit":
      return <AuditCard />;
    case "api":
      return <ApiCard />;
    case "groups":
      return <IntegrationGroups />;
  }
}

// ── section shapes ───────────────────────────────────────────────────────────
function CardBox({ c, n, numbered }: { c: Card; n: number; numbered: boolean }) {
  const statement = !c.body;
  const inner = (
    <>
      {numbered ? (
        <span style={{ ...mono, fontSize: 12.5, color: K.violet }}>{String(n + 1).padStart(2, "0")}</span>
      ) : (
        chev(K.violet, 12)
      )}
      <h3 style={{ ...title, fontSize: statement ? "clamp(1.08rem, 1.4vw, 1.22rem)" : "1.22rem", lineHeight: statement ? 1.4 : 1.2, fontWeight: statement ? 600 : 700, letterSpacing: statement ? "-0.01em" : undefined, color: K.ink, margin: "14px 0 0" }}>{c.title}</h3>
      {c.body && <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.stone, margin: "10px 0 0" }}>{c.body}</p>}
      {c.href && (
        <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 6, marginTop: "auto", paddingTop: 18, fontSize: 14.5, fontWeight: 700, color: K.plum }}>
          Learn more <ArrowRight size={14} />
        </span>
      )}
    </>
  );
  const style: CSSProperties = { ...box, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "24px 24px 22px", textAlign: "left", textDecoration: "none", scrollMarginTop: 96 };
  return c.href ? (
    <Link id={c.id} href={c.href} className="k-lift" style={style}>
      {inner}
    </Link>
  ) : (
    <div id={c.id} style={style}>
      {inner}
    </div>
  );
}

export function CardGrid({ cards, cols = 3 }: { cards: Card[]; cols?: number }) {
  const cls = cols === 5 ? "k-c5" : cols === 4 ? "k-c4" : cols === 3 ? "k-three" : "k-two";
  const numbered = cards.every((c) => !c.body) && cards.length > 3;
  return (
    <div className={cls} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 16 }}>
      {cards.map((c, n) => (
        <Reveal key={c.title} delay={n * 70} style={{ height: "100%" }}>
          <CardBox c={c} n={n} numbered={numbered} />
        </Reveal>
      ))}
    </div>
  );
}

function StepRow({ steps }: { steps: Card[] }) {
  return (
    <div className={steps.length > 3 ? "k-c4" : "k-three"} style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, gap: 16 }}>
      {steps.map((s, n) => (
        <Reveal key={s.title} delay={n * 90} style={{ height: "100%" }}>
          <div style={{ ...box, height: "100%", padding: "24px 24px 22px", textAlign: "left" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Steps total={steps.length} done={n + 1} size={13} />
              <span style={{ ...mono, fontSize: 12, color: K.violet }}>
                {n + 1} of {steps.length}
              </span>
            </span>
            <h3 style={{ ...title, fontSize: "1.3rem", color: K.plum, margin: "14px 0 0" }}>{s.title}</h3>
            {s.body && <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: K.stone, margin: "8px 0 0" }}>{s.body}</p>}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul className="k-items" style={{ ...box, listStyle: "none", margin: 0, padding: "clamp(18px, 2.6vw, 30px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px", textAlign: "left" }}>
      {items.map((it) => (
        <li key={it} style={{ ...sans, display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15.5, lineHeight: 1.5, color: K.ink }}>
          <span style={{ marginTop: 5 }}>{chev(K.plum, 11)}</span>
          {it}
        </li>
      ))}
    </ul>
  );
}

function Heading({ b, center, onDark = false }: { b: Block; center: boolean; onDark?: boolean }) {
  const m = center ? "auto" : undefined;
  return (
    <>
      {b.label && <Label onDark={onDark}>{b.label}</Label>}
      {b.heading && <h2 style={{ ...title, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: onDark ? K.onDark : K.ink, margin: b.label ? "14px 0 0" : 0, maxWidth: center ? "28ch" : undefined, marginLeft: m, marginRight: m }}>{b.heading}</h2>}
      {b.body?.map((p) => (
        <p key={p.slice(0, 32)} style={{ ...para, color: onDark ? K.onDarkDim : K.stone, marginLeft: m, marginRight: m }}>
          {p}
        </p>
      ))}
      {b.intro && <p style={{ ...para, color: K.ink, fontWeight: 600, marginLeft: m, marginRight: m }}>{b.intro}</p>}
    </>
  );
}

function BlockView({ b, i }: { b: Block; i: number }) {
  // a split row: the words on one side, the widget on the other, alternating
  if (b.widget && !b.wide) {
    const flip = i % 2 === 1;
    return (
      <Sect id={b.id}>
        <div className="k-split" style={{ ...wrap, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }}>
          <Reveal style={{ order: flip ? 2 : 1 }}>
            <Heading b={b} center={false} />
            {b.items && <div style={{ marginTop: 22 }}><ItemList items={b.items} /></div>}
            {b.outro && <p style={para}>{b.outro}</p>}
            <Notes notes={b.notes} />
          </Reveal>
          <Reveal delay={120} style={{ order: flip ? 1 : 2, minWidth: 0 }}>
            <WidgetView name={b.widget} />
          </Reveal>
        </div>
      </Sect>
    );
  }

  // the three layers: one boxed split row each
  if (b.layers) {
    return (
      <Sect id={b.id}>
        <div style={wrap}>
          <Reveal style={{ textAlign: "center" }}>
            <Heading b={b} center />
          </Reveal>
          <div style={{ display: "grid", gap: "clamp(18px, 2.6vw, 28px)", marginTop: "clamp(32px, 4.5vw, 52px)" }}>
            {b.layers.map((l, n) => (
              <Reveal key={l.name}>
                <div className="k-split" style={{ ...box, display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)", gap: "clamp(24px, 4vw, 56px)", alignItems: "center", padding: "clamp(22px, 3.4vw, 44px)" }}>
                  <div style={{ order: n % 2 ? 2 : 1 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <Steps total={b.layers!.length} done={n + 1} size={13} />
                      <Label>Layer {n + 1}</Label>
                    </span>
                    <h3 style={{ ...title, fontSize: "clamp(1.5rem, 2.4vw, 2rem)", color: K.plum, margin: "14px 0 0" }}>{l.name}</h3>
                    <p style={para}>{l.body}</p>
                    <Notes notes={l.notes} />
                  </div>
                  <div style={{ order: n % 2 ? 1 : 2, minWidth: 0 }}>
                    <WidgetView name={l.widget} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Sect>
    );
  }

  // centered words, then whatever the section holds at full width
  const dark = b.widget === "triangle";
  return (
    <Sect id={b.id} bg={dark ? K.ink : undefined}>
      <div style={wrap}>
        {(b.heading || b.body || b.label) && (
          <Reveal style={{ textAlign: "center" }}>
            <Heading b={b} center onDark={dark} />
          </Reveal>
        )}
        {(b.cards || b.steps || b.items || b.widget) && (
          <div style={{ marginTop: b.heading || b.body ? "clamp(32px, 4.5vw, 52px)" : 0 }}>
            {b.cards && <CardGrid cards={b.cards} cols={b.cols} />}
            {b.steps && <StepRow steps={b.steps} />}
            {b.items && (
              <Reveal>
                <ItemList items={b.items} />
              </Reveal>
            )}
            {b.widget && (
              <Reveal delay={100}>
                <WidgetView name={b.widget} />
              </Reveal>
            )}
          </div>
        )}
        {b.outro && (
          <Reveal>
            <p style={{ ...para, color: K.ink, textAlign: "center", marginLeft: "auto", marginRight: "auto", marginTop: 28 }}>{b.outro}</p>
          </Reveal>
        )}
        <Notes notes={b.notes} center style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "stretch", marginTop: 24 }} />
      </div>
    </Sect>
  );
}

// ── the page's top and bottom ────────────────────────────────────────────────
export function PageHero({ page }: { page: Page }) {
  // Some of Jenny's headlines are a whole sentence (Ship, Fulfill…): those set
  // a size or two smaller so they stay around four lines.
  const n = page.headline.length;
  const size = n > 100 ? "clamp(1.85rem, 2.9vw, 2.45rem)" : n > 60 ? "clamp(2rem, 3.4vw, 2.9rem)" : "clamp(2.4rem, 4.6vw, 3.9rem)";
  const long = n > 60;
  return (
    <Sect style={{ overflow: "visible" }}>
      <div className="k-r2hero" style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(36px, 5vw, 72px) clamp(20px, 4vw, 56px) clamp(48px, 6vw, 88px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "clamp(32px, 5vw, 72px)", alignItems: "center" }}>
        <div className="k-fade">
          <Label>{page.label}</Label>
          <h1 style={{ ...display, fontSize: size, lineHeight: long ? 1.1 : 1.0, letterSpacing: long ? "-0.025em" : display.letterSpacing, color: K.plum, margin: "18px 0 0" }}>{page.headline}</h1>
          {page.subhead && <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.35vw, 1.2rem)", lineHeight: 1.6, color: K.stone, margin: "20px 0 0", maxWidth: "50ch" }}>{page.subhead}</p>}
          <div className="k-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
            <Primary href={page.cta.href}>
              {page.cta.label} <ArrowRight size={16} />
            </Primary>
            {page.secondary && <Secondary href={page.secondary.href}>{page.secondary.label}</Secondary>}
          </div>
          <Notes notes={page.heroNotes} />
        </div>
        <div className="k-fade" style={{ minWidth: 0, animationDelay: "0.15s" }}>
          <WidgetView name={page.hero} />
        </div>
      </div>
    </Sect>
  );
}

export function CloseBand({ close }: { close: Page["close"] }) {
  const second = close.cta.href === PAGES.score ? { label: "Talk to an advisor", href: PAGES.contact } : { label: "Get your logistics score", href: PAGES.score };
  return (
    <Sect bg={K.plum}>
      <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", background: K.violet, clipPath: "polygon(55% 0, 100% 0, 100% 100%, 55% 100%, 0 50%)", opacity: 0.4 }} />
      <div style={{ ...wrap, position: "relative", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ ...display, fontSize: "clamp(2.2rem, 5vw, 4rem)", color: K.onDark, margin: "0 auto", maxWidth: "18ch" }}>{close.heading}</h2>
          {close.body && <p style={{ ...sans, fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", lineHeight: 1.6, color: K.onDarkDim, margin: "20px auto 0", maxWidth: "50ch" }}>{close.body}</p>}
          <div className="k-cta" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 32 }}>
            <Primary href={close.cta.href} onDark>
              {close.cta.label} <ArrowRight size={16} />
            </Primary>
            <Secondary href={second.href} onDark>
              {second.label}
            </Secondary>
          </div>
          <Notes notes={close.notes} center />
        </Reveal>
      </div>
    </Sect>
  );
}

// The layout rules every revision-2 page needs once.
export function R2Styles() {
  return (
    <style>{`
      @media (min-width: 961px) and (max-width: 1180px) { .k-c5 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }
      @media (max-width: 960px) {
        .k-r2hero, .k-split { grid-template-columns: 1fr !important; }
        .k-split > * { order: initial !important; }
        .k-c4, .k-c5 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
      }
      @media (max-width: 640px) {
        .k-c4, .k-c5, .k-items { grid-template-columns: 1fr !important; }
        .k-audit-head { display: none !important; }
        .k-audit-row { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>
  );
}

// ── a whole page from its key ────────────────────────────────────────────────
export function R2Page({ pageKey, children }: { pageKey: string; children?: ReactNode }) {
  const page = pageByKey(pageKey);
  return (
    <KoherentShell>
      <PageHero page={page} />
      {page.blocks.map((b, i) => (
        <BlockView key={b.id ?? b.heading} b={b} i={i} />
      ))}
      {children}
      <CloseBand close={page.close} />
      <R2Styles />
    </KoherentShell>
  );
}

export function r2Metadata(key: string): Metadata {
  const p = pageByKey(key);
  return { title: p.title, description: p.description };
}
