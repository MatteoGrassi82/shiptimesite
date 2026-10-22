"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Check, CircleCheck, Clock, Copy, Download, Ellipsis, Layers, ListChecks, MessageSquare, Package, Receipt, TriangleAlert, Truck, Undo2 } from "lucide-react";
import { daily, type ShipletMap, type ShipletStatus } from "./data";
import { eventsFor, invoiceFor, money, shipmentsFor, useScenario } from "./derive";
import { Actor } from "./People";
import { useAsk } from "./Requests";
import { tasksFor } from "./scenarios";
import { Badge, Button, Chip, PageHeader, Panel, SectionTitle, statusTone, T, Td, Th, type View } from "./ui";

const dayLabel = (d: number) => { const dt = new Date(2026, 8, 20 + d); return `${dt.getMonth() === 8 ? "Sep" : "Oct"} ${dt.getDate()}`; };

// ── Home ─────────────────────────────────────────────────────────────────────
// Stripe's home: a setup card, "Today", then "Your overview" with a period and
// a compare chip, then recommendations as "we suggest, you approve" cards.
// ShipTime One accounts open on the control tower: what the team watched,
// caught and fixed today, with an actor and an outcome on every line
// (PagerDuty's "handled for you"), checks that couldn't run kept apart from
// the ones that passed (Drata), and "needs you" items that can't be dismissed
// (Shopify's order tasks).

function ControlTower({ go }: { go: (v: View) => void }) {
  const sc = useScenario();
  const t = sc.tower!;
  const [done, setDone] = useState<string[]>([]);
  const mine = sc.problems.filter((p) => p.who === "you" && !done.includes(p.id));
  return (
    <section className="rounded-lg border border-[#EBEEF1]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EBEEF1] px-4 py-3">
        <div className="text-[16px] font-semibold text-[#1A1B25]">Control tower <span className="font-normal text-[#6A7383]">· today, Wed Oct 22</span></div>
        <div className="text-[12px] text-[#6A7383]">Data as of {t.asOf} · checked every 15 minutes</div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-[#EBEEF1] sm:grid-cols-5">
        {[["Watched", t.watched.toLocaleString(), "parcels in transit"], ["Caught", String(t.caught), "problems"], ["Fixed by us", String(t.fixed), "no action needed"], ["Need you", String(mine.length), mine.length ? "below" : "all done"], ["Saved today", t.saved, "re-rates, credits"]].map(([l, v, sub]) => (
          <div key={l} className="bg-white px-4 py-3"><div className="text-[12px] text-[#6A7383]">{l}</div><div className={`mt-0.5 text-[20px] font-semibold tabular-nums ${l === "Need you" && mine.length ? "text-[#B13600]" : l === "Saved today" ? "text-[#217005]" : "text-[#1A1B25]"}`}>{v}</div><div className="text-[11px] text-[#8792A2]">{sub}</div></div>
        ))}
      </div>
      <div className="grid gap-px bg-[#EBEEF1] lg:grid-cols-[1fr_1.3fr]">
        <div className="bg-white p-4">
          <div className="text-[13px] font-semibold text-[#1A1B25]">Needs you</div>
          <ul className="mt-2 space-y-3">
            {mine.map((p) => (
              <li key={p.id} className="flex items-start gap-3">
                <div className="min-w-0 flex-1"><div className="text-[14px] text-[#1A1B25]">{p.title}</div><div className="text-[12px] text-[#6A7383]">{p.site} · due {p.due}</div></div>
                <Button small primary onClick={() => setDone([...done, p.id])}>{p.cta ?? "Done"}</Button>
              </li>
            ))}
            {!mine.length && <li className="text-[14px] text-[#6A7383]">Nothing needs you. We&rsquo;ll email you if that changes.</li>}
          </ul>
        </div>
        <div className="bg-white p-4">
          <div className="flex items-center justify-between"><span className="text-[13px] font-semibold text-[#1A1B25]">Handled for you</span><button type="button" onClick={() => go("network")} className="text-[12px] font-semibold text-[#2E4C8F] hover:underline">All sites</button></div>
          <ul className="mt-2 space-y-2.5">
            {t.events.map((e) => (
              <li key={e.time + e.text} className="flex items-start gap-2.5 text-[13px]">
                <span className="w-10 shrink-0 pt-0.5 tabular-nums text-[#8792A2]">{e.time}</span>
                <Actor name={e.who} />
                <span className="min-w-0 flex-1 text-[#353A44]"><b className="font-medium text-[#1A1B25]">{e.who === "ShipTime" ? "Automatic" : e.who.split(" ")[0]}</b> · {e.text}</span>
                <span className="shrink-0 text-[12px] text-[#217005]">{e.impact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {t.warning && <div className="flex items-center gap-2 border-t border-[#EBEEF1] bg-[#FFFBEB] px-4 py-2 text-[13px] text-[#92400E]"><TriangleAlert className="h-4 w-4" /> {t.warning} We&rsquo;ll re-check at 9:30.</div>}
    </section>
  );
}

export function Home({ go, shiplets, setShiplet }: { go: (v: View) => void; shiplets: ShipletMap; setShiplet: (id: string, s: ShipletStatus) => void }) {
  const sc = useScenario();
  const [dismissed, setDismissed] = useState(false);
  const [approved, setApproved] = useState<string[]>([]);
  // ShipTime One only: the next site going live, with the next task on it.
  const next = sc.nextSite && { ...sc.nextSite, task: tasksFor(sc.nextSite.name).find((t) => !t.done)!.task };
  const factor = sc.today.shipments / 698;
  const series = useMemo(() => daily.map((d) => ({ ...d, shipments: Math.round(d.shipments * factor), previous: Math.round(d.previous * factor) })), [factor]);
  const total = series.reduce((a, d) => a + d.shipments, 0);
  const prev = series.reduce((a, d) => a + d.previous, 0);
  const { total: due } = invoiceFor(sc);
  return (
    <div className="space-y-8">
      {sc.tower && <ControlTower go={go} />}
      {next && !dismissed && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg bg-[#0B1F3A] px-5 py-4 text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10"><ListChecks className="h-5 w-5" /></span>
          <div className="min-w-[220px] flex-1">
            <div className="text-[16px] font-semibold">{next.name.split(",")[0]} goes live {next.date}</div>
            <div className="text-[14px] text-white/75">Next up: <button type="button" onClick={() => go("golive")} className="text-[#7DD3FC] hover:underline">{next.task}</button></div>
          </div>
          <button type="button" onClick={() => setDismissed(true)} className="text-[14px] font-semibold text-[#7DD3FC]">Dismiss</button>
          <button type="button" onClick={() => go("golive")} className="inline-flex h-8 items-center gap-1 rounded-md bg-white px-3 text-[14px] font-semibold text-[#1A1B25]">Continue ›</button>
        </div>
      )}

      <section>
        <SectionTitle>Today</SectionTitle>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[["Shipments", sc.today.shipments.toLocaleString()], ["Labels printed", sc.today.labels.toLocaleString()], ["Spend", sc.today.spend], ["Open problems", String(sc.today.problems)]].map(([l, v]) => (
              <div key={l}>
                <div className="text-[13px] text-[#6A7383]">{l}</div>
                <div className="mt-1 text-[22px] font-semibold tabular-nums text-[#1A1B25]">{v}</div>
              </div>
            ))}
          </div>
          <div data-tour="saved" className="space-y-3 border-[#EBEEF1] lg:border-l lg:pl-6">
            <div>
              <div className="text-[13px] text-[#6A7383]">Next invoice</div>
              <div className="mt-0.5 flex items-baseline justify-between gap-3">
                <span className="text-[16px] font-semibold tabular-nums text-[#1A1B25]">{money(due)} <span className="text-[13px] font-normal text-[#6A7383]">USD</span></span>
                <button type="button" onClick={() => go("invoice")} className="text-[14px] font-semibold text-[#2E4C8F] hover:underline">View</button>
              </div>
              <div className="text-[12px] text-[#6A7383]">Due in 14 days</div>
            </div>
            <div>
              <div className="text-[13px] text-[#6A7383]">Saved this month</div>
              <div className="mt-0.5 text-[16px] font-semibold tabular-nums text-[#217005]">{sc.saved}</div>
              <div className="text-[12px] text-[#6A7383]">vs your rates before ShipTime</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle action={<div className="hidden gap-1.5 sm:flex"><Chip label="Date range" value="Last 30 days" /><Chip label="Compare" value="Previous period" /></div>}>Your overview</SectionTitle>
        <div className="mt-4 grid gap-4 rounded-lg bg-[#F5F6F8] p-4 md:grid-cols-3">
          <Panel className="p-4 md:col-span-3">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="text-[14px] font-semibold text-[#353A44]">Shipments</div>
                <div className="mt-1 flex items-baseline gap-2"><span className="text-[24px] font-semibold tabular-nums text-[#1A1B25]">{total.toLocaleString()}</span><span className="text-[13px] font-semibold text-[#217005]">+{(((total - prev) / prev) * 100).toFixed(1)}%</span><span className="text-[13px] text-[#6A7383]">{prev.toLocaleString()} previous period</span></div>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-[#6A7383]">
                <span className="inline-flex items-center gap-1"><span className="h-0.5 w-4 bg-[#EC5A26]" /> This period</span>
                <span className="inline-flex items-center gap-1"><span className="h-0.5 w-4 border-t-2 border-dashed border-[#C4CCD8]" /> Previous</span>
              </div>
            </div>
            <div className="mt-3 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ left: -20, right: 4, top: 6, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#EBEEF1" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="#6A7383" tickFormatter={dayLabel} interval={6} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#6A7383" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #EBEEF1", fontSize: 12, boxShadow: "0 5px 15px rgba(0,0,0,.12)" }} />
                  <Line type="monotone" dataKey="previous" name="Previous" stroke="#C4CCD8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="shipments" name="This period" stroke="#EC5A26" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between border-t border-[#EBEEF1] pt-2 text-[12px] text-[#6A7383]"><span>Updated 10:42 AM</span><button type="button" onClick={() => go("shipments")} className="font-semibold text-[#2E4C8F] hover:underline">View shipments</button></div>
          </Panel>
          {sc.metrics.map((m) => (
            <Panel key={m.label} className="p-4">
              <div className="text-[14px] font-semibold text-[#353A44]">{m.label}</div>
              <div className="mt-1 flex items-baseline gap-2"><span className="text-[24px] font-semibold tabular-nums text-[#1A1B25]">{m.value}</span><span className="text-[13px] font-semibold text-[#217005]">{m.delta}</span></div>
              <div className="text-[12px] text-[#6A7383]">vs previous 30 days</div>
            </Panel>
          ))}
        </div>
      </section>

      <section data-tour="recs">
        <SectionTitle action={<span className="hidden text-[12px] text-[#6A7383] sm:inline">From your own orders · we suggest, you approve</span>}>Suggested for you</SectionTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {sc.recs.map((r) => (
            <Panel key={r.id} className="flex flex-col p-4">
              <span className="self-start">{r.shiplet ? <Badge tone="info" icon={<Layers className="h-3 w-3" />}>Shiplet</Badge> : <Badge tone="positive">{r.value}</Badge>}</span>
              <div className="mt-2 text-[14px] font-semibold text-[#1A1B25]">{r.title}</div>
              <p className="mt-1 flex-1 text-[13px] leading-5 text-[#6A7383]">{r.body}</p>
              <div className="mt-3 flex items-center gap-2">
                {r.shiplet ? (
                  shiplets[r.shiplet] === "Live"
                    ? <><Badge tone="positive" icon={<Check className="h-3 w-3" />}>Live</Badge><Button small onClick={() => go("shiplets")}>Manage</Button></>
                    : <><Button small primary onClick={() => setShiplet(r.shiplet!, "Live")}>Switch on</Button><Button small onClick={() => go("shiplets")}>See all Shiplets</Button></>
                ) : approved.includes(r.id) ? <Badge tone="positive" icon={<Check className="h-3 w-3" />}>Approved</Badge> : <><Button small primary onClick={() => setApproved([...approved, r.id])}>Approve</Button><Button small>{r.cta}</Button></>}
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
  const multiSite = sc.sites.length > 1; // ShipTime One: filter and column by site
  const partner = multiSite ? sc.sites[1].name.split(",")[0] : null;
  return (
    <div>
      <PageHeader title="Shipments" actions={<><Button><Download className="h-4 w-4" /> Export</Button><Button primary><Truck className="h-4 w-4" /> Create label</Button></>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <button key={t.label} type="button" onClick={() => setTab(t.filter)} className={`rounded-lg border px-3 py-2.5 text-left ${tab === t.filter ? "border-[#EC5A26] ring-1 ring-[#EC5A26]" : "border-[#EBEEF1] hover:border-[#D8DEE4]"}`}>
            <div className={`text-[13px] font-semibold ${tab === t.filter ? "text-[#EC5A26]" : "text-[#6A7383]"}`}>{t.label}</div>
            <div className="mt-0.5 text-[18px] font-semibold tabular-nums text-[#1A1B25]">{all.filter((s) => !t.filter || s.status === t.filter).length}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {multiSite && <Chip label="Site" value={site ?? undefined} onClick={() => setSite(site ? null : partner)} />}
        <Chip label="Carrier" />
        <Chip label="Created" />
        <Chip label="Destination" />
        {site && <button type="button" onClick={() => setSite(null)} className="ml-1 text-[12px] font-semibold text-[#2E4C8F]">Clear filters</button>}
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead><tr><Th>Shipment</Th><Th>Order</Th><Th>To</Th><Th>Carrier</Th>{multiSite && <Th>Site</Th>}<Th>Created</Th><Th right>Cost</Th></tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} onClick={() => open(s.id)} className="cursor-pointer hover:bg-[#F6F8FA]">
                <Td><span className="inline-flex items-center gap-2"><span style={{ fontFamily: T.mono, fontSize: 13 }}>{s.id}</span><Badge tone={statusTone(s.status)}>{s.status === "Exception" ? "Problem" : s.status}</Badge>{s.status === "Returned" && returnsLive && <span className="inline-flex items-center gap-1 text-[12px] text-[#045AD0]"><Layers className="h-3 w-3" /> via your returns page</span>}</span></Td>
                <Td muted>{s.order}</Td>
                <Td>{s.to}</Td>
                <Td muted>{s.carrier} · {s.service}</Td>
                {multiSite && <Td muted>{s.site}</Td>}
                <Td muted>{s.created}</Td>
                <Td right><span className="font-semibold">{money(s.cost)}</span></Td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7} className="py-10 text-center text-[14px] text-[#6A7383]">No shipments match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-[13px] text-[#6A7383]">
        <span>{rows.length} results</span>
        <div className="flex gap-2"><Button small>Previous</Button><Button small>Next</Button></div>
      </div>
    </div>
  );
}

const eventIcon = (tone: string) =>
  tone === "green" ? <CircleCheck className="h-4 w-4 text-[#217005]" /> : tone === "amber" ? <TriangleAlert className="h-4 w-4 text-[#B13600]" /> : <Clock className="h-4 w-4 text-[#6A7383]" />;

export function ShipmentDetail({ id, back, go, trackingLive, onTrackingOn }: { id: string; back: () => void; go: (v: View) => void; trackingLive: boolean; onTrackingOn: () => void }) {
  const sc = useScenario();
  const ask = useAsk();
  const all = useMemo(() => shipmentsFor(sc), [sc]);
  const s = all.find((x) => x.id === id) ?? all[0];
  const events = eventsFor(s);
  return (
    <div>
      <button type="button" onClick={back} className="mb-3 text-[14px] font-semibold text-[#2E4C8F] hover:underline">Shipments ›</button>
      <PageHeader
        kicker={<><Package className="h-3.5 w-3.5" /> Shipment</>}
        title={<span className="inline-flex flex-wrap items-center gap-3"><span style={{ fontFamily: T.mono }}>{s.id}</span><Badge tone="positive" icon={<Check className="h-3 w-3" />}>Delivered</Badge></span>}
        actions={<><Button onClick={() => ask({ kind: "Shipment", label: s.id, view: "shipments" })}><MessageSquare className="h-4 w-4" /> Ask about this</Button><Button><Download className="h-4 w-4" /> Label</Button><Button><Undo2 className="h-4 w-4" /> Return label</Button><Button><Ellipsis className="h-4 w-4" /></Button></>}
      />
      <div className="grid grid-cols-2 gap-y-3 border-y border-[#EBEEF1] py-4 sm:grid-cols-4 sm:divide-x sm:divide-[#EBEEF1]">
        {[["Last update", "Day 3, 2:31 PM"], ["Order", s.order], ["Carrier", `${s.carrier} · ${s.service}`], ["Cost", `${money(s.cost)} USD`]].map(([l, v], i) => (
          <div key={l} className={i ? "sm:px-5" : "sm:pr-5"}>
            <div className="text-[13px] text-[#6A7383]">{l}</div>
            <div className="mt-0.5 text-[14px] font-medium text-[#1A1B25]">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <section className="min-w-0">
          <SectionTitle>Timeline</SectionTitle>
          <ol className="mt-4">
            {events.map((e, i) => (
              <li key={e.when} className="relative flex gap-3 pb-5">
                {i < events.length - 1 && <span className="absolute left-[7px] top-5 h-full w-px bg-[#EBEEF1]" />}
                <span className="relative z-10 mt-0.5 bg-white">{eventIcon(e.tone)}</span>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-[#1A1B25]">{e.title}</div>
                  <div className="text-[13px] text-[#353A44]">{e.detail}</div>
                  <div className="text-[12px] text-[#6A7383]">{e.when}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-2 rounded-lg border border-[#D8DEE4] px-3 py-2 text-[14px] text-[#6A7383]">Add a note… <span className="float-right text-[12px]" style={{ fontFamily: T.mono }}>⌘ + ↵</span></div>
        </section>
        <aside className="space-y-6">
          <div>
            <SectionTitle>Details</SectionTitle>
            <dl className="mt-3 space-y-2.5 text-[14px]">
              {[["From", `${s.site}, ${(sc.sites.find((x) => x.name.startsWith(s.site))?.kind ?? "your warehouse").toLowerCase()}`], ["To", s.to], ["Weight", s.weight], ["Promised", `${s.promised} · met`], ["Your old rate", `${money(s.cost * 1.31)} (saved ${money(s.cost * 0.31)})`]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-2"><dt className="text-[#6A7383]">{k}</dt><dd className="text-[#1A1B25]">{v}</dd></div>
              ))}
              <div className="grid grid-cols-[110px_1fr] gap-2"><dt className="text-[#6A7383]">Tracking</dt><dd className="flex items-center gap-1.5 text-[#1A1B25]"><span style={{ fontFamily: T.mono, fontSize: 13 }}>1Z84A2…7731</span><Copy className="h-3.5 w-3.5 text-[#6A7383]" /></dd></div>
            </dl>
          </div>
          <div>
            <SectionTitle>Customer saw</SectionTitle>
            {trackingLive ? (
              <p className="mt-3 text-[14px] text-[#353A44]">Your branded tracking page, 3 visits. <button type="button" onClick={() => go("shiplets")} className="inline-flex items-center gap-0.5 font-semibold text-[#2E4C8F]">Open <ArrowUpRight className="h-3.5 w-3.5" /></button></p>
            ) : (
              <div className="mt-3 rounded-lg bg-[#F5F6F8] p-3 text-[13px] text-[#353A44]">
                <div>The carrier&rsquo;s tracking page, 3 visits.</div>
                <div className="mt-2 flex items-center gap-1.5 font-semibold text-[#1A1B25]"><Layers className="h-3.5 w-3.5 text-[#045AD0]" /> Show your own page instead</div>
                <div className="text-[#6A7383]">Your logo and the delivery date. A Shiplet, ready in a minute.</div>
                <div className="mt-2"><Button small primary onClick={onTrackingOn}>Switch on</Button></div>
              </div>
            )}
          </div>
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
      <div className="flex gap-6 border-b border-[#EBEEF1] text-[14px] font-semibold">
        <span className="border-b-2 border-[#EC5A26] pb-2 text-[#EC5A26]">Invoices</span>
        <span className="pb-2 text-[#6A7383]">Payment methods</span>
        <span className="pb-2 text-[#6A7383]">Rates</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse">
          <thead><tr><Th>Invoice</Th><Th>Period</Th><Th>Issued</Th><Th>Due</Th><Th right>Amount</Th></tr></thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={inv.id} onClick={() => i === 0 && open()} className={`${i === 0 ? "cursor-pointer" : ""} hover:bg-[#F6F8FA]`}>
                <Td><span className="inline-flex items-center gap-2"><span style={{ fontFamily: T.mono, fontSize: 13 }}>{inv.id}</span><Badge tone={statusTone(inv.status)}>{inv.status}</Badge></span></Td>
                <Td>{inv.period}</Td>
                <Td muted>{inv.issued}</Td>
                <Td muted>{inv.due}</Td>
                <Td right><span className="font-semibold">{money(inv.amount)}</span> <span className="text-[12px] text-[#6A7383]">USD</span></Td>
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
      <button type="button" onClick={back} className="mb-3 text-[14px] font-semibold text-[#2E4C8F] hover:underline">Billing ›</button>
      <PageHeader
        kicker={<><Receipt className="h-3.5 w-3.5" /> Invoice</>}
        title={<span className="inline-flex flex-wrap items-center gap-3">{money(total)} <span className="text-[24px] font-normal text-[#6A7383]">USD</span><Badge tone="info">Open</Badge></span>}
        actions={<><Button><Download className="h-4 w-4" /> PDF</Button><Button primary>Pay now</Button></>}
      />
      <div className="grid grid-cols-2 gap-y-3 border-y border-[#EBEEF1] py-4 sm:grid-cols-4 sm:divide-x sm:divide-[#EBEEF1]">
        {[["Billed to", sc.account.name], ["Period", inv.period], ["Due", inv.due], ["Number", inv.id]].map(([l, v], i) => (
          <div key={l} className={i ? "sm:px-5" : "sm:pr-5"}><div className="text-[13px] text-[#6A7383]">{l}</div><div className="mt-0.5 text-[14px] font-medium text-[#1A1B25]">{v}</div></div>
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
                      <Td right><button type="button" onClick={() => ask({ kind: "Invoice", label: `${inv.id} · ${l.item}`, view: "billing" })} className="text-[12px] font-semibold text-[#2E4C8F] opacity-100 md:opacity-0 md:group-hover:opacity-100">Question</button></Td>
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
              <div className="flex justify-between"><dt className="text-[#6A7383]">Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-[#6A7383]">Credits</dt><dd className="text-[#217005]">{money(credits)}</dd></div>
              <div className="flex justify-between"><dt className="text-[#6A7383]">Tax</dt><dd>—</dd></div>
              <div className="flex justify-between border-t border-[#EBEEF1] pt-2 font-semibold text-[#1A1B25]"><dt>Amount due</dt><dd>{money(total)}</dd></div>
            </dl>
          </Panel>
          <p className="text-[13px] text-[#6A7383]">Hover any line and choose <b>Question</b> to ask {sc.warehouse ? "your account team" : "our support team"} about it. It shows up in Requests, and any credit lands on your next invoice.</p>
        </aside>
      </div>
    </div>
  );
}
