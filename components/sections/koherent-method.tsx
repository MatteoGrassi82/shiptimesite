"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { C, Chevrons, K_ARROW, K_BAR, Label, mono, sans, title, useInView, useReducedMotion } from "./koherent-motion";

// ── MethodPlayer — "How we work" ─────────────────────────────────────────────
// Chris's six steps, each shown as what the customer gets from it: a small
// product screen per step instead of a photo. Matteo picked this on Oct 23 out
// of three ideas on /koherent/lab; the photos were AI placeholders, and the
// deck rules out AI images shown as real operations. Autoplays while on
// screen; picking a step stops it.
//
// The screens use the /dashboard mockup's example account, Alder & Stone
// (components/console/scenarios.ts): Columbus and Reno live, Memphis going
// live Nov 25; 18,240 orders a month; cost per order $12.30 → $11.21; on time
// 95.6% → 96.4%; within 2 days 54% → 74%, 93% once Memphis is live (Michael,
// Oct 27: a better south-east site beats Atlanta's 82%); 24% of
// orders go west and took 4.8 days from Columbus. Captioned as illustrative.

const STEPS: { name: string; body: string }[] = [
  { name: "Assess", body: "We start from your own orders: every lane, carrier and cost." },
  { name: "Plan", body: "We agree the goals with you, and what comes first." },
  { name: "Design", body: "Carriers, warehouses and routes, priced before you commit." },
  { name: "Test", body: "We prove it on your real shipments before anything changes." },
  { name: "Go live", body: "Switched on alongside your team. Nothing pauses." },
  { name: "Improve", body: "Reviewed with you every month, and optimized as you grow." },
];
const STEP_MS = 4200;
const STAGE = "polygon(7% 0, 100% 0, 100% 100%, 7% 100%, 0 50%)";

// ── screen primitives ────────────────────────────────────────────────────────
function Card({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 6, boxShadow: "0 30px 60px -36px rgba(23,16,28,0.65)", overflow: "hidden", textAlign: "left" }}>
      {children}
    </div>
  );
}

function AppHead({ name, right }: { name: string; right?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${C.line}` }}>
      <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 700, color: C.ink }}>
        <span style={{ width: 20, height: 20, flex: "none", background: C.plum, borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 12 12" style={{ width: 10, height: 10 }} aria-hidden>
            <path d={K_BAR} fill={C.paper} />
            <path d={K_ARROW} fill={C.paper} />
          </svg>
        </span>
        {name}
      </span>
      {right && <span style={{ ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: C.stone, whiteSpace: "nowrap" }}>{right}</span>}
    </div>
  );
}

function Tick({ delay }: { delay: number }) {
  return (
    <span className="km-tick" style={{ width: 20, height: 20, borderRadius: 999, background: C.plum, display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none", animationDelay: `${delay}s` }}>
      <svg viewBox="0 0 12 12" style={{ width: 10, height: 10 }} aria-hidden>
        <path d="M2.2 6.3 L4.8 8.8 L9.8 3.4" fill="none" stroke={C.paper} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const foot: CSSProperties = { ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: C.stone, padding: "10px 16px", borderTop: `1px solid ${C.line}`, background: C.mist };

function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <div className="km-rise" style={{ border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 12px", animationDelay: `${delay}s` }}>
      <div className="km-statv" style={{ ...mono, fontSize: 21, color: C.plum, whiteSpace: "nowrap" }}>{value}</div>
      <div style={{ ...sans, fontSize: 12, color: C.stone, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ── one screen per step ──────────────────────────────────────────────────────
function AssessView() {
  const regions: [string, number][] = [["West", 24], ["Midwest", 31], ["Southeast", 12], ["Elsewhere", 33]];
  return (
    <Card>
      <AppHead name="Your orders · September" right="Alder & Stone" />
      <div style={{ padding: "16px 16px 14px" }}>
        <div style={{ ...sans, display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12.5, color: C.stone }}>
          <span>Reading your order file</span>
          <span style={{ ...mono }}>18,240 orders</span>
        </div>
        <div style={{ height: 6, background: C.mist, borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
          <div className="km-fill" style={{ height: "100%", background: C.plum, borderRadius: 99 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <Stat value="$12.30" label="per order, all in" delay={0.6} />
          <Stat value="4.8 days" label="to the West from Columbus" delay={0.75} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 88, marginTop: 14 }}>
          {regions.map(([r, v], n) => (
            <div key={r} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
              <span style={{ ...mono, fontSize: 11, color: n === 0 ? C.plum : C.stone }}>{v}%</span>
              <div className="km-grow" style={{ width: "100%", height: `${(v / 33) * 62}%`, background: n === 0 ? C.plum : C.lilac, borderRadius: "3px 3px 0 0", animationDelay: `${0.9 + n * 0.1}s` }} />
              <span className="km-region" style={{ ...mono, fontSize: 11, color: C.stone }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={foot}>Profile ready · where your orders go</div>
    </Card>
  );
}

function PlanView() {
  const goals = ["Cut cost per order below $11.50", "Reach 70% of customers within 2 days", "Keep Columbus as your main site"];
  return (
    <Card>
      <AppHead name="Goals for your network" right="Draft 2" />
      <div style={{ padding: "8px 16px" }}>
        {goals.map((g, n) => (
          <div key={g} className="km-rise" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: n ? `1px solid ${C.line}` : "none", animationDelay: `${0.2 + n * 0.25}s` }}>
            <Tick delay={0.5 + n * 0.25} />
            <span style={{ ...sans, fontSize: 14, fontWeight: 600, color: C.ink }}>{g}</span>
          </div>
        ))}
      </div>
      <div className="km-rise" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 16px", background: C.mist, animationDelay: "1.3s" }}>
        <span style={{ ...sans, fontSize: 12.5, color: C.stone }}>We suggest. Jordan Reyes, Director of Operations, approves.</span>
        <span style={{ ...sans, fontSize: 12.5, fontWeight: 700, color: C.paper, background: C.plum, borderRadius: 4, padding: "6px 11px", whiteSpace: "nowrap" }}>Approved</span>
      </div>
    </Card>
  );
}

// The map's labels are HTML over the SVG, so they stay readable on a phone.
const MAP_W = 600;
const MAP_H = 290;
const onMap = (x: number, y: number): CSSProperties => ({ position: "absolute", left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` });

function DesignView() {
  // Reno's label hangs below its marker, clear of the route coming in. On a
  // phone Columbus's does too (phoneBelow), or it runs into the card's edge.
  const sites = [
    { x: 118, y: 120, r: 72, name: "Reno, NV", note: "New · partner warehouse", planned: false, below: true, phoneBelow: false },
    { x: 410, y: 96, r: 78, name: "Columbus, OH", note: "Your warehouse", planned: false, below: false, phoneBelow: true },
    { x: 332, y: 212, r: 64, name: "Memphis, TN", note: "Planned · Nov 25", planned: true, below: false, phoneBelow: false },
  ];
  const under = (s: { x: number; y: number }) => onMap(s.x - 7, s.y + 12);
  return (
    <Card>
      <AppHead name="Your network, designed" right="2-day reach" />
      {/* dot grid as a CSS background: an SVG <pattern> id would repeat in the
          hidden copies MethodPlayer renders for sizing. The route label sits
          outside the map's own box: on a phone the map is too small for it
          to clear the rings, so it moves to a band above (.km-map). */}
      <div className="km-map" style={{ position: "relative", background: C.paper, backgroundImage: `radial-gradient(circle, ${C.line} 1.2px, transparent 1.6px)`, backgroundSize: "16px 16px" }}>
        <div style={{ position: "relative" }}>
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ width: "100%", height: "auto", display: "block" }} aria-label="Reno, Columbus and Atlanta, with how far each reaches in 2 days" role="img">
            {sites.map((s, n) => (
              <circle key={s.name} className="km-ring" cx={s.x} cy={s.y} r={s.r} fill={s.planned ? "rgba(199,174,230,0.22)" : "rgba(110,58,128,0.16)"} stroke={s.planned ? C.lilac : C.violet} strokeDasharray={s.planned ? "4 6" : undefined} style={{ transformOrigin: `${s.x}px ${s.y}px`, animationDelay: `${0.3 + n * 0.3}s` }} />
            ))}
            <path className="km-draw" d="M 403 92 C 320 40, 200 50, 126 114" stroke={C.plum} strokeWidth="2" fill="none" strokeDasharray="5 7" />
            {sites.map((s) => (
              <rect key={s.name} x={s.x - 7} y={s.y - 7} width="14" height="14" fill={s.planned ? C.violet : C.plum} />
            ))}
          </svg>
          {sites.map((s) => (
            <span
              key={s.name}
              className={s.phoneBelow ? "km-map-below" : undefined}
              style={{ ...(s.below ? under(s) : { ...onMap(s.x + 14, s.y), transform: "translateY(-50%)" }), ...(s.phoneBelow ? ({ "--bl": under(s).left, "--bt": under(s).top } as CSSProperties) : {}), whiteSpace: "nowrap", lineHeight: 1.25 }}
            >
              <span className="km-map-name" style={{ ...sans, display: "block", fontSize: 13.5, fontWeight: 700, color: C.ink }}>{s.name}</span>
              <span className="km-map-note" style={{ ...mono, display: "block", fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: C.stone }}>{s.note}</span>
            </span>
          ))}
        </div>
        <span className="km-fade km-map-route" style={{ ...onMap(262, 40), transform: "translate(-50%, -50%)", ...mono, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: C.plum, whiteSpace: "nowrap", animationDelay: "1.7s" }}>
          West orders · 2.4 days faster
        </span>
      </div>
      <div style={foot}>West orders ship from Reno · priced before you commit</div>
    </Card>
  );
}

function TestView() {
  const rows: [string, string, string][] = [
    ["Cost per order", "$12.30", "$11.21"],
    ["Days to the West", "4.8", "2.4"],
    ["Customers within 2 days", "54%", "74%"],
  ];
  const cols = "1.4fr 1fr 1fr";
  return (
    <Card>
      <AppHead name="September, replayed on the new design" />
      <div style={{ padding: "6px 16px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, padding: "8px 0", ...mono, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: C.stone }}>
          <span>Measure</span>
          <span>Today</span>
          <span style={{ color: C.plum }}>Designed</span>
        </div>
        {rows.map(([m, a, b], n) => (
          <div key={m} className="km-rise" style={{ display: "grid", gridTemplateColumns: cols, gap: 8, alignItems: "baseline", padding: "11px 0", borderTop: `1px solid ${C.line}`, animationDelay: `${0.2 + n * 0.2}s` }}>
            <span style={{ ...sans, fontSize: 13.5, color: C.ink }}>{m}</span>
            <span style={{ ...mono, fontSize: 15, color: C.stone }}>{a}</span>
            <span style={{ ...mono, fontSize: 17, fontWeight: 500, color: C.plum }}>{b}</span>
          </div>
        ))}
      </div>
      <div className="km-rise" style={{ ...foot, animationDelay: "1s" }}>Shadow mode · your customers saw no change</div>
    </Card>
  );
}

function GoLiveView() {
  const items = ["Inventory placed in Reno", "Routing rules switched on", "Labels printing in Reno", "Your team trained"];
  return (
    <Card>
      <AppHead name="Go-live · Reno" right="Week 8" />
      <div style={{ padding: "6px 16px" }}>
        {items.map((it, n) => (
          <div key={it} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: n ? `1px solid ${C.line}` : "none" }}>
            <Tick delay={0.3 + n * 0.3} />
            <span style={{ ...sans, fontSize: 14, fontWeight: 600, color: C.ink }}>{it}</span>
          </div>
        ))}
      </div>
      <div className="km-rise" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: C.mist, animationDelay: "1.6s" }}>
        <span className="km-live" style={{ width: 9, height: 9, borderRadius: 99, background: C.plum }} />
        <span style={{ ...sans, fontSize: 13.5, fontWeight: 700, color: C.plum }}>Live. Nothing paused.</span>
      </div>
    </Card>
  );
}

function ImproveView() {
  const months: [string, number][] = [["Before", 12.3], ["Jun", 11.92], ["Jul", 11.66], ["Aug", 11.47], ["Sep", 11.34], ["Oct", 11.21]];
  const [lo, hi] = [10.6, 12.6];
  return (
    <Card>
      <AppHead name="Monthly report · October" right="Cost per order" />
      <div style={{ padding: "16px 16px 10px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 96 }}>
          {months.map(([m, v], n) => (
            <div key={m} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%", justifyContent: "flex-end" }}>
              <span style={{ ...mono, fontSize: 11, color: n === months.length - 1 ? C.plum : C.stone }}>{v.toFixed(2)}</span>
              <div className="km-grow" style={{ width: "100%", height: `${((v - lo) / (hi - lo)) * 100}%`, background: n === months.length - 1 ? C.plum : C.lilac, borderRadius: "3px 3px 0 0", animationDelay: `${0.2 + n * 0.1}s` }} />
              <span style={{ ...mono, fontSize: 11, color: C.stone }}>{m}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <Stat value="96.4%" label="on time · +0.8 pts" delay={0.9} />
          <Stat value="74%" label="within 2 days · +20 pts" delay={1.05} />
        </div>
      </div>
      <div style={foot}>Next: Memphis, Nov 25 · 93% within 2 days</div>
    </Card>
  );
}

const VIEWS = [AssessView, PlanView, DesignView, TestView, GoLiveView, ImproveView];

const KM_CSS = `
        @media (max-width: 640px) { .km-statv { font-size: 17px !important; } }
        .km-step:hover { border-color: ${C.violet} !important; }
        .km-step:focus-visible { outline: 2px solid ${C.violet}; outline-offset: 2px; }
        @media (prefers-reduced-motion: no-preference) {
          @keyframes km-progress-kf { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          .km-progress { animation: km-progress-kf ${STEP_MS}ms linear both; }
          @keyframes km-in-kf { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
          .km-in { animation: km-in-kf .55s cubic-bezier(.22,1,.36,1) both; }
          @keyframes km-fill-kf { from { width: 0; } to { width: 100%; } }
          .km-fill { animation: km-fill-kf 1s cubic-bezier(.65,0,.35,1) .2s both; }
          @keyframes km-grow-kf { from { transform: scaleY(0); } to { transform: scaleY(1); } }
          .km-grow { transform-origin: bottom; animation: km-grow-kf .6s cubic-bezier(.22,1,.36,1) both; }
          @keyframes km-rise-kf { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
          .km-rise { animation: km-rise-kf .45s cubic-bezier(.22,1,.36,1) both; }
          @keyframes km-fade-kf { from { opacity: 0; } to { opacity: 1; } }
          .km-fade { animation: km-fade-kf .5s ease both; }
          @keyframes km-tick-kf { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
          .km-tick { animation: km-tick-kf .4s cubic-bezier(.22,1,.36,1) both; }
          @keyframes km-ring-kf { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .km-ring { animation: km-ring-kf .9s cubic-bezier(.22,1,.36,1) both; }
          @keyframes km-draw-kf { from { stroke-dashoffset: 400; opacity: 0; } to { stroke-dashoffset: 0; opacity: 1; } }
          .km-draw { animation: km-draw-kf 1.2s ease .9s both; }
          @keyframes km-live-kf { 0%, 100% { box-shadow: 0 0 0 0 rgba(70,25,72,.5); } 50% { box-shadow: 0 0 0 6px rgba(70,25,72,0); } }
          .km-live { animation: km-live-kf 1.8s ease 3; } /* three pulses, then still */
        }
        @media (max-width: 900px) {
          .km-slide { grid-template-columns: 1fr !important; gap: 22px !important; }
          .km-steps { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .km-steps { gap: 8px !important; }
          .km-map-name { font-size: 11.5px !important; }
          /* the notes go (the card's footer already says West ships from Reno)
             so the route label can stay readable */
          .km-map-note { display: none !important; }
          .km-map-route { font-size: 10.5px !important; letter-spacing: 0.04em !important; top: 12px !important; }
          .km-map { padding-top: 24px; }
          .km-map-below { left: var(--bl) !important; top: var(--bt) !important; transform: none !important; }
        }
        /* "Southeast" and "Elsewhere" meet at 11px on the narrowest phones */
        @media (max-width: 380px) {
          .km-region { font-size: 10px !important; }
        }
`;

function Slide({ n }: { n: number }) {
  const View = VIEWS[n];
  return (
    <div className="km-slide" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "clamp(24px, 4vw, 56px)", alignItems: "center", height: "100%" }}>
      <div style={{ textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Label onDark>Step {String(n + 1).padStart(2, "0")} of 06</Label>
          <Chevrons total={STEPS.length} done={n + 1} onDark />
        </div>
        <h3 style={{ ...title, fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", color: C.onDark, margin: "14px 0 0" }}>{STEPS[n].name}</h3>
        <p style={{ ...sans, fontSize: "clamp(1rem, 1.3vw, 1.1rem)", lineHeight: 1.6, color: C.onDarkDim, margin: "10px 0 0", maxWidth: "34ch" }}>{STEPS[n].body}</p>
      </div>
      <View />
    </div>
  );
}

export function MethodPlayer() {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (reduced || !auto || !inView) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % STEPS.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced, auto, inView]);

  // Choosing a step stops the autoplay; the visitor is in charge from then on.
  const pick = (n: number) => {
    setAuto(false);
    setI(n);
  };
  const playing = auto && inView && !reduced;

  return (
    <div ref={ref} style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ position: "relative", background: C.ink, clipPath: STAGE, padding: "clamp(28px, 4vw, 44px) clamp(22px, 4vw, 44px) clamp(28px, 4vw, 44px) clamp(48px, 9%, 96px)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(199,174,230,0.14) 1.3px, transparent 1.8px)", backgroundSize: "20px 20px" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 80% at 8% 50%, rgba(70,25,72,0.9), transparent 70%)" }} />
        {/* Every step sits hidden in the same cell, so the stage keeps the
            height of the tallest one and the page below never jumps. */}
        <div style={{ position: "relative", display: "grid", minHeight: 340 }}>
          {STEPS.map((s, n) => (
            <div key={s.name} aria-hidden style={{ gridArea: "1 / 1", visibility: "hidden" }}>
              <Slide n={n} />
            </div>
          ))}
          <div key={i} className="km-in" style={{ gridArea: "1 / 1" }}>
            <Slide n={i} />
          </div>
        </div>
      </div>

      <div className="km-steps" role="group" aria-label="The six steps" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginTop: 22 }}>
        {STEPS.map((s, n) => {
          const on = n === i;
          return (
            <button
              key={s.name}
              type="button"
              aria-pressed={on}
              onClick={() => pick(n)}
              className="km-step"
              style={{ ...sans, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: on ? C.card : "transparent", border: `1.5px solid ${on ? C.plum : C.line}`, borderRadius: 4, padding: "14px 8px 12px", transition: "background .25s ease, border-color .25s ease" }}
            >
              <Chevrons total={6} done={n + 1} />
              <span style={{ ...title, fontSize: "1.05rem", color: on ? C.plum : C.ink }}>{s.name}</span>
              {/* fills while autoplay runs, then stays full on the chosen step */}
              <span aria-hidden style={{ display: "block", height: 2, width: "70%", borderRadius: 2, overflow: "hidden", background: on ? C.line : "transparent" }}>
                {on && <span key={`${i}-${playing}`} className={playing ? "km-progress" : undefined} style={{ display: "block", height: "100%", background: C.plum, transformOrigin: "left center" }} />}
              </span>
            </button>
          );
        })}
      </div>
      <p style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.stone, textAlign: "center", margin: "16px 0 0" }}>
        Alder &amp; Stone is an example account · figures are illustrative
      </p>

      <style>{KM_CSS}</style>
    </div>
  );
}

// ── MethodScreen — one step's screen on its own ──────────────────────────────
// For /koherent/how-we-work, where each step gets a row of its own. The screen
// plays its build-up when it scrolls into view; until then an invisible copy
// holds its place, so the page never jumps.
export function MethodScreen({ n }: { n: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const View = VIEWS[n];
  return (
    <div ref={ref} style={{ display: "grid" }}>
      <div aria-hidden={!inView} style={{ gridArea: "1 / 1", visibility: inView ? "visible" : "hidden" }}>
        {inView ? <View key="in" /> : <View />}
      </div>
      <style>{KM_CSS}</style>
    </div>
  );
}
