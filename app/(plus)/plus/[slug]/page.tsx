import { CmsPage, generatePageMetadata } from "@/components/sections/cms-page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_SLUGS_QUERY } from "@/sanity/queries";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: PAGE_SLUGS_QUERY,
    params: { site: "plus" },
    tags: ["page"],
  });
  // "home" is served by /plus itself, not /plus/home.
  return (slugs || []).filter((s) => s.slug && s.slug !== "home").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generatePageMetadata({ zone: "plus", slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPage zone="plus" slug={slug} />;
}
