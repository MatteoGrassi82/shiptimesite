import { after, type NextRequest, NextResponse } from "next/server";
import { QUESTIONS, scoreAssessment, type Answers } from "@/lib/lps";
import { generateReport, renderReportHtml } from "@/lib/lps-report";

// ── The Logistics Performance Score shiplet ──────────────────────────────────
// The first agentic "shiplet" (Michael + Matteo, 2026-08-18 prep call). This
// route is the scoring half: it scores Michael's 16-question framework
// server-side and lands the lead in HubSpot with the scores attached, so sales
// can act and results can feed the Logistics Performance Index later.
//
// Deliberate choices:
//  · Scoring happens HERE, not on the client. The client computes the same
//    numbers for instant feedback, but the figure that reaches the CRM (and
//    one day the LPI benchmark) is never a number the browser sent us.
//  · This route does NOT call the LLM. Scoring must feel instant — the dial
//    animates the moment it returns — so the written report streams separately
//    from /api/lps/report while the visitor is already reading their numbers.
//  · Fail-soft: a dead HubSpot still returns a real score. They answered
//    sixteen questions; they get their result regardless.
//
// `deliver: "email"` is the Parcel Forum flow (decided 2026-08-20, reaffirmed
// on the 24th): the visitor sees their score the moment they submit, and the
// written report is mailed an hour later so it reads like a person wrote it
// rather than a form that answered instantly. The hour of patience belongs to
// HubSpot, not to us — this route generates the report *after* the response
// (`after`, so nobody waits on the model), parks it on the contact, and stamps
// `lps_report_ready_at`. A HubSpot workflow enrols on that stamp, waits an
// hour, and sends. See PARCELFORUM-REPORT-EMAIL.md for the portal side.

export const runtime = "nodejs";
// Long enough for the response *plus* the report generated in `after`.
export const maxDuration = 60;

type Body = {
  email?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  priority?: string;
  priorityOther?: string;
  answers?: Answers;
  microAnswers?: { question: string; answer: string }[];
  utm?: Record<string, string>;
  /** "live" (default) shows the report on screen; "email" mails it later. */
  deliver?: "live" | "email";
};

/** One door to the HubSpot sink. Both writes go through /api/lead rather than
 *  the CRM API directly, so the upsert, the unknown-property strip-and-retry
 *  and the timeline note all stay in one place. */
async function postLead(origin: string, referer: string, payload: Record<string, string | undefined>) {
  const res = await fetch(`${origin}/api/lead`, {
    method: "POST",
    headers: { "content-type": "application/json", referer },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) return { ok: false, saved: false as boolean | null };
  const data = (await res.json().catch(() => ({}))) as { saved?: boolean | null };
  return { ok: true, saved: data.saved ?? null };
}


export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const email = body.email?.trim();
  const answers = body.answers || {};

  if (!email) return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
  if (Object.keys(answers).length < QUESTIONS.length) {
    return NextResponse.json({ ok: false, error: "incomplete" }, { status: 400 });
  }

  const result = scoreAssessment(answers);
  const priority = body.priority === "Other" ? body.priorityOther || "Other" : body.priority;

  // Hand the lead to the existing HubSpot sink rather than re-implementing the
  // upsert, note-writing and unknown-property retry logic that already lives
  // there and is battle-tested.
  const origin = new URL(req.url).origin;
  const referer = req.headers.get("referer") || "";
  let saved: boolean | null = null;
  try {
    const r = await postLead(origin, referer, {
      email,
      firstname: body.firstname,
      lastname: body.lastname,
      company: body.company,
      lead_source: "Logistics Performance Assessment",
      ...(body.utm || {}),
      // Labels the timeline block; not stored as HubSpot properties.
      scorecard_name: "Logistics Performance Score",
      scorecard_scale: "100",
      scorecard_of: String(QUESTIONS.length),
      scorecard_total: String(result.total),
      scorecard_band: result.band,
      scorecard_answered: String(result.answered),
      scorecard_areas: result.pillars.map((p) => `${p.abbr} ${p.score}`).join(" · "),
      scorecard_weakest: result.weakest.name,
      scorecard_detail: [
        `LPS ${result.total}/100 (${result.band})`,
        ...result.pillars.map((p) => `${p.scoreName} (${p.abbr}): ${p.score}/100`),
        priority ? `12-month priority: ${priority}` : "",
        ...(body.microAnswers || []).map((m) => `Follow-up — ${m.question} → ${m.answer}`),
        "",
        "Biggest weighted gaps:",
        ...result.gaps.slice(0, 5).map((g) => `• ${g.question.title} — level ${g.level}/5 (−${g.lost} pts)`),
      ]
        .filter(Boolean)
        .join("\n"),
    });
    saved = r.ok ? r.saved : false;
  } catch (e) {
    console.error("[lps] lead handoff failed", (e as Error).message);
    saved = false;
  }

  // Write the report onto the contact once the visitor already has their
  // response. Deliberately after the response and deliberately second: the
  // contact must exist before we patch a report onto it, and a slow or dead
  // model must never delay the number on screen.
  if (body.deliver === "email") {
    after(async () => {
      const report = await generateReport({
        answers,
        company: body.company,
        priority,
        microAnswers: body.microAnswers,
      });

      // No report, no stamp. `lps_report_ready_at` is the workflow's enrolment
      // trigger, so leaving it unset is what stops HubSpot mailing an empty
      // report — the lead is still in the CRM for a human to pick up.
      if (!report) {
        console.error("[lps] report generation produced nothing, no email will be sent", { email });
        return;
      }

      // The three body sections go in as HTML because their HubSpot properties
      // are rich text — see renderReportHtml for why that isn't optional.
      const html = renderReportHtml(report);
      const wrote = await postLead(origin, referer, {
        email,
        no_note: "1",
        lps_report_headline: report.headline,
        lps_report_read: html.read,
        lps_report_priorities: html.priorities,
        lps_report_closing: html.closing,
        lps_report_ready_at: new Date().toISOString(),
      }).catch((e) => {
        console.error("[lps] report write threw", (e as Error).message);
        return { ok: false, saved: false as boolean | null };
      });

      console.log("[lps/report]", JSON.stringify({
        email, priorities: report.priorities.length, saved: wrote.saved, at: new Date().toISOString(),
      }));
    });
  }

  // The score is logged either way — it's the raw material for the Logistics
  // Performance Index, and this line is what makes a run recoverable if the
  // CRM write was the thing that failed.
  console.log("[lps]", JSON.stringify({
    email, company: body.company ?? null, total: result.total, band: result.band,
    cps: result.pillars[0].score, oes: result.pillars[1].score, ces: result.pillars[2].score,
    priority: priority ?? null, saved, delivery: body.deliver ?? "live", at: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true, result, saved, delivery: body.deliver ?? "live" });
}
