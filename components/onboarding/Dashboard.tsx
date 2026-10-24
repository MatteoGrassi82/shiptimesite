"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowRight,
  Bell,
  ChartColumn,
  Check,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  PanelLeft,
  PiggyBank,
  Plus,
  Receipt,
  Search,
  Settings,
  Sparkles,
  Timer,
  TrendingUp,
  Truck,
  Users,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { savingsEstimate, money, type Answers, type PlanId } from "./data";

// ── App home ─────────────────────────────────────────────────────────────────
// The signed-in dashboard, in the shadcn layout most SaaS products now share:
// a quiet sidebar (nav, your team, you), a slim header, KPI cards, one chart,
// then the work. Neutral surfaces from the ShipTime One tokens, orange only for
// actions, Inter for UI text (ShipTime's brand system puts UI copy in Inter).

type Item = { id: string; title: string; body: string; locked?: boolean };

function buildChecklist(a: Answers, plan: PlanId): Item[] {
  const items: Item[] = [
    { id: "test", title: "Print a free test label", body: "See how a label works. Nothing is charged." },
    { id: "from", title: "Add your ship-from address", body: "So every quote is exact." },
  ];
  const store = a.sources.find((s) => ["shopify", "woo", "amazon"].includes(s));
  const name = store === "shopify" ? "Shopify" : store === "woo" ? "WooCommerce" : store === "amazon" ? "Amazon" : null;
  items.push(name ? { id: "store", title: `Connect your ${name} store`, body: "Orders come in by themselves." } : { id: "store", title: "Import orders from a spreadsheet", body: "Upload a CSV, or type one by hand." });
  if (a.ships.includes("us") || a.ships.includes("intl")) items.push({ id: "customs", title: "Set up customs once", body: "Then the forms come with every label." });
  if (a.ships.includes("pallets")) items.push({ id: "freight", title: "Add your pallet details", body: "Freight quotes next to parcels." });
  items.push(plan === "team" ? { id: "advisor", title: "Book your kickoff call with Sarah", body: "30 minutes to set up the rest." } : { id: "invite", title: "Invite a teammate", body: "Let your packers print labels too.", locked: true });
  return items;
}

const weeks = [
  { week: "Wk 1", shipped: 64, onTime: 60 },
  { week: "Wk 2", shipped: 69, onTime: 66 },
  { week: "Wk 3", shipped: 66, onTime: 63 },
  { week: "Wk 4", shipped: 72, onTime: 69 },
  { week: "Wk 5", shipped: 71, onTime: 68 },
  { week: "Wk 6", shipped: 78, onTime: 75 },
  { week: "Wk 7", shipped: 76, onTime: 73 },
  { week: "Wk 8", shipped: 82, onTime: 79 },
];

const kpis = [
  { label: "Parcels this month", value: "312", delta: "+18% from last month", icon: Package },
  { label: "Shipping spend", value: "$5,740", delta: "$18.40 a parcel on average", icon: Receipt },
  { label: "Saved vs list rates", value: "$1,029", delta: "$3.30 a parcel this month", icon: PiggyBank, good: true },
  { label: "Delivered on time", value: "96.4%", delta: "+1.2 pts from last month", icon: Timer },
];

const shipments: { id: string; to: string; carrier: string; status: "Delivered" | "In transit" | "Needs attention"; cost: string; note?: string }[] = [
  { id: "MPL-1048", to: "Toronto, ON", carrier: "Canada Post · Expedited", status: "Delivered", cost: "$13.85" },
  { id: "MPL-1047", to: "Seattle, WA", carrier: "Cross-border lane", status: "In transit", cost: "$22.50" },
  { id: "MPL-1046", to: "Calgary, AB", carrier: "Purolator · Ground", status: "In transit", cost: "$19.10" },
  { id: "MPL-1045", to: "Montréal, QC", carrier: "Canpar · Ground", status: "Delivered", cost: "$14.20" },
  { id: "MPL-1044", to: "Denver, CO", carrier: "UPS · Standard", status: "Needs attention", cost: "$24.60", note: "Address check · Sarah is on it" },
];

const statusStyle: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  "In transit": "bg-sky-50 text-sky-700 ring-sky-600/15",
  "Needs attention": "bg-amber-50 text-amber-700 ring-amber-600/20",
};

function Avatar({ initials, tone = "ink", size = "h-8 w-8", dot }: { initials: string; tone?: "ink" | "soft"; size?: string; dot?: boolean }) {
  return (
    <span className={`relative inline-flex ${size} shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${tone === "ink" ? "bg-[var(--ink)] text-white" : "bg-[var(--surface-2)] text-[var(--brand-2)]"}`}>
      {initials}
      {dot && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />}
    </span>
  );
}

function NavItem({ icon: Icon, label, active, locked, onClick }: { icon: typeof Package; label: string; active?: boolean; locked?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14.5px] font-medium transition-colors ${active ? "bg-[var(--muted)] text-[var(--ink)]" : locked ? "text-[var(--ink-3)]/60 hover:bg-[var(--muted)]" : "text-[var(--ink-2)] hover:bg-[var(--muted)] hover:text-[var(--ink)]"}`}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      <span className="flex-1 text-left">{label}</span>
      {locked && <Lock className="h-3.5 w-3.5" />}
    </button>
  );
}

function Sidebar({ plan, onLocked }: { plan: PlanId; onLocked: (f: string) => void }) {
  const free = plan === "free";
  return (
    <aside className="hidden w-[264px] shrink-0 flex-col border-r border-[var(--line)] bg-white md:flex">
      <div className="flex h-[68px] items-center px-5">
        <img src="/shiptime-logo.svg" alt="ShipTime" width={130} height={40} className="h-7 w-auto" />
      </div>
      <nav className="space-y-0.5 px-3 pt-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" active />
        <NavItem icon={Truck} label="Ship" />
        <NavItem icon={Package} label="Shipments" />
        <NavItem icon={ChartColumn} label="Reports" />
        <NavItem icon={MapPin} label="Locations" locked={free} onClick={() => free && onLocked("Locations")} />
        <NavItem icon={MessageSquare} label="Messages" locked={free} onClick={() => free && onLocked("Your advisor")} />
        <NavItem icon={Layers} label="Shiplets" locked={free} onClick={() => free && onLocked("Shiplets")} />
        <NavItem icon={Settings} label="Settings" />
      </nav>
      <div className="px-5 pb-2 pt-7 text-[13px] font-medium text-[var(--ink-3)]">Your team</div>
      <div className="space-y-1 px-3">
        {plan === "team" && (
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <Avatar initials="SC" dot />
            <span className="flex-1 text-[14.5px] font-medium text-[var(--ink)]">Sarah Chen</span>
            <span className="text-[12.5px] text-[var(--ink-3)]">Advisor</span>
          </div>
        )}
        <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
          <Avatar initials="EM" tone="soft" />
          <span className="flex-1 text-[14.5px] font-medium text-[var(--ink)]">Emma Moreau</span>
          <span className="text-[12.5px] text-[var(--ink-3)]">Owner</span>
        </div>
        <button type="button" onClick={() => free && onLocked("Teammates")} className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-[14px] font-medium text-[var(--ink-3)] hover:bg-[var(--muted)]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[var(--line)]"><Plus className="h-4 w-4" /></span>
          Invite a teammate {free && <Lock className="ml-auto h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="mt-auto flex items-center gap-3 border-t border-[var(--line)] px-5 py-4">
        <Avatar initials="EM" tone="soft" size="h-9 w-9" />
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[14.5px] font-semibold text-[var(--ink)]">Emma Moreau</div>
          <div className="truncate text-[13px] text-[var(--ink-3)]">emma@mapleandco.ca</div>
        </div>
      </div>
    </aside>
  );
}

function SectionCard({ title, description, action, children, className = "" }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={`min-w-0 rounded-xl border-[var(--line)] shadow-[0_1px_2px_rgba(28,30,61,0.04)] ${className}`}>
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <div>
          <h3 className="text-[17px] font-semibold tracking-tight text-[var(--ink)]">{title}</h3>
          {description && <p className="mt-1 text-[14px] text-[var(--ink-3)]">{description}</p>}
        </div>
        {action}
      </div>
      <div className="px-6 pb-6 pt-5">{children}</div>
    </Card>
  );
}

export default function Dashboard({ answers, plan, setPlan, partner }: { answers: Answers; plan: PlanId; setPlan: (p: PlanId) => void; partner: string | null }) {
  const items = useMemo(() => buildChecklist(answers, plan), [answers, plan]);
  const [done, setDone] = useState<string[]>(["test", "from"]);
  const [upsell, setUpsell] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const save = savingsEstimate(answers);
  const pct = Math.round((done.length / items.length) * 100);
  const tick = (it: Item) => {
    if (it.locked && plan === "free") return setUpsell("Teammates");
    if (it.id === "advisor") setBooked(true);
    setDone((d) => (d.includes(it.id) ? d : [...d, it.id]));
  };

  return (
    <div className="flex min-h-[calc(100vh-32px)] bg-[var(--surface)]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <Sidebar plan={plan} onLocked={setUpsell} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-[68px] items-center gap-4 border-b border-[var(--line)] bg-white/90 px-5 backdrop-blur md:px-8">
          <PanelLeft className="h-5 w-5 text-[var(--ink-2)]" strokeWidth={1.8} />
          <h1 className="text-[19px] font-semibold tracking-tight text-[var(--ink)]">Welcome back, Emma</h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            {plan === "team" ? (
              <span className="hidden items-center gap-1.5 rounded-full bg-[#FFF4EF] px-3 py-1 text-[12.5px] font-semibold text-[var(--brand)] sm:inline-flex"><Sparkles className="h-3.5 w-3.5" /> Team trial · 14 days left</span>
            ) : (
              <button type="button" onClick={() => setUpsell("Team")} className="hidden rounded-full border border-[var(--line)] px-3 py-1 text-[12.5px] font-semibold text-[var(--ink)] hover:bg-[var(--muted)] sm:inline-flex">Free plan · Try Team</button>
            )}
            <Search className="h-5 w-5 text-[var(--ink-2)]" strokeWidth={1.8} />
            <Bell className="h-5 w-5 text-[var(--ink-2)]" strokeWidth={1.8} />
            <Avatar initials="EM" tone="soft" size="h-9 w-9" />
          </div>
        </header>

        <main className="mx-auto max-w-[1240px] space-y-6 p-5 md:p-8">
          {partner && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-600/15 bg-emerald-50 px-4 py-2.5 text-[14px] text-emerald-800">
              <Check className="h-4 w-4" strokeWidth={2.5} /> {partner} member rates are on for every quote.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map(({ label, value, delta, icon: Icon, good }) => (
              <Card key={label} className="rounded-xl border-[var(--line)] p-6 shadow-[0_1px_2px_rgba(28,30,61,0.04)]">
                <div className="flex items-start justify-between">
                  <span className="text-[14.5px] font-medium text-[var(--ink)]">{label}</span>
                  <Icon className="h-5 w-5 text-[var(--ink-3)]" strokeWidth={1.7} />
                </div>
                <div className="mt-6 text-[30px] font-semibold tracking-tight text-[var(--ink)]">{value}</div>
                <div className={`mt-1 flex items-center gap-1 text-[13.5px] ${good ? "text-emerald-700" : "text-[var(--ink-3)]"}`}>
                  {delta.startsWith("+") && <TrendingUp className="h-3.5 w-3.5" />} {delta}
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <SectionCard className="xl:col-span-2" title="Shipments" description="Parcels shipped against parcels delivered on time, last eight weeks">
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeks} margin={{ left: -18, right: 6, top: 6, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillShipped" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1c1e3d" stopOpacity={0.14} />
                        <stop offset="100%" stopColor="#1c1e3d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 4" stroke="#e8e8e8" />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} stroke="#6e728a" />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#6e728a" domain={[0, 90]} ticks={[0, 30, 60, 90]} />
                    <Tooltip cursor={{ stroke: "#e8e8e8" }} contentStyle={{ borderRadius: 12, border: "1px solid #e8e8e8", fontSize: 12.5, boxShadow: "0 8px 24px rgba(28,30,61,.08)" }} />
                    <Area type="monotone" dataKey="shipped" name="Shipped" stroke="#1c1e3d" strokeWidth={2} fill="url(#fillShipped)" />
                    <Area type="monotone" dataKey="onTime" name="On time" stroke="#ec5a26" strokeWidth={2} strokeDasharray="5 4" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center justify-center gap-5 text-[13px] text-[var(--ink-3)]">
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--ink)]" /> Shipped</span>
                <span className="inline-flex items-center gap-2"><span className="h-0.5 w-4 border-t-2 border-dashed border-[var(--brand)]" /> On time</span>
              </div>
            </SectionCard>

            <SectionCard title="Finish setting up" description={`${done.length} of ${items.length} done`}>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <ul className="space-y-1">
                {items.map((it) => {
                  const ok = done.includes(it.id);
                  const locked = it.locked && plan === "free";
                  return (
                    <li key={it.id}>
                      <button type="button" onClick={() => tick(it)} className="flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-[var(--muted)]">
                        <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${ok ? "border-emerald-600 bg-emerald-600" : "border-[var(--line)] bg-white"}`}>{ok && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}</span>
                        <span className="min-w-0 flex-1">
                          <span className={`block text-[14.5px] font-medium ${ok ? "text-[var(--ink-3)] line-through" : "text-[var(--ink)]"}`}>{it.title}</span>
                          <span className="block text-[13px] text-[var(--ink-3)]">{it.body}</span>
                        </span>
                        {locked && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--brand-2)]"><Lock className="h-3 w-3" /> Team</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </SectionCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <SectionCard className="xl:col-span-2" title="Recent shipments" description="Your last five labels" action={<button type="button" className="text-[13.5px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)]">View all</button>}>
              <div className="-mx-2 overflow-x-auto">
                <table className="w-full min-w-[560px] text-[14px]">
                  <thead>
                    <tr className="text-left text-[12.5px] text-[var(--ink-3)]">
                      <th className="px-2 pb-3 font-medium">Order</th>
                      <th className="px-2 pb-3 font-medium">Destination</th>
                      <th className="px-2 pb-3 font-medium">Carrier</th>
                      <th className="px-2 pb-3 font-medium">Status</th>
                      <th className="px-2 pb-3 text-right font-medium">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((s) => (
                      <tr key={s.id} className="border-t border-[var(--line)]">
                        <td className="px-2 py-3 font-medium text-[var(--ink)]">{s.id}</td>
                        <td className="px-2 py-3 text-[var(--ink-2)]">{s.to}</td>
                        <td className="px-2 py-3 text-[var(--ink-2)]">{s.carrier}</td>
                        <td className="px-2 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold ring-1 ring-inset ${statusStyle[s.status]}`}>{s.status}</span>
                          {s.note && <div className="mt-1 text-[12px] text-[var(--ink-3)]">{s.note}</div>}
                        </td>
                        <td className="px-2 py-3 text-right font-medium tabular-nums text-[var(--ink)]">{s.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            <div className="min-w-0 space-y-6">
              {plan === "team" ? (
                <SectionCard title="Your advisor">
                  <div className="flex items-center gap-3">
                    <Avatar initials="SC" size="h-11 w-11" dot />
                    <div className="leading-tight">
                      <div className="text-[15px] font-semibold text-[var(--ink)]">Sarah Chen</div>
                      <div className="text-[13px] text-[var(--ink-3)]">Logistics advisor · online</div>
                    </div>
                  </div>
                  <p className="mt-4 rounded-lg bg-[var(--muted)] p-3 text-[14px] leading-relaxed text-[var(--ink-2)]">Hi Emma, I&rsquo;m looking at the Denver parcel now. Want 30 minutes this week to set up customs together?</p>
                  <div className="mt-4 flex gap-2">
                    {booked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-semibold text-emerald-700"><Check className="h-3.5 w-3.5" strokeWidth={3} /> Booked · Mon 10:00</span>
                    ) : (
                      <button type="button" onClick={() => { setBooked(true); setDone((d) => (d.includes("advisor") ? d : [...d, "advisor"])); }} className="rounded-full bg-[var(--brand)] px-4 py-2 text-[13.5px] font-semibold text-white hover:opacity-90">Book a call</button>
                    )}
                    <button type="button" className="rounded-full border border-[var(--line)] px-4 py-2 text-[13.5px] font-semibold text-[var(--ink)] hover:bg-[var(--muted)]">Message</button>
                  </div>
                </SectionCard>
              ) : (
                <SectionCard title="Want a logistics team?" description="An advisor who handles customs, stuck parcels and carrier disputes for you.">
                  <button type="button" onClick={() => setUpsell("Team")} className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-[13.5px] font-semibold text-white hover:opacity-90"><Users className="h-4 w-4" /> Try Team free for 14 days</button>
                </SectionCard>
              )}
              {save > 0 && (
                <Card className="rounded-xl border-0 bg-[var(--ink)] p-6 text-white shadow-[0_1px_2px_rgba(28,30,61,0.04)]">
                  <div className="text-[13px] text-white/70">Your savings estimate</div>
                  <div className="mt-1 text-[26px] font-semibold tracking-tight text-[#F0845B]">Up to {money(save)} a year</div>
                  <p className="mt-1 text-[13.5px] text-white/70">Connect your store and we check every order for the exact number.</p>
                  <Link href="/shipping-check" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 text-[13.5px] font-semibold text-white no-underline hover:opacity-90">Get my exact number <ArrowRight className="h-4 w-4" /></Link>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {upsell && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setUpsell(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,30,61,.45)] p-4">
            <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[460px] rounded-2xl border border-[var(--line)] bg-white p-7 shadow-xl">
              <button type="button" onClick={() => setUpsell(null)} aria-label="Close" className="absolute right-4 top-4 text-[var(--ink-3)] hover:text-[var(--ink)]"><X className="h-5 w-5" /></button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[12px] font-semibold text-[var(--brand-2)]"><Users className="h-3.5 w-3.5" /> ShipTime Team</span>
              <h2 className="mt-3 text-[22px] font-semibold tracking-tight text-[var(--ink)]">{upsell === "Team" ? "Get your own logistics team" : `${upsell} is part of ShipTime Team`}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--ink-2)]">Teammates, locations, Shiplets, and an advisor who handles customs, stuck parcels and carrier disputes for you.</p>
              <p className="mt-3 text-[13.5px] text-[var(--ink-3)]">Free for 14 days, no card. We agree pricing with you before the trial ends.</p>
              <button type="button" onClick={() => { setPlan("team"); setUpsell(null); }} className="mt-5 w-full rounded-full bg-[var(--brand)] py-3 text-[15px] font-semibold text-white hover:opacity-90">Start the free trial</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
