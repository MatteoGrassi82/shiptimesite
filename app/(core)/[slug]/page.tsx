import { CmsPage, generatePageMetadata } from "@/components/sections/cms-page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_SLUGS_QUERY } from "@/sanity/queries";

// Core marketing pages assembled from Sanity sections. Static routes (/vs,
// /blog, /alternative, /plus-films) and the home page take precedence; this
// catches every other single-segment path and renders its page doc, or 404s.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: PAGE_SLUGS_QUERY,
    params: { site: "core" },
    tags: ["page"],
  });
  return (slugs || []).filter((s) => s.slug).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generatePageMetadata({ zone: "core", slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPage zone="core" slug={slug} />;
}
