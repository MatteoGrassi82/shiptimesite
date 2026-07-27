import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import type { Cta } from "./types";

// Reusable interior-page sections for the Plus zone, written in the SAME Hana
// design language as the ported old-homepage sections (components/plus-home/*):
// uppercase orange eyebrows, Instrument Serif headings with italic emphasis,
// slate body copy, rounded-2xl bordered cards, orange-tint icon chips, and the
// light-blue callout/CTA cards. One vocabulary across the whole zone.

const band = (tone: "page" | "surface" | "contrast" | "brand"): CSSProperties => {
  const map = {
    page: { background: "var(--page)", color: "var(--ink)" },
    surface: { background: "var(--surface)", color: "var(--ink)" },
    contrast: { background: "var(--contrast)", color: "var(--on-contrast)" },
    brand: { background: "var(--brand)", color: "var(--on-brand)" },
  } as const;
  return { ...map[tone], padding: "clamp(56px, 8vw, 112px) 0", fontFamily: "var(--font-body)" };
};

// ── Section header (Hana) ──────────────────────────────────────────────
export function SectionHead({
  eyebrow,
  heading,
  lead,
  align = "center",
}: {
  eyebrow?: string;
  heading: ReactNode;
  lead?: string;
  onDark?: boolean;
  align?: "center" | "left";
  maxWidth?: number;
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
      )}
      <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-foreground md:text-5xl">{heading}</h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-slate-600">{lead}</p>}
    </div>
  );
}

// ── Alternating feature rows (text + product mock) ─────────────────────
export type FeatureRow = {
  eyebrow?: string;
  title: string;
  subhead?: string;
  body: string;
  bullets?: string[];
  visual: ReactNode;
};

export function FeatureRows({ rows, tone = "page" }: { rows: FeatureRow[]; tone?: "page" | "surface" }) {
  return (
    <section className={tone === "surface" ? "bg-[#F8FAFB] py-20 md:py-32" : "bg-background py-20 md:py-32"}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-20 md:gap-28">
          {rows.map((r, i) => {
            const textFirst = i % 2 === 0;
            return (
              <Reveal key={r.title} delay={60}>
                <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-20">
                  <div className={textFirst ? "md:order-1" : "md:order-2"}>
                    {r.eyebrow && (
                      <p className="text-sm font-medium uppercase tracking-wider text-primary">{r.eyebrow}</p>
                    )}
                    <h3 className="mt-3 font-serif text-3xl leading-[1.12] text-foreground md:text-4xl">{r.title}</h3>
                    {r.subhead && (
                      <p className="mt-3 font-serif text-lg italic text-[color:var(--st-blue)]">{r.subhead}</p>
                    )}
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">{r.body}</p>
                    {!!r.bullets?.length && (
                      <ul className="mt-5 flex max-w-lg flex-col gap-3">
                        {r.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-600">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--st-orange-tint)]">
                              <Check className="size-3 text-primary" />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className={textFirst ? "md:order-2" : "md:order-1"}>{r.visual}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Stat cards (Hana hero-card style: label, orange bar, serif number) ──
export function StatBand({
  eyebrow,
  heading,
  stats,
}: {
  eyebrow?: string;
  heading?: ReactNode;
  stats: { value: string; label: string }[];
}) {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        {(eyebrow || heading) && (
          <div className="mb-12">
            <SectionHead eyebrow={eyebrow} heading={heading || ""} />
          </div>
        )}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label} delay={40}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 text-left shadow-[0_12px_44px_-18px_rgba(28,30,61,0.28)]">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
                <div className="mt-2 h-[3px] w-9 rounded bg-primary" />
                <div className="mt-4 font-serif text-4xl leading-none text-foreground md:text-5xl">{s.value}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Today vs the designed system ────────────────────────────────────────
export function EdgeCases({
  eyebrow,
  heading,
  lead,
  cases,
  todayLabel = "Today",
  fixLabel = "With Plus",
}: {
  eyebrow?: string;
  heading: ReactNode;
  lead?: string;
  cases: { category: string; today: string; fix: string }[];
  todayLabel?: string;
  fixLabel?: string;
}) {
  return (
    <section className="bg-[#F8FAFB] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHead eyebrow={eyebrow} heading={heading} lead={lead} />
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2">
          {cases.map((c) => (
            <Reveal key={c.category} delay={50}>
              <div className="h-full overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border px-6 py-4">
                  <span className="text-sm font-medium uppercase tracking-wider text-primary">{c.category}</span>
                </div>
                <div className="border-b border-border px-6 py-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{todayLabel}</div>
                  <p className="text-sm leading-relaxed text-slate-500">{c.today}</p>
                </div>
                <div className="bg-[color:var(--st-orange-tint)] px-6 py-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{fixLabel}</div>
                  <p className="text-sm leading-relaxed text-foreground">{c.fix}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Card grid (Workflows-style: orange-tint icon chip, medium title) ────
export function CardGrid({
  eyebrow,
  heading,
  lead,
  tone = "page",
  cards,
}: {
  eyebrow?: string;
  heading?: ReactNode;
  lead?: string;
  tone?: "page" | "surface";
  cards: { title: string; body: string; tag?: string; icon?: ReactNode }[];
}) {
  return (
    <section className={tone === "surface" ? "bg-[#F8FAFB] py-20 md:py-32" : "bg-background py-20 md:py-32"}>
      <div className="container mx-auto px-4 md:px-6">
        {(eyebrow || heading) && <SectionHead eyebrow={eyebrow} heading={heading || ""} lead={lead} />}
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Reveal key={c.title} delay={40}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[color:var(--st-orange-tint)]">
                    {c.icon ?? <span className="size-2.5 rounded-full bg-primary" />}
                  </div>
                  {c.tag && (
                    <span className="rounded-full bg-[color:var(--st-blue-tint)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--st-blue-deep)]">
                      {c.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-medium text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Prose section (short narrative, optional blue-tint callout) ─────────
export function TextSection({
  eyebrow,
  heading,
  children,
  callout,
  tone = "page",
}: {
  eyebrow?: string;
  heading: ReactNode;
  children: ReactNode;
  callout?: ReactNode;
  tone?: "page" | "surface";
}) {
  return (
    <section className={tone === "surface" ? "bg-[#F8FAFB] py-20 md:py-32" : "bg-background py-20 md:py-32"}>
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p className="text-sm font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
          )}
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-foreground md:text-5xl">{heading}</h2>
          <div className="mt-4 text-lg leading-relaxed text-slate-600">{children}</div>
        </div>
        {callout && (
          <div className="mt-10 rounded-2xl border border-[color:var(--st-blue)]/20 bg-[color:var(--st-blue-tint)] px-6 py-6 md:px-10 md:py-8">
            <p className="text-lg leading-relaxed text-[color:var(--st-blue-deep)] md:text-xl">{callout}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Engagement steps (serif "01 /" numbers, PlusCapabilities-style) ─────
export function EngagementSteps({
  eyebrow,
  heading,
  lead,
  steps,
  tone = "surface",
}: {
  eyebrow?: string;
  heading: ReactNode;
  lead?: string;
  steps: { label: string; body: string }[];
  tone?: "page" | "surface";
}) {
  return (
    <section className={tone === "surface" ? "bg-[#F8FAFB] py-20 md:py-32" : "bg-background py-20 md:py-32"}>
      <div className="container mx-auto px-4 md:px-6">
        <SectionHead eyebrow={eyebrow} heading={heading} lead={lead} />
        <div className="mx-auto mt-14 max-w-3xl">
          {steps.map((s, i) => (
            <Reveal key={s.label} delay={40}>
              <div className="flex gap-6 border-t border-border py-8 last:border-b md:gap-10">
                <span className="w-16 shrink-0 font-serif text-2xl leading-none text-[color:var(--st-blue)]/40 md:text-3xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-serif text-2xl leading-tight text-foreground">{s.label}</h3>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-600">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA card (FinalCTA-style light-blue card, not a dark slab) ──────────
export function CtaBand({
  heading,
  body,
  primary,
  secondary,
}: {
  heading: ReactNode;
  body?: string;
  primary?: Cta;
  secondary?: Cta;
  tone?: "contrast" | "brand";
}) {
  const p = primary || { label: "Book a call", href: "/plus/book-a-call" };
  return (
    <section className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[color:var(--st-blue)]/20 bg-[color:var(--st-blue-tint)] px-6 py-16 text-center md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(55% 60% at 50% 0%, rgba(236,90,38,0.08) 0%, transparent 65%)" }}
          />
          <h2 className="relative mx-auto max-w-2xl font-serif text-4xl leading-tight text-foreground md:text-5xl">{heading}</h2>
          {body && <p className="relative mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{body}</p>}
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={p.href || "/plus/book-a-call"}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {p.label}
              <ArrowRight className="size-4" />
            </Link>
            {secondary?.label && (
              <Link
                href={secondary.href || "#"}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-white"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Lozenge strip (Integrations LogoRow style) ──────────────────────────
export function ChipStrip({
  eyebrow,
  heading,
  chips,
}: {
  eyebrow?: string;
  heading: ReactNode;
  chips: { label: string; href: string }[];
  tone?: "page" | "surface";
}) {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          {chips.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { band as plusBand };
