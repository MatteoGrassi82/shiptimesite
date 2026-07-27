import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY, SOLUTION_PAGES_QUERY, SOLUTION_PAGE_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "./site-chrome";
import { PageHero } from "./plus-page-hero";
import { Container, CtaButton, Eyebrow, Heading, Lead, bandStyle } from "./primitives";
import type { FeatureItem, SiteSettings, SolutionPage as SolutionPageDoc, Zone } from "./types";

// P-T1 template: the Solutions index + persona detail pages. Fixed shape
// (hero → pains → capabilities → mini case study → related resources → CTA)
// rather than composed sections — see doc/master-plus.md C5/C12.

type IndexCard = {
  _id: string;
  title?: string;
  slug?: string;
  heroHeadline?: string;
  heroSubline?: string;
  heroImage?: { asset?: { url?: string } };
};

function getSettings(zone: Zone) {
  return sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: zone }, tags: ["siteSettings"] });
}

const base = (zone: Zone) => (zone === "plus" ? "/plus/solutions" : "/solutions");

export async function generateSolutionsIndexMetadata(): Promise<Metadata> {
  return {
    title: "Solutions — ShipTime Plus",
    description: "Four kinds of operations. Four different systems. One platform underneath.",
  };
}

export async function SolutionsIndex({ zone }: { zone: Zone }) {
  const [settings, pages] = await Promise.all([
    getSettings(zone),
    sanityFetch<IndexCard[]>({ query: SOLUTION_PAGES_QUERY, params: { site: zone }, tags: ["solutionPage"] }),
  ]);

  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main>
        <PageHero
          eyebrow="Solutions"
          heading="Built around who you are."
          lead="Four kinds of operations. Four different systems. One platform underneath."
          primaryCta={{ label: "Book a call", href: "/plus/book-a-call" }}
        />
        <section style={bandStyle("surface")}>
          <Container>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 }}>
              {(pages || []).map((p) => (
                <Link
                  key={p._id}
                  href={`${base(zone)}/${p.slug}`}
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
                  <span style={{ display: "block", aspectRatio: "16 / 9", position: "relative", background: "var(--surface-2)" }}>
                    {p.heroImage?.asset?.url && (
                      <Image src={p.heroImage.asset.url} alt={p.heroHeadline || p.title || ""} fill sizes="(max-width: 700px) 100vw, 380px" style={{ objectFit: "cover" }} />
                    )}
                  </span>
                  <span style={{ padding: "24px 24px 26px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    <span className="st-eyebrow" style={{ fontSize: 11.5 }}>
                      {p.title}
                    </span>
                    <span className="st-display" style={{ fontSize: 20, lineHeight: 1.25, color: "var(--ink)" }}>
                      {p.heroHeadline}
                    </span>
                    {p.heroSubline && (
                      <span className="st-body" style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>
                        {p.heroSubline}
                      </span>
                    )}
                    <span className="st-body" style={{ marginTop: "auto", fontSize: 12.5, color: "var(--brand)", fontWeight: 600 }}>
                      See the system →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}

function FeatureList({ items }: { items?: FeatureItem[] }) {
  if (!items?.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 32 }}>
      {items.map((f, i) => (
        <div key={f._key || i} style={{ borderLeft: "2px solid var(--brand)", paddingLeft: 18 }}>
          {f.title && (
            <h3 className="st-display" style={{ fontSize: 17, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
              {f.title}
            </h3>
          )}
          {f.body && (
            <p className="st-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
              {f.body}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export async function generateSolutionMetadata({ zone, slug }: { zone: Zone; slug: string }): Promise<Metadata> {
  const page = await sanityFetch<SolutionPageDoc | null>({ query: SOLUTION_PAGE_QUERY, params: { site: zone, slug }, tags: [`solutionPage:${slug}`] });
  if (!page) return {};
  return {
    title: page.seo?.metaTitle || `${page.heroHeadline || page.title} — ShipTime Plus`,
    description: page.seo?.metaDescription || page.heroSubline,
  };
}

export async function SolutionPage({ zone, slug }: { zone: Zone; slug: string }) {
  const [settings, page] = await Promise.all([
    getSettings(zone),
    sanityFetch<SolutionPageDoc | null>({ query: SOLUTION_PAGE_QUERY, params: { site: zone, slug }, tags: [`solutionPage:${slug}`, "solutionPage"] }),
  ]);
  if (!page) notFound();

  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main>
        <section style={{ ...bandStyle("page"), position: "relative", overflow: "hidden" }}>
          <Container style={{ display: "grid", gridTemplateColumns: page.heroImage?.asset?.url ? "minmax(0,1fr) minmax(0,1fr)" : "1fr", gap: 48, alignItems: "center" }}>
            <div>
              <Eyebrow>{page.title}</Eyebrow>
              <Heading as="h1" style={{ fontSize: "clamp(2.1rem, 4.6vw, 3.2rem)" }}>
                {page.heroHeadline}
              </Heading>
              {page.heroSubline && <Lead style={{ maxWidth: "56ch" }}>{page.heroSubline}</Lead>}
              <div style={{ marginTop: 30 }}>
                <CtaButton cta={page.cta || { label: "Book a call", href: "/plus/book-a-call" }} />
              </div>
            </div>
            {page.heroImage?.asset?.url && (
              <div style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: "var(--radius-section)", overflow: "hidden", border: "1px solid var(--line)" }}>
                <Image src={page.heroImage.asset.url} alt={page.heroImage.alt || page.heroHeadline || ""} fill sizes="(max-width: 900px) 100vw, 500px" style={{ objectFit: "cover" }} />
              </div>
            )}
          </Container>
        </section>

        <section style={bandStyle("surface")}>
          <Container>
            <Heading style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.1rem)" }}>Your operation today</Heading>
            <FeatureList items={page.pains} />
          </Container>
        </section>

        <section style={bandStyle("page")}>
          <Container>
            <Heading style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.1rem)" }}>The system we design</Heading>
            <FeatureList items={page.capabilities} />
            {page.proofStat?.value && (
              <div style={{ marginTop: 40, display: "inline-flex", flexDirection: "column", gap: 4, borderRadius: "var(--radius-card)", border: "1px solid var(--line)", background: "var(--card)", padding: "20px 26px" }}>
                <span className="st-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--brand)" }}>
                  {page.proofStat.value}
                </span>
                <span className="st-body" style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{page.proofStat.label}</span>
              </div>
            )}
          </Container>
        </section>

        {page.relatedCaseStudy && (
          <section style={bandStyle("contrast")}>
            <Container>
              <Eyebrow style={{ color: "var(--on-contrast)", opacity: 0.7 }}>Proof</Eyebrow>
              <Link href={`${zone === "plus" ? "/plus" : ""}/case-studies/${page.relatedCaseStudy.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span className="st-display" style={{ display: "block", fontSize: "clamp(1.4rem, 2.8vw, 2rem)" }}>
                  {page.relatedCaseStudy.headerStat}
                </span>
                <span className="st-body" style={{ display: "block", marginTop: 10, fontSize: 15, color: "color-mix(in oklab, var(--on-contrast) 78%, transparent)" }}>
                  {page.relatedCaseStudy.title} — {page.relatedCaseStudy.operation} →
                </span>
              </Link>
            </Container>
          </section>
        )}

        {!!page.relatedResources?.length && (
          <section style={bandStyle("surface")}>
            <Container>
              <Heading style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.8rem)" }}>Related resources</Heading>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginTop: 28 }}>
                {page.relatedResources.map((r) => (
                  <Link
                    key={r._id}
                    href={`${zone === "plus" ? "/plus" : ""}/resources/${r.slug}`}
                    className="st-lift"
                    style={{ display: "block", padding: "20px 22px", borderRadius: "var(--radius-card)", border: "1px solid var(--line)", background: "var(--card)", textDecoration: "none", color: "inherit" }}
                  >
                    <span className="st-eyebrow" style={{ fontSize: 11 }}>{r.resourceType}</span>
                    <span className="st-display" style={{ display: "block", marginTop: 8, fontSize: 16 }}>{r.title}</span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        <section style={bandStyle("brand")}>
          <Container style={{ textAlign: "center" }}>
            <Heading style={{ color: "var(--on-brand)", fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)" }}>Book a call</Heading>
            <div style={{ marginTop: 26 }}>
              <CtaButton cta={{ label: "Book a call", href: "/plus/book-a-call", style: "secondary" }} onContrast />
            </div>
          </Container>
        </section>
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}
