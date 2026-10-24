"use client";

import { useState } from "react";
import { ArrowDown, Check, CircleCheck, Download, GripVertical, MessageSquare, Play, Plus, Send } from "lucide-react";
import { Chevrons } from "./brand";
import { money, useScenario } from "./derive";
import { useToast } from "./Feedback";
import { Actor, Avatar, personByName, TeamCard } from "./People";
import { useAsk } from "./Requests";
import { type Rule, type Scenario } from "./scenarios";
import { Badge, Button, PageHeader, Panel, SectionTitle, Stat, StatRow, Td, Th, type View } from "./ui";

// ── Koherent: rules, go-lives and the monthly report ────────────────────
// Rules borrow from Stripe Radar (a rule reads as one sentence and is tested on
// past orders before it's turned on; a test run shows what it would do and
// changes nothing) and Shopify's order routing (a ranked list, first match
// wins, a default at the bottom). The go-live borrows from GuideCX (target vs
// forecast, who's holding the date), Linear (milestones, a pinned update) and
// meeting tools like Gong and Fathom (recap, decisions, tasks, each linked to
// the moment in the recording). Tasks pulled from a call stay "proposed" until
// the account manager confirms them.

export type RuleStatus = Rule["status"] | "Dismissed";
const ruleTone = { Live: "positive", Shadow: "info", Suggested: "warning", Dismissed: "neutral" } as const;
const ruleLabel = { Live: "Live", Shadow: "Test run", Suggested: "Suggested", Dismissed: "Dismissed" } as const;
const perMonth = (n: number) => money(n).replace(".00", "");

// A city per state or province, for sample orders in a rule's test.
const CITY: Record<string, string> = { WA: "Seattle, WA", OR: "Portland, OR", CA: "Los Angeles, CA", NV: "Las Vegas, NV", ID: "Boise, ID", UT: "Salt Lake City, UT", AZ: "Tucson, AZ", OH: "Cleveland, OH", IN: "Indianapolis, IN", MI: "Detroit, MI", IL: "Chicago, IL", KY: "Louisville, KY", PA: "Pittsburgh, PA", WV: "Charleston, WV", GA: "Savannah, GA", FL: "Orlando, FL", SC: "Columbia, SC", NC: "Charlotte, NC", AL: "Birmingham, AL", TN: "Nashville, TN", MS: "Jackson, MS", TX: "Dallas, TX", OK: "Tulsa, OK", LA: "New Orleans, LA", AR: "Little Rock, AR", NM: "Albuquerque, NM", NY: "Brooklyn, NY", NJ: "Newark, NJ", MA: "Boston, MA", ON: "Ottawa, ON", QC: "Montréal, QC", BC: "Kelowna, BC", AB: "Calgary, AB", SK: "Regina, SK", MB: "Winnipeg, MB" };

function samplesFor(rule: Rule, sc: Scenario) {
  const codes = (rule.if.join(" ").match(/\b[A-Z]{2}\b/g) ?? []).filter((c) => CITY[c]);
  const places = codes.length ? codes.map((c) => CITY[c]) : sc.cities.map((c) => c.city);
  const home = sc.sites[0].name.split(",")[0];
  const avg = rule.monthly / Math.max(rule.matched, 1);
  return [0.85, 1.1, 0.95, 1.1].map((k, i) => {
    const was = 8.6 + ((i * 173) % 400) / 100 + avg;
    return { order: `#${sc.account.initials}-${10391 - i * 7}`, to: places[i % places.length], was: `${home} · UPS · ${money(was)}`, now: `${rule.site} · ${rule.carrier.split(",")[0]} · ${money(Math.max(was - avg * k, 2.1))}` };
  });
}

export function RulesPage({ statuses, open }: { statuses: Record<string, RuleStatus>; open: (id: string) => void }) {
  const sc = useScenario();
  const suggested = sc.rules.filter((r) => statuses[r.id] === "Suggested");
  const active = sc.rules.filter((r) => statuses[r.id] === "Live" || statuses[r.id] === "Shadow");
  const live = sc.rules.filter((r) => statuses[r.id] === "Live");
  return (
    <div className="space-y-8">
      <PageHeader title="Rules" subtitle="Which warehouse and which carrier each order uses. Your Koherent team writes them from your orders and tests them on last month. Nothing changes until you approve." actions={<Button><Plus className="h-4 w-4" /> New rule</Button>} />
      <StatRow>
        <Stat label="Rules live" value={live.length} sub={`${active.length - live.length} in a test run`} />
        <Stat label="Saving from rules" value={`${perMonth(live.reduce((a, r) => a + r.monthly, 0))} a month`} tone="good" sub={sc.defaultRule?.monthly ? `Plus ${perMonth(sc.defaultRule.monthly)} from comparing rates` : undefined} />
        <Stat label="Needs you" value={suggested.length} tone={suggested.length ? "warn" : undefined} sub={suggested.length ? `Worth ${perMonth(suggested.reduce((a, r) => a + r.monthly, 0))} a month` : "Nothing to approve"} />
      </StatRow>

      {suggested.length > 0 && (
        <section>
          <SectionTitle>Suggested by your Koherent team</SectionTitle>
          <div className="mt-3 space-y-3">
            {suggested.map((r) => {
              const p = personByName(r.by);
              return (
                <Panel key={r.id} className="flex flex-wrap items-center gap-4 p-4">
                  {p && <Avatar p={p} size={32} />}
                  <div className="min-w-[240px] flex-1">
                    <div className="text-[14px] font-semibold text-[color:var(--c-ink)]">{r.name}</div>
                    <div className="text-[13px] text-[color:var(--c-muted)]">{r.why}</div>
                  </div>
                  <div className="text-[13px] text-[color:var(--c-text)]">Tested on September: <b>{r.matched.toLocaleString()}</b> orders, <b className="text-[#217005]">{perMonth(r.monthly)}</b> a month less</div>
                  <Button small onClick={() => open(r.id)}>Review</Button>
                </Panel>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionTitle action={<span className="text-[12px] text-[color:var(--c-muted)]">Checked top to bottom. The first match wins.</span>}>Active</SectionTitle>
        <ul className="mt-1 divide-y divide-[color:var(--c-line)]">
          {active.map((r, i) => (
            <li key={r.id}>
              <button type="button" onClick={() => open(r.id)} className="flex w-full items-center gap-3 py-3 text-left hover:bg-[color:var(--c-hover)]">
                <GripVertical className="h-4 w-4 shrink-0 text-[color:var(--c-faint)]" aria-hidden />
                <span className="w-5 text-[13px] tabular-nums text-[color:var(--c-muted)]">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-[color:var(--c-ink)]">{r.name}</span>
                  <span className="block truncate text-[12px] text-[color:var(--c-muted)]">If {r.if.join(" and ")}, ship from {r.site} with {r.carrier}</span>
                </span>
                <Badge tone={ruleTone[statuses[r.id]]}>{ruleLabel[statuses[r.id]]}</Badge>
                <span className="hidden w-[170px] text-right text-[13px] text-[color:var(--c-text)] sm:block">{statuses[r.id] === "Shadow" ? <span className="text-[color:var(--c-muted)]">would match {r.matched.toLocaleString()}</span> : <>{r.matched.toLocaleString()} orders, <span className="text-[#217005]">{perMonth(r.monthly)}</span></>}</span>
              </button>
            </li>
          ))}
          {sc.defaultRule && (
            <li className="flex items-center gap-3 py-3 text-[13px] text-[color:var(--c-muted)]"><span className="w-4" /><span className="w-5" /><span className="flex-1"><span className="font-medium text-[color:var(--c-text)]">Everything else</span>: {sc.defaultRule.text}</span>{sc.defaultRule.monthly > 0 && <span className="w-[170px] text-right text-[#217005]">{perMonth(sc.defaultRule.monthly)}</span>}</li>
          )}
        </ul>
      </section>
    </div>
  );
}

export function RuleDetail({ id, statuses, setStatus, back }: { id: string; statuses: Record<string, RuleStatus>; setStatus: (s: RuleStatus) => void; back: () => void }) {
  const sc = useScenario();
  const ask = useAsk();
  const toast = useToast();
  const r = sc.rules.find((x) => x.id === id)!;
  const status = statuses[id];
  const p = personByName(r.by);
  const samples = samplesFor(r, sc);
  const ordered = sc.rules.filter((x) => statuses[x.id] !== "Dismissed");
  const position = ordered.findIndex((x) => x.id === id) + 1;
  const change = (s: RuleStatus, text: string) => { setStatus(s); toast({ text, action: { label: "All rules", onClick: back } }); };
  const block = (label: string, body: React.ReactNode, last = false) => (
    <div className="relative pl-16">
      <span className="absolute left-0 top-3 w-12 text-[11px] font-semibold tracking-wide text-[color:var(--c-muted)]">{label}</span>
      <div className="rounded-lg border border-[color:var(--c-border)] bg-white px-4 py-3 text-[14px] text-[color:var(--c-ink)]">{body}</div>
      {!last && <div className="flex justify-center py-1 text-[color:var(--c-faint)]"><ArrowDown className="h-4 w-4" /></div>}
    </div>
  );
  return (
    <div>
      <PageHeader back={{ label: "Rules", onClick: back }} title={r.name} status={<Badge tone={ruleTone[status]}>{ruleLabel[status]}</Badge>}
        actions={<Button onClick={() => ask({ kind: "Rule", label: r.name, view: "rules" })}><MessageSquare className="h-4 w-4" /> Ask about this rule</Button>} />
      {p && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-[color:var(--c-subtle)] p-3">
          <Avatar p={p} size={28} />
          <div className="text-[13px] text-[color:var(--c-text)]"><b className="text-[color:var(--c-ink)]">{p.name}</b> <span className="text-[color:var(--c-muted)]">{p.role}, {status === "Suggested" ? `suggested on ${r.since}` : `set up on ${r.since}`}</span><div className="mt-0.5">&ldquo;{r.why}&rdquo;</div></div>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          <section className="max-w-[620px]">
            {block("WHEN", r.when ?? "An order comes in from any channel")}
            {block("IF", <div className="flex flex-wrap items-center gap-1.5">{r.if.map((c, i) => <span key={c} className="inline-flex items-center gap-1.5">{i > 0 && <span className="text-[12px] font-semibold text-[color:var(--c-muted)]">AND</span>}<span className="rounded-md bg-[color:var(--c-subtle)] px-2 py-1 text-[13px]">{c}</span></span>)}</div>)}
            {block("THEN", <div className="flex flex-wrap gap-x-6 gap-y-1"><span><span className="text-[color:var(--c-muted)]">Ship from</span> <b>{r.site}</b></span><span><span className="text-[color:var(--c-muted)]">Carrier</span> <b>{r.carrier}</b></span></div>, true)}
            <p className="mt-3 pl-16 text-[13px] text-[color:var(--c-muted)]">{status === "Suggested" ? `Goes in at number ${position} of ${ordered.length}. Orders an earlier rule already catches keep their route.` : `Number ${position} of ${ordered.length}, checked top to bottom.`}</p>
          </section>
          <section>
            <SectionTitle>Orders it matched last month</SectionTitle>
            <div className="overflow-x-auto">
              <table className="mt-1 w-full min-w-[620px] border-collapse">
                <thead><tr><Th>Order</Th><Th>Ship to</Th><Th>Without this rule</Th><Th>With this rule</Th></tr></thead>
                <tbody>
                  {samples.map((x) => (
                    <tr key={x.order}><Td muted>{x.order}</Td><Td>{x.to}</Td><Td muted>{x.was}</Td><Td><span className="text-[#217005]">{x.now}</span></Td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[12px] text-[color:var(--c-muted)]">Showing 4 of {r.matched.toLocaleString()}. The test reads past orders only. It never buys a label.</p>
          </section>
          <section>
            <SectionTitle>History</SectionTitle>
            <ul className="mt-3 space-y-2 text-[13px] text-[color:var(--c-text)]">
              <li>{r.status === "Suggested" ? r.since : "Earlier"}: {r.by} suggested it from your orders</li>
              <li>Tested on Sep 1–30: {r.matched.toLocaleString()} orders matched, {perMonth(r.monthly)} a month less</li>
              {status === "Shadow" && <li>{r.status === "Shadow" ? r.since : "Today"}: test run started. It shows what it would do and changes nothing.</li>}
              {status === "Live" && r.status !== "Live" && <li>Today: approved by {sc.account.user.name} and turned on. Results show here after the first week.</li>}
              {status === "Live" && r.status === "Live" && <li>{r.since}: approved by {sc.account.user.name} and turned on. Since then: <b className="text-[#217005]">{perMonth(Math.round(r.monthly * 1.04 / 100) * 100)}</b> a month, against {perMonth(r.monthly)} expected.</li>}
              {status === "Dismissed" && <li>Today: dismissed by {sc.account.user.name}</li>}
            </ul>
          </section>
        </div>
        <aside>
          <Panel className="p-4">
            <div className="text-[13px] font-semibold text-[color:var(--c-ink)]">Tested on Sep 1–30</div>
            <dl className="mt-3 space-y-3">
              <div><dt className="text-[12px] text-[color:var(--c-muted)]">Orders matched</dt><dd className="text-[22px] font-semibold tabular-nums text-[color:var(--c-ink)]">{r.matched.toLocaleString()} <span className="text-[13px] font-normal text-[color:var(--c-muted)]">{r.share}% of orders</span></dd></div>
              <div><dt className="text-[12px] text-[color:var(--c-muted)]">Saving</dt><dd className="text-[22px] font-semibold tabular-nums text-[#217005]">{perMonth(r.monthly)} <span className="text-[13px] font-normal text-[color:var(--c-muted)]">a month</span></dd></div>
              <div><dt className="text-[12px] text-[color:var(--c-muted)]">Delivery</dt><dd className="text-[16px] font-semibold text-[color:var(--c-ink)]">{r.faster}</dd></div>
            </dl>
            <div className="mt-4 space-y-2 border-t border-[color:var(--c-line)] pt-4">
              {status === "Suggested" && <>
                <div className="grid gap-2"><Button primary onClick={() => change("Live", "Rule turned on. Your next labels follow it.")}><Check className="h-4 w-4" /> Approve and turn on</Button><Button onClick={() => change("Shadow", "Test run started. Priya will review it with you in 14 days.")}>Start a 14-day test run</Button></div>
                <p className="text-[12px] text-[color:var(--c-muted)]">A test run shows what the rule would do on your live orders and changes nothing.</p>
                <button type="button" onClick={() => change("Dismissed", "Rule dismissed. Priya will see why in your next check-in.")} className="text-[13px] font-semibold text-[color:var(--c-muted)] hover:text-[color:var(--c-ink)]">Dismiss</button>
              </>}
              {status === "Shadow" && <><Button primary onClick={() => change("Live", "Rule turned on. Your next labels follow it.")}>Turn it on now</Button><p className="text-[12px] text-[color:var(--c-muted)]">In a test run the rule shows what it would do and changes nothing.</p></>}
              {status === "Live" && <div className="flex flex-wrap gap-2"><Button small onClick={() => change("Shadow", "Back to a test run. Labels go back to the rule below it.")}>Switch back to a test run</Button><Button small>Edit</Button></div>}
              {status === "Dismissed" && <Button small onClick={() => change("Suggested", "Rule restored to your suggestions.")}>Restore</Button>}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

// ── The go-live ──────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const addDays = (d: string, n: number) => { const [m, day] = d.split(" "); const t = new Date(2027, MONTHS.indexOf(m), +day + n); return `${MONTHS[t.getMonth()]} ${t.getDate()}`; };

type Side = "You" | "Koherent" | "Warehouse";
type Task = { task: string; side: Side; owner: string; phase: string; due: string; state: "Done" | "Open" | "Late"; source?: string; proposed?: boolean };

function projectFor(sc: Scenario) {
  const site = sc.nextSite!.name.split(",")[0];
  const you = sc.account.user.name;
  const risk = !!sc.nextSite!.atRisk;
  const skuDue = sc.problems.find((p) => p.title.startsWith("Approve which SKUs"))?.due ?? "Oct 26";
  const tasks: Task[] = [
    { task: `Sign the ${site} warehouse agreement`, side: "Koherent", owner: "Priya Shah", phase: "Plan", due: "Oct 9", state: "Done" },
    { task: "Send 6 months of order history", side: "You", owner: you, phase: "Assess", due: "Oct 6", state: "Done" },
    { task: `Approve which SKUs go to ${site}`, side: "You", owner: you, phase: "Design", due: skuDue, state: "Open", source: "Oct 21 call ▶ 07:55" },
    { task: `Approve the ${site} delivery zones`, side: "You", owner: you, phase: "Design", due: "Oct 30", state: "Open", source: "Oct 21 call ▶ 04:12" },
    { task: "Send the pallet label spec", side: "Warehouse", owner: `${site} warehouse lead`, phase: "Design", due: "Oct 20", state: risk ? "Late" : "Done", source: "Oct 14 call ▶ 21:02" },
    { task: `Connect ${site} to your order system`, side: "Koherent", owner: "Marc Leblanc", phase: "Design", due: "Nov 6", state: "Open", source: "Oct 14 call ▶ 15:20" },
    { task: "Send a label printer to the dock", side: "Koherent", owner: "Marc Leblanc", phase: "Test", due: "Nov 10", state: "Open", source: "Oct 21 call ▶ 26:40", proposed: true },
    { task: "First inbound truck received", side: "Warehouse", owner: `${site} warehouse lead`, phase: "Test", due: "Dec 1", state: "Open" },
    { task: "Test labels and first live orders", side: "You", owner: you, phase: "Test", due: "Jan 6", state: "Open" },
  ];
  const meetings = [
    { date: "Oct 21", title: "Weekly check-in", length: "32 min", people: `${you}, Priya Shah, Marc Leblanc, ${site} warehouse lead`,
      recap: `We drafted the ${site} delivery zones and moved the order-system test to Friday. ${risk ? "The pallet label spec from the warehouse is a day late." : "The warehouse sent the pallet label spec on time."}`,
      decided: [[`Go-live moves to ${sc.nextSite!.date}, after peak season`, "11:40"], ["Order-system test moves to Friday", "06:20"]],
      created: tasks.filter((t) => t.source?.startsWith("Oct 21")) },
    { date: "Oct 14", title: "Design review", length: "45 min", people: `${you}, Priya Shah, Marc Leblanc`,
      recap: `We picked the first 40 SKUs for ${site} from last quarter's orders and agreed how labels get printed at the dock.`,
      decided: [["Start with 40 SKUs, 81% of the orders in the zone", "09:30"]],
      created: tasks.filter((t) => t.source?.startsWith("Oct 14")) },
    { date: "Oct 7", title: "Kickoff", length: "58 min", people: `${you}, Priya Shah, Marc Leblanc`,
      recap: "We walked through the plan, the owners on each side and the target date.",
      decided: [["Aim to go live before peak season", "22:05"]], created: [] },
  ];
  return { site, tasks, meetings, phases: [["Assess", 100], ["Plan", 100], ["Design", 60], ["Test", 0], ["Go live", 0], ["Improve", 0]] as [string, number][] };
}

function Stamp({ at }: { at: string }) {
  return <button type="button" title="Play from here" className="inline-flex items-center gap-0.5 rounded bg-[color:var(--c-subtle)] px-1.5 text-[12px] font-semibold text-[color:var(--c-link)] hover:bg-[color:var(--c-line)]"><Play className="h-3 w-3" />{at}</button>;
}

export function ProjectPage() {
  const sc = useScenario();
  const ask = useAsk();
  const toast = useToast();
  const { site, tasks: start, meetings, phases } = projectFor(sc);
  const [tasks, setTasks] = useState(start);
  const [side, setSide] = useState<Side | "All">("All");
  const [openMeeting, setOpenMeeting] = useState(0);
  const late = tasks.some((t) => t.state === "Late");
  const forecast = late ? addDays(sc.nextSite!.date, 2) : sc.nextSite!.date;
  const mine = tasks.filter((t) => t.side === "You" && t.state !== "Done");
  const holding = (["You", "Koherent", "Warehouse"] as Side[]).map((s) => ({ s, open: tasks.filter((t) => t.side === s && t.state !== "Done").length, late: tasks.filter((t) => t.side === s && t.state === "Late").length }));
  const shown = tasks.filter((t) => side === "All" || t.side === side);
  const finish = (task: string) => { setTasks(tasks.map((t) => (t.task === task ? { ...t, state: "Done" } : t))); toast({ text: `Done: ${task}. Priya has been told.` }); };
  return (
    <div className="space-y-6">
      <PageHeader title={`${site} go-live`} status={<Badge tone={late ? "warning" : "positive"}>{late ? "At risk" : "On track"}</Badge>}
        subtitle={<>Target {sc.nextSite!.date}. Forecast <b className={late ? "text-[#B13600]" : "text-[#217005]"}>{forecast}</b>. {sc.nextSite!.daysLeft} days to go.</>}
        actions={<><Button onClick={() => ask({ kind: "Go-live", label: `${site} go-live`, view: "golive" })}><MessageSquare className="h-4 w-4" /> Ask</Button><Button><Send className="h-4 w-4" /> Share</Button></>} />

      <Panel className="p-4">
        <ol className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {phases.map(([name, pct]) => {
            const current = pct > 0 && pct < 100;
            return (
              <li key={name}>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--c-ink)]">
                  <span className={`inline-block h-2.5 w-2.5 rotate-45 ${pct === 100 ? "bg-[#16A34A]" : current ? "bg-[color:var(--c-accent)]" : "border border-[color:var(--c-faint)]"}`} />{name}
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[color:var(--c-line)]"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? "#16A34A" : "var(--c-accent)" }} /></div>
                <div className="mt-1 text-[12px] text-[color:var(--c-muted)]">{pct === 100 ? "Done" : current ? `${pct}%` : "Not started"}</div>
              </li>
            );
          })}
        </ol>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <aside className="space-y-4 lg:order-last">
          <Panel className="p-4">
            <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-[color:var(--c-ink)]">Latest update</span><Badge tone={late ? "warning" : "positive"}>{late ? "At risk" : "On track"}</Badge></div>
            <div className="mt-2 flex items-center gap-2 text-[12px] text-[color:var(--c-muted)]"><Actor name="Priya Shah" size={20} /> Priya Shah, today at 9:20 am</div>
            <p className="mt-2 text-[14px] text-[color:var(--c-text)]">{late ? `The pallet label spec is two days late from the ${site} warehouse, which moves the forecast to ${forecast}. I'm on it with them today. Nothing needed from you beyond the SKU approval.` : "Everything is on track for the target date."}</p>
            <p className="mt-2 text-[12px] text-[color:var(--c-muted)]">Since last week: Design went from 40% to 60%, and the Oct 21 call added 3 tasks.</p>
          </Panel>
          <Panel className="p-4">
            <div className="text-[13px] font-semibold text-[color:var(--c-ink)]">Who&rsquo;s holding the date</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {holding.map((h) => (
                <div key={h.s} className={`rounded-md p-2 ${h.late ? "bg-[#FDF8C9]" : "bg-[color:var(--c-subtle)]"}`}>
                  <div className="text-[12px] text-[color:var(--c-muted)]">{h.s}</div>
                  <div className="text-[16px] font-semibold tabular-nums text-[color:var(--c-ink)]">{h.open}</div>
                  <div className={`text-[12px] ${h.late ? "font-semibold text-[#B13600]" : "text-[color:var(--c-muted)]"}`}>{h.late ? `${h.late} late` : "open"}</div>
                </div>
              ))}
            </div>
          </Panel>
          <TeamCard onMessage={() => ask({ kind: "Go-live", label: `${site} go-live`, view: "golive" })} />
        </aside>

        <div className="min-w-0 space-y-8">
          <section>
            <SectionTitle action={<Badge tone={mine.length ? "warning" : "positive"}>{mine.length}</Badge>}>Needs you</SectionTitle>
            <ul className="mt-1 divide-y divide-[color:var(--c-line)]">
              {mine.map((t) => (
                <li key={t.task} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-[220px] flex-1"><div className="text-[14px] font-medium text-[color:var(--c-ink)]">{t.task}</div><div className="text-[12px] text-[color:var(--c-muted)]">Due {t.due}{t.source && `, from the ${t.source.split(" ▶")[0]}`}</div></div>
                  <Button small onClick={() => finish(t.task)}>{t.task.startsWith("Approve") ? "Review and approve" : "Mark done"}</Button>
                </li>
              ))}
              {!mine.length && <li className="py-6 text-[14px] text-[color:var(--c-muted)]">Nothing needs you right now.</li>}
            </ul>
          </section>

          <section>
            <SectionTitle action={<span className="text-[12px] text-[color:var(--c-muted)]">Recorded with everyone&rsquo;s OK. Checked by Priya.</span>}>Meetings</SectionTitle>
            <div className="mt-3 space-y-3">
              {meetings.map((m, i) => (
                <Panel key={m.date} className="p-4">
                  <button type="button" onClick={() => setOpenMeeting(openMeeting === i ? -1 : i)} className="flex w-full flex-wrap items-center gap-3 text-left">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--c-ink)] text-white"><Play className="h-3.5 w-3.5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold text-[color:var(--c-ink)]">{m.title}, {m.date}</span><span className="block truncate text-[12px] text-[color:var(--c-muted)]">{m.length} with {m.people}</span></span>
                    <span className="inline-flex items-center gap-1 text-[12px] text-[#217005]"><Check className="h-3.5 w-3.5" /> Reviewed by Priya</span>
                  </button>
                  {openMeeting === i && (
                    <div className="mt-4 space-y-3 border-t border-[color:var(--c-line)] pt-3 text-[14px]">
                      <p className="text-[color:var(--c-text)]">{m.recap}</p>
                      <div>
                        <div className="text-[12px] font-semibold text-[color:var(--c-muted)]">Decided</div>
                        <ul className="mt-1 space-y-1">{m.decided.map(([d, at]) => <li key={d} className="flex flex-wrap items-center gap-2 text-[color:var(--c-ink)]"><span>{d}</span><Stamp at={at} /></li>)}</ul>
                      </div>
                      {m.created.length > 0 && (
                        <div>
                          <div className="text-[12px] font-semibold text-[color:var(--c-muted)]">Tasks it created ({m.created.length})</div>
                          <ul className="mt-1 space-y-1">{m.created.map((t) => <li key={t.task} className="flex flex-wrap items-center gap-2 text-[color:var(--c-ink)]"><span>{t.task}</span><span className="text-[12px] text-[color:var(--c-muted)]">{t.side === "You" ? "You" : t.owner}, due {t.due}</span><Stamp at={t.source!.split("▶ ")[1]} />{t.proposed && <Badge>Proposed, Priya confirms</Badge>}</li>)}</ul>
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
              <div className="flex gap-1 text-[13px] font-semibold">{(["All", "You", "Koherent", "Warehouse"] as const).map((s) => <button key={s} type="button" onClick={() => setSide(s)} className={`rounded px-2 py-0.5 ${side === s ? "bg-[color:var(--c-track)] text-[color:var(--c-ink)]" : "text-[color:var(--c-muted)] hover:text-[color:var(--c-text)]"}`}>{s}</button>)}</div>
            }>All tasks</SectionTitle>
            <div className="overflow-x-auto">
              <table className="mt-1 w-full min-w-[640px] border-collapse">
                <thead><tr><Th>Task</Th><Th>Owner</Th><Th>Phase</Th><Th right>Due</Th></tr></thead>
                <tbody>
                  {shown.map((t) => (
                    <tr key={t.task}>
                      <Td><span className="inline-flex flex-wrap items-center gap-2">{t.state === "Done" ? <CircleCheck className="h-4 w-4 shrink-0 text-[#217005]" /> : <span className="h-4 w-4 shrink-0 rounded-full border border-[color:var(--c-faint)]" />}<span className={t.state === "Done" ? "text-[color:var(--c-muted)] line-through" : ""}>{t.task}</span>{t.proposed && <Badge>Proposed</Badge>}</span></Td>
                      <Td muted>{t.side === "You" ? "You" : t.owner}</Td>
                      <Td muted>{t.phase}</Td>
                      <Td right>{t.state === "Late" ? <span className="font-semibold text-[#B13600]">2 days late</span> : t.state === "Done" ? <span className="text-[color:var(--c-muted)]">Done</span> : t.due}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── The monthly report ───────────────────────────────────────────────────────

const DEFINITION: Record<string, string> = {
  "Cost per order": "Shipping, warehouse and account fees, divided by orders shipped.",
  "Cost per online order": "Shipping and warehouse fees for online orders, divided by those orders.",
  "Delivered on time": "Delivered by the date the carrier promised.",
  "Store deliveries on time": "Store deliveries that arrived on the planned day.",
  "Customers within 2 days (estimated)": "Your customers within 2 ground days of a warehouse, estimated from distance.",
  "Canada, days to deliver": "Average days from label to delivery for Canadian orders.",
  "Heavy-package fees": "Carrier fees for parcels over 50 lb.",
  "Problems solved by us": "Problems we fixed without needing you.",
};

// ── Results ──────────────────────────────────────────────────────────────────
// How it's going against what was agreed, and how we work together (Chris's
// "how we work"). The goals come first and fill as chevrons, the money is set
// against the fee, the routine is four fixed moments, and the page ends on the
// month's report signed by Priya. The team card sits beside it.

export function Report({ go }: { go: (v: View) => void }) {
  const sc = useScenario();
  const ask = useAsk();
  const sv = sc.service!;
  const met = sv.goals.filter((g) => g.progress >= 1).length;
  const rhythm = [
    ["Daily note", "Today, 8:05 am", "What we did yesterday, and anything that needs you."],
    ["Weekly check-in", "Wed, Oct 28, 2:00 pm", "30 minutes with Priya and Marc."],
    ["Monthly report", "September, sent Oct 2", "At the bottom of this page."],
    ["Quarterly review", sv.review, "Results against these goals, and the next ones."],
  ];
  return (
    <div className="space-y-8">
      <PageHeader title="Results" subtitle={`How it's going since you joined in ${sv.joined}, and how we work with you.`} actions={<><Button onClick={() => go("network")}>Warehouses</Button><Button><Download className="h-4 w-4" /> PDF</Button></>} />
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-8">
          <section>
            <SectionTitle action={<span className="text-[13px] text-[color:var(--c-muted)]">{met} of {sv.goals.length} met</span>}>Goals we agreed in {sv.joined}</SectionTitle>
            <ul className="divide-y divide-[color:var(--c-line)]">
              {sv.goals.map((g) => (
                <li key={g.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 py-3.5 sm:grid-cols-[minmax(0,1.1fr)_auto_minmax(0,1.2fr)_96px]">
                  <span className="text-[14px] font-medium text-[color:var(--c-ink)]">{g.label}</span>
                  <span className="justify-self-end sm:order-last">{g.progress >= 1 ? <Badge tone="positive" icon={<Check className="h-3 w-3" />}>Met</Badge> : <span className="text-[12px] text-[color:var(--c-muted)]">On the way</span>}</span>
                  <Chevrons total={5} done={Math.min(5, Math.round(g.progress * 5))} size={14} />
                  <span className="text-[14px] text-[color:var(--c-muted)]"><span className="k-num">{g.then} → </span><b className="k-num font-semibold text-[color:var(--c-ink)]">{g.now}</b>, goal {g.goal}</span>
                </li>
              ))}
            </ul>
          </section>
          <StatRow cols={2}>
            <Stat label="Saved since joining" value={perMonth(sv.savedSince)} tone="good" sub={`Rules, better rates and invoice audits, against your contract rates in ${sv.joined}.`} />
            <Stat label="Koherent fees since joining" value={perMonth(sv.feesSince)} sub={`You've saved ${(sv.savedSince / sv.feesSince).toFixed(1)}× what you've paid us.`} />
          </StatRow>
          <section>
            <SectionTitle>How we work with you</SectionTitle>
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[color:var(--c-line)] bg-[color:var(--c-line)] sm:grid-cols-4">
              {rhythm.map(([what, when, why]) => (
                <div key={what} className="bg-white px-4 py-3">
                  <div className="text-[13px] font-semibold text-[color:var(--c-ink)]">{what}</div>
                  <div className="text-[13px] text-[color:var(--c-text)]">{when}</div>
                  <div className="mt-1 text-[12px] text-[color:var(--c-muted)]">{why}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle action={<span className="hidden text-[12px] text-[color:var(--c-muted)] sm:inline">Prepared by Priya Shah on Oct 2</span>}>September report</SectionTitle>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sc.report!.numbers.map((n) => (
          <Panel key={n.label} className="flex flex-col p-4">
            <div className="text-[13px] text-[color:var(--c-muted)]">{n.label}</div>
            <div className="k-num mt-1 text-[24px] font-semibold tabular-nums text-[color:var(--c-ink)]">{n.value}</div>
            <div className="text-[13px] font-semibold text-[#217005]">{n.change}{/^[+−-]/.test(n.change) ? " vs August" : ""}</div>
            {DEFINITION[n.label] && <div className="mt-3 border-t border-[color:var(--c-line)] pt-2 text-[12px] text-[color:var(--c-muted)]">{DEFINITION[n.label]}</div>}
          </Panel>
        ))}
      </div>
      <section className="mt-6">
        <h3 className="text-[14px] font-semibold text-[color:var(--c-ink)]">By warehouse</h3>
        <div className="overflow-x-auto">
          <table className="mt-1 w-full min-w-[560px] border-collapse">
            <thead><tr><Th>Warehouse</Th><Th right>Orders</Th><Th right>Shipping per order</Th><Th right>On time</Th></tr></thead>
            <tbody>{sc.sites.filter((s) => s.orders).map((s) => <tr key={s.name}><Td>{s.name}</Td><Td right>{s.orders.toLocaleString()}</Td><Td right>{s.costPerOrder}</Td><Td right>{s.onTime}</Td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section className="mt-6 max-w-[720px]">
        <h3 className="text-[14px] font-semibold text-[color:var(--c-ink)]">Notes from Priya</h3>
        <ul className="mt-3 space-y-2 text-[14px] text-[color:var(--c-text)]">{sc.report!.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        <div className="mt-4 flex items-center gap-2 text-[13px] text-[color:var(--c-muted)]"><Actor name="Priya Shah" size={22} /> Priya Shah, account manager</div>
      </section>
          </section>
        </div>
        <aside><TeamCard onMessage={() => ask({ kind: "General", label: "Message to your team" })} /></aside>
      </div>
    </div>
  );
}
