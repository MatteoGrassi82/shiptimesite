import { QUESTIONS, scoreAssessment, type Answers } from "@/lib/lps";

// ── The written half of the Logistics Performance Score ──────────────────────
// One prompt, two destinations. /api/lps/report streams it onto the screen for
// /plus/assessment; /api/lps generates the same thing server-side and parks it
// on the HubSpot contact so a workflow can mail it out an hour later (the
// Parcel Forum flow — Michael + Matteo, 2026-08-20, reaffirmed 2026-08-24).
//
// They share this file for one reason: two copies of a prompt drift, and the
// day they drift is the day the emailed report stops matching the one we show
// on screen. Change the voice here and both destinations change together.

export const LPS_MODEL = process.env.LPS_MODEL || "gpt-4.1-mini";

export type ReportInput = {
  answers: Answers;
  company?: string;
  priority?: string;
  microAnswers?: { question: string; answer: string }[];
};

export type LpsReport = {
  headline: string;
  /** The "##READ" paragraph. Named for how the client renders it. */
  read: string;
  priorities: { title: string; why: string; move: string }[];
  closing: string;
};

export function buildReportPrompt({ answers, company, priority, microAnswers }: ReportInput): string {
  const r = scoreAssessment(answers);
  const micro = microAnswers || [];

  return `You are a logistics engineer at ShipTime Plus writing a short personalized report on a prospect's Logistics Performance Score.

THEIR RESULT
Company: ${company || "not given"}
Logistics Performance Score: ${r.total}/100 — ${r.band}
Cost Performance Score: ${r.pillars[0].score}/100
Operational Excellence Score: ${r.pillars[1].score}/100
Customer Experience Score: ${r.pillars[2].score}/100
Strongest: ${r.strongest.name}. Weakest: ${r.weakest.name}.
Stated 12-month priority: ${priority || "not given"}

THEIR ANSWERS (maturity 1-5)
${QUESTIONS.map((q) => `- ${q.title} (${q.pillar}, worth ${q.points}): ${answers[q.id] ?? "?"}/5`).join("\n")}
${micro.length ? `\nFOLLOW-UP WE ASKED LIVE\n${micro.map((m) => `Q: ${m.question}\nA: ${m.answer}`).join("\n")}\n` : ""}
BIGGEST WEIGHTED GAPS
${r.gaps.slice(0, 5).map((g) => `- ${g.question.title}: ${g.level}/5, losing ${g.lost} pts`).join("\n")}

OUTPUT FORMAT — plain text, these exact markers, nothing else. No markdown, no bullets, no bold.
##HEADLINE
One sentence, max 14 words, naming what this score means operationally.
##READ
Two or three sentences on what their answer pattern actually says — what they're already doing well and where the shape of the problem is. Ground every claim in their answers.
##PRIORITY
Short title (3-5 words)
One sentence on what this is costing them today.
One sentence on the concrete first move.
##PRIORITY
(same shape)
##PRIORITY
(same shape)
##CLOSING
One sentence connecting their stated priority to where the score says the leverage actually is.

Exactly three PRIORITY blocks, ordered by weighted impact, phrased as operational realities rather than question titles.

VOICE: one logistics operator talking to another. Specific, calm, no hype. Never use "leverage", "streamline", "seamless", "unlock", "solution" or "platform". Do not pitch ShipTime, do not mention booking a call. Never invent numbers, savings or facts they did not give us.`;
}

/** Parse the marker format. Tolerant by design: a truncated response still
 *  yields every section that did arrive, which is what makes it safe to render
 *  mid-stream on the client and safe to store server-side. */
export function parseReport(buf: string): LpsReport {
  const out: LpsReport = { headline: "", read: "", priorities: [], closing: "" };
  const parts = buf.split(/##(HEADLINE|READ|PRIORITY|CLOSING)/);
  for (let i = 1; i < parts.length; i += 2) {
    const tag = parts[i];
    const text = (parts[i + 1] || "").trim();
    if (!text) continue;
    if (tag === "HEADLINE") out.headline = text;
    else if (tag === "READ") out.read = text;
    else if (tag === "CLOSING") out.closing = text;
    else if (tag === "PRIORITY") {
      const [title, why, move] = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (title) out.priorities.push({ title, why: why || "", move: move || "" });
    }
  }
  return out;
}

/** Non-streaming generation, for the email path. Returns null rather than
 *  throwing: a missing report must never cost us the lead that produced it. */
export async function generateReport(input: ReportInput): Promise<LpsReport | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn("[lps/report] OPENAI_API_KEY unset — no report generated");
    return null;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: LPS_MODEL,
        messages: [{ role: "user", content: buildReportPrompt(input) }],
        temperature: 0.6,
        max_tokens: 700,
      }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!res.ok) {
      console.error("[lps/report] upstream", res.status, await res.text().catch(() => ""));
      return null;
    }

    const text = (await res.json())?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) return null;

    const report = parseReport(text);
    // A report with no headline and no priorities is a parse failure, not a
    // report — better to leave the properties empty and have the workflow skip
    // the send than to email someone a blank page with their name on it.
    return report.headline || report.priorities.length ? report : null;
  } catch (e) {
    console.error("[lps/report] generation threw", (e as Error).message);
    return null;
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** The report as HTML, one string per section, ready to sit in a HubSpot
 *  **rich text** property.
 *
 *  Why HTML and not plain text: HubSpot renders a multi-line text property
 *  through a personalization token with its newlines collapsed, so the three
 *  priorities arrive in the inbox as one run-on paragraph — and the obvious fix
 *  (a `|replace` filter in the email) does not work either, because HubSpot
 *  doesn't support HubL filters on personalization tokens when rendering email.
 *  A rich text property does render its markup, so the layout has to be decided
 *  here, where we control it. Model output is escaped on the way in; it is not
 *  trusted markup. */
export function renderReportHtml(report: LpsReport): {
  read: string;
  priorities: string;
  closing: string;
} {
  return {
    read: report.read ? `<p>${esc(report.read)}</p>` : "",
    priorities: report.priorities
      .map((p, i) =>
        `<p><strong>${i + 1}. ${esc(p.title)}</strong>` +
        (p.why ? `<br>${esc(p.why)}` : "") +
        (p.move ? `<br>${esc(p.move)}` : "") +
        `</p>`,
      )
      .join(""),
    closing: report.closing ? `<p>${esc(report.closing)}</p>` : "",
  };
}
