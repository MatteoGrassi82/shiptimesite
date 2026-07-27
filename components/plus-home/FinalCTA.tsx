import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

// Final CTA — a light-blue card (not a dark slab), matching the hero's clean
// white/orange language. Copy from the i18n shim.
export function FinalCTA() {
  const t = useTranslations();
  return (
    <section id="get-started" className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[color:var(--st-blue)]/20 bg-[color:var(--st-blue-tint)] px-6 py-16 text-center md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 60% at 50% 0%, rgba(236,90,38,0.08) 0%, transparent 65%)",
            }}
          />
          <h2 className="relative mx-auto max-w-2xl font-serif text-4xl leading-tight text-foreground md:text-5xl">
            Ready to ship <span className="italic">at scale?</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            {t.cta.body}
          </p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/plus/book-a-call"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Book a call
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/plus/assessment"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-white"
            >
              {t.cta.savings}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
