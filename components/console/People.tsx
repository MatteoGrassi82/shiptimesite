"use client";

import { useState } from "react";
import { CalendarClock, MessageSquare, Phone, ShieldCheck, X } from "lucide-react";
import { KMark, useBrand } from "./brand";
import { useScenario } from "./derive";
import { useToast } from "./Feedback";
import { jobsAtStart, type Job, type JobMode } from "./scenarios";
import { Button, FOCUS, Segmented, T } from "./ui";

// ── The account team ─────────────────────────────────────────────────────────
// Koherent accounts get named people (Shopify Plus's merchant success
// model). Only people actually on the account are shown, with real presence:
// online or away, local time, a measured reply time, and who covers when
// they're out (Intercom's and Pylon's rule). A photo where we have one,
// initials until the rest of the team's headshots are in.

export type Person = { name: string; role: string; initials: string; color: string; city: string; online: boolean; detail: string; photo?: string };

export const TEAM: Person[] = [
  { name: "Matteo Grassi", role: "Account manager", initials: "MG", color: "#2E4C8F", city: "Toronto", online: true, detail: "Online now · usually replies within the hour.", photo: "/team/matteo-grassi.jpg" },
  { name: "Marc Leblanc", role: "Network engineer", initials: "ML", color: "#0F766E", city: "Montréal", online: false, detail: "Away until 1:00 pm your time. Matteo covers." },
];

export const SUPPORT: Person = { name: "ShipTime support", role: "Support team", initials: "ST", color: "#6A7383", city: "", online: true, detail: "Replies within 1 business day" };

export const personByName = (name: string) => TEAM.find((p) => p.name === name);

export function Avatar({ p, size = 32, dot = false }: { p: Pick<Person, "initials" | "color" | "online"> & { photo?: string }; size?: number; dot?: boolean }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {p.photo
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={p.photo} alt="" width={size} height={size} className="h-full w-full rounded-full object-cover" />
        : <span className="inline-flex h-full w-full items-center justify-center rounded-full font-semibold text-white" style={{ background: p.color, fontSize: Math.round(size * 0.36) }}>{p.initials}</span>}
      {dot && <span className={`absolute -bottom-px -right-px h-2.5 w-2.5 rounded-full border-2 border-[color:var(--c-surface)] ${p.online ? "bg-[#16A34A]" : "bg-[color:var(--c-border2)]"}`} />}
    </span>
  );
}

// The actor of a "handled for you" event: a person, or the platform itself
// (the K on Koherent accounts, ShipTime's initials otherwise).
export function Actor({ name, size = 20 }: { name: string; size?: number }) {
  const { brand, c } = useBrand();
  const p = personByName(name);
  if (p) return <Avatar p={p} size={size} />;
  if (brand === "koherent") return <span className="inline-flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size, background: c.action }}><KMark color="#F6F3EE" size={Math.round(size * 0.46)} /></span>;
  return <Avatar p={{ initials: "ST", color: c.ink, online: true }} size={size} />;
}

// The team card: the people (account manager, engineer, and the site lead on
// the ground), when you next meet, who to call when it's urgent, and what the
// team may do without asking. That last one is set in a drawer, one job per
// line (Ramp's and Shipwell's "do it / ask me first"), so the card stays short.
export function TeamCard({ onMessage }: { onMessage: () => void }) {
  const { service } = useScenario();
  const toast = useToast();
  const [jobs, setJobs] = useState<Job[]>(jobsAtStart);
  const [editing, setEditing] = useState(false);
  const people = service ? [...TEAM, { ...service.ground, color: "#8E6A2F", city: "", online: true }] : TEAM;
  const free = jobs.filter((j) => j.mode !== "ask").length;
  const row = "flex items-start gap-2 text-[13px] text-[color:var(--c-text)]";
  return (
    <div className="rounded-lg border border-[color:var(--c-line)] bg-white p-4">
      <div className="text-[13px] font-semibold text-[color:var(--c-ink)]">Your Koherent team</div>
      <ul className="mt-3 space-y-3">
        {people.map((p) => (
          <li key={p.name} className="flex gap-3">
            <Avatar p={p} size={36} dot={TEAM.includes(p as Person)} />
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-[color:var(--c-ink)]">{p.name} <span className="font-normal text-[color:var(--c-muted)]">· {p.role}</span></div>
              <div className="text-[12px] text-[color:var(--c-muted)]">{p.detail}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-2.5 border-t border-[color:var(--c-line)] pt-3">
        <div className={row}><CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /> Next weekly check-in: Wed, Oct 28 at 2:00 pm</div>
        <div className={row}><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /><span>Urgent: call Matteo, (416) 555-0142. Out of hours: the on-call team, (833) 555-0199.</span></div>
        <div className={row}><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /><span>We act without asking on {free} things and ask you first on {jobs.length - free}. <button type="button" onClick={() => setEditing(true)} className={`font-semibold text-[color:var(--c-link)] hover:underline ${FOCUS}`}>Change</button></span></div>
      </div>
      <div className="mt-3 flex gap-2"><Button small onClick={onMessage}><MessageSquare className="h-3.5 w-3.5" /> Ask</Button><Button small>Book a call</Button></div>
      {editing && <JobsDrawer jobs={jobs} onClose={() => setEditing(false)} onSave={(j) => { setJobs(j); setEditing(false); toast({ text: "Saved. Your team works this way from now on." }); }} />}
    </div>
  );
}

const MODES: { id: JobMode; label: string }[] = [{ id: "do", label: "Just do it" }, { id: "tell", label: "Do it, tell me" }, { id: "ask", label: "Ask me first" }];

function JobsDrawer({ jobs, onClose, onSave }: { jobs: Job[]; onClose: () => void; onSave: (j: Job[]) => void }) {
  const [draft, setDraft] = useState(jobs);
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-[#0B1F3A]/30" onClick={onClose} style={{ fontFamily: T.font }}>
      <div className="flex h-full w-full max-w-[440px] flex-col bg-white shadow-[0_15px_35px_rgba(0,0,0,.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[color:var(--c-line)] px-5 py-4">
          <div className="text-[16px] font-semibold text-[color:var(--c-ink)]">What your team can do without asking</div>
          <button type="button" onClick={onClose} aria-label="Close" className={`rounded p-1 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}><X className="h-4 w-4" /></button>
        </div>
        <ul className="flex-1 divide-y divide-[color:var(--c-line)] overflow-y-auto px-5">
          {draft.map((j, i) => (
            <li key={j.job} className="py-4">
              <div className="text-[14px] text-[color:var(--c-ink)]">{j.job}</div>
              <div className="mt-2">{j.locked ? <span className="text-[13px] text-[color:var(--c-muted)]">{j.locked}</span> : <Segmented options={MODES} value={j.mode} onChange={(m) => setDraft(draft.map((x, k) => (k === i ? { ...x, mode: m } : x)))} />}</div>
            </li>
          ))}
        </ul>
        <div className="border-t border-[color:var(--c-line)] px-5 py-3">
          <p className="mb-3 text-[12px] text-[color:var(--c-muted)]">Everything we do shows on Home and in your daily note, and can be undone the same day.</p>
          <div className="flex justify-end gap-2"><Button small onClick={onClose}>Cancel</Button><Button small primary onClick={() => onSave(draft)}>Save</Button></div>
        </div>
      </div>
    </div>
  );
}

export function TeamMini({ onMessage }: { onMessage: () => void }) {
  return (
    <div className="mx-1 rounded-lg bg-[color:var(--c-subtle)] p-3">
      <div className="text-[12px] font-semibold text-[color:var(--c-muted)]">Your Koherent team</div>
      {TEAM.map((p) => (
        <div key={p.name} className="mt-2 flex items-center gap-2">
          <Avatar p={p} size={24} dot />
          <div className="min-w-0 leading-4"><div className="truncate text-[13px] text-[color:var(--c-ink)]">{p.name}</div><div className="truncate text-[11px] text-[color:var(--c-muted)]">{p.role}</div></div>
        </div>
      ))}
      <button type="button" onClick={onMessage} className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--c-link)]"><MessageSquare className="h-3.5 w-3.5" /> Ask</button>
    </div>
  );
}
