import {
  Search,
  Printer,
  Radar,
  ReceiptText,
  PackageCheck,
  Boxes,
} from "lucide-react";

// ShipTime Plus workflows grid — the automations that run the busywork.
// Static card grid on the Hana design system (no marquee motion dependency).
const WORKFLOWS = [
  {
    icon: Search,
    title: "Rate shopping",
    body: "Every carrier priced against your negotiated rates on every shipment. The cheapest qualified label wins.",
  },
  {
    icon: Printer,
    title: "Bulk label printing",
    body: "Print hundreds of labels in one pass — pick, pack, and manifest without leaving the screen.",
  },
  {
    icon: Radar,
    title: "Tracking sync",
    body: "Live tracking flows back to every order and storefront automatically. Customers stay informed, you stay hands-off.",
  },
  {
    icon: ReceiptText,
    title: "Invoice audit",
    body: "Carrier invoices checked line by line. Overcharges, phantom surcharges, and late deliveries clawed back automatically.",
  },
  {
    icon: PackageCheck,
    title: "Returns",
    body: "Prepaid and scan-based return labels in a click, with the same rate advantage as outbound.",
  },
  {
    icon: Boxes,
    title: "Multi-warehouse",
    body: "Route each order to the closest stock and the best carrier from that origin — automatically.",
  },
];

export function Workflows() {
  return (
    <section className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Workflows
          </p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Automations that run the <span className="italic">busywork</span>{" "}
            for you
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Rate shopping, label printing, tracking, and billing audits — wired
            together so shipments move without anyone babysitting them.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOWS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-[color:var(--st-orange-tint)]">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
