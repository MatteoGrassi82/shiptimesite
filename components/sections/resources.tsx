import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { RESOURCES_QUERY, RESOURCE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "./site-chrome";
import { LeadForm } from "./LeadForm";
import { PageHero } from "./plus-page-hero";
import { Container, Eyebrow, Heading, Lead, bandStyle } from "./primitives";
import type { ResourceCard, ResourceDoc, SiteSettings, Zone } from "./types";

// P-T4 template: the Resources hub + gated resource detail pages.

function getSettings(zone: Zone) {
  return sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: zone }, tags: ["siteSettings"] });
}

const base = (zone: Zone) => (zone === "plus" ? "/plus/resources" : "/resources");

const TYPE_LABEL: Record<string, string> = {
  guide: "Guide",
  whitepaper: "Whitepaper",
  webinar: "Webinar",
  teardown: "Teardown",
};

export async function generateResourcesIndexMetadata(): Promise<Metadata> {
  return { title: "Resources — ShipTime Plus", description: "Intelligence you can use before you ever call us." };
}

export async function ResourcesIndex({ zone }: { zone: Zone }) {
  const [settings, resources] = await Promise.all([
    getSettings(zone),
    sanityFetch<ResourceCard[]>({ query: RESOURCES_QUERY, params: { site: zone }, tags: ["resource"] }),
  ]);

  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main>
        <PageHero
          eyebrow="Resources"
          heading="Intelligence you can use before you ever call us."
          lead="Guides, whitepapers, webinars, and teardowns from designed engagements."
        />
        <section style={bandStyle("surface")}>
          <Container>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 22 }}>
              {(resources || []).map((r) => (
                <Link
                  key={r._id}
                  href={`${base(zone)}/${r.slug}`}
                  className="st-lift"
                  style={{ display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--radius-card)", overflow: "hidden", textDecoration: "none", color: "inherit" }}
                >
                  <span style={{ display: "block", aspectRatio: "16 / 9", position: "relative", background: "var(--surface-2)" }}>
                    {r.coverImage?.asset?.url && (
                      <Image src={r.coverImage.asset.url} alt={r.title || ""} fill sizes="(max-width: 700px) 100vw, 340px" style={{ objectFit: "cover" }} />
                    )}
                  </span>
                  <span style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    <span className="st-eyebrow" style={{ fontSize: 11 }}>{TYPE_LABEL[r.resourceType || "guide"]}</span>
                    <span className="st-display" style={{ fontSize: 17, lineHeight: 1.3, color: "var(--ink)" }}>{r.title}</span>
                    {r.summary && (
                      <span className="st-body" style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)" }}>{r.summary}</span>
                    )}
                  </span>
                </Link>
              ))}
              {(!resources || resources.length === 0) && (
                <p className="st-body" style={{ color: "var(--ink-2)" }}>Resources are on their way.</p>
              )}
            </div>
          </Container>
        </section>
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}

export async function generateResourceMetadata({ zone, slug }: { zone: Zone; slug: string }): Promise<Metadata> {
  const r = await sanityFetch<ResourceDoc | null>({ query: RESOURCE_QUERY, params: { site: zone, slug }, tags: [`resource:${slug}`] });
  if (!r) return {};
  return { title: r.seo?.metaTitle || `${r.title} — ShipTime Plus`, description: r.seo?.metaDescription || r.summary };
}

export async function ResourcePage({ zone, slug }: { zone: Zone; slug: string }) {
  const [settings, r] = await Promise.all([
    getSettings(zone),
    sanityFetch<ResourceDoc | null>({ query: RESOURCE_QUERY, params: { site: zone, slug }, tags: [`resource:${slug}`, "resource"] }),
  ]);
  if (!r) notFound();
  const isWebinar = r.resourceType === "webinar";

  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main>
        <section style={bandStyle("page")}>
          <Container style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: 48, alignItems: "start" }}>
            <div>
              <Link href={base(zone)} className="st-body" style={{ fontSize: 13.5, color: "var(--brand)", textDecoration: "none" }}>
                ← All resources
              </Link>
              <Eyebrow style={{ marginTop: 18 }}>{TYPE_LABEL[r.resourceType || "guide"]}</Eyebrow>
              <Heading as="h1" style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)" }}>{r.title}</Heading>
              {r.summary && <Lead>{r.summary}</Lead>}
              {r.coverImage?.asset?.url && (
                <div style={{ marginTop: 32, position: "relative", aspectRatio: "16/10", borderRadius: "var(--radius-section)", overflow: "hidden", border: "1px solid var(--line)" }}>
                  <Image src={r.coverImage.asset.url} alt={r.coverImage.alt || r.title || ""} fill sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: "cover" }} />
                </div>
              )}
              {!!r.learnBullets?.length && (
                <div style={{ marginTop: 36 }}>
                  <h2 className="st-display" style={{ fontSize: 16, margin: "0 0 14px" }}>What you&rsquo;ll learn</h2>
                  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
                    {r.learnBullets.map((b, i) => (
                      <li key={i} className="st-body" style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div style={{ position: "sticky", top: 96 }}>
              <LeadForm
                source={`resource:${slug}`}
                submitLabel={r.ctaLabel || (isWebinar ? "Register" : "Get the guide")}
                successHeading={isWebinar ? "You're registered." : "Check your inbox."}
                successBody={isWebinar ? "We'll send the joining link before the session — a human reads every registration." : "We've sent the download link — a human reads every request, so reply any time."}
                fields={[
                  { name: "firstname", label: "Name", type: "text", required: true },
                  { name: "company", label: "Company", type: "text", required: true },
                  { name: "email", label: "Work email", type: "email", required: true },
                ]}
              />
            </div>
          </Container>
        </section>
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}
