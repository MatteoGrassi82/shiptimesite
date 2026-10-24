"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Warehouse } from "lucide-react";
import { useBrand } from "./brand";
import { useScenario } from "./derive";
import { CITY_POINTS, US_STATES, VIEWBOX } from "./geo-data";
import { useAsk } from "./Requests";
import type { Site } from "./scenarios";
import { Badge, Button, PageHeader, Panel, Segmented, Stat, StatRow, Td, Th, type View } from "./ui";

// ── Warehouses ───────────────────────────────────────────────────────────────
// The network on a map, the way the best fulfilment dashboards do it: one
// sentence for the change (ShipBob's "current vs ideal"), states filled by how
// many days a parcel takes from the nearest site (Red Stag's transit maps,
// in bands, never radius circles), reach weighted by where orders actually go
// (Flexport's coverage map), and a before / now / planned switch. The headline,
// the map and the numbers all come from the same calculation, so they agree.
// Transit days are an estimate from distance until real delivery dates
// (recorded since Oct 9) cover enough orders.

const R = 3958.8;
const rad = (x: number) => (x * Math.PI) / 180;
const miles = (a: [number, number], b: [number, number]) => {
  const h = Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
// Ground business days by distance: a planning estimate, not a carrier promise.
const groundDays = (mi: number) => (mi < 300 ? 1 : mi < 650 ? 2 : mi < 1100 ? 3 : mi < 1700 ? 4 : 5);

type Cover = { days: number; site: string };
function coverage(sites: string[]): Record<string, Cover> {
  const out: Record<string, Cover> = {};
  for (const s of US_STATES) {
    let best: Cover = { days: 9, site: "" };
    for (const name of sites) {
      const c = CITY_POINTS[name];
      if (!c) continue;
      const d = groundDays(miles([c.lat, c.lon], [s.lat, s.lon])) + (s.code === "AK" || s.code === "HI" ? 2 : 0);
      if (d < best.days) best = { days: d, site: name };
    }
    out[s.code] = best;
  }
  return out;
}

const city = (siteName: string) => siteName.split(",")[0];
const siteType = (s: Site) => (s.status.startsWith("Going live") ? "planned" : s.kind.startsWith("Your") ? "own" : "partner");

export function SitesPage({ go }: { go: (v: View) => void }) {
  const sc = useScenario();
  const { c: pal } = useBrand();
  const RAMP = pal.ramp; // 1, 2, 3, 4, 5+ days
  const ask = useAsk();
  const story = sc.map!;
  const added = story.now.filter((s) => !story.before.includes(s));
  const modes = useMemo(() => [
    ...(added.length ? [{ id: "before", label: `Before ${added.join(" & ")}`, sites: story.before }] : []),
    { id: "now", label: "Now", sites: story.now },
    ...(story.planned ? [{ id: "planned", label: `+ ${story.planned.join(", ")} (planned)`, sites: [...story.now, ...story.planned] }] : []),
  ], [story, added.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const [mode, setMode] = useState<string>("now");
  const [hover, setHover] = useState<{ code: string; x: number; y: number } | null>(null);
  const [focus, setFocus] = useState<string | null>(null);

  // Order share by state: the account's own split, or US population.
  const weights = useMemo(() => {
    const total = US_STATES.reduce((a, s) => a + s.pop, 0);
    return Object.fromEntries(US_STATES.map((s) => [s.code, story.demand ? (story.demand[s.code] ?? 0) / 100 : s.pop / total]));
  }, [story.demand]);
  const covers = useMemo(() => Object.fromEntries(modes.map((m) => [m.id, coverage(m.sites)])), [modes]);
  const stat = (id: string) => {
    const c = covers[id];
    let reach = 0, days = 0, w = 0;
    for (const s of US_STATES) { const k = weights[s.code]; w += k; days += c[s.code].days * k; if (c[s.code].days <= story.days) reach += k; }
    return { reach: Math.round((reach / w) * 100), days: days / w };
  };
  const first = stat(modes[0].id), current = stat("now");
  const planned = story.planned ? stat("planned") : null;
  const cover = covers[mode];
  const reachLabel = story.days === 1 ? "Next-day reach" : "2-day reach";
  const who = story.demand ? "orders" : "customers";
  const pins = sc.sites.filter((s) => CITY_POINTS[city(s.name)]);
  const hs = hover && US_STATES.find((s) => s.code === hover.code);
  const before = covers[modes[0].id];

  return (
    <div className="space-y-6">
      <PageHeader title="Warehouses" subtitle="Your own warehouse and the partner warehouses we run with you." actions={<><Button onClick={() => go("report")}>Results</Button><Button onClick={() => go("golive")}>{city(sc.nextSite!.name)} go-live</Button></>} />

      <div>
        <div className="text-[20px] font-semibold leading-7 text-[color:var(--c-ink)]">
          {added.length ? <>{reachLabel} went from {first.reach}% to <span className="text-[color:var(--c-action-text)]">{current.reach}%</span> of your {who} since {added.join(" & ")} went live.</> : <>{reachLabel} from {story.now.join(" & ")}: {current.reach}% of your US {who}.</>}
        </div>
        {story.region && <p className="mt-1 text-[15px] text-[color:var(--c-text)]">{story.region}</p>}
        {story.offMap && <p className="mt-1 text-[13px] text-[color:var(--c-muted)]">{story.offMap}</p>}
        {modes.length > 1 && <div className="mt-3"><Segmented options={modes.map((m) => ({ id: m.id, label: m.label }))} value={mode} onChange={setMode} /></div>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Panel className="relative overflow-hidden p-3">
          <svg viewBox={VIEWBOX} className="h-auto w-full" onMouseLeave={() => setHover(null)}>
            {US_STATES.map((s) => {
              const c = cover[s.code];
              const dim = focus && c.site !== focus;
              return (
                <path key={s.code} d={s.d} fill={RAMP[Math.min(c.days, 5) - 1]} stroke="#FFFFFF" strokeWidth={0.8} opacity={dim ? 0.25 : 1}
                  onMouseMove={(e) => { const r = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect(); setHover({ code: s.code, x: e.clientX - r.left, y: e.clientY - r.top }); }} />
              );
            })}
            {pins.map((s) => {
              const p = CITY_POINTS[city(s.name)];
              const t = siteType(s);
              const off = t === "planned" && mode !== "planned";
              return (
                <g key={s.name} transform={`translate(${p.xy[0]},${p.xy[1]})`} opacity={off ? 0.55 : 1} className="cursor-pointer" onClick={() => setFocus(focus === city(s.name) ? null : city(s.name))}>
                  <circle r={t === "own" ? 8 : 7} fill={t === "own" ? pal.ink : "#FFFFFF"} stroke={t === "own" ? "#FFFFFF" : pal.ink} strokeWidth={2.5} strokeDasharray={t === "planned" ? "3 2" : undefined} />
                  <text x={12} y={4} fontSize={14} fontWeight={600} fill={pal.ink} stroke="#FFFFFF" strokeWidth={4} paintOrder="stroke">{city(s.name)}</text>
                </g>
              );
            })}
          </svg>
          {hs && hover && (
            <div className="pointer-events-none absolute z-10 w-[230px] rounded-lg border border-[color:var(--c-line)] bg-white p-3 text-[13px] shadow-[0_5px_15px_rgba(0,0,0,.12)]" style={{ left: hover.x > 520 ? hover.x - 244 : hover.x + 14, top: hover.y + 14 }}>
              <div className="font-semibold text-[color:var(--c-ink)]">{hs.name}</div>
              <div className="text-[color:var(--c-muted)]">{(weights[hs.code] * 100).toFixed(weights[hs.code] < 0.01 ? 1 : 0)}% of your {who}</div>
              <div className="mt-1 text-[color:var(--c-text)]">{cover[hs.code].days} day{cover[hs.code].days > 1 ? "s" : ""} from {cover[hs.code].site}{mode !== modes[0].id && before[hs.code].days !== cover[hs.code].days ? <span className="text-[#217005]"> (was {before[hs.code].days} from {before[hs.code].site})</span> : null}</div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[color:var(--c-line)] px-1 pt-2 text-[12px] text-[color:var(--c-muted)]">
            {["1 day", "2 days", "3 days", "4 days", "5+"].map((l, i) => <span key={l} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: RAMP[i] }} />{l}</span>)}
            <span className="ml-auto inline-flex items-center gap-3"><span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[color:var(--c-ink)]" />Yours</span><span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border-2 border-[color:var(--c-ink)]" />Partner</span><span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-[color:var(--c-ink)]" />Planned</span></span>
          </div>
        </Panel>

        <div className="space-y-3">
          {sc.sites.map((s) => {
            const t = siteType(s);
            const active = focus === city(s.name);
            return (
              <button key={s.name} type="button" onClick={() => setFocus(active ? null : city(s.name))} className={`w-full rounded-lg border bg-white p-3 text-left transition-colors ${active ? "border-[color:var(--c-ink)]" : "border-[color:var(--c-line)] hover:border-[color:var(--c-border)]"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[color:var(--c-ink)]"><Warehouse className="h-4 w-4 text-[color:var(--c-muted)]" />{s.name}</div>
                  <Badge tone={t === "planned" ? "info" : "neutral"}>{t === "planned" ? s.status : t === "own" ? "Yours" : "Partner"}</Badge>
                </div>
                {s.orders ? (
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[12px] text-[color:var(--c-muted)]">
                    <div><div className="text-[15px] font-semibold tabular-nums text-[color:var(--c-ink)]">{s.orders.toLocaleString()}</div>orders</div>
                    <div><div className="text-[15px] font-semibold tabular-nums text-[color:var(--c-ink)]">{s.costPerOrder}</div>shipping/order</div>
                    <div><div className="text-[15px] font-semibold tabular-nums text-[color:var(--c-ink)]">{s.onTime}</div>on time</div>
                  </div>
                ) : <div className="mt-2 text-[12px] text-[color:var(--c-muted)]">{sc.nextSite!.daysLeft} days to go-live{planned && story.planned!.includes(city(s.name)) ? ` · adds ${planned.reach - current.reach} pts of ${reachLabel.toLowerCase()}` : ""}</div>}
              </button>
            );
          })}
          <p className="px-1 text-[12px] text-[color:var(--c-muted)]">Click a warehouse to see the states it serves fastest. Shipping per order excludes warehouse fees, which are on your bill.</p>
        </div>
      </div>

      <StatRow>
        <Stat label={`${reachLabel} (estimated)`} value={added.length ? `${first.reach}% → ${current.reach}%` : `${current.reach}%`} />
        <Stat label="Average days to deliver" value={added.length ? `${first.days.toFixed(1)} → ${current.days.toFixed(1)}` : current.days.toFixed(1)} />
        {planned ? <Stat label={`With ${story.planned!.join(", ")}`} value={`${planned.reach}%, ${planned.days.toFixed(1)} days`} sub={`From ${sc.nextSite!.date}`} /> : <Stat label="Warehouses live" value={sc.sites.filter((x) => x.orders).length} />}
      </StatRow>
      <p className="text-[12px] text-[color:var(--c-muted)]">Days are estimated ground transit from each warehouse to the center of each state. They switch to real delivery times as those build up.</p>

      <section>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse">
            <thead><tr><Th>Warehouse</Th><Th>Type</Th><Th right>Orders, 30 days</Th><Th right>Shipping per order</Th><Th right>On time</Th><Th right>{""}</Th></tr></thead>
            <tbody>
              {sc.sites.map((s) => (
                <tr key={s.name}>
                  <Td><span className="font-medium">{s.name}</span></Td><Td muted>{s.kind}</Td><Td right>{s.orders ? s.orders.toLocaleString() : "—"}</Td><Td right>{s.costPerOrder}</Td><Td right>{s.onTime}</Td>
                  <Td right><button type="button" onClick={() => ask({ kind: "Warehouse", label: s.name, view: "network" })} className="inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--c-link)]"><MessageSquare className="h-3.5 w-3.5" /> Ask</button></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
