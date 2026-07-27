"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LeadForm } from "./LeadForm";

// C14 — the 12-question logistics maturity assessment. Four axes (Visibility,
// Orchestration, Intelligence, Automation), 3 questions each. The volume and
// mode-mix questions double as lead-qualifying data (per the master doc's
// "Volume and mode-mix questions qualify the lead on the way through").

type Axis = "Visibility" | "Orchestration" | "Intelligence" | "Automation";

type Question = {
  id: string;
  axis: Axis;
  prompt: string;
  options: { label: string; score: number }[];
  qualifies?: "volume" | "modeMix";
  fix: string; // recommended-fix copy shown if this question scores low
};

const QUESTIONS: Question[] = [
  {
    id: "v1",
    axis: "Visibility",
    prompt: "Can you see cost per lane or shipment across all your carriers today?",
    options: [{ label: "No visibility", score: 0 }, { label: "Some manual reports", score: 1 }, { label: "Real-time dashboards", score: 2 }],
    fix: "Unify carrier data into one layer so cost-per-lane is visible without a manual report.",
  },
  {
    id: "v2",
    axis: "Visibility",
    prompt: "How many shipping modes do you use regularly?",
    options: [{ label: "Just parcel", score: 0 }, { label: "Parcel + LTL", score: 1 }, { label: "Parcel + LTL + FTL", score: 2 }, { label: "All of the above + ocean", score: 3 }],
    qualifies: "modeMix",
    fix: "Bring every mode you run onto one platform instead of managing each separately.",
  },
  {
    id: "v3",
    axis: "Visibility",
    prompt: "Do you know your exception rate (late, damaged, lost) without asking someone?",
    options: [{ label: "No idea", score: 0 }, { label: "Rough estimate", score: 1 }, { label: "Exact number", score: 2 }],
    fix: "Surface exception rates automatically instead of relying on someone's memory.",
  },
  {
    id: "o1",
    axis: "Orchestration",
    prompt: "How many systems does your shipping data touch (ERP, WMS, carrier portals, spreadsheets)?",
    options: [{ label: "1–2", score: 2 }, { label: "3–5", score: 1 }, { label: "6–10", score: 0.5 }, { label: "10+", score: 0 }],
    fix: "Orchestrate your existing systems into a single data layer rather than adding another tool.",
  },
  {
    id: "o2",
    axis: "Orchestration",
    prompt: "Do those systems talk to each other automatically?",
    options: [{ label: "Not at all", score: 0 }, { label: "Partially", score: 1 }, { label: "Fully integrated", score: 2 }],
    fix: "Connect systems that currently require manual re-entry between them.",
  },
  {
    id: "o3",
    axis: "Orchestration",
    prompt: "What's your monthly shipment volume?",
    options: [{ label: "Under 500", score: 0 }, { label: "500–2,000", score: 1 }, { label: "2,000–10,000", score: 2 }, { label: "10,000+", score: 3 }],
    qualifies: "volume",
    fix: "At your volume, small per-shipment savings compound fast once the data is unified.",
  },
  {
    id: "i1",
    axis: "Intelligence",
    prompt: "Who decides which carrier or mode to use for a given shipment?",
    options: [{ label: "Whoever's at the desk", score: 0 }, { label: "Fixed rules nobody's revisited", score: 1 }, { label: "A system that adapts", score: 2 }],
    fix: "Replace ad-hoc or stale routing rules with mode/carrier decisions driven by current data.",
  },
  {
    id: "i2",
    axis: "Intelligence",
    prompt: "Do you know, before you ship, what a shipment should cost versus what it will?",
    options: [{ label: "Never", score: 0 }, { label: "Sometimes", score: 1 }, { label: "Always", score: 2 }],
    fix: "Score every shipment against what it should cost so overcharges surface before you pay them.",
  },
  {
    id: "i3",
    axis: "Intelligence",
    prompt: "Have you renegotiated carrier rates in the last 12 months based on real usage data?",
    options: [{ label: "No", score: 0 }, { label: "Tried, lacked the data", score: 1 }, { label: "Yes, with data", score: 2 }],
    fix: "Build the usage data you need to negotiate carrier rates from a position of strength.",
  },
  {
    id: "a1",
    axis: "Automation",
    prompt: "What percentage of shipments get booked without a human touching them?",
    options: [{ label: "0%", score: 0 }, { label: "Some", score: 1 }, { label: "Most", score: 2 }],
    fix: "Move routine booking decisions off your team's plate and into automated workflows.",
  },
  {
    id: "a2",
    axis: "Automation",
    prompt: "How do exceptions get handled today?",
    options: [{ label: "Someone notices and scrambles", score: 0 }, { label: "A person follows a checklist", score: 1 }, { label: "The system flags and reroutes automatically", score: 2 }],
    fix: "Let the system catch and reroute exceptions instead of waiting for someone to notice.",
  },
  {
    id: "a3",
    axis: "Automation",
    prompt: "If your best 2–3 logistics people left tomorrow, would anything break?",
    options: [{ label: "Everything", score: 0 }, { label: "Some things", score: 1 }, { label: "Nothing — it's documented and systemized", score: 2 }],
    fix: "Capture the tribal knowledge your team carries so the operation isn't a key-person risk.",
  },
];

const AXES: Axis[] = ["Visibility", "Orchestration", "Intelligence", "Automation"];

function savingsRange(volumeLabel?: string) {
  switch (volumeLabel) {
    case "10,000+":
      return "$250K–$1M+/yr";
    case "2,000–10,000":
      return "$60K–$250K/yr";
    case "500–2,000":
      return "$15K–$60K/yr";
    default:
      return "$5K–$20K/yr";
  }
}

export function AssessmentTool() {
  const [step, setStep] = useState(0); // 0..11 questions, 12 = results
  const [answers, setAnswers] = useState<Record<string, { label: string; score: number }>>({});

  const question = QUESTIONS[step];
  const done = step >= QUESTIONS.length;

  function answer(opt: { label: string; score: number }) {
    setAnswers((a) => ({ ...a, [question.id]: opt }));
    setTimeout(() => setStep((s) => s + 1), 150);
  }

  const result = useMemo(() => {
    if (!done) return null;
    const axisScores: Record<Axis, { total: number; max: number }> = {
      Visibility: { total: 0, max: 0 },
      Orchestration: { total: 0, max: 0 },
      Intelligence: { total: 0, max: 0 },
      Automation: { total: 0, max: 0 },
    };
    for (const q of QUESTIONS) {
      const maxScore = Math.max(...q.options.map((o) => o.score));
      axisScores[q.axis].max += maxScore || 1;
      axisScores[q.axis].total += answers[q.id]?.score ?? 0;
    }
    const overallPct = Math.round(
      (AXES.reduce((sum, ax) => sum + axisScores[ax].total, 0) / AXES.reduce((sum, ax) => sum + axisScores[ax].max, 0)) * 100,
    );

    const scored = QUESTIONS.map((q) => {
      const a = answers[q.id];
      const maxScore = Math.max(...q.options.map((o) => o.score));
      return { q, pct: maxScore ? (a?.score ?? 0) / maxScore : 1 };
    }).sort((a, b) => a.pct - b.pct);
    const topFixes = scored.slice(0, 3).map((s) => s.q.fix);

    const modeMix = answers["v2"]?.label;
    const volume = answers["o3"]?.label;
    const systemCount = answers["o1"]?.label;
    const highComplexity =
      (modeMix && modeMix !== "Just parcel") ||
      (volume && volume !== "Under 500") ||
      (systemCount && (systemCount === "6–10" || systemCount === "10+"));

    return { axisScores, overallPct, topFixes, highComplexity, volume };
  }, [done, answers]);

  if (done && result) {
    return (
      <div style={{ display: "grid", gap: 32 }}>
        <div style={{ borderRadius: "var(--radius-section)", border: "1px solid var(--line)", background: "var(--card)", padding: "32px 28px" }}>
          <span className="st-eyebrow" style={{ fontSize: 11 }}>Your maturity score</span>
          <div className="st-display" style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", color: "var(--brand)", lineHeight: 1, marginTop: 8 }}>
            {result.overallPct}
            <span style={{ fontSize: "0.4em" }}>/100</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginTop: 28 }}>
            {AXES.map((ax) => {
              const { total, max } = result.axisScores[ax];
              const pct = max ? Math.round((total / max) * 100) : 0;
              return (
                <div key={ax}>
                  <div className="st-body" style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: 6 }}>{ax}</div>
                  <div style={{ height: 6, borderRadius: 4, background: "var(--surface-2)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--brand)", borderRadius: 4 }} />
                  </div>
                  <div className="st-display" style={{ fontSize: 15, marginTop: 6 }}>{pct}%</div>
                </div>
              );
            })}
          </div>
          <p className="st-body" style={{ marginTop: 24, fontSize: 14.5, color: "var(--ink-2)" }}>
            Operations like yours typically save <strong style={{ color: "var(--ink)" }}>{savingsRange(result.volume)}</strong>.
          </p>
        </div>

        <div>
          <h2 className="st-display" style={{ fontSize: 18, margin: "0 0 16px" }}>Your three highest-pressure fixes</h2>
          <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 12 }}>
            {result.topFixes.map((f, i) => (
              <li key={i} className="st-body" style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{f}</li>
            ))}
          </ol>
        </div>

        {result.highComplexity ? (
          <div style={{ borderRadius: "var(--radius-card)", border: "1px solid var(--line)", background: "var(--surface)", padding: "26px 24px" }}>
            <p className="st-body" style={{ margin: "0 0 16px", fontSize: 15, color: "var(--ink)", fontWeight: 600 }}>
              Your complexity is real — a designed system likely pays for itself.
            </p>
            <LeadForm
              source="assessment"
              submitLabel="Get the full report + book a call"
              successHeading="Sent."
              successBody="Your full report is on its way — and we'll follow up to find time for the 30-minute call."
              fields={[
                { name: "firstname", label: "Name", type: "text", required: true },
                { name: "company", label: "Company", type: "text", required: true },
                { name: "email", label: "Work email", type: "email", required: true },
              ]}
            />
          </div>
        ) : (
          <div style={{ borderRadius: "var(--radius-card)", border: "1px solid var(--line)", background: "var(--surface)", padding: "26px 24px" }}>
            <p className="st-body" style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
              Honestly? Core probably covers you — a designed system is built for multi-mode, multi-location
              complexity, and your answers don&rsquo;t show that yet.{" "}
              <Link href="/" style={{ color: "var(--brand)", fontWeight: 600 }}>Start free on Core →</Link>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span className="st-body" style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
          Question {step + 1} of {QUESTIONS.length}
        </span>
        <div style={{ flex: 1, height: 4, borderRadius: 4, background: "var(--surface-2)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(step / QUESTIONS.length) * 100}%`, background: "var(--brand)", transition: "width 0.2s ease" }} />
        </div>
      </div>
      <span className="st-eyebrow" style={{ fontSize: 11 }}>{question.axis}</span>
      <h2 className="st-display" style={{ fontSize: "clamp(1.3rem, 2.6vw, 1.7rem)", margin: "8px 0 24px" }}>{question.prompt}</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {question.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => answer(opt)}
            className="st-lift"
            style={{ textAlign: "left", border: "1px solid var(--line)", background: "var(--card)", borderRadius: "var(--radius-card)", padding: "16px 20px", fontSize: 15, color: "var(--ink)", cursor: "pointer" }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
