import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PAGE_QUERY,
  POST_QUERY,
  POSTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/queries";
import { PageBuilder } from "./page-builder";
import { ZoneFooter, ZoneNav } from "./site-chrome";
import { portableComponents } from "./RichText";
import { Container } from "./primitives";
import type { Block, SanityImage, SiteSettings, Zone } from "./types";

// One set of templates that both zones reuse. The only difference between the
// Core blog and the Plus blog is the `zone`/`site` value threaded through — the
// same components render in either brand via the [data-zone] tokens.

type Seo = { metaTitle?: string; metaDescription?: string; canonicalUrl?: string };
type PageDoc = { title?: string; sections?: Block[]; seo?: Seo } | null;
type PostCard = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  pillar?: string;
  publishedAt?: string;
  mainImage?: SanityImage;
};
type PostDoc =
  | (PostCard & { body?: unknown[]; faq?: { question?: string; answer?: string }[]; seo?: Seo })
  | null;

const blogBase = (zone: Zone) => (zone === "plus" ? "/plus/blog" : "/blog");

function getSettings(zone: Zone) {
  return sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    params: { site: zone },
    tags: ["siteSettings"],
  });
}

// ── Composed marketing page ([slug]) ──────────────────────────────
export async function generatePageMetadata({ zone, slug }: { zone: Zone; slug: string }): Promise<Metadata> {
  const page = await sanityFetch<PageDoc>({
    query: PAGE_QUERY,
    params: { site: zone, slug },
    tags: [`page:${slug}`],
  });
  if (!page) return {};
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    alternates: page.seo?.canonicalUrl ? { canonical: page.seo.canonicalUrl } : undefined,
  };
}

export async function CmsPage({ zone, slug }: { zone: Zone; slug: string }) {
  const [settings, page] = await Promise.all([
    getSettings(zone),
    sanityFetch<PageDoc>({
      query: PAGE_QUERY,
      params: { site: zone, slug },
      tags: [`page:${slug}`, "page"],
    }),
  ]);
  if (!page) notFound();
  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main>
        <PageBuilder sections={page.sections} />
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}

// ── Blog index ────────────────────────────────────────────────────
export async function BlogIndex({ zone }: { zone: Zone }) {
  const [settings, posts] = await Promise.all([
    getSettings(zone),
    sanityFetch<PostCard[]>({ query: POSTS_QUERY, params: { site: zone }, tags: ["post"] }),
  ]);
  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main style={{ background: "var(--page)", color: "var(--ink)", minHeight: "60vh", padding: "clamp(48px, 7vw, 96px) 0" }}>
        <Container>
          <p className="st-eyebrow" style={{ fontSize: 12.5, marginBottom: 14 }}>
            Blog
          </p>
          <h1 className="st-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "0 0 40px" }}>
            {zone === "plus" ? "The network layer" : "Ship smarter"}
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
            {(posts || []).map((p) => (
              <Link
                key={p._id}
                href={`${blogBase(zone)}/${p.slug}`}
                className="st-lift"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {p.mainImage?.asset?.url && (
                  <span style={{ display: "block", aspectRatio: "16 / 9", position: "relative", background: "var(--surface-2)" }}>
                    <Image src={p.mainImage.asset.url} alt={p.mainImage.alt || p.title || ""} fill sizes="(max-width: 700px) 100vw, 360px" style={{ objectFit: "cover" }} />
                  </span>
                )}
                <span style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <span className="st-display" style={{ fontSize: 18, lineHeight: 1.3, color: "var(--ink)" }}>
                    {p.title}
                  </span>
                  {p.excerpt && (
                    <span className="st-body" style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>
                      {p.excerpt}
                    </span>
                  )}
                  <span className="st-body" style={{ marginTop: "auto", fontSize: 12.5, color: "var(--brand)", fontWeight: 600 }}>
                    Read →
                  </span>
                </span>
              </Link>
            ))}
          </div>
          {(!posts || posts.length === 0) && (
            <p className="st-body" style={{ color: "var(--ink-2)" }}>No posts yet.</p>
          )}
        </Container>
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}

// ── Blog post ─────────────────────────────────────────────────────
export async function generatePostMetadata({ zone, slug }: { zone: Zone; slug: string }): Promise<Metadata> {
  const post = await sanityFetch<PostDoc>({
    query: POST_QUERY,
    params: { site: zone, slug },
    tags: [`post:${slug}`],
  });
  if (!post) return {};
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    alternates: post.seo?.canonicalUrl ? { canonical: post.seo.canonicalUrl } : undefined,
  };
}

export async function BlogPost({ zone, slug }: { zone: Zone; slug: string }) {
  const [settings, post] = await Promise.all([
    getSettings(zone),
    sanityFetch<PostDoc>({
      query: POST_QUERY,
      params: { site: zone, slug },
      tags: [`post:${slug}`, "post"],
    }),
  ]);
  if (!post) notFound();
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main style={{ background: "var(--page)", color: "var(--ink)", padding: "clamp(40px, 6vw, 80px) 0" }}>
        <Container style={{ maxWidth: 760 }}>
          <Link href={blogBase(zone)} className="st-body" style={{ fontSize: 13.5, color: "var(--brand)", textDecoration: "none" }}>
            ← All posts
          </Link>
          <h1 className="st-display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", margin: "18px 0 12px", lineHeight: 1.08 }}>
            {post.title}
          </h1>
          {date && (
            <p className="st-body" style={{ color: "var(--ink-3)", fontSize: 13.5, margin: 0 }}>
              {date}
            </p>
          )}
          {post.mainImage?.asset?.url && (
            <div style={{ margin: "28px 0", borderRadius: "var(--radius-section)", overflow: "hidden", border: "1px solid var(--line)" }}>
              <Image src={post.mainImage.asset.url} alt={post.mainImage.alt || post.title || ""} width={1400} height={800} style={{ width: "100%", height: "auto", display: "block" }} priority />
            </div>
          )}
          {Array.isArray(post.body) && post.body.length > 0 && (
            <PortableText value={post.body as never} components={portableComponents} />
          )}
          {post.faq && post.faq.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 className="st-display" style={{ fontSize: "1.5rem", marginBottom: 12 }}>
                Frequently asked
              </h2>
              {post.faq.map((f, i) => (
                <details key={i} style={{ borderTop: "1px solid var(--line)", padding: "14px 0" }}>
                  <summary className="st-body" style={{ fontWeight: 600, cursor: "pointer", color: "var(--ink)" }}>
                    {f.question}
                  </summary>
                  <p className="st-body" style={{ margin: "10px 0 0", color: "var(--ink-2)", lineHeight: 1.65 }}>
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          )}
        </Container>
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}
