"use client";

import { createContext, useContext, useState } from "react";
import { ChevronRight, Paperclip, Plus, X } from "lucide-react";
import { useScenario } from "./derive";
import { Actor, Avatar, personByName, SUPPORT } from "./People";
import { Badge, Button, FOCUS, PageHeader, Panel, T, Tabs, Td, Th, type View } from "./ui";

// ── Requests ─────────────────────────────────────────────────────────────────
// One list of everything you've asked, opened from wherever you were: a
// shipment, an invoice line, a warehouse, a rule (Datadog's "create from
// here"). Four states the customer understands (Intercom, Zendesk), and one way
// of saying when you'll hear back, paused while we wait on you (Plain). Every
// request keeps a link to what it's about, and opens to its thread.

export type About = { kind: "Shipment" | "Invoice" | "Warehouse" | "Rule" | "Go-live" | "App" | "General"; label: string; view?: View };
export type RequestState = "Submitted" | "In progress" | "Waiting on you" | "Resolved";
export type Message = { who: string; at: string; text: string };
export type Req = { id: string; title: string; about: About; state: RequestState; owner?: string; promise: string; created: string; thread: Message[] };

const tone = { Submitted: "neutral", "In progress": "info", "Waiting on you": "warning", Resolved: "positive" } as const;

export function requestsFor(one: boolean, partner: string, you: string): Req[] {
  if (!one) return [
    { id: "R-212", title: "Charged for 3 lb, the parcel was 1.2 lb", about: { kind: "Invoice", label: "Sep 16–30 · carrier adjustment", view: "billing" }, state: "Resolved", owner: SUPPORT.name, promise: "Answered in 6 hours", created: "Oct 9",
      thread: [{ who: you, at: "Oct 9, 9:12 am", text: "UPS charged us for 3 lb on a 1.2 lb parcel. Can you check?" }, { who: SUPPORT.name, at: "Oct 9, 3:20 pm", text: "You're right: the carrier measured the wrong box. We disputed it and the $6.40 credit is on your next invoice." }] },
  ];
  return [
    { id: "R-1048", title: "Damaged parcel: refund or reship?", about: { kind: "Shipment", label: "SHP-48196", view: "shipments" }, state: "In progress", owner: "Matteo Grassi", promise: "Reply by 12:05 pm", created: "Today, 10:05 am",
      thread: [{ who: you, at: "Today, 10:05 am", text: "The customer sent a photo of a crushed box. Can we reship today and claim from the carrier?" }, { who: "Matteo Grassi", at: "Today, 10:30 am", text: "Yes. I've booked the reship for this afternoon and opened the claim. I'll confirm the credit date by noon." }] },
    { id: "R-1046", title: "Why a residential surcharge on this line?", about: { kind: "Invoice", label: "Oct 1–15 · carrier adjustments", view: "billing" }, state: "Waiting on you", owner: "Matteo Grassi", promise: "Paused until you reply", created: "Yesterday, 2:10 pm",
      thread: [{ who: you, at: "Yesterday, 2:10 pm", text: "We're seeing residential surcharges on what should be business addresses." }, { who: "Matteo Grassi", at: "Yesterday, 3:45 pm", text: "Can you send me two or three order numbers? I'll check them against the carrier's address list." }] },
    { id: "R-1044", title: `Add a second dock door at ${partner}`, about: { kind: "Warehouse", label: partner, view: "network" }, state: "Submitted", promise: "First reply by 11:05 am", created: "Today, 9:05 am",
      thread: [{ who: you, at: "Today, 9:05 am", text: `Holiday volume is up. Can ${partner} give us a second dock door from November?` }] },
    { id: "R-1031", title: "Hold orders over $2,000 for review", about: { kind: "Rule", label: "New rule", view: "rules" }, state: "Resolved", owner: "Marc Leblanc", promise: "Answered in 38 minutes", created: "Oct 14",
      thread: [{ who: you, at: "Oct 14, 11:02 am", text: "Can we hold any order over $2,000 so our team checks it before it ships?" }, { who: "Marc Leblanc", at: "Oct 14, 11:40 am", text: "Done: it's a rule now, at the top of your list. Held orders show on Home under Needs you." }] },
  ];
}

// Any page can open the "ask about this" drawer.
export const AskContext = createContext<(about: About) => void>(() => {});
export const useAsk = () => useContext(AskContext);

export function RequestsPage({ requests, open }: { requests: Req[]; open: (id: string) => void }) {
  const ask = useAsk();
  const { tier } = useScenario();
  const [tab, setTab] = useState<"open" | "you" | "done">("open");
  const groups = {
    open: requests.filter((r) => r.state === "Submitted" || r.state === "In progress"),
    you: requests.filter((r) => r.state === "Waiting on you"),
    done: requests.filter((r) => r.state === "Resolved"),
  };
  const rows = groups[tab];
  return (
    <div>
      <PageHeader title="Requests" subtitle={tier === "Koherent" ? "Everything you've asked your Koherent team, who has it, and when you'll hear back." : "Everything you've asked our support team, and when you'll hear back."} actions={<Button primary onClick={() => ask({ kind: "General", label: "General question" })}><Plus className="h-4 w-4" /> Ask a question</Button>} />
      <Tabs items={[{ id: "open", label: "Open", count: groups.open.length }, { id: "you", label: "Waiting on you", count: groups.you.length }, { id: "done", label: "Resolved", count: groups.done.length }]} value={tab} onChange={setTab} />
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead><tr><Th>Request</Th><Th>About</Th><Th>State</Th><Th>Owner</Th><Th right>When you&rsquo;ll hear back</Th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const owner = r.owner ? personByName(r.owner) ?? SUPPORT : undefined;
              return (
                <tr key={r.id} onClick={() => open(r.id)} className="cursor-pointer hover:bg-[color:var(--c-hover)]">
                  <Td><div className="py-1"><div className="font-medium text-[color:var(--c-ink)]">{r.title}</div><div className="text-[12px] text-[color:var(--c-muted)]"><span style={{ fontFamily: T.mono }}>{r.id}</span>, {r.created}</div></div></Td>
                  <Td><span className="text-[13px] text-[color:var(--c-text)]">{r.about.kind}: {r.about.label}</span></Td>
                  <Td><Badge tone={tone[r.state]}>{r.state}</Badge></Td>
                  <Td>{owner ? <span className="inline-flex items-center gap-2"><Avatar p={owner} size={22} /><span className="text-[13px]">{owner.name.split(" ")[0]}</span></span> : <span className="text-[13px] text-[color:var(--c-muted)]">Being assigned</span>}</Td>
                  <Td right><span className="inline-flex items-center gap-2"><span className={`text-[13px] ${r.state === "Resolved" ? "text-[#217005]" : r.state === "Waiting on you" ? "text-[#B13600]" : "text-[color:var(--c-text)]"}`}>{r.promise}</span><ChevronRight className="h-4 w-4 text-[color:var(--c-faint)]" /></span></Td>
                </tr>
              );
            })}
            {!rows.length && <tr><td colSpan={5} className="py-10 text-center text-[14px] text-[color:var(--c-muted)]">Nothing here.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RequestDetail({ req, back, go }: { req: Req; back: () => void; go: (v: View) => void }) {
  const [reply, setReply] = useState("");
  const [thread, setThread] = useState(req.thread);
  const { account } = useScenario();
  return (
    <div className="max-w-[760px]">
      <PageHeader back={{ label: "Requests", onClick: back }} title={req.title} status={<Badge tone={tone[req.state]}>{req.state}</Badge>}
        subtitle={<>{req.about.view ? <button type="button" onClick={() => go(req.about.view!)} className={`font-medium text-[color:var(--c-link)] hover:underline ${FOCUS}`}>{req.about.kind}: {req.about.label}</button> : `${req.about.kind}: ${req.about.label}`}. {req.promise}.</>} />
      <ol className="space-y-4">
        {thread.map((m) => (
          <li key={m.at + m.who} className="flex gap-3">
            {m.who === account.user.name ? <Avatar p={{ initials: account.user.initials, color: "var(--c-ink)", online: true }} size={28} /> : <Actor name={m.who === SUPPORT.name ? "ShipTime" : m.who} size={28} />}
            <div className="min-w-0 flex-1"><div className="text-[13px]"><b className="text-[color:var(--c-ink)]">{m.who === account.user.name ? "You" : m.who}</b> <span className="text-[color:var(--c-muted)]">{m.at}</span></div><p className="mt-0.5 text-[14px] text-[color:var(--c-text)]">{m.text}</p></div>
          </li>
        ))}
      </ol>
      {req.state !== "Resolved" && (
        <Panel className="mt-6 p-3">
          <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply" className="h-20 w-full resize-none text-[14px] outline-none" />
          <div className="flex justify-end"><Button small primary onClick={() => { if (reply.trim()) { setThread([...thread, { who: account.user.name, at: "Just now", text: reply.trim() }]); setReply(""); } }}>Send reply</Button></div>
        </Panel>
      )}
    </div>
  );
}

export function AskDrawer({ about, onClose, onSend }: { about: About; onClose: () => void; onSend: (title: string) => void }) {
  const { tier } = useScenario();
  const one = tier === "Koherent";
  const [text, setText] = useState("");
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-[#0B1F3A]/30" onClick={onClose} style={{ fontFamily: T.font }}>
      <div className="flex h-full w-full max-w-[420px] flex-col bg-white shadow-[0_15px_35px_rgba(0,0,0,.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[color:var(--c-line)] px-5 py-4">
          <div className="text-[16px] font-semibold text-[color:var(--c-ink)]">{one ? "Ask your Koherent team" : "Ask support"}</div>
          <button type="button" onClick={onClose} aria-label="Close" className={`rounded p-1 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <div className="text-[12px] font-medium text-[color:var(--c-muted)]">About</div>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-[color:var(--c-line)] bg-[color:var(--c-subtle)] px-2 py-1 text-[13px] text-[color:var(--c-text)]"><Paperclip className="h-3.5 w-3.5 text-[color:var(--c-muted)]" /> {about.kind}: {about.label}</span>
          </div>
          <div>
            <label htmlFor="ask" className="text-[12px] font-medium text-[color:var(--c-muted)]">Your question</label>
            <textarea id="ask" autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="What would you like us to look at?" className="mt-1 h-32 w-full rounded-md border border-[color:var(--c-border)] p-3 text-[14px] outline-none focus:border-[color:var(--c-accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--c-accent)_18%,transparent)]" />
          </div>
          <div className="rounded-md bg-[color:var(--c-subtle)] p-3 text-[13px] text-[color:var(--c-text)]">{one ? "Goes to Matteo Grassi, your account manager. First reply within 2 business hours, here and by email." : "Goes to our support team. Reply within 1 business day, here and by email."}</div>
        </div>
        <div className="flex justify-end gap-2 border-t border-[color:var(--c-line)] px-5 py-3">
          <Button small onClick={onClose}>Cancel</Button>
          <Button small primary onClick={() => text.trim() && onSend(text.trim())}>Send</Button>
        </div>
      </div>
    </div>
  );
}
