"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpFromLine,
  Check,
  ChevronDown,
  Clock,
  Repeat,
  ShieldCheck,
  Sparkles,
  Store,
  UserCheck,
} from "lucide-react";
import {
  advisor,
  analysisSteps,
  company,
  findings,
  firstMonth,
  mixNew,
  mixToday,
  money,
  plan,
  regions,
  slots,
} from "./data";

// ── Shipping Check ───────────────────────────────────────────────────────────
// The onboarding product from the product strategy: connect your data, AI does
// the first pass, a person signs it off, and the report recommends the right
// step on the staircase. A clickable prototype on sample data, in the ShipTime
// One tokens (data-zone="plus"): --brand, --brand-2, --ink, --font-display.

type Screen = "connect" | "analyze" | "report" | "book" | "booked";
const STEPS: { id: Screen; label: string }[] = [
  { id: "connect", label: "Connect" },
  { id: "analyze", label: "We analyze" },
  { id: "report", label: "Your report" },
  { id: "book", label: "Talk to Sarah" },
];

const wrap: CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "0 clamp(16px, 4vw, 40px)" };
const card: CSSProperties = { background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--radius-card)" };
const heroWash = "linear-gradient(135deg, #FFFFFF 0%, var(--surface-2) 55%, var(--surface) 100%)";

function Kicker({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <p className="st-eyebrow" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, margin: 0, color }}>
      <span style={{ width: 7, height: 7, background: "var(--brand)", flex: "none" }} />
      {children}
    </p>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  full,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "ghostLight";
  disabled?: boolean;
  full?: boolean;
}) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: "var(--radius-pill)",
    padding: "14px 26px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "var(--font-label)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    border: "1.5px solid transparent",
    width: full ? "100%" : undefined,
    transition: "transform .1s ease, background .15s ease, border-color .15s ease",
  };
  const looks: Record<string, CSSProperties> = {
    primary: { background: "var(--brand)", color: "var(--on-brand)", boxShadow: disabled ? "none" : "0 8px 20px rgba(236,90,38,.25)" },
    secondary: { background: "var(--card)", color: "var(--ink)", borderColor: "var(--line)" },
    ghost: { background: "transparent", color: "var(--ink)", padding: "8px 0" },
    ghostLight: { background: "transparent", color: "#fff", padding: "10px 0" },
  };
  return (
    <button type="button" className="st-cta" onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...looks[variant] }}>
      {children}
    </button>
  );
}

function Badge({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "green" | "amber" | "ink" | "blue" }) {
  const tones: Record<string, CSSProperties> = {
    brand: { background: "#FFF4EF", color: "var(--brand)" },
    green: { background: "#EAF6F0", color: "#1F8A5B" },
    amber: { background: "#FDF5E6", color: "#B7791F" },
    ink: { background: "var(--ink)", color: "#fff" },
    blue: { background: "var(--surface-2)", color: "var(--brand-2)" },
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999, letterSpacing: ".02em", fontFamily: "var(--font-label)", ...tones[tone] }}>
      {children}
    </span>
  );
}

function Avatar({ size = 48 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "var(--ink)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size / 3, flex: "none", fontFamily: "var(--font-label)" }}>
      {advisor.initials}
    </div>
  );
}

// ── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const current = STEPS.findIndex((s) => s.id === (screen === "booked" ? "book" : screen));
  return (
    <>
      <div style={{ background: "var(--ink)", color: "rgba(255,255,255,.8)", fontSize: 12.5, textAlign: "center", padding: "7px 16px" }}>
        Prototype · <b style={{ color: "#F0845B" }}>sample company, illustrative numbers and prices</b> · ShipTime Shipping Check
      </div>
      <header style={{ background: "var(--card)", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", gap: 16, height: 66 }}>
          <img src="/shiptime-logo.svg" alt="ShipTime" width={130} height={40} style={{ height: 30, width: "auto" }} />
          <span className="st-body" style={{ color: "var(--ink-3)", fontWeight: 600, fontSize: 15, borderLeft: "1px solid var(--line)", paddingLeft: 14 }}>Shipping Check</span>
          <nav aria-label="Progress" className="hidden md:flex" style={{ marginLeft: "auto", gap: 6 }}>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(s.id)}
                style={{
                  fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
                  border: "1px solid " + (i === current ? "var(--ink)" : "var(--line)"),
                  background: i === current ? "var(--ink)" : i < current ? "var(--surface-2)" : "var(--surface)",
                  color: i === current ? "#fff" : i < current ? "var(--brand-2)" : "var(--ink-3)",
                }}
              >
                {i < current ? "✓ " : `${i + 1} · `}
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

// ── 1 · Connect ──────────────────────────────────────────────────────────────
const SOURCES = [
  { id: "shopify", name: "Shopify", body: "Read-only access to 90 days of orders: weights, addresses, what you charged for shipping.", icon: Store, tint: "#E8F5E0", ink: "#4C8C2B", badge: "Most common" },
  { id: "woo", name: "WooCommerce", body: "Same as Shopify, through our WooCommerce plugin.", icon: Store, tint: "#EFE8F7", ink: "#7F54B3" },
  { id: "invoices", name: "Upload carrier invoices", body: "PDF or CSV from UPS, FedEx, Purolator, Canada Post, Canpar. Best if you don't sell online.", icon: ArrowUpFromLine, tint: "var(--surface-2)", ink: "var(--brand-2)" },
  { id: "carrier", name: "Connect a carrier account", body: "We read your shipping history straight from the carrier. Nothing changes on your account.", icon: Repeat, tint: "#FFF4EF", ink: "var(--brand)" },
];

function Connect({ onStart }: { onStart: () => void }) {
  const [src, setSrc] = useState("shopify");
  const chosen = SOURCES.find((s) => s.id === src)!;
  return (
    <>
      <section style={{ background: heroWash, borderBottom: "1px solid var(--line)" }}>
        <div style={{ ...wrap, padding: "clamp(44px,7vw,84px) clamp(16px,4vw,40px) clamp(36px,5vw,56px)" }}>
          <Kicker>Free · no contract · ready in 48 hours</Kicker>
          <h1 className="st-display" style={{ fontSize: "clamp(2.4rem, 5.6vw, 4.2rem)", color: "var(--ink)", margin: "16px 0 0", maxWidth: "17ch" }}>
            See what your shipping should cost.
          </h1>
          <p className="st-body" style={{ fontSize: "clamp(1.02rem,1.4vw,1.2rem)", color: "var(--ink-2)", fontWeight: 500, lineHeight: 1.6, maxWidth: "60ch", margin: "18px 0 0" }}>
            Connect your store or upload your carrier invoices. We look at every order you shipped in the last 90 days and come back with what you pay, what you could save, and the setup we&rsquo;d recommend.
          </p>
          <div className="flex flex-wrap" style={{ gap: "10px 24px", marginTop: 22 }}>
            {[
              { i: ShieldCheck, t: "Read-only: we never ship or change anything" },
              { i: UserCheck, t: "AI does the first pass, a person signs it off" },
              { i: Check, t: "Every carrier compared, not just ours" },
            ].map(({ i: I, t }) => (
              <span key={t} className="st-body" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-3)", fontWeight: 500 }}>
                <I size={16} color="#1F8A5B" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section style={{ ...wrap, padding: "40px clamp(16px,4vw,40px) 64px" }}>
        <h2 className="st-display" style={{ fontSize: "clamp(1.6rem,2.6vw,2rem)", color: "var(--ink)", margin: 0 }}>Where are your orders?</h2>
        <p className="st-body" style={{ color: "var(--ink-3)", margin: "6px 0 18px" }}>Pick one. You can add more later.</p>
        <div className="grid md:grid-cols-2" style={{ gap: 14 }}>
          {SOURCES.map((s) => {
            const on = s.id === src;
            const I = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSrc(s.id)}
                style={{ ...card, textAlign: "left", padding: 22, display: "flex", gap: 14, cursor: "pointer", borderColor: on ? "var(--brand)" : "var(--line)", boxShadow: on ? "0 0 0 3px rgba(236,90,38,.12)" : "none", transition: "border-color .15s, box-shadow .15s" }}
              >
                <span style={{ width: 46, height: 46, borderRadius: 12, background: s.tint, color: s.ink, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <I size={21} />
                </span>
                <span>
                  <span className="st-display" style={{ fontSize: 19, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {s.name} {s.badge && <Badge>{s.badge}</Badge>}
                  </span>
                  <span className="st-body" style={{ display: "block", fontSize: 14, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>{s.body}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ ...card, padding: "18px 22px", marginTop: 16 }} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="st-body" style={{ fontSize: 13, color: "var(--ink-3)" }}>Connecting as</div>
            <div className="st-display" style={{ fontSize: 18, color: "var(--ink)" }}>{company.name} · {company.store}</div>
          </div>
          <Button onClick={onStart}>
            {chosen.id === "invoices" ? "Upload invoices" : `Connect ${chosen.name.replace("Connect a ", "")}`} &amp; start the check <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </>
  );
}

// ── 2 · Analyze ──────────────────────────────────────────────────────────────
function Analyze({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done > analysisSteps.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), done === 0 ? 400 : 850);
    return () => clearTimeout(t);
  }, [done]);
  const finished = done > analysisSteps.length;
  return (
    <section style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(44px,7vw,80px) clamp(16px,4vw,24px)" }}>
      <Kicker>{company.name}</Kicker>
      <h1 className="st-display" style={{ fontSize: "clamp(2rem,4.4vw,2.8rem)", color: "var(--ink)", margin: "14px 0 0" }}>We&rsquo;re going through your shipping.</h1>
      <p className="st-body" style={{ color: "var(--ink-2)", fontWeight: 500, margin: "12px 0 0" }}>Our AI does the heavy lifting. Then a logistics advisor checks every finding before you see it.</p>
      <div style={{ ...card, marginTop: 24, padding: "4px 22px" }}>
        {analysisSteps.map((s, i) => {
          const state = i + 1 < done ? "ok" : i + 1 === done ? "live" : "wait";
          return (
            <div key={s.title} style={{ display: "flex", gap: 14, padding: "15px 0", borderBottom: i < analysisSteps.length - 1 ? "1px solid var(--line)" : "none", opacity: state === "wait" ? 0.35 : 1, transition: "opacity .3s" }}>
              <span
                style={{
                  width: 26, height: 26, borderRadius: "50%", flex: "none", marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center",
                  background: state === "ok" ? "#1F8A5B" : "transparent",
                  border: state === "ok" ? "2px solid #1F8A5B" : state === "live" ? "2px solid var(--brand)" : "2px solid var(--line)",
                  borderTopColor: state === "live" ? "transparent" : undefined,
                  animation: state === "live" ? "spin .8s linear infinite" : undefined,
                }}
              >
                {state === "ok" && <Check size={14} color="#fff" strokeWidth={3} />}
              </span>
              <div>
                <div className="st-display" style={{ fontSize: 16.5, color: "var(--ink)" }}>{s.title}</div>
                <div className="st-body" style={{ fontSize: 14, color: "var(--ink-3)" }}>{s.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {finished && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ ...card, marginTop: 14, padding: 18, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <Avatar />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div className="st-display" style={{ fontSize: 16, color: "var(--ink)" }}>{advisor.name}, {advisor.role.toLowerCase()}, reviewed your report</div>
              <div className="st-body" style={{ fontSize: 13.5, color: "var(--ink-3)" }}>Usually ready within 48 hours. This prototype skips ahead.</div>
            </div>
            <Badge tone="green"><Check size={12} strokeWidth={3} /> Signed off</Badge>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button onClick={onDone} disabled={!finished}>See my report <ArrowRight size={17} /></Button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}

// ── 3 · Report ───────────────────────────────────────────────────────────────
function Kpi({ label, value, sub, dark }: { label: string; value: string; sub: string; dark?: boolean }) {
  return (
    <div style={{ ...card, padding: 20, background: dark ? "var(--ink)" : "var(--card)", borderColor: dark ? "var(--ink)" : "var(--line)" }}>
      <div className="st-body" style={{ fontSize: 13, fontWeight: 500, color: dark ? "#C9CBE0" : "var(--ink-3)" }}>{label}</div>
      <div className="st-display" style={{ fontSize: "clamp(1.7rem,2.8vw,2.2rem)", marginTop: 4, color: dark ? "#F0845B" : "var(--ink)" }}>{value}</div>
      <div className="st-body" style={{ fontSize: 13, color: dark ? "#C9CBE0" : "var(--ink-3)" }}>{sub}</div>
    </div>
  );
}

function FindingCard({ index, open, onToggle }: { index: number; open: boolean; onToggle: () => void }) {
  const f = findings[index];
  return (
    <div style={{ ...card, overflow: "hidden" }}>
      <button type="button" onClick={onToggle} aria-expanded={open} style={{ display: "flex", gap: 16, alignItems: "flex-start", width: "100%", padding: "20px 22px", background: "none", border: 0, cursor: "pointer", textAlign: "left" }} className="flex-wrap md:flex-nowrap">
        <span className="st-display" style={{ width: 32, height: 32, borderRadius: 10, background: "#FFF4EF", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: 15 }}>{index + 1}</span>
        <span style={{ flex: 1, minWidth: 220 }}>
          <span className="st-display" style={{ display: "block", fontSize: 19, color: "var(--ink)" }}>{f.title}</span>
          <span className="st-body" style={{ display: "block", fontSize: 14.5, color: "var(--ink-3)", lineHeight: 1.55, marginTop: 4 }}>{f.summary}</span>
        </span>
        <span style={{ textAlign: "right", flex: "none" }}>
          <span className="st-display" style={{ display: "block", fontSize: 21, color: "#1F8A5B" }}>{money(f.save)}</span>
          <span className="st-body" style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{f.saveNote}</span>
        </span>
        <ChevronDown size={18} color="var(--ink-3)" style={{ flex: "none", marginTop: 4, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
            <div className="px-[22px] pb-5 md:pl-[70px]">
              <div style={{ overflowX: "auto" }}>
                <table className="st-body" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr>
                      {f.table.head.map((h, i) => (
                        <th key={h} style={{ textAlign: i ? "right" : "left", fontWeight: 600, fontSize: 12.5, color: "var(--ink-3)", padding: "8px 10px", borderBottom: "1px solid var(--line)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {f.table.rows.map((r) => (
                      <tr key={r.cells[0]}>
                        {r.cells.map((c, i) => (
                          <td key={i} style={{ textAlign: i ? "right" : "left", padding: "10px", borderBottom: "1px solid var(--line)", fontWeight: r.strong ? 700 : 400, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {f.note && <p className="st-body" style={{ fontSize: 13, color: "var(--ink-3)", margin: "10px 0 0" }}>{f.note}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Mix({ parts }: { parts: { label: string; share: number; color: string }[] }) {
  return (
    <div style={{ display: "flex", height: 36, borderRadius: 10, overflow: "hidden" }}>
      {parts.map((p) => (
        <span key={p.label} title={`${p.label} ${p.share}%`} className="st-body" style={{ width: `${p.share}%`, background: p.color, color: "#fff", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", overflow: "hidden" }}>
          {p.share >= 15 ? `${p.label} ${p.share}%` : `${p.share}%`}
        </span>
      ))}
    </div>
  );
}

function Report({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState<number | null>(0);
  const [diy, setDiy] = useState(false);
  const fee = plan.monthly * 12;
  const keep = company.savingsYear - fee;
  return (
    <>
      <section style={{ background: heroWash, borderBottom: "1px solid var(--line)" }}>
        <div style={{ ...wrap, padding: "clamp(36px,5vw,60px) clamp(16px,4vw,40px)" }}>
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <Kicker>Shipping Check · {company.name}</Kicker>
              <h1 className="st-display" style={{ fontSize: "clamp(2.1rem,4.6vw,3.4rem)", color: "var(--ink)", margin: "14px 0 0" }}>
                You could save about {money(company.savingsYear)} a year.
              </h1>
              <p className="st-body" style={{ color: "var(--ink-2)", fontWeight: 500, margin: "10px 0 0" }}>
                Based on {company.orders.toLocaleString("en-US")} orders, {company.period}. Reviewed and signed off by {advisor.name} on {advisor.signedOff}.
              </p>
            </div>
            <div style={{ ...card, padding: "10px 16px 10px 10px", display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar size={44} />
              <div className="st-body" style={{ fontSize: 14 }}>
                <b style={{ color: "var(--ink)" }}>{advisor.name}</b>
                <br />
                <span style={{ color: "var(--ink-3)" }}>Your logistics advisor</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 14, marginTop: 26 }}>
            <Kpi label="You ship" value={company.parcelsPerMonth.toLocaleString("en-US")} sub={`parcels a month · ${company.carriers} carriers`} />
            <Kpi label="You pay today" value={`$${company.avgNow.toFixed(2)}`} sub="average per parcel" />
            <Kpi label="You could pay" value={`$${company.avgNew.toFixed(2)}`} sub="same delivery times" />
            <Kpi label="You'd save" value={money(company.savingsYear)} sub={`a year, plus ~${company.hoursPerMonth} hours a month`} dark />
          </div>
        </div>
      </section>

      <section style={{ ...wrap, padding: "44px clamp(16px,4vw,40px) 0" }}>
        <Kicker>What we found</Kicker>
        <h2 className="st-display" style={{ fontSize: "clamp(1.6rem,2.8vw,2.2rem)", color: "var(--ink)", margin: "12px 0 4px" }}>Four things, biggest first.</h2>
        <p className="st-body" style={{ color: "var(--ink-3)", margin: "0 0 18px" }}>Click one to see how we know.</p>
        <div style={{ display: "grid", gap: 12 }}>
          {findings.map((_, i) => (
            <FindingCard key={i} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </section>

      <section style={{ ...wrap, padding: "28px clamp(16px,4vw,40px) 0" }}>
        <div className="grid md:grid-cols-2" style={{ gap: 14 }}>
          <div style={{ ...card, padding: 22 }}>
            <h3 className="st-display" style={{ fontSize: 19, color: "var(--ink)", margin: 0 }}>Where your parcels go</h3>
            <p className="st-body" style={{ fontSize: 13.5, color: "var(--ink-3)", margin: "4px 0 10px" }}>Share of orders and average days to deliver.</p>
            {regions.map((r) => (
              <div key={r.name} className="st-body" style={{ display: "grid", gridTemplateColumns: "minmax(90px,140px) 1fr 44px 74px", gap: 10, alignItems: "center", padding: "8px 0", fontSize: 14, color: "var(--ink)" }}>
                <span>{r.name}</span>
                <span style={{ height: 10, borderRadius: 6, background: "var(--surface-2)", overflow: "hidden" }}>
                  <span style={{ display: "block", height: "100%", width: `${r.share * 2}%`, background: r.flag ? "var(--brand)" : "var(--ink)", borderRadius: 6 }} />
                </span>
                <span style={{ textAlign: "right" }}>{r.share}%</span>
                <span style={{ textAlign: "right", fontWeight: r.flag ? 700 : 400, color: r.flag ? "var(--brand)" : "var(--ink)" }}>{r.days} days</span>
              </div>
            ))}
            <p className="st-body" style={{ fontSize: 13, color: "var(--ink-3)", margin: "12px 0 0", lineHeight: 1.55 }}>
              <Badge tone="amber">For later</Badge>&nbsp; Western customers wait 4.1 days. A partner warehouse in Calgary would cut that to about 1.8 days. Worth a look once you pass ~2,000 parcels a month.
            </p>
          </div>
          <div style={{ ...card, padding: 22 }}>
            <h3 className="st-display" style={{ fontSize: 19, color: "var(--ink)", margin: 0 }}>Your carriers: today vs recommended</h3>
            <p className="st-body" style={{ fontSize: 13.5, color: "var(--ink-3)", margin: "4px 0 14px" }}>Same parcels, same delivery dates.</p>
            <div className="st-body" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Today · 6 carriers, 3 invoices</div>
            <Mix parts={mixToday} />
            <div className="st-body" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", margin: "18px 0 6px" }}>Recommended · 4 carriers, 1 bill from ShipTime</div>
            <Mix parts={mixNew} />
            <p className="st-body" style={{ fontSize: 12.5, color: "var(--ink-3)", margin: "10px 0 0" }}>&ldquo;Other&rdquo; today is Canada Post, Canpar and Loomis. FedEx stays for heavy parcels only.</p>
          </div>
        </div>
      </section>

      <section style={{ ...wrap, padding: "28px clamp(16px,4vw,40px) 0" }}>
        <div style={{ borderRadius: "var(--radius-section)", background: "linear-gradient(135deg, var(--ink) 0%, #2A2D58 100%)", color: "#fff", padding: "clamp(24px,4vw,40px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1.4px, transparent 2px)", backgroundSize: "14px 14px" }} />
          <div className="grid lg:grid-cols-2 items-center" style={{ gap: 28, position: "relative" }}>
            <div>
              <Kicker color="rgba(255,255,255,.74)">Our recommendation</Kicker>
              <h2 className="st-display" style={{ fontSize: "clamp(1.7rem,3.2vw,2.5rem)", color: "#fff", margin: "14px 0 0" }}>{plan.name}: we do the shipping work for you.</h2>
              <p className="st-body" style={{ color: "rgba(255,255,255,.78)", fontWeight: 500, margin: "12px 0 0", lineHeight: 1.6 }}>
                You ship about 60 parcels every working day, a third of them across the border, with 6 carriers. That&rsquo;s a logistics job. Sarah takes it off your plate.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0" }}>
                {plan.includes.map((t) => (
                  <li key={t} className="st-body" style={{ display: "flex", gap: 10, margin: "8px 0", fontSize: 15, color: "#fff" }}>
                    <Check size={18} color="#F0845B" strokeWidth={3} style={{ flex: "none", marginTop: 2 }} /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ borderRadius: "var(--radius-card)", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", padding: 24 }}>
              <div className="st-body" style={{ fontSize: 13.5, color: "rgba(255,255,255,.7)" }}>{plan.name}</div>
              <div className="st-display" style={{ fontSize: 30 }}>
                ${plan.monthly} <span className="st-body" style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,.7)" }}>/ month + shipping at our rates</span>
              </div>
              <div className="st-body" style={{ margin: "16px 0", padding: "14px 0", borderTop: "1px solid rgba(255,255,255,.14)", borderBottom: "1px solid rgba(255,255,255,.14)", fontSize: 15 }}>
                <div className="flex justify-between"><span style={{ color: "rgba(255,255,255,.7)" }}>Savings found</span><b>{money(company.savingsYear)}</b></div>
                <div className="flex justify-between" style={{ marginTop: 4 }}><span style={{ color: "rgba(255,255,255,.7)" }}>{plan.name} fee</span><b>−{money(fee)}</b></div>
                <div className="flex justify-between items-baseline" style={{ marginTop: 8 }}>
                  <span>You keep, every year</span>
                  <b className="st-display" style={{ fontSize: 24, color: "#F0845B" }}>{money(keep)}</b>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", marginTop: 2 }}>plus about {company.hoursPerMonth} hours a month back</div>
              </div>
              <Button onClick={onBook} full>Book a call with Sarah <ArrowRight size={17} /></Button>
              <div style={{ textAlign: "center", marginTop: 6 }}>
                <Button variant="ghostLight" onClick={() => setDiy(true)}>Just switch my rates (free)</Button>
              </div>
              {diy && (
                <p className="st-body" style={{ fontSize: 13, color: "rgba(255,255,255,.75)", margin: "4px 0 0", textAlign: "center" }}>
                  In the real product, the carrier switches are set up in your ShipTime account, and you can book Sarah any time.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...wrap, padding: "44px clamp(16px,4vw,40px) 64px" }}>
        <Kicker>Other ways to do it</Kicker>
        <div className="grid md:grid-cols-3" style={{ gap: 14, marginTop: 18 }}>
          {[
            { step: "Step 1", name: "ShipTime, do it yourself", big: "~$31,000", unit: "a year", body: "Free. You make the carrier switches yourself in the app. Audits are included. Customs stays with your team." },
            { step: "Step 2", name: plan.name, big: `~${money(Math.round(keep / 100) * 100)}`, unit: "a year, after the fee", body: "We do the work. Named advisor, customs, stuck parcels, audits, monthly report. Plus about 37 hours a month back.", rec: true },
            { step: "Step 3", name: "ShipTime One", big: "When you add a warehouse", unit: "", body: "We design and run your network: warehouses where your customers are, carriers per lane, your systems connected. Setup + monthly fee." },
          ].map((o) => (
            <div key={o.name} style={{ ...card, padding: 22, position: "relative", borderColor: o.rec ? "var(--brand)" : "var(--line)", boxShadow: o.rec ? "0 0 0 3px rgba(236,90,38,.10)" : "none" }}>
              {o.rec && <span style={{ position: "absolute", top: -12, left: 18 }}><Badge tone="ink">Recommended</Badge></span>}
              <div className="st-eyebrow" style={{ fontSize: 12, color: o.rec ? "var(--brand)" : "var(--ink-3)" }}>{o.step}</div>
              <div className="st-display" style={{ fontSize: 19, color: "var(--ink)", marginTop: 6 }}>{o.name}</div>
              <div className="st-display" style={{ fontSize: 22, color: "var(--ink)", margin: "8px 0 4px" }}>
                {o.big} {o.unit && <span className="st-body" style={{ fontSize: 13, fontWeight: 400, color: "var(--ink-3)" }}>{o.unit}</span>}
              </div>
              <p className="st-body" style={{ fontSize: 14, color: "var(--ink-3)", margin: 0, lineHeight: 1.55 }}>{o.body}</p>
            </div>
          ))}
        </div>
        <p className="st-body" style={{ fontSize: 13.5, color: "var(--ink-3)", borderTop: "1px solid var(--line)", paddingTop: 18, marginTop: 28, lineHeight: 1.6 }}>
          <b style={{ color: "var(--ink)" }}>How we did this.</b> We read {company.orders.toLocaleString("en-US")} orders from Jul 1 to Sep 30, 2026 and priced each one with 14 carriers for the same weight, address and delivery date, using ShipTime&rsquo;s live rates and our delivery data. AI did the first pass; {advisor.name} checked every finding and signed off on {advisor.signedOff}. Savings assume the same order volume and mix.
        </p>
      </section>
    </>
  );
}

// ── 4 · Book ─────────────────────────────────────────────────────────────────
function Book({ onBack, onConfirm }: { onBack: () => void; onConfirm: (slot: string) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <section style={{ maxWidth: 880, margin: "0 auto", padding: "28px clamp(16px,4vw,24px) 72px" }}>
      <Button variant="ghost" onClick={onBack}><ArrowLeft size={16} /> Back to the report</Button>
      <div style={{ ...card, padding: "clamp(22px,4vw,34px)", marginTop: 10 }}>
        <div className="flex items-center gap-4 flex-wrap">
          <Avatar size={64} />
          <div>
            <h2 className="st-display" style={{ fontSize: "clamp(1.5rem,2.6vw,2rem)", color: "var(--ink)", margin: 0 }}>Talk it through with Sarah</h2>
            <div className="st-body" style={{ color: "var(--ink-3)", fontSize: 14.5 }}>{advisor.name} · {advisor.role.toLowerCase()} · {advisor.bio} · 30 minutes, video or phone</div>
          </div>
        </div>
        <p className="st-body" style={{ color: "var(--ink-2)", margin: "18px 0 0" }}>She&rsquo;ll walk you through the four findings, answer questions, and if you want, set up your first week. No commitment.</p>
        <h3 className="st-display" style={{ fontSize: 18, color: "var(--ink)", margin: "24px 0 10px", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={18} /> Pick a time <span className="st-body" style={{ fontSize: 13, fontWeight: 400, color: "var(--ink-3)" }}>(Eastern)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 10 }}>
          {slots.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              className="st-body"
              style={{ borderRadius: 12, padding: 12, cursor: "pointer", fontSize: 14, textAlign: "center", border: "1.5px solid " + (sel === i ? "var(--brand)" : "var(--line)"), background: sel === i ? "#FFF4EF" : "var(--card)", color: "var(--ink)" }}
            >
              <b className="st-display" style={{ display: "block", fontSize: 14.5 }}>{s.day}</b>
              {s.time}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <Button disabled={sel === null} onClick={() => sel !== null && onConfirm(`${slots[sel].day} at ${slots[sel].time}`)}>Confirm the call</Button>
        </div>
      </div>
    </section>
  );
}

function Booked({ slot, onRestart }: { slot: string; onRestart: () => void }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "40px clamp(16px,4vw,24px) 72px" }}>
      <div style={{ ...card, padding: "clamp(24px,4vw,36px)", textAlign: "center" }}>
        <span style={{ width: 58, height: 58, borderRadius: "50%", background: "#EAF6F0", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={28} color="#1F8A5B" strokeWidth={3} />
        </span>
        <h2 className="st-display" style={{ fontSize: "clamp(1.5rem,2.8vw,2.1rem)", color: "var(--ink)", margin: "14px 0 0" }}>You&rsquo;re booked with Sarah, {slot}.</h2>
        <p className="st-body" style={{ color: "var(--ink-3)", margin: "10px 0 0" }}>The report is in your inbox, and Sarah has it open. Here&rsquo;s what happens if you go ahead:</p>
      </div>
      <div style={{ ...card, padding: "6px 24px", marginTop: 14 }}>
        {firstMonth.map((m, i) => (
          <div key={m.when} className="st-body" style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < firstMonth.length - 1 ? "1px solid var(--line)" : "none", fontSize: 15, color: "var(--ink)" }}>
            <span className="st-display" style={{ width: 84, flex: "none", color: "var(--brand)", fontSize: 15 }}>{m.when}</span>
            <span>{m.what}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Button variant="secondary" onClick={onRestart}><Sparkles size={16} /> Start over</Button>
      </div>
    </section>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function ShippingCheck() {
  const [screen, setScreen] = useState<Screen>("connect");
  const [run, setRun] = useState(0);
  const [slot, setSlot] = useState("");
  const go = (s: Screen) => {
    if (s === "analyze") setRun((r) => r + 1);
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };
  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh", color: "var(--ink)" }}>
      <TopBar screen={screen} go={go} />
      <AnimatePresence mode="wait">
        <motion.main key={screen} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {screen === "connect" && <Connect onStart={() => go("analyze")} />}
          {screen === "analyze" && <Analyze key={run} onDone={() => go("report")} />}
          {screen === "report" && <Report onBook={() => go("book")} />}
          {screen === "book" && <Book onBack={() => go("report")} onConfirm={(s) => { setSlot(s); go("booked"); }} />}
          {screen === "booked" && <Booked slot={slot} onRestart={() => go("connect")} />}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
