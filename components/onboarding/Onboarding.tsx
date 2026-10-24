"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Sparkles,
} from "lucide-react";
import { money, plans, questions, recommend, savingsEstimate, slots, type Answers, type PlanId } from "./data";
import Dashboard from "./Dashboard";

// ── Onboarding mockup ────────────────────────────────────────────────────────
// The classic SaaS play, copied from what works (Shippo's short signup with
// questions right after, ShipStation's required volume bands, Shopify's
// answer-driven setup cards, Pirate Ship's no-card start, EasyPost's free test
// label) plus what nobody does: a savings number from the answers, a person in
// the flow, partner rates on signup. A side mockup on sample data, in the
// ShipTime One tokens (data-zone="plus"). Nothing here touches the real app.

type Screen = "pricing" | "signup" | "questions" | "plan" | "app" | "sales" | "salesDone";

const card: CSSProperties = { background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--radius-card)" };
const wash = "linear-gradient(135deg, #FFFFFF 0%, var(--surface-2) 55%, var(--surface) 100%)";
const GREEN = "#1F8A5B";
const PARTNERS: Record<string, string> = { cfib: "CFIB", costco: "Costco" };

function Button({ children, onClick, variant = "primary", disabled, full, small }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "dark" | "ghost"; disabled?: boolean; full?: boolean; small?: boolean }) {
  const looks: Record<string, CSSProperties> = {
    primary: { background: "var(--brand)", color: "#fff", boxShadow: disabled ? "none" : "0 8px 20px rgba(236,90,38,.22)" },
    secondary: { background: "var(--card)", color: "var(--ink)", borderColor: "var(--line)" },
    dark: { background: "var(--ink)", color: "#fff" },
    ghost: { background: "transparent", color: "var(--ink-2)", padding: "8px 4px" },
  };
  return (
    <button
      type="button"
      className="st-cta"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: "var(--radius-pill)",
        padding: small ? "9px 16px" : "13px 24px", fontSize: small ? 13.5 : 15, fontWeight: 700, fontFamily: "var(--font-label)",
        border: "1.5px solid transparent", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, width: full ? "100%" : undefined,
        ...looks[variant],
      }}
    >
      {children}
    </button>
  );
}

function Badge({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "green" | "ink" | "blue" }) {
  const t: Record<string, CSSProperties> = {
    brand: { background: "#FFF4EF", color: "var(--brand)" },
    green: { background: "#EAF6F0", color: GREEN },
    ink: { background: "var(--ink)", color: "#fff" },
    blue: { background: "var(--surface-2)", color: "var(--brand-2)" },
  };
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999, fontFamily: "var(--font-label)", whiteSpace: "nowrap", ...t[tone] }}>{children}</span>;
}

function Logo({ height = 28 }: { height?: number }) {
  return <img src="/shiptime-logo.svg" alt="ShipTime" width={130} height={40} style={{ height, width: "auto", display: "block" }} />;
}

function Banner() {
  return (
    <div style={{ background: "var(--ink)", color: "rgba(255,255,255,.8)", fontSize: 12.5, textAlign: "center", padding: "7px 16px" }}>
      Mockup · <b style={{ color: "#F0845B" }}>sample data, illustrative prices</b> · the ShipTime signup and onboarding flow
    </div>
  );
}

// ── Pricing ──────────────────────────────────────────────────────────────────
function Pricing({ onPick }: { onPick: (p: PlanId) => void }) {
  const [annual, setAnnual] = useState(false);
  return (
    <>
      <header style={{ background: "var(--card)", borderBottom: "1px solid var(--line)" }}>
        <div className="flex items-center gap-6" style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)", height: 68 }}>
          <Logo />
          <nav className="hidden md:flex st-body" style={{ gap: 22, fontSize: 14.5, fontWeight: 600, color: "var(--ink-2)" }}>
            <span>Product</span><span>Carriers</span><span style={{ color: "var(--ink)" }}>Pricing</span><span>Partners</span>
          </nav>
          <div className="flex items-center gap-3" style={{ marginLeft: "auto" }}>
            <span className="st-body hidden sm:inline" style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-2)" }}>Log in</span>
            <Button small onClick={() => onPick("free")}>Start free</Button>
          </div>
        </div>
      </header>
      <section style={{ background: wash, borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "clamp(44px,6vw,76px) clamp(16px,4vw,40px) clamp(36px,5vw,56px)", textAlign: "center" }}>
          <p className="st-eyebrow" style={{ fontSize: 12.5, margin: 0 }}>Pricing</p>
          <h1 className="st-display" style={{ fontSize: "clamp(2.3rem,5vw,3.8rem)", color: "var(--ink)", margin: "14px auto 0", maxWidth: "18ch" }}>Start free. Grow into a logistics team.</h1>
          <p className="st-body" style={{ fontSize: "clamp(1rem,1.3vw,1.15rem)", color: "var(--ink-2)", fontWeight: 500, maxWidth: "56ch", margin: "16px auto 0", lineHeight: 1.6 }}>
            No credit card to start. Not sure which plan? Answer a few quick questions after you sign up and we&rsquo;ll recommend one.
          </p>
          <div className="inline-flex" style={{ marginTop: 24, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 999, padding: 4 }}>
            {["Monthly", "Yearly · save 12%"].map((l, i) => (
              <button key={l} type="button" onClick={() => setAnnual(i === 1)} className="st-body" style={{ border: 0, cursor: "pointer", borderRadius: 999, padding: "8px 16px", fontSize: 13.5, fontWeight: 700, background: annual === (i === 1) ? "var(--ink)" : "transparent", color: annual === (i === 1) ? "#fff" : "var(--ink-2)" }}>{l}</button>
            ))}
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "36px clamp(16px,4vw,40px) 72px" }}>
        <div className="grid lg:grid-cols-3" style={{ gap: 16 }}>
          {plans.map((p) => {
            const hot = p.id === "team";
            return (
              <div key={p.id} style={{ ...card, padding: 26, position: "relative", display: "flex", flexDirection: "column", borderColor: hot ? "var(--brand)" : "var(--line)", boxShadow: hot ? "0 0 0 3px rgba(236,90,38,.10), 0 18px 40px rgba(28,30,61,.08)" : "none" }}>
                {hot && <span style={{ position: "absolute", top: -12, left: 22 }}><Badge tone="ink">Most popular with growing businesses</Badge></span>}
                <div className="st-display" style={{ fontSize: 22, color: "var(--ink)" }}>{p.name}</div>
                <div className="st-body" style={{ fontSize: 14, color: "var(--ink-3)" }}>{p.forWho}</div>
                <div className="st-display" style={{ fontSize: 40, color: "var(--ink)", marginTop: 16 }}>
                  {annual ? p.price.annual : p.price.monthly}
                  {p.id === "team" && <span className="st-body" style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-3)" }}> /mo</span>}
                </div>
                <div className="st-body" style={{ fontSize: 13.5, color: "var(--ink-3)", minHeight: 22 }}>{p.price.note}{p.id === "team" && annual ? ", billed yearly" : ""}</div>
                <div style={{ margin: "18px 0" }}>
                  <Button full variant={hot ? "primary" : p.id === "one" ? "dark" : "secondary"} onClick={() => onPick(p.id)}>{p.cta} <ArrowRight size={16} /></Button>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 9 }}>
                  {p.features.map((f) => (
                    <li key={f} className="st-body" style={{ display: "flex", gap: 10, fontSize: 14.5, color: "var(--ink)" }}>
                      <Check size={17} color={hot ? "var(--brand)" : GREEN} strokeWidth={3} style={{ flex: "none", marginTop: 2 }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="st-body" style={{ textAlign: "center", fontSize: 14, color: "var(--ink-3)", marginTop: 22 }}>
          CFIB and Costco members get their member rates on every plan, applied when you sign up with your member link.
        </p>
      </section>
    </>
  );
}

// ── Signup ───────────────────────────────────────────────────────────────────
function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <label className="st-body" style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)" }}>
      {label}
      <input defaultValue={value} type={type} className="st-body" style={{ display: "block", width: "100%", marginTop: 6, padding: "12px 14px", fontSize: 15, borderRadius: 12, border: "1.5px solid var(--line)", background: "#fff", color: "var(--ink)", outline: "none" }} />
    </label>
  );
}

function Signup({ partner, chosen, onDone, onBack }: { partner: string | null; chosen: PlanId; onDone: () => void; onBack: () => void }) {
  return (
    <div className="grid lg:grid-cols-2" style={{ minHeight: "calc(100vh - 32px)" }}>
      <div style={{ padding: "clamp(24px,5vw,64px)", display: "flex", flexDirection: "column" }}>
        <div className="flex items-center justify-between"><Logo /><Button variant="ghost" small onClick={onBack}><ArrowLeft size={15} /> Pricing</Button></div>
        <div style={{ maxWidth: 420, width: "100%", margin: "auto", paddingTop: 32 }}>
          <h1 className="st-display" style={{ fontSize: "clamp(2rem,3.6vw,2.6rem)", color: "var(--ink)", margin: 0 }}>Create your account</h1>
          <p className="st-body" style={{ color: "var(--ink-3)", margin: "8px 0 22px" }}>
            {chosen === "team" ? "Your 14-day Team trial starts now. " : ""}Free to start, no credit card.
          </p>
          {partner && (
            <div style={{ ...card, padding: "12px 14px", marginBottom: 16, background: "#EAF6F0", borderColor: "#CBE9D9" }} className="st-body">
              <b style={{ color: GREEN }}>✓ {partner} member rates applied.</b> <span style={{ color: "var(--ink-2)", fontSize: 14 }}>You&rsquo;ll see them on every quote.</span>
            </div>
          )}
          <button type="button" className="st-body" onClick={onDone} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid var(--line)", background: "#fff", fontSize: 15, fontWeight: 600, color: "var(--ink)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontWeight: 800, color: "#4285F4" }}>G</span> Continue with Google
          </button>
          <div className="st-body" style={{ textAlign: "center", fontSize: 13, color: "var(--ink-3)", margin: "16px 0" }}>or</div>
          <div style={{ display: "grid", gap: 14 }}>
            <Field label="Work email" value="emma@mapleandco.ca" type="email" />
            <Field label="Password" value="••••••••••" type="password" />
          </div>
          <div style={{ marginTop: 20 }}><Button full onClick={onDone}>Create account <ArrowRight size={16} /></Button></div>
          <p className="st-body" style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 14, textAlign: "center" }}>
            By signing up you agree to the Terms and Privacy Policy. {partner ? "" : "Member of CFIB or Costco? Use your member link to get your rates."}
          </p>
        </div>
      </div>
      <div className="hidden lg:flex" style={{ background: "linear-gradient(135deg, var(--ink) 0%, #2A2D58 100%)", color: "#fff", padding: 64, flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1.4px, transparent 2px)", backgroundSize: "14px 14px" }} />
        <div style={{ position: "relative", maxWidth: 460 }}>
          <p className="st-eyebrow" style={{ fontSize: 12.5, color: "rgba(255,255,255,.7)", margin: 0 }}>What you get in the next 5 minutes</p>
          <h2 className="st-display" style={{ fontSize: "clamp(1.8rem,2.8vw,2.4rem)", margin: "14px 0 24px" }}>Every carrier, one place, one bill.</h2>
          {[
            ["Compare every carrier", "Canada Post, Purolator, UPS, FedEx, Canpar and more, side by side."],
            ["Print a free test label", "See exactly how it works before you spend a cent."],
            ["Get your savings estimate", "Tell us how you ship and we show what you could save."],
            ["Talk to a person", "Growing fast? Book 15 minutes with a logistics advisor, right from your account."],
          ].map(([t, b]) => (
            <div key={t} className="st-body" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(240,132,91,.18)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Check size={15} color="#F0845B" strokeWidth={3} /></span>
              <span><b>{t}</b><br /><span style={{ color: "rgba(255,255,255,.72)", fontSize: 14.5 }}>{b}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Questions ────────────────────────────────────────────────────────────────
function Questions({ answers, setAnswers, onDone }: { answers: Answers; setAnswers: (a: Answers) => void; onDone: () => void }) {
  const [i, setI] = useState(0);
  const q = questions[i];
  const value = answers[q.id];
  const picked = (id: string) => (Array.isArray(value) ? value.includes(id) : value === id);
  const toggle = (id: string) => {
    if (q.multi) {
      const arr = (answers[q.id] as string[]) ?? [];
      setAnswers({ ...answers, [q.id]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] });
    } else setAnswers({ ...answers, [q.id]: id });
  };
  const ready = q.multi ? ((value as string[]) ?? []).length > 0 : !!value;
  const next = () => (i < questions.length - 1 ? setI(i + 1) : onDone());
  return (
    <div style={{ minHeight: "calc(100vh - 32px)", background: "var(--surface)" }}>
      <div className="flex items-center justify-between" style={{ padding: "18px clamp(16px,4vw,40px)" }}>
        <Logo height={26} />
        <span className="st-body" style={{ fontSize: 13.5, color: "var(--ink-3)" }}>Step {i + 1} of {questions.length}</span>
      </div>
      <div style={{ height: 4, background: "var(--line)" }}><div style={{ height: "100%", width: `${((i + 1) / questions.length) * 100}%`, background: "var(--brand)", transition: "width .3s" }} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }} style={{ maxWidth: 640, margin: "0 auto", padding: "clamp(36px,7vw,72px) clamp(16px,4vw,24px)" }}>
          <h1 className="st-display" style={{ fontSize: "clamp(1.9rem,4vw,2.6rem)", color: "var(--ink)", margin: 0 }}>{q.title}</h1>
          <p className="st-body" style={{ color: "var(--ink-3)", margin: "10px 0 24px" }}>{q.why}{q.multi ? " Pick all that apply." : ""}</p>
          <div style={{ display: "grid", gap: 10 }}>
            {q.options.map((o) => {
              const on = picked(o.id);
              return (
                <button key={o.id} type="button" onClick={() => toggle(o.id)} style={{ ...card, padding: "15px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", borderColor: on ? "var(--brand)" : "var(--line)", background: on ? "#FFF8F4" : "var(--card)", boxShadow: on ? "0 0 0 3px rgba(236,90,38,.10)" : "none" }}>
                  <span style={{ width: 22, height: 22, borderRadius: q.multi ? 6 : "50%", border: `2px solid ${on ? "var(--brand)" : "var(--line)"}`, background: on ? "var(--brand)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{on && <Check size={13} color="#fff" strokeWidth={3.5} />}</span>
                  <span className="st-body">
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{o.label}</span>
                    {o.hint && <span style={{ display: "block", fontSize: 13.5, color: "var(--ink-3)" }}>{o.hint}</span>}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: 26 }}>
            {i > 0 ? <Button variant="ghost" onClick={() => setI(i - 1)}><ArrowLeft size={15} /> Back</Button> : <span />}
            <div className="flex items-center gap-4">
              <button type="button" onClick={next} className="st-body" style={{ border: 0, background: "none", color: "var(--ink-3)", fontSize: 14, cursor: "pointer" }}>Skip</button>
              <Button onClick={next} disabled={!ready}>{i < questions.length - 1 ? "Continue" : "See my setup"} <ArrowRight size={16} /></Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Recommended plan ─────────────────────────────────────────────────────────
function PlanPick({ answers, onChoose }: { answers: Answers; onChoose: (p: PlanId) => void }) {
  const rec = recommend(answers);
  const save = savingsEstimate(answers);
  const order: PlanId[] = ["free", "team", "one"];
  return (
    <div style={{ minHeight: "calc(100vh - 32px)", background: wash }}>
      <div style={{ padding: "18px clamp(16px,4vw,40px)" }}><Logo height={26} /></div>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(20px,4vw,48px) clamp(16px,4vw,40px) 72px" }}>
        <p className="st-eyebrow" style={{ fontSize: 12.5, margin: 0, textAlign: "center" }}>Your setup</p>
        <h1 className="st-display" style={{ fontSize: "clamp(2rem,4.4vw,3.2rem)", color: "var(--ink)", margin: "12px auto 0", textAlign: "center", maxWidth: "20ch" }}>
          We recommend {plans.find((p) => p.id === rec.plan)!.name}.
        </h1>
        <ul className="st-body" style={{ listStyle: "none", padding: 0, margin: "18px auto 0", maxWidth: 560, display: "grid", gap: 6 }}>
          {rec.reasons.map((r) => (
            <li key={r} style={{ display: "flex", gap: 10, justifyContent: "center", color: "var(--ink-2)", fontWeight: 500 }}><Check size={18} color={GREEN} strokeWidth={3} style={{ flex: "none", marginTop: 3 }} /> {r}</li>
          ))}
        </ul>
        {save > 0 && (
          <div style={{ ...card, maxWidth: 560, margin: "22px auto 0", padding: "14px 18px", display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: "#EAF6F0", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Sparkles size={19} color={GREEN} /></span>
            <span className="st-body" style={{ fontSize: 14.5, color: "var(--ink-2)" }}>
              Shippers like you save <b style={{ color: "var(--ink)" }}>up to about {money(save)} a year</b>{" "}with us. Connect your store and we&rsquo;ll give you the exact number.
            </span>
          </div>
        )}
        <div className="grid md:grid-cols-3" style={{ gap: 14, marginTop: 30 }}>
          {order.map((id) => {
            const p = plans.find((x) => x.id === id)!;
            const on = id === rec.plan;
            return (
              <div key={id} style={{ ...card, padding: 22, position: "relative", borderColor: on ? "var(--brand)" : "var(--line)", boxShadow: on ? "0 0 0 3px rgba(236,90,38,.12), 0 18px 40px rgba(28,30,61,.08)" : "none", opacity: on ? 1 : 0.92 }}>
                {on && <span style={{ position: "absolute", top: -12, left: 18 }}><Badge tone="ink">Recommended for you</Badge></span>}
                <div className="st-display" style={{ fontSize: 20, color: "var(--ink)" }}>{p.name}</div>
                <div className="st-display" style={{ fontSize: 28, color: "var(--ink)", margin: "8px 0 2px" }}>{p.price.monthly}{id === "team" && <span className="st-body" style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-3)" }}> /mo</span>}</div>
                <div className="st-body" style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 16 }}>{p.price.note}</div>
                <Button full small variant={on ? "primary" : "secondary"} onClick={() => onChoose(id)}>{p.cta}</Button>
              </div>
            );
          })}
        </div>
        <p className="st-body" style={{ textAlign: "center", fontSize: 13.5, color: "var(--ink-3)", marginTop: 18 }}>You can change plan any time. Team trials end without charge unless you add a card.</p>
      </div>
    </div>
  );
}

// ── Sales (ShipTime One) ─────────────────────────────────────────────────────
function Sales({ answers, onBooked, onBack }: { answers: Answers; onBooked: (slot: string) => void; onBack: () => void }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div style={{ minHeight: "calc(100vh - 32px)", background: wash }}>
      <div className="flex items-center justify-between" style={{ padding: "18px clamp(16px,4vw,40px)" }}><Logo height={26} /><Button variant="ghost" small onClick={onBack}><ArrowLeft size={15} /> Back</Button></div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(16px,4vw,40px) clamp(16px,4vw,24px) 72px" }}>
        <p className="st-eyebrow" style={{ fontSize: 12.5, margin: 0 }}>ShipTime One</p>
        <h1 className="st-display" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", color: "var(--ink)", margin: "12px 0 0" }}>Let&rsquo;s look at your network together.</h1>
        <p className="st-body" style={{ color: "var(--ink-2)", fontWeight: 500, margin: "12px 0 22px", maxWidth: "60ch" }}>A 45-minute network review with our team. Send us one month of shipping data first, and we come back with what you could save, where your warehouses should be, and how fast you could deliver.</p>
        <div style={{ ...card, padding: "clamp(20px,3vw,28px)" }}>
          <div className="grid md:grid-cols-2" style={{ gap: 14 }}>
            <Field label="Company" value="Maple & Co. Outdoor" />
            <Field label="Warehouses today" value={answers.role === "locations" ? "3 (Toronto, Montreal, Calgary)" : "1"} />
            <Field label="Parcels a month" value={answers.volume === "2000+" ? "More than 2,000" : "500 to 2,000"} />
            <Field label="Where orders come from" value={answers.sources.includes("erp") ? "NetSuite" : "Shopify"} />
          </div>
          <div className="st-body" style={{ marginTop: 16, padding: "14px 16px", borderRadius: 12, border: "1.5px dashed var(--line)", color: "var(--ink-3)", fontSize: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <Building2 size={18} /> Drop one month of shipping data or carrier invoices here (CSV, PDF). Optional, but it makes the review twice as useful.
          </div>
          <h3 className="st-display" style={{ fontSize: 17, color: "var(--ink)", margin: "22px 0 10px" }}>Pick a time</h3>
          <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 10 }}>
            {slots.map((s, i) => (
              <button key={i} type="button" onClick={() => setSel(i)} className="st-body" style={{ borderRadius: 12, padding: 12, cursor: "pointer", fontSize: 14, border: `1.5px solid ${sel === i ? "var(--brand)" : "var(--line)"}`, background: sel === i ? "#FFF4EF" : "#fff", color: "var(--ink)" }}>
                <b style={{ display: "block" }}>{s.day}</b>{s.time}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20 }}><Button disabled={sel === null} onClick={() => sel !== null && onBooked(`${slots[sel].day} at ${slots[sel].time}`)}>Book the network review</Button></div>
        </div>
      </div>
    </div>
  );
}

function SalesDone({ slot, onRestart }: { slot: string; onRestart: () => void }) {
  return (
    <div style={{ minHeight: "calc(100vh - 32px)", background: wash, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...card, maxWidth: 560, padding: 32, textAlign: "center" }}>
        <span style={{ width: 56, height: 56, borderRadius: "50%", background: "#EAF6F0", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check size={26} color={GREEN} strokeWidth={3} /></span>
        <h2 className="st-display" style={{ fontSize: 28, color: "var(--ink)", margin: "14px 0 8px" }}>Your network review is booked.</h2>
        <p className="st-body" style={{ color: "var(--ink-2)" }}>{slot}. Our network team looks at your data before the call, so the 45 minutes are about your answers, not our slides. Meanwhile your ShipTime account is open: you can start shipping today.</p>
        <div style={{ marginTop: 18 }}><Button variant="secondary" onClick={onRestart}>Start over</Button></div>
      </div>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function Onboarding({ partnerRef }: { partnerRef?: string }) {
  const [screen, setScreen] = useState<Screen>("pricing");
  const [chosen, setChosen] = useState<PlanId>("free");
  const [plan, setPlan] = useState<PlanId>("free");
  const [answers, setAnswers] = useState<Answers>({ ships: [], sources: [] });
  const partner = PARTNERS[partnerRef?.toLowerCase() ?? ""] ?? null;
  const [slot, setSlot] = useState("");
  const go = (s: Screen) => { setScreen(s); window.scrollTo({ top: 0 }); };
  const restart = () => { setAnswers({ ships: [], sources: [] }); setPlan("free"); setChosen("free"); go("pricing"); };
  return (
    <div style={{ background: "var(--surface)", minHeight: "100vh", color: "var(--ink)" }}>
      <Banner />
      <AnimatePresence mode="wait">
        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          {screen === "pricing" && <Pricing onPick={(p) => { if (p === "one") { setAnswers({ ...answers, role: "locations", volume: "2000+" }); go("sales"); } else { setChosen(p); go("signup"); } }} />}
          {screen === "signup" && <Signup partner={partner} chosen={chosen} onBack={() => go("pricing")} onDone={() => go("questions")} />}
          {screen === "questions" && <Questions answers={answers} setAnswers={setAnswers} onDone={() => go("plan")} />}
          {screen === "plan" && <PlanPick answers={answers} onChoose={(p) => { if (p === "one") go("sales"); else { setPlan(p); go("app"); } }} />}
          {screen === "app" && <Dashboard answers={answers} plan={plan} setPlan={setPlan} partner={partner} />}
          {screen === "sales" && <Sales answers={answers} onBack={() => go("pricing")} onBooked={(s) => { setSlot(s); go("salesDone"); }} />}
          {screen === "salesDone" && <SalesDone slot={slot} onRestart={restart} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
