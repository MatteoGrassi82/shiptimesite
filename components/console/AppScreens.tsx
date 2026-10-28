"use client";

import type { CSSProperties, ReactNode } from "react";
import { Bell, Check, CircleCheck, FileText, Lock, Maximize2, Package, Plus, Printer, Search, TriangleAlert, Upload } from "lucide-react";
import type { TemplateId, Value } from "./apps";

// ── A Shiplet as its users see it ────────────────────────────────────────────
// The app runs on the customer's own address and in their colours, so it is
// drawn as their product, not Koherent's: their colour for the logo, buttons
// and selection; plain greys; the system font. Each screen is a real page of
// a working app (a title and one action, a search or filters, a table or a
// form beside a summary), not a form in a box. The screens read the
// template's settings, so changing "$200" changes the page at once. The same
// screens show in the dashboard, full screen, and on the app's own page.

export const APP_FONT = 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const ink = "text-[#111827]", muted = "text-[#6B7280]", line = "border-[#E5E7EB]";

export type ScreenProps = { t: TemplateId; step: number; role: string; v: (id: string) => Value; account: string; prefix: string; next?: () => void };

// ── Parts of a real app page ──

const Page = ({ title, sub, action, children }: { title: ReactNode; sub?: ReactNode; action?: ReactNode; children: ReactNode }) => (
  <>
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div><div className={`text-[18px] font-semibold leading-6 ${ink}`}>{title}</div>{sub && <div className={`mt-0.5 text-[12px] ${muted}`}>{sub}</div>}</div>
      {action}
    </div>
    {children}
  </>
);
const Action = ({ children, next, ghost, small }: { children: ReactNode; next?: () => void; ghost?: boolean; small?: boolean }) => (
  <button type="button" onClick={next} className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md font-semibold transition-opacity hover:opacity-90 ${small ? "h-7 px-2.5 text-[11px]" : "h-8 px-3 text-[12px]"} ${ghost ? `border ${line} bg-white ${ink}` : "text-white"}`} style={ghost ? undefined : { background: "var(--app)" }}>{children}</button>
);
const Btn = ({ children, next, ghost }: { children: ReactNode; next?: () => void; ghost?: boolean }) => (
  <button type="button" onClick={next} className={`mt-4 inline-flex h-9 w-full items-center justify-center rounded-md text-[13px] font-semibold transition-opacity hover:opacity-90 ${ghost ? `border ${line} bg-white ${ink}` : "text-white"}`} style={ghost ? undefined : { background: "var(--app)" }}>{children}</button>
);
const SearchBox = ({ placeholder, value }: { placeholder: string; value?: string }) => <div className={`flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border ${line} bg-white px-2.5 text-[12px] ${value ? ink : muted}`}><Search className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" /><span className="truncate">{value ?? placeholder}</span></div>;
const Chips = ({ items, on = 0 }: { items: string[]; on?: number }) => <div className="flex shrink-0 gap-1">{items.map((x, i) => <span key={x} className={`rounded-md px-2 py-1 text-[11px] font-medium ${i === on ? "text-white" : `bg-[#F3F4F6] ${muted}`}`} style={i === on ? { background: "var(--app)" } : undefined}>{x}</span>)}</div>;
const Toolbar = ({ children }: { children: ReactNode }) => <div className="mb-3 flex flex-wrap items-center gap-2">{children}</div>;
const Field = ({ label, value, flag, hint }: { label: string; value: ReactNode; flag?: boolean; hint?: string }) => <div className="mb-3"><div className={`mb-1 text-[11px] font-medium ${muted}`}>{label}</div><div className={`rounded-md border px-3 py-2 text-[13px] ${ink} ${flag ? "border-[#F5C26B] bg-[#FFF8E6]" : `${line} bg-white`}`}>{value}</div>{hint && <div className={`mt-1 text-[11px] ${muted}`}>{hint}</div>}</div>;
const Box = ({ children, className = "", title, action }: { children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode }) => (
  <div className={`overflow-hidden rounded-lg border ${line} bg-white ${className}`}>
    {title && <div className={`flex items-center justify-between gap-2 border-b ${line} px-3 py-2`}><span className={`min-w-0 truncate text-[12px] font-semibold ${ink}`}>{title}</span>{action}</div>}
    {children}
  </div>
);
const Note = ({ children, tone }: { children: ReactNode; tone?: "warn" | "ok" }) => <div className={`mt-3 flex items-start gap-2 rounded-md px-3 py-2.5 text-[12px] leading-4 ${tone === "warn" ? "bg-[#FFF8E6] text-[#92400E]" : tone === "ok" ? "bg-[#ECFDF3] text-[#166534]" : "bg-[#F3F4F6] text-[#374151]"}`}>{children}</div>;
const Pill = ({ children, tone }: { children: ReactNode; tone?: "warn" | "ok" | "app" | "red" }) => <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${tone === "warn" ? "bg-[#FFF3D6] text-[#92400E]" : tone === "ok" ? "bg-[#DCFCE7] text-[#166534]" : tone === "red" ? "bg-[#FEE2E2] text-[#991B1B]" : tone === "app" ? "text-white" : "bg-[#F3F4F6] text-[#4B5563]"}`} style={tone === "app" ? { background: "var(--app)" } : undefined}>{children}</span>;
const Stats = ({ items }: { items: [string, string, string?, ("warn" | "ok")?][] }) => (
  <div className="mb-4 grid grid-cols-3 gap-2">{items.map(([num, label, delta, tone]) => <div key={label} className={`rounded-lg border ${line} bg-white px-3 py-2.5`}><div className={`text-[20px] font-semibold leading-6 ${tone === "warn" ? "text-[#B45309]" : ink}`}>{num}</div><div className={`flex items-center justify-between gap-2 text-[11px] ${muted}`}><span>{label}</span>{delta && <span className={tone === "warn" ? "text-[#B45309]" : "text-[#166534]"}>{delta}</span>}</div></div>)}</div>
);
type Col = { label: string; w?: string; right?: boolean };
const Table = ({ cols, rows, onRow }: { cols: Col[]; rows: ReactNode[][]; onRow?: () => void }) => {
  const grid = cols.map((c) => c.w ?? "minmax(0,1fr)").join(" ");
  return (
    <div className={`overflow-hidden rounded-lg border ${line} bg-white`}>
      <div className={`grid gap-x-3 border-b ${line} bg-[#F9FAFB] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${muted}`} style={{ gridTemplateColumns: grid }}>{cols.map((c) => <span key={c.label} className={c.right ? "text-right" : ""}>{c.label}</span>)}</div>
      {rows.map((r, i) => <div key={i} onClick={onRow} className={`grid items-center gap-x-3 px-3 py-2 text-[12px] ${ink} ${i < rows.length - 1 ? `border-b ${line}` : ""} ${onRow ? "cursor-pointer hover:bg-[#F9FAFB]" : ""}`} style={{ gridTemplateColumns: grid }}>{r.map((cell, k) => <span key={k} className={`min-w-0 truncate ${cols[k]?.right ? "text-right" : ""}`}>{cell}</span>)}</div>)}
    </div>
  );
};
const Split = ({ main, side }: { main: ReactNode; side: ReactNode }) => <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]"><div className="min-w-0">{main}</div><div className="min-w-0 space-y-3">{side}</div></div>;
const Who = ({ name }: { name: string }) => <span className="inline-flex items-center gap-2"><span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[10px] font-semibold text-[#4B5563]">{name.split(" ").map((w) => w[0]).join("")}</span><span className="truncate">{name}</span></span>;
const Sub = ({ children }: { children: ReactNode }) => <span className={`block text-[11px] ${muted}`}>{children}</span>;
const Radio = ({ on }: { on?: boolean }) => <span className="h-3.5 w-3.5 shrink-0 rounded-full border" style={on ? { borderColor: "var(--app)", borderWidth: 4 } : { borderColor: "#D1D5DB" }} />;
const Done = () => <CircleCheck className="h-4 w-4 shrink-0 text-[#16A34A]" />;
const KV = ({ rows }: { rows: [string, ReactNode][] }) => <dl className="divide-y divide-[#E5E7EB]">{rows.map(([k, val]) => <div key={k} className="flex items-baseline justify-between gap-3 px-3 py-2 text-[12px]"><dt className={`shrink-0 ${muted}`}>{k}</dt><dd className={`min-w-0 text-right font-medium ${ink}`}>{val}</dd></div>)}</dl>;
const Thumb = ({ children }: { children?: ReactNode }) => <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#F3F4F6]">{children ?? <Package className="h-4 w-4 text-[#9CA3AF]" />}</span>;
const list = (v: Value) => v as string[];
const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const andList = (a: string[]) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}`);

export function AppScreen({ t, step, role, v, account, prefix, next }: ScreenProps) {
  const manager = role === "Manager";

  // ── Returns desk ──
  if (t === "returns") {
    const approve = v("approve") as number;
    const choices = list(v("choices"));
    const pick = (x: string) => (choices.includes(x) ? x : choices[0]);
    const rows: [string, string, string, number, string][] = [
      ["Tom Price", "SHP-48177", "Dining chairs ×4 · arrived damaged", 640, pick("Replacement")],
      ["Sam Lee", "SHP-48206", "Wool throw · colour isn't right", 189, pick("Replacement")],
      ["Ana Ruiz", "SHP-48162", "Side table · arrived chipped", 380, pick("Refund")],
      ["Maria Chen", "SHP-48191", "Lamp shade · wrong size", 74, pick("Refund")],
      ["Omar Haddad", "SHP-48150", "Bookshelf · changed my mind", 420, pick("Refund")],
    ];
    const waiting = rows.filter((r) => r[3] > approve).length;
    if (step === 0) return (
      <Page title="Returns" sub={`${account} · ${rows.length + 3} open`} action={<Action next={next}><Plus className="h-3.5 w-3.5" /> Start a return</Action>}>
        <Stats items={[[String(3 + waiting), "Pending", `${waiting} need a manager`, waiting ? "warn" : undefined], ["3", "In process", "2 labels sent"], ["12", "Done this week", "+4 vs last week"]]} />
        <Toolbar><SearchBox placeholder="Search by customer or shipment" /><Chips items={["All", "Pending", "Needs a manager", "Done"]} /></Toolbar>
        <Table cols={[{ label: "Customer", w: "1.1fr" }, { label: "Item", w: "1.6fr" }, { label: "Value", w: "64px", right: true }, { label: "Wants", w: "96px" }, { label: "Status", w: "132px", right: true }]}
          rows={rows.map(([who, shp, what, value, opt]) => [<Who key="w" name={who} />, <><span>{what.split(" · ")[0]}</span><Sub>{shp} · {what.split(" · ")[1]}</Sub></>, `$${value}`, opt,
            value > approve ? (manager ? <Action small next={next}>Approve</Action> : <Pill tone="warn">Manager</Pill>) : who === "Sam Lee" ? <Pill>Waiting on customer</Pill> : <Pill tone="ok">Label sent</Pill>])} />
        {!manager && waiting > 0 && <Note>{waiting} {waiting > 1 ? "returns are" : "return is"} over ${approve} and {waiting > 1 ? "wait" : "waits"} for a manager. They&rsquo;ll see it on their list.</Note>}
      </Page>
    );
    if (step === 1) return (
      <Page title="New return" sub="Start from the shipment that went to the customer.">
        <Split main={<>
          <Field label="Original shipment number" value="SHP-48206" />
          <Box title="Found: Sam Lee, Sacramento, CA" action={<Pill tone="ok">Delivered Oct 15</Pill>}>
            <div className="flex items-center gap-3 px-3 py-2.5"><Thumb /><span className="min-w-0 flex-1"><span className={`block text-[13px] font-medium ${ink}`}>Wool throw, grey</span><Sub>1 × $189 · UPS Ground · 1Z84…7731</Sub></span><span className={`text-[13px] font-semibold ${ink}`}>$189.00</span></div>
          </Box>
          <div className="mt-3"><Field label="Reason (optional)" value={<span className={muted}>Sam can tell us from the link</span>} /></div>
          <Btn next={next}>Send Sam the return link</Btn>
          <div className={`mt-2 text-center text-[11px] ${muted}`}>By {list(v("link")).join(" and ").toLowerCase()}</div>
        </>} side={<>
          <Box title="What applies"><KV rows={[["Return window", <span key="w" className="text-[#166534]">Inside {v("window") as number} days</span>], ["Return shipping", v("pays") === "You" ? "Free for Sam" : "$9.80, off the refund"], ["Manager approval", 189 > approve ? "Needed" : `Not under $${approve}`], ["Sam can choose", andList(choices)]]} /></Box>
        </>} />
      </Page>
    );
    return (
      <div className="mx-auto max-w-[480px]">
        <div className="mb-4 text-center"><div className={`text-[18px] font-semibold ${ink}`}>Tell us about your return</div><div className={`text-[12px] ${muted}`}>Order {prefix}-10482 · Wool throw, grey · $189</div></div>
        <Field label="Why are you sending it back?" value="The colour isn't right." />
        <div className={`mb-1.5 text-[11px] font-medium ${muted}`}>What would you like?</div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${choices.length}, minmax(0,1fr))` }}>{choices.map((x) => <span key={x} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-[12px] ${x === pick("Replacement") ? `font-semibold ${ink}` : `${line} ${muted}`}`} style={x === pick("Replacement") ? { borderColor: "var(--app)", boxShadow: "inset 0 0 0 1px var(--app)" } : undefined}><Radio on={x === pick("Replacement")} />{x}</span>)}</div>
        <Note tone={v("pays") === "You" ? "ok" : undefined}>{v("pays") === "You" ? "Return shipping is free. We'll send you the label." : "Return shipping is $9.80. It comes off your refund."}</Note>
        <Btn next={next}>Send</Btn>
        <div className={`mt-2 text-center text-[11px] ${muted}`}>You&rsquo;ll get the label and updates by {list(v("link")).join(" and ").toLowerCase()}.</div>
      </div>
    );
  }

  // ── Customs check ──
  if (t === "customs") {
    const cur = v("currency") as string;
    const hold = v("hold") as number;
    const needsManager = v("codes") === "A manager";
    const service = v("service") === "The cheapest in 5 days" ? "Purolator Ground" : (v("service") as string);
    if (step === 0) return (
      <Page title="Canadian orders" sub="Check them before they leave the warehouse." action={<Action next={next}>Check an order</Action>}>
        <Stats items={[["7", "To check today"], ["1", "Missing a code", "fix before 2 pm", "warn"], ["42", "Shipped this week", "0 held at the border"]]} />
        <Toolbar><SearchBox placeholder="Order number or customer" /><Chips items={["Needs a fix", "Ready", "Shipped"]} /></Toolbar>
        <Table cols={[{ label: "Order", w: "1.2fr" }, { label: "Items", w: "60px" }, { label: "Value", w: "84px", right: true }, { label: "Issues", w: "1.2fr" }, { label: "Status", w: "120px", right: true }]} onRow={next}
          rows={[
            [<><span>#{prefix}-58810</span><Sub>Ottawa, ON · J. Tremblay</Sub></>, "3", `${cur}${money(248)}`, <span key="i" className="flex items-center gap-1 text-[#B45309]"><TriangleAlert className="h-3.5 w-3.5" /> 1 missing HS code</span>, <Pill key="s" tone="warn">Needs a fix</Pill>],
            [<><span>#{prefix}-58804</span><Sub>Calgary, AB · R. Singh</Sub></>, "2", `${cur}${money(131)}`, <span key="i" className={muted}>None</span>, <Pill key="s" tone="ok">Ready</Pill>],
            [<><span>#{prefix}-58799</span><Sub>Montréal, QC · Boutique Nord</Sub></>, "14", `${cur}${money(3120)}`, 3120 > hold ? <span key="i">Over {cur}{hold.toLocaleString("en-US")}</span> : <span key="i" className={muted}>None</span>, 3120 > hold ? <Pill key="s">Waiting for a manager</Pill> : <Pill key="s" tone="ok">Ready</Pill>],
            [<><span>#{prefix}-58791</span><Sub>Vancouver, BC · A. Wong</Sub></>, "1", `${cur}${money(89)}`, <span key="i" className={muted}>None</span>, <Pill key="s" tone="ok">Shipped</Pill>],
          ]} />
      </Page>
    );
    if (step === 1) return (
      <Page title={`Fix #${prefix}-58810`} sub="Ottawa, ON · 3 items · 1 to fix" action={<Action ghost next={next}>Skip for now</Action>}>
        <Split main={<>
          <Box>
            <div className={`flex items-center gap-3 border-b ${line} px-3 py-2`}><Thumb /><span className={`flex-1 text-[12px] ${ink}`}>Trail jacket, size M</span><span className={`text-[11px] ${muted}`}>6201.40 · Vietnam</span><Done /></div>
            <div className={`flex items-center gap-3 border-b ${line} px-3 py-2`}><Thumb /><span className={`flex-1 text-[12px] ${ink}`}>Fleece hat</span><span className={`text-[11px] ${muted}`}>6505.00 · Canada</span><Done /></div>
            <div className="flex items-center gap-3 bg-[#FFF8E6] px-3 py-2"><Thumb /><span className={`flex-1 text-[12px] ${ink}`}>Merino socks ×2</span><span className="text-[11px] font-medium text-[#B45309]">No HS code</span><TriangleAlert className="h-4 w-4 text-[#B45309]" /></div>
          </Box>
          <div className="mt-3 grid grid-cols-2 gap-3"><Field label="HS code for Merino socks" value="6115.95" flag hint="Suggested from the product name" /><Field label="Country of origin" value="Canada" /></div>
          {needsManager && !manager && <Note>A manager approves new HS codes. You can still make the paperwork.</Note>}
          <Btn next={next}>{needsManager && manager ? "Approve the code and make the paperwork" : "Make the paperwork"}</Btn>
        </>} side={<>
          <Box title="Duties and taxes"><div className="px-3 py-2.5"><div className={`text-[20px] font-semibold ${ink}`}>{cur}18.40</div><Sub>{v("duties") === "You" ? `Paid by ${account}. Nothing to pay at the door.` : "The customer pays this at the door."}</Sub></div></Box>
          <Box title="Shipment"><KV rows={[["To", "Ottawa, ON"], ["Weight", "1.4 kg"], ["Service", service], ["Arrives", "Tue"]]} /></Box>
        </>} />
      </Page>
    );
    return (
      <Page title="Ready to ship" sub={`Order #${prefix}-58810 to Ottawa, ON`} action={<Action next={next}><Printer className="h-3.5 w-3.5" /> Print both</Action>}>
        <Split main={<>
          <Box title="Paperwork">
            <div className={`flex items-center gap-3 border-b ${line} px-3 py-2.5`}><FileText className="h-4 w-4 text-[#6B7280]" /><span className={`flex-1 text-[12px] ${ink}`}>Commercial invoice</span><span className={`text-[11px] ${muted}`}>PDF · 1 page</span></div>
            <div className="flex items-center gap-3 px-3 py-2.5"><Package className="h-4 w-4 text-[#6B7280]" /><span className={`min-w-0 flex-1 truncate text-[12px] ${ink}`}>Label, {service}</span><span className={`text-[11px] ${muted}`}>4 × 6 in</span></div>
          </Box>
          <ol className="mt-4 space-y-2">{["Checked", "Paperwork made", "Printed", "Tracking emailed to the customer"].map((x, i) => <li key={x} className={`flex items-center gap-2 text-[12px] ${i < 2 ? ink : muted}`}>{i < 2 ? <Done /> : <span className="h-4 w-4 rounded-full border border-[#D1D5DB]" />}{x}</li>)}</ol>
        </>} side={<Box title="Shipment"><KV rows={[["Items", "3"], ["Duties", `${cur}18.40`], ["Service", service], ["Arrives", "Tue, Oct 27"]]} /></Box>} />
      </Page>
    );
  }

  // ── Store counter ──
  if (t === "counter") {
    const count = Number(v("count"));
    const byDay = v("sort") === "Arrival day";
    const all: [string, string, number, number][] = [["Regional carrier", "Mon", 1, 14.2], ["UPS Ground", "Tue", 2, 19.8], ["FedEx Ground", "Tue", 2, 21.1], ["USPS Ground Advantage", "Wed", 3, 22.4], ["UPS 2nd Day Air", "Mon", 1, 48.6]];
    const shown = [...all].sort((a, b) => (byDay ? a[2] - b[2] || a[3] - b[3] : a[3] - b[3])).slice(0, count);
    const freight = 38 > (v("freight") as number);
    const today = <Box title={manager ? "Today, all stores" : "Today at store 14"}><KV rows={manager ? [["Labels", "112"], ["Spend", "$1,842.60"], ["Busiest", "Store 3, Scottsdale"]] : [["Labels", "6"], ["Spend", "$92.40"], ["Printer", <span key="p" className="text-[#166534]">Counter 2, ready</span>]]} /></Box>;
    if (step === 0) return (
      <Page title="Ship from the store" sub={manager ? "Store 14, Mesa · or pick another store" : "Store 14, Mesa"}>
        <Split main={<>
          <Toolbar><SearchBox placeholder="Order number or customer name" value="#SH-30417, Sam Lee" /></Toolbar>
          <Box title="Order #SH-30417" action={<Pill>Paid in store, 10:12 am</Pill>}>
            <div className={`flex items-center gap-3 border-b ${line} px-3 py-2.5`}><Thumb /><span className="min-w-0 flex-1"><span className={`block text-[13px] font-medium ${ink}`}>Patio heater, bronze</span><Sub>38 lb · 24 × 18 × 18 in</Sub></span><span className={`text-[13px] font-semibold ${ink}`}>$249.00</span></div>
            <KV rows={[["Deliver to", "Sam Lee, 1180 E Main St, Tucson, AZ"], ["Box", "Large · 38 lb"]]} />
          </Box>
          {freight && <Note>Over {v("freight") as number} lb: this one goes as freight.</Note>}
          <Btn next={next}>Get the best options</Btn>
        </>} side={today} />
      </Page>
    );
    if (step === 1) return (
      <Page title="Pick how it ships" sub={`The ${count} best, by ${byDay ? "arrival day" : "price"}, at your rates.`}>
        <Split main={<>
          <div className="space-y-2">{shown.map(([name, day, , price], i) => (
            <div key={name} className="flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5" style={i === 0 ? { borderColor: "var(--app)", boxShadow: "inset 0 0 0 1px var(--app)" } : { borderColor: "#E5E7EB" }}>
              <Radio on={i === 0} /><span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#F3F4F6] text-[10px] font-bold text-[#4B5563]">{name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span><span className="min-w-0 flex-1"><span className={`block text-[13px] font-medium ${ink}`}>{name}</span><Sub>Arrives {day}</Sub></span>{i === 0 && <Pill tone="ok">{byDay ? "Fastest" : "Cheapest"}</Pill>}<span className={`text-[13px] font-semibold ${ink}`}>${money(price)}</span>
            </div>
          ))}</div>
          <Btn next={next}>Print the label</Btn>
        </>} side={<Box title="Shipment"><KV rows={[["Order", "#SH-30417"], ["To", "Tucson, AZ"], ["Box", "Large · 38 lb"], ["Customer hears by", list(v("notify")).join(" and ").toLowerCase()]]} /></Box>} />
      </Page>
    );
    return (
      <Page title="Label printed" sub={`Counter printer 2 · ${shown[0][0]} · arrives ${shown[0][1]}`} action={<Action ghost next={next}>Ship another</Action>}>
        <Split main={<>
          <Box>
            <div className="flex items-center gap-3 px-3 py-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#DCFCE7]"><Check className="h-5 w-5 text-[#16A34A]" /></span><span className="min-w-0 flex-1"><span className={`block text-[13px] font-medium ${ink}`}>Sam Lee · #SH-30417</span><Sub>Tracking 1Z84A2…7731 · ${money(shown[0][3])}</Sub></span><Pill tone="ok">Label created</Pill></div>
          </Box>
          <Note tone="ok">Sam gets the tracking link by {list(v("notify")).join(" and ").toLowerCase()}.</Note>
        </>} side={today} />
      </Page>
    );
  }

  // ── Sales quote calculator ──
  if (t === "quote") {
    const markup = 1 + (v("markup") as number) / 100;
    const all: [string, string, number, string?][] = [["Canada Post Expedited", "Tue", 38.4, "Cheapest"], ["Purolator Express", "Mon", 61.2, "Fastest"], ["UPS Standard", "Tue", 44.1], ["FedEx Ground", "Wed", 46.85], ["Loomis Express", "Tue", 52.3]];
    const shown = v("show") === "Every carrier" ? all : all.slice(0, 2);
    const salesManager = role === "Sales manager";
    const recent = <Box title="Recent quotes"><div className="divide-y divide-[#E5E7EB]">{[["Lumen Studio", "$112.80", "Became an order"], ["Northside Run", "$64.10", "Expired"]].map(([w, a, s]) => <div key={w} className="flex items-center justify-between gap-2 px-3 py-2 text-[12px]"><span className="min-w-0"><span className={`block truncate ${ink}`}>{w}</span><Sub>{s}</Sub></span><span className={`font-medium ${ink}`}>{a}</span></div>)}</div></Box>;
    if (step === 0) return (
      <Page title="New quote" sub="For a customer who's still on the phone.">
        <Split main={<>
          <Field label="Ship to" value="Harbor Coffee · 41 Pier St, Halifax, NS B3J 2R7" />
          <Box title="Boxes" action={<Action small ghost><Plus className="h-3 w-3" /> Add a box</Action>}>
            <Table cols={[{ label: "Box" }, { label: "Weight", w: "72px", right: true }, { label: "Size", w: "110px", right: true }]} rows={[["Box 1", "18 lb", "16 × 12 × 10 in"], ["Box 2", "18 lb", "16 × 12 × 10 in"]]} />
          </Box>
          <Btn next={next}>See the rates</Btn>
        </>} side={recent} />
      </Page>
    );
    if (step === 1) return (
      <Page title="Rates to Halifax, NS" sub="2 boxes · 36 lb · from Columbus, OH">
        <Split main={<>
          <div className="space-y-2">{shown.map(([name, day, price, tag], i) => (
            <div key={name} className="flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5" style={i === 0 ? { borderColor: "var(--app)", boxShadow: "inset 0 0 0 1px var(--app)" } : { borderColor: "#E5E7EB" }}>
              <Radio on={i === 0} /><span className="min-w-0 flex-1"><span className={`block text-[13px] font-medium ${ink}`}>{name}</span><Sub>Arrives {day}{salesManager && ` · your cost $${money(price)}`}</Sub></span>{tag && <Pill tone={tag === "Cheapest" ? "ok" : undefined}>{tag}</Pill>}<span className={`text-[13px] font-semibold ${ink}`}>${money(price * markup)}</span>
            </div>
          ))}</div>
          <Btn next={next}>Send the quote</Btn>
        </>} side={<Box title="Quote"><KV rows={[["Customer", "Harbor Coffee"], ["Good for", v("valid") as string], ["Sent as", andList(list(v("send")))], ["Markup", `${v("markup") as number}%`]]} /></Box>} />
      </Page>
    );
    return (
      <Page title="Quotes" sub={salesManager ? "Every rep, this month" : "Yours, this month"} action={<Action next={next}><Plus className="h-3.5 w-3.5" /> New quote</Action>}>
        <Stats items={[["23", "Quotes this month", "+5 vs September"], ["41%", "Became orders", "+6 pts"], ["$58", "Average shipping"]]} />
        <Toolbar><SearchBox placeholder="Customer or rep" /><Chips items={["All", "Sent", "Ordered", "Expired"]} /></Toolbar>
        <Table cols={[{ label: "Customer", w: "1.3fr" }, { label: "Rep", w: "1fr" }, { label: "Amount", w: "80px", right: true }, { label: "Sent", w: "72px" }, { label: "Status", w: "132px", right: true }]}
          rows={[["Harbor Coffee", <Who key="r" name="Priya Nair" />, `$${money(38.4 * markup)}`, "Today", <Pill key="s">Sent</Pill>], ["Lumen Studio", <Who key="r" name="Dev Patel" />, `$${money(112.8 * markup)}`, "Mon", <Pill key="s" tone="ok">Became an order</Pill>], ["Northside Run", <Who key="r" name="Priya Nair" />, `$${money(64.1 * markup)}`, "Oct 14", <Pill key="s">Expired</Pill>], ["Bayside Grocers", <Who key="r" name="Dev Patel" />, `$${money(203.5 * markup)}`, "Oct 12", <Pill key="s" tone="ok">Became an order</Pill>]]} />
      </Page>
    );
  }

  // ── Today's shipments ──
  if (t === "today") {
    const late = v("late") as number;
    const lateFirst = v("order") === "Late ones";
    const rows: [string, string, string, string, string, boolean][] = [["SHP-48102", "UPS", "1Z84…4410", "Tom Price, Boise, ID", `Not delivered after ${late + 1} days`, true], ["SHP-48213", "Canada Post", "7302…1188", "J. Tremblay, Ottawa, ON", "Label created", false], ["SHP-48211", "FedEx", "7794…0213", "Ana Ruiz, Denver, CO", "In transit", false], ["SHP-48097", "UPS", "1Z84…3392", "Maria Chen, Denver, CO", `Not delivered after ${late + 2} days`, true], ["SHP-48209", "Purolator", "3290…5521", "Boutique Nord, Montréal", "Delivered 9:40 am", false]];
    const sorted = lateFirst ? [...rows].sort((a, b) => Number(b[5]) - Number(a[5])) : rows;
    if (step === 0) return (
      <Page title="Today · Thu, Oct 22" sub={v("email") === "Off" ? "Updated 10:40 am from carrier scans" : `Updated 10:40 am · also emailed at ${v("email") as string}`}>
        <Stats items={[["84", "Shipped today", "+9 vs yesterday"], ["412", "This week", "96% on time"], ["3", "Late", `over ${late} days`, "warn"]]} />
        <Toolbar><SearchBox placeholder="Shipment, tracking or customer" /><Chips items={["All", "Late", "In transit", "Delivered"]} /></Toolbar>
        <Table cols={[{ label: "Shipment", w: "1fr" }, { label: "Carrier", w: "90px" }, { label: "To", w: "1.4fr" }, { label: "Status", w: "180px", right: true }]} onRow={next}
          rows={sorted.map(([id, carrier, track, to, state, isLate]) => [<><span>{id}</span><Sub>{track}</Sub></>, carrier, to, <Pill key="s" tone={isLate ? "warn" : state.startsWith("Delivered") ? "ok" : undefined}>{state}</Pill>])} />
      </Page>
    );
    if (step === 1) {
      const days: [string, number][] = [["Fri", 71], ["Sat", 12], ["Sun", 0], ["Mon", 88], ["Tue", 79], ["Wed", 78], ["Thu", 84]];
      return (
        <Page title="This week" sub="Fri, Oct 16 to Thu, Oct 22 · 412 shipments">
          <Split main={<Box title="Shipments by day"><div className="p-4"><div className="flex h-[120px] items-end gap-2">{days.map(([d, c]) => <div key={d} className="flex flex-1 flex-col items-center gap-1"><span className={`text-[10px] ${muted}`}>{c || ""}</span><div className="w-full rounded-t" style={{ height: `${(c / 88) * 88 + 2}px`, background: "var(--app)", opacity: d === "Thu" ? 1 : 0.5 }} /><span className={`text-[10px] ${muted}`}>{d}</span></div>)}</div></div></Box>}
            side={<Box title="By carrier"><KV rows={[["UPS", "168 · 97% on time"], ["Canada Post", "131 · 94%"], ["FedEx", "113 · 96%"]]} /></Box>} />
          <Btn ghost next={next}>Follow up on 3 late</Btn>
        </Page>
      );
    }
    return (
      <Page title="Follow up" sub={`Not delivered after ${late} days · before the customer calls`}>
        <Table cols={[{ label: "Shipment", w: "1fr" }, { label: "Customer", w: "1.3fr" }, { label: "Late by", w: "72px" }, { label: "Owner", w: "120px", right: true }]}
          rows={[["SHP-48097", "Maria Chen, Denver", "5 days", <Pill key="o">With Ana</Pill>], ["SHP-48102", "Tom Price, Boise", "4 days", <Action key="o" small ghost next={next}>{role === "Customer service" ? "I'll take it" : "Assign"}</Action>], ["SHP-48088", "Sam Lee, Tucson", `${late} days`, <Action key="o" small ghost next={next}>{role === "Customer service" ? "I'll take it" : "Assign"}</Action>]]} />
        <Note>The carrier&rsquo;s claim window opens after 7 days; these are still inside it.</Note>
      </Page>
    );
  }

  // ── Wholesale order splitter ──
  if (t === "splitter") {
    const max = Math.max(1, v("max") as number);
    const cartons = (units: number) => Math.ceil(units / max);
    const n = cartons(84);
    if (step === 0) return (
      <Page title="Orders to split" sub={`Wholesale orders over ${max} units, not yet labelled`}>
        <Toolbar><SearchBox placeholder="Order or store" /><Chips items={["To split", "Labelled", "Picked up"]} /></Toolbar>
        <Table cols={[{ label: "Order", w: "1fr" }, { label: "Store", w: "1.3fr" }, { label: "Units", w: "60px", right: true }, { label: "Cartons", w: "72px", right: true }, { label: "Due", w: "100px", right: true }]} onRow={next}
          rows={([["#W-2302", "Corner Market, Tempe", 84, "Thu"], ["#W-2306", "Bayside Grocers, Mesa", 46, "Fri"], ["#W-2309", "The Pantry, Chandler", 31, "Fri"]] as [string, string, number, string][]).filter(([, , u]) => u > max).map(([o, who, u, due], i) => [o, who, String(u), String(cartons(u)), <Pill key="d" tone={i === 0 ? "app" : undefined}>{due}</Pill>])} />
        <Btn next={next}>Split #W-2302</Btn>
      </Page>
    );
    if (step === 1) {
      const fragile = Math.min(max, 24), heavy = Math.min(max, 18);
      const rest = Math.max(0, 84 - fragile - heavy);
      const boxes: [string, number, string][] = [["Jam jars", fragile, "Fragile"], ["Cast-iron pans", heavy, `Heavy, over ${v("heavy") as number} lb`], ["Granola, honey, tea", rest, ""]];
      return (
        <Page title={`#W-2302 · ${n} cartons`} sub="84 units · Corner Market, Tempe" action={<Action ghost next={next}>Undo the split</Action>}>
          <Split main={<>
            <div className="grid grid-cols-3 gap-2">{boxes.map(([what, units, tag], i) => <div key={what} className={`rounded-lg border ${line} bg-white p-3`}><div className={`text-[11px] ${muted}`}>Carton {i + 1}{i === 2 && n > 3 ? `–${n}` : ""}</div><div className={`mt-1 text-[18px] font-semibold ${ink}`}>{units}</div><div className={`text-[11px] ${muted}`}>units · {what}</div>{tag && <div className="mt-2"><Pill tone="warn">{tag}</Pill></div>}</div>)}</div>
            <Btn next={next}>Buy {n} labels</Btn>
          </>} side={<Box title="Rules applied"><ul className="divide-y divide-[#E5E7EB]">{[`No carton over ${max} units`, "Fragile kept apart", `Heavy over ${v("heavy") as number} lb kept apart`, v("pickup") === "One per store" ? "One pickup for the store" : "A pickup per carton"].map((r) => <li key={r} className={`flex items-center gap-2 px-3 py-2 text-[12px] ${ink}`}><Done />{r}</li>)}</ul></Box>} />
        </Page>
      );
    }
    return (
      <Page title="Labels bought" sub={`${n} cartons · ${v("pickup") === "One per store" ? "one pickup, Thu 2 pm" : `${n} pickups, Thu`}`} action={<Action next={next}><Printer className="h-3.5 w-3.5" /> Print labels and slips</Action>}>
        <Table cols={[{ label: "Carton", w: "90px" }, { label: "Contents", w: "1.5fr" }, { label: "Weight", w: "72px", right: true }, { label: "Label", w: "110px" }, { label: "Slip", w: "60px", right: true }]}
          rows={Array.from({ length: Math.min(n, 4) }, (_, i) => [`Carton ${i + 1}`, i === 0 ? "Jam jars" : i === 1 ? "Cast-iron pans" : "Granola, honey, tea", i === 1 ? "41 lb" : "22 lb", <span key="l" className={muted}>1Z84…{7731 + i}</span>, <Done key="d" />])} />
        {n > 4 && <div className={`mt-2 text-[12px] ${muted}`}>and {n - 4} more</div>}
      </Page>
    );
  }

  // ── Dental lab cases ──
  if (t === "dental") {
    const lab = role === "Lab staff";
    if (step === 0) return (
      <Page title={lab ? "Pickups booked today" : "Book a case pickup"} sub={lab ? "By clinics, for collection today" : "Bright Smile Dental · Scottsdale"}>
        {lab ? (
          <Table cols={[{ label: "Case", w: "1fr" }, { label: "Clinic", w: "1.4fr" }, { label: "Appointment", w: "120px" }, { label: "Pickup", w: "110px", right: true }]} onRow={next}
            rows={[["C-4418 · crown", "Bright Smile Dental", "Thu, Nov 5", <Pill key="p" tone="ok">Today, 3 pm</Pill>], ["C-4419 · bridge", "Lakeview Dental", "Fri, Nov 6", <Pill key="p" tone="ok">Today, 3 pm</Pill>], ["C-4420 · night guard", "Mesa Family Dental", "Mon, Nov 9", <Pill key="p">Tomorrow</Pill>]]} />
        ) : (
          <Split main={<>
            <div className="grid grid-cols-2 gap-3"><Field label="Case number" value="C-4418" /><Field label="Type" value="Crown, upper left" /></div>
            <Field label="Patient's appointment" value="Thu, Nov 5, 9:30 am" hint="We bring it back in time for this." />
            <Note tone="ok"><Check className="mt-px h-3.5 w-3.5 shrink-0" />Booked before {v("cutoff") as string}, so it&rsquo;s picked up today.</Note>
            <Btn next={next}>Book the pickup</Btn>
          </>} side={<>
            {v("box") === "The lab sends prepaid boxes" && <Box title="Prepaid boxes"><KV rows={[["Left", "3"], ["More", "On the way, Fri"]]} /></Box>}
            <Box title="Your cases"><KV rows={[["In work", "2"], ["Due back", "Fri, Oct 23"]]} /></Box>
          </>} />
        )}
      </Page>
    );
    if (step === 1) return (
      <Page title="Cases" sub="Today at the lab" action={<Action ghost next={next}>Send one back</Action>}>
        <Stats items={[["6", "Arriving"], ["14", "In work"], ["4", "Due back", "1 today", "warn"]]} />
        <Toolbar><SearchBox placeholder="Case or clinic" /><Chips items={["All", "Arriving", "In work", "Due back"]} /></Toolbar>
        <Table cols={[{ label: "Case", w: "1fr" }, { label: "Clinic", w: "1.4fr" }, { label: "Appointment", w: "110px" }, { label: "Status", w: "140px", right: true }]} onRow={next}
          rows={[["C-4402 · bridge", "Lakeview Dental", "Fri, Oct 23", <Pill key="s" tone="warn">Due back today</Pill>], ["C-4418 · crown", "Bright Smile Dental", "Thu, Nov 5", <Pill key="s">Arriving today</Pill>], ["C-4391 · night guard", "Mesa Family Dental", "Tue, Oct 27", <Pill key="s">In work, due Mon</Pill>], ["C-4388 · veneers ×4", "Lakeview Dental", "Wed, Oct 28", <Pill key="s">In work</Pill>]]} />
      </Page>
    );
    return (
      <Page title="Send C-4402 back" sub="Bridge · Lakeview Dental · appointment Fri, Oct 23, 10:00 am" action={<Action next={next}><Printer className="h-3.5 w-3.5" /> Print the label</Action>}>
        <Split main={<>
          <div className="flex items-center gap-3 rounded-lg border bg-white px-3 py-2.5" style={{ borderColor: "var(--app)", boxShadow: "inset 0 0 0 1px var(--app)" }}><Radio on /><span className="min-w-0 flex-1"><span className={`block text-[13px] font-medium ${ink}`}>Overnight, arrives Thu by 10:30 am</span><Sub>{v("early") === "1 business day" ? "One business day" : "Two business days"} before the appointment</Sub></span><Pill tone="ok">On time</Pill><span className={`text-[13px] font-semibold ${ink}`}>$14.60</span></div>
          <Note>Patient names never leave the lab. The label shows the case number only.</Note>
          <div className={`mt-2 text-[11px] ${muted}`}>Lakeview hears by {list(v("notify")).join(" and ").toLowerCase()}.</div>
        </>} side={<Box title="Lakeview Dental"><KV rows={[["Address", "2210 N Scottsdale Rd"], ["Contact", "Dr. Elena Ortiz"], ["Cases this month", "9"]]} /></Box>} />
      </Page>
    );
  }

  // ── Print shop jobs ──
  const customer = role === "Customer";
  const fastest = v("pick") === "The fastest";
  const each = fastest ? 11.4 : 6.1;
  if (step === 0) return customer ? (
    <Page title="Send us your address list" sub="Northside Run · 120 race kits · due Mon">
      <Split main={<>
        <div className="flex flex-col items-center rounded-lg border border-dashed border-[#D1D5DB] bg-white px-4 py-8 text-center"><Upload className="h-6 w-6 text-[#9CA3AF]" /><div className={`mt-2 text-[13px] font-medium ${ink}`}>Drop your list here</div><Sub>{v("lists") === "CSV only" ? "CSV" : "CSV or Excel"} · one address per row</Sub></div>
        <Btn next={next}>Upload</Btn>
      </>} side={<Box title="Your jobs"><KV rows={[["J-1190 · race kits", "Ready to ship"], ["J-1174 · posters", "Delivered Oct 9"]]} /></Box>} />
    </Page>
  ) : (
    <Page title="Ready to ship" sub="Off the press today." action={<Action next={next}>Ship J-1190</Action>}>
      <Toolbar><SearchBox placeholder="Job or customer" /><Chips items={["Ready", "Shipped", "Delivered"]} /></Toolbar>
      <Table cols={[{ label: "Job", w: "1fr" }, { label: "Customer", w: "1.1fr" }, { label: "What", w: "1.1fr" }, { label: "Addresses", w: "80px", right: true }, { label: "Due", w: "80px", right: true }]} onRow={next}
        rows={[["J-1190", "Northside Run", "120 race kits", "118", <Pill key="d" tone="app">Mon</Pill>], ["J-1187", "Harbor Coffee", "400 menus", "1", <Pill key="d">Fri</Pill>], ["J-1192", "Lumen Studio", "60 posters", "1", <Pill key="d">Thu</Pill>]]} />
      {v("photo") === "On" && <Note>Take a photo of each job before it ships.</Note>}
    </Page>
  );
  if (step === 1) return (
    <Page title="Split J-1190 to 118 addresses" sub="Northside Run · 120 race kits">
      <Split main={<>
        <Field label="Address list" value={<span className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-[#6B7280]" />runners{v("lists") === "CSV only" ? ".csv" : ".xlsx"} · 118 addresses</span>} />
        <Box title={fastest ? "2-day, arrives Thu" : "Ground, arrives Fri"} action={<Pill tone="ok">{fastest ? "The fastest" : "Cheapest that's on time"}</Pill>}><KV rows={[["Per parcel", `$${money(each)}`], ["118 parcels", `$${money(each * 118)}`]]} /></Box>
        <Btn next={next}>Make 118 labels</Btn>
      </>} side={<Box title="2 addresses to fix"><div className="divide-y divide-[#E5E7EB]">{[["Row 41 · M. Okafor", "No postal code"], ["Row 97 · T. Nguyen", "No postal code"]].map(([w, why]) => <div key={w} className="px-3 py-2 text-[12px]"><span className={`block ${ink}`}>{w}</span><span className="text-[#B45309]">{why}</span></div>)}</div><div className={`border-t ${line} px-3 py-2 text-[11px] ${muted}`}>Fix them, or ship 116 now.</div></Box>} />
    </Page>
  );
  return (
    <Page title="Northside Run · race kits" sub="Job J-1190 · 118 parcels · shipped Tue">
      <Stats items={[["64", "Delivered"], ["52", "On the way", "arrive today"], ["2", "Need a fix", undefined, "warn"]]} />
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#E5E7EB]"><div className="h-full rounded-full" style={{ width: "54%", background: "var(--app)" }} /></div>
      <Table cols={[{ label: "Parcel", w: "90px" }, { label: "To", w: "1.4fr" }, { label: "Status", w: "140px", right: true }]}
        rows={[["#41", "M. Okafor, Portland", <Pill key="s" tone="warn">Needs a fix</Pill>], ["#1", "A. Rivera, Seattle", <Pill key="s" tone="ok">Delivered</Pill>], ["#2", "K. Sato, Tacoma", <Pill key="s" tone="ok">Delivered</Pill>], ["#3", "J. Brown, Spokane", <Pill key="s">On the way</Pill>]]} />
      <Note>{v("cost") === "In the price" ? "Shipping is included in your price." : `Shipping, $${money(each * 118)}, is added to your invoice.`}</Note>
    </Page>
  );
}

// ── The app's own bar: their logo, their menu, who's signed in ──

export function AppBar({ name, tabs, step, onStep, role, big }: { name: string; tabs: string[]; step: number; onStep?: (i: number) => void; role?: ReactNode; big?: boolean }) {
  const initials = name.split(" ").filter((w) => /^[A-Za-z]/.test(w)).map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className={`flex items-center gap-4 border-b ${line} bg-white ${big ? "h-14 px-6" : "h-11 px-4"}`}>
      <span className="flex shrink-0 items-center gap-2">
        <span className={`inline-flex items-center justify-center rounded-md font-bold text-white ${big ? "h-7 w-7 text-[11px]" : "h-6 w-6 text-[9px]"}`} style={{ background: "var(--app)" }}>{initials}</span>
        <span className={`hidden font-semibold sm:inline ${ink} ${big ? "text-[15px]" : "text-[12px]"}`}>{name}</span>
      </span>
      <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {tabs.map((x, i) => (
          <button key={x} type="button" onClick={() => onStep?.(i)} className={`shrink-0 rounded-md px-2.5 font-medium ${big ? "py-1.5 text-[13px]" : "py-1 text-[11px]"} ${i === step ? ink : "text-[#6B7280] hover:text-[#111827]"}`} style={i === step ? { background: "color-mix(in srgb, var(--app) 10%, white)", color: "var(--app)" } : undefined}>{x}</button>
        ))}
      </nav>
      <span className="hidden items-center gap-3 text-[#9CA3AF] md:flex"><Search className={big ? "h-4 w-4" : "h-3.5 w-3.5"} /><Bell className={big ? "h-4 w-4" : "h-3.5 w-3.5"} /></span>
      {role}
    </div>
  );
}

// ── The browser window the app sits in, inside the dashboard ──
// `height` is a minimum: the window grows with the page inside it.

export function Browser({ url, color, children, bar, stripe, footer, onExpand, height = 420, compact }: { url: string; color: string; children: ReactNode; bar?: ReactNode; stripe?: string; footer?: string; onExpand?: () => void; height?: number; compact?: boolean }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#D1D5DB] bg-white" style={{ "--app": color, fontFamily: APP_FONT } as CSSProperties}>
      <div className={`flex items-center gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 ${compact ? "h-7" : "h-9"}`}>
        <span className="flex shrink-0 gap-1.5">{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} className={`rounded-full ${compact ? "h-2 w-2" : "h-2.5 w-2.5"}`} style={{ background: c, opacity: 0.85 }} />)}</span>
        <span className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-white px-2.5 text-[#6B7280] ${compact ? "h-4 text-[9px]" : "h-6 text-[11px]"}`}><Lock className="h-3 w-3 shrink-0" /><span className="truncate">{url}</span></span>
        {onExpand ? <button type="button" onClick={onExpand} aria-label="Full screen" title="Full screen" className="rounded p-1 text-[#6B7280] hover:bg-[#E5E7EB] hover:text-[#111827]"><Maximize2 className="h-3.5 w-3.5" /></button> : <span className="w-[42px]" />}
      </div>
      {bar}
      <div className="bg-[#F9FAFB] px-5 py-5 sm:px-6" style={{ minHeight: height }}>
        <div className="mx-auto max-w-[760px]">{children}</div>
      </div>
      {stripe && <div className="bg-[#FEF3C7] py-1.5 text-center text-[11px] text-[#92400E]">{stripe}</div>}
      {footer && <div className="border-t border-[#E5E7EB] bg-white py-2 text-center text-[10px] text-[#9CA3AF]">{footer}</div>}
    </div>
  );
}
