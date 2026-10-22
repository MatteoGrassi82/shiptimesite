"use client";

import { createContext, useContext } from "react";
import { scenarios, type Line, type Scenario } from "./scenarios";

// The account on screen, picked on the sign-in page.
export const ScenarioContext = createContext<Scenario>(scenarios.reach);
export const useScenario = () => useContext(ScenarioContext);

export type ShipStatus = "Delivered" | "In transit" | "Label created" | "Exception" | "Returned";
export type Shipment = { id: string; order: string; created: string; to: string; carrier: string; service: string; site: string; status: ShipStatus; cost: number; weight: string; promised: string };

const statuses: ShipStatus[] = ["Delivered", "Delivered", "In transit", "Delivered", "Label created", "In transit", "Exception", "Delivered", "Delivered", "Returned"];
const canadian = (city: string) => /, (ON|QC|BC|AB)$/.test(city);

export function shipmentsFor(sc: Scenario): Shipment[] {
  const heavy = sc.id === "stores";
  return Array.from({ length: 24 }, (_, i) => {
    const { city, site } = sc.cities[i % sc.cities.length];
    const ca = canadian(city);
    const store = city.startsWith("Store");
    const [carrier, service] = store ? ["Riverside routes", "Store delivery"] : ca ? (i % 2 ? ["Canada Post", "Expedited"] : ["Purolator", "Ground"]) : i % 3 === 0 ? ["UPS", "Ground"] : i % 3 === 1 ? (heavy ? ["Regional", "Heavy ground"] : ["USPS", "Ground Advantage"]) : ["OnTrac", "Ground"];
    return {
      id: `SHP-${48213 - i}`,
      order: `#${sc.account.initials}-${10482 - i}`,
      created: i < 6 ? `Today, ${9 + (i % 6)}:${i % 2 ? "14" : "42"}` : `${i < 14 ? "Yesterday" : "2 days ago"}`,
      to: city,
      carrier,
      service,
      site,
      status: statuses[i % statuses.length],
      cost: Math.round(((heavy ? 14 : ca ? 13 : 8) * 100 + ((i * 137) % 900))) / 100,
      weight: `${(heavy ? 18 + ((i * 7) % 20) : 1.2 + ((i * 7) % 40) / 10).toFixed(1)} lb`,
      promised: i % 3 === 0 ? "2 days" : "3 days",
    };
  });
}

export function eventsFor(s: Shipment) {
  return [
    { when: "Day 1, 9:14", title: "Label created", detail: `${s.carrier} ${s.service} · from ${s.site} · ${money(s.cost)} (your old rate ${money(s.cost * 1.31)})`, tone: "slate" },
    { when: "Day 1, 16:02", title: "Picked up", detail: `From ${s.site}`, tone: "slate" },
    { when: "Day 2, 03:40", title: "In transit", detail: "Departed regional hub", tone: "slate" },
    { when: "Day 3, 07:55", title: "Delivery problem", detail: "Address incomplete: missing unit number", tone: "amber" },
    { when: "Day 3, 08:10", title: "Fixed by ShipTime", detail: "Unit number added from the customer's order, carrier notified", tone: "green" },
    { when: "Day 3, 14:31", title: "Delivered", detail: `${s.promised}, as promised`, tone: "green" },
  ];
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
  const shipTotal = shipping.reduce((a, l) => a + l.amount, 0);
  // ShipTime One adds the warehouse lines and the account fee to the same bill.
  const one = sc.warehouse
    ? [{ group: sc.warehouse.group, lines: sc.warehouse.lines }, { group: "Account", lines: [{ item: "ShipTime One account fee (account team, reports)", qty: "1", unit: "half month", amount: 1250 }] }]
    : [];
  const groups = [
    { group: "Shipping", lines: shipping },
    ...one,
    { group: "Credits", lines: [{ item: "Refunds from invoice audits (late deliveries, wrong weight)", qty: String(Math.max(1, Math.round(shipTotal / 900))), unit: "", amount: -Math.round(shipTotal * 1.8) / 100 }, ...(sc.warehouse ? [{ item: "Damage claim paid · SHP-47718", qty: "1", unit: "", amount: -186 }] : [])] },
  ];
  const all = groups.flatMap((g) => g.lines);
  const subtotal = all.filter((l) => l.amount > 0).reduce((a, l) => a + l.amount, 0);
  const credits = all.filter((l) => l.amount < 0).reduce((a, l) => a + l.amount, 0);
  const total = Math.round((subtotal + credits) * 100) / 100;
  const invoices = [
    { id: "INV-1016", period: "1st – 15th, this month", issued: "16th", amount: total, status: "Open", due: "in 14 days" },
    { id: "INV-0930", period: "16th – end, last month", issued: "1st", amount: Math.round(total * 96.4) / 100, status: "Paid", due: "15th" },
    { id: "INV-0915", period: "1st – 15th, last month", issued: "16th", amount: Math.round(total * 93.1) / 100, status: "Paid", due: "30th" },
  ];
  return { groups, subtotal, credits, total, invoices };
}

export const money = (n: number) => (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
