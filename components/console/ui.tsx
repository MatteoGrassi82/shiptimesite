"use client";

import { useState, type ReactNode } from "react";
import {
  Bell, ChevronsUpDown, CircleHelp, Code, House, Inbox, Layers, ListChecks, LogOut, Package, Plus, Receipt, Route, Search, Settings, Target, Warehouse,
} from "lucide-react";
import { BrandLogo, brandOf, koherentSideVars } from "./brand";
import { useScenario } from "./derive";

// Shared frame for the /dashboard mockup. One app for every account, the way
// Shopify Plus sits on top of Shopify: the same pages for everyone (Home,
// Shipments, Billing, Shiplets), and ShipTime One (internally; customers see
// Koherent) switches more on: a block for warehouses, rules, go-lives and
// reports, an account team, and extras inside the shared pages. Look from
// Stripe's dashboard (neutral surfaces, thin keylines, 36px table rows, small
// bordered badges, one accent colour for actions). Colours and fonts are theme
// variables (brand.tsx): ShipTime orange, or Koherent plum.

export type View = "home" | "shipments" | "shipment" | "billing" | "invoice" | "shiplets" | "shiplet" | "requests" | "request" | "network" | "rules" | "rule" | "golive" | "report" | "developers";

// Colours: the accent marks things (charts, the map, selection borders).
// Buttons and accent text use darker shades that pass WCAG AA with white or on
// white (ShipTime: #C8461B fills, #C2410C text; Koherent: plum for both).
export const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)]/40";

export const T = {
  font: 'var(--c-font, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif)',
  mono: 'var(--c-mono, Menlo, Consolas, "SFMono-Regular", monospace)',
};

// ── Small parts ──────────────────────────────────────────────────────────────

type BadgeTone = "neutral" | "info" | "positive" | "negative" | "warning" | "urgent";
const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-[color:var(--c-badge-bg)] text-[color:var(--c-badge-fg)] border-[color:var(--c-badge-line)]",
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
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-semibold transition-colors ${FOCUS} ${small ? "h-7 px-2.5 text-[13px]" : "h-8 px-3 text-[14px]"} ${
        primary
          ? "bg-[color:var(--c-action)] text-white shadow-[0_1px_1px_rgba(0,0,0,.12),0_2px_5px_rgba(48,49,61,.08)] hover:bg-[color:var(--c-action-hover)]"
          : "border border-[color:var(--c-border)] bg-white text-[color:var(--c-text)] shadow-[0_1px_1px_rgba(0,0,0,.06)] hover:bg-[color:var(--c-hover)]"
      }`}
    >
      {children}
    </button>
  );
}

export function Chip({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return value ? (
    <button type="button" onClick={onClick} className="inline-flex h-6 items-center gap-1 rounded-full border border-[color:var(--c-border)] bg-white px-2 text-[12px] font-semibold text-[color:var(--c-text)]">
      <span className="text-[color:var(--c-muted)]">⊗</span> {label} <span className="text-[color:var(--c-border)]">|</span> <span className="text-[color:var(--c-action-text)]">{value}</span>
    </button>
  ) : (
    <button type="button" onClick={onClick} className="inline-flex h-6 items-center gap-1 rounded-full border border-dashed border-[color:var(--c-border2)] px-2 text-[12px] font-semibold text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)]">
      <Plus className="h-3 w-3" /> {label}
    </button>
  );
}

// One header for every page: an optional back link, the title with its status
// next to it, a short subtitle, and the actions top-right.
export function PageHeader({ title, subtitle, actions, back, status }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; back?: { label: string; onClick: () => void }; status?: ReactNode }) {
  return (
    <div className="pb-5">
      {back && <button type="button" onClick={back.onClick} className={`mb-2 text-[13px] font-semibold text-[color:var(--c-link)] hover:underline ${FOCUS}`}>← {back.label}</button>}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-[720px]">
          <h1 className="flex flex-wrap items-center gap-3 text-[28px] font-bold leading-9 text-[color:var(--c-ink)]">{title}{status}</h1>
          {subtitle && <div className="mt-1 text-[14px] text-[color:var(--c-muted)]">{subtitle}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 pt-1">{actions}</div>}
      </div>
    </div>
  );
}

// Tabs that switch a list (neutral text, orange underline).
export function Tabs<T extends string>({ items, value, onChange }: { items: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-6 border-b border-[color:var(--c-line)] text-[14px] font-semibold">
      {items.map((t) => (
        <button key={t.id} type="button" onClick={() => onChange(t.id)} className={`-mb-px border-b-2 pb-2 ${FOCUS} ${value === t.id ? "border-[color:var(--c-accent)] text-[color:var(--c-ink)]" : "border-transparent text-[color:var(--c-muted)] hover:text-[color:var(--c-text)]"}`}>
          {t.label}{t.count !== undefined && <span className="ml-1.5 font-normal text-[color:var(--c-muted)]">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

// A segmented control for switching a view (a grey track, a raised white segment).
export function Segmented<T extends string>({ options, value, onChange }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex flex-wrap rounded-md bg-[color:var(--c-track)] p-0.5 text-[13px] font-semibold">
      {options.map((o) => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)} className={`rounded px-3 py-1 ${FOCUS} ${value === o.id ? "bg-white text-[color:var(--c-ink)] shadow-[0_1px_2px_rgba(0,0,0,.12)]" : "text-[color:var(--c-muted)] hover:text-[color:var(--c-text)]"}`}>{o.label}</button>
      ))}
    </div>
  );
}

// One way to show a number: label, value, and an optional line under it.
export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "good" | "warn" }) {
  return (
    <div className="bg-white px-4 py-3">
      <div className="text-[13px] text-[color:var(--c-muted)]">{label}</div>
      <div className={`k-num mt-0.5 text-[20px] font-semibold tabular-nums leading-7 ${tone === "good" ? "text-[#217005]" : tone === "warn" ? "text-[#B13600]" : "text-[color:var(--c-ink)]"}`}>{value}</div>
      {sub && <div className="text-[12px] text-[color:var(--c-muted)]">{sub}</div>}
    </div>
  );
}
export function StatRow({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 | 5 }) {
  const c = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5" }[cols];
  return <div className={`grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[color:var(--c-line)] bg-[color:var(--c-line)] ${c} [&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:col-span-1`}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[color:var(--c-line)] pb-2">
      <h2 className="text-[20px] font-semibold leading-7 text-[color:var(--c-ink)]">{children}</h2>
      {action}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-[color:var(--c-line)] bg-white ${className}`}>{children}</div>;
}

export function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return <th className={`h-9 border-b border-[color:var(--c-border)] px-2 text-[13px] font-semibold text-[color:var(--c-text)] ${right ? "text-right" : "text-left"}`}>{children}</th>;
}
export function Td({ children, right, muted, mono }: { children: ReactNode; right?: boolean; muted?: boolean; mono?: boolean }) {
  return (
    <td className={`h-9 border-b border-[color:var(--c-line)] px-2 text-[14px] ${right ? "text-right tabular-nums" : ""} ${muted ? "text-[color:var(--c-muted)]" : "text-[color:var(--c-text)]"}`} style={mono ? { fontFamily: T.mono, fontSize: 13 } : undefined}>
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
    { label: "Requests", icon: Inbox, view: "requests" },
    { label: "Shiplets", icon: Layers, view: "shiplets" },
    { label: "Billing", icon: Receipt, view: "billing" },
  ] },
  { group: "Your network", one: true, items: [
    { label: "Warehouses", icon: Warehouse, view: "network" },
    { label: "Rules", icon: Route, view: "rules" },
    { label: "Go-live", icon: ListChecks, view: "golive" },
    { label: "Results", icon: Target, view: "report" },
  ] },
];

const isActive = (view: View, target?: View) =>
  !!target && (view === target || (view === "shipment" && target === "shipments") || (view === "invoice" && target === "billing") || (view === "rule" && target === "rules") || (view === "shiplet" && target === "shiplets") || (view === "request" && target === "requests"));

export function Shell({ view, go, sandbox, setSandbox, onSignOut, extra, banner, children }: {
  view: View; go: (v: View) => void; sandbox: boolean; setSandbox: (b: boolean) => void; onSignOut: () => void; extra?: ReactNode; banner?: ReactNode; children: ReactNode;
}) {
  const { account, tier } = useScenario();
  const one = tier === "Koherent";
  const brand = brandOf(tier);
  const [menu, setMenu] = useState(false);
  const groups = NAV.filter((g) => one || !g.one);
  // On phones the menu is one scrolling row: Home first, then the network
  // pages, so they're on screen instead of off to the right.
  const core = groups[0].items;
  const mobileNav: NavItem[] = [core[0], ...groups.slice(1).flatMap((g) => g.items), ...core.slice(1), { label: "Developers", icon: Code, view: "developers" }];
  return (
    <div className="min-h-screen bg-white text-[color:var(--c-text)]" style={{ fontFamily: T.font }}>
      {banner}
      {sandbox && (
        <div className="flex h-9 items-center justify-between bg-[color:var(--c-link)] px-4 text-[13px] font-semibold text-white">
          <span>{account.name}</span>
          <span className="hidden sm:inline">Sandbox: labels here are free and never ship.</span>
          <button type="button" onClick={() => setSandbox(false)} className="hover:underline">Exit sandbox ↗</button>
        </div>
      )}
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-[color:var(--c-line)] bg-[color:var(--c-side)] md:flex" style={brand === "koherent" ? koherentSideVars : undefined}>
          <div className="flex h-[60px] items-center gap-2 px-4">
            <BrandLogo brand={brand} />
          </div>
          <div className="px-3">
            <button type="button" onClick={onSignOut} title="Switch account" className="flex w-full items-center gap-2.5 rounded-md border border-[color:var(--c-line)] px-2.5 py-2 text-left hover:bg-[color:var(--c-hover)]">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[color:var(--c-subtle)] text-[11px] font-bold text-[color:var(--c-ink)]">{account.initials}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-[color:var(--c-ink)]">{account.name}</span>
                <span className="flex items-center gap-1.5 text-[12px] leading-4 text-[color:var(--c-muted)]">{one ? "Koherent account" : "ShipTime"}</span>
              </span>
              <ChevronsUpDown className="h-4 w-4 text-[color:var(--c-muted)]" />
            </button>
          </div>
          <nav className="mt-4 flex-1 overflow-y-auto px-3">
            {groups.map((g, gi) => (
              <div key={gi} className="mb-4">
                {g.group && <div className="px-2.5 pb-1 text-[12px] font-medium text-[color:var(--c-muted)]">{g.group}</div>}
                {g.items.map((it) => (
                  <button key={it.label} type="button" onClick={() => it.view && go(it.view)} className={`flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[14px] ${FOCUS} ${isActive(view, it.view) ? "bg-[color:var(--c-accent-soft)] font-semibold text-[color:var(--c-action-text)]" : "text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)]"}`}>
                    <it.icon className="h-4 w-4" strokeWidth={1.8} />
                    {it.label}
                  </button>
                ))}
              </div>
            ))}
            {extra}
          </nav>
          <div className="border-t border-[color:var(--c-line)] px-3 py-3">
            <button type="button" onClick={() => go("developers")} className={`flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[14px] ${FOCUS} ${view === "developers" ? "bg-[color:var(--c-accent-soft)] font-semibold text-[color:var(--c-action-text)]" : "text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)]"}`}>
              <Code className="h-4 w-4" strokeWidth={1.8} /> Developers
            </button>
            <button type="button" className={`flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[14px] text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}>
              <Settings className="h-4 w-4" strokeWidth={1.8} /> Settings
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 bg-white/95 px-4 backdrop-blur md:px-10">
            <span className="shrink-0 md:hidden"><BrandLogo brand={brand} small /></span>
            <div className="flex h-8 min-w-0 w-full max-w-[320px] items-center gap-2 rounded-md bg-[color:var(--c-subtle)] px-2.5 text-[14px] text-[color:var(--c-muted)]">
              <Search className="h-4 w-4 shrink-0" /> <span className="flex-1 truncate">Search shipments, orders, invoices</span>
              <kbd className="hidden rounded border border-[color:var(--c-border)] bg-white px-1 text-[11px] sm:inline" style={{ fontFamily: T.mono }}>⌘K</kbd>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <button type="button" onClick={() => setSandbox(!sandbox)} className="hidden items-center gap-2 rounded-md px-2 py-1 text-[13px] font-semibold text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)] sm:inline-flex">
                <span className={`relative h-4 w-7 rounded-full transition-colors ${sandbox ? "bg-[color:var(--c-link)]" : "bg-[color:var(--c-border)]"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${sandbox ? "left-3.5" : "left-0.5"}`} /></span>
                Sandbox
              </button>
              <button type="button" aria-label="Help" className="rounded-md p-1.5 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)]"><CircleHelp className="h-[18px] w-[18px]" /></button>
              <button type="button" aria-label="Notifications" className="relative rounded-md p-1.5 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)]"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[color:var(--c-accent)]" /></button>
              <button type="button" aria-label="Create" className={`ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--c-border)] text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}><Plus className="h-4 w-4" /></button>
              <div className="relative ml-1">
                <button type="button" onClick={() => setMenu(!menu)} aria-label="Account" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--c-ink)] text-[12px] font-semibold text-white">{account.user.initials}</button>
                {menu && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-64 rounded-lg border border-[color:var(--c-line)] bg-white p-1 shadow-[0_5px_15px_rgba(0,0,0,.12),0_15px_35px_rgba(48,49,61,.08)]">
                    <div className="px-3 py-2">
                      <div className="text-[14px] font-semibold text-[color:var(--c-ink)]">{account.user.name}</div>
                      <div className="text-[12px] text-[color:var(--c-muted)]">{account.user.role} · {account.name}</div>
                    </div>
                    <div className="mx-3 my-1 rounded-md bg-[color:var(--c-hover)] px-3 py-2 text-[12px] text-[color:var(--c-muted)]">{one ? <>Koherent account <span className="block">Runs on the ShipTime platform</span></> : <>Plan <b className="text-[color:var(--c-text)]">ShipTime</b></>}</div>
                    <button type="button" onClick={onSignOut} className="block w-full rounded-md px-3 py-1.5 text-left text-[14px] text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)]">Switch account</button>
                    {["Team & roles", "Plan & billing"].map((x) => <div key={x} className="rounded-md px-3 py-1.5 text-[14px] text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)]">{x}</div>)}
                    <button type="button" onClick={onSignOut} className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[14px] text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)]"><LogOut className="h-4 w-4" /> Log out</button>
                  </div>
                )}
              </div>
            </div>
          </header>
          <div className="flex gap-1 overflow-x-auto border-b border-[color:var(--c-line)] px-4 pb-2 md:hidden">
            {mobileNav.map((it) => (
              <button key={it.label} type="button" onClick={() => go(it.view!)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${isActive(view, it.view) ? "bg-[color:var(--c-ink)] text-white" : "text-[color:var(--c-text)]"}`}>
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
