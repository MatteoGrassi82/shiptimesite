import { Truck, Store, Boxes, Plug } from "lucide-react";

// ShipTime Plus integrations grid — carriers + commerce platforms, on the Hana
// design system. Placeholder logos are text lozenges until brand assets land.
const CARRIERS = ["UPS", "FedEx", "Canada Post", "Purolator", "DHL", "GLS", "LTL Freight"];
const PLATFORMS = ["Shopify", "WooCommerce", "BigCommerce", "Magento", "Amazon", "eBay"];

const PILLARS = [
  {
    icon: Truck,
    title: "Every major carrier",
    body: "Parcel and LTL freight from the carriers you already use — negotiated rates and ShipTime Plus rates, side by side.",
  },
  {
    icon: Store,
    title: "Your storefronts",
    body: "Orders flow in from every channel automatically. Labels print, tracking syncs back — no copy-paste.",
  },
  {
    icon: Boxes,
    title: "Your warehouse tools",
    body: "WMS, ERP, and 3PL systems connect over a clean API so shipping data stays in one place.",
  },
  {
    icon: Plug,
    title: "Developer SDK",
    body: "Build rate shopping and label printing straight into your own stack when you need to go deeper.",
  },
];

export function Integrations() {
  return (
    <section id="integrations" className="bg-[#F8FAFB] py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Integrations
          </p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Plugs into everything you <span className="italic">already run</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Connect your carriers, your storefronts, and your back office in a few
            clicks — or key a shipment in by hand and still get every rate.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 text-left"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-4xl space-y-6">
          <LogoRow label="Carriers" items={CARRIERS} />
          <LogoRow label="Commerce platforms" items={PLATFORMS} />
        </div>
      </div>
    </section>
  );
}

function LogoRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {items.map((name) => (
          <span
            key={name}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-slate-600"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
