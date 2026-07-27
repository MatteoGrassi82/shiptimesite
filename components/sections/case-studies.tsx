import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CASE_STUDIES_QUERY, CASE_STUDY_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ZoneFooter, ZoneNav } from "./site-chrome";
import { portableComponents } from "./RichText";
import { PageHero } from "./plus-page-hero";
import { Container, CtaButton, Eyebrow, Heading, Lead, bandStyle } from "./primitives";
import type { CaseStudyCard, CaseStudyDoc, SiteSettings, Zone } from "./types";

// P-T2 template: case study index + detail. Fixed shape per doc/master-plus.md
// C6: header stat, the operation, the problem, the system, the results, quote.

function getSettings(zone: Zone) {
  return sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, params: { site: zone }, tags: ["siteSettings"] });
}

const base = (zone: Zone) => (zone === "plus" ? "/plus/case-studies" : "/case-studies");

export async function generateCaseStudiesIndexMetadata(): Promise<Metadata> {
  return { title: "Case studies — ShipTime Plus", description: "Proof, not promises." };
}

export async function CaseStudiesIndex({ zone }: { zone: Zone }) {
  const [settings, studies] = await Promise.all([
    getSettings(zone),
    sanityFetch<CaseStudyCard[]>({ query: CASE_STUDIES_QUERY, params: { site: zone }, tags: ["caseStudy"] }),
  ]);

  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main>
        <PageHero
          eyebrow="Case studies"
          heading="Proof, not promises."
          lead="Every Plus engagement starts with a designed proposal and ends with measured results. Here's what that looks like in the wild."
          primaryCta={{ label: "Book a call", href: "/plus/book-a-call" }}
        />
        <section style={bandStyle("surface")}>
          <Container>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
              {(studies || []).map((s) => (
                <Link
                  key={s._id}
                  href={`${base(zone)}/${s.slug}`}
                  className="st-lift"
                  style={{ display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--radius-card)", overflow: "hidden", textDecoration: "none", color: "inherit" }}
                >
                  <span style={{ display: "block", aspectRatio: "16 / 9", position: "relative", background: "var(--surface-2)" }}>
                    {s.coverImage?.asset?.url && (
                      <Image src={s.coverImage.asset.url} alt={s.title || ""} fill sizes="(max-width: 700px) 100vw, 380px" style={{ objectFit: "cover" }} />
                    )}
                  </span>
                  <span style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    {s.headerStat && (
                      <span className="st-display" style={{ fontSize: 22, color: "var(--brand)" }}>
                        {s.headerStat}
                      </span>
                    )}
                    <span className="st-display" style={{ fontSize: 17, lineHeight: 1.3, color: "var(--ink)" }}>
                      {s.title}
                    </span>
                    {s.operation && (
                      <span className="st-body" style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
                        {s.operation}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
              {(!studies || studies.length === 0) && (
                <p className="st-body" style={{ color: "var(--ink-2)" }}>Case studies are being written up — check back soon.</p>
              )}
            </div>
          </Container>
        </section>
        <section style={bandStyle("brand")}>
          <Container style={{ textAlign: "center" }}>
            <Heading style={{ color: "var(--on-brand)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Your operation could be next.</Heading>
            <div style={{ marginTop: 24 }}>
              <CtaButton cta={{ label: "Book a call", href: "/plus/book-a-call", style: "secondary" }} onContrast />
            </div>
          </Container>
        </section>
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}

export async function generateCaseStudyMetadata({ zone, slug }: { zone: Zone; slug: string }): Promise<Metadata> {
  const cs = await sanityFetch<CaseStudyDoc | null>({ query: CASE_STUDY_QUERY, params: { site: zone, slug }, tags: [`caseStudy:${slug}`] });
  if (!cs) return {};
  return { title: cs.seo?.metaTitle || `${cs.title} — ShipTime Plus`, description: cs.seo?.metaDescription || cs.operation };
}

export async function CaseStudyPage({ zone, slug }: { zone: Zone; slug: string }) {
  const [settings, cs] = await Promise.all([
    getSettings(zone),
    sanityFetch<CaseStudyDoc | null>({ query: CASE_STUDY_QUERY, params: { site: zone, slug }, tags: [`caseStudy:${slug}`, "caseStudy"] }),
  ]);
  if (!cs) notFound();

  return (
    <>
      <ZoneNav zone={zone} settings={settings} />
      <main>
        <section style={bandStyle("page")}>
          <Container style={{ maxWidth: 820 }}>
            <Link href={base(zone)} className="st-body" style={{ fontSize: 13.5, color: "var(--brand)", textDecoration: "none" }}>
              ← All case studies
            </Link>
            {cs.anonymized && (
              <p className="st-eyebrow" style={{ fontSize: 11, marginTop: 18 }}>
                Anonymized — shared pending customer permission
              </p>
            )}
            {cs.headerStat && (
              <div className="st-display" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", color: "var(--brand)", marginTop: 10 }}>
                {cs.headerStat}
              </div>
            )}
            <Heading as="h1" style={{ marginTop: 12, fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)" }}>
              {cs.title}
            </Heading>
            {cs.coverImage?.asset?.url && (
              <div style={{ marginTop: 32, position: "relative", aspectRatio: "16/9", borderRadius: "var(--radius-section)", overflow: "hidden", border: "1px solid var(--line)" }}>
                <Image src={cs.coverImage.asset.url} alt={cs.coverImage.alt || cs.title || ""} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
              </div>
            )}
          </Container>
        </section>

        <section style={bandStyle("surface")}>
          <Container style={{ maxWidth: 820, display: "grid", gap: 40 }}>
            {cs.operation && (
              <div>
                <Eyebrow>The operation</Eyebrow>
                <p className="st-body" style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)", margin: 0 }}>{cs.operation}</p>
              </div>
            )}
            {cs.problem && (
              <div>
                <Eyebrow>The problem</Eyebrow>
                <p className="st-body" style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)", margin: 0 }}>{cs.problem}</p>
              </div>
            )}
            {Array.isArray(cs.system) && cs.system.length > 0 && (
              <div>
                <Eyebrow>The system</Eyebrow>
                <PortableText value={cs.system as never} components={portableComponents} />
              </div>
            )}
          </Container>
        </section>

        {!!cs.results?.length && (
          <section style={bandStyle("page")}>
            <Container>
              <Eyebrow>The results</Eyebrow>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, marginTop: 20 }}>
                {cs.results.map((r, i) => (
                  <div key={r._key || i}>
                    <div className="st-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "var(--brand)" }}>{r.value}</div>
                    <div className="st-body" style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 4 }}>{r.label}</div>
                    {r.caption && <div className="st-body" style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{r.caption}</div>}
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {cs.quote?.quote ? (
          <section style={bandStyle("contrast")}>
            <Container style={{ maxWidth: 720 }}>
              <p className="st-display" style={{ fontSize: "clamp(1.3rem, 2.6vw, 1.8rem)", lineHeight: 1.4 }}>&ldquo;{cs.quote.quote}&rdquo;</p>
              {cs.quote.author && (
                <p className="st-body" style={{ marginTop: 18, fontSize: 14, opacity: 0.75 }}>
                  {cs.quote.author}{cs.quote.role ? `, ${cs.quote.role}` : ""}
                </p>
              )}
            </Container>
          </section>
        ) : (
          <section style={bandStyle("contrast")}>
            <Container style={{ maxWidth: 720 }}>
              <p className="st-body" style={{ fontSize: 14, opacity: 0.6, fontStyle: "italic" }}>Pull quote pending customer sign-off.</p>
            </Container>
          </section>
        )}

        <section style={bandStyle("brand")}>
          <Container style={{ textAlign: "center" }}>
            <Heading style={{ color: "var(--on-brand)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Your operation could be next.</Heading>
            <div style={{ marginTop: 24 }}>
              <CtaButton cta={{ label: "Book a call", href: "/plus/book-a-call", style: "secondary" }} onContrast />
            </div>
          </Container>
        </section>
      </main>
      <ZoneFooter zone={zone} settings={settings} />
    </>
  );
}
