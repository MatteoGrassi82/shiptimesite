"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { K, mono, PAGES, sans, title } from "./koherent-brand";

const box: CSSProperties = { background: K.card, border: `1px solid ${K.line}`, borderRadius: 12, boxShadow: "0 1px 2px rgba(23,16,28,0.04), 0 18px 40px -28px rgba(23,16,28,0.28)" };

// ── The savings calculator on /koherent/pricing ──────────────────────────────
// Pelago's pattern (pelagohealth.com/pricing, Matteo, Nov 16): a few
// questions, one at a time, every default saying where it comes from, then
// the estimate. Only numbers we can stand behind: the cross-border figure is
// the golf brand's proposal ($25.00 → $13.22 a shipment, proposed, not yet
// realized, already on the site); the rate saving is an assumption the
// visitor can move, labelled as one. No fee figures: the enterprise fee is
// scoped in the audit. Nothing entered leaves the browser.

type Who = "growing" | "enterprise" | "partner";

const CROSS_BORDER_CUT = 1 - 13.22 / 25; // the golf brand's proposal, ≈47%

const DEFAULTS: Record<Exclude<Who, "partner">, { orders: number; cost: number; cross: number; stock: boolean }> = {
  growing: { orders: 1500, cost: 11, cross: 5, stock: false },
  enterprise: { orders: 12000, cost: 13, cross: 5, stock: false },
};

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const cents = (n: number) => "$" + n.toFixed(2);

export function SavingsCalculator() {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<Who>("growing");
  const [orders, setOrders] = useState(DEFAULTS.growing.orders);
  const [cost, setCost] = useState(DEFAULTS.growing.cost);
  const [cross, setCross] = useState(DEFAULTS.growing.cross);
  const [stock, setStock] = useState(DEFAULTS.growing.stock);
  const [rate, setRate] = useState(10);

  const pick = (w: Who) => {
    setWho(w);
    if (w !== "partner") {
      const d = DEFAULTS[w];
      setOrders(d.orders);
      setCost(d.cost);
      setCross(d.cross);
      setStock(d.stock);
    }
  };

  const yearOrders = orders * 12;
  const today = yearOrders * cost;
  const domestic = yearOrders * (1 - cross / 100) * cost * (rate / 100);
  const border = yearOrders * (cross / 100) * cost * (stock ? CROSS_BORDER_CUT : rate / 100);
  const saved = domestic + border;
  const after = (today - saved) / yearOrders;

  const steps = who === "partner" ? 1 : 5;
  const last = step === steps;

  return (
    <div className="k-calc" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)", gap: 24, alignItems: "stretch" }}>
      {/* the questions, one at a time */}
      <div style={{ ...box, padding: "clamp(22px, 3vw, 34px)", display: "flex", flexDirection: "column", minHeight: 420 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ ...mono, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: K.violet }}>Savings calculator</span>
          <span style={{ ...mono, fontSize: 12, color: K.stone }}>
            {Math.min(step + 1, steps + 1)} / {steps + 1}
          </span>
        </div>
        <div aria-hidden style={{ height: 4, background: K.mist, borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
          <div style={{ width: `${((step + 1) / (steps + 1)) * 100}%`, height: "100%", background: K.plum, borderRadius: 99, transition: "width .35s ease" }} />
        </div>

        <div style={{ flex: 1, marginTop: 26 }}>
          {step === 0 && (
            <Q title="Who are you?" note="Pick the one closest to your business.">
              <div className="k-calc-who" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                {(
                  [
                    ["growing", "Growing brand", "500 to 5,000 orders a month"],
                    ["enterprise", "Enterprise brand", "More than one site, or 5,000+ orders"],
                    ["partner", "3PL partner", "You run a warehouse"],
                  ] as [Who, string, string][]
                ).map(([k, name, line]) => (
                  <button key={k} type="button" onClick={() => pick(k)} aria-pressed={who === k} style={{ ...sans, textAlign: "left", cursor: "pointer", borderRadius: 10, padding: "16px 16px 14px", border: `1.5px solid ${who === k ? K.plum : K.line}`, background: who === k ? K.mist : K.card }}>
                    <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, color: K.ink }}>{name}</span>
                    <span style={{ display: "block", fontSize: 13.5, lineHeight: 1.45, color: K.stone, marginTop: 6 }}>{line}</span>
                  </button>
                ))}
              </div>
            </Q>
          )}

          {who === "partner" && step === 1 && (
            <Q title="Joining is free." note="There’s nothing to calculate up front: you don’t pay us anything to join the network.">
              <p style={{ ...sans, fontSize: 16, lineHeight: 1.6, color: K.ink, margin: 0 }}>
                You earn on every order you fulfill and on every label you ship, and the shipping margin alone typically makes up the majority of partner revenue. A partner lead walks you through the numbers for your region.
              </p>
              <a href={PAGES.partners} className="k-more" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, marginTop: 18, fontSize: 15, fontWeight: 700, color: K.plum, textDecoration: "none" }}>
                What partners get <ArrowRight size={15} />
              </a>
            </Q>
          )}

          {who !== "partner" && step === 1 && (
            <Q title="How many orders do you ship a month?" note={who === "growing" ? "Default: 1,500, the middle of our growing-brand range." : "Default: 12,000 a month, a typical multi-site brand."}>
              <Slider value={orders} min={100} max={50000} step={100} onChange={setOrders} format={(v) => v.toLocaleString("en-US")} unit="orders a month" />
            </Q>
          )}

          {who !== "partner" && step === 2 && (
            <Q title="What does shipping cost you per order today?" note="Your average label cost per order, surcharges included. Your last carrier invoice has it.">
              <Slider value={cost} min={4} max={40} step={0.5} onChange={setCost} format={cents} unit="per order" />
            </Q>
          )}

          {who !== "partner" && step === 3 && (
            <Q title="How many of your orders cross the border?" note="US orders going to Canada, or Canadian orders going to the US.">
              <Slider value={cross} min={0} max={100} step={1} onChange={setCross} format={(v) => `${v}%`} unit="of orders" />
              <label style={{ ...sans, display: "flex", alignItems: "flex-start", gap: 10, marginTop: 22, fontSize: 15, lineHeight: 1.5, color: K.ink, cursor: "pointer" }}>
                <input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} style={{ marginTop: 4, accentColor: K.plum }} />
                <span>
                  Keep stock on the other side of the border
                  <span style={{ display: "block", fontSize: 13.5, color: K.stone, marginTop: 2 }}>Ship those orders domestically from a partner warehouse instead of across the border.</span>
                </span>
              </label>
            </Q>
          )}

          {who !== "partner" && step === 4 && (
            <Q title="One assumption to check." note="This is our assumption, not a promise. The free audit replaces it with the number from your own invoices.">
              <Slider value={rate} min={0} max={25} step={1} onChange={setRate} format={(v) => `${v}%`} unit="saved on each domestic order" />
              <p style={{ ...sans, fontSize: 13.5, lineHeight: 1.55, color: K.stone, margin: "16px 0 0" }}>
                Where it comes from: our rates next to yours on every order, regional carriers where they’re cheaper for the same days, and invoice adjustments disputed for you. Default 10%.
              </p>
            </Q>
          )}

          {who !== "partner" && step === 5 && (
            <Q title="Your estimate." note="Move back through the questions to try other numbers.">
              <p style={{ ...sans, fontSize: 16, lineHeight: 1.6, color: K.ink, margin: 0 }}>
                {who === "growing"
                  ? "Growing brands pay no monthly platform fee and make no volume commitment, so this is what stays with you."
                  : "Enterprise pricing is a platform subscription plus a per-label fee, scoped to your volume and locations in a free shipping audit. Most start with a pilot."}
              </p>
              <a href={PAGES.contact} className="k-btn" style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, marginTop: 22, fontSize: 15.5, fontWeight: 700, color: K.paper, background: K.plum, borderRadius: 6, padding: "14px 22px", textDecoration: "none" }}>
                {who === "growing" ? "Get a 15-minute rate comparison" : "Book your free shipping audit"} <ArrowRight size={16} />
              </a>
            </Q>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 26 }}>
          <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 700, color: step === 0 ? K.line : K.ink, background: "none", border: "none", cursor: step === 0 ? "default" : "pointer", padding: 0 }}>
            <ArrowLeft size={16} /> Back
          </button>
          {!last && (
            <button type="button" onClick={() => setStep(step + 1)} style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 15.5, fontWeight: 700, color: K.paper, background: K.plum, border: "none", borderRadius: 6, padding: "12px 20px", cursor: "pointer" }}>
              {step === steps - 1 && who !== "partner" ? "See my estimate" : "Next"} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* the estimate, live as the answers change */}
      <div data-k-dark="" style={{ background: K.ink, borderRadius: 12, padding: "clamp(22px, 3vw, 34px)", color: K.onDark, display: "flex", flexDirection: "column" }}>
        <span style={{ ...mono, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: K.lilac }}>{who === "partner" ? "To join" : "Estimated savings"}</span>
        {who === "partner" ? (
          <>
            <span style={{ ...mono, fontSize: "clamp(2.6rem, 5vw, 3.6rem)", fontWeight: 500, lineHeight: 1, margin: "18px 0 0" }}>$0</span>
            <span style={{ ...sans, fontSize: 15, color: K.onDarkDim, marginTop: 8 }}>No cost to join the network.</span>
          </>
        ) : (
          <>
            <span style={{ ...mono, fontSize: "clamp(2.6rem, 5vw, 3.6rem)", fontWeight: 500, lineHeight: 1, margin: "18px 0 0", fontVariantNumeric: "tabular-nums" }}>{money(saved)}</span>
            <span style={{ ...sans, fontSize: 15, color: K.onDarkDim, marginTop: 8 }}>a year, on {money(today)} of shipping today</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: K.darkLine, borderRadius: 8, overflow: "hidden", marginTop: 26 }}>
              <Cell label="Per order today" value={cents(cost)} />
              <Cell label="Per order, estimated" value={cents(after)} strong />
              <Cell label="Domestic orders" value={money(domestic)} />
              <Cell label={stock ? "Cross-border, stocked locally" : "Cross-border orders"} value={money(border)} />
            </div>
          </>
        )}
        <p style={{ ...sans, fontSize: 13, lineHeight: 1.55, color: K.onDarkDim, margin: "auto 0 0", paddingTop: 22 }}>
          An estimate from your answers, not a quote. Nothing you enter here is stored or sent anywhere.
        </p>
      </div>
      <style>{`
        @media (max-width: 900px) { .k-calc { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .k-calc-who { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Q({ title: t, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div>
      <h3 style={{ ...title, fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)", color: K.ink, margin: 0 }}>{t}</h3>
      {note && <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.55, color: K.stone, margin: "8px 0 22px" }}>{note}</p>}
      {children}
    </div>
  );
}

function Slider({ value, min, max, step, onChange, format, unit }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string; unit: string }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ ...mono, fontSize: "clamp(2rem, 3.6vw, 2.6rem)", fontWeight: 500, color: K.plum, fontVariantNumeric: "tabular-nums" }}>{format(value)}</span>
        <span style={{ ...sans, fontSize: 15, color: K.stone }}>{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={unit} style={{ width: "100%", marginTop: 14, accentColor: K.plum } as CSSProperties} />
      <div style={{ ...mono, display: "flex", justifyContent: "space-between", fontSize: 11.5, color: K.stone, marginTop: 4 }}>
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function Cell({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ background: K.ink, padding: "14px 16px" }}>
      <span style={{ ...mono, display: "block", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: K.lilac }}>{label}</span>
      <span style={{ ...mono, display: "block", fontSize: 20, fontWeight: 500, marginTop: 6, color: strong ? K.onDark : K.onDarkDim, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}
