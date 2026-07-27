import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Cta } from "./types";

// Interior-page hero in the Hana design language — the same vocabulary as the
// ported old-homepage sections (components/plus-home/*): uppercase orange
// eyebrow, Instrument Serif headline (pass <span className="italic"> for
// emphasis), slate lead, pill CTAs, and the hero's soft orange/blue wash.
// Centered when there's no visual; split two-column when a mock is passed.
export function PageHero({
  eyebrow,
  heading,
  lead,
  primaryCta,
  secondaryCta,
  visual,
}: {
  eyebrow?: string;
  heading: ReactNode;
  lead?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  visual?: ReactNode;
}) {
  const centered = !visual;
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% -5%, rgba(236,90,38,0.10) 0%, transparent 60%), radial-gradient(50% 40% at 50% 8%, rgba(46,76,143,0.07) 0%, transparent 65%)",
        }}
      />
      <div className="container relative z-10 mx-auto px-4 pt-20 pb-14 md:px-6 md:pt-28 md:pb-20">
        <div className={centered ? "mx-auto max-w-3xl text-center" : "grid items-center gap-12 md:grid-cols-2 lg:gap-16"}>
          <div>
            {eyebrow && (
              <p className="text-sm font-medium uppercase tracking-wider text-primary">{eyebrow}</p>
            )}
            <h1 className="mt-4 font-serif text-5xl leading-[1.02] text-foreground md:text-6xl">
              {heading}
            </h1>
            {lead && (
              <p className={`mt-5 text-lg leading-relaxed text-slate-600 md:text-xl ${centered ? "mx-auto max-w-2xl" : "max-w-xl"}`}>
                {lead}
              </p>
            )}
            {(primaryCta?.label || secondaryCta?.label) && (
              <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${centered ? "items-center justify-center" : "items-start"}`}>
                {primaryCta?.label && (
                  <Link
                    href={primaryCta.href || "#"}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    {primaryCta.label}
                    <ArrowRight className="size-4" />
                  </Link>
                )}
                {secondaryCta?.label && (
                  <Link
                    href={secondaryCta.href || "#"}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            )}
          </div>
          {visual && <div className="min-w-0">{visual}</div>}
        </div>
      </div>
    </section>
  );
}
