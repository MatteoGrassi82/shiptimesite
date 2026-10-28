"use client";

import { useState, type CSSProperties } from "react";
import { appColor, appUrl, templateOf, valueOf, type TemplateId, type Value } from "./apps";
import { APP_FONT, AppBar, AppScreen } from "./AppScreens";
import { KoherentLogo } from "./brand";
import { scenarios, type BrandId } from "./scenarios";

// ── A Shiplet on its own address ─────────────────────────────────────────────
// What "Open app" opens in a new tab: the customer's app as their team uses
// it, full page, in the customer's colours, nothing of the dashboard around
// it. A thin bar on top says it's the demo of the real address. The screens
// are the same ones the dashboard shows, and the buttons move through them.

export function AppSite({ slug, account, test, settings }: { slug: TemplateId; account: BrandId; test: boolean; settings: Record<string, Value> }) {
  const t = templateOf(slug);
  const sc = scenarios[account];
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(t.signIn[0]);
  const url = `${test ? "sandbox." : ""}${appUrl(sc.account.name, slug)}`;
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB]" style={{ "--app": appColor[account], fontFamily: APP_FONT } as CSSProperties}>
      <div className="flex h-9 items-center gap-3 bg-[#111827] px-4 text-[12px] text-white/75">
        <span className="rounded bg-white/15 px-1.5 py-px text-[11px] font-semibold text-white">Demo</span>
        <span className="truncate">The {t.name} at <b className="font-semibold text-white">{url}</b>{test ? ", sandbox" : ""}</span>
        <span className="ml-auto hidden items-center gap-1.5 sm:inline-flex">A Shiplet by <KoherentLogo size={12} color="#FFFFFF" /></span>
      </div>
      {test && <div className="bg-[#FEF3C7] py-1.5 text-center text-[12px] text-[#92400E]">Sandbox · sample data · labels made here aren&rsquo;t real or charged</div>}
      <AppBar big name={sc.account.name} tabs={t.tabs} step={step} onStep={setStep} role={
        <label className="flex shrink-0 items-center gap-2 text-[12px] text-[#6B7280]">
          <span className="hidden sm:inline">Signed in as</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-md border border-[#E5E7EB] bg-white px-2 py-1 text-[12px] font-medium text-[#111827] outline-none">{t.signIn.map((r) => <option key={r}>{r}</option>)}</select>
        </label>
      } />
      <main className="flex-1 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-[560px] md:[zoom:1.2]">
          <AppScreen t={t.id} step={step} role={role} v={(id) => valueOf(t, settings, id)} account={sc.account.name} prefix={sc.account.initials} next={() => setStep((step + 1) % t.flow.length)} />
        </div>
      </main>
      <footer className="border-t border-[#E5E7EB] bg-white py-3 text-center text-[11px] text-[#9CA3AF]">{sc.account.name} · Powered by Koherent</footer>
    </div>
  );
}
