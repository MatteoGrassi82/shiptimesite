"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight, ArrowUpRight, Boxes, Calculator, CalendarCheck, Check, ChevronDown, ChevronRight, CircleCheck, Clock, Copy, FileCheck2, FileText, Globe, KeyRound, Lock, MapPin, MessageSquare, Minus, Pencil, PenLine, Printer, QrCode, Receipt, RotateCcw, Route, Share2, Smile, Store, Tag, Undo2, Users, Warehouse, X, type LucideIcon,
} from "lucide-react";
import { appColor, appUrl, changedIn, itemsOf, openQuestions, same, STAGES, startApp, TEMPLATES, templateOf, valueOf, waitingOn, type Setting, type ShipletApp, type Template, type TemplateId, type Use, type Value } from "./apps";
import { AppBar, AppScreen, Browser } from "./AppScreens";
import { Chevrons } from "./brand";
import { useScenario } from "./derive";
import { useToast } from "./Feedback";
import { Actor, Avatar, TEAM } from "./People";
import { useAsk } from "./Requests";
import { scenarios, type BrandId, type Scenario } from "./scenarios";
import { Badge, Button, FOCUS, PageHeader, Panel, SectionTitle, Segmented, Stat, StatRow, T } from "./ui";

// ── Shiplets ─────────────────────────────────────────────────────────────────
// Templates first (Oct 27 call): the section opens on the templates, each one
// opens on what it does (a tour of its screens in the account's own colours,
// who uses it, what it always does) and the settings that make it theirs.
// Using one sends it to the account manager, and the account's one app then
// moves through Eugene's seven steps on its own page.
//
// Design review, Oct 28 (visual, interaction, psychology, content, and a
// customer walkthrough): say each thing once, and stay inside the shell.
// - One voice per page: the badge says whose turn it is, the stepper says
//   where it is, one "now" card says the one next thing and holds the page's
//   only primary button; there is no primary when it isn't the client's turn.
//   Everything else is reference, under one heading each, said once.
// - One "what it does" list, in the mode the step needs: edit on the
//   template, read on the app page, Works / Not what I meant in the sandbox,
//   signed at the end. The same sentences travel the whole way.
// - Surfaces follow the rest of the dashboard: white, 8px, a 1px keyline.
//   Shadows only on what floats (menus, drawers); tint only as a strip inside
//   a panel or a selected state; the browser window is the one 12px object.
// - Type: 28 title, 20 section, 16 card title, 14 body, 13 meta, 12 small.
//   Sections space-y-8, panels p-5, rows py-3.
// - The customer's time is priced on every turn, and the whole journey once.

const TODAY = "Today, 10:42 am";
const MATTEO = TEAM[0];
const M = "Matteo";
const REPLY = "He'll reply today.";

const ICON: Record<TemplateId, LucideIcon> = { returns: Undo2, customs: FileCheck2, counter: Store, quote: Calculator, today: CalendarCheck, splitter: Boxes, dental: Smile, print: Printer };
const USES: Record<Use, { icon: LucideIcon; label: string; text: string }> = {
  rates: { icon: Receipt, label: "Your rates", text: "Every label at your prices." },
  rules: { icon: Route, label: "Your rules", text: "The same carrier and warehouse choices as the rest of your shipping." },
  tracking: { icon: MapPin, label: "Tracking", text: "Each parcel followed to the door." },
  labels: { icon: Tag, label: "Labels and printers", text: "Prints where your team works." },
  warehouses: { icon: Warehouse, label: "Your warehouses", text: "Ships from the right one." },
  customs: { icon: FileText, label: "Customs paperwork", text: "Codes and invoices from your products." },
};

const fmt = (s: Setting, v: Value) => (s.kind === "money" ? `${s.prefix}${(v as number).toLocaleString("en-US")}` : s.kind === "number" ? (s.unit === "%" ? `${v}%` : `${v} ${s.unit}`) : Array.isArray(v) ? v.join(", ") : String(v));
const brandIdOf = (sc: Scenario) => (Object.keys(scenarios) as BrandId[]).find((b) => scenarios[b] === sc) ?? "reach";
const initialsOf = (name: string) => name.split(" ").map((x) => x[0]).join("");
// Where the app is in the steps; a live app is past the last one.
const stepOf = (app: ShipletApp) => (app.stage === "live" ? STAGES.length : STAGES.findIndex((x) => x.id === app.stage));
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// ── Small shared parts ──

function TemplateIcon({ t, size = 36 }: { t: TemplateId; size?: number }) {
  const I = ICON[t];
  return <span className="inline-flex shrink-0 items-center justify-center rounded-md bg-[color:var(--c-accent-soft)] text-[color:var(--c-action-text)]" style={{ width: size, height: size }}><I style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={1.8} /></span>;
}

const Label = ({ children }: { children: ReactNode }) => <div className="text-[13px] font-semibold text-[color:var(--c-ink)]">{children}</div>;
const Muted = ({ children, className = "" }: { children: ReactNode; className?: string }) => <p className={`text-[13px] leading-5 text-[color:var(--c-muted)] ${className}`}>{children}</p>;
const link = `font-semibold text-[color:var(--c-link)] hover:underline ${FOCUS}`;

// One drawer: 480 wide, Esc closes, focus goes in and comes back.
function Drawer({ title, sub, onClose, children, footer }: { title: string; sub?: string; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const was = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelector<HTMLElement>("textarea, input, select, button:not([aria-label='Close'])");
    first?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); was?.focus?.(); };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-[#0B1F3A]/30" onClick={onClose} style={{ fontFamily: T.font }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label={title} className="flex h-full w-full max-w-[480px] flex-col bg-white shadow-[0_15px_35px_rgba(0,0,0,.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-[color:var(--c-line)] px-6 py-5">
          <div><div className="text-[18px] font-semibold text-[color:var(--c-ink)]">{title}</div>{sub && <div className="mt-0.5 text-[13px] text-[color:var(--c-muted)]">{sub}</div>}</div>
          <button type="button" onClick={onClose} aria-label="Close" className={`rounded p-1 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 text-[14px] leading-6 text-[color:var(--c-text)]">{children}</div>
        <div className="flex justify-end gap-2 border-t border-[color:var(--c-line)] px-6 py-3.5">{footer}</div>
      </div>
    </div>
  );
}

// Every message to the account manager goes through one drawer.
type MessageKind = "change" | "note" | "changes";
const MESSAGE: Record<MessageKind, { title: string; sub: (app: string) => string; cta: string }> = {
  change: { title: "Ask for a change", sub: (app) => `To ${app}. Your live app keeps running while we work on it.`, cta: `Send to ${M}` },
  note: { title: "Add a note", sub: (app) => `To ${app}, before the prototype.`, cta: `Send to ${M}` },
  changes: { title: "Ask for changes", sub: () => "To the prototype. Version 2 usually follows within the hour.", cta: `Send to ${M}` },
};
function MessageDrawer({ kind, app, start = "", onClose, onSend }: { kind: MessageKind; app: string; start?: string; onClose: () => void; onSend: (text: string) => void }) {
  const [text, setText] = useState(start);
  const m = MESSAGE[kind];
  return (
    <Drawer title={m.title} sub={m.sub(app)} onClose={onClose} footer={<><Button small onClick={onClose}>Cancel</Button><Button small primary disabled={!text.trim()} onClick={() => onSend(text.trim())}>{m.cta}</Button></>}>
      <label htmlFor="message" className="text-[13px] font-semibold text-[color:var(--c-ink)]">In your words</label>
      <textarea id="message" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write it the way you'd explain it to a colleague." className="mt-1.5 h-36 w-full rounded-md border border-[color:var(--c-border)] p-3 text-[14px] outline-none focus:border-[color:var(--c-accent)]" />
      <Muted className="mt-2">Helpful to say: who uses it, what they do today, and anything that must never happen.</Muted>
      <div className="mt-5 flex items-center gap-3 rounded-md bg-[color:var(--c-subtle)] p-3 text-[13px]"><Avatar p={MATTEO} size={32} /><span>{M} reads it back to you as a list before anything changes.</span></div>
    </Drawer>
  );
}

// What happens after you send it, in the steps' own names.
function NextSteps({ url }: { url: string }) {
  const rows: [string, string, string][] = [
    [STAGES[1].label, "today", `${M} checks it fits how you ship and may ask a question or two.`],
    [STAGES[3].label, "within a day", "Clickable, with what we understood written beside it."],
    [STAGES[5].label, "about a week", "Built and checked, with sample data."],
    [STAGES[6].label, "", `At ${url}, on your real account.`],
  ];
  return (
    <ol className="relative ml-1.5 space-y-4 border-l-2 border-[color:var(--c-line)] pl-5">
      {rows.map(([step, when, what]) => (
        <li key={step} className="relative">
          <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[color:var(--c-action)]" />
          <div className="text-[14px] font-semibold text-[color:var(--c-ink)]">{step}{when && <span className="font-normal text-[color:var(--c-muted)]"> · {when}</span>}</div>
          <div className="text-[13px] text-[color:var(--c-text)]">{what}</div>
        </li>
      ))}
    </ol>
  );
}

// ── The tour: how it works, step by step, beside the real screens ──

function useScreens(t: Template, values: Record<string, Value>, account: { name: string; initials: string }, start = 0, startRole?: string) {
  const [step, setStep] = useState(start);
  const [role, setRole] = useState(startRole ?? t.signIn[0]);
  const v = (id: string) => valueOf(t, values, id);
  const screen = <AppScreen t={t.id} step={step} role={role} v={v} account={account.name} prefix={account.initials} next={() => setStep((step + 1) % t.flow.length)} />;
  return { step, setStep, role, setRole, screen };
}

// `row`: the steps as pills above the window (beside a checklist). Otherwise
// the steps are rows on the left, with what each one does.
function Tour({ t, values, url, color, stripe, row }: { t: Template; values: Record<string, Value>; url: string; color: string; stripe?: string; row?: boolean }) {
  const { account } = useScenario();
  const { step, setStep, role, setRole, screen } = useScreens(t, values, account);
  const [full, setFull] = useState(false);
  const signedIn = <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-[#6B7280]"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F3F4F6] text-[9px] font-semibold text-[#4B5563]">{role[0]}</span><span className="hidden sm:inline">{role}</span></span>;
  const browser = <Browser url={url} color={color} stripe={stripe} footer="Powered by Koherent" onExpand={() => setFull(true)} bar={<AppBar name={account.name} tabs={t.tabs} step={step} onStep={setStep} role={signedIn} />}>{screen}</Browser>;
  const roles = <span className="flex flex-wrap items-center gap-2 text-[13px] text-[color:var(--c-muted)]">Viewing as <Segmented options={t.signIn.map((r) => ({ id: r, label: r }))} value={role} onChange={setRole} /></span>;
  return (
    <>
      {row ? (
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <ol className="flex flex-wrap gap-1">
              {t.flow.map((f, i) => (
                <li key={f.title}><button type="button" aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)} className={`flex items-center gap-2 rounded-md py-1 pl-1.5 pr-3 text-[13px] transition-colors ${FOCUS} ${i === step ? "bg-[color:var(--c-accent-soft)] font-semibold text-[color:var(--c-action-text)]" : "text-[color:var(--c-muted)] hover:text-[color:var(--c-ink)]"}`}>
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${i === step ? "bg-[color:var(--c-action)] text-white" : "bg-[color:var(--c-track)]"}`}>{i + 1}</span>{f.title}
                </button></li>
              ))}
            </ol>
            {roles}
          </div>
          {browser}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-6">
          <div>
            <ol className="space-y-1">
              {t.flow.map((f, i) => (
                <li key={f.title}>
                  <button type="button" aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)} className={`flex w-full gap-3 rounded-md p-3 text-left transition-colors ${FOCUS} ${i === step ? "bg-[color:var(--c-accent-soft)]" : "hover:bg-[color:var(--c-hover)]"}`}>
                    <span className={`mt-px inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${i === step ? "bg-[color:var(--c-action)] text-white" : "bg-[color:var(--c-track)] text-[color:var(--c-muted)]"}`}>{i + 1}</span>
                    <span className="min-w-0"><span className={`block text-[14px] font-semibold ${i === step ? "text-[color:var(--c-ink)]" : "text-[color:var(--c-text)]"}`}>{f.title}</span><span className="mt-0.5 block text-[13px] leading-5 text-[color:var(--c-muted)]">{f.text}</span></span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-4 px-1">{roles}</div>
            <Muted className="mt-3 px-1">The buttons in the app work too. Sample data; nothing is saved.</Muted>
          </div>
          {browser}
        </div>
      )}
      {full && <FullScreen t={t} values={values} url={url} color={color} stripe={stripe} start={step} startRole={role} onClose={() => setFull(false)} />}
    </>
  );
}

// The app on its own, filling the screen: the sidebar and the page step away.
function FullScreen({ t, values, url, color, stripe, start, startRole, onClose }: { t: Template; values: Record<string, Value>; url: string; color: string; stripe?: string; start: number; startRole: string; onClose: () => void }) {
  const { account } = useScenario();
  const { step, setStep, role, setRole, screen } = useScreens(t, values, account, start, startRole);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#F9FAFB]" style={{ "--app": color } as CSSProperties}>
      <div className="flex h-10 shrink-0 items-center gap-3 bg-[#111827] px-4 text-[12px] text-white/80" style={{ fontFamily: T.font }}>
        <Lock className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{url}</span>
        <span className="ml-auto hidden sm:inline">Viewing as</span>
        <select aria-label="Viewing as" value={role} onChange={(e) => setRole(e.target.value)} className="rounded bg-white/10 px-2 py-0.5 text-[12px] text-white outline-none">{t.signIn.map((r) => <option key={r} className="text-black">{r}</option>)}</select>
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1 rounded px-2 py-1 font-semibold text-white hover:bg-white/10"><X className="h-4 w-4" /> Close <kbd className="ml-1 hidden rounded border border-white/30 px-1 text-[10px] sm:inline">Esc</kbd></button>
      </div>
      {stripe && <div className="bg-[#FEF3C7] py-1.5 text-center text-[12px] text-[#92400E]">{stripe}</div>}
      <AppBar big name={account.name} tabs={t.tabs} step={step} onStep={setStep} />
      <div className="flex-1 overflow-y-auto px-4 py-10"><div className="mx-auto max-w-[560px] md:[zoom:1.2]">{screen}</div></div>
    </div>
  );
}

// ── What it does: one list, four modes ──

function Control({ s, value, onChange }: { s: Setting; value: Value; onChange: (v: Value) => void }) {
  if (s.kind === "money" || s.kind === "number") return (
    <span className="inline-flex h-8 items-center gap-1 rounded-md border border-[color:var(--c-border)] bg-white px-2.5 text-[14px] focus-within:border-[color:var(--c-accent)]">
      {s.prefix && <span className="text-[color:var(--c-muted)]">{s.prefix}</span>}
      <input aria-label={s.label} inputMode="numeric" value={(value as number).toLocaleString("en-US")} onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)} className="w-[64px] bg-transparent text-right font-medium text-[color:var(--c-ink)] outline-none" />
      {s.unit && <span className="text-[color:var(--c-muted)]">{s.unit}</span>}
    </span>
  );
  if (s.kind === "multi") {
    const on = value as string[];
    return (
      <span className="flex flex-wrap gap-1.5">
        {s.options!.map((o) => {
          const active = on.includes(o);
          return <button key={o} type="button" aria-pressed={active} onClick={() => onChange(active ? (on.length > 1 ? on.filter((x) => x !== o) : on) : s.options!.filter((x) => on.includes(x) || x === o))} className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[13px] font-medium transition-colors ${FOCUS} ${active ? "border-[color:var(--c-action)] bg-[color:var(--c-accent-soft)] text-[color:var(--c-action-text)]" : "border-[color:var(--c-border)] bg-white text-[color:var(--c-text)] hover:bg-[color:var(--c-hover)]"}`}>{active && <Check className="h-3.5 w-3.5" />}{o}</button>;
        })}
      </span>
    );
  }
  if (s.options!.join("").length > 40) return (
    <span className="relative inline-flex">
      <select aria-label={s.label} value={value as string} onChange={(e) => onChange(e.target.value)} className={`h-8 appearance-none rounded-md border border-[color:var(--c-border)] bg-white pl-2.5 pr-8 text-[14px] font-medium text-[color:var(--c-ink)] outline-none focus:border-[color:var(--c-accent)] ${FOCUS}`}>{s.options!.map((o) => <option key={o}>{o}</option>)}</select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--c-muted)]" />
    </span>
  );
  return <Segmented options={s.options!.map((o) => ({ id: o, label: o }))} value={value as string} onChange={onChange} />;
}

// Edit mode (the template page): each setting with its control.
function SettingsEdit({ t, values, onChange }: { t: Template; values: Record<string, Value>; onChange: (id: string, v: Value) => void }) {
  return (
    <ul className="divide-y divide-[color:var(--c-line)]">
      {t.settings.map((s) => {
        const value = valueOf(t, values, s.id);
        const changed = !same(value, s.start);
        return (
          <li key={s.id} className="grid gap-x-6 gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_300px] sm:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-[color:var(--c-ink)]">{s.label}{changed && <Badge>Changed</Badge>}</div>
              <div className="mt-0.5 text-[13px] text-[color:var(--c-muted)]">{s.say(value)}{changed && <> <button type="button" onClick={() => onChange(s.id, s.start)} className={link}>Back to {fmt(s, s.start)}</button></>}</div>
            </div>
            <span className="min-w-0"><Control s={s} value={value} onChange={(v) => onChange(s.id, v)} /></span>
          </li>
        );
      })}
    </ul>
  );
}

// Read mode (the app page): what the template always does, then each setting
// as it's set, with a Change link when a change can be asked for.
function WhatItDoes({ t, settings, onAsk }: { t: Template; settings: Record<string, Value>; onAsk?: (s: Setting) => void }) {
  const row = "flex items-start gap-3 py-2.5";
  return (
    <ul className="divide-y divide-[color:var(--c-line)]">
      {t.always.map((a) => <li key={a} className={row}><Check className="mt-1 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /><span className="text-[14px] leading-5 text-[color:var(--c-text)]">{a}</span></li>)}
      {t.settings.map((s) => {
        const value = valueOf(t, settings, s.id);
        const changed = !same(value, s.start);
        return (
          <li key={s.id} className={row}>
            <Check className="mt-1 h-4 w-4 shrink-0 text-[color:var(--c-action-text)]" />
            <span className="min-w-0 flex-1 text-[14px] leading-5 text-[color:var(--c-text)]">{s.say(value)}{changed && <> <Badge>Changed</Badge></>}</span>
            {onAsk && <button type="button" onClick={() => onAsk(s)} className={`shrink-0 text-[13px] ${link}`}>Change</button>}
          </li>
        );
      })}
    </ul>
  );
}

// Who uses it and what it runs on; the always-does list only where the
// settings sit beside it (the template page).
function Facts({ t, always }: { t: Template; always?: boolean }) {
  return (
    <div className="space-y-6">
      <section>
        <Label>Who uses it</Label>
        <ul className="mt-3 space-y-2.5">
          {t.roles.map((r) => (
            <li key={r.name} className="flex items-start gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--c-subtle)] text-[12px] font-semibold text-[color:var(--c-ink)]">{r.name[0]}</span>
              <span className="min-w-0"><span className="block text-[14px] font-medium leading-5 text-[color:var(--c-ink)]">{r.name}</span><span className="block text-[13px] text-[color:var(--c-muted)]">{r.does}</span></span>
            </li>
          ))}
        </ul>
      </section>
      {always && (
        <section>
          <Label>Always does</Label>
          <ul className="mt-3 space-y-2">{t.always.map((a) => <li key={a} className="flex gap-2.5 text-[14px] leading-5 text-[color:var(--c-text)]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" />{a}</li>)}</ul>
        </section>
      )}
      <section>
        <Label>Runs on your account</Label>
        <ul className="mt-3 space-y-2">
          {t.uses.map((u) => { const x = USES[u]; return <li key={u} className="flex items-start gap-2.5 text-[13px] leading-5 text-[color:var(--c-text)]"><x.icon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-action-text)]" strokeWidth={1.8} /><span><b className="font-medium text-[color:var(--c-ink)]">{x.label}.</b> {x.text}</span></li>; })}
          <li className="flex items-start gap-2.5 text-[13px] leading-5 text-[color:var(--c-text)]"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-action-text)]" strokeWidth={1.8} /><span><b className="font-medium text-[color:var(--c-ink)]">Only your data.</b> Sees what your account already has, nothing else.</span></li>
        </ul>
      </section>
    </div>
  );
}

// The one face on the page.
function ContactCard({ about, onAsk }: { about: string; onAsk: () => void }) {
  const toast = useToast();
  return (
    <Panel className="p-5">
      <div className="flex items-center gap-3">
        <Avatar p={MATTEO} size={40} dot />
        <div className="min-w-0"><div className="text-[14px] font-semibold text-[color:var(--c-ink)]">{MATTEO.name}</div><div className="text-[13px] text-[color:var(--c-muted)]">Your account manager</div></div>
      </div>
      <p className="mt-3 text-[13px] leading-5 text-[color:var(--c-text)]">{about}</p>
      <div className="mt-1 text-[12px] text-[color:var(--c-muted)]">{MATTEO.detail}</div>
      <div className="mt-4 flex flex-wrap items-center gap-3"><Button small onClick={onAsk}><MessageSquare className="h-3.5 w-3.5" /> Ask {M}</Button><button type="button" onClick={() => toast({ text: `Call booked with ${M}: tomorrow, 11:00 am, 20 minutes.` })} className={`text-[13px] ${link}`}>Book a call</button></div>
    </Panel>
  );
}

const turnBadge = (app: ShipletApp) => {
  const w = waitingOn(app);
  if (app.stage === "live" && !app.change) return <Badge tone="positive">Live</Badge>;
  if (app.signed && app.stage === "signoff") return <Badge tone="positive">Signed</Badge>;
  if (w === "you") return <Badge tone="warning">Needs you</Badge>;
  return <Badge tone="info">With {w === "Matteo" ? M : "our apps team"}</Badge>;
};

// ── 1. The templates ──

// Where each template's first screen is cut for its gallery card: the window
// is drawn at 0.5 and moved so the part that tells the story shows.
const CROP: Record<TemplateId, { x: number; y: number }> = { returns: { x: -4, y: -36 }, customs: { x: -4, y: -36 }, counter: { x: -4, y: -32 }, quote: { x: -4, y: -32 }, today: { x: -4, y: -36 }, splitter: { x: -4, y: -34 }, dental: { x: -4, y: -32 }, print: { x: -4, y: -34 } };

function TemplateCard({ t, account, color, badge, onOpen }: { t: Template; account: { name: string; initials: string }; color: string; badge?: ReactNode; onOpen: () => void }) {
  const v = (id: string) => valueOf(t, {}, id);
  const crop = CROP[t.id];
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-[color:var(--c-line)] bg-white transition-colors hover:border-[color:var(--c-border2)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[color:var(--c-accent)]/40">
      {/* One button over the whole card; the screens inside are only a picture. */}
      <button type="button" onClick={onOpen} aria-label={`Open ${t.name}`} className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none" />
      <div className="relative h-[160px] overflow-hidden border-b border-[color:var(--c-line)] bg-[color:var(--c-subtle)]">
        <div className="pointer-events-none absolute w-[690px] origin-top-left scale-[0.5]" style={{ left: crop.x, top: crop.y }} aria-hidden inert>
          <Browser compact url={appUrl(account.name, t.id)} color={color} height={340} bar={<AppBar name={account.name} tabs={t.tabs} step={0} />}>
            <AppScreen t={t.id} step={0} role={t.signIn[0]} v={v} account={account.name} prefix={account.initials} />
          </Browser>
        </div>
        {badge && <span className="absolute left-3 top-3">{badge}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2.5"><TemplateIcon t={t.id} size={28} /><span className="text-[14px] font-semibold text-[color:var(--c-ink)]">{t.name}</span></div>
        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[color:var(--c-muted)]">{t.tagline}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-[12px] text-[color:var(--c-muted)]"><span>{t.industry ?? t.for}</span><span className="inline-flex items-center gap-1 font-semibold text-[color:var(--c-action-text)]">Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span></div>
      </div>
    </div>
  );
}

export function ShipletsHome({ app, openTemplate, openApp }: { app: ShipletApp | null; openTemplate: (id: TemplateId) => void; openApp: () => void }) {
  const sc = useScenario();
  const ask = useAsk();
  const color = appColor[brandIdOf(sc)];
  const at = app ? stepOf(app) : 0;
  const card = (t: Template) => <TemplateCard key={t.id} t={t} account={sc.account} color={color} badge={app?.template === t.id ? <Badge tone="positive">Your app</Badge> : undefined} onOpen={() => openTemplate(t.id)} />;
  const dashed = `flex w-full flex-col justify-between rounded-lg border border-dashed border-[color:var(--c-border2)] p-4 text-left transition-colors hover:bg-[color:var(--c-hover)] ${FOCUS}`;
  return (
    <div className="space-y-8">
      <PageHeader title="Shiplets" subtitle="Small apps built for how your team ships, on your account. Pick a template, make it yours, and we build it with you." />

      {app && (
        <button type="button" onClick={openApp} className={`-mt-3 flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-[color:var(--c-line)] bg-white px-4 py-3 text-left transition-colors hover:border-[color:var(--c-border2)] ${FOCUS}`}>
          <TemplateIcon t={app.template} size={32} />
          <span className="min-w-0 flex-1"><span className="block text-[12px] text-[color:var(--c-muted)]">Your app</span><span className="block text-[14px] font-semibold text-[color:var(--c-ink)]">{app.name}</span></span>
          <span className="hidden items-center gap-2 text-[13px] text-[color:var(--c-text)] md:inline-flex"><Chevrons total={STAGES.length} done={Math.min(at + 1, STAGES.length)} size={11} />{app.stage === "live" ? "Live" : STAGES[at].label}</span>
          {turnBadge(app)}
          <ChevronRight className="h-4 w-4 text-[color:var(--c-muted)]" />
        </button>
      )}

      <Panel className="overflow-hidden">
        <div className="grid gap-px bg-[color:var(--c-line)] sm:grid-cols-3">
          {[["Pick a template", "Each one is a working app, not a mock-up."], ["Make it yours", "Set the limits, who approves what, and what your customers see."], ["We build it with you", "A clickable prototype first, then a tested app on your own address."]].map(([title, text], i) => (
            <div key={title} className="bg-white p-5">
              <Chevrons total={3} done={i + 1} size={12} />
              <div className="mt-2 text-[14px] font-semibold text-[color:var(--c-ink)]">{title}</div>
              <div className="mt-0.5 text-[13px] leading-5 text-[color:var(--c-muted)]">{text}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-[color:var(--c-line)] bg-[color:var(--c-subtle)] px-5 py-3 text-[13px] text-[color:var(--c-text)]">
          <span><b className="font-semibold text-[color:var(--c-ink)]">Four short turns</b> for you, under an hour in all.</span>
          <span><b className="font-semibold text-[color:var(--c-ink)]">About a week</b> from template to live.</span>
          <span>Nothing in your shipping changes until you sign off.</span>
        </div>
      </Panel>

      <section>
        <SectionTitle action={<Muted>For the jobs most teams still do by hand.</Muted>}>Templates</SectionTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{TEMPLATES.filter((t) => t.group !== "Industry").map(card)}</div>
      </section>

      <section>
        <SectionTitle action={<Muted>Made with businesses in one industry, for the way they ship.</Muted>}>Made for an industry</SectionTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.filter((t) => t.group === "Industry").map(card)}
          <div className="grid gap-4">
            <button type="button" onClick={() => ask({ kind: "App", label: "A template for our industry", view: "shiplets" })} className={dashed}>
              <span><span className="block text-[14px] font-semibold text-[color:var(--c-ink)]">Your industry next?</span><span className="mt-1 block text-[13px] leading-5 text-[color:var(--c-muted)]">Tell us what your customers order and how it ships. If others need the same, we make it a template.</span></span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--c-link)]">Suggest one <ArrowRight className="h-3.5 w-3.5" /></span>
            </button>
            <button type="button" onClick={() => ask({ kind: "App", label: app ? "A second app, in my words" : "A new app, in my words", view: "shiplets" })} className={dashed}>
              <span><span className="flex items-center gap-2 text-[14px] font-semibold text-[color:var(--c-ink)]"><PenLine className="h-4 w-4 text-[color:var(--c-muted)]" /> Describe your own</span><span className="mt-1 block text-[13px] leading-5 text-[color:var(--c-muted)]">Nothing here fits? Say what it should do and for whom. We match it to a template or start blank.</span></span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--c-link)]">Write it <ArrowRight className="h-3.5 w-3.5" /></span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── 2. One template, opened: what it does and how to make it yours ──

export function TemplatePage({ id, app, back, onStart, openApp }: { id: TemplateId; app: ShipletApp | null; back: () => void; onStart: (a: ShipletApp) => void; openApp: () => void }) {
  const sc = useScenario();
  const ask = useAsk();
  const t = templateOf(id);
  const color = appColor[brandIdOf(sc)];
  const url = appUrl(sc.account.name, t.id);
  const mine = app?.template === t.id;
  const [values, setValues] = useState<Record<string, Value>>(mine ? app!.settings : {});
  const [drawer, setDrawer] = useState(false);
  const [note, setNote] = useState("");
  const changed = changedIn(t, values);
  const cta = mine
    ? <Button primary onClick={openApp}>Open your {t.name} <ArrowRight className="h-4 w-4" /></Button>
    : app
      ? <Button onClick={() => ask({ kind: "App", label: `A second app: ${t.name}`, view: "shiplets" })}><MessageSquare className="h-4 w-4" /> Ask about a second app</Button>
      : <Button primary onClick={() => setDrawer(true)}>Use this template <ArrowRight className="h-4 w-4" /></Button>;
  const send = () => {
    setDrawer(false);
    onStart(startApp(t, Object.fromEntries(changed.map((s) => [s.id, values[s.id]])), note.trim(), sc.account.user.name, TODAY));
  };

  return (
    <div className="space-y-8">
      <PageHeader back={{ label: "Shiplets", onClick: back }} title={<><TemplateIcon t={t.id} size={36} />{t.name}</>} status={<Badge>{t.industry ? `For ${t.industry.toLowerCase()}` : "Template"}</Badge>} actions={cta}
        subtitle={<>
          <span className="block text-[14px] leading-6 text-[color:var(--c-text)]">{t.tagline}</span>
          <span className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {t.for}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {t.build} after you approve the prototype</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4" /> Runs at {url}, set up by us</span>
          </span>
        </>} />
      {app && !mine && <p className="-mt-3 rounded-md border border-[color:var(--c-line)] bg-[color:var(--c-subtle)] px-4 py-3 text-[13px] text-[color:var(--c-text)]">You already have an app, the {app.name}. Look around, or ask {M} about a second.</p>}

      <section>
        <SectionTitle action={<Muted>Shown with {sc.account.name}&rsquo;s name and colours</Muted>}>How it works</SectionTitle>
        <div className="mt-4"><Tour t={t} values={values} url={url} color={color} /></div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
        <section>
          <SectionTitle action={changed.length > 0 && !mine ? <button type="button" onClick={() => setValues({})} className={`inline-flex items-center gap-1.5 text-[13px] ${link}`}><RotateCcw className="h-3.5 w-3.5" /> Undo {plural(changed.length, "change")}</button> : <Muted>{mine ? "As your app has them." : "The template's starting points. The screens above follow."}</Muted>}>Make it yours</SectionTitle>
          <Panel className="mt-4 px-5">
            {mine ? <WhatItDoes t={t} settings={values} /> : <SettingsEdit t={t} values={values} onChange={(sid, v) => setValues({ ...values, [sid]: v })} />}
          </Panel>
          {!mine && <Muted className="mt-3">Anything that isn&rsquo;t here, say it when you send.</Muted>}
        </section>
        <aside><Facts t={t} always /></aside>
      </div>

      {!app && (
        <Panel className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="text-[14px] leading-6 text-[color:var(--c-text)]"><b className="font-semibold text-[color:var(--c-ink)]">{M} reads it today.</b> A clickable prototype within a day, your app in about a week.</div>
          <Button primary onClick={() => setDrawer(true)}>Use this template{changed.length ? ` with ${plural(changed.length, "change")}` : ""} <ArrowRight className="h-4 w-4" /></Button>
        </Panel>
      )}

      {drawer && (
        <Drawer title={`Start your ${t.name}`} sub={`Goes to ${MATTEO.name}, your account manager.`} onClose={() => setDrawer(false)} footer={<><Button small onClick={() => setDrawer(false)}>Cancel</Button><Button small primary onClick={send}>Send to {M}</Button></>}>
          <Label>Your changes</Label>
          {changed.length ? <ul className="mt-2 space-y-1.5">{changed.map((s) => <li key={s.id} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[color:var(--c-action-text)]" />{s.say(values[s.id])}</li>)}</ul> : <Muted className="mt-1">None: every starting point as it is. You can still change them on the prototype.</Muted>}
          <label htmlFor="note" className="mt-6 block"><Label>Anything else? <span className="font-normal text-[color:var(--c-muted)]">Optional</span></Label></label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Who will use it, what they do today, anything that must never happen." className="mt-2 h-24 w-full rounded-md border border-[color:var(--c-border)] p-3 text-[14px] outline-none focus:border-[color:var(--c-accent)]" />
          <div className="mt-6"><Label>What happens next</Label></div>
          <div className="mt-3"><NextSteps url={url} /></div>
          <Muted className="mt-5">Nothing is built until you say the prototype is right.</Muted>
        </Drawer>
      )}
    </div>
  );
}

// ── 3. Your app, at whatever step it's at ──

// Where it is: seven steps with dates; on phones, one line.
function Stepper({ app }: { app: ShipletApp }) {
  const at = stepOf(app);
  const now = STAGES[Math.min(at, STAGES.length - 1)];
  const when = (id: typeof STAGES[number]["id"]) => app.dates[id] ?? (id === "test" && app.ready ? `By ${app.ready.replace(/^\w+, /, "")}` : "");
  return (
    <Panel className="px-5 py-4">
      <ol className="hidden sm:flex">
        {STAGES.map((s, i) => {
          const done = i < at;
          const current = i === at;
          return (
            <li key={s.id} aria-current={current ? "step" : undefined} className="relative flex min-w-0 flex-1 flex-col items-center text-center">
              {i < STAGES.length - 1 && <span className="absolute left-1/2 top-[10px] h-px w-full" style={{ background: i < at ? "var(--c-action)" : "var(--c-border)" }} />}
              <span className={`relative z-10 inline-flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-[color:var(--c-action)] text-white" : current ? "bg-white ring-4 ring-[color:var(--c-accent-soft)]" : "border-2 border-[color:var(--c-border)] bg-white"}`}>
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : current ? <span className="h-2 w-2 rounded-full bg-[color:var(--c-action)]" /> : null}
              </span>
              <span className={`mt-2 px-1 text-[12px] leading-4 [text-wrap:balance] ${current ? "font-semibold text-[color:var(--c-ink)]" : done ? "text-[color:var(--c-text)]" : "text-[color:var(--c-faint)]"}`}>{s.label}</span>
              <span className="mt-0.5 text-[12px] text-[color:var(--c-muted)]">{when(s.id)}</span>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-3 text-[13px] text-[color:var(--c-ink)] sm:hidden">
        <Chevrons total={STAGES.length} done={Math.min(at + 1, STAGES.length)} size={12} />
        <span className="min-w-0 truncate">Step {Math.min(at + 1, STAGES.length)} of {STAGES.length} · {app.stage === "live" ? "Live" : now.label}{when(now.id) && <span className="text-[color:var(--c-muted)]"> · {when(now.id).toLowerCase().startsWith("by") ? when(now.id).toLowerCase() : `since ${when(now.id)}`}</span>}</span>
      </div>
    </Panel>
  );
}

// The one next thing. `primary` is the page's only primary button.
function NowCard({ step, title, children, primary, secondary }: { step: string; title: string; children: ReactNode; primary?: ReactNode; secondary?: ReactNode }) {
  return (
    <Panel className="p-5">
      <div className="text-[13px] text-[color:var(--c-muted)]">{step}</div>
      <div className="mt-0.5 text-[16px] font-semibold leading-6 text-[color:var(--c-ink)]">{title}</div>
      <div className="mt-2 text-[14px] leading-6 text-[color:var(--c-text)]">{children}</div>
      {(primary || secondary) && <div className="mt-4 flex flex-wrap items-center gap-3">{primary}{secondary}</div>}
    </Panel>
  );
}

// Going live: the app switches from sample data to the account's own.
const liveNow = (app: ShipletApp, url: string, you: string, name?: string): ShipletApp => ({
  ...app, stage: "live", since: "Today", justLive: true, signed: name ? { name, goLive: "today" } : app.signed,
  dates: { ...app.dates, signoff: app.dates.signoff ?? "Today", live: "Today" },
  live: { since: "Oct 22", version: 1, people: 1, peopleNote: "Just you so far", labels: 0, labelsBefore: 0, labelWord: "Labels" },
  events: [{ when: TODAY, who: you, text: name ? `Signed off as ${name}. Live at ${url}.` : `Went live at ${url}.` }, ...app.events],
});

// Questions from the account manager while reviewing (Shiplet.ai's gate one:
// drafted per item, sent together, and the app waits for every answer).
function Questions({ app, setApp }: { app: ShipletApp; setApp: (a: ShipletApp) => void }) {
  const sc = useScenario();
  const toast = useToast();
  const you = sc.account.user.name;
  const qs = app.questions!;
  const [answers, setAnswers] = useState(qs.map((q) => q.a ?? ""));
  const send = () => {
    setApp({ ...app, questions: qs.map((q, i) => ({ q: q.q, a: answers[i].trim() })), events: [{ when: "Today, 11:05 am", who: you, text: `Answered ${M}'s ${plural(qs.length, "question")}.` }, ...app.events] });
    toast({ text: `Sent to ${M}. ${REPLY}` });
  };
  if (!openQuestions(app).length) return (
    <NowCard step={STAGES[1].label} title={`${M} is reading your answers`}>
      Your prototype follows once the list is agreed, usually within a day.
      <dl className="mt-3 space-y-2">{qs.map((q) => <div key={q.q}><dt className="text-[13px] text-[color:var(--c-muted)]">{q.q}</dt><dd className="text-[14px] text-[color:var(--c-ink)]">{q.a}</dd></div>)}</dl>
    </NowCard>
  );
  const filled = answers.filter((a) => a.trim()).length;
  return (
    <NowCard step={STAGES[1].label} title={`${M} has ${plural(qs.length, "question")}`}
      primary={<Button primary disabled={filled < qs.length} onClick={send}>Send answers</Button>} secondary={<span className="text-[13px] text-[color:var(--c-muted)]">{filled} of {qs.length} answered · about 5 minutes</span>}>
      We need {qs.length} details before we go on. Answer here and {M} carries on today.
      <ol className="mt-3 space-y-3">
        {qs.map((q, i) => (
          <li key={q.q}>
            <label htmlFor={`q${i}`} className="block text-[14px] font-medium text-[color:var(--c-ink)]">{i + 1}. {q.q}</label>
            <textarea id={`q${i}`} value={answers[i]} onChange={(e) => setAnswers(answers.map((x, k) => (k === i ? e.target.value : x)))} placeholder="Your answer" className="mt-1.5 h-16 w-full rounded-md border border-[color:var(--c-border)] p-2.5 text-[14px] outline-none focus:border-[color:var(--c-accent)]" />
          </li>
        ))}
      </ol>
    </NowCard>
  );
}

// The sandbox (Shiplet.ai's "Works / Not what I meant"): the screens beside a
// checklist of every line the app does. Notes go to the account manager
// together; when everything works, the client signs off.
function SandboxGate({ app, setApp, signOff, url, color }: { app: ShipletApp; setApp: (a: ShipletApp) => void; signOff: () => void; url: string; color: string }) {
  const sc = useScenario();
  const toast = useToast();
  const t = templateOf(app.template);
  const items = itemsOf(t, app.settings);
  const checks = app.checks ?? {};
  const [noting, setNoting] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [logins, setLogins] = useState(false);
  const mark = (id: string, c?: { ok: boolean; note?: string }) => { const x = { ...checks }; if (c) x[id] = c; else delete x[id]; setApp({ ...app, checks: x }); };
  const done = items.filter((i) => checks[i.id]).length;
  const off = items.filter((i) => checks[i.id] && !checks[i.id].ok);
  const sendNotes = () => {
    setApp({ ...app, stage: "build", since: TODAY, ready: "Mon, Oct 26", checks: Object.fromEntries(Object.entries(checks).filter(([, c]) => c.ok)), dates: { ...app.dates, build: "Today" }, events: [{ when: TODAY, who: sc.account.user.name, text: `Sent ${plural(off.length, "note")} from the sandbox.` }, ...app.events] });
    toast({ text: `Sent to ${M}. Each note goes into the list first, then the app. The sandbox updates by Mon, Oct 26.` });
  };
  const circle = (ok?: boolean) => `inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${FOCUS} ${ok ? "border-[color:var(--c-action)] bg-[color:var(--c-action)] text-white" : "border-[color:var(--c-border2)] bg-white text-transparent hover:border-[color:var(--c-action)] hover:text-[color:var(--c-action)]"}`;
  return (
    <Panel className="overflow-hidden">
      <div className="p-5">
        <div className="text-[13px] text-[color:var(--c-muted)]">{STAGES[5].label}</div>
        <div className="mt-0.5 text-[16px] font-semibold leading-6 text-[color:var(--c-ink)]">Your sandbox is ready to try</div>
        <p className="mt-2 max-w-[640px] text-[14px] leading-6 text-[color:var(--c-text)]">A first working version, with sample data, not your real shipments. About 15 minutes: try it as each role and mark each thing below. &ldquo;Not what I meant&rdquo; is easy to fix here and hard once it&rsquo;s live.</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
          <a href={`/dashboard/apps/${app.template}?account=${brandIdOf(sc)}&test=1&s=${encodeURIComponent(JSON.stringify(app.settings))}`} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 ${link}`}><ArrowUpRight className="h-3.5 w-3.5" /> Open in a new tab</a>
          <button type="button" aria-expanded={logins} onClick={() => setLogins(!logins)} className={`inline-flex items-center gap-1 ${link}`}><KeyRound className="h-3.5 w-3.5" /> Test accounts <ChevronDown className={`h-3.5 w-3.5 transition-transform ${logins ? "rotate-180" : ""}`} /></button>
          <button type="button" onClick={() => toast({ text: "Logins sent. Anyone with them can mark the list too." })} className={link}>Send the logins to a colleague</button>
        </div>
        {logins && (
          <div className="mt-3 max-w-[560px] divide-y divide-[color:var(--c-line)] rounded-md border border-[color:var(--c-line)]">
            {app.logins?.map((g) => (
              <div key={g.role} className="flex items-center gap-3 px-3 py-2 text-[13px]">
                <span className="w-[72px] font-medium text-[color:var(--c-ink)]">{g.role}</span>
                <span className="min-w-0 flex-1 truncate text-[color:var(--c-muted)]" style={{ fontFamily: T.mono, fontSize: 12 }}>{g.email}</span>
                <button type="button" onClick={() => toast({ text: `Password for the ${g.role.toLowerCase()} login copied.` })} className={`text-[12px] ${link}`}>Copy password</button>
              </div>
            ))}
            <div className="px-3 py-2 text-[12px] text-[color:var(--c-muted)]">These only open the sandbox, and stop working when your app goes live.</div>
          </div>
        )}
      </div>
      <div className="grid gap-5 border-t border-[color:var(--c-line)] p-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Tour t={t} values={app.settings} url={`sandbox.${url}`} color={color} stripe="Sandbox · sample data · labels here aren't real" row />
        <div className="min-w-0">
          <div className="flex items-baseline justify-between"><Label>Check each thing</Label><span className="text-[13px] text-[color:var(--c-muted)]">{done} of {items.length}</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--c-line)]"><div className="h-full rounded-full bg-[color:var(--c-action)] transition-all duration-300" style={{ width: `${(done / items.length) * 100}%` }} /></div>
          <ul className="mt-2 divide-y divide-[color:var(--c-line)]">
            {items.map((i) => {
              const c = checks[i.id];
              return (
                <li key={i.id} className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-x-3 py-2.5 sm:grid-cols-[28px_minmax(0,1fr)_auto] sm:items-center">
                  <button type="button" aria-label={c?.ok ? "Works, undo" : "Works"} aria-pressed={!!c?.ok} onClick={() => mark(i.id, c?.ok ? undefined : { ok: true })} className={circle(c?.ok)}><Check className="h-3.5 w-3.5" strokeWidth={3} /></button>
                  <span className={`text-[14px] leading-5 ${c?.ok ? "text-[color:var(--c-muted)]" : "text-[color:var(--c-ink)]"}`}>{i.text}{c && !c.ok && c.note && <span className="mt-0.5 block text-[13px] text-[color:var(--c-muted)]">&ldquo;{c.note}&rdquo;</span>}</span>
                  <span className="col-start-2 sm:col-start-auto">
                    {c && !c.ok ? <span className="flex items-center gap-2"><Badge tone="warning">Not what I meant</Badge><button type="button" onClick={() => mark(i.id)} aria-label="Undo" title="Undo" className={`rounded p-0.5 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}><Undo2 className="h-3.5 w-3.5" /></button></span>
                      : !c?.ok && noting !== i.id && <button type="button" onClick={() => { setNoting(i.id); setNote(""); }} className={`text-[13px] ${link}`}>Not what I meant</button>}
                  </span>
                  {noting === i.id && (
                    <div className="col-span-full mt-1">
                      <textarea autoFocus value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did you expect it to do?" className="h-16 w-full rounded-md border border-[color:var(--c-border)] p-2.5 text-[14px] outline-none focus:border-[color:var(--c-accent)]" />
                      <div className="mt-2 flex justify-end gap-2"><Button small onClick={() => setNoting(null)}>Cancel</Button><Button small primary disabled={!note.trim()} onClick={() => { mark(i.id, { ok: false, note: note.trim() }); setNoting(null); }}>Save</Button></div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--c-line)] bg-[color:var(--c-subtle)] px-5 py-3">
        <span className="text-[13px] text-[color:var(--c-muted)]">{off.length ? `${plural(off.length, "note")} for ${M}. They go into the list first, then the app.` : done === items.length ? "Everything works." : "Or come back later. Your marks are saved."}</span>
        {off.length > 0
          ? <Button primary onClick={sendNotes}>Send {plural(off.length, "note")} to {M}</Button>
          : <Button primary disabled={done < items.length} title={done < items.length ? "Check every line first" : undefined} onClick={signOff}>Sign off and go live <ArrowRight className="h-4 w-4" /></Button>}
      </div>
    </Panel>
  );
}

function ShareMenu({ link: url }: { link: string }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const item = `flex w-full items-start gap-2.5 rounded-md px-3 py-2 text-left hover:bg-[color:var(--c-hover)] ${FOCUS}`;
  const done = (text: string) => { setOpen(false); toast({ text }); };
  return (
    <div className="relative">
      <Button onClick={() => setOpen(!open)}><Share2 className="h-4 w-4" /> Share <ChevronDown className="h-3.5 w-3.5" /></Button>
      {open && (
        <>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-30 cursor-default" />
          <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-72 rounded-lg border border-[color:var(--c-line)] bg-white p-1 shadow-[0_5px_15px_rgba(0,0,0,.12),0_15px_35px_rgba(48,49,61,.08)]">
            <button type="button" onClick={() => done("Link copied.")} className={item}><Copy className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /><span className="min-w-0"><span className="block text-[14px] text-[color:var(--c-ink)]">Copy link</span><span className="block truncate text-[12px] text-[color:var(--c-muted)]" style={{ fontFamily: T.mono }}>{url}</span></span></button>
            <button type="button" onClick={() => done("QR code downloaded.")} className={item}><QrCode className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /><span><span className="block text-[14px] text-[color:var(--c-ink)]">Download a QR code</span><span className="block text-[12px] text-[color:var(--c-muted)]">For a counter, a box insert or a flyer.</span></span></button>
          </div>
        </>
      )}
    </div>
  );
}

// The app on its own address opens in a new tab. In the mockup that's
// /dashboard/apps/<template>, standing in for the customer's own domain.
const siteHref = (brand: BrandId, app: ShipletApp) => `/dashboard/apps/${app.template}?account=${brand}&s=${encodeURIComponent(JSON.stringify(app.settings))}`;
const linkButton = (primary?: boolean) => `inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[14px] font-semibold transition-colors ${FOCUS} ${primary ? "bg-[color:var(--c-action)] text-white shadow-[0_1px_1px_rgba(0,0,0,.12),0_2px_5px_rgba(48,49,61,.08)] hover:bg-[color:var(--c-action-hover)]" : "border border-[color:var(--c-border)] bg-white text-[color:var(--c-text)] shadow-[0_1px_1px_rgba(0,0,0,.06)] hover:bg-[color:var(--c-hover)]"}`;

export function AppPage({ app, setApp, review, signOff, openTemplate }: { app: ShipletApp; setApp: (a: ShipletApp) => void; review: () => void; signOff: () => void; openTemplate: (id: TemplateId) => void }) {
  const sc = useScenario();
  const toast = useToast();
  const ask = useAsk();
  const brand = brandIdOf(sc);
  const color = appColor[brand];
  const t = templateOf(app.template);
  const you = sc.account.user.name;
  const url = appUrl(sc.account.name, app.slug);
  const [drawer, setDrawer] = useState<MessageKind | null>(null);
  const [start, setStart] = useState("");
  const changed = changedIn(t, app.settings);
  const askApp = () => ask({ kind: "App", label: app.name, view: "app" });
  const open = (kind: MessageKind, text = "") => { setStart(text); setDrawer(kind); };

  const sendMessage = (text: string) => {
    if (drawer === "change") setApp({ ...app, change: { text, when: TODAY }, justLive: false, events: [{ when: TODAY, who: you, text: `Asked for a change: "${text}"` }, ...app.events] });
    else setApp({ ...app, events: [{ when: TODAY, who: you, text: `Added a note: "${text}"` }, ...app.events] });
    setDrawer(null);
    toast({ text: `Sent to ${M}. ${REPLY}${app.stage === "live" ? " Your live app keeps running." : ""}` });
  };
  const goLiveNow = () => { setApp(liveNow(app, url, you)); toast({ text: `Live at ${url}.` }); };
  const canChange = app.stage === "live" || app.stage === "check";
  const contact = <ContactCard about={app.stage === "live" ? "Looks after your app with you. Built and tested by our apps team." : `Takes your ${app.name} from your request to live, with our apps team.`} onAsk={askApp} />;

  const now = (() => {
    if (app.change) return <NowCard step={STAGES[1].label} title={`${M} is reading your change`}>&ldquo;{app.change.text}&rdquo;<span className="mt-1 block text-[13px] text-[color:var(--c-muted)]">{REPLY}{app.stage === "live" && " Your live app keeps running."}</span></NowCard>;
    switch (app.stage) {
      case "check":
        return app.questions ? <Questions app={app} setApp={setApp} /> : (
          <NowCard step={STAGES[1].label} title={`${M} is reading it`} secondary={<Button onClick={() => open("note")}>Add a note</Button>}>
            He checks it fits how you ship today and may ask a question or two. You&rsquo;ll hear back today; your prototype usually follows within a day.
          </NowCard>
        );
      case "prepare":
        return (
          <NowCard step={STAGES[2].label} title={app.revision ? "We're preparing version 2 of your prototype" : "We're preparing your prototype"}>
            {app.revision ? <>From your note: &ldquo;{app.revision.text}&rdquo;. </> : <>Made from the list you agreed with {M}. </>}You&rsquo;ll get a note when it&rsquo;s ready, usually within the hour.
          </NowCard>
        );
      case "preview":
        return (
          <NowCard step={STAGES[3].label} title="Your prototype is ready" primary={<Button primary onClick={review}>Review the prototype <ArrowRight className="h-4 w-4" /></Button>} secondary={<span className="text-[13px] text-[color:var(--c-muted)]">About 10 minutes</span>}>
            Try it as each role, then confirm the {changed.length < t.settings.length ? `${t.settings.length - changed.length} starting points you left as they were` : "list"}. Nothing is built until you say it&rsquo;s right.
          </NowCard>
        );
      case "build":
        return (
          <NowCard step={STAGES[4].label} title="We're building and testing it">
            Usually 2–3 business days, then quality and security checks. Your sandbox should be ready by <b className="font-semibold text-[color:var(--c-ink)]">{app.ready}</b>; we&rsquo;ll email you and show it on Home.
            <ul className="mt-3 space-y-1.5 text-[13px]">
              <li className="flex items-center gap-2"><span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--c-action)]"><Check className="h-2.5 w-2.5 text-white" strokeWidth={3} /></span> Building started, today</li>
              <li className="flex items-center gap-2 text-[color:var(--c-muted)]"><span className="h-4 w-4 rounded-full border-2 border-[color:var(--c-border)]" /> Security check</li>
              <li className="flex items-center gap-2 text-[color:var(--c-muted)]"><span className="h-4 w-4 rounded-full border-2 border-[color:var(--c-border)]" /> Quality and design checks</li>
            </ul>
          </NowCard>
        );
      case "test":
        return null; // the sandbox below is the now
      case "signoff":
        return app.signed ? (
          <NowCard step={STAGES[6].label} title={`Goes live ${app.signed.goLive}`} secondary={<><Button onClick={goLiveNow}>Go live now instead</Button><button type="button" onClick={signOff} className={`text-[13px] ${link}`}>Change the date</button></>}>
            Signed by {app.signed.name}. It switches from sample data to your live account then, at <b className="font-semibold text-[color:var(--c-ink)]">{url}</b>. Nothing to do until then; we&rsquo;ll email you that morning.
          </NowCard>
        ) : (
          <NowCard step={STAGES[6].label} title="Ready to go live" primary={<Button primary onClick={signOff}>Review and sign off <ArrowRight className="h-4 w-4" /></Button>} secondary={<span className="text-[13px] text-[color:var(--c-muted)]">About 5 minutes</span>}>
            Everything you checked in the sandbox works. One last look at exactly what it does, then you sign.
          </NowCard>
        );
      case "live":
        return app.justLive ? (
          <NowCard step="Live" title={`Your ${app.name} is live`} primary={<Button primary onClick={() => toast({ text: "Invites sent. Admins can add more people from inside the app." })}>Invite your team</Button>}>
            It&rsquo;s at <b className="font-semibold text-[color:var(--c-ink)]">{url}</b>, starting clean: nothing from the sandbox carried over. Each person you invite gets the role you choose.
          </NowCard>
        ) : null;
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-8">
      <PageHeader title={app.name} status={turnBadge(app)}
        subtitle={<span className="flex flex-wrap items-center gap-x-3 gap-y-1"><span style={{ fontFamily: T.mono, fontSize: 13 }}>{app.stage === "live" ? url : `Will run at ${url}`}</span><span aria-hidden>·</span><button type="button" onClick={() => openTemplate(app.template)} className={`text-[13px] ${link}`}>From the {t.name} template</button></span>}
        actions={app.stage === "live" ? <><a href={siteHref(brand, app)} target="_blank" rel="noreferrer" className={linkButton(!app.justLive)}><ArrowUpRight className="h-4 w-4" /> Open app</a><ShareMenu link={url} /><Button onClick={() => open("change")}><Pencil className="h-4 w-4" /> Ask for a change</Button></> : undefined} />

      {app.stage !== "live" && <Stepper app={app} />}

      {app.stage === "test" && !app.change && <SandboxGate app={app} setApp={setApp} signOff={signOff} url={url} color={color} />}

      {(now || app.stage === "live") && <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {now}
          {app.stage === "live" && app.live && (
            <StatRow>
              <Stat label="Live since" value={app.live.since} sub={`Version ${app.live.version}`} />
              <Stat label="People using it" value={app.live.people} sub={app.live.peopleNote} />
              <Stat label={`${app.live.labelWord}, last 30 days`} value={app.live.labels} sub={app.live.labels ? `${app.live.labelsBefore} the 30 days before` : "The first one shows here"} />
            </StatRow>
          )}
        </div>
        <aside>{contact}</aside>
      </div>}

      {app.stage !== "test" && (
        <section>
          <SectionTitle action={<Muted>{app.stage === "live" ? "The live screens, with sample data" : "As it will look"}</Muted>}>How your app works</SectionTitle>
          <div className="mt-4"><Tour t={t} values={app.settings} url={url} color={color} row /></div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
        <section>
          <SectionTitle action={<Muted>{changed.length ? `${changed.length} changed from the ${t.name} template` : `As the ${t.name} template has it`}</Muted>}>What it does</SectionTitle>
          <Panel className="mt-4 px-5"><WhatItDoes t={t} settings={app.settings} onAsk={canChange ? (s) => open(app.stage === "live" ? "change" : "note", `${s.label}: ${fmt(s, valueOf(t, app.settings, s.id))} → `) : undefined} /></Panel>
          {!canChange && app.stage !== "live" && <Muted className="mt-3">{app.stage === "preview" ? "You confirm or change these on the prototype." : <>To change one now, <button type="button" onClick={askApp} className={link}>ask {M}</button>. It goes into the next version.</>}</Muted>}
        </section>
        <aside className="space-y-6">{!now && app.stage !== "live" && contact}<Facts t={t} /></aside>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
        <section>
          <SectionTitle>Timeline</SectionTitle>
          <ol className="relative ml-3 mt-5 space-y-4 border-l border-[color:var(--c-border)] pl-7">
            {app.events.map((e) => (
              <li key={e.when + e.text} className="relative">
                <span className="absolute -left-[40px] top-0 rounded-full ring-4 ring-white">{e.who === you ? <Avatar p={{ initials: initialsOf(you), color: "var(--c-ink)", online: true }} size={24} /> : <Actor name={e.who} size={24} />}</span>
                <div className="text-[12px] text-[color:var(--c-muted)]">{e.when}</div>
                <div className="text-[14px] leading-5 text-[color:var(--c-text)]"><b className="font-semibold text-[color:var(--c-ink)]">{e.who === "ShipTime" ? "Our apps team" : e.who === you ? "You" : e.who.split(" ")[0]}</b> {e.text.charAt(0).toLowerCase() + e.text.slice(1)}</div>
              </li>
            ))}
          </ol>
        </section>
        {app.described && (
          <aside>
            <Panel className="p-5">
              <Label>How you described it</Label>
              <p className="mt-2 text-[14px] leading-6 text-[color:var(--c-text)]">&ldquo;{app.described}&rdquo;</p>
              <div className="mt-2 text-[12px] text-[color:var(--c-muted)]">{you.split(" ")[0]}, {app.dates.describe}</div>
            </Panel>
          </aside>
        )}
      </div>

      {drawer && <MessageDrawer kind={drawer} app={app.name} start={start} onClose={() => setDrawer(null)} onSend={sendMessage} />}
    </div>
  );
}

// ── 4. Reviewing the prototype ──
// The client clicks through, then confirms each starting point they left as it
// was. "Looks right, build it" (Eugene's words) sits under the list and opens
// once every one is answered: a visible finish line.

export function PreviewReview({ app, setApp, back }: { app: ShipletApp; setApp: (a: ShipletApp) => void; back: () => void }) {
  const sc = useScenario();
  const toast = useToast();
  const color = appColor[brandIdOf(sc)];
  const t = templateOf(app.template);
  const you = sc.account.user.name;
  const url = appUrl(sc.account.name, app.slug);
  const toCheck = t.settings.filter((s) => same(valueOf(t, app.settings, s.id), s.start));
  const agreed = [...changedIn(t, app.settings).map((s) => s.say(app.settings[s.id])), ...t.always];
  const [values, setValues] = useState(app.settings);
  const [answered, setAnswered] = useState<Record<string, "keep" | "change">>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Value>("");
  const [drawer, setDrawer] = useState<"build" | "changes" | null>(null);
  const left = toCheck.filter((s) => !answered[s.id]).length;
  const changed = Object.values(answered).filter((a) => a === "change").length;

  const build = () => {
    setApp({ ...app, settings: values, stage: "build", since: TODAY, ready: "Tue, Oct 27", dates: { ...app.dates, build: "Today" }, events: [{ when: TODAY, who: you, text: changed ? `Approved the prototype with ${plural(changed, "change")}. Building started.` : "Approved the prototype. Building started." }, ...app.events] });
    back();
    toast({ text: "Approved. Your sandbox should be ready by Tue, Oct 27." });
  };
  const askChanges = (text: string) => {
    setApp({ ...app, stage: "prepare", revision: { text, when: TODAY }, events: [{ when: TODAY, who: you, text: `Asked for prototype changes: "${text}"` }, ...app.events] });
    setDrawer(null);
    back();
    toast({ text: "Sent. Version 2 of the prototype usually follows within the hour." });
  };

  return (
    <div className="space-y-6">
      <PageHeader back={{ label: app.name, onClick: back }} title={`${app.name} · prototype`} status={<Badge>Version {app.revision ? 2 : 1}</Badge>}
        subtitle="Click around as each role, then confirm the starting points on the right. Nothing you do here is saved."
        actions={<Button onClick={() => setDrawer("changes")}>Ask for changes</Button>} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Tour t={t} values={values} url={url} color={color} stripe="Prototype · sample data · nothing is saved" row />
        <Panel className="h-fit overflow-hidden">
          <div className="p-5">
            <div className="flex items-baseline justify-between"><Label>Please check</Label><span className="text-[13px] text-[color:var(--c-muted)]">{toCheck.length - left} of {toCheck.length} done</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--c-line)]"><div className="h-full rounded-full bg-[color:var(--c-action)] transition-all duration-300" style={{ width: `${toCheck.length ? ((toCheck.length - left) / toCheck.length) * 100 : 100}%` }} /></div>
            <Muted className="mt-3">{toCheck.length ? "We used the template's starting points for these. Keep each one, or change it." : "Nothing to check: you set every one yourself."}</Muted>
            <ul className="mt-3 space-y-2">
              {toCheck.map((s) => {
                const a = answered[s.id];
                const value = valueOf(t, values, s.id);
                if (a && editing !== s.id) return (
                  <li key={s.id} className="flex items-start gap-2.5 rounded-md border border-[color:var(--c-line)] px-3 py-2.5 text-[13px]">
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--c-action)]"><Check className="h-2.5 w-2.5 text-white" strokeWidth={3} /></span>
                    <span className="min-w-0 flex-1 text-[color:var(--c-text)]">{s.say(value)}{a === "change" && <span className="mt-0.5 block text-[12px] font-medium text-[color:var(--c-action-text)]">Changed from {fmt(s, s.start)}</span>}</span>
                    <button type="button" onClick={() => { const next = { ...answered }; delete next[s.id]; setAnswered(next); setValues((v) => { const x = { ...v }; delete x[s.id]; return x; }); }} aria-label="Undo" title="Undo" className={`rounded p-0.5 text-[color:var(--c-muted)] hover:bg-[color:var(--c-hover)] ${FOCUS}`}><Undo2 className="h-3.5 w-3.5" /></button>
                  </li>
                );
                return (
                  <li key={s.id} className="rounded-md border border-[color:var(--c-border)] p-3">
                    <div className="text-[14px] leading-5 text-[color:var(--c-ink)]">{s.say(value)}</div>
                    {editing === s.id ? (
                      <div className="mt-3">
                        <Control s={s} value={draft} onChange={setDraft} />
                        <div className="mt-3 flex justify-end gap-2"><Button small onClick={() => setEditing(null)}>Cancel</Button><Button small primary onClick={() => { setValues({ ...values, [s.id]: draft }); setAnswered({ ...answered, [s.id]: same(draft, s.start) ? "keep" : "change" }); setEditing(null); }}>Save</Button></div>
                      </div>
                    ) : (
                      <div className="mt-2.5 grid grid-cols-2 gap-2"><Button small onClick={() => setAnswered({ ...answered, [s.id]: "keep" })}>Yes, keep it</Button><Button small onClick={() => { setEditing(s.id); setDraft(value); }}>Change it</Button></div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-5"><Label>Already agreed</Label></div>
            <ul className="mt-2 space-y-1.5">{agreed.map((x) => <li key={x} className="flex gap-2 text-[13px] leading-5 text-[color:var(--c-muted)]"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />{x}</li>)}</ul>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--c-line)] bg-[color:var(--c-subtle)] px-5 py-3">
            <span className="text-[13px] text-[color:var(--c-muted)]">{left ? `${left} left to check` : "All checked."}</span>
            <Button primary disabled={left > 0} title={left ? "Answer every item first" : undefined} onClick={() => setDrawer("build")}>Looks right, build it <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </Panel>
      </div>
      {drawer === "build" && (
        <Drawer title="Looks right, build it?" sub={`${t.always.length + t.settings.length} things: ${agreed.length} agreed, ${toCheck.length} confirmed just now.`} onClose={() => setDrawer(null)} footer={<><Button small onClick={() => setDrawer(null)}>Back</Button><Button small primary onClick={build}>Build it</Button></>}>
          <p>We build the working app and run security, quality and design checks. That usually takes 2–3 business days: your sandbox should be ready by <b className="font-semibold text-[color:var(--c-ink)]">Tue, Oct 27</b>.</p>
          <p className="mt-3">You try it with sample data before anyone uses it, and it only goes live when you sign off.</p>
        </Drawer>
      )}
      {drawer === "changes" && <MessageDrawer kind="changes" app={app.name} onClose={() => setDrawer(null)} onSend={askChanges} />}
    </div>
  );
}

// ── 5. Signing off ──
// A view over the sandbox step: exactly what the app does, what was
// deliberately left out, a typed name as the signature, and when it goes live.
// The step only moves on when the client signs.

export function SignOffPage({ app, setApp, back }: { app: ShipletApp; setApp: (a: ShipletApp) => void; back: () => void }) {
  const sc = useScenario();
  const toast = useToast();
  const t = templateOf(app.template);
  const you = sc.account.user.name;
  const url = appUrl(sc.account.name, app.slug);
  const [name, setName] = useState(app.signed?.name ?? "");
  const [when, setWhen] = useState<"now" | "monday" | "date">(app.signed ? "monday" : "now");
  const [date, setDate] = useState("2026-10-29");
  const [terms, setTerms] = useState(!!app.signed);
  const day = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const sign = () => {
    const who = name.trim();
    if (when === "now") { setApp(liveNow(app, url, you, who)); back(); toast({ text: `Signed. Live at ${url}.` }); return; }
    const goLive = when === "monday" ? "Monday morning, Oct 26" : `on ${day(date)}`;
    setApp({ ...app, stage: "signoff", signed: { name: who, goLive }, dates: { ...app.dates, signoff: "Today" }, events: [{ when: TODAY, who: you, text: `Signed off as ${who}. Goes live ${goLive}.` }, ...app.events] });
    back();
    toast({ text: `Signed. Goes live ${goLive}.` });
  };
  const radio = (id: typeof when, label: string, sub?: string) => (
    <label className="flex cursor-pointer items-start gap-2.5 py-1.5">
      <input type="radio" name="golive" checked={when === id} onChange={() => setWhen(id)} className="mt-1" style={{ accentColor: "var(--c-action)" }} />
      <span><span className="block text-[14px] text-[color:var(--c-ink)]">{label}</span>{sub && <span className="block text-[12px] text-[color:var(--c-muted)]">{sub}</span>}</span>
    </label>
  );
  const ready = !!name.trim() && terms;
  return (
    <div className="space-y-6">
      <PageHeader back={{ label: app.name, onClick: back }} title="Sign off and go live" subtitle="Everything you checked in the sandbox works. Here is exactly what the app does, and what was left out, before you sign." />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel className="h-fit overflow-hidden">
          <div className="p-5">
            <Label>What it does</Label>
            <ul className="mt-3 space-y-2.5">{itemsOf(t, app.settings).map((i) => <li key={i.id} className="flex gap-2.5 text-[14px] leading-5 text-[color:var(--c-text)]"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-action-text)]" />{i.text}</li>)}</ul>
          </div>
          <div className="border-t border-[color:var(--c-line)] bg-[color:var(--c-subtle)] p-5">
            <Label>What was left out</Label>
            {t.leftOut.length
              ? <ul className="mt-3 space-y-2">{t.leftOut.map((x) => <li key={x} className="flex gap-2.5 text-[14px] leading-5 text-[color:var(--c-text)]"><Minus className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" />{x}</li>)}</ul>
              : <Muted className="mt-2">Nothing was left out.</Muted>}
            <Muted className="mt-3">Want one later? Ask for it as a change once the app is live. Changes take the same path: describe it, review the prototype, try the sandbox, sign off.</Muted>
          </div>
        </Panel>
        <Panel className="h-fit p-5 lg:sticky lg:top-20">
          <div className="text-[16px] font-semibold text-[color:var(--c-ink)]">Your signature</div>
          <p className="mt-1 text-[13px] leading-5 text-[color:var(--c-muted)]">By signing, you confirm this is what you asked for. The app switches from sample data to your live account at {url}.</p>
          <label htmlFor="signer" className="mt-5 block text-[13px] font-semibold text-[color:var(--c-ink)]">Your name</label>
          <input id="signer" value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name to sign" className="mt-1.5 h-9 w-full rounded-md border border-[color:var(--c-border)] px-3 text-[14px] outline-none focus:border-[color:var(--c-accent)]" />
          <fieldset className="mt-4">
            <legend className="text-[13px] font-semibold text-[color:var(--c-ink)]">Go live</legend>
            <div className="mt-1">
              {radio("now", "As soon as I sign", "Live means real labels at your rates. Only people you invite can sign in.")}
              {radio("monday", "Monday morning", "Oct 26, 8:00 am, before the week starts")}
              {radio("date", "Pick a date")}
              {when === "date" && <input type="date" aria-label="Go-live date" value={date} min="2026-10-23" onChange={(e) => setDate(e.target.value)} className="ml-7 mt-1 h-9 rounded-md border border-[color:var(--c-border)] px-2.5 text-[14px] outline-none focus:border-[color:var(--c-accent)]" />}
            </div>
          </fieldset>
          <div className="mt-4 text-[13px] font-semibold text-[color:var(--c-ink)]">The terms, in short</div>
          <ul className="mt-1.5 space-y-1 text-[13px] leading-5 text-[color:var(--c-text)]">
            <li>The app is yours: your name, your address, your data.</li>
            <li>We host it, keep it running and fix what breaks.</li>
            <li>Changes go through the same path, never patched by hand.</li>
          </ul>
          <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-[14px] text-[color:var(--c-text)]">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1" style={{ accentColor: "var(--c-action)" }} />
            <span>I&rsquo;ve read the <button type="button" onClick={() => toast({ text: "Opens the full ownership and support terms." })} className={link}>full terms</button>.</span>
          </label>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button primary disabled={!ready} title={ready ? undefined : "Type your name and tick the terms first"} onClick={sign}>{when === "now" ? "Sign off and go live" : "Sign off"}</Button>
            <button type="button" onClick={back} className={`text-[13px] ${link}`}>Something&rsquo;s still wrong, go back</button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
