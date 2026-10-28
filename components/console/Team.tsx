"use client";

import { useState } from "react";
import { Check, Eye, LogOut, X } from "lucide-react";
import { ScoreMark } from "./brand";
import { invoiceFor, TODAY } from "./derive";
import { useToast } from "./Feedback";
import { Avatar, TEAM } from "./People";
import { scenarios, type BrandId } from "./scenarios";
import { Badge, Button, FOCUS, SectionTitle, T, Td, Th, type View } from "./ui";

// ── The account team's side (internal) ──────────────────────────────────────
// What Priya sees when she signs in: one queue across her accounts, most
// urgent first, each line with one action; then her accounts, with the
// numbers the customer sees plus the one they never do (our margin), and
// "View as customer" to open exactly what they see. The way merchant success
// managers worked at Shopify Plus: the work comes to you in one list. Anything
// drafted for her (call tasks, the monthly note) waits for her to confirm or
// sign. It's ShipTime's own tool, so it carries the internal name.

export type ViewAs = (b: BrandId, v?: View, ids?: { request?: string }) => void;

type Item = { id: string; when: string; urgent?: boolean; account: BrandId; what: string; why: string; action: string; run: "open" | "note" | string };

const BOOK: BrandId[] = ["reach", "canada", "stores"];

const ITEMS: Item[] = [
  { id: "i1", when: "12:05 pm", urgent: true, account: "reach", what: "Reply: damaged parcel, refund or reship?", why: "Jordan asked at 10:05 am. The promised reply time is 12:05 pm.", action: "Open", run: "open" },
  { id: "i2", when: "Today", account: "canada", what: "3 parcels with no scan for 2 days", why: "Sam lets us reship anything under $100 and tell him after.", action: "Reship", run: "Reshipped 3 parcels. Sam sees it in tomorrow's daily note." },
  { id: "i3", when: "Today", account: "reach", what: "Confirm a task from the Oct 21 call: send a label printer to the dock", why: "Proposed from the recording, for Marc, due Nov 10. Jordan sees it once you confirm.", action: "Confirm", run: "Confirmed. It's on the Atlanta go-live for Marc." },
  { id: "i4", when: "Tomorrow", account: "stores", what: "Dana hasn't confirmed next week's Riverside store order", why: "14 pallets, pre-filled from last year. Riverside needs it by tomorrow noon.", action: "Nudge", run: "Reminder sent to Dana Kim, with the order attached." },
  { id: "i5", when: "Nov 5", account: "reach", what: "October note, drafted from the work log", why: "64 entries this month. Check the numbers, then sign.", action: "Edit and sign", run: "note" },
];

const NOTE = `October, four months in:

Reno: West Coast orders arrive in 1.6 days instead of 4.8. 2-day reach is 74%, past the 70% goal.

Cost per order is $11.21, down from $12.30 in July. Memphis should take it under the $11.00 goal.

Next: approve the Memphis SKUs by Oct 26 so the Jan 13 go-live holds.`;

export function TeamConsole({ onViewAs, onSignOut }: { onViewAs: ViewAs; onSignOut: () => void }) {
  const toast = useToast();
  const [done, setDone] = useState<string[]>([]);
  const [note, setNote] = useState(false);
  const priya = TEAM[0];
  const open = ITEMS.filter((i) => !done.includes(i.id));
  const finish = (i: Item, text: string) => { setDone([...done, i.id]); toast({ text }); };
  const book = BOOK.map((id) => {
    const sc = scenarios[id];
    const billed = invoiceFor(sc).total * 2;
    return { id, sc, sv: sc.service!, billed, gp: billed * sc.service!.margin };
  });
  const billed = book.reduce((a, b) => a + b.billed, 0);
  const gp = book.reduce((a, b) => a + b.gp, 0);
  const k = (n: number) => `$${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}K`;

  return (
    <div className="min-h-screen bg-white text-[color:var(--c-text)]" style={{ fontFamily: T.font }}>
      <header className="flex h-[60px] items-center gap-3 border-b border-[color:var(--c-line)] px-4 md:px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/shiptime-logo.svg" alt="ShipTime" width={110} height={34} className="h-6 w-auto" />
        <span className="whitespace-nowrap rounded border border-[color:var(--c-line)] px-1.5 py-0.5 text-[12px] font-semibold text-[color:var(--c-text)]">ShipTime One<span className="hidden sm:inline"> · Account team</span></span>
        <span className="ml-auto hidden text-[13px] text-[color:var(--c-muted)] sm:inline">Internal. Customers never see this.</span>
        <Avatar p={priya} size={30} dot />
        <button type="button" onClick={onSignOut} aria-label="Sign out" className={`rounded-md p-1.5 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}><LogOut className="h-4 w-4" /></button>
      </header>

      <main className="mx-auto max-w-[1100px] space-y-10 px-4 pb-16 pt-8 md:px-10">
        <section>
          <h1 className="text-[28px] font-bold leading-9 text-[color:var(--c-ink)]">Your day</h1>
          <p className="mt-1 text-[14px] text-[color:var(--c-muted)]">{TODAY}. {open.length ? `${open.length} things across your ${BOOK.length} accounts, most urgent first.` : "Nothing waiting on you."}</p>
          <ul className="mt-5 divide-y divide-[color:var(--c-line)] border-y border-[color:var(--c-line)]">
            {open.map((i) => {
              const sc = scenarios[i.account];
              return (
                <li key={i.id} className="grid grid-cols-[72px_1fr] items-start gap-x-4 gap-y-2 py-3.5 sm:grid-cols-[84px_170px_1fr_auto] sm:items-center">
                  <span className={`text-[13px] tabular-nums ${i.urgent ? "font-semibold text-[#B13600]" : "text-[color:var(--c-muted)]"}`}>{i.when}</span>
                  <span className="text-[13px] font-medium text-[color:var(--c-ink)] sm:order-none">{sc.account.name}</span>
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <div className="text-[14px] text-[color:var(--c-ink)]">{i.what}</div>
                    <div className="text-[12px] text-[color:var(--c-muted)]">{i.why}</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Button small primary={i.urgent} onClick={() => i.run === "open" ? onViewAs(i.account, "request", { request: "R-1048" }) : i.run === "note" ? setNote(true) : finish(i, i.run)}>{i.action}</Button>
                  </div>
                </li>
              );
            })}
            {!open.length && <li className="flex items-center gap-2 py-6 text-[14px] text-[color:var(--c-muted)]"><Check className="h-4 w-4 text-[#217005]" /> All done. New items show up here as they come in.</li>}
          </ul>
        </section>

        <section>
          <SectionTitle action={<span className="hidden text-[13px] text-[color:var(--c-muted)] sm:inline">{k(billed)} billed a month, {Math.round((gp / billed) * 100)}% margin</span>}>Your accounts</SectionTitle>
          <div className="overflow-x-auto">
            <table className="mt-1 w-full min-w-[900px] border-collapse">
              <thead><tr><Th>Account</Th><Th>Score</Th><Th>Goals</Th><Th right>Saved ÷ fees</Th><Th right>Our margin</Th><Th>Next go-live</Th><Th right>{""}</Th></tr></thead>
              <tbody>
                {book.map(({ id, sc, sv, gp: g }) => (
                  <tr key={id}>
                    <Td><div className="py-1"><div className="font-medium text-[color:var(--c-ink)]">{sc.account.name}</div><div className="text-[12px] text-[color:var(--c-muted)]">{sc.account.user.name}</div></div></Td>
                    <Td><span className="inline-flex items-center gap-2"><ScoreMark parts={sv.score.parts} size={18} />{sv.score.now}<span className="text-[12px] text-[#217005]">+{sv.score.now - sv.score.then}</span></span></Td>
                    <Td><span className="whitespace-nowrap">{sv.goals.filter((x) => x.progress >= 1).length} of {sv.goals.length} met</span></Td>
                    <Td right>{(sv.savedSince / sv.feesSince).toFixed(1)}×</Td>
                    <Td right><span className="whitespace-nowrap">{k(g)} a month <span className="text-[color:var(--c-muted)]">({Math.round(sv.margin * 100)}%)</span></span></Td>
                    <Td><span className="whitespace-nowrap">{sc.nextSite!.name.split(",")[0]}, {sc.nextSite!.date}</span>{sc.nextSite!.atRisk && <> <Badge tone="warning">At risk</Badge></>}</Td>
                    <Td right><Button small onClick={() => onViewAs(id)}><Eye className="h-3.5 w-3.5" /> View as customer</Button></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-[color:var(--c-muted)]">Margin is ours: partner and carrier costs against what we bill. It only shows here.</p>
        </section>
      </main>

      {note && <NoteDrawer onClose={() => setNote(false)} onSign={() => { setNote(false); finish(ITEMS[4], "Signed. It goes to Jordan with the October report on Nov 2."); }} />}
    </div>
  );
}

function NoteDrawer({ onClose, onSign }: { onClose: () => void; onSign: () => void }) {
  const [text, setText] = useState(NOTE);
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-[#0B1F3A]/30" onClick={onClose} style={{ fontFamily: T.font }}>
      <div className="flex h-full w-full max-w-[480px] flex-col bg-white shadow-[0_15px_35px_rgba(0,0,0,.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[color:var(--c-line)] px-5 py-4">
          <div>
            <div className="text-[16px] font-semibold text-[color:var(--c-ink)]">October note, Alder &amp; Stone</div>
            <div className="text-[12px] text-[color:var(--c-muted)]">Drafted from 64 work-log entries. Nothing goes out until you sign.</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className={`rounded p-1 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="h-[340px] w-full resize-none rounded-md border border-[color:var(--c-border)] p-3 text-[14px] leading-6 text-[color:var(--c-ink)] outline-none focus:border-[color:var(--c-accent)]" />
          <p className="mt-2 text-[12px] text-[color:var(--c-muted)]">Check the figures against Alder &amp; Stone&rsquo;s Results page before you sign.</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-[color:var(--c-line)] px-5 py-3">
          <Button small onClick={onClose}>Cancel</Button>
          <Button small primary onClick={onSign}>Sign</Button>
        </div>
      </div>
    </div>
  );
}
