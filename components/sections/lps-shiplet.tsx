"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, Loader2, Mail, Send, Sparkles } from "lucide-react";
import {
  PILLARS,
  PRIORITY_OPTIONS,
  PRIORITY_QUESTION,
  QUESTIONS,
  scoreAssessment,
  type Answers,
  type LpsResult,
} from "@/lib/lps";
import { P, serif, sans } from "./plus-v2-kit";

// ── The Logistics Performance Score shiplet ──────────────────────────────────
// Michael's 16-question framework as a self-contained embeddable unit: one
// question per screen, an email gate before the result, then the scored report
// with AI commentary. Drops into any page (/plus/assessment, the Parcel Forum
// landing page, a future ParcelForum QR target) with no props.
//
// The client scores locally only to render the dial the instant it submits;
// the authoritative score, the commentary and the CRM write all come back
// from /api/lps.
//
// Two ways to hand over the written report, set by `reportDelivery`:
//  · "live"  — it streams onto the screen and the visitor can question it.
//              /plus/assessment, where the page IS the deliverable.
//  · "email" — the score lands instantly, the report arrives by email an hour
//              later. The Parcel Forum flow (2026-08-20, reaffirmed on the
//              24th): a report that answers the instant you press submit reads
//              as machine-written, and this one is worth more read as a letter.

type Commentary = {
  headline: string;
  strengths: string[];
  priorities: { title: string; why: string; move: string }[];
  closing: string;
};

type Stage = "intro" | "questions" | "microask" | "priority" | "gate" | "result";

type MicroAsk = { question: string; why: string; options: string[]; generated?: boolean };
type Turn = { q: string; a: string };

// Straight to the HubSpot meeting link — no interstitial page between "I want
// to talk about this" and a slot on the calendar. Falls back to the booking
// page only if the env var is missing.
const bookHref =
  process.env.NEXT_PUBLIC_PLUS_CALENDAR_URL ||
  process.env.NEXT_PUBLIC_LEAD_CALENDAR_URL ||
  "/plus/book-a-call";
const bookExternal = bookHref.startsWith("http");

/** Re-parse the accumulated stream on every chunk. Half a section is fine —
 *  it renders as far as it got, which is the point of streaming it. */
function parseReport(buf: string): Commentary & { streaming: boolean } {
  const out: Commentary & { streaming: boolean } = { headline: "", strengths: [], priorities: [], closing: "", streaming: true };
  const parts = buf.split(/##(HEADLINE|READ|PRIORITY|CLOSING)/);
  for (let i = 1; i < parts.length; i += 2) {
    const tag = parts[i];
    const text = (parts[i + 1] || "").trim();
    if (!text) continue;
    if (tag === "HEADLINE") out.headline = text;
    else if (tag === "READ") out.strengths = [text];
    else if (tag === "CLOSING") out.closing = text;
    else if (tag === "PRIORITY") {
      const [title, why, move] = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (title) out.priorities.push({ title, why: why || "", move: move || "" });
    }
  }
  return out;
}

/** The stages shown while the model works. Cosmetic, but honest — each line
 *  names something the pipeline is genuinely doing. */
const THINKING = [
  "Reading your sixteen answers",
  "Weighting cost, operations and experience",
  "Finding the gaps that cost the most",
  "Writing your report",
];

/** Three-axis radar of the pillar scores. Draws itself in on mount — the shape
 *  says more at a glance than three numbers do. */
function PillarRadar({ scores }: { scores: number[] }) {
  const cx = 130, cy = 122, R = 88;
  const ang = (i: number) => (Math.PI * 2 * i) / 3 - Math.PI / 2;
  const pt = (i: number, f: number) => [cx + Math.cos(ang(i)) * R * f, cy + Math.sin(ang(i)) * R * f];
  const poly = (f: number[]) => f.map((v, i) => pt(i, v).join(",")).join(" ");
  const labels = ["Cost", "Operations", "Experience"];
  return (
    <svg viewBox="0 0 260 250" style={{ width: "100%", maxWidth: 260, height: "auto", display: "block" }} role="img" aria-label={`Cost ${scores[0]}, Operations ${scores[1]}, Experience ${scores[2]} out of 100`}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={poly([f, f, f])} fill="none" stroke={P.line} strokeWidth="1" />
      ))}
      {[0, 1, 2].map((i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={P.line} strokeWidth="1" />;
      })}
      <polygon
        className="lps-radar"
        points={poly(scores.map((v) => Math.max(v, 3) / 100))}
        fill="rgba(236,90,38,0.16)"
        stroke={P.orange}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {scores.map((v, i) => {
        const [x, y] = pt(i, Math.max(v, 3) / 100);
        return <circle key={i} className="lps-radar" cx={x} cy={y} r="4.5" fill={P.orange} />;
      })}
      {labels.map((l, i) => {
        const [x, y] = pt(i, 1.24);
        return (
          <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="central" style={sans} fontSize="11.5" fontWeight="700" letterSpacing="0.6" fill={P.sub}>
            {l.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

/** Where this score sits on the maturity scale. Turns an abstract number into
 *  a position — the thing people actually want to know. */
function BandScale({ total }: { total: number }) {
  const bands = [
    { n: "Foundational", to: 20 },
    { n: "Reactive", to: 40 },
    { n: "Developing", to: 60 },
    { n: "Advancing", to: 80 },
    { n: "Optimized", to: 100 },
  ];
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ display: "flex", gap: 3, height: 10 }}>
        {bands.map((b, i) => {
          const lo = i * 20;
          const active = total >= lo && total < b.to + (i === 4 ? 1 : 0);
          return (
            <div key={b.n} style={{ flex: 1, borderRadius: 3, background: active ? P.orange : "#E7E9EE", transition: "background 0.4s ease" }} />
          );
        })}
      </div>
      <div style={{ position: "relative", height: 22, marginTop: 6 }}>
        <div className="lps-marker" style={{ position: "absolute", left: `${Math.min(98, Math.max(2, total))}%`, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 2, height: 7, background: P.ink }} />
          <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: P.ink, whiteSpace: "nowrap", marginTop: 2 }}>you</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        {bands.map((b) => (
          <span key={b.n} className="lps-bandlabel" style={{ ...sans, flex: 1, textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: P.faint }}>
            {b.n}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The five costliest gaps as points-on-the-table bars. Makes "where the
 *  leverage is" quantitative instead of a claim. */
function GapChart({ gaps }: { gaps: { question: { title: string }; level: number; lost: number }[] }) {
  const top = gaps.slice(0, 5);
  if (!top.length) return null;
  const max = Math.max(...top.map((g) => g.lost));
  return (
    <div style={{ marginTop: 30, paddingTop: 28, borderTop: `1px solid ${P.line}` }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h3 style={{ ...serif, fontSize: "clamp(1.4rem, 2.1vw, 1.7rem)", color: P.ink, margin: 0 }}>Points on the table</h3>
        <span style={{ ...sans, fontSize: 12.5, color: P.sub }}>
          {Math.round(top.reduce((n, g) => n + g.lost, 0))} points available across these five
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 18 }}>
        {top.map((g, i) => (
          <div key={g.question.title} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 0.9fr) 1fr auto", gap: 14, alignItems: "center" }} className="lps-gaprow">
            <span style={{ ...sans, fontSize: 13.5, fontWeight: 600, color: P.ink }}>{g.question.title}</span>
            <div aria-hidden style={{ height: 9, borderRadius: 999, background: "#EDEFF3", overflow: "hidden" }}>
              <div className="lps-bar" style={{ height: "100%", width: `${(g.lost / max) * 100}%`, background: i === 0 ? P.orange : "rgba(236,90,38,0.5)", borderRadius: 999, animationDelay: `${i * 80}ms` }} />
            </div>
            <span style={{ ...sans, fontSize: 13, fontWeight: 700, color: P.orange, whiteSpace: "nowrap" }}>+{g.lost}</span>
          </div>
        ))}
      </div>
      <p style={{ ...sans, fontSize: 12.5, color: P.faint, margin: "12px 0 0" }}>
        Points you&rsquo;d gain by reaching level 5 on each. Weighted by how much that dimension counts.
      </p>
    </div>
  );
}

export function LpsShiplet({
  compact = false,
  /** When set, the intro CTA navigates here instead of starting inline — lets a
   *  landing page pitch the assessment and hand it to its own focused page. */
  startHref,
  /** Skip the intro entirely. Used by that focused page. */
  autoStart = false,
  /** Where the written report goes. See the note at the top of this file. */
  reportDelivery = "live",
}: {
  compact?: boolean;
  startHref?: string;
  autoStart?: boolean;
  reportDelivery?: "live" | "email";
}) {
  const [stage, setStage] = useState<Stage>(autoStart ? "questions" : "intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [priority, setPriority] = useState("");
  const [priorityOther, setPriorityOther] = useState("");
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", company: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<LpsResult | null>(null);
  const [commentary, setCommentary] = useState<Commentary | null>(null);
  // the agentic layer: a generated follow-up mid-flow, then open Q&A on the result
  const [micro, setMicro] = useState<MicroAsk | null>(null);
  const [microAnswers, setMicroAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [microLoading, setMicroLoading] = useState(false);
  const [report, setReport] = useState<(Commentary & { streaming: boolean }) | null>(null);
  const [thinkStep, setThinkStep] = useState(0);
  const [dial, setDial] = useState(0);
  const [chat, setChat] = useState<Turn[]>([]);
  const [chatQ, setChatQ] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  /** Set when the email flow couldn't hand the job over — see submit(). */
  const [liveFallback, setLiveFallback] = useState(false);

  const byEmail = reportDelivery === "email";
  /** Is the report being written on this page, or promised by email? */
  const showLiveReport = !byEmail || liveFallback;
  const q = QUESTIONS[idx];
  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);
  const preview = useMemo(() => scoreAssessment(answers), [answers]);

  function choose(level: number) {
    setAnswers((a) => ({ ...a, [q.id]: level }));
    // Small beat so the selected state registers before the screen advances.
    setTimeout(() => {
      if (idx < QUESTIONS.length - 1) setIdx(idx + 1);
      else void goMicroAsk({ ...answers, [q.id]: level });
    }, 190);
  }

  // Ask the model for a follow-up specific to this answer pattern. If it can't
  // be reached the route still returns a static fallback, so the flow never
  // stalls on the model.
  async function goMicroAsk(full: Answers) {
    setStage("microask");
    setMicro(null);
    setMicroLoading(true);
    try {
      const res = await fetch("/api/lps/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "micro-ask", answers: full, asked: microAnswers }),
      });
      const data = await res.json();
      if (data?.ok) setMicro(data as MicroAsk);
      else setStage("priority");
    } catch {
      setStage("priority");
    } finally {
      setMicroLoading(false);
    }
  }

  function answerMicro(option: string) {
    if (micro) setMicroAnswers((m) => [...m, { question: micro.question, answer: option }]);
    setTimeout(() => setStage("priority"), 190);
  }

  async function askAgent(e: React.FormEvent) {
    e.preventDefault();
    const question = chatQ.trim();
    if (!question || chatBusy) return;
    setChatQ("");
    setChat((c) => [...c, { q: question, a: "" }]);
    setChatBusy(true);
    try {
      const res = await fetch("/api/lps/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "ask", answers, question, company: form.company, priority }),
      });
      const data = await res.json();
      setChat((c) => c.map((t, i) => (i === c.length - 1 ? { ...t, a: data?.answer || "Something went wrong there." } : t)));
    } catch {
      setChat((c) => c.map((t, i) => (i === c.length - 1 ? { ...t, a: "Couldn't reach the model just then — try again?" } : t)));
    } finally {
      setChatBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!form.email.trim()) return setErr("An email address is required to send your score.");
    setBusy(true);
    setResult(preview); // show something real immediately if the request is slow
    try {
      const utm: Record<string, string> = {};
      new URLSearchParams(window.location.search).forEach((v, k) => {
        if (k.startsWith("utm_") || k === "gclid") utm[k] = v;
      });
      const res = await fetch("/api/lps", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, priority, priorityOther, answers, microAnswers, utm, deliver: reportDelivery }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");
      setResult(data.result);
      setStage("result");
      // On the email flow the server writes the report to the CRM after
      // responding; there is nothing to stream here.
      if (byEmail) return;
      void streamReport();
    } catch {
      // The visitor answered sixteen questions — never strand them on an error.
      // Locally-computed scores are identical, so show those and still try the
      // written report.
      setStage("result");
      // A failed submit means the server never took the job, so no email is on
      // its way. Say nothing about one: fall back to writing the report here,
      // which is a different endpoint and may well be fine.
      if (byEmail) setLiveFallback(true);
      void streamReport();
    } finally {
      setBusy(false);
    }
  }

  // The report is written in front of them. Each chunk re-parses the whole
  // buffer, so sections appear as the model completes them.
  const streamReport = useCallback(async () => {
    setReport({ headline: "", strengths: [], priorities: [], closing: "", streaming: true });
    try {
      const res = await fetch("/api/lps/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers, company: form.company, priority, microAnswers }),
      });
      if (!res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        setReport({ ...parseReport(buf), streaming: true });
      }
      setReport({ ...parseReport(buf), streaming: false });
    } catch {
      setReport((r) => (r ? { ...r, streaming: false } : null));
    }
  }, [answers, form.company, priority, microAnswers]);

  // rotate the thinking lines while the report is still streaming its headline
  useEffect(() => {
    if (!report?.streaming || report.headline) return;
    const t = setInterval(() => setThinkStep((n) => (n + 1) % THINKING.length), 1400);
    return () => clearInterval(t);
  }, [report?.streaming, report?.headline]);

  // count the score up rather than snapping to it
  const target = result?.total ?? 0;
  useEffect(() => {
    if (stage !== "result") return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 1100);
      const eased = 1 - Math.pow(1 - k, 3);
      setDial(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage, target]);

  const shell: React.CSSProperties = {
    background: P.card,
    border: `1px solid ${P.line}`,
    borderRadius: 22,
    padding: compact ? "clamp(24px, 3vw, 36px)" : "clamp(28px, 3.5vw, 48px)",
    boxShadow: "0 24px 60px -40px rgba(28,30,61,0.4)",
  };

  // ── intro ──────────────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div style={shell}>
        <span style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.orange }}>
          Logistics Performance Assessment
        </span>
        <h2 style={{ ...serif, fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)", lineHeight: 1.08, color: P.ink, margin: "14px 0 0" }}>
          How close is your logistics to <span style={{ fontStyle: "italic" }}>world class?</span>
        </h2>
        <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.62, color: "#4A5060", margin: "14px 0 0", maxWidth: "56ch" }}>
          Sixteen questions. Five minutes. You get a Logistics Performance Score out of 100, a score for each of the
          three pillars, and a personalized read on where the leverage actually is.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "26px 0 0" }} className="lps-pillars">
          {PILLARS.map((p) => (
            <div key={p.key} style={{ background: P.panelSoft, border: `1px solid ${P.line}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: P.faint }}>
                {p.weight}% of score
              </div>
              <div style={{ ...serif, fontSize: 19, color: P.ink, marginTop: 6 }}>{p.name}</div>
              <div style={{ ...sans, fontSize: 12.5, lineHeight: 1.5, color: P.sub, marginTop: 5 }}>{p.blurb}</div>
            </div>
          ))}
        </div>
        {startHref ? (
          <a
            href={startHref}
            className="st-cta"
            style={{ ...sans, marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, background: P.orange, color: "#fff", padding: "14px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}
          >
            Start the assessment <ArrowRight size={16} />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setStage("questions")}
            className="st-cta"
            style={{ ...sans, marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", borderRadius: 10, background: P.orange, color: "#fff", padding: "14px 26px", fontSize: 15, fontWeight: 700 }}
          >
            Start the assessment <ArrowRight size={16} />
          </button>
        )}
        <p style={{ ...sans, fontSize: 12, color: P.faint, margin: "14px 0 0" }}>
          No cost. Your answers contribute anonymously to the Logistics Performance Index.
        </p>
      </div>
    );
  }

  // ── questions ──────────────────────────────────────────────────────────────
  if (stage === "questions") {
    const pillar = PILLARS.find((p) => p.key === q.pillar)!;
    return (
      <div style={shell}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <span style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.orange }}>
            {pillar.name}
          </span>
          <span style={{ ...sans, fontSize: 12.5, color: P.sub }}>
            {idx + 1} of {QUESTIONS.length}
          </span>
        </div>
        <div aria-hidden style={{ height: 4, borderRadius: 999, background: P.panelSoft, margin: "12px 0 0", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((idx + 1) / QUESTIONS.length) * 100}%`, background: P.orange, borderRadius: 999, transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)" }} />
        </div>

        <h3 style={{ ...serif, fontSize: "clamp(1.5rem, 2.4vw, 2rem)", lineHeight: 1.14, color: P.ink, margin: "22px 0 0" }}>
          {q.title}
        </h3>
        <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: "#4A5060", margin: "8px 0 0" }}>{q.prompt}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 22 }}>
          {q.levels.map((label, i) => {
            const level = i + 1;
            const active = answers[q.id] === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => choose(level)}
                className="lps-opt"
                style={{
                  ...sans,
                  display: "flex",
                  gap: 13,
                  alignItems: "flex-start",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                  background: active ? P.orangeTint : P.panelSoft,
                  border: `1px solid ${active ? P.orange : P.line}`,
                  borderRadius: 13,
                  padding: "14px 16px",
                  fontSize: 14.5,
                  lineHeight: 1.5,
                  color: active ? P.ink : "#4A5060",
                }}
              >
                <span style={{ ...sans, flex: "none", width: 22, height: 22, borderRadius: "50%", border: `1px solid ${active ? P.orange : P.line}`, background: active ? P.orange : "#fff", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                  {active ? <Check size={13} /> : <span style={{ color: P.faint }}>{level}</span>}
                </span>
                {label}
              </button>
            );
          })}
        </div>

        {idx > 0 && (
          <button
            type="button"
            onClick={() => setIdx(idx - 1)}
            style={{ ...sans, marginTop: 20, display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13.5, fontWeight: 600, color: P.sub }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
      </div>
    );
  }

  // ── micro-ask: the AI's own follow-up, written for this operation ──────────
  if (stage === "microask") {
    return (
      <div style={shell}>
        <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.orange }}>
          <Sparkles size={13} /> One thing we noticed
        </span>

        {microLoading || !micro ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "40px 0 34px" }}>
            <Loader2 size={18} className="lps-spin" color={P.orange} />
            <span style={{ ...sans, fontSize: 15.5, color: "#4A5060" }}>
              Reading your answers…
            </span>
          </div>
        ) : (
          <>
            <h3 style={{ ...serif, fontSize: "clamp(1.5rem, 2.4vw, 2rem)", lineHeight: 1.14, color: P.ink, margin: "14px 0 0" }}>
              {micro.question}
            </h3>
            {micro.why && (
              <p style={{ ...sans, fontSize: 14, lineHeight: 1.55, color: P.sub, margin: "8px 0 0", fontStyle: "italic" }}>
                {micro.why}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 22 }}>
              {micro.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => answerMicro(opt)}
                  className="lps-opt"
                  style={{ ...sans, textAlign: "left", cursor: "pointer", width: "100%", background: P.panelSoft, border: `1px solid ${P.line}`, borderRadius: 13, padding: "14px 16px", fontSize: 14.5, lineHeight: 1.5, color: "#4A5060" }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStage("priority")}
              style={{ ...sans, marginTop: 18, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13.5, fontWeight: 600, color: P.sub }}
            >
              Skip this one
            </button>
          </>
        )}
      </div>
    );
  }

  // ── lead-qualification question ────────────────────────────────────────────
  if (stage === "priority") {
    return (
      <div style={shell}>
        <span style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.orange }}>
          Last one
        </span>
        <h3 style={{ ...serif, fontSize: "clamp(1.5rem, 2.4vw, 2rem)", lineHeight: 1.14, color: P.ink, margin: "14px 0 0" }}>
          {PRIORITY_QUESTION}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 22 }}>
          {PRIORITY_OPTIONS.map((opt) => {
            const active = priority === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setPriority(opt)}
                className="lps-opt"
                style={{ ...sans, cursor: "pointer", fontSize: 14, fontWeight: 600, borderRadius: 999, padding: "10px 18px", background: active ? P.orange : P.panelSoft, color: active ? "#fff" : "#4A5060", border: `1px solid ${active ? P.orange : P.line}` }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {priority === "Other" && (
          <input
            value={priorityOther}
            onChange={(e) => setPriorityOther(e.target.value)}
            placeholder="Tell us what you'd most like to improve"
            style={{ ...sans, marginTop: 14, width: "100%", fontSize: 15, padding: "13px 16px", borderRadius: 12, border: `1px solid ${P.line}`, background: P.panelSoft, color: P.ink }}
          />
        )}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 26, flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={!priority}
            onClick={() => setStage("gate")}
            className="st-cta"
            style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, border: "none", cursor: priority ? "pointer" : "not-allowed", opacity: priority ? 1 : 0.45, borderRadius: 10, background: P.orange, color: "#fff", padding: "13px 24px", fontSize: 15, fontWeight: 700 }}
          >
            See my score <ArrowRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => { setIdx(QUESTIONS.length - 1); setStage("questions"); }}
            style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13.5, fontWeight: 600, color: P.sub }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>
    );
  }

  // ── email gate ─────────────────────────────────────────────────────────────
  if (stage === "gate") {
    const field: React.CSSProperties = { ...sans, width: "100%", fontSize: 15, padding: "13px 16px", borderRadius: 12, border: `1px solid ${P.line}`, background: P.panelSoft, color: P.ink };
    return (
      <form onSubmit={submit} style={shell}>
        <span style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.orange }}>
          Your score is ready
        </span>
        <h3 style={{ ...serif, fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)", lineHeight: 1.12, color: P.ink, margin: "14px 0 0" }}>
          Where should we send it?
        </h3>
        <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.6, color: "#4A5060", margin: "10px 0 0", maxWidth: "50ch" }}>
          {byEmail
            ? "You'll see your score on the next screen. Your written report follows by email, so you have something to forward internally."
            : "You'll see your full result on the next screen. We'll send a copy so you can share it internally."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 22 }} className="lps-fields">
          <input required value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} placeholder="First name" style={field} />
          <input value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} placeholder="Last name" style={field} />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Work email" style={{ ...field, gridColumn: "1 / -1" }} />
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" style={{ ...field, gridColumn: "1 / -1" }} />
        </div>
        {err && <p style={{ ...sans, fontSize: 13.5, color: P.orange, margin: "12px 0 0" }}>{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="st-cta"
          style={{ ...sans, marginTop: 20, display: "inline-flex", alignItems: "center", gap: 9, border: "none", cursor: busy ? "wait" : "pointer", borderRadius: 10, background: P.orange, color: "#fff", padding: "14px 26px", fontSize: 15, fontWeight: 700 }}
        >
          {busy ? (<><Loader2 size={16} className="lps-spin" /> Scoring your operation…</>) : (<>Get my Logistics Performance Score <ArrowRight size={15} /></>)}
        </button>
      </form>
    );
  }

  // ── result ─────────────────────────────────────────────────────────────────
  const r = result ?? preview;
  const dash = 2 * Math.PI * 54;
  return (
    <div style={shell} className="lps-shell">
      <div className="lps-result" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(20px, 3vw, 40px)", alignItems: "center" }}>
        <div style={{ position: "relative", width: 140, height: 140, flex: "none" }}>
          <svg viewBox="0 0 130 130" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }} aria-hidden>
            <circle cx="65" cy="65" r="54" fill="none" stroke={P.panelSoft} strokeWidth="11" />
            <circle
              cx="65" cy="65" r="54" fill="none" stroke={P.orange} strokeWidth="11" strokeLinecap="round"
              strokeDasharray={dash} strokeDashoffset={dash * (1 - dial / 100)}
              style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...serif, fontSize: 40, lineHeight: 1, color: P.ink }}>{dial}</span>
            <span style={{ ...sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: P.faint }}>/ 100</span>
          </div>
        </div>
        <div>
          <span style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.orange }}>
            Logistics Performance Score
          </span>
          <h2 style={{ ...serif, fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)", lineHeight: 1.1, color: P.ink, margin: "10px 0 0" }}>
            {report?.headline || `${r.band}.`}
          </h2>
          <p style={{ ...sans, fontSize: 15, lineHeight: 1.62, color: "#4A5060", margin: "10px 0 0", maxWidth: "52ch" }}>
            {r.bandBlurb}
          </p>
        </div>
      </div>

      <BandScale total={dial} />

      <div className="lps-breakdown" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "clamp(20px, 3vw, 36px)", alignItems: "center", marginTop: 30, paddingTop: 28, borderTop: `1px solid ${P.line}` }}>
        <PillarRadar scores={r.pillars.map((p) => p.score)} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {r.pillars.map((p) => (
            <div key={p.key}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <span style={{ ...serif, fontSize: 18, color: P.ink }}>{p.scoreName}</span>
                <span style={{ ...serif, fontSize: 22, color: P.ink }}>
                  {p.score}<span style={{ fontSize: 13, color: P.faint }}>/100</span>
                </span>
              </div>
              <div aria-hidden style={{ height: 7, borderRadius: 999, background: "#EDEFF3", marginTop: 8, overflow: "hidden" }}>
                <div className="lps-bar" style={{ height: "100%", width: `${p.score}%`, background: P.orange, borderRadius: 999 }} />
              </div>
              <div style={{ ...sans, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: P.faint, marginTop: 6 }}>
                {p.abbr} · {p.weight}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* the report — written live here, or promised by email */}
      {!showLiveReport ? (
        <div style={{ marginTop: 30, paddingTop: 28, borderTop: `1px solid ${P.line}` }}>
          <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.orange }}>
            <Mail size={13} /> Your report
          </span>
          <h3 style={{ ...serif, fontSize: "clamp(1.4rem, 2.1vw, 1.7rem)", lineHeight: 1.14, color: P.ink, margin: "14px 0 0" }}>
            It&rsquo;s being written now.
          </h3>
          <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.68, color: "#4A5060", margin: "10px 0 0", maxWidth: "54ch" }}>
            The read on your answer pattern, the three gaps costing you the most, and the first concrete move for each
            — on its way to{" "}
            <span style={{ fontWeight: 700, color: P.ink, wordBreak: "break-word" }}>{form.email || "your inbox"}</span>.
            Give it about an hour.
          </p>
          <p style={{ ...sans, fontSize: 13.5, lineHeight: 1.6, color: P.faint, margin: "12px 0 0", maxWidth: "54ch" }}>
            Your scores are final — the report explains them, it doesn&rsquo;t change them.
          </p>
        </div>
      ) : (
      <div style={{ marginTop: 30, paddingTop: 28, borderTop: `1px solid ${P.line}` }}>
        <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.orange }}>
          <Sparkles size={13} className={report?.streaming ? "lps-pulse" : undefined} />
          {report?.streaming ? "Writing your report" : "Your report"}
        </span>

        {report && !report.headline && (
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 16 }}>
            <Loader2 size={15} className="lps-spin" color={P.orange} />
            <span key={thinkStep} className="lps-fade" style={{ ...sans, fontSize: 15, color: "#4A5060" }}>
              {THINKING[thinkStep]}…
            </span>
          </div>
        )}

        {report?.strengths?.[0] && (
          <p style={{ ...sans, fontSize: 15.5, lineHeight: 1.68, color: "#4A5060", margin: "16px 0 0" }}>
            {report.strengths[0]}
            {report.streaming && !report.priorities.length && <span className="lps-caret" />}
          </p>
        )}

        {report && report.priorities.length > 0 && (
          <>
            <h3 style={{ ...serif, fontSize: "clamp(1.4rem, 2.1vw, 1.7rem)", color: P.ink, margin: "26px 0 0" }}>
              Where the leverage is
            </h3>
            <div style={{ marginTop: 12 }}>
              {report.priorities.map((pr, i) => (
                <div key={i} className="lps-in" style={{ display: "flex", gap: 16, alignItems: "baseline", padding: "16px 0", borderTop: `1px solid ${P.line}` }}>
                  <span style={{ ...serif, fontSize: 19, color: P.orange, flex: "none", width: 28 }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4 style={{ ...serif, fontSize: 19, color: P.ink, margin: 0 }}>{pr.title}</h4>
                    {pr.why && <p style={{ ...sans, fontSize: 14, lineHeight: 1.6, color: "#4A5060", margin: "5px 0 0" }}>{pr.why}</p>}
                    {pr.move && <p style={{ ...sans, fontSize: 14, lineHeight: 1.6, color: P.ink, fontWeight: 600, margin: "5px 0 0" }}>{pr.move}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {report?.closing && (
          <p style={{ ...sans, fontSize: 15, lineHeight: 1.65, color: "#4A5060", margin: "18px 0 0", paddingTop: 18, borderTop: `1px solid ${P.line}` }}>
            {report.closing}
          </p>
        )}

        {report && !report.streaming && (
          <button
            type="button"
            onClick={() => window.print()}
            className="lps-opt lps-noprint"
            style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, cursor: "pointer", borderRadius: 10, border: `1px solid ${P.line}`, background: P.panelSoft, color: P.ink, padding: "11px 18px", fontSize: 14, fontWeight: 700 }}
          >
            <Download size={15} /> Download as PDF
          </button>
        )}
      </div>
      )}

      <GapChart gaps={r.gaps} />

      {/* ask anything — the score becomes a conversation, not a dead end.
          Only where the report is on the page: questioning a report the visitor
          hasn't read yet would be answering into a void. */}
      {showLiveReport && (
      <div className="lps-noprint" style={{ marginTop: 30, paddingTop: 26, borderTop: `1px solid ${P.line}` }}>
        <span style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: P.orange }}>
          <Sparkles size={13} /> Ask about your score
        </span>

        {chat.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "18px 0 0" }}>
            {chat.map((t, i) => (
              <div key={i}>
                <p style={{ ...sans, fontSize: 14.5, fontWeight: 700, color: P.ink, margin: 0 }}>{t.q}</p>
                {t.a ? (
                  <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.65, color: "#4A5060", margin: "7px 0 0" }}>{t.a}</p>
                ) : (
                  <p style={{ ...sans, display: "flex", alignItems: "center", gap: 9, fontSize: 14, color: P.sub, margin: "7px 0 0" }}>
                    <Loader2 size={14} className="lps-spin" /> Thinking…
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {chat.length === 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0 0" }}>
            {["Why is my cost score low?", "What would you fix first?", "How do I compare?"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setChatQ(s)}
                className="lps-opt"
                style={{ ...sans, cursor: "pointer", fontSize: 13, fontWeight: 600, color: P.sub, background: P.panelSoft, border: `1px solid ${P.line}`, borderRadius: 999, padding: "8px 14px" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={askAgent} style={{ display: "flex", gap: 9, marginTop: 16 }}>
          <input
            value={chatQ}
            onChange={(e) => setChatQ(e.target.value)}
            placeholder="Ask anything about your result…"
            style={{ ...sans, flex: 1, minWidth: 0, fontSize: 15, padding: "13px 16px", borderRadius: 12, border: `1px solid ${P.line}`, background: P.panelSoft, color: P.ink }}
          />
          <button
            type="submit"
            disabled={chatBusy || !chatQ.trim()}
            aria-label="Send question"
            style={{ ...sans, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, borderRadius: 12, border: "none", cursor: chatBusy || !chatQ.trim() ? "not-allowed" : "pointer", opacity: chatBusy || !chatQ.trim() ? 0.45 : 1, background: P.orange, color: "#fff" }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
      )}

      <div className="lps-noprint" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 26, paddingTop: 26, borderTop: `1px solid ${P.line}` }}>
        <a
          href={bookHref}
          {...(bookExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="st-cta"
          style={{ ...sans, display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, background: P.orange, color: "#fff", padding: "14px 26px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          Talk through your score <ArrowRight size={15} />
        </a>
        <span style={{ ...sans, fontSize: 13, color: P.sub }}>
          A 30-minute call with a logistics engineer — no pitch, just the read.
        </span>
      </div>

      <style>{`
        .lps-opt { transition: border-color 0.15s ease, background 0.15s ease; }
        .lps-opt:hover { border-color: ${P.orange} !important; }
        .lps-spin { animation: lps-spin-kf 0.9s linear infinite; }
        @keyframes lps-spin-kf { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: no-preference) {
          /* the radar draws itself in */
          .lps-radar { animation: lps-pop 0.9s cubic-bezier(0.22,1,0.36,1) both; transform-origin: 130px 122px; }
          @keyframes lps-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .lps-bar { animation: lps-grow 1s cubic-bezier(0.22,1,0.36,1) both; transform-origin: left; }
          @keyframes lps-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          /* each streamed block arrives rather than blinks */
          .lps-in { animation: lps-up 0.45s cubic-bezier(0.22,1,0.36,1) both; }
          @keyframes lps-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
          .lps-fade { animation: lps-fade-kf 0.45s ease both; }
          @keyframes lps-fade-kf { from { opacity: 0; } to { opacity: 1; } }
          .lps-pulse { animation: lps-pulse-kf 1.4s ease-in-out infinite; }
          @keyframes lps-pulse-kf { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        }
        /* the cursor that says a model is still typing */
        .lps-caret { display: inline-block; width: 2px; height: 1em; margin-left: 3px; background: ${P.orange}; vertical-align: text-bottom; animation: lps-blink 1s steps(2) infinite; }
        @keyframes lps-blink { 50% { opacity: 0; } }

        @media (prefers-reduced-motion: no-preference) {
          .lps-marker { animation: lps-fade-kf 0.6s ease 0.9s both; }
        }
        @media (max-width: 720px) {
          .lps-pillars, .lps-fields { grid-template-columns: 1fr !important; }
          .lps-gaprow { grid-template-columns: 1fr auto !important; }
          .lps-gaprow > div[aria-hidden] { grid-column: 1 / -1; }
          .lps-bandlabel { font-size: 8.5px !important; }
          .lps-result, .lps-breakdown { grid-template-columns: 1fr !important; justify-items: start; }
        }

        /* Save-as-PDF: the browser's own print pipeline, so the report comes out
           as selectable vector text rather than a screenshot of a card. */
        @media print {
          .lps-noprint, nav, header, footer { display: none !important; }
          body { background: #fff !important; }
          .lps-shell {
            border: none !important; box-shadow: none !important; padding: 0 !important;
            max-width: 100% !important;
          }
          .lps-breakdown { break-inside: avoid; }
          .lps-in { break-inside: avoid; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
