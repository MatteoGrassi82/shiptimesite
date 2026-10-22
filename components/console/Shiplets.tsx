"use client";

import { useState, type ReactNode } from "react";
import { CalendarClock, Check, CircleCheck, Code2, Copy, Download, Link2, QrCode } from "lucide-react";
import { shipletCatalog, type ShipletMap, type ShipletStatus } from "./data";
import { useScenario } from "./derive";
import { Badge, Button, PageHeader, Panel, SectionTitle, statusTone, T, type View } from "./ui";

// ── Shiplets ─────────────────────────────────────────────────────────────────
// Micro apps on the account's rates and bill, for people who don't ship: a
// dental office sending a case, a shopper starting a return, a store counter.
// Borrowed from Stripe Payment Links (the share link first, a live preview
// beside the settings), AfterShip (a step switcher, because a micro app has
// several screens, and gallery cards that show the real page with sample
// data) and Calendly (copy and on/off right on the card). Orders that come in
// through a Shiplet follow the account's shipping rules.

type Tpl = (typeof shipletCatalog)[number];

const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const STEPS: Record<string, string[]> = { tracking: ["Tracking"], returns: ["Find order", "Choose items", "Label"], checkout: ["Checkout"], case: ["Book pickup", "Booked", "Track"], repair: ["Request a box"], retrieval: ["Send a kit"], counter: ["Look up", "Label"], storeorder: ["Order stock"] };
const SPARK = [3, 4, 4, 6, 5, 7, 6, 8, 7, 9, 8, 10];

// ── The micro app itself, drawn small ──

function Phone({ brand, children }: { brand: string; children: ReactNode }) {
  return (
    <div className="w-[260px] overflow-hidden rounded-[30px] border-[6px] border-[#1A1B25] bg-white shadow-[0_15px_35px_rgba(0,0,0,.15)]" style={{ fontFamily: T.font }}>
      <div className="flex h-11 items-center gap-2 border-b border-[#EBEEF1] px-4"><span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#1A1B25] text-[9px] font-bold text-white">{brand.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span><span className="truncate text-[12px] font-semibold text-[#1A1B25]">{brand}</span></div>
      <div className="h-[420px] overflow-hidden p-4 text-[12px] text-[#353A44]">{children}</div>
      <div className="border-t border-[#EBEEF1] py-2 text-center text-[10px] text-[#8792A2]">Shipping by ShipTime</div>
    </div>
  );
}
const Field = ({ label, value }: { label: string; value: string }) => <div className="mb-2.5"><div className="mb-1 text-[11px] text-[#6A7383]">{label}</div><div className="rounded-md border border-[#D8DEE4] px-2.5 py-2 text-[12px] text-[#1A1B25]">{value}</div></div>;
const Cta = ({ children }: { children: ReactNode }) => <div className="mt-3 rounded-md bg-[#1A1B25] py-2.5 text-center text-[12px] font-semibold text-white">{children}</div>;
const Steps = ({ at }: { at: number }) => (
  <ol className="mt-3 space-y-2.5">{["Label created", "Picked up", "In transit", "Delivered"].map((s, i) => <li key={s} className="flex items-center gap-2">{i < at ? <CircleCheck className="h-4 w-4 text-[#16A34A]" /> : i === at ? <span className="h-4 w-4 rounded-full border-[5px] border-[#EC5A26]" /> : <span className="h-4 w-4 rounded-full border border-[#C0C8D2]" />}<span className={i <= at ? "text-[#1A1B25]" : "text-[#8792A2]"}>{s}</span></li>)}</ol>
);

function Screen({ id, step, brand }: { id: string; step: number; brand: string }) {
  if (id === "tracking") return <><div className="text-[11px] text-[#6A7383]">Order #10482</div><div className="mt-1 text-[18px] font-bold leading-6 text-[#1A1B25]">Arriving Thursday, Oct 24</div><div className="mt-1 text-[11px] text-[#6A7383]">From Reno, NV · UPS Ground</div><Steps at={2} /><div className="mt-5 rounded-md bg-[#F5F6F8] p-3 text-[11px]">Not home on Thursday? <b>Choose another day</b></div><div className="mt-3 text-center text-[11px] font-semibold text-[#2E4C8F]">Start a return</div></>;
  if (id === "returns") {
    if (step === 0) return <><div className="text-[16px] font-bold text-[#1A1B25]">Start a return</div><div className="mt-1 mb-4 text-[11px] text-[#6A7383]">Free within 30 days of delivery.</div><Field label="Order number" value="10482" /><Field label="Email" value="sam@example.com" /><Cta>Find my order</Cta></>;
    if (step === 1) return <><div className="text-[16px] font-bold text-[#1A1B25]">What are you sending back?</div>{[["Wool throw, grey", true], ["Stoneware mug ×2", false]].map(([n, c]) => <div key={n as string} className="mt-3 flex items-center gap-2 rounded-md border border-[#D8DEE4] p-2.5"><span className={`inline-flex h-4 w-4 items-center justify-center rounded border ${c ? "border-[#1A1B25] bg-[#1A1B25] text-white" : "border-[#C0C8D2]"}`}>{c && <Check className="h-3 w-3" />}</span>{n as string}</div>)}<div className="mt-3"><Field label="Reason" value="Colour isn't right" /></div><Cta>Continue</Cta></>;
    return <><div className="text-[16px] font-bold text-[#1A1B25]">Your return label</div><div className="mt-3 flex justify-center"><Qr seed={`${brand}-return`} size={120} /></div><div className="mt-3 text-center text-[12px] text-[#1A1B25]">Show this at any UPS location by Nov 5.</div><div className="mt-1 text-center text-[11px] text-[#6A7383]">Your refund starts when it&rsquo;s scanned.</div></>;
  }
  if (id === "checkout") return <><div className="text-[16px] font-bold text-[#1A1B25]">Delivery</div>{[["Standard", "Arrives Mon, Oct 27", "Free", true], ["Express", "Arrives Fri, Oct 24", "$9.80", false]].map(([n, d, p, c]) => <div key={n as string} className={`mt-3 flex items-center gap-2 rounded-md border p-2.5 ${c ? "border-[#1A1B25]" : "border-[#D8DEE4]"}`}><span className={`h-3.5 w-3.5 rounded-full ${c ? "border-[4px] border-[#1A1B25]" : "border border-[#C0C8D2]"}`} /><span className="flex-1"><span className="block font-semibold text-[#1A1B25]">{n as string}</span><span className="text-[11px] text-[#6A7383]">{d as string}</span></span><span className="font-semibold text-[#1A1B25]">{p as string}</span></div>)}<div className="mt-4 text-[11px] text-[#6A7383]">Dates come from the site that holds your items and the carrier we&rsquo;ll use.</div><Cta>Continue to payment</Cta></>;
  if (id === "case") {
    if (step === 0) return <><div className="text-[16px] font-bold text-[#1A1B25]">Send a case</div><div className="mt-1 mb-4 text-[11px] text-[#6A7383]">Billed to the lab. Nothing to pay.</div><Field label="Your office" value="Dr. Patel Dental, Oakville" /><Field label="Case for" value="Crown · patient ref 4471" /><div className="mb-1 text-[11px] text-[#6A7383]">Pickup</div><div className="flex gap-1.5">{["Today 2–4 pm", "Tomorrow"].map((x, i) => <span key={x} className={`rounded-md border px-2 py-1.5 text-[11px] ${i === 0 ? "border-[#1A1B25] font-semibold text-[#1A1B25]" : "border-[#D8DEE4]"}`}>{x}</span>)}</div><Cta>Book pickup</Cta></>;
    if (step === 1) return <><div className="flex justify-center pt-6"><CircleCheck className="h-10 w-10 text-[#16A34A]" /></div><div className="mt-3 text-center text-[16px] font-bold text-[#1A1B25]">Pickup booked</div><div className="mt-1 text-center text-[12px]">Today between 2 and 4 pm.</div><div className="mt-4 rounded-md bg-[#F5F6F8] p-3 text-[11px]">The courier brings the label. Put the case in the lab&rsquo;s box and hand it over.</div></>;
    return <><div className="text-[11px] text-[#6A7383]">Case · crown · ref 4471</div><div className="mt-1 text-[18px] font-bold text-[#1A1B25]">At the lab tomorrow</div><Steps at={2} /></>;
  }
  if (id === "counter") return step === 0 ? <><div className="text-[16px] font-bold text-[#1A1B25]">Ship from the store</div><div className="mt-4"><Field label="Order or customer" value="#AS-10477 · Lee" /><Field label="Box" value="Medium · 4.2 lb" /></div><Cta>Get the best rate</Cta></> : <><div className="text-[16px] font-bold text-[#1A1B25]">Label ready</div><div className="mt-3 rounded-md border border-[#D8DEE4] p-3 text-[11px]">UPS Ground · arrives Mon · $8.40<br />Printing on the counter printer…</div></>;
  return <><div className="text-[16px] font-bold text-[#1A1B25]">{shipletCatalog.find((t) => t.id === id)!.name}</div><div className="mt-1 mb-4 text-[11px] text-[#6A7383]">{shipletCatalog.find((t) => t.id === id)!.what}</div><Field label="Name" value="Jordan Lee" /><Field label="Address" value="214 Elm St, Columbus, OH" /><Cta>Send</Cta></>;
}

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
  return <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={size} height={size} className="rounded bg-white" fill="#1A1B25">{cells}{eye(0, 0)}{eye(n - 7, 0)}{eye(0, n - 7)}</svg>;
}

// ── Pages ──

export function ShipletsPage({ shiplets, setShiplet, open }: { shiplets: ShipletMap; setShiplet: (id: string, s: ShipletStatus) => void; open: (id: string) => void }) {
  const sc = useScenario();
  const one = sc.tier === "ShipTime One";
  const mine = shipletCatalog.filter((t) => shiplets[t.id]);
  const groups = Array.from(new Set(shipletCatalog.map((t) => t.group)));
  const card = (t: Tpl) => {
    const status = shiplets[t.id];
    return (
      <Panel key={t.id} className="flex flex-col overflow-hidden">
        <button type="button" onClick={() => open(t.id)} className="relative h-[170px] overflow-hidden bg-[#F5F6F8]">
          <div className="absolute left-1/2 top-4 origin-top -translate-x-1/2 scale-[0.52]"><Phone brand={t.id === "case" ? "Lakeview Dental Lab" : sc.account.name}><Screen id={t.id} step={0} brand={sc.account.name} /></Phone></div>
        </button>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between gap-2"><button type="button" onClick={() => open(t.id)} className="text-left text-[14px] font-semibold text-[#1A1B25] hover:underline">{t.name}</button>{status && <Badge tone={statusTone(status)}>{status}</Badge>}</div>
          <div className="text-[12px] text-[#6A7383]">{t.who}</div>
          <div className="mt-3 flex items-center gap-2">
            {status === "Live" ? <><Button small><Copy className="h-3.5 w-3.5" /> Copy link</Button><span className="text-[12px] text-[#6A7383]">{t.use}</span></>
              : status ? <Button small onClick={() => open(t.id)}>Open</Button>
              : t.setup === "now" ? <Button small primary onClick={() => setShiplet(t.id, "Live")}>Switch on</Button>
              : one ? <Button small onClick={() => setShiplet(t.id, "Call booked")}><CalendarClock className="h-3.5 w-3.5" /> Book a setup call</Button>
              : <span className="text-[12px] text-[#6A7383]">Available on ShipTime One</span>}
          </div>
        </div>
      </Panel>
    );
  };
  return (
    <div className="space-y-8">
      <PageHeader title="Shiplets" subtitle="Small apps on your rates and your bill, for people who don't ship: your shoppers, your stores, a partner. Switch one on and share the link." />
      {mine.length > 0 && <section><SectionTitle>Yours</SectionTitle><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mine.map(card)}</div></section>}
      {groups.map((g) => {
        const rest = shipletCatalog.filter((t) => t.group === g && !shiplets[t.id]);
        return rest.length ? <section key={g}><SectionTitle>{g}</SectionTitle><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rest.map(card)}</div></section> : null;
      })}
    </div>
  );
}

export function ShipletDetail({ id, shiplets, setShiplet, back, go }: { id: string; shiplets: ShipletMap; setShiplet: (id: string, s: ShipletStatus) => void; back: () => void; go: (v: View) => void }) {
  const sc = useScenario();
  const one = sc.tier === "ShipTime One";
  const t = shipletCatalog.find((x) => x.id === id)!;
  const status = shiplets[id];
  const steps = STEPS[id];
  const [step, setStep] = useState(0);
  const brand = id === "case" ? "Lakeview Dental Lab" : sc.account.name;
  const link = `ship.shiptime.com/${slug(brand)}/${id}`;
  return (
    <div>
      <button type="button" onClick={back} className="mb-3 text-[14px] font-semibold text-[#2E4C8F] hover:underline">Shiplets ›</button>
      <PageHeader kicker="Shiplet" title={<span className="inline-flex flex-wrap items-center gap-3">{t.name}{status && <Badge tone={statusTone(status)}>{status}</Badge>}</span>} subtitle={`${t.who} · ${t.what}`} />
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-6">
          {status === "Live" ? (
            <Panel className="p-4">
              <div className="text-[13px] text-[#6A7383]">Copy and share. People use it on your rates; it bills to you.</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-[#D8DEE4] bg-[#F5F6F8] px-3 text-[13px] text-[#1A1B25]" style={{ fontFamily: T.mono }}><Link2 className="h-3.5 w-3.5 shrink-0 text-[#6A7383]" /><span className="truncate">{link}</span></div>
                <Button primary><Copy className="h-4 w-4" /> Copy</Button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#EBEEF1] pt-4">
                <Qr seed={link} />
                <div className="space-y-2">
                  <Button small><Download className="h-3.5 w-3.5" /> Download QR</Button>
                  <div><Button small><Code2 className="h-3.5 w-3.5" /> Embed on your site</Button></div>
                  <div className="text-[12px] text-[#6A7383]">Print it for a counter or a box insert. It keeps working if you rename the Shiplet.</div>
                </div>
              </div>
            </Panel>
          ) : (
            <Panel className="p-4">
              {t.setup === "now" ? <><div className="text-[14px] text-[#353A44]">Ready in a minute. It uses your logo, your rates and your rules.</div><div className="mt-3"><Button primary onClick={() => setShiplet(id, "Live")}>Switch on</Button></div></>
                : one ? <><div className="text-[14px] text-[#353A44]">{status === "Call booked" ? "Your setup call is booked. We'll email you a time today." : "Built with you on a 30-minute call: we set it up around how you work, then you test it before it goes live."}</div>{id === "case" && <div className="mt-2 text-[13px] text-[#6A7383]">Built first with a dental lab. It now handles about 275 cases a month there.</div>}{!status && <div className="mt-3"><Button primary onClick={() => setShiplet(id, "Call booked")}><CalendarClock className="h-4 w-4" /> Book a setup call</Button></div>}</>
                : <div className="text-[14px] text-[#353A44]">Built with you on a setup call, which comes with ShipTime One.</div>}
            </Panel>
          )}

          {status === "Live" && (
            <section>
              <SectionTitle>Last 30 days</SectionTitle>
              <div className="mt-3 flex flex-wrap items-end gap-8">
                <div><div className="text-[12px] text-[#6A7383]">Used</div><div className="text-[24px] font-semibold tabular-nums text-[#1A1B25]">{t.use || "New"}</div></div>
                <svg viewBox="0 0 110 30" className="h-10 w-40"><polyline fill="none" stroke="#EC5A26" strokeWidth="2" points={SPARK.map((v, i) => `${i * 10},${30 - v * 2.6}`).join(" ")} /></svg>
              </div>
            </section>
          )}

          <section>
            <SectionTitle>How it ships</SectionTitle>
            <dl className="mt-3 space-y-2.5 text-[14px]">
              {[["Billed to", id === "case" ? "The lab's ShipTime account" : sc.account.name], ["Rates and carriers", "Your rates. Orders follow your shipping rules"], ["Ships from", one ? "Whichever of your sites your rules pick" : sc.sites[0].name], ["Built", t.setup === "now" ? "From a template, switched on in the app" : "With your team on a setup call, then reused as a template"]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[150px_1fr] gap-2"><dt className="text-[#6A7383]">{k}</dt><dd className="text-[#1A1B25]">{k === "Rates and carriers" && one ? <>{v} · <button type="button" onClick={() => go("rules")} className="font-semibold text-[#2E4C8F] hover:underline">See rules</button></> : v}</dd></div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="lg:sticky lg:top-[76px] lg:h-fit">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[12px] font-semibold text-[#6A7383]">Preview</span>
            {steps.map((s, i) => <button key={s} type="button" onClick={() => setStep(i)} className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${step === i ? "bg-[#1A1B25] text-white" : "border border-[#D8DEE4] text-[#353A44] hover:bg-[#F6F8FA]"}`}>{i + 1}. {s}</button>)}
          </div>
          <div className="flex justify-center rounded-xl bg-[#F5F6F8] py-6"><Phone brand={brand}><Screen id={id} step={step} brand={brand} /></Phone></div>
          <p className="mt-2 text-center text-[12px] text-[#6A7383]"><QrCode className="mr-1 inline h-3.5 w-3.5" />Sample data. This is what people see.</p>
        </aside>
      </div>
    </div>
  );
}
