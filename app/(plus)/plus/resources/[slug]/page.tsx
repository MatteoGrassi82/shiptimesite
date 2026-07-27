import { ResourcePage, generateResourceMetadata } from "@/components/sections/resources";
import { sanityFetch } from "@/sanity/lib/fetch";
import { RESOURCE_SLUGS_QUERY } from "@/sanity/queries";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: RESOURCE_SLUGS_QUERY,
    params: { site: "plus" },
    tags: ["resource"],
  });
  return (slugs || []).filter((s) => s.slug).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generateResourceMetadata({ zone: "plus", slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ResourcePage zone="plus" slug={slug} />;
}
