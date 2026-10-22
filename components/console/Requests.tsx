"use client";

import { createContext, useContext, useState } from "react";
import { Paperclip, Plus, X } from "lucide-react";
import { useScenario } from "./derive";
import { Avatar, personByName, SUPPORT } from "./People";
import { Badge, Button, PageHeader, T, Td, Th, type View } from "./ui";

// ── Requests ─────────────────────────────────────────────────────────────────
// One list of everything you've asked us, opened from wherever you were: a
// shipment, an invoice line, a site, a rule (Datadog's "create from here").
// Four states the customer understands (Intercom, Zendesk), a visible promise
// that pauses while we wait on you (Plain), and every request keeps a link
// back to what it's about.

export type About = { kind: "Shipment" | "Invoice" | "Site" | "Rule" | "Project" | "General"; label: string; view?: View };
export type RequestState = "Submitted" | "In progress" | "Waiting on you" | "Resolved";
export type Req = { id: string; title: string; about: About; state: RequestState; owner?: string; promise: string; created: string };

const tone = { Submitted: "neutral", "In progress": "info", "Waiting on you": "warning", Resolved: "positive" } as const;

export function requestsFor(one: boolean, partner: string): Req[] {
  if (!one) return [
    { id: "R-212", title: "Charged for 3 lb, the parcel was 1.2 lb", about: { kind: "Invoice", label: "INV-0930 · carrier adjustment", view: "billing" }, state: "Resolved", owner: SUPPORT.name, promise: "Met · 6 hours", created: "Oct 9" },
  ];
  return [
    { id: "R-1048", title: "Damaged parcel: refund or reship?", about: { kind: "Shipment", label: "SHP-48196", view: "shipments" }, state: "In progress", owner: "Priya Shah", promise: "Reply in 1h 50m", created: "Today, 8:40 am" },
    { id: "R-1046", title: "Why a residential surcharge on this line?", about: { kind: "Invoice", label: "INV-1016 · carrier adjustments", view: "billing" }, state: "Waiting on you", owner: "Priya Shah", promise: "Paused: we asked for the order number", created: "Yesterday" },
    { id: "R-1044", title: `Add a second dock door at ${partner}`, about: { kind: "Site", label: partner, view: "network" }, state: "Submitted", owner: undefined, promise: "First reply by 11:30 am", created: "Today, 9:05 am" },
    { id: "R-1031", title: "Hold orders over $2,000 for review", about: { kind: "Rule", label: "New rule", view: "rules" }, state: "Resolved", owner: "Marc Leblanc", promise: "Met · 38 min", created: "Oct 14" },
  ];
}

// Any page can open the "ask about this" drawer.
export const AskContext = createContext<(about: About) => void>(() => {});
export const useAsk = () => useContext(AskContext);

export function RequestsPage({ requests, go }: { requests: Req[]; go: (v: View) => void }) {
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
      <PageHeader title="Requests" subtitle={tier === "ShipTime One" ? "Everything you've asked your team, with who has it and when you'll hear back." : "Everything you've asked our support team, with when you'll hear back."} actions={<Button primary onClick={() => ask({ kind: "General", label: "General question" })}><Plus className="h-4 w-4" /> New request</Button>} />
      <div className="flex gap-6 border-b border-[#EBEEF1] text-[14px] font-semibold">
        {([["open", "Open"], ["you", "Waiting on you"], ["done", "Resolved"]] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`-mb-px border-b-2 pb-2 ${tab === id ? "border-[#EC5A26] text-[#EC5A26]" : "border-transparent text-[#6A7383] hover:text-[#353A44]"}`}>{label} <span className="ml-1 font-normal">{groups[id].length}</span></button>
        ))}
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead><tr><Th>Request</Th><Th>About</Th><Th>State</Th><Th>Owner</Th><Th right>When you&rsquo;ll hear back</Th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const owner = r.owner ? personByName(r.owner) ?? SUPPORT : undefined;
              return (
                <tr key={r.id} className="hover:bg-[#F6F8FA]">
                  <Td><div className="py-1"><div className="font-medium text-[#1A1B25]">{r.title}</div><div className="text-[12px] text-[#6A7383]" style={{ fontFamily: T.mono }}>{r.id} · {r.created}</div></div></Td>
                  <Td>{r.about.view ? <button type="button" onClick={() => go(r.about.view!)} className="text-left text-[13px] font-medium text-[#2E4C8F] hover:underline">{r.about.kind} · {r.about.label}</button> : <span className="text-[13px] text-[#6A7383]">{r.about.label}</span>}</Td>
                  <Td><Badge tone={tone[r.state]}>{r.state}</Badge></Td>
                  <Td>{owner ? <span className="inline-flex items-center gap-2"><Avatar p={owner} size={22} /><span className="text-[13px]">{owner.name.split(" ")[0]}</span></span> : <span className="text-[13px] text-[#6A7383]">Being assigned</span>}</Td>
                  <Td right><span className={`text-[13px] ${r.state === "Resolved" ? "text-[#217005]" : r.state === "Waiting on you" ? "text-[#B13600]" : "text-[#353A44]"}`}>{r.promise}</span></Td>
                </tr>
              );
            })}
            {!rows.length && <tr><td colSpan={5} className="py-10 text-center text-[14px] text-[#6A7383]">Nothing here.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AskDrawer({ about, onClose, onSend }: { about: About; onClose: () => void; onSend: (title: string) => void }) {
  const { tier } = useScenario();
  const one = tier === "ShipTime One";
  const [text, setText] = useState("");
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-[#0B1F3A]/30" onClick={onClose} style={{ fontFamily: T.font }}>
      <div className="flex h-full w-full max-w-[420px] flex-col bg-white shadow-[0_15px_35px_rgba(0,0,0,.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#EBEEF1] px-5 py-4">
          <div className="text-[16px] font-semibold text-[#1A1B25]">{one ? "Ask your team" : "Ask support"}</div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-[#6A7383] hover:bg-[#F6F8FA]"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <div className="text-[12px] font-medium text-[#6A7383]">About</div>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-[#EBEEF1] bg-[#F5F6F8] px-2 py-1 text-[13px] text-[#353A44]"><Paperclip className="h-3.5 w-3.5 text-[#6A7383]" /> {about.kind} · {about.label}</span>
          </div>
          <div>
            <label htmlFor="ask" className="text-[12px] font-medium text-[#6A7383]">Your question</label>
            <textarea id="ask" autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="What would you like us to look at?" className="mt-1 h-32 w-full rounded-md border border-[#D8DEE4] p-3 text-[14px] outline-none focus:border-[#EC5A26] focus:shadow-[0_0_0_3px_rgba(236,90,38,.18)]" />
          </div>
          <div className="rounded-md bg-[#F5F6F8] p-3 text-[13px] text-[#353A44]">{one ? "Goes to Priya Shah, your account manager. First reply within 2 business hours; you'll see it here and by email." : "Goes to our support team. Reply within 1 business day; you'll see it here and by email."}</div>
        </div>
        <div className="flex justify-end gap-2 border-t border-[#EBEEF1] px-5 py-3">
          <Button small onClick={onClose}>Cancel</Button>
          <Button small primary onClick={() => onSend(text.trim() || `Question about ${about.label}`)}>Send</Button>
        </div>
      </div>
    </div>
  );
}
