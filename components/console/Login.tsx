"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, KeyRound } from "lucide-react";
import { scenarios, type BrandId, type Scenario } from "./scenarios";
import { T } from "./ui";

// ── Sign in ──────────────────────────────────────────────────────────────────
// Two steps, the way multi-account products do it (Slack, Google, Stripe):
// sign in with email, Google or SSO, then choose an account. The chooser holds
// the demo accounts, so the same app can be shown as a small brand on
// ShipTime and as a ShipTime One account. The right half shows what's new in
// the product, drawn as real UI rather than an illustration.

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

const field = "h-10 w-full rounded-md border border-[#D8DEE4] bg-white px-3 text-[14px] text-[#1A1B25] outline-none transition-shadow placeholder:text-[#8792A2] focus:border-[#EC5A26] focus:shadow-[0_0_0_3px_rgba(236,90,38,.18)]";

function SignIn({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(email); }}>
      <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-[#1A1B25]">Sign in to ShipTime</h1>
      <p className="mt-1 text-[14px] text-[#6A7383]">Welcome back. Use your work email or Google.</p>
      <label htmlFor="email" className="mt-8 block text-[13px] font-medium text-[#353A44]">Work email</label>
      <input id="email" type="email" autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={`mt-1.5 ${field}`} />
      <button type="submit" className="mt-4 h-10 w-full rounded-md bg-[#EC5A26] text-[14px] font-semibold text-white shadow-[0_1px_1px_rgba(0,0,0,.12)] transition-colors hover:bg-[#D94E1C]">Continue</button>
      <div className="my-6 flex items-center gap-3 text-[12px] text-[#8792A2]"><span className="h-px flex-1 bg-[#EBEEF1]" />or<span className="h-px flex-1 bg-[#EBEEF1]" /></div>
      <button type="button" onClick={() => onNext("")} className="flex h-10 w-full items-center justify-center gap-2.5 rounded-md border border-[#D8DEE4] bg-white text-[14px] font-medium text-[#1A1B25] transition-colors hover:bg-[#F6F8FA]">
        <GoogleMark /> Continue with Google
      </button>
      <button type="button" onClick={() => onNext("")} className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md text-[14px] font-medium text-[#353A44] transition-colors hover:bg-[#F6F8FA]">
        <KeyRound className="h-4 w-4 text-[#6A7383]" strokeWidth={1.8} /> Sign in with SSO
      </button>
      <p className="mt-8 text-[13px] text-[#6A7383]">New to ShipTime? <a href="#" className="font-medium text-[#2E4C8F] hover:underline">Create an account</a></p>
    </form>
  );
}

function Choose({ email, onBack, onPick }: { email: string; onBack: () => void; onPick: (b: BrandId) => void }) {
  const sub = (s: Scenario) => `${s.sites[0].name} · ${s.sites.length} site${s.sites.length > 1 ? "s" : ""}`;
  return (
    <div>
      <button type="button" onClick={onBack} className="-ml-1 inline-flex items-center gap-1 rounded px-1 text-[13px] font-medium text-[#6A7383] hover:text-[#1A1B25]"><ArrowLeft className="h-3.5 w-3.5" /> Back</button>
      <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.01em] text-[#1A1B25]">Choose an account</h1>
      <p className="mt-1 text-[14px] text-[#6A7383]">Signed in as <span className="text-[#353A44]">{email || "demo@shiptime.com"}</span></p>
      <ul className="mt-6 divide-y divide-[#EBEEF1] overflow-hidden rounded-lg border border-[#EBEEF1]">
        {ORDER.map((id) => {
          const s = scenarios[id];
          const one = s.tier === "ShipTime One";
          return (
            <li key={id}>
              <button type="button" onClick={() => onPick(id)} className="group flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[#F6F8FA] focus:bg-[#F6F8FA] focus:outline-none">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#F5F6F8] text-[11px] font-semibold text-[#353A44]">{s.account.initials}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-[#1A1B25]">{s.account.name}</span>
                  <span className="block truncate text-[12px] text-[#6A7383]">{sub(s)}</span>
                </span>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${one ? "bg-[#FFF4EF] text-[#C2410C]" : "bg-[#F5F6F8] text-[#6A7383]"}`}>{s.tier}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#C0C8D2] transition-colors group-hover:text-[#6A7383]" />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-[13px] text-[#6A7383]">Need access to another account? Ask its admin to invite you.</p>
    </div>
  );
}

function WhatsNew() {
  const rules = scenarios.reach.rules;
  const tone = { Live: "border-[#A8F170] bg-[#EAFCDD] text-[#217005]", Shadow: "border-[#A7E7FC] bg-[#E2FBFE] text-[#045AD0]", Suggested: "border-[#FBD992] bg-[#FDF8C9] text-[#B13600]" };
  return (
    <div className="w-full max-w-[460px]">
      <span className="text-[13px] font-medium text-white/60">What&rsquo;s new · ShipTime One</span>
      <h2 className="mt-3 text-[28px] font-semibold leading-[1.2] tracking-[-0.01em] text-white">Rules for every order</h2>
      <p className="mt-3 text-[15px] leading-6 text-white/70">Choose which site and which carrier each order uses. We suggest them from your orders, and nothing changes until you approve.</p>
      <div className="mt-10 overflow-hidden rounded-xl bg-white shadow-[0_24px_48px_rgba(0,0,0,.28)]">
        <div className="flex items-center justify-between border-b border-[#EBEEF1] px-4 py-3">
          <span className="text-[13px] font-semibold text-[#1A1B25]">Rules</span>
          <span className="text-[12px] text-[#6A7383]">Tested on September&rsquo;s orders</span>
        </div>
        {rules.map((r) => (
          <div key={r.id} className="flex items-center gap-3 border-b border-[#EBEEF1] px-4 py-3 last:border-b-0">
            <span className="min-w-0 flex-1 text-[13px] leading-5 text-[#1A1B25]">{r.name}</span>
            <span className="text-[13px] tabular-nums text-[#217005]">${r.monthly.toLocaleString("en-US")}/mo</span>
            <span className={`w-[74px] rounded border px-1.5 py-0.5 text-center text-[11px] font-medium ${tone[r.status]}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Login({ onSignIn }: { onSignIn: (b: BrandId) => void }) {
  const [email, setEmail] = useState<string | null>(null);
  return (
    <div className="flex min-h-screen bg-white text-[#353A44]" style={{ fontFamily: T.font }}>
      <div className="flex min-h-screen flex-1 flex-col px-6 sm:px-10">
        <header className="flex h-[72px] items-center gap-3">
          <img src="/shiptime-logo.svg" alt="ShipTime" width={120} height={36} className="h-7 w-auto" />
          <span className="rounded border border-[#EBEEF1] px-1.5 py-0.5 text-[11px] font-medium text-[#6A7383]">Demo · sample data</span>
        </header>
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[360px]">
            {email === null ? <SignIn onNext={setEmail} /> : <Choose email={email} onBack={() => setEmail(null)} onPick={onSignIn} />}
          </div>
        </main>
        <footer className="flex h-[64px] flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#8792A2]">
          <span>© 2026 ShipTime</span>
          {["Privacy", "Terms", "Help"].map((x) => <a key={x} href="#" className="hover:text-[#353A44]">{x}</a>)}
        </footer>
      </div>
      <aside className="hidden w-[46%] max-w-[720px] items-center justify-center bg-[#0B1F3A] px-14 lg:flex">
        <WhatsNew />
      </aside>
    </div>
  );
}
