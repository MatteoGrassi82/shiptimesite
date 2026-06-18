import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AlternativePage from "@/components/ui/alternative-page";
import { competitors, getCompetitor } from "@/lib/competitors";

export function generateStaticParams() {
  return competitors.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/alternative/[competitor]">): Promise<Metadata> {
  const { competitor } = await params;
  const data = getCompetitor(competitor);
  if (!data) return {};
  const title = `${data.name} Alternative — Ship Smarter, No Platform Fee | ShipTime`;
  const description = `Looking for a ${data.name} alternative? ShipTime gives you multi-carrier rate shopping, Bring Your Own Rates, and Canada Post in one platform with no monthly platform fee.`;
  return {
    title,
    description,
    alternates: { canonical: `/alternative/${data.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function Page({ params }: PageProps<"/alternative/[competitor]">) {
  const { competitor } = await params;
  const data = getCompetitor(competitor);
  if (!data) notFound();
  return <AlternativePage data={data} />;
}
