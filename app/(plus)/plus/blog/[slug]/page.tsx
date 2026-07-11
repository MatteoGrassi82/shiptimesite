import { BlogPost, generatePostMetadata } from "@/components/sections/cms-page";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POST_SLUGS_QUERY } from "@/sanity/queries";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: POST_SLUGS_QUERY,
    params: { site: "plus" },
    tags: ["post"],
  });
  return (slugs || []).filter((s) => s.slug).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generatePostMetadata({ zone: "plus", slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPost zone="plus" slug={slug} />;
}
