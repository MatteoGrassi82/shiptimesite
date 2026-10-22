"use client";

import { useState, type ReactNode } from "react";
import {
  Bell, ChevronsUpDown, CircleHelp, Code, FileText, House, Inbox, Layers, ListChecks, LogOut, Package, Plus, Receipt, Route, Search, Settings, Warehouse,
  ChartColumn, Users,
} from "lucide-react";
import { useScenario } from "./derive";

// Shared frame for the /dashboard mockup. One app for every account, the way
// Shopify Plus sits on top of Shopify: the same pages for everyone (Home,
// Shipments, Billing, Shiplets), and ShipTime One switches more on (a block
// for sites, rules, go-lives and reports, an account team, and extras inside
// the shared pages). Look from Stripe's dashboard (neutral surfaces, thin
// keylines, 36px table rows, small bordered badges, one accent colour for
// actions); the accent is ShipTime orange.

export type View = "home" | "shipments" | "shipment" | "billing" | "invoice" | "shiplets" | "shiplet" | "requests" | "network" | "rules" | "rule" | "golive" | "report" | "developers";

export const T = {
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: 'Menlo, Consolas, "SFMono-Regular", monospace',
};

// ── Small parts ──────────────────────────────────────────────────────────────

type BadgeTone = "neutral" | "info" | "positive" | "negative" | "warning" | "urgent";
const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-[#F4F7FA] text-[#50617A] border-[#D4DEE9]",
  info: "bg-[#E2FBFE] text-[#045AD0] border-[#A7E7FC]",
  positive: "bg-[#EAFCDD] text-[#217005] border-[#A8F170]",
  negative: "bg-[#FEF4F6] text-[#C0123C] border-[#FBD3DC]",
  warning: "bg-[#FDF8C9] text-[#B13600] border-[#FBD992]",
  urgent: "bg-[#E61947] text-white border-[#E61947]",
};
export function Badge({ tone = "neutral", children, icon }: { tone?: BadgeTone; children: ReactNode; icon?: ReactNode }) {
  return (
    <span className={`inline-flex h-5 items-center gap-1 whitespace-nowrap rounded border px-1.5 text-[12px] font-medium leading-4 ${badgeTones[tone]}`}>
      {children}
      {icon}
    </span>
  );
}

export const statusTone = (s: string): BadgeTone =>
  ({ Delivered: "positive", Paid: "positive", Live: "positive", "In transit": "info", Open: "info", "Label created": "neutral", Draft: "neutral", Returned: "neutral", "Call booked": "info", Exception: "warning", "Past due": "warning", Failed: "negative" } as Record<string, BadgeTone>)[s] ?? "neutral";

export function Button({ children, onClick, primary, small }: { children: ReactNode; onClick?: () => void; primary?: boolean; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-semibold transition-colors ${small ? "h-7 px-2.5 text-[13px]" : "h-8 px-3 text-[14px]"} ${
        primary
          ? "bg-[#EC5A26] text-white shadow-[0_1px_1px_rgba(0,0,0,.12),0_2px_5px_rgba(48,49,61,.08)] hover:bg-[#D94E1C]"
          : "border border-[#D8DEE4] bg-white text-[#353A44] shadow-[0_1px_1px_rgba(0,0,0,.06)] hover:bg-[#F6F8FA]"
      }`}
    >
      {children}
    </button>
  );
}

export function Chip({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return value ? (
    <button type="button" onClick={onClick} className="inline-flex h-6 items-center gap-1 rounded-full border border-[#D8DEE4] bg-white px-2 text-[12px] font-semibold text-[#353A44]">
      <span className="text-[#6A7383]">⊗</span> {label} <span className="text-[#D8DEE4]">|</span> <span className="text-[#C2410C]">{value}</span>
    </button>
  ) : (
    <button type="button" onClick={onClick} className="inline-flex h-6 items-center gap-1 rounded-full border border-dashed border-[#C0C8D2] px-2 text-[12px] font-semibold text-[#6A7383] hover:bg-[#F6F8FA]">
      <Plus className="h-3 w-3" /> {label}
    </button>
  );
}

export function PageHeader({ title, subtitle, actions, kicker }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; kicker?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
      <div className="min-w-0">
        {kicker && <div className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#6A7383]">{kicker}</div>}
        <h1 className="text-[28px] font-bold leading-9 text-[#1A1B25]">{title}</h1>
        {subtitle && <div className="mt-1 text-[14px] text-[#6A7383]">{subtitle}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#EBEEF1] pb-2">
      <h2 className="text-[20px] font-semibold leading-7 text-[#1A1B25]">{children}</h2>
      {action}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-[#EBEEF1] bg-white ${className}`}>{children}</div>;
}

export function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return <th className={`h-9 border-b border-[#D8DEE4] px-2 text-[13px] font-semibold text-[#353A44] ${right ? "text-right" : "text-left"}`}>{children}</th>;
}
export function Td({ children, right, muted, mono }: { children: ReactNode; right?: boolean; muted?: boolean; mono?: boolean }) {
  return (
    <td className={`h-9 border-b border-[#EBEEF1] px-2 text-[14px] ${right ? "text-right tabular-nums" : ""} ${muted ? "text-[#6A7383]" : "text-[#353A44]"}`} style={mono ? { fontFamily: T.mono, fontSize: 13 } : undefined}>
      {children}
    </td>
  );
}

// ── The frame ────────────────────────────────────────────────────────────────

type NavItem = { label: string; icon: typeof House; view?: View };
type NavGroup = { group?: string; one?: boolean; items: NavItem[] };
const NAV: NavGroup[] = [
  { items: [
    { label: "Home", icon: House, view: "home" },
    { label: "Shipments", icon: Package, view: "shipments" },
    { label: "Rates & carriers", icon: ChartColumn },
    { label: "Customers", icon: Users },
    { label: "Billing", icon: Receipt, view: "billing" },
    { label: "Shiplets", icon: Layers, view: "shiplets" },
    { label: "Requests", icon: Inbox, view: "requests" },
  ] },
  { group: "ShipTime One", one: true, items: [
    { label: "Sites", icon: Warehouse, view: "network" },
    { label: "Rules", icon: Route, view: "rules" },
    { label: "Projects", icon: ListChecks, view: "golive" },
    { label: "Reports", icon: FileText, view: "report" },
  ] },
];

const isActive = (view: View, target?: View) =>
  !!target && (view === target || (view === "shipment" && target === "shipments") || (view === "invoice" && target === "billing") || (view === "rule" && target === "rules") || (view === "shiplet" && target === "shiplets"));

export function Shell({ view, go, sandbox, setSandbox, onSignOut, extra, children }: {
  view: View; go: (v: View) => void; sandbox: boolean; setSandbox: (b: boolean) => void; onSignOut: () => void; extra?: ReactNode; children: ReactNode;
}) {
  const { account, tier } = useScenario();
  const one = tier === "ShipTime One";
  const [menu, setMenu] = useState(false);
  const groups = NAV.filter((g) => one || !g.one);
  return (
    <div className="min-h-screen bg-white text-[#353A44]" style={{ fontFamily: T.font }}>
      {sandbox && (
        <div className="flex h-9 items-center justify-between bg-[#2E4C8F] px-4 text-[13px] font-semibold text-white">
          <span>{account.name}</span>
          <span className="hidden sm:inline">Sandbox: labels here are free and never ship.</span>
          <button type="button" onClick={() => setSandbox(false)} className="hover:underline">Exit sandbox ↗</button>
        </div>
      )}
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-[#EBEEF1] bg-white md:flex">
          <div className="flex h-[60px] items-center gap-2 px-4">
            <img src="/shiptime-logo.svg" alt="ShipTime" width={110} height={34} className="h-6 w-auto" />
          </div>
          <div className="px-3">
            <button type="button" onClick={onSignOut} title="Switch account" className="flex w-full items-center gap-2.5 rounded-md border border-[#EBEEF1] px-2.5 py-2 text-left hover:bg-[#F6F8FA]">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F5F6F8] text-[11px] font-bold text-[#1A1B25]">{account.initials}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-[#1A1B25]">{account.name}</span>
                <span className={`block text-[12px] font-semibold leading-4 ${one ? "text-[#EC5A26]" : "text-[#6A7383]"}`}>{tier}</span>
              </span>
              <ChevronsUpDown className="h-4 w-4 text-[#6A7383]" />
            </button>
          </div>
          <nav className="mt-4 flex-1 overflow-y-auto px-3">
            {groups.map((g, gi) => (
              <div key={gi} className="mb-4">
                {g.group && <div className="px-2.5 pb-1 text-[12px] font-semibold text-[#EC5A26]">{g.group}</div>}
                {g.items.map((it) => (
                  <button key={it.label} type="button" onClick={() => it.view && go(it.view)} className={`flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[14px] ${isActive(view, it.view) ? "font-semibold text-[#EC5A26]" : "text-[#353A44] hover:bg-[#F6F8FA]"} ${it.view ? "" : "cursor-default opacity-60"}`}>
                    <it.icon className="h-4 w-4" strokeWidth={1.8} />
                    {it.label}
                  </button>
                ))}
              </div>
            ))}
            {extra}
          </nav>
          <div className="border-t border-[#EBEEF1] px-3 py-3">
            <button type="button" onClick={() => go("developers")} className={`flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[14px] ${view === "developers" ? "font-semibold text-[#EC5A26]" : "text-[#353A44] hover:bg-[#F6F8FA]"}`}>
              <Code className="h-4 w-4" strokeWidth={1.8} /> Developers
            </button>
            <button type="button" className="flex h-8 w-full cursor-default items-center gap-2.5 rounded-md px-2.5 text-[14px] text-[#353A44] opacity-60">
              <Settings className="h-4 w-4" strokeWidth={1.8} /> Settings
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 bg-white/95 px-4 backdrop-blur md:px-10">
            <div className="flex h-8 w-full max-w-[320px] items-center gap-2 rounded-md bg-[#F5F6F8] px-2.5 text-[14px] text-[#6A7383]">
              <Search className="h-4 w-4" /> <span className="flex-1">Search shipments, orders, invoices</span>
              <kbd className="hidden rounded border border-[#D8DEE4] bg-white px-1 text-[11px] sm:inline" style={{ fontFamily: T.mono }}>⌘K</kbd>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <button type="button" onClick={() => setSandbox(!sandbox)} className="hidden items-center gap-2 rounded-md px-2 py-1 text-[13px] font-semibold text-[#353A44] hover:bg-[#F6F8FA] sm:inline-flex">
                <span className={`relative h-4 w-7 rounded-full transition-colors ${sandbox ? "bg-[#2E4C8F]" : "bg-[#D8DEE4]"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${sandbox ? "left-3.5" : "left-0.5"}`} /></span>
                Sandbox
              </button>
              <button type="button" aria-label="Help" className="rounded-md p-1.5 text-[#6A7383] hover:bg-[#F6F8FA]"><CircleHelp className="h-[18px] w-[18px]" /></button>
              <button type="button" aria-label="Notifications" className="relative rounded-md p-1.5 text-[#6A7383] hover:bg-[#F6F8FA]"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#EC5A26]" /></button>
              <button type="button" aria-label="Create" className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EC5A26] text-white"><Plus className="h-4 w-4" /></button>
              <div className="relative ml-1">
                <button type="button" onClick={() => setMenu(!menu)} aria-label="Account" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1B25] text-[12px] font-semibold text-white">{account.user.initials}</button>
                {menu && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-64 rounded-lg border border-[#EBEEF1] bg-white p-1 shadow-[0_5px_15px_rgba(0,0,0,.12),0_15px_35px_rgba(48,49,61,.08)]">
                    <div className="px-3 py-2">
                      <div className="text-[14px] font-semibold text-[#1A1B25]">{account.user.name}</div>
                      <div className="text-[12px] text-[#6A7383]">{account.user.role} · {account.name}</div>
                    </div>
                    <div className="mx-3 my-1 rounded-md bg-[#F6F8FA] px-3 py-2 text-[12px] text-[#6A7383]">Plan <b className="text-[#353A44]">{tier}</b></div>
                    <button type="button" onClick={onSignOut} className="block w-full rounded-md px-3 py-1.5 text-left text-[14px] text-[#353A44] hover:bg-[#F6F8FA]">Switch account</button>
                    {["Team & roles", "Plan & billing"].map((x) => <div key={x} className="rounded-md px-3 py-1.5 text-[14px] text-[#353A44] hover:bg-[#F6F8FA]">{x}</div>)}
                    <button type="button" onClick={onSignOut} className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[14px] text-[#353A44] hover:bg-[#F6F8FA]"><LogOut className="h-4 w-4" /> Log out</button>
                  </div>
                )}
              </div>
            </div>
          </header>
          <div className="flex gap-1 overflow-x-auto border-b border-[#EBEEF1] px-4 pb-2 md:hidden">
            {groups.flatMap((g) => g.items.filter((it) => it.view)).concat([{ label: "Developers", icon: Code, view: "developers" }]).map((it) => (
              <button key={it.label} type="button" onClick={() => go(it.view!)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${isActive(view, it.view) ? "bg-[#1A1B25] text-white" : "text-[#353A44]"}`}>
                {it.label}
              </button>
            ))}
          </div>
          <main className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 md:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
