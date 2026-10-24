"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, KeyRound } from "lucide-react";
import { BRAND_CSS, KMark, KoherentLogo, themeVars } from "./brand";
import { scenarios, type BrandId, type Scenario } from "./scenarios";
import { FOCUS, T } from "./ui";

// ── Sign in ──────────────────────────────────────────────────────────────────
// Two steps, the way multi-account products do it (Slack, Google, Stripe):
// sign in with email, Google or SSO, then choose an account. The chooser holds
// the demo accounts, so the same app can be shown as a small brand on
// ShipTime and as a Koherent account. The right half is ShipTime's "ask" for
// Koherent: one of its features drawn as real UI, in Koherent's colours, with
// a way to look inside an example account.

const ORDER: BrandId[] = ["reach", "canada", "stores", "small"];

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

const field = "h-10 w-full rounded-md border border-[color:var(--c-border)] bg-white px-3 text-[14px] text-[color:var(--c-ink)] outline-none transition-shadow placeholder:text-[color:var(--c-faint)] focus:border-[color:var(--c-accent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--c-accent)_18%,transparent)]";

function SignIn({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(email); }}>
      <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-[color:var(--c-ink)]">Sign in to ShipTime</h1>
      <p className="mt-1 text-[14px] text-[color:var(--c-muted)]">Welcome back. Use your work email or Google.</p>
      <label htmlFor="email" className="mt-8 block text-[13px] font-medium text-[color:var(--c-text)]">Work email</label>
      <input id="email" type="email" autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={`mt-1.5 ${field}`} />
      <button type="submit" className={`mt-4 h-10 w-full rounded-md bg-[color:var(--c-action)] text-[14px] font-semibold text-white shadow-[0_1px_1px_rgba(0,0,0,.12)] transition-colors hover:bg-[color:var(--c-action-hover)] ${FOCUS}`}>Continue</button>
      <div className="my-6 flex items-center gap-3 text-[12px] text-[color:var(--c-faint)]"><span className="h-px flex-1 bg-[color:var(--c-line)]" />or<span className="h-px flex-1 bg-[color:var(--c-line)]" /></div>
      <button type="button" onClick={() => onNext("")} className={`flex h-10 w-full items-center justify-center gap-2.5 rounded-md border border-[color:var(--c-border)] bg-white text-[14px] font-medium text-[color:var(--c-ink)] transition-colors hover:bg-[color:var(--c-hover)] ${FOCUS}`}>
        <GoogleMark /> Continue with Google
      </button>
      <button type="button" onClick={() => onNext("")} className={`mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md text-[14px] font-medium text-[color:var(--c-text)] transition-colors hover:bg-[color:var(--c-hover)] ${FOCUS}`}>
        <KeyRound className="h-4 w-4 text-[color:var(--c-muted)]" strokeWidth={1.8} /> Sign in with SSO
      </button>
      <p className="mt-8 text-[13px] text-[color:var(--c-muted)]">New to ShipTime? <a href="#" className="font-medium text-[color:var(--c-link)] hover:underline">Create an account</a></p>
    </form>
  );
}

function Choose({ email, onBack, onPick, onTeam }: { email: string; onBack: () => void; onPick: (b: BrandId) => void; onTeam: () => void }) {
  const sub = (s: Scenario) => `${s.sites[0].name} · ${s.sites.length} warehouse${s.sites.length > 1 ? "s" : ""}`;
  return (
    <div>
      <button type="button" onClick={onBack} className={`-ml-1 inline-flex items-center gap-1 rounded px-1 text-[13px] font-medium text-[color:var(--c-muted)] hover:text-[color:var(--c-ink)] ${FOCUS}`}><ArrowLeft className="h-3.5 w-3.5" /> Back</button>
      <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.01em] text-[color:var(--c-ink)]">Choose an account</h1>
      <p className="mt-1 text-[14px] text-[color:var(--c-muted)]">Signed in as <span className="text-[color:var(--c-text)]">{email || "demo@shiptime.com"}</span></p>
      <ul className="mt-6 divide-y divide-[color:var(--c-line)] overflow-hidden rounded-lg border border-[color:var(--c-line)]">
        {ORDER.map((id) => {
          const s = scenarios[id];
          const one = s.tier === "Koherent";
          return (
            <li key={id}>
              <button type="button" onClick={() => onPick(id)} className="group flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[color:var(--c-hover)] focus-visible:bg-[color:var(--c-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--c-accent)]/40">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--c-subtle)] text-[11px] font-semibold text-[color:var(--c-text)]">{s.account.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-[color:var(--c-ink)]">{s.account.name}</span>
                  <span className="block truncate text-[12px] text-[color:var(--c-muted)]">{sub(s)}</span>
                </span>
                {one
                  ? <span className="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold" style={{ background: "#EEE8F3", color: "#461948" }}><KMark size={9} color="#461948" />Koherent</span>
                  : <span className="shrink-0 rounded bg-[color:var(--c-subtle)] px-1.5 py-0.5 text-[11px] font-medium text-[color:var(--c-muted)]">ShipTime</span>}
                <ChevronRight className="h-4 w-4 shrink-0 text-[color:var(--c-border2)] transition-colors group-hover:text-[color:var(--c-muted)]" />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-[12px] font-medium text-[color:var(--c-muted)]">ShipTime staff</p>
      <button type="button" onClick={onTeam} className="group mt-2 flex w-full items-center gap-3 rounded-lg border border-[color:var(--c-line)] px-3.5 py-3 text-left transition-colors hover:bg-[color:var(--c-hover)] focus-visible:bg-[color:var(--c-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--c-accent)]/40">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2E4C8F] text-[11px] font-semibold text-white">PS</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-[color:var(--c-ink)]">Priya Shah, account team</span>
          <span className="block truncate text-[12px] text-[color:var(--c-muted)]">Her day and her 3 Koherent accounts</span>
        </span>
        <span className="shrink-0 rounded bg-[color:var(--c-subtle)] px-1.5 py-0.5 text-[11px] font-medium text-[color:var(--c-muted)]">Internal</span>
        <ChevronRight className="h-4 w-4 shrink-0 text-[color:var(--c-border2)] transition-colors group-hover:text-[color:var(--c-muted)]" />
      </button>
      <p className="mt-6 text-[13px] text-[color:var(--c-muted)]">Need access to another account? Ask its admin to invite you.</p>
    </div>
  );
}

function WhatsNew({ onExample }: { onExample: () => void }) {
  const rules = scenarios.reach.rules;
  const tone = { Live: "border-[#A8F170] bg-[#EAFCDD] text-[#217005]", Shadow: "border-[#A7E7FC] bg-[#E2FBFE] text-[#045AD0]", Suggested: "border-[#FBD992] bg-[#FDF8C9] text-[#B13600]" };
  const label = { Live: "Live", Shadow: "Test run", Suggested: "Suggested" };
  return (
    <div data-brand="koherent" className="w-full max-w-[460px]" style={{ ...themeVars("koherent"), fontFamily: "var(--c-font)" }}>
      <style>{BRAND_CSS}</style>
      <KoherentLogo size={20} color="#F6F3EE" />
      <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.14em] text-[#C7AEE6]" style={{ fontFamily: "var(--c-mono)" }}>For established brands</p>
      <h2 className="mt-3 text-[30px] font-bold leading-[1.15] tracking-[-0.025em] text-[#F6F3EE]">Rules for every order</h2>
      <p className="mt-3 text-[15px] leading-6 text-[#F6F3EE]/75">Which warehouse and which carrier each order uses, written by your Koherent team from your own orders. Nothing changes until you approve.</p>
      <div className="mt-9 overflow-hidden rounded-lg bg-white shadow-[0_24px_48px_rgba(23,16,28,.45)]">
        <div className="flex items-center justify-between border-b border-[color:var(--c-line)] px-4 py-3">
          <span className="text-[13px] font-semibold text-[color:var(--c-ink)]">Rules</span>
          <span className="text-[12px] text-[color:var(--c-muted)]">Tested on September&rsquo;s orders</span>
        </div>
        {rules.map((r) => (
          <div key={r.id} className="flex items-center gap-3 border-b border-[color:var(--c-line)] px-4 py-3 last:border-b-0">
            <span className="min-w-0 flex-1 text-[13px] leading-5 text-[color:var(--c-ink)]">{r.name}</span>
            <span className="text-[13px] tabular-nums text-[#217005]">${r.monthly.toLocaleString("en-US")}/mo</span>
            <span className={`w-[74px] shrink-0 rounded border px-1.5 py-0.5 text-center text-[11px] font-medium ${tone[r.status]}`}>{label[r.status]}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={onExample} className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#C7AEE6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7AEE6]">See an example account <ArrowRight className="h-4 w-4" /></button>
    </div>
  );
}

export function Login({ onSignIn, onTeam }: { onSignIn: (b: BrandId) => void; onTeam: () => void }) {
  const [email, setEmail] = useState<string | null>(null);
  return (
    <div className="flex min-h-screen bg-white text-[color:var(--c-text)]" style={{ fontFamily: T.font }}>
      <div className="flex min-h-screen flex-1 flex-col px-6 sm:px-10">
        <header className="flex h-[72px] items-center gap-3">
          <img src="/shiptime-logo.svg" alt="ShipTime" width={120} height={36} className="h-7 w-auto" />
          <span className="rounded border border-[color:var(--c-line)] px-1.5 py-0.5 text-[11px] font-medium text-[color:var(--c-muted)]">Demo · sample data</span>
        </header>
        <main className="flex flex-1 items-start justify-center pb-10 pt-6 sm:items-center sm:py-10">
          <div className="w-full max-w-[360px]">
            {email === null ? <SignIn onNext={setEmail} /> : <Choose email={email} onBack={() => setEmail(null)} onPick={onSignIn} onTeam={onTeam} />}
          </div>
        </main>
        <footer className="flex h-[64px] flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[color:var(--c-faint)]">
          <span>© 2026 ShipTime</span>
          {["Privacy", "Terms", "Help"].map((x) => <a key={x} href="#" className="hover:text-[color:var(--c-text)]">{x}</a>)}
        </footer>
      </div>
      <aside className="hidden w-[46%] max-w-[720px] items-center justify-center bg-[#461948] px-14 lg:flex">
        <WhatsNew onExample={() => onSignIn("reach")} />
      </aside>
    </div>
  );
}
