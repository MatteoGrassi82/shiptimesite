"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Check, CircleCheck, Clock, Copy, Download, Ellipsis, Layers, ListChecks, MessageSquare, TriangleAlert, Truck, Undo2 } from "lucide-react";
import { daily, type ShipletMap, type ShipletStatus } from "./data";
import { eventsFor, invoiceFor, money, monthlyOrders, NOW, OLD_RATE, shipmentsFor, TODAY, useScenario } from "./derive";
import { ScoreMark, useBrand } from "./brand";
import { useToast } from "./Feedback";
import { Actor } from "./People";
import { useAsk } from "./Requests";
import { Badge, Button, Chip, PageHeader, Panel, SectionTitle, Stat, StatRow, statusTone, T, Td, Th, type View } from "./ui";

// ── Home ─────────────────────────────────────────────────────────────────────
// Stripe's home: the numbers that matter today, "Your overview" with a period
// and a compare chip, then suggestions based on your orders. ShipTime One
// accounts open on the control tower: what the team watched, caught and fixed
// today, with an actor and an outcome on every line (PagerDuty's "handled for
// you"), checks that couldn't run kept apart from the ones that passed (Drata),
// and "needs you" items that can't be dismissed (Shopify's order tasks).

function ControlTower({ go }: { go: (v: View) => void }) {
  const sc = useScenario();
  const toast = useToast();
  const t = sc.tower!;
  const [done, setDone] = useState<string[]>([]);
  const mine = sc.problems.filter((p) => p.who === "you" && !done.includes(p.id));
  const goLiveCity = sc.nextSite?.name.split(",")[0];
  return (
    <section className="overflow-hidden rounded-lg border border-[color:var(--c-line)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[color:var(--c-line)] px-4 py-3">
        <div className="text-[16px] font-semibold text-[color:var(--c-ink)]">Control tower <span className="font-normal text-[color:var(--c-muted)]">{TODAY}</span></div>
        <div className="text-[12px] text-[color:var(--c-muted)]">Data as of {t.asOf}. Checked every 15 minutes.</div>
      </div>
      {/* One sentence instead of five tiles: the day in the order people read it. */}
      <p className="border-b border-[color:var(--c-line)] px-4 py-3 text-[14px] text-[color:var(--c-text)]">
        {t.watched.toLocaleString()} parcels on the move. Today we found {t.caught} problems: {t.fixed} fixed by us, {t.caught - t.fixed} we&rsquo;re still on{mine.length ? <>, and <b className="font-semibold text-[#B13600]">{mine.length} need you</b>.</> : ". Nothing needs you."}
      </p>
      <div className="grid gap-px bg-[color:var(--c-line)] lg:grid-cols-[1fr_1.3fr]">
        <div className="bg-white p-4">
          <div className="text-[13px] font-semibold text-[color:var(--c-ink)]">Needs you</div>
          <ul className="mt-2 space-y-3">
            {mine.map((p) => (
              <li key={p.id} className="flex items-start gap-3">
                <div className="min-w-0 flex-1"><div className="text-[14px] text-[color:var(--c-ink)]">{p.title}</div><div className="text-[12px] text-[color:var(--c-muted)]">{p.detail} Due {p.due === "Today" ? "today" : p.due}.</div></div>
                {p.site === goLiveCity
                  ? <Button small onClick={() => go("golive")}>Review</Button>
                  : <Button small onClick={() => { setDone([...done, p.id]); toast({ text: `${p.cta === "Approve" ? "Approved" : "Done"}: ${p.title.charAt(0).toLowerCase()}${p.title.slice(1)}. ${p.site} has been told.` }); }}>{p.cta ?? "Done"}</Button>}
              </li>
            ))}
            {!mine.length && <li className="text-[14px] text-[color:var(--c-muted)]">Nothing needs you. We&rsquo;ll email you if that changes.</li>}
          </ul>
        </div>
        <div className="bg-white p-4">
          <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-[color:var(--c-ink)]">Handled for you</span><button type="button" onClick={() => go("network")} className="text-[12px] font-semibold text-[color:var(--c-link)] hover:underline">All warehouses</button></div>
          <ul className="mt-2 space-y-3">
            {t.events.map((e) => (
              <li key={e.time + e.text} className="flex items-start gap-2.5 text-[13px]">
                <span className="w-[68px] shrink-0 whitespace-nowrap pt-0.5 tabular-nums text-[color:var(--c-muted)]">{e.time}</span>
                <Actor name={e.who} />
                <span className="min-w-0 flex-1 text-[color:var(--c-text)]"><b className="font-medium text-[color:var(--c-ink)]">{e.who === "ShipTime" ? "Automatic" : e.who.split(" ")[0]}</b>: {e.text}<span className="block text-[12px] text-[#217005]">{e.impact}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {t.warning && <div className="flex items-center gap-2 border-t border-[color:var(--c-line)] bg-[#FFFBEB] px-4 py-2 text-[13px] text-[#92400E]"><TriangleAlert className="h-4 w-4 shrink-0" /> {t.warning} We&rsquo;ll check again at 10:55 am.</div>}
    </section>
  );
}

export function Home({ go, shiplets, setShiplet }: { go: (v: View) => void; shiplets: ShipletMap; setShiplet: (id: string, s: ShipletStatus) => void }) {
  const sc = useScenario();
  const { c: pal } = useBrand();
  const toast = useToast();
  const [approved, setApproved] = useState<string[]>([]);
  const one = sc.tier === "Koherent";
  // The 30-day chart adds up to the account's monthly orders, and its last
  // point is today.
  const monthly = monthlyOrders(sc);
  const base = daily.reduce((a, d) => a + d.shipments, 0);
  const series = useMemo(() => daily.map((d) => ({ ...d, shipments: Math.round((d.shipments * monthly) / base), previous: Math.round((d.previous * monthly) / base) })), [monthly, base]);
  const total = monthly; // the scaled days can round a label off; the total is the account's
  const prev = series.reduce((a, d) => a + d.previous, 0);
  const today = series[series.length - 1].shipments;
  const { total: due, invoices } = invoiceFor(sc);
  const sv = sc.service;
  const perMonth = (n: number) => money(n).replace(".00", "");
  const site = sc.nextSite?.name.split(",")[0];
  return (
    <div className="space-y-8">
      {sc.tower && <ControlTower go={go} />}

      {sc.nextSite && (
        <Panel className="flex flex-wrap items-center gap-4 p-4">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--c-subtle)]"><ListChecks className="h-4 w-4 text-[color:var(--c-text)]" /></span>
          <div className="min-w-[240px] flex-1">
            <div className="text-[14px] font-semibold text-[color:var(--c-ink)]">{site} goes live {sc.nextSite.date} {sc.nextSite.atRisk ? <Badge tone="warning">At risk</Badge> : <Badge tone="positive">On track</Badge>}</div>
            <div className="text-[13px] text-[color:var(--c-muted)]">{sc.nextSite.atRisk ? "Forecast 2 days later: the warehouse is late on one task. " : ""}Next for you: approve which SKUs go to {site}, due {sc.problems.find((p) => p.title.startsWith("Approve which SKUs"))?.due}.</div>
          </div>
          <Button small onClick={() => go("golive")}>Open the go-live</Button>
        </Panel>
      )}

      {/* Koherent accounts open on the three numbers they answer for, each
          against where they started; ShipTime accounts on today's basics. */}
      {sv ? (
        <StatRow>
          <Stat label={sv.cost.label} value={sv.cost.now} sub={`${sv.cost.then} when you joined in ${sv.joined}. Shipping, warehouse and fees.`} />
          <Stat label="Performance score" value={<span className="inline-flex items-center gap-2"><ScoreMark parts={sv.score.parts} />{sv.score.now}<span className="text-[13px] font-normal text-[color:var(--c-muted)]">/ 100</span></span>} sub={`${sv.score.then} in ${sv.joined}. Cost, operations and experience.`} />
          <Stat label="Saved since joining" value={perMonth(sv.savedSince)} tone="good" sub={<>{(sv.savedSince / sv.feesSince).toFixed(1)}× what you&rsquo;ve paid in Koherent fees. <button type="button" onClick={() => go("report")} className="font-semibold text-[color:var(--c-link)] hover:underline">See results</button></>} />
        </StatRow>
      ) : (
        <StatRow>
          <Stat label="Shipments today" value={today} sub={`${monthly.toLocaleString()} in the last 30 days`} />
          <Stat label="Next invoice" value={<button type="button" onClick={() => go("invoice")} className="hover:underline">{money(due)}</button>} sub={`${invoices[0].period}, due ${invoices[0].due}`} />
          <Stat label="Saved this month" value={sc.saved} tone="good" sub="Against carrier retail rates." />
        </StatRow>
      )}

      <section>
        <SectionTitle action={<div className="hidden gap-1.5 sm:flex"><Chip label="Date range" value="Last 30 days" /><Chip label="Compare" value="Previous period" /></div>}>Your overview</SectionTitle>
        <div className="mt-4 grid gap-4 rounded-lg bg-[color:var(--c-subtle)] p-4 md:grid-cols-2">
          <Panel className="p-4 md:col-span-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="text-[14px] font-semibold text-[color:var(--c-text)]">Shipments</div>
                <div className="mt-1 flex flex-wrap items-baseline gap-2"><span className="k-num text-[24px] font-semibold tabular-nums text-[color:var(--c-ink)]">{total.toLocaleString()}</span><span className="text-[13px] font-semibold text-[#217005]">+{(((total - prev) / prev) * 100).toFixed(1)}%</span><span className="text-[13px] text-[color:var(--c-muted)]">{prev.toLocaleString()} the 30 days before</span></div>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-[color:var(--c-muted)]">
                <span className="inline-flex items-center gap-1"><span className="h-0.5 w-4 bg-[color:var(--c-accent)]" /> This period</span>
                <span className="inline-flex items-center gap-1"><span className="h-0.5 w-4 border-t-2 border-dashed border-[color:var(--c-border2)]" /> Previous</span>
              </div>
            </div>
            <div className="mt-3 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ left: -20, right: 12, top: 6, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={pal.line} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke={pal.muted} interval={6} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke={pal.muted} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${pal.line}`, fontSize: 12, boxShadow: "0 5px 15px rgba(0,0,0,.12)" }} />
                  <Line type="monotone" dataKey="previous" name="Previous" stroke={pal.border2} strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="shipments" name="This period" stroke={pal.accent} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between border-t border-[color:var(--c-line)] pt-2 text-[12px] text-[color:var(--c-muted)]"><span>Updated {NOW}</span><button type="button" onClick={() => go("shipments")} className="font-semibold text-[color:var(--c-link)] hover:underline">View shipments</button></div>
          </Panel>
          {sc.metrics.filter((m) => !m.label.startsWith("Saved")).map((m) => (
            <Panel key={m.label} className="p-4">
              <div className="text-[14px] font-semibold text-[color:var(--c-text)]">{m.label}</div>
              <div className="mt-1 flex items-baseline gap-2"><span className="k-num text-[24px] font-semibold tabular-nums text-[color:var(--c-ink)]">{m.value}</span><span className="text-[13px] font-semibold text-[#217005]">{m.delta}</span></div>
              <div className="text-[12px] text-[color:var(--c-muted)]">vs the 30 days before</div>
            </Panel>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle action={<span className="hidden text-[12px] text-[color:var(--c-muted)] sm:inline">Based on your orders</span>}>Suggested for you</SectionTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {sc.recs.map((r) => (
            <Panel key={r.id} className="flex flex-col p-4">
              <span className="self-start">{r.shiplet ? <Badge tone="info" icon={<Layers className="h-3 w-3" />}>Shiplet</Badge> : <Badge>{r.value}</Badge>}</span>
              <div className="mt-2 text-[14px] font-semibold text-[color:var(--c-ink)]">{r.title}</div>
              <p className="mt-1 flex-1 text-[13px] leading-5 text-[color:var(--c-muted)]">{r.body}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {r.goLive ? <Button small onClick={() => go("golive")}>{r.cta}</Button>
                  : r.shiplet ? (
                    shiplets[r.shiplet] === "Live"
                      ? <><Badge tone="positive" icon={<Check className="h-3 w-3" />}>Live</Badge><Button small onClick={() => go("shiplets")}>Manage</Button></>
                      : <><Button small onClick={() => { setShiplet(r.shiplet!, "Live"); toast({ text: `${r.title.replace("Turn on your", "Your").replace("Show delivery dates at checkout", "Delivery dates at checkout")} is on.`, action: { label: "View", onClick: () => go("shiplets") } }); }}>Switch on</Button><Button small onClick={() => go("shiplets")}>See all Shiplets</Button></>
                  ) : approved.includes(r.id) ? <Badge tone="positive" icon={<Check className="h-3 w-3" />}>Approved</Badge>
                  : <><Button small onClick={() => { setApproved([...approved, r.id]); toast({ text: one ? "Approved. Priya will set it up and confirm today." : "Approved. It applies to your next labels." }); }}>Approve</Button><Button small>{r.cta}</Button></>}
              </div>
            </Panel>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Shipments ────────────────────────────────────────────────────────────────

const tiles = [
  { label: "All", filter: "" },
  { label: "In transit", filter: "In transit" },
  { label: "Problems", filter: "Exception" },
  { label: "Delivered", filter: "Delivered" },
];

export function Shipments({ open, returnsLive }: { open: (id: string) => void; returnsLive: boolean }) {
  const sc = useScenario();
  const all = useMemo(() => shipmentsFor(sc), [sc]);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState<string | null>(null);
  const rows = all.filter((s) => (!tab || s.status === tab) && (!site || s.site === site));
  const multiSite = sc.sites.length > 1; // ShipTime One: filter and column by warehouse
  const partner = multiSite ? sc.sites[1].name.split(",")[0] : null;
  // The tiles count the whole 30 days; the table shows the most recent.
  const monthly = monthlyOrders(sc);
  const moving = sc.tower ? sc.tower.watched : Math.round(monthly * 0.06);
  const problems = all.filter((s) => s.status === "Exception").length;
  const count: Record<string, number> = { "": monthly, "In transit": moving, Exception: problems, Delivered: monthly - moving - problems };
  return (
    <div>
      <PageHeader title="Shipments" actions={<><Button><Download className="h-4 w-4" /> Export</Button><Button primary><Truck className="h-4 w-4" /> Create label</Button></>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <button key={t.label} type="button" onClick={() => setTab(t.filter)} className={`rounded-lg border px-3 py-2.5 text-left ${tab === t.filter ? "border-[color:var(--c-accent)] ring-1 ring-[color:var(--c-accent)]" : "border-[color:var(--c-line)] hover:border-[color:var(--c-border)]"}`}>
            <div className={`text-[13px] font-semibold ${tab === t.filter ? "text-[color:var(--c-action-text)]" : "text-[color:var(--c-muted)]"}`}>{t.label}</div>
            <div className="mt-0.5 text-[18px] font-semibold tabular-nums text-[color:var(--c-ink)]">{count[t.filter].toLocaleString()}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {multiSite && <Chip label="Warehouse" value={site ?? undefined} onClick={() => setSite(site ? null : partner)} />}
        <Chip label="Carrier" />
        <Chip label="Created" />
        <Chip label="Destination" />
        {site && <button type="button" onClick={() => setSite(null)} className="ml-1 text-[12px] font-semibold text-[color:var(--c-link)]">Clear filters</button>}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead><tr><Th>Shipment</Th><Th>Order</Th><Th>To</Th><Th>Carrier</Th>{multiSite && <Th>Warehouse</Th>}<Th>Created</Th><Th right>Cost</Th></tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} onClick={() => open(s.id)} className="cursor-pointer hover:bg-[color:var(--c-hover)]">
                <Td><span className="inline-flex items-center gap-2"><span style={{ fontFamily: T.mono, fontSize: 13 }}>{s.id}</span><Badge tone={statusTone(s.status)}>{s.status === "Exception" ? "Problem" : s.status}</Badge>{s.status === "Returned" && returnsLive && <span className="inline-flex items-center gap-1 text-[12px] text-[#045AD0]"><Layers className="h-3 w-3" /> via your returns page</span>}</span></Td>
                <Td muted>{s.order}</Td>
                <Td>{s.to}</Td>
                <Td muted>{s.carrier} {s.service}</Td>
                {multiSite && <Td muted>{s.site}</Td>}
                <Td muted>{s.created}</Td>
                <Td right><span className="font-semibold">{money(s.cost)}</span></Td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7} className="py-10 text-center text-[14px] text-[color:var(--c-muted)]">No shipments match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-[13px] text-[color:var(--c-muted)]">
        <span>Showing the {rows.length} most recent of {monthly.toLocaleString()} in the last 30 days</span>
        <div className="flex gap-2"><Button small>Previous</Button><Button small>Next</Button></div>
      </div>
    </div>
  );
}

const eventIcon = (tone: string) =>
  tone === "green" ? <CircleCheck className="h-4 w-4 text-[#217005]" /> : tone === "amber" ? <TriangleAlert className="h-4 w-4 text-[#B13600]" /> : <Clock className="h-4 w-4 text-[color:var(--c-muted)]" />;

export function ShipmentDetail({ id, back, go, trackingLive, onTrackingOn }: { id: string; back: () => void; go: (v: View) => void; trackingLive: boolean; onTrackingOn: () => void }) {
  const sc = useScenario();
  const ask = useAsk();
  const all = useMemo(() => shipmentsFor(sc), [sc]);
  const s = all.find((x) => x.id === id) ?? all[0];
  const events = eventsFor(s);
  return (
    <div>
      <PageHeader back={{ label: "Shipments", onClick: back }}
        title={<span style={{ fontFamily: T.mono }}>{s.id}</span>} status={<Badge tone={statusTone(s.status)}>{s.status === "Exception" ? "Problem" : s.status}</Badge>}
        actions={<><Button onClick={() => ask({ kind: "Shipment", label: s.id, view: "shipments" })}><MessageSquare className="h-4 w-4" /> Ask about this</Button><Button><Download className="h-4 w-4" /> Label</Button><Button><Undo2 className="h-4 w-4" /> Return label</Button><Button><Ellipsis className="h-4 w-4" /></Button></>}
      />
      <div className="grid grid-cols-2 gap-y-3 border-y border-[color:var(--c-line)] py-4 sm:grid-cols-4 sm:divide-x sm:divide-[color:var(--c-line)]">
        {[["Last update", events[events.length - 1].when], ["Order", s.order], ["Carrier", `${s.carrier} ${s.service}`], ["Cost", `${money(s.cost)} USD`]].map(([l, v], i) => (
          <div key={l} className={i ? "sm:px-5" : "sm:pr-5"}>
            <div className="text-[13px] text-[color:var(--c-muted)]">{l}</div>
            <div className="mt-0.5 text-[14px] font-medium text-[color:var(--c-ink)]">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <section className="min-w-0">
          <SectionTitle>Timeline</SectionTitle>
          <ol className="mt-4">
            {events.map((e, i) => (
              <li key={e.when} className="relative flex gap-3 pb-5">
                {i < events.length - 1 && <span className="absolute left-[7px] top-5 h-full w-px bg-[color:var(--c-line)]" />}
                <span className="relative z-10 mt-0.5 bg-white">{eventIcon(e.tone)}</span>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-[color:var(--c-ink)]">{e.title}</div>
                  <div className="text-[13px] text-[color:var(--c-text)]">{e.detail}</div>
                  <div className="text-[12px] text-[color:var(--c-muted)]">{e.when}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-2 rounded-lg border border-[color:var(--c-border)] px-3 py-2 text-[14px] text-[color:var(--c-muted)]">Add a note… <span className="float-right text-[12px]" style={{ fontFamily: T.mono }}>⌘ + ↵</span></div>
        </section>
        <aside className="space-y-6">
          <div>
            <SectionTitle>Details</SectionTitle>
            <dl className="mt-3 space-y-2.5 text-[14px]">
              {[["From", `${s.site}, ${(sc.sites.find((x) => x.name.startsWith(s.site))?.kind ?? "your warehouse").toLowerCase()}`], ["To", s.to], ["Weight", s.weight], ["Promised", s.status === "Delivered" || s.status === "Returned" ? `${s.promised}, met` : s.promised], ["Your old rate", `${money(s.cost * OLD_RATE)} (saved ${money(s.cost * (OLD_RATE - 1))})`]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-2"><dt className="text-[color:var(--c-muted)]">{k}</dt><dd className="text-[color:var(--c-ink)]">{v}</dd></div>
              ))}
              <div className="grid grid-cols-[110px_1fr] gap-2"><dt className="text-[color:var(--c-muted)]">Tracking</dt><dd className="flex items-center gap-1.5 text-[color:var(--c-ink)]"><span style={{ fontFamily: T.mono, fontSize: 13 }}>1Z84A2…7731</span><Copy className="h-3.5 w-3.5 text-[color:var(--c-muted)]" /></dd></div>
            </dl>
          </div>
          {s.status !== "Label created" && <div>
            <SectionTitle>Your customer saw</SectionTitle>
            {trackingLive ? (
              <p className="mt-3 text-[14px] text-[color:var(--c-text)]">Your branded tracking page, 3 visits. <button type="button" onClick={() => go("shiplets")} className="inline-flex items-center gap-0.5 font-semibold text-[color:var(--c-link)]">Open <ArrowUpRight className="h-3.5 w-3.5" /></button></p>
            ) : (
              <div className="mt-3 rounded-lg bg-[color:var(--c-subtle)] p-3 text-[13px] text-[color:var(--c-text)]">
                <div>The carrier&rsquo;s tracking page, 3 visits.</div>
                <div className="mt-2 flex items-center gap-1.5 font-semibold text-[color:var(--c-ink)]"><Layers className="h-3.5 w-3.5 text-[#045AD0]" /> Show your own page instead</div>
                <div className="text-[color:var(--c-muted)]">Your logo and the delivery date. A Shiplet, ready in a minute.</div>
                <div className="mt-2"><Button small onClick={onTrackingOn}>Switch on</Button></div>
              </div>
            )}
          </div>}
        </aside>
      </div>
    </div>
  );
}

// ── Billing ──────────────────────────────────────────────────────────────────

export function Billing({ open }: { open: () => void }) {
  const sc = useScenario();
  const { invoices } = invoiceFor(sc);
  return (
    <div>
      <PageHeader title="Billing" subtitle={sc.warehouse ? "One bill for shipping, warehouses and your account. Every line links back to a shipment, receipt or pallet count." : "Every line links back to a shipment."} actions={<Button><Download className="h-4 w-4" /> Export</Button>} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse">
          <thead><tr><Th>Invoice</Th><Th>Period</Th><Th>Issued</Th><Th>Due</Th><Th right>Amount</Th></tr></thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={inv.id} onClick={() => i === 0 && open()} className={i === 0 ? "cursor-pointer hover:bg-[color:var(--c-hover)]" : ""}>
                <Td><span className="inline-flex items-center gap-2"><span style={{ fontFamily: T.mono, fontSize: 13 }}>{inv.id}</span><Badge tone={statusTone(inv.status)}>{inv.status}</Badge></span></Td>
                <Td>{inv.period}</Td>
                <Td muted>{inv.issued}</Td>
                <Td muted>{inv.due}</Td>
                <Td right><span className="font-semibold">{money(inv.amount)}</span> <span className="text-[12px] text-[color:var(--c-muted)]">USD</span></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InvoiceDetail({ back }: { back: () => void }) {
  const sc = useScenario();
  const ask = useAsk();
  const { groups, subtotal, credits, total, invoices } = invoiceFor(sc);
  const inv = invoices[0];
  return (
    <div>
      <PageHeader back={{ label: "Billing", onClick: back }}
        title={<>{money(total)} <span className="text-[24px] font-normal text-[color:var(--c-muted)]">USD</span></>} status={<Badge tone="info">Open</Badge>}
        subtitle={`Invoice for ${inv.period}, due ${inv.due}`}
        actions={<><Button><Download className="h-4 w-4" /> CSV</Button><Button><Download className="h-4 w-4" /> PDF</Button><Button primary>Pay now</Button></>}
      />
      <div className="grid grid-cols-2 gap-y-3 border-y border-[color:var(--c-line)] py-4 sm:grid-cols-4 sm:divide-x sm:divide-[color:var(--c-line)]">
        {[["Billed to", sc.account.name], ["Period", inv.period], ["Due", inv.due], ["Number", inv.id]].map(([l, v], i) => (
          <div key={l} className={i ? "sm:px-5" : "sm:pr-5"}><div className="text-[13px] text-[color:var(--c-muted)]">{l}</div><div className="mt-0.5 text-[14px] font-medium text-[color:var(--c-ink)]">{v}</div></div>
        ))}
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
        <section data-tour="bill" className="min-w-0 space-y-6 overflow-x-auto">
          {groups.map((g) => (
            <div key={g.group}>
              <SectionTitle>{g.group}</SectionTitle>
              <table className="mt-1 w-full table-fixed border-collapse">
                <colgroup><col /><col className="w-[72px]" /><col className="w-[130px]" /><col className="w-[120px]" /><col className="w-[84px]" /></colgroup>
                <thead><tr><Th>Description</Th><Th right>Qty</Th><Th right>Unit</Th><Th right>Amount</Th><Th right>{""}</Th></tr></thead>
                <tbody>
                  {g.lines.map((l) => (
                    <tr key={l.item} className="group">
                      <Td>{l.item}</Td>
                      <Td right muted>{l.qty}</Td>
                      <Td right muted>{l.unit || "—"}</Td>
                      <Td right><span className={l.amount < 0 ? "text-[#217005]" : ""}>{money(l.amount)}</span></Td>
                      <Td right><button type="button" onClick={() => ask({ kind: "Invoice", label: `${inv.period}: ${l.item}`, view: "billing" })} className="text-[12px] font-semibold text-[color:var(--c-link)] hover:underline">Ask</button></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
        <aside className="space-y-4">
          <Panel className="p-4">
            <dl className="space-y-2 text-[14px] tabular-nums">
              <div className="flex justify-between"><dt className="text-[color:var(--c-muted)]">Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-[color:var(--c-muted)]">Credits</dt><dd className="text-[#217005]">{money(credits)}</dd></div>
              <div className="flex justify-between"><dt className="text-[color:var(--c-muted)]">Tax</dt><dd>—</dd></div>
              <div className="flex justify-between border-t border-[color:var(--c-line)] pt-2 font-semibold text-[color:var(--c-ink)]"><dt>Amount due</dt><dd>{money(total)}</dd></div>
            </dl>
          </Panel>
          <p className="text-[13px] text-[color:var(--c-muted)]">Choose <b>Ask</b> on any line to question it. It goes to {sc.warehouse ? "Priya, your account manager," : "our support team"} and shows in Requests. Any credit lands on your next invoice.</p>
        </aside>
      </div>
    </div>
  );
}
