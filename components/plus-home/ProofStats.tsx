// "How we got here" — the moat. The four numbers now live in the hero (over the
// globe); this section carries the narrative + the $85M focal callout.
export function ProofStats() {
  return (
    <section className="bg-background py-20 md:py-32">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            How we got here
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-foreground md:text-5xl">
            Twenty years, <span className="italic">one thing</span> — done better
            than anyone.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Getting businesses better shipping rates. That focus built the data and
            the carrier relationships underneath everything else.
          </p>
        </div>

        {/* The moat — the focal insight, in a light-blue callout */}
        <div className="mt-10 rounded-2xl border border-[color:var(--st-blue)]/20 bg-[color:var(--st-blue-tint)] px-6 py-6 md:px-10 md:py-8">
          <p className="text-lg leading-relaxed text-[color:var(--st-blue-deep)] md:text-xl">
            A well-funded newcomer raised{" "}
            <span className="font-semibold">$85M</span> to build from zero what we've
            been compounding for twenty years.{" "}
            <span className="text-slate-600">
              The data and the relationships are the part nobody can replicate
              overnight.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
