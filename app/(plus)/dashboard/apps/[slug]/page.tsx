import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEMPLATES, type TemplateId, type Value } from "@/components/console/apps";
import { AppSite } from "@/components/console/AppSite";
import { scenarios, type BrandId } from "@/components/console/scenarios";

// ── /dashboard/apps/<template> — a Shiplet on its own address ────────────────
// "Open app" in the dashboard opens this in a new tab, standing in for the
// customer's own domain (returns.alderandstone.com). ?account picks whose app,
// ?test=1 the test version, ?s the settings they changed. Sample data only.

export const metadata: Metadata = {
  title: "Shiplet | Koherent",
  description: "A Shiplet on its own address. Mockup.",
  robots: "noindex",
};

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.id }));
}

export default async function AppSitePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const q = await searchParams;
  if (!TEMPLATES.some((t) => t.id === slug)) notFound();
  const account = typeof q.account === "string" && q.account in scenarios ? (q.account as BrandId) : "reach";
  let settings: Record<string, Value> = {};
  try { if (typeof q.s === "string") settings = JSON.parse(q.s); } catch {}
  return <AppSite slug={slug as TemplateId} account={account} test={q.test === "1"} settings={settings} />;
}
