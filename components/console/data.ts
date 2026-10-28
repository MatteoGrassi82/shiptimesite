import type { BrandId } from "./scenarios";

// Sample data shared by every brand in the /dashboard mockup: the daily
// shipments curve (scaled per brand), the standard features, and the
// Developers page.
// Brand-specific data (sites, plan, bill, problems) lives in scenarios.ts.

// The last 30 days, Sep 23 to today (Thursday, Oct 22), with quieter weekends.
// Home scales it per account so the 30 days add up to that account's orders.
const WEEKDAY = [0.52, 1.02, 1.0, 0.98, 0.97, 0.93, 0.66]; // Sunday to Saturday
export const daily = Array.from({ length: 30 }, (_, i) => {
  const dt = new Date(2026, 8, 23 + i);
  const shipments = Math.round((600 + i * 2.6) * WEEKDAY[dt.getDay()]);
  return { day: i + 1, label: `${dt.getMonth() === 8 ? "Sep" : "Oct"} ${dt.getDate()}`, shipments, previous: Math.round(shipments * (0.9 + ((i * 7) % 10) / 100)) };
});

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

// Standard features any account can switch on: a branded tracking page, a
// returns page, delivery dates at checkout. They're not Shiplets: a Shiplet is
// the one custom app an account builds with us (apps.ts).
export type FeatureMap = Record<string, boolean>;

export const featuresAtStart: Record<BrandId, FeatureMap> = {
  small: {},
  canada: { returns: true },
  stores: { tracking: true },
  reach: {},
};
