"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpRight, CalendarClock, Check, ChevronDown, ChevronRight, CircleCheck, Code2, Copy, Download, Lock, Plus, QrCode, Share2 } from "lucide-react";
import { shipletCatalog, shipletsAtStart, type ShipletMap, type ShipletStatus } from "./data";
import { useScenario } from "./derive";
import { useToast } from "./Feedback";
import type { BrandId } from "./scenarios";
import { Badge, Button, FOCUS, PageHeader, Panel, Segmented, statusTone, T, Td, Th, type View } from "./ui";

// ── Shiplets ─────────────────────────────────────────────────────────────────
// Micro apps on the account's rates and bill, for people who don't ship: a
// dental office sending a case, a shopper starting a return, a store counter.
// They're web apps: a link that opens in any browser, on a phone or a
// computer, with nothing to install, so the previews are browser windows.
// Borrowed from Stripe Payment Links (the share link first, a live preview
// beside the settings), AfterShip (a step switcher, because a micro app has
// several screens, and gallery cards that show the real page with sample
// data) and Calendly (copy and on/off right on the card). Orders that come in
// through a Shiplet follow the account's shipping rules.

type Tpl = (typeof shipletCatalog)[number];

const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// Koherent Shiplets are white-labelled on the customer's own domain.
const linkFor = (koherent: boolean, brand: string, id: string) => (koherent ? `${id}.${slug(brand).replace(/-/g, "")}.com` : `ship.shiptime.com/${slug(brand)}/${id}`);
const STEPS: Record<string, string[]> = { tracking: ["Tracking"], returns: ["Find order", "Choose items", "Label"], checkout: ["Checkout"], case: ["Book pickup", "Booked", "Track"], repair: ["Request a box"], retrieval: ["Send a kit"], counter: ["Look up", "Label"], storeorder: ["Order stock"] };
const SPARK = [3, 4, 4, 6, 5, 7, 6, 8, 7, 9, 8, 10];

// The previews use each account's own orders, warehouse and carrier, so a
// candle maker sees candles and Alder & Stone sees a parcel coming from Reno.
type Sample = { order: string; items: [string, string]; reason: string; from: string; carrier: string; drop: string; customer: string; city: string };
const SAMPLE: Record<BrandId, Sample> = {
  small: { order: "#TC-2291", items: ["Cedar and smoke candle, 8 oz", "Wick trimmer"], reason: "Arrived cracked", from: "Portland, OR", carrier: "USPS Ground Advantage", drop: "any post office", customer: "Sam Lee", city: "Denver, CO" },
  canada: { order: "#NP-58810", items: ["Trail jacket, size M", "Merino socks ×2"], reason: "Too small", from: "Toronto, ON", carrier: "Canada Post Expedited", drop: "any Canada Post outlet", customer: "Sam Lee", city: "Ottawa, ON" },
  stores: { order: "#SH-30417", items: ["Glazed planter, 14 in", "Garden gloves ×2"], reason: "Arrived chipped", from: "Phoenix, AZ", carrier: "UPS Ground", drop: "any UPS location", customer: "Sam Lee", city: "Tucson, AZ" },
  reach: { order: "#AS-10482", items: ["Wool throw, grey", "Stoneware mug ×2"], reason: "Colour isn't right", from: "Reno, NV", carrier: "UPS Ground", drop: "any UPS location", customer: "Sam Lee", city: "Sacramento, CA" },
};

// ── The micro app itself, drawn small ──

function Browser({ brand, id, wide, children }: { brand: string; id: string; wide?: boolean; children: ReactNode }) {
  const one = useScenario().tier === "Koherent";
  return (
    <div className={`${wide ? "w-full" : "w-[460px] max-w-full"} overflow-hidden rounded-lg border border-[color:var(--c-border)] bg-white shadow-[0_15px_35px_rgba(0,0,0,.12)]`} style={{ fontFamily: T.font }}>
      <div className="flex h-9 items-center gap-3 border-b border-[color:var(--c-line)] bg-[color:var(--c-subtle)] px-3">
        <span className="flex shrink-0 gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-[color:var(--c-border)]" />)}</span>
        <span className="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 text-[11px] text-[color:var(--c-muted)]"><Lock className="h-3 w-3 shrink-0" /><span className="truncate">{linkFor(one, brand, id)}</span></span>
      </div>
      <div className="flex h-12 items-center gap-2 border-b border-[color:var(--c-line)] px-5"><span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--c-ink)] text-[9px] font-bold text-white">{brand.split(" ").filter((w) => /^[A-Za-z]/.test(w)).map((w) => w[0]).slice(0, 2).join("")}</span><span className="truncate text-[13px] font-semibold text-[color:var(--c-ink)]">{brand}</span></div>
      <div className={`${wide ? "h-[480px] py-10" : "h-[400px] py-6"} overflow-hidden px-5 text-[12px] text-[color:var(--c-text)]`}><div className={`mx-auto ${wide ? "max-w-[340px]" : "max-w-[300px]"}`}>{children}</div></div>
      <div className="border-t border-[color:var(--c-line)] py-2 text-center text-[10px] text-[color:var(--c-faint)]">{one ? "Powered by Koherent" : "Shipping by ShipTime"}</div>
    </div>
  );
}
const Field = ({ label, value }: { label: string; value: string }) => <div className="mb-2.5"><div className="mb-1 text-[11px] text-[color:var(--c-muted)]">{label}</div><div className="rounded-md border border-[color:var(--c-border)] px-2.5 py-2 text-[12px] text-[color:var(--c-ink)]">{value}</div></div>;
const Cta = ({ children }: { children: ReactNode }) => <div className="mt-3 rounded-md bg-[color:var(--c-ink)] py-2.5 text-center text-[12px] font-semibold text-white">{children}</div>;
const Steps = ({ at, labels = ["Label created", "Picked up", "In transit", "Delivered"] }: { at: number; labels?: string[] }) => (
  <ol className="mt-3 space-y-2.5">{labels.map((s, i) => <li key={s} className="flex items-center gap-2">{i < at ? <CircleCheck className="h-4 w-4 text-[#16A34A]" /> : i === at ? <span className="h-4 w-4 rounded-full border-[5px] border-[color:var(--c-accent)]" /> : <span className="h-4 w-4 rounded-full border border-[color:var(--c-border2)]" />}<span className={i <= at ? "text-[color:var(--c-ink)]" : "text-[color:var(--c-faint)]"}>{s}</span></li>)}</ol>
);

function Screen({ id, step, brand, x }: { id: string; step: number; brand: string; x: Sample }) {
  if (id === "tracking") return <><div className="text-[11px] text-[color:var(--c-muted)]">Order {x.order}</div><div className="mt-1 text-[18px] font-bold leading-6 text-[color:var(--c-ink)]">Arriving tomorrow, Friday, Oct 23</div><div className="mt-1 text-[11px] text-[color:var(--c-muted)]">From {x.from}, {x.carrier}</div><Steps at={2} /><div className="mt-5 rounded-md bg-[color:var(--c-subtle)] p-3 text-[11px]">Not home on Friday? <b>Choose another day</b></div><div className="mt-3 text-center text-[11px] font-semibold text-[color:var(--c-link)]">Start a return</div></>;
  if (id === "returns") {
    if (step === 0) return <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">Start a return</div><div className="mt-1 mb-4 text-[11px] text-[color:var(--c-muted)]">Free within 30 days of delivery.</div><Field label="Order number" value={x.order.slice(1)} /><Field label="Email" value="sam@example.com" /><Cta>Find my order</Cta></>;
    if (step === 1) return <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">What are you sending back?</div>{[[x.items[0], true], [x.items[1], false]].map(([n, c]) => <div key={n as string} className="mt-3 flex items-center gap-2 rounded-md border border-[color:var(--c-border)] p-2.5"><span className={`inline-flex h-4 w-4 items-center justify-center rounded border ${c ? "border-[color:var(--c-ink)] bg-[color:var(--c-ink)] text-white" : "border-[color:var(--c-border2)]"}`}>{c && <Check className="h-3 w-3" />}</span>{n as string}</div>)}<div className="mt-3"><Field label="Reason" value={x.reason} /></div><Cta>Continue</Cta></>;
    return <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">Your return label</div><div className="mt-3 flex justify-center"><Qr seed={`${brand}-return`} size={120} /></div><div className="mt-3 text-center text-[12px] text-[color:var(--c-ink)]">Show this at {x.drop} by Nov 5.</div><div className="mt-1 text-center text-[11px] text-[color:var(--c-muted)]">Your refund starts when it&rsquo;s scanned.</div></>;
  }
  if (id === "checkout") return <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">Delivery</div>{[["Standard", "Arrives Tue, Oct 27", "Free", true], ["Express", "Arrives tomorrow, Fri, Oct 23", "$9.80", false]].map(([n, d, p, c]) => <div key={n as string} className={`mt-3 flex items-center gap-2 rounded-md border p-2.5 ${c ? "border-[color:var(--c-ink)]" : "border-[color:var(--c-border)]"}`}><span className={`h-3.5 w-3.5 rounded-full ${c ? "border-[4px] border-[color:var(--c-ink)]" : "border border-[color:var(--c-border2)]"}`} /><span className="flex-1"><span className="block font-semibold text-[color:var(--c-ink)]">{n as string}</span><span className="text-[11px] text-[color:var(--c-muted)]">{d as string}</span></span><span className="font-semibold text-[color:var(--c-ink)]">{p as string}</span></div>)}<div className="mt-4 text-[11px] text-[color:var(--c-muted)]">Dates come from the warehouse that holds your items and the carrier we&rsquo;ll use.</div><Cta>Continue to payment</Cta></>;
  if (id === "case") {
    if (step === 0) return <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">Send a case</div><div className="mt-1 mb-4 text-[11px] text-[color:var(--c-muted)]">Billed to the lab. Nothing to pay.</div><Field label="Your office" value="Dr. Patel Dental, Oakville" /><Field label="Case for" value="Crown, patient ref 4471" /><div className="mb-1 text-[11px] text-[color:var(--c-muted)]">Pickup</div><div className="flex gap-1.5">{["Today 2–4 pm", "Tomorrow"].map((x, i) => <span key={x} className={`rounded-md border px-2 py-1.5 text-[11px] ${i === 0 ? "border-[color:var(--c-ink)] font-semibold text-[color:var(--c-ink)]" : "border-[color:var(--c-border)]"}`}>{x}</span>)}</div><Cta>Book pickup</Cta></>;
    if (step === 1) return <><div className="flex justify-center pt-6"><CircleCheck className="h-10 w-10 text-[#16A34A]" /></div><div className="mt-3 text-center text-[16px] font-bold text-[color:var(--c-ink)]">Pickup booked</div><div className="mt-1 text-center text-[12px]">Today between 2 and 4 pm.</div><div className="mt-4 rounded-md bg-[color:var(--c-subtle)] p-3 text-[11px]">The courier brings the label. Put the case in the lab&rsquo;s box and hand it over.</div></>;
    return <><div className="text-[11px] text-[color:var(--c-muted)]">Crown, ref 4471</div><div className="mt-1 text-[18px] font-bold text-[color:var(--c-ink)]">At the lab tomorrow</div><Steps at={2} /></>;
  }
  if (id === "counter") return step === 0 ? <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">Ship from the store</div><div className="mt-4"><Field label="Order or customer" value={`${x.order}, ${x.customer}`} /><Field label="Box" value="Medium, 4.2 lb" /></div><Cta>Get the best rate</Cta></> : <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">Label ready</div><div className="mt-3 rounded-md border border-[color:var(--c-border)] p-3 text-[11px]">{x.carrier}, arrives Mon, $8.40<br />Printing on the counter printer…</div></>;
  if (id === "repair") return <><div className="text-[11px] text-[color:var(--c-muted)]">Repair ref 2207</div><div className="mt-1 text-[18px] font-bold leading-6 text-[color:var(--c-ink)]">Your repair kit is with you</div><div className="mt-1 text-[11px] text-[color:var(--c-muted)]">Pack the item in the box. The return label is already inside.</div><Steps at={1} labels={["Kit sent to you", "Item on its way to us", "Being repaired", "On its way back"]} /></>;
  if (id === "retrieval") return <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">Return your laptop</div><div className="mt-1 text-[11px] text-[color:var(--c-muted)]">A box with a prepaid label arrives today. Pack the laptop and charger, then drop it at {x.drop}.</div><Steps at={1} labels={["Kit sent", "Kit delivered", "Laptop on its way back", "Received"]} /></>;
  if (id === "storeorder") return <><div className="text-[16px] font-bold text-[color:var(--c-ink)]">Order stock, Store #14</div><div className="mt-1 mb-3 text-[11px] text-[color:var(--c-muted)]">Delivered on the Wednesday route.</div>{[[x.items[0], "2 pallets"], [x.items[1], "12 cases"], ["Potting mix, 40 qt", "1 pallet"]].map(([n, q]) => <div key={n} className="flex justify-between border-b border-[color:var(--c-line)] py-2"><span className="text-[color:var(--c-ink)]">{n}</span><span className="text-[color:var(--c-muted)]">{q}</span></div>)}<Cta>Send order</Cta></>;
  return null;
}

// The screen each template card shows: its most recognisable moment, so the
// cards don't all look like the same form.
const THUMB: Record<string, number> = { returns: 2, case: 1, counter: 1 };

// A QR-style mark for the share panel (finder squares plus a pattern from the
// link), so the page reads as finished without a QR library.
function Qr({ seed, size = 96 }: { seed: string; size?: number }) {
  const n = 25;
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const cells: ReactNode[] = [];
  const finder = (x: number, y: number) => x < 7 && y < 7 || x >= n - 7 && y < 7 || x < 7 && y >= n - 7;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (finder(x, y)) continue;
    h = (h * 1103515245 + 12345) >>> 0;
    if ((h >>> 16) & 1) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
  }
  const eye = (x: number, y: number) => <g key={`e${x}${y}`}><rect x={x} y={y} width={7} height={7} /><rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" /><rect x={x + 2} y={y + 2} width={3} height={3} /></g>;
  return <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={size} height={size} className="rounded bg-white" fill="var(--c-ink)">{cells}{eye(0, 0)}{eye(n - 7, 0)}{eye(0, n - 7)}</svg>;
}

// ── Pages ──

const fits = (t: Tpl, id: BrandId) => !("needs" in t) || t.needs === id;

// The Shiplets page lists the ones you run, like a list of published sites.
// Templates live behind "New Shiplet": filter by who it's for, each card shows
// its most recognisable screen, and a card opens the template's own page.
export function ShipletsPage({ shiplets, setShiplet, open }: { shiplets: ShipletMap; setShiplet: (id: string, s: ShipletStatus) => void; open: (id: string) => void }) {
  const sc = useScenario();
  const one = sc.tier === "Koherent";
  const [adding, setAdding] = useState(false);
  const catalog = shipletCatalog.filter((t) => fits(t, sc.id));
  const mine = catalog.filter((t) => shiplets[t.id]);
  if (adding) return <NewShiplet catalog={catalog} shiplets={shiplets} setShiplet={setShiplet} open={open} back={() => setAdding(false)} />;
  return (
    <div>
      <PageHeader title="Shiplets" subtitle="Small web apps on your rates and your bill, for people who don't ship: your shoppers, your stores, a partner." actions={<Button primary onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> New Shiplet</Button>} />
      {mine.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse">
            <thead><tr><Th>Name</Th><Th>Address</Th><Th>Status</Th><Th right>Last 30 days</Th><Th right>{""}</Th></tr></thead>
            <tbody>
              {mine.map((t) => {
                const status = shiplets[t.id];
                return (
                  <tr key={t.id} onClick={() => open(t.id)} className="cursor-pointer hover:bg-[color:var(--c-hover)]">
                    <Td><div className="py-1"><div className="font-medium text-[color:var(--c-ink)]">{t.name}</div><div className="text-[12px] text-[color:var(--c-muted)]">{t.who}</div></div></Td>
                    <Td muted mono>{linkFor(one, t.id === "case" ? "Lakeview Dental Lab" : sc.account.name, t.id)}</Td>
                    <Td><Badge tone={statusTone(status)}>{status}</Badge></Td>
                    <Td right>{status !== "Live" ? "—" : shipletsAtStart[sc.id][t.id] === "Live" ? t.use : "New today"}</Td>
                    <Td right><ChevronRight className="ml-auto h-4 w-4 text-[color:var(--c-faint)]" /></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[color:var(--c-border)] px-6 py-12 text-center">
          <div className="text-[16px] font-semibold text-[color:var(--c-ink)]">No Shiplets yet</div>
          <p className="mx-auto mt-1 max-w-[420px] text-[14px] text-[color:var(--c-muted)]">A returns page, your own tracking page, a form for a partner. Each one is a link, on your rates and your bill.</p>
          <div className="mt-4"><Button onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Start from a template</Button></div>
        </div>
      )}
    </div>
  );
}

function NewShiplet({ catalog, shiplets, setShiplet, open, back }: { catalog: Tpl[]; shiplets: ShipletMap; setShiplet: (id: string, s: ShipletStatus) => void; open: (id: string) => void; back: () => void }) {
  const sc = useScenario();
  const toast = useToast();
  const one = sc.tier === "Koherent";
  const groups = Array.from(new Set(catalog.map((t) => t.group)));
  const [who, setWho] = useState("All");
  const shown = catalog.filter((t) => who === "All" || t.group === who);
  const use = (t: Tpl) => {
    if (t.setup === "now") { setShiplet(t.id, "Live"); open(t.id); toast({ text: `${t.name} is live. Share the link to start using it.` }); }
    else { setShiplet(t.id, "Call booked"); toast({ text: "Setup call requested. Priya will email you a time today." }); }
  };
  return (
    <div>
      <PageHeader back={{ label: "Shiplets", onClick: back }} title="New Shiplet" subtitle="Start from a template. Open one to click through it before you switch it on." />
      <Segmented options={[{ id: "All", label: "All" }, ...groups.map((g) => ({ id: g, label: g.replace(/^For /, "").replace(/^./, (c) => c.toUpperCase()) }))]} value={who} onChange={setWho} />
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => {
          const status = shiplets[t.id];
          const brand = t.id === "case" ? "Lakeview Dental Lab" : sc.account.name;
          return (
            <Panel key={t.id} className="flex flex-col overflow-hidden">
              <button type="button" onClick={() => open(t.id)} aria-label={`Preview ${t.name}`} className={`relative h-[200px] overflow-hidden bg-[color:var(--c-subtle)] ${FOCUS}`}>
                <div className="absolute left-1/2 top-5 origin-top -translate-x-1/2 scale-[0.62]"><Browser id={t.id} brand={brand}><Screen id={t.id} step={THUMB[t.id] ?? 0} brand={brand} x={SAMPLE[sc.id]} /></Browser></div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[color:var(--c-subtle)] to-transparent" />
              </button>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between gap-2"><span className="text-[15px] font-semibold text-[color:var(--c-ink)]">{t.name}</span>{status && <Badge tone={statusTone(status)}>{status === "Live" ? "In use" : status}</Badge>}</div>
                <p className="mt-1 flex-1 text-[13px] leading-5 text-[color:var(--c-muted)]">{t.what}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[12px] text-[color:var(--c-muted)]">{t.setup === "now" ? "Ready in a minute" : "Built with you on a call"}</span>
                  {status ? <Button small onClick={() => open(t.id)}>Open</Button>
                    : t.setup === "now" || one ? <Button small onClick={() => use(t)}>{t.setup === "now" ? "Use template" : "Book a setup call"}</Button>
                    : <span className="text-[12px] text-[color:var(--c-muted)]">With Koherent</span>}
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

// What each Shiplet asks people for, shown in the details panel.
const ASKS: Record<string, string> = {
  tracking: "Nothing. It opens from the tracking link in your emails.",
  returns: "Order number, email, the items and a reason.",
  checkout: "Nothing. It shows inside your checkout.",
  case: "The office, the case and a pickup time.",
  repair: "Name and address.",
  retrieval: "Name, address and the equipment.",
  counter: "The order or customer, and the box.",
  storeorder: "The store, the items and the delivery day.",
};

// Sharing lives in one menu, the way a published site has one Share button:
// the link first, then a QR code for print, then embedding.
function ShareMenu({ link }: { link: string }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [qr, setQr] = useState(false);
  const item = `flex w-full items-start gap-2.5 rounded-md px-3 py-2 text-left hover:bg-[color:var(--c-hover)] ${FOCUS}`;
  const done = (text: string) => { setOpen(false); setQr(false); toast({ text }); };
  return (
    <div className="relative">
      <Button primary onClick={() => setOpen(!open)}><Share2 className="h-4 w-4" /> Share <ChevronDown className="h-3.5 w-3.5" /></Button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-72 rounded-lg border border-[color:var(--c-line)] bg-white p-1 shadow-[0_5px_15px_rgba(0,0,0,.12),0_15px_35px_rgba(48,49,61,.08)]">
          <button type="button" onClick={() => done("Link copied.")} className={item}><Copy className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /><span><span className="block text-[14px] text-[color:var(--c-ink)]">Copy link</span><span className="block truncate text-[12px] text-[color:var(--c-muted)]" style={{ fontFamily: T.mono }}>{link}</span></span></button>
          <button type="button" onClick={() => setQr(!qr)} className={item}><QrCode className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /><span><span className="block text-[14px] text-[color:var(--c-ink)]">QR code</span><span className="block text-[12px] text-[color:var(--c-muted)]">For a counter, a box insert or a flyer.</span></span></button>
          {qr && <div className="flex items-center gap-3 px-3 pb-2 pl-9"><Qr seed={link} size={84} /><Button small onClick={() => done("QR code downloaded.")}><Download className="h-3.5 w-3.5" /> Download</Button></div>}
          <button type="button" onClick={() => done("Embed code copied. Paste it into any page of your site.")} className={item}><Code2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--c-muted)]" /><span><span className="block text-[14px] text-[color:var(--c-ink)]">Embed on your site</span><span className="block text-[12px] text-[color:var(--c-muted)]">Copies a snippet for any web page.</span></span></button>
        </div>
      )}
    </div>
  );
}

// A Shiplet's page, laid out like a published site: the live preview large on
// the left (click through its screens), and on the right the details a site
// owner checks: address, status, use, what it asks for, how it looks, how it
// bills and ships. Share and Open sit top right.
export function ShipletDetail({ id, shiplets, setShiplet, back, go }: { id: string; shiplets: ShipletMap; setShiplet: (id: string, s: ShipletStatus) => void; back: () => void; go: (v: View) => void }) {
  const sc = useScenario();
  const toast = useToast();
  const one = sc.tier === "Koherent";
  const t = shipletCatalog.find((x) => x.id === id)!;
  const status = shiplets[id];
  const live = status === "Live";
  const steps = STEPS[id];
  const [step, setStep] = useState("0");
  const brand = id === "case" ? "Lakeview Dental Lab" : sc.account.name;
  const link = linkFor(one, brand, id);
  const switchOn = () => { setShiplet(id, "Live"); toast({ text: `${t.name} is live at ${link}.` }); };
  const bookCall = () => { setShiplet(id, "Call booked"); toast({ text: "Setup call requested. Priya will email you a time today." }); };
  const actions = live ? <><Button><ArrowUpRight className="h-4 w-4" /> Open site</Button><ShareMenu link={link} /></>
    : !status && t.setup === "now" ? <Button primary onClick={switchOn}>Switch on</Button>
    : !status && one ? <Button primary onClick={bookCall}><CalendarClock className="h-4 w-4" /> Book a setup call</Button>
    : undefined;
  const rows: [string, ReactNode][] = [
    ["Address", <span key="a" className="block truncate" style={{ fontFamily: T.mono, fontSize: 13 }}>{link}</span>],
    ["Status", live ? <span key="s" className="inline-flex items-center gap-2"><Badge tone="positive">Live</Badge><button type="button" onClick={() => { setShiplet(id, "Draft"); toast({ text: "Switched off. The link now says it's closed." }); }} className={`text-[13px] font-semibold text-[color:var(--c-link)] hover:underline ${FOCUS}`}>Switch off</button></span> : status ? <Badge tone={statusTone(status)}>{status}</Badge> : <span key="s" className="text-[color:var(--c-muted)]">Not on yet</span>],
    ...(live ? [["Last 30 days", <span key="u" className="inline-flex items-center gap-3">{shipletsAtStart[sc.id][id] === "Live" ? <>{t.use}<svg viewBox="0 0 110 30" className="h-6 w-24"><polyline fill="none" style={{ stroke: "var(--c-accent)" }} strokeWidth="2.5" points={SPARK.map((v, i) => `${i * 10},${30 - v * 2.6}`).join(" ")} /></svg></> : "New today"}</span>] as [string, ReactNode]] : []),
    ["Asks for", ASKS[id]],
    ["Looks like", id === "case" ? "The lab's logo and colours." : "Your logo and colours, from Settings."],
    ["Billed to", id === "case" ? "The lab's ShipTime account" : sc.account.name],
    ["Shipping", one ? <span key="r">Your rates, following your shipping rules. <button type="button" onClick={() => go("rules")} className="font-semibold text-[color:var(--c-link)] hover:underline">See rules</button></span> : "Your rates."],
    ["Ships from", one ? "Whichever of your warehouses your rules pick" : sc.sites[0].name],
    ["Built", t.setup === "now" ? "From a template, switched on in the app" : "With your team on a setup call, then reused as a template"],
  ];
  return (
    <div>
      <PageHeader back={{ label: "Shiplets", onClick: back }} title={t.name} status={status && <Badge tone={statusTone(status)}>{status}</Badge>} subtitle={`For ${t.who.toLowerCase()}. ${t.what}`} actions={actions} />
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            {steps.length > 1 ? <Segmented options={steps.map((s, i) => ({ id: String(i), label: s }))} value={step} onChange={setStep} /> : <span />}
            <span className="text-[12px] text-[color:var(--c-muted)]">Sample data. Click through it as your customers would.</span>
          </div>
          <Browser id={id} brand={brand} wide><Screen id={id} step={Number(step)} brand={brand} x={SAMPLE[sc.id]} /></Browser>
          <p className="mt-2 text-[12px] text-[color:var(--c-muted)]">A web page: nothing to install, and it works on any phone or computer.{one ? " On your own domain." : ""}</p>
        </div>
        <aside>
          {!live && (
            <div className="mb-4 rounded-lg bg-[color:var(--c-subtle)] p-4 text-[14px] text-[color:var(--c-text)]">
              {t.setup === "now" ? "Ready in a minute. It uses your logo, your rates and your rules."
                : status === "Call booked" ? "Your setup call is booked. We'll email you a time today."
                : one ? <>Built with you on a 30-minute call: we set it up around how you work, then you test it before it goes live.{id === "case" && <span className="mt-2 block text-[13px] text-[color:var(--c-muted)]">Built first with a dental lab. It now handles about 275 cases a month there.</span>}</>
                : "Built with you on a setup call, which comes with Koherent."}
            </div>
          )}
          <dl className="divide-y divide-[color:var(--c-line)] rounded-lg border border-[color:var(--c-line)] px-4">
            {rows.map(([k, v]) => (
              <div key={k} className="py-3">
                <dt className="text-[12px] text-[color:var(--c-muted)]">{k}</dt>
                <dd className="mt-0.5 text-[14px] text-[color:var(--c-ink)]">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}
