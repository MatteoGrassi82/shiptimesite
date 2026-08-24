import { type NextRequest } from "next/server";
import { type Answers } from "@/lib/lps";
import { LPS_MODEL, buildReportPrompt } from "@/lib/lps-report";

// ── Streaming report writer ──────────────────────────────────────────────────
// The commentary streams token-by-token instead of arriving as a finished
// block. That isn't decoration: the assessment is an *agentic* shiplet, and a
// silent two-second pause followed by finished text reads exactly like a
// static form. Watching it get written is the difference.
//
// The model emits plain text with ##SECTION markers rather than JSON, because
// partial JSON can't be rendered as it arrives — half an object is a syntax
// error, but half a sentence is just a sentence. The client re-parses the
// accumulated buffer on every chunk.

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    answers?: Answers;
    company?: string;
    priority?: string;
    microAnswers?: { question: string; answer: string }[];
  };

  const prompt = buildReportPrompt({
    answers: body.answers || {},
    company: body.company,
    priority: body.priority,
    microAnswers: body.microAnswers,
  });

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return new Response("##HEADLINE\nYour score is ready.\n##READ\nWe couldn't reach the model to write your commentary, but your scores and gaps below are complete and accurate.\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: LPS_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 700,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    console.error("[lps/report] upstream", upstream.status);
    return new Response("##HEADLINE\nYour score is ready.\n##READ\nThe commentary didn't come through this time — your scores below are complete.\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Unwrap OpenAI's SSE into a plain text stream so the client just reads text.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buf = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const payload = t.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const tok = JSON.parse(payload)?.choices?.[0]?.delta?.content;
              if (tok) controller.enqueue(encoder.encode(tok));
            } catch {
              /* partial frame — the next chunk completes it */
            }
          }
        }
      } catch (e) {
        console.error("[lps/report] stream broke", (e as Error).message);
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
