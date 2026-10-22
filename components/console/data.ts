import type { BrandId } from "./scenarios";

// Sample data shared by every brand in the /dashboard mockup: the daily
// shipments curve (scaled per brand), Shiplets, and the Developers page.
// Brand-specific data (sites, plan, bill, problems) lives in scenarios.ts.

export const daily = [
  548, 571, 602, 588, 420, 312, 598, 615, 633, 610, 597, 401, 298, 640, 652, 671, 649, 630, 415, 305, 662, 684, 701, 690, 655, 428, 321, 702, 716, 698,
].map((v, i) => ({ day: i + 1, shipments: v, previous: Math.round(v * (0.9 + ((i * 7) % 10) / 100)) }));

export const apiKeys = [
  { name: "Publishable key", value: "pk_live_••••••••••••3fa2", created: "Jun 4, 2026", lastUsed: "2 min ago" },
  { name: "Secret key", value: "sk_live_••••••••••••91cd", created: "Jun 4, 2026", lastUsed: "2 min ago" },
  { name: "Shopify connection", value: "rk_live_••••••••••••7b10", created: "Jun 9, 2026", lastUsed: "Just now" },
];

export const webhooks = [
  { url: "https://hooks.example.com/shiptime", events: "shipment.delivered, shipment.exception", status: "Enabled", success: "99.8%" },
];

export const requestLog = [
  { time: "10:42:18", method: "POST", path: "/v1/shipments", status: 200, ms: 412, source: "Shopify" },
  { time: "10:42:11", method: "POST", path: "/v1/rates", status: 200, ms: 288, source: "Shopify" },
  { time: "10:41:57", method: "GET", path: "/v1/shipments/SHP-48210", status: 200, ms: 64, source: "ops dashboard" },
  { time: "10:41:02", method: "POST", path: "/v1/shipments", status: 422, ms: 120, source: "Shopify", error: "Address missing postal code" },
  { time: "10:40:48", method: "POST", path: "/v1/rates", status: 200, ms: 301, source: "Shopify" },
  { time: "10:39:30", method: "POST", path: "/v1/orders", status: 201, ms: 198, source: "NetSuite" },
  { time: "10:38:05", method: "GET", path: "/v1/tracking/1Z84…", status: 200, ms: 91, source: "Branded tracking" },
];

// Shiplets: one screen of ShipTime, filled in, for someone who doesn't ship.
// Every account can switch on the simple ones. Bigger ones are built with
// ShipTime One accounts on a setup call, then become templates for everyone
// (the way Shopify Flow started on Plus and moved to every plan).
export type ShipletStatus = "Live" | "Draft" | "Call booked";
export type ShipletMap = Record<string, ShipletStatus>;

export const shipletCatalog = [
  { id: "tracking", group: "For your customers", name: "Branded tracking page", who: "Your customers", what: "Your logo and delivery date instead of the carrier's page.", setup: "now", color: "#0EA5E9", use: "9,840 visits" },
  { id: "returns", group: "For your customers", name: "Returns page", who: "Your customers", what: "Customers start a return and print a label, or drop it at a store.", setup: "now", color: "#0EA5E9", use: "212 returns" },
  { id: "checkout", group: "For your customers", name: "Delivery dates at checkout", who: "Your shoppers", what: "A delivery date they can trust, before they pay.", setup: "now", color: "#0EA5E9", use: "3,120 orders" },
  { id: "case", group: "For people who don't ship", name: "Send a case", who: "Dental offices, for their lab", what: "Book a pickup, track the case, bill the lab.", setup: "call", color: "#F59E0B", use: "" },
  { id: "repair", group: "For people who don't ship", name: "Mail-in repair kit", who: "Repair shops' customers", what: "A box and a prepaid label, out and back, tracked.", setup: "call", color: "#F59E0B", use: "" },
  { id: "retrieval", group: "For people who don't ship", name: "Equipment return kit", who: "HR, IT and rental businesses", what: "Send a kit out, get the equipment back.", setup: "call", color: "#F59E0B", use: "" },
  { id: "counter", group: "For your stores and team", name: "Counter app", who: "Store staff", what: "Ship a customer's order from the store counter, one screen.", setup: "call", color: "#10B981", use: "" },
  { id: "storeorder", group: "For your stores and team", name: "Store order form", who: "Store managers", what: "Stores order stock from your warehouse; we route the delivery.", setup: "call", color: "#10B981", use: "" },
] as const;

export const shipletsAtStart: Record<BrandId, ShipletMap> = {
  small: {},
  canada: { returns: "Live" },
  stores: { tracking: "Live", counter: "Draft" },
  reach: { returns: "Live", counter: "Draft" },
};
