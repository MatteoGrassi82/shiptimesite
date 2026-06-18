import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import VsPage from "@/components/ui/vs-page";
import { competitors, getCompetitor } from "@/lib/competitors";

export function generateStaticParams() {
  return competitors.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/vs/[competitor]">): Promise<Metadata> {
  const { competitor } = await params;
  const data = getCompetitor(competitor);
  if (!data) return {};
  const title = `Choose ShipTime over ${data.name} — Side-by-Side | ShipTime`;
  const description = `See why teams choose ShipTime over ${data.name}: no platform fee, Bring Your Own Rates, Canada Post, and courier plus LTL in one platform.`;
  return {
    title,
    description,
    alternates: { canonical: `/vs/${data.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

// Resolve which generated photos exist (build-time fs check), pass to the
// client component so it never touches the filesystem.
function resolveImages(slug: string): Record<string, string | null> {
  const keys = ["vs-hero", "vs-reason-1", "vs-reason-2"];
  const out: Record<string, string | null> = {};
  for (const k of keys) {
    const rel = `generated/${slug}-${k}.png`;
    out[k] = existsSync(join(process.cwd(), "public", rel)) ? `/${rel}` : null;
  }
  return out;
}

export default async function Page({ params }: PageProps<"/vs/[competitor]">) {
  const { competitor } = await params;
  const data = getCompetitor(competitor);
  if (!data) notFound();
  return <VsPage data={data} images={resolveImages(data.slug)} />;
}
