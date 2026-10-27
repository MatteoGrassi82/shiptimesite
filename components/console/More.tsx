"use client";

import { useState } from "react";
import { Copy, KeyRound, Webhook } from "lucide-react";
import { apiKeys, requestLog, webhooks } from "./data";
import { Badge, Button, PageHeader, SectionTitle, T } from "./ui";

// ── Developers ───────────────────────────────────────────────────────────────
// Stripe's Workbench: keys, webhooks, and a request log as a split view
// (list on the left, the selected request on the right).

export function Developers() {
  const [sel, setSel] = useState(3);
  const r = requestLog[sel];
  return (
    <div className="space-y-8">
      <PageHeader title="Developers" subtitle="The same engine behind the app: rates, labels, tracking and billing, open to your own systems." actions={<><Button>API docs</Button><Button primary><KeyRound className="h-4 w-4" /> Create key</Button></>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="min-w-0">
          <SectionTitle>API keys</SectionTitle>
          <ul className="mt-2 divide-y divide-[color:var(--c-line)]">
            {apiKeys.map((k) => (
              <li key={k.name} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <div><div className="text-[14px] font-medium text-[color:var(--c-ink)]">{k.name}</div><div className="text-[12px] text-[color:var(--c-muted)]">Created {k.created} · last used {k.lastUsed}</div></div>
                <span className="inline-flex items-center gap-1.5 rounded bg-[color:var(--c-subtle)] px-2 py-1 text-[12px] text-[color:var(--c-text)]" style={{ fontFamily: T.mono }}>{k.value}<Copy className="h-3.5 w-3.5 text-[color:var(--c-muted)]" /></span>
              </li>
            ))}
          </ul>
        </section>
        <section className="min-w-0">
          <SectionTitle>Webhooks</SectionTitle>
          {webhooks.map((w) => (
            <div key={w.url} className="mt-3 flex items-start gap-3">
              <Webhook className="mt-0.5 h-4 w-4 text-[color:var(--c-muted)]" />
              <div className="min-w-0">
                <div className="truncate text-[13px] text-[color:var(--c-ink)]" style={{ fontFamily: T.mono }}>{w.url}</div>
                <div className="text-[12px] text-[color:var(--c-muted)]">{w.events}</div>
                <div className="mt-1 flex gap-2"><Badge tone="positive">{w.status}</Badge><Badge>{w.success} delivered</Badge></div>
              </div>
            </div>
          ))}
        </section>
      </div>
      <section>
        <SectionTitle>Request log</SectionTitle>
        <div className="mt-3 grid overflow-hidden rounded-lg border border-[color:var(--c-line)] lg:grid-cols-[1.2fr_1fr]">
          <div className="min-w-0 border-b border-[color:var(--c-line)] lg:border-b-0 lg:border-r">
            <div className="bg-[color:var(--c-subtle)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--c-muted)]">Today</div>
            {requestLog.map((q, i) => (
              <button key={q.time} type="button" onClick={() => setSel(i)} className={`flex w-full items-center gap-3 border-b border-[color:var(--c-line)] px-3 py-2 text-left text-[13px] last:border-b-0 ${sel === i ? "bg-[color:var(--c-accent-soft)]" : "hover:bg-[color:var(--c-hover)]"}`}>
                <Badge tone={q.status < 300 ? "positive" : "negative"}>{q.status}</Badge>
                <span className="font-semibold text-[color:var(--c-link)]" style={{ fontFamily: T.mono }}>{q.method}</span>
                <span className="min-w-0 flex-1 truncate text-[color:var(--c-text)]" style={{ fontFamily: T.mono }}>{q.path}</span>
                <span className="text-[12px] text-[color:var(--c-muted)]">{q.time}</span>
              </button>
            ))}
          </div>
          <div className="min-w-0 p-4">
            <div className="text-[14px] font-semibold text-[color:var(--c-ink)]" style={{ fontFamily: T.mono }}>{r.method} {r.path} <span className={r.status < 300 ? "text-[#217005]" : "text-[#C0123C]"}>{r.status}</span></div>
            <dl className="mt-3 space-y-1.5 text-[13px]">
              {[["Time", `Oct 21, ${r.time}`], ["Source", r.source], ["Duration", `${r.ms} ms`], ["API version", "2026-09-30"]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[100px_1fr]"><dt className="text-[color:var(--c-muted)]">{k}</dt><dd className="text-[color:var(--c-text)]">{v}</dd></div>
              ))}
            </dl>
            <pre className="mt-3 overflow-x-auto rounded-md bg-[#15171C] p-3 text-[12px] leading-5 text-[#E6EDF3]" style={{ fontFamily: T.mono }}>
              {r.status < 300
                ? `{\n  "id": "SHP-48213",\n  "status": "label_created",\n  "carrier": "ups",\n  "rate": { "amount": 842, "currency": "usd" },\n  "label_url": "https://…/labels/SHP-48213.pdf"\n}`
                : `{\n  "error": {\n    "type": "invalid_request",\n    "message": "${r.error}",\n    "param": "to.postal_code"\n  }\n}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
