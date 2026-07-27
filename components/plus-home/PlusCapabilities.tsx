import { ShieldCheck, Globe2, Code2, UserRound } from "lucide-react";

// The 7 Plus capabilities from the strategy deck, packed into 4 (Relume
// Layout 419 sticky-scroll): a pinned framing column on the left while four
// full-height cards pin past it one at a time. Each of the first three cards
// fuses two deck capabilities; #04 is the emphasized account-lead card that
// carries the Core→Plus line and closes the set.
const CAPS = [
  {
    icon: ShieldCheck,
    // ShipAudit + Bring-your-own rates
    title: "Your money back. Your rates kept.",
    body: "ShipAudit catches carrier billing errors automatically and recovers what you're owed — no claims to file. Already negotiated your own contracts? Bring them and run them on the platform. No re-negotiation, no lock-in.",
  },
  {
    icon: Globe2,
    // LTL freight + Cross-border
    title: "Every lane on one account.",
    body: "Pallets and parcels, LTL and small-package — one account, one report. Cross-border to 220+ countries is built in, not bolted on.",
  },
  {
    icon: Code2,
    // Developer API + Branded tracking
    title: "Inside your systems. Under your brand.",
    body: "Rates, labels, and tracking through the developer API — right where your team already works. And every tracking touchpoint carries your brand, not the carrier's.",
  },
];

export function PlusCapabilities() {
  return (
    <section className="bg-[color:var(--muted)]">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — pinned framing */}
        <div>
          <div className="md:sticky md:top-0">
            <div className="flex flex-col items-start md:h-screen md:justify-center">
              <div className="mx-auto w-full max-w-md px-4 py-20 md:px-6 md:py-0">
                <p className="text-sm font-medium uppercase tracking-wider text-primary">
                  ShipTime — Plus
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-foreground md:text-5xl">
                  Seven capabilities that already exist — finally told as{" "}
                  <span className="italic">one story.</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600">
                  The platform you're already paying for, with nothing left in
                  the box unopened.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — full-height sticky cards */}
        <div>
          {CAPS.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="sticky top-0 flex h-screen flex-col justify-center border-t border-border bg-card px-4 py-12 md:px-10"
            >
              <div className="max-w-md">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--st-orange-tint)]">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <span className="font-serif text-lg text-[color:var(--st-blue)]/40">
                    {String(i + 1).padStart(2, "0")} / 04
                  </span>
                </div>
                <h3 className="font-serif text-3xl leading-[1.15] text-foreground md:text-4xl">
                  {title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {body}
                </p>
              </div>
            </div>
          ))}

          {/* 04 — Dedicated account lead: the emphasized blue card that closes
              the set with the Core→Plus line. */}
          <div className="sticky top-0 flex h-screen flex-col justify-center border-t border-[color:var(--st-blue)]/25 bg-[color:var(--st-blue-tint)] px-4 py-12 md:px-10">
            <div className="max-w-md">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white">
                  <UserRound className="size-5 text-[color:var(--st-blue)]" />
                </div>
                <span className="font-serif text-lg text-[color:var(--st-blue)]/50">
                  04 / 04
                </span>
              </div>
              <h3 className="font-serif text-3xl leading-[1.15] text-foreground md:text-4xl">
                One person. Not a queue.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[color:var(--st-blue-deep)] md:text-lg">
                A dedicated account lead who knows your network — not a ticket in
                a queue. The difference between Core and Plus, in a sentence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
