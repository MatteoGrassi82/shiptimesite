"use client";

import { CalendarClock, MessageSquare } from "lucide-react";
import { Button } from "./ui";

// ── The account team ─────────────────────────────────────────────────────────
// ShipTime One accounts get named people (Shopify Plus's merchant success
// model). Only people actually on the account are shown, with real presence:
// online or away, local time, a measured reply time, and who covers when
// they're out (Intercom's and Pylon's rule). Initials stand in for photos until
// the team's own headshots are in.

export type Person = { name: string; role: string; initials: string; color: string; city: string; online: boolean; detail: string };

export const TEAM: Person[] = [
  { name: "Priya Shah", role: "Account manager", initials: "PS", color: "#2E4C8F", city: "Toronto", online: true, detail: "10:42 am in Toronto · usually replies in about 40 min" },
  { name: "Marc Leblanc", role: "Network engineer", initials: "ML", color: "#0F766E", city: "Montréal", online: false, detail: "Away · back at 1:00 pm your time · Priya covers" },
];

export const SUPPORT: Person = { name: "ShipTime support", role: "Support team", initials: "ST", color: "#6A7383", city: "", online: true, detail: "Replies within 1 business day" };

export const personByName = (name: string) => TEAM.find((p) => p.name === name);

export function Avatar({ p, size = 32, dot = false }: { p: Pick<Person, "initials" | "color" | "online">; size?: number; dot?: boolean }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span className="inline-flex h-full w-full items-center justify-center rounded-full font-semibold text-white" style={{ background: p.color, fontSize: Math.round(size * 0.36) }}>{p.initials}</span>
      {dot && <span className={`absolute -bottom-px -right-px h-2.5 w-2.5 rounded-full border-2 border-white ${p.online ? "bg-[#16A34A]" : "bg-[#C0C8D2]"}`} />}
    </span>
  );
}

// The actor of a "handled for you" event: a person, or the ShipTime system.
export function Actor({ name, size = 20 }: { name: string; size?: number }) {
  const p = personByName(name) ?? { initials: "ST", color: "#1A1B25", online: true };
  return <Avatar p={p} size={size} />;
}

export function TeamCard({ onMessage }: { onMessage: () => void }) {
  return (
    <div className="rounded-lg border border-[#EBEEF1] bg-white p-4">
      <div className="text-[13px] font-semibold text-[#1A1B25]">Your ShipTime team</div>
      <ul className="mt-3 space-y-3">
        {TEAM.map((p) => (
          <li key={p.name} className="flex gap-3">
            <Avatar p={p} size={36} dot />
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-[#1A1B25]">{p.name} <span className="font-normal text-[#6A7383]">· {p.role}</span></div>
              <div className="text-[12px] text-[#6A7383]">{p.detail}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 border-t border-[#EBEEF1] pt-3 text-[13px] text-[#353A44]"><CalendarClock className="h-4 w-4 text-[#6A7383]" /> Next check-in: Thu, Oct 23 at 2:00 pm · weekly review</div>
      <div className="mt-3 flex gap-2"><Button small primary onClick={onMessage}><MessageSquare className="h-3.5 w-3.5" /> Message</Button><Button small>Book a call</Button></div>
    </div>
  );
}

export function TeamMini({ onMessage }: { onMessage: () => void }) {
  return (
    <div className="mx-1 rounded-lg bg-[#F5F6F8] p-3">
      <div className="text-[12px] font-semibold text-[#6A7383]">Your team</div>
      {TEAM.map((p) => (
        <div key={p.name} className="mt-2 flex items-center gap-2">
          <Avatar p={p} size={24} dot />
          <div className="min-w-0 leading-4"><div className="truncate text-[13px] text-[#1A1B25]">{p.name}</div><div className="truncate text-[11px] text-[#6A7383]">{p.role}</div></div>
        </div>
      ))}
      <button type="button" onClick={onMessage} className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2E4C8F]"><MessageSquare className="h-3.5 w-3.5" /> Message</button>
    </div>
  );
}
