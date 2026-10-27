"use client";

import { createContext, useContext } from "react";
import { scenarios, type Line, type Scenario } from "./scenarios";

// The account on screen, picked on the sign-in page.
export const ScenarioContext = createContext<Scenario>(scenarios.reach);
export const useScenario = () => useContext(ScenarioContext);

// "Now" in the mockup, used everywhere a date or time is shown.
export const TODAY = "Thursday, Oct 22";
export const NOW = "10:42 am";
// Per-label savings are shown against the customer's contract rates when they
// joined; across the account that comes to about 10% (Home's savings figure).
export const OLD_RATE = 1.11;

export const money = (n: number) => (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const parseMoney = (s: string) => Number(s.replace(/[^0-9.]/g, ""));

// One volume and one savings story per account, so every screen agrees.
export const monthlyOrders = (sc: Scenario) => sc.sites.reduce((a, s) => a + s.orders, 0);
export const spendPerOrder = (sc: Scenario) => parseMoney(sc.metrics[0].value) / monthlyOrders(sc);
export function savingsFor(sc: Scenario) {
  const total = parseMoney(sc.saved);
  if (!sc.rules.length) return { total, rules: 0, rates: total, audits: 0 };
  const rules = sc.rules.filter((r) => r.status === "Live").reduce((a, r) => a + r.monthly, 0);
  const rates = sc.defaultRule?.monthly ?? 0;
  return { total, rules, rates, audits: total - rules - rates };
}

export type ShipStatus = "Delivered" | "In transit" | "Label created" | "Exception" | "Returned";
export type Shipment = { id: string; order: string; created: string; age: 0 | 1 | 7; to: string; carrier: string; service: string; site: string; status: ShipStatus; cost: number; weight: string; promised: string };

// Status follows age: today's parcels are waiting for pickup or moving,
// yesterday's are moving or delivered, last week's are delivered or back as
// returns. Two problems are open, as on Home.
const STATUS: ShipStatus[] = ["Label created", "Label created", "In transit", "Label created", "In transit", "In transit", "In transit", "Delivered", "Exception", "In transit", "Delivered", "In transit", "Delivered", "Exception", "Delivered", "Delivered", "Returned", "Delivered", "Delivered", "Delivered", "Delivered", "Returned", "Delivered", "Delivered"];
const TODAY_AT = ["10:31 am", "10:12 am", "9:58 am", "9:40 am", "9:21 am", "8:55 am"];
const YESTERDAY_AT = ["4:48 pm", "4:12 pm", "3:37 pm", "2:55 pm", "1:20 pm", "11:46 am", "10:03 am", "9:15 am"];
const canadian = (city: string) => /, (ON|QC|BC|AB)$/.test(city);

export function shipmentsFor(sc: Scenario): Shipment[] {
  const heavy = sc.id === "stores";
  return Array.from({ length: 24 }, (_, i) => {
    const { city, site } = sc.cities[i % sc.cities.length];
    const ca = canadian(city);
    const store = city.startsWith("Store");
    const [carrier, service] = store ? ["Riverside routes", "Store delivery"] : ca ? (i % 2 ? ["Canada Post", "Expedited"] : ["Purolator", "Ground"]) : i % 3 === 0 ? ["UPS", "Ground"] : i % 3 === 1 ? (heavy ? ["Regional", "Heavy ground"] : ["USPS", "Ground Advantage"]) : ["OnTrac", "Ground"];
    const age = i < 6 ? 0 : i < 14 ? 1 : 7;
    return {
      id: `SHP-${48213 - i}`,
      order: `#${sc.account.initials}-${10482 - i}`,
      created: age === 0 ? `Today, ${TODAY_AT[i]}` : age === 1 ? `Yesterday, ${YESTERDAY_AT[i - 6]}` : "Oct 15",
      age,
      to: city,
      carrier,
      service,
      site,
      status: STATUS[i],
      cost: Math.round(((heavy ? 14 : ca ? 13 : 8) * 100 + ((i * 137) % 900))) / 100,
      weight: `${(heavy ? 18 + ((i * 7) % 20) : 1.2 + ((i * 7) % 40) / 10).toFixed(1)} lb`,
      promised: i % 3 === 0 ? "2 days" : "3 days",
    };
  });
}

type Tone = "slate" | "amber" | "green";
export function eventsFor(s: Shipment): { when: string; title: string; detail: string; tone: Tone }[] {
  const label = { title: "Label created", detail: `${s.carrier} ${s.service} · from ${s.site} · ${money(s.cost)} (your old rate ${money(s.cost * OLD_RATE)})`, tone: "slate" as Tone };
  if (s.age === 0) {
    return [
      { when: s.created, ...label },
      s.status === "In transit" ? { when: "Today, 10:20 am", title: "Picked up", detail: `From ${s.site}`, tone: "slate" } : { when: "Today, 4:00 pm", title: "Pickup booked", detail: `${s.carrier} collects at ${s.site} this afternoon`, tone: "slate" },
    ];
  }
  if (s.age === 1) {
    const ev = [
      { when: s.created, ...label },
      { when: "Yesterday, 6:05 pm", title: "Picked up", detail: `From ${s.site}`, tone: "slate" as Tone },
      { when: "Today, 3:40 am", title: "In transit", detail: "Left the regional hub", tone: "slate" as Tone },
    ];
    if (s.status === "Exception") ev.push({ when: "Today, 7:55 am", title: "Delivery problem", detail: "Address incomplete: no unit number", tone: "amber" }, { when: "Today, 8:10 am", title: "We're on it", detail: "We asked your customer for the unit number. Update by 1:00 pm.", tone: "slate" });
    if (s.status === "Delivered") ev.push({ when: "Today, 10:05 am", title: "Delivered", detail: "Next day, ahead of the promise", tone: "green" });
    return ev;
  }
  const ev = [
    { when: "Oct 15, 9:14 am", ...label },
    { when: "Oct 15, 4:02 pm", title: "Picked up", detail: `From ${s.site}`, tone: "slate" as Tone },
    { when: "Oct 16, 3:40 am", title: "In transit", detail: "Left the regional hub", tone: "slate" as Tone },
    { when: "Oct 17, 7:55 am", title: "Delivery problem", detail: "Address incomplete: no unit number", tone: "amber" as Tone },
    { when: "Oct 17, 8:10 am", title: "Address corrected", detail: "We got the unit number from your customer and asked the carrier to update it", tone: "green" as Tone },
    { when: "Oct 17, 2:31 pm", title: "Delivered", detail: `${s.promised}, as promised`, tone: "green" as Tone },
  ];
  if (s.status === "Returned") ev.push({ when: "Oct 19, 11:20 am", title: "Return started", detail: "From your returns page", tone: "slate" }, { when: "Oct 21, 3:05 pm", title: "Back with you", detail: `Received at ${s.site}`, tone: "green" });
  return ev;
}

export function invoiceFor(sc: Scenario) {
  const shipping: Line[] =
    sc.id === "small"
      ? [{ item: "Parcel labels · USPS", qty: "190", unit: "", amount: 1501.0 }, { item: "Parcel labels · UPS", qty: "115", unit: "", amount: 1598.5 }, { item: "Carrier adjustments (weight, address)", qty: "3", unit: "", amount: 42.0 }]
      : sc.id === "canada"
      ? [{ item: "Parcel labels · UPS", qty: "1,700", unit: "", amount: 22100.0 }, { item: "Parcel labels · regional carrier (Texas & South)", qty: "1,330", unit: "", amount: 14630.0 }, { item: "Parcel labels · Canada Post + Purolator (from Toronto)", qty: "520", unit: "", amount: 5720.0 }, { item: "Carrier adjustments (weight, address)", qty: "14", unit: "", amount: 250.0 }]
      : sc.id === "stores"
        ? [{ item: "Parcel labels · regional carrier (AZ, CA, NV)", qty: "1,240", unit: "", amount: 16120.0 }, { item: "Parcel labels · UPS", qty: "280", unit: "", amount: 4200.0 }, { item: "Freight · orders over 70 lb", qty: "95", unit: "", amount: 6650.0 }, { item: "Carrier adjustments (weight, address)", qty: "9", unit: "", amount: 160.0 }]
        : [{ item: "Parcel labels · UPS", qty: "4,210", unit: "", amount: 54233.0 }, { item: "Parcel labels · USPS", qty: "2,980", unit: "", amount: 31675.0 }, { item: "Parcel labels · OnTrac (regional)", qty: "1,930", unit: "", amount: 15498.0 }, { item: "Carrier adjustments (weight, address)", qty: "38", unit: "", amount: 599.0 }];
  // Koherent adds the warehouse lines and the account fee to the same bill.
  const one = sc.warehouse
    ? [{ group: sc.warehouse.group, lines: sc.warehouse.lines }, { group: "Account", lines: [{ item: "Koherent account fee (account team, reports)", qty: "1", unit: "half month", amount: 1250 }] }]
    : [];
  // Audit credits for half a month match the savings split on Home.
  const audits = Math.max(Math.round(savingsFor(sc).audits / 2), 21);
  const groups = [
    { group: "Shipping", lines: shipping },
    ...one,
    { group: "Credits", lines: [{ item: "Credits from invoice audits (wrong weight, duplicate charges)", qty: String(Math.max(1, Math.round(audits / 9))), unit: "", amount: -audits }, ...(sc.warehouse ? [{ item: "Damage claim paid · SHP-47718", qty: "1", unit: "", amount: -186 }] : [])] },
  ];
  const all = groups.flatMap((g) => g.lines);
  const subtotal = all.filter((l) => l.amount > 0).reduce((a, l) => a + l.amount, 0);
  const credits = all.filter((l) => l.amount < 0).reduce((a, l) => a + l.amount, 0);
  const total = Math.round((subtotal + credits) * 100) / 100;
  const n = (k: number) => `INV-${sc.account.initials}-${k}`;
  const invoices = [
    { id: n(1016), period: "Oct 1–15", issued: "Oct 16", amount: total, status: "Open", due: "Oct 30" },
    { id: n(930), period: "Sep 16–30", issued: "Oct 1", amount: Math.round(total * 96.4) / 100, status: "Paid", due: "Oct 15" },
    { id: n(915), period: "Sep 1–15", issued: "Sep 16", amount: Math.round(total * 93.1) / 100, status: "Paid", due: "Sep 30" },
  ];
  return { groups, subtotal, credits, total, invoices };
}
