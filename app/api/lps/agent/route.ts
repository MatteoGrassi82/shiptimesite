import { type NextRequest, NextResponse } from "next/server";
import { QUESTIONS, scoreAssessment, type Answers } from "@/lib/lps";

// ── The agentic half of the LPS shiplet ──────────────────────────────────────
// Michael's "micro-ask" from the 2026-08-18 prep call: the assessment isn't a
// static form with a summary bolted on — the AI is in the loop while the
// visitor is still answering, and stays available once they have their score.
//
// Two modes:
//   micro-ask  After the 16 fixed questions, read the answer pattern and write
//              ONE follow-up question that a logistics engineer would actually
//              ask this specific operation, with generated multiple-choice
//              options. Different for every respondent.
//   ask        Free-form Q&A against their own result, so the score is a
//              conversation instead of a dead end.
//
// Fail-soft everywhere: micro-ask falls back to a sensible static question,
// ask returns a graceful message. The visitor is never blocked by the model.

export const runtime = "nodejs";
export const maxDuration = 45;

const MODEL = process.env.LPS_MODEL || "gpt-4.1-mini";

const VOICE = `VOICE: one logistics operator talking to another. Specific, calm, concrete. Never use "leverage", "streamline", "seamless", "unlock", "solution" or "platform". Never invent numbers, savings or facts the visitor did not give you. Do not pitch ShipTime.`;

async function llm(prompt: string, json: boolean) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        ...(json ? { response_format: { type: "json_object" } } : {}),
        temperature: 0.7,
        max_tokens: json ? 600 : 400,
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) {
      console.error("[lps/agent] model error", res.status);
      return null;
    }
    const data = await res.json();
    return (data?.choices?.[0]?.message?.content as string) || null;
  } catch (e) {
    console.error("[lps/agent] threw", (e as Error).message);
    return null;
  }
}

function answerDigest(answers: Answers) {
  return QUESTIONS.map((q) => `${q.title} (${q.pillar}): ${answers[q.id] ?? "?"}/5`).join("\n");
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    mode?: "micro-ask" | "ask";
    answers?: Answers;
    company?: string;
    priority?: string;
    asked?: { question: string; answer: string }[];
    question?: string;
  };

  const answers = body.answers || {};

  // ── micro-ask: a generated follow-up, specific to this operation ───────────
  if (body.mode === "micro-ask") {
    const r = scoreAssessment(answers);
    const prior = (body.asked || []).map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");

    const out = await llm(
      `A prospect just completed ShipTime's 16-question Logistics Performance Assessment.

THEIR ANSWERS (maturity 1-5)
${answerDigest(answers)}

SCORE: ${r.total}/100 (${r.band}). Weakest pillar: ${r.weakest.name}. Biggest weighted gaps: ${r.gaps.slice(0, 3).map((g) => g.question.title).join(", ")}.
${body.priority ? `They said their 12-month priority is: ${body.priority}` : ""}
${prior ? `\nYOU ALREADY ASKED:\n${prior}\n\nAsk about something different.` : ""}

Write ONE follow-up question a logistics engineer would actually ask THIS operation before a first call — the thing their answer pattern makes you curious about. It must be specific to their answers, not generic. It should surface information that changes what you'd recommend.

Return JSON only:
{
  "question": "the question, max 22 words, plain and direct",
  "why": "max 12 words on why you're asking",
  "options": ["4 short plausible answers, 2-7 words each, covering the realistic range"]
}
${VOICE}`,
      true,
    );

    if (out) {
      try {
        const parsed = JSON.parse(out);
        if (parsed?.question && Array.isArray(parsed.options) && parsed.options.length >= 2) {
          return NextResponse.json({ ok: true, ...parsed, generated: true });
        }
      } catch {
        /* fall through to the static question */
      }
    }

    // Static fallback keyed to their weakest pillar — still relevant, just not bespoke.
    const fallback: Record<string, { question: string; why: string; options: string[] }> = {
      cost: {
        question: "Where does most of your shipping spend go today — parcel, LTL, or fulfillment?",
        why: "It decides which lever moves your cost first.",
        options: ["Mostly parcel", "Mostly LTL / freight", "Fulfillment and warehousing", "Fairly even split"],
      },
      ops: {
        question: "When something goes wrong with an order, who finds out first and how?",
        why: "Exception handling shows the real maturity.",
        options: ["The customer tells us", "Someone spots it manually", "Our system flags it", "We rarely get surprised"],
      },
      cx: {
        question: "After checkout, what does your customer actually hear from you?",
        why: "Post-purchase silence is the usual culprit.",
        options: ["Just a confirmation", "Carrier tracking link", "Our own branded updates", "Full proactive comms"],
      },
    };
    return NextResponse.json({ ok: true, ...(fallback[r.weakest.key] ?? fallback.cost), generated: false });
  }

  // ── ask: conversation against their own result ─────────────────────────────
  if (body.mode === "ask") {
    const q = (body.question || "").trim();
    if (!q) return NextResponse.json({ ok: false, error: "question_required" }, { status: 400 });
    const r = scoreAssessment(answers);

    const out = await llm(
      `You are a ShipTime Plus logistics engineer answering a prospect's question about their own Logistics Performance Score. Be genuinely useful — this is the moment that earns the call, not a place to withhold.

THEIR RESULT
LPS ${r.total}/100 (${r.band}). Cost ${r.pillars[0].score}/100, Operations ${r.pillars[1].score}/100, Customer experience ${r.pillars[2].score}/100.
${body.company ? `Company: ${body.company}` : ""}
${body.priority ? `Stated priority: ${body.priority}` : ""}

THEIR ANSWERS (maturity 1-5)
${answerDigest(answers)}

BIGGEST WEIGHTED GAPS
${r.gaps.slice(0, 5).map((g) => `${g.question.title}: ${g.level}/5, −${g.lost} pts`).join("\n")}

THEIR QUESTION: "${q}"

Answer in 2-4 short sentences, grounded in their actual answers above. If the honest answer is "it depends on something we don't know yet", say what that something is. If the question is outside logistics, say so briefly and redirect to their score.
${VOICE}`,
      false,
    );

    return NextResponse.json({
      ok: true,
      answer:
        out?.trim() ||
        "I couldn't reach the model just then. Your score and gaps are all on this page — and the fastest way to get a straight answer on this one is a short call with one of our engineers.",
    });
  }

  return NextResponse.json({ ok: false, error: "unknown_mode" }, { status: 400 });
}
