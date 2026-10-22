"use client";

import { useState } from "react";
import { ArrowDown, Check, CircleCheck, Download, GripVertical, MessageSquare, Play, Plus, Send } from "lucide-react";
import { money, useScenario } from "./derive";
import { Actor, Avatar, personByName, TeamCard } from "./People";
import { useAsk } from "./Requests";
import { method, type Rule, type Scenario } from "./scenarios";
import { Badge, Button, PageHeader, Panel, SectionTitle, Td, Th } from "./ui";

// ── ShipTime One: rules, projects and reports ───────────────────────────────
// Rules borrow from Stripe Radar (a rule reads as one sentence and is tested on
// past orders before it's turned on, with a shadow mode that only reports) and
// Shopify's order routing (a ranked list, first match wins, a default at the
// bottom). The go-live project borrows from GuideCX (target vs forecast date,
// who's holding the date), Linear (milestones, a pinned status update) and
// meeting tools like Gong and Fathom (recap → decisions → tasks, each linked
// to the moment in the recording). Tasks pulled from a call stay "proposed"
// until the account manager confirms them.

export type RuleStatus = Rule["status"] | "Dismissed";
const ruleTone = { Live: "positive", Shadow: "info", Suggested: "warning", Dismissed: "neutral" } as const;
const perMonth = (n: number) => money(n).replace(".00", "");

// A city per state or province, for sample orders in a rule's test.
const CITY: Record<string, string> = { WA: "Seattle, WA", OR: "Portland, OR", CA: "Los Angeles, CA", NV: "Las Vegas, NV", ID: "Boise, ID", UT: "Salt Lake City, UT", AZ: "Tucson, AZ", OH: "Cleveland, OH", IN: "Indianapolis, IN", MI: "Detroit, MI", IL: "Chicago, IL", KY: "Louisville, KY", PA: "Pittsburgh, PA", WV: "Charleston, WV", GA: "Savannah, GA", FL: "Orlando, FL", SC: "Columbia, SC", NC: "Charlotte, NC", AL: "Birmingham, AL", TN: "Nashville, TN", TX: "Dallas, TX", OK: "Tulsa, OK", LA: "New Orleans, LA", AR: "Little Rock, AR", NM: "Albuquerque, NM", ON: "Ottawa, ON", QC: "Montréal, QC", BC: "Kelowna, BC", AB: "Calgary, AB", SK: "Regina, SK", MB: "Winnipeg, MB" };

function samplesFor(rule: Rule, sc: Scenario) {
  const codes = (rule.if.join(" ").match(/\b[A-Z]{2}\b/g) ?? []).filter((c) => CITY[c]);
  const places = codes.length ? codes.map((c) => CITY[c]) : sc.cities.map((c) => c.city);
  const home = sc.sites[0].name.split(",")[0];
  const saving = rule.monthly / Math.max(rule.matched, 1);
  return [0, 1, 2, 3].map((i) => {
    const was = 9.1 + ((i * 173) % 400) / 100 + saving;
    return { order: `#${sc.account.initials}-${10391 - i * 7}`, to: places[i % places.length], was: `${home} · UPS · ${money(was)}`, now: `${rule.site} · ${rule.carrier.split(",")[0]} · ${money(Math.max(was - saving, 2.1))}` };
  });
}

export function RulesPage({ statuses, open }: { statuses: Record<string, RuleStatus>; open: (id: string) => void }) {
  const sc = useScenario();
  const suggested = sc.rules.filter((r) => statuses[r.id] === "Suggested");
  const active = sc.rules.filter((r) => statuses[r.id] === "Live" || statuses[r.id] === "Shadow");
  const live = sc.rules.filter((r) => statuses[r.id] === "Live");
  return (
    <div className="space-y-8">
      <PageHeader title="Rules" subtitle="Which site and which carrier each order uses. Your team writes them from your own orders and tests them on last month. Nothing changes until you approve." actions={<Button><Plus className="h-4 w-4" /> New rule</Button>} />
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#EBEEF1] bg-[#EBEEF1] sm:grid-cols-3">
        {[["Rules live", `${live.length} of ${active.length}`], ["Saving from rules", `${perMonth(live.reduce((a, r) => a + r.monthly, 0) + (sc.defaultRule?.monthly ?? 0))} a month`], ["Waiting for you", suggested.length ? `${suggested.length} suggested · ${perMonth(suggested.reduce((a, r) => a + r.monthly, 0))} a month` : "Nothing"]].map(([l, v]) => (
          <div key={l} className="bg-white p-4"><div className="text-[12px] text-[#6A7383]">{l}</div><div className="mt-1 text-[16px] font-semibold tabular-nums text-[#1A1B25]">{v}</div></div>
        ))}
      </div>

      {suggested.length > 0 && (
        <section>
          <SectionTitle>Suggested by your team</SectionTitle>
          <div className="mt-3 space-y-3">
            {suggested.map((r) => {
              const p = personByName(r.by);
              return (
                <Panel key={r.id} className="flex flex-wrap items-center gap-4 p-4">
                  {p && <Avatar p={p} size={32} />}
                  <div className="min-w-[240px] flex-1">
                    <div className="text-[14px] font-semibold text-[#1A1B25]">{r.name}</div>
                    <div className="text-[13px] text-[#6A7383]">{r.why}</div>
                  </div>
                  <div className="text-[13px] text-[#353A44]">Tested on September: <b>{r.matched.toLocaleString()}</b> orders · <b className="text-[#217005]">−{perMonth(r.monthly)}</b> a month</div>
                  <Button small primary onClick={() => open(r.id)}>Review</Button>
                </Panel>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionTitle action={<span className="text-[12px] text-[#6A7383]">Checked top to bottom · the first match wins</span>}>Active</SectionTitle>
        <ul className="mt-1 divide-y divide-[#EBEEF1]">
          {active.map((r, i) => (
            <li key={r.id}>
              <button type="button" onClick={() => open(r.id)} className="flex w-full items-center gap-3 py-3 text-left hover:bg-[#F6F8FA]">
                <GripVertical className="h-4 w-4 shrink-0 text-[#C0C8D2]" />
                <span className="w-5 text-[13px] tabular-nums text-[#6A7383]">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-[#1A1B25]">{r.name}</span>
                  <span className="block truncate text-[12px] text-[#6A7383]">If {r.if.join(" and ")} → {r.site}, {r.carrier.toLowerCase()}</span>
                </span>
                <Badge tone={ruleTone[statuses[r.id]]}>{statuses[r.id]}</Badge>
                <span className="hidden w-[170px] text-right text-[13px] text-[#353A44] sm:block">{statuses[r.id] === "Shadow" ? <span className="text-[#6A7383]">would match {r.matched.toLocaleString()}</span> : <>{r.matched.toLocaleString()} orders · <span className="text-[#217005]">−{perMonth(r.monthly)}</span></>}</span>
              </button>
            </li>
          ))}
          {sc.defaultRule && (
            <li className="flex items-center gap-3 py-3 text-[13px] text-[#6A7383]"><span className="w-4" /><span className="w-5" /><span className="flex-1"><span className="font-medium text-[#353A44]">Default</span> · {sc.defaultRule.text}</span>{sc.defaultRule.monthly > 0 && <span className="w-[170px] text-right text-[#217005]">−{perMonth(sc.defaultRule.monthly)}</span>}</li>
          )}
        </ul>
      </section>
    </div>
  );
}

export function RuleDetail({ id, status, setStatus, back }: { id: string; status: RuleStatus; setStatus: (s: RuleStatus) => void; back: () => void }) {
  const sc = useScenario();
  const ask = useAsk();
  const r = sc.rules.find((x) => x.id === id)!;
  const p = personByName(r.by);
  const samples = samplesFor(r, sc);
  const block = (label: string, body: React.ReactNode, last = false) => (
    <div className="relative pl-16">
      <span className="absolute left-0 top-3 w-12 text-[11px] font-semibold tracking-wide text-[#6A7383]">{label}</span>
      <div className="rounded-lg border border-[#D8DEE4] bg-white px-4 py-3 text-[14px] text-[#1A1B25]">{body}</div>
      {!last && <div className="flex justify-center py-1 text-[#C0C8D2]"><ArrowDown className="h-4 w-4" /></div>}
    </div>
  );
  return (
    <div>
      <button type="button" onClick={back} className="mb-3 text-[14px] font-semibold text-[#2E4C8F] hover:underline">Rules ›</button>
      <PageHeader kicker="Rule" title={<span className="inline-flex flex-wrap items-center gap-3">{r.name}<Badge tone={ruleTone[status]}>{status}</Badge></span>}
        actions={<Button onClick={() => ask({ kind: "Rule", label: r.name, view: "rules" })}><MessageSquare className="h-4 w-4" /> Ask about this rule</Button>} />
      {p && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-[#F5F6F8] p-3">
          <Avatar p={p} size={28} />
          <div className="text-[13px] text-[#353A44]"><b className="text-[#1A1B25]">{p.name}</b> <span className="text-[#6A7383]">· {p.role} · suggested Oct 18</span><div className="mt-0.5">&ldquo;{r.why}&rdquo;</div></div>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          <section className="max-w-[620px]">
            {block("WHEN", r.when ?? "An order comes in from any channel")}
            {block("IF", <div className="flex flex-wrap items-center gap-1.5">{r.if.map((c, i) => <span key={c} className="inline-flex items-center gap-1.5">{i > 0 && <span className="text-[12px] font-semibold text-[#6A7383]">AND</span>}<span className="rounded-md bg-[#F5F6F8] px-2 py-1 text-[13px]">{c}</span></span>)}</div>)}
            {block("THEN", <div className="flex flex-wrap gap-x-6 gap-y-1"><span><span className="text-[#6A7383]">Ship from</span> <b>{r.site}</b></span><span><span className="text-[#6A7383]">Carrier</span> <b>{r.carrier}</b></span></div>, true)}
          </section>
          <section>
            <SectionTitle>Orders it matched last month</SectionTitle>
            <div className="overflow-x-auto">
              <table className="mt-1 w-full min-w-[620px] border-collapse">
                <thead><tr><Th>Order</Th><Th>Ship to</Th><Th>What happened</Th><Th>With this rule</Th></tr></thead>
                <tbody>
                  {samples.map((x) => (
                    <tr key={x.order}><Td muted>{x.order}</Td><Td>{x.to}</Td><Td muted>{x.was}</Td><Td><span className="text-[#217005]">{x.now}</span></Td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[12px] text-[#6A7383]">Showing 4 of {r.matched.toLocaleString()}. Testing reads past orders only; it never buys a label.</p>
          </section>
          <section>
            <SectionTitle>Activity</SectionTitle>
            <ul className="mt-3 space-y-2 text-[13px] text-[#353A44]">
              <li>Oct 18 · {r.by} suggested it from September&rsquo;s orders</li>
              <li>Oct 18 · Tested on Sep 1–30: {r.matched.toLocaleString()} orders matched</li>
              {status === "Shadow" && <li>Oct 19 · Running in shadow: reporting only, no labels changed</li>}
              {status === "Live" && <li>Oct 19 · Approved by {sc.account.user.name} and turned on</li>}
              {status === "Dismissed" && <li>Today · Dismissed by {sc.account.user.name}</li>}
            </ul>
          </section>
        </div>
        <aside>
          <Panel className="p-4">
            <div className="text-[13px] font-semibold text-[#1A1B25]">Tested on Sep 1–30</div>
            <dl className="mt-3 space-y-3">
              <div><dt className="text-[12px] text-[#6A7383]">Orders matched</dt><dd className="text-[22px] font-semibold tabular-nums text-[#1A1B25]">{r.matched.toLocaleString()} <span className="text-[13px] font-normal text-[#6A7383]">{r.share}% of orders</span></dd></div>
              <div><dt className="text-[12px] text-[#6A7383]">Saving</dt><dd className="text-[22px] font-semibold tabular-nums text-[#217005]">{perMonth(r.monthly)} <span className="text-[13px] font-normal text-[#6A7383]">a month</span></dd></div>
              <div><dt className="text-[12px] text-[#6A7383]">Delivery</dt><dd className="text-[16px] font-semibold text-[#1A1B25]">{r.faster}</dd></div>
            </dl>
            <div className="mt-4 space-y-2 border-t border-[#EBEEF1] pt-4">
              {status === "Suggested" && <><Button primary onClick={() => setStatus("Live")}><Check className="h-4 w-4" /> Approve and turn on</Button><div className="flex gap-2"><Button small onClick={() => setStatus("Shadow")}>Run in shadow first</Button><Button small onClick={() => setStatus("Dismissed")}>Dismiss</Button></div></>}
              {status === "Shadow" && <><Button primary onClick={() => setStatus("Live")}>Turn on now</Button><p className="text-[12px] text-[#6A7383]">In shadow, the rule reports what it would have done and changes nothing.</p></>}
              {status === "Live" && <div className="flex gap-2"><Button small onClick={() => setStatus("Shadow")}>Pause to shadow</Button><Button small>Edit</Button></div>}
              {status === "Dismissed" && <Button small onClick={() => setStatus("Suggested")}>Restore</Button>}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

// ── The go-live project ──────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const addDays = (d: string, n: number) => { const [m, day] = d.split(" "); const t = new Date(2026, MONTHS.indexOf(m), +day + n); return `${MONTHS[t.getMonth()]} ${t.getDate()}`; };

type Side = "You" | "ShipTime" | "Warehouse";
type Task = { task: string; side: Side; owner: string; phase: string; due: string; state: "Done" | "Open" | "Late"; source?: string; proposed?: boolean };

function projectFor(sc: Scenario) {
  const site = sc.nextSite!.name.split(",")[0];
  const you = sc.account.user.name;
  const tasks: Task[] = [
    { task: `Sign the ${site} warehouse agreement`, side: "ShipTime", owner: "Priya Shah", phase: "Plan", due: "Oct 9", state: "Done" },
    { task: "Send 6 months of order history", side: "You", owner: you, phase: "Assess", due: "Oct 6", state: "Done" },
    { task: `Approve which SKUs go to ${site}`, side: "You", owner: you, phase: "Design", due: "Oct 24", state: "Open", source: "Oct 21 call ▶ 07:55" },
    { task: `Approve the ${site} delivery zones`, side: "You", owner: you, phase: "Design", due: "Oct 30", state: "Open", source: "Oct 21 call ▶ 04:12" },
    { task: `Share the pallet label spec`, side: "Warehouse", owner: `${site} warehouse lead`, phase: "Design", due: "Oct 20", state: "Late", source: "Oct 14 call ▶ 21:02" },
    { task: `Connect ${site} to your order system`, side: "ShipTime", owner: "Marc Leblanc", phase: "Design", due: "Nov 6", state: "Open", source: "Oct 14 call ▶ 15:20" },
    { task: "Send a label printer to the dock", side: "ShipTime", owner: "Marc Leblanc", phase: "Test", due: "Nov 10", state: "Open", source: "Oct 21 call ▶ 26:40", proposed: true },
    { task: "First inbound truck received", side: "Warehouse", owner: `${site} warehouse lead`, phase: "Test", due: "Nov 13", state: "Open" },
    { task: "Test labels and first live orders", side: "You", owner: you, phase: "Test", due: "Nov 18", state: "Open" },
  ];
  const meetings = [
    { date: "Oct 21", title: "Weekly check-in", length: "32 min", people: `${you}, Priya Shah, Marc Leblanc, ${site} warehouse lead`,
      recap: `We agreed the ${site} delivery zones and moved the order-system test to Friday. The pallet label spec is two days late on the warehouse side.`,
      decided: [[`${site} serves the states closest to it`, "04:12"], [`Go-live stays ${sc.nextSite!.date}`, "11:40"]],
      created: tasks.filter((t) => t.source?.startsWith("Oct 21")) },
    { date: "Oct 14", title: "Design review", length: "45 min", people: `${you}, Priya Shah, Marc Leblanc`,
      recap: `We picked the first 40 SKUs for ${site} from last quarter's orders and agreed how labels get printed at the dock.`,
      decided: [["Start with 40 SKUs, 81% of the orders in the zone", "09:30"]],
      created: tasks.filter((t) => t.source?.startsWith("Oct 14")) },
    { date: "Oct 7", title: "Kickoff", length: "58 min", people: `${you}, Priya Shah, Marc Leblanc`,
      recap: "We walked through the plan, the owners on each side and the target date.",
      decided: [[`Target go-live ${sc.nextSite!.date}`, "22:05"]], created: [] },
  ];
  return { site, tasks, meetings, phases: [["Assess", 100], ["Plan", 100], ["Design", 60], ["Test", 0], ["Go live", 0], ["Improve", 0]] as [string, number][] };
}

function Stamp({ at }: { at: string }) {
  return <button type="button" title="Play from here" className="inline-flex items-center gap-0.5 rounded bg-[#F5F6F8] px-1.5 text-[12px] font-semibold text-[#2E4C8F] hover:bg-[#EBEEF1]"><Play className="h-3 w-3" />{at}</button>;
}

export function ProjectPage() {
  const sc = useScenario();
  const ask = useAsk();
  const { site, tasks: start, meetings, phases } = projectFor(sc);
  const [tasks, setTasks] = useState(start);
  const [side, setSide] = useState<Side | "All">("All");
  const [openMeeting, setOpenMeeting] = useState(0);
  const late = tasks.some((t) => t.state === "Late");
  const forecast = late ? addDays(sc.nextSite!.date, 2) : sc.nextSite!.date;
  const mine = tasks.filter((t) => t.side === "You" && t.state !== "Done");
  const holding = (["You", "ShipTime", "Warehouse"] as Side[]).map((s) => ({ s, open: tasks.filter((t) => t.side === s && t.state !== "Done").length, late: tasks.filter((t) => t.side === s && t.state === "Late").length }));
  const shown = tasks.filter((t) => side === "All" || t.side === side);
  const markDone = (task: string) => setTasks(tasks.map((t) => (t.task === task ? { ...t, state: "Done" } : t)));
  return (
    <div className="space-y-6">
      <PageHeader kicker="Project" title={`${site} go-live`}
        subtitle={<span>Target {sc.nextSite!.date} · forecast <b className={late ? "text-[#B13600]" : "text-[#217005]"}>{forecast}</b> · {sc.nextSite!.daysLeft} days to go</span>}
        actions={<><Badge tone={late ? "warning" : "positive"}>{late ? "At risk" : "On track"}</Badge><Button onClick={() => ask({ kind: "Project", label: `${site} go-live`, view: "golive" })}><MessageSquare className="h-4 w-4" /> Request</Button><Button><Send className="h-4 w-4" /> Share</Button></>} />

      <Panel className="p-4">
        <ol className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {phases.map(([name, pct]) => {
            const current = pct > 0 && pct < 100;
            return (
              <li key={name}>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1B25]">
                  <span className={`inline-block h-2.5 w-2.5 rotate-45 ${pct === 100 ? "bg-[#16A34A]" : current ? "bg-[#EC5A26]" : "border border-[#C0C8D2]"}`} />{name}
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EBEEF1]"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? "#16A34A" : "#EC5A26" }} /></div>
                <div className="mt-1 text-[12px] text-[#6A7383]">{pct === 100 ? "Done" : current ? `${pct}%` : "Not started"}</div>
              </li>
            );
          })}
        </ol>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-8">
          <section>
            <SectionTitle action={<Badge tone={mine.length ? "warning" : "positive"}>{mine.length}</Badge>}>Needs you</SectionTitle>
            <ul className="mt-1 divide-y divide-[#EBEEF1]">
              {mine.map((t) => (
                <li key={t.task} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-[220px] flex-1"><div className="text-[14px] font-medium text-[#1A1B25]">{t.task}</div><div className="text-[12px] text-[#6A7383]">Due {t.due}{t.source && <> · from the {t.source.split(" ▶")[0]}</>}</div></div>
                  <Button small primary onClick={() => markDone(t.task)}>Mark done</Button>
                </li>
              ))}
              {!mine.length && <li className="py-6 text-[14px] text-[#6A7383]">Nothing needs you right now.</li>}
            </ul>
          </section>

          <section>
            <SectionTitle action={<span className="text-[12px] text-[#6A7383]">Recorded with everyone&rsquo;s OK · checked by Priya</span>}>Meetings</SectionTitle>
            <div className="mt-3 space-y-3">
              {meetings.map((m, i) => (
                <Panel key={m.date} className="p-4">
                  <button type="button" onClick={() => setOpenMeeting(openMeeting === i ? -1 : i)} className="flex w-full flex-wrap items-center gap-3 text-left">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1B25] text-white"><Play className="h-3.5 w-3.5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold text-[#1A1B25]">{m.title} · {m.date}</span><span className="block truncate text-[12px] text-[#6A7383]">{m.length} · {m.people}</span></span>
                    <span className="inline-flex items-center gap-1 text-[12px] text-[#217005]"><Check className="h-3.5 w-3.5" /> Reviewed by Priya</span>
                  </button>
                  {openMeeting === i && (
                    <div className="mt-4 space-y-3 border-t border-[#EBEEF1] pt-3 text-[14px]">
                      <p className="text-[#353A44]">{m.recap}</p>
                      <div>
                        <div className="text-[12px] font-semibold text-[#6A7383]">Decided</div>
                        <ul className="mt-1 space-y-1">{m.decided.map(([d, at]) => <li key={d} className="flex flex-wrap items-center gap-2 text-[#1A1B25]"><span>{d}</span><Stamp at={at} /></li>)}</ul>
                      </div>
                      {m.created.length > 0 && (
                        <div>
                          <div className="text-[12px] font-semibold text-[#6A7383]">Tasks created ({m.created.length})</div>
                          <ul className="mt-1 space-y-1">{m.created.map((t) => <li key={t.task} className="flex flex-wrap items-center gap-2 text-[#1A1B25]"><span>{t.task}</span><span className="text-[12px] text-[#6A7383]">→ {t.side === "You" ? "you" : t.owner} · {t.due}</span><Stamp at={t.source!.split("▶ ")[1]} />{t.proposed && <Badge>Proposed · Priya confirms</Badge>}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  )}
                </Panel>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle action={
              <div className="flex gap-1 text-[13px] font-semibold">{(["All", "You", "ShipTime", "Warehouse"] as const).map((s) => <button key={s} type="button" onClick={() => setSide(s)} className={`rounded px-2 py-0.5 ${side === s ? "bg-[#1A1B25] text-white" : "text-[#353A44] hover:bg-[#F6F8FA]"}`}>{s}</button>)}</div>
            }>All tasks</SectionTitle>
            <div className="overflow-x-auto">
              <table className="mt-1 w-full min-w-[640px] border-collapse">
                <thead><tr><Th>Task</Th><Th>Owner</Th><Th>Phase</Th><Th right>Due</Th></tr></thead>
                <tbody>
                  {shown.map((t) => (
                    <tr key={t.task} className="hover:bg-[#F6F8FA]">
                      <Td><span className="inline-flex flex-wrap items-center gap-2">{t.state === "Done" ? <CircleCheck className="h-4 w-4 shrink-0 text-[#217005]" /> : <span className="h-4 w-4 shrink-0 rounded-full border border-[#C0C8D2]" />}<span className={t.state === "Done" ? "text-[#6A7383] line-through" : ""}>{t.task}</span>{t.proposed && <Badge>Proposed</Badge>}</span></Td>
                      <Td muted>{t.side === "You" ? "You" : t.owner}</Td>
                      <Td muted>{t.phase}</Td>
                      <Td right>{t.state === "Late" ? <span className="font-semibold text-[#B13600]">2 days late</span> : t.state === "Done" ? <span className="text-[#6A7383]">Done</span> : t.due}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <Panel className="p-4">
            <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-[#1A1B25]">Latest update</span><Badge tone={late ? "warning" : "positive"}>{late ? "At risk" : "On track"}</Badge></div>
            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#6A7383]"><Actor name="Priya Shah" size={20} /> Priya Shah · today, 9:20 am</div>
            <p className="mt-2 text-[14px] text-[#353A44]">{late ? `The pallet label spec is two days late at the ${site} warehouse, which pushes the forecast to ${forecast}. I'm on it with them today. Nothing needed from you beyond the SKU approval.` : "Everything is on track for the target date."}</p>
            <p className="mt-2 text-[12px] text-[#6A7383]">Since last week: Design 40% → 60%, 2 tasks added from the Oct 21 call.</p>
          </Panel>
          <Panel className="p-4">
            <div className="text-[13px] font-semibold text-[#1A1B25]">Who&rsquo;s holding the date</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {holding.map((h) => (
                <div key={h.s} className={`rounded-md p-2 ${h.late ? "bg-[#FDF8C9]" : "bg-[#F5F6F8]"}`}>
                  <div className="text-[12px] text-[#6A7383]">{h.s}</div>
                  <div className="text-[16px] font-semibold tabular-nums text-[#1A1B25]">{h.open}</div>
                  <div className={`text-[11px] ${h.late ? "font-semibold text-[#B13600]" : "text-[#6A7383]"}`}>{h.late ? `${h.late} late` : "open"}</div>
                </div>
              ))}
            </div>
          </Panel>
          <TeamCard onMessage={() => ask({ kind: "Project", label: `${site} go-live`, view: "golive" })} />
          <p className="px-1 text-[12px] text-[#6A7383]">How we work, every time: {method.join(" → ")}.</p>
        </aside>
      </div>
    </div>
  );
}

export function Report() {
  const sc = useScenario();
  return (
    <div className="space-y-6">
      <PageHeader kicker="Monthly report" title="Last month, all sites" subtitle="The same numbers every month. Each one has a written definition." actions={<Button><Download className="h-4 w-4" /> PDF</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sc.report!.numbers.map((n) => (
          <Panel key={n.label} className="p-4">
            <div className="text-[13px] text-[#6A7383]">{n.label}</div>
            <div className="mt-1 text-[24px] font-semibold tabular-nums text-[#1A1B25]">{n.value}</div>
            <div className="text-[13px] font-semibold text-[#217005]">{n.change}</div>
          </Panel>
        ))}
      </div>
      <section>
        <SectionTitle>What happened, and what&rsquo;s next</SectionTitle>
        <ul className="mt-3 space-y-2">
          {sc.report!.notes.map((n) => <li key={n} className="text-[14px] text-[#353A44]">· {n}</li>)}
        </ul>
      </section>
    </div>
  );
}
