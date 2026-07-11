import { defineQuery } from "next-sanity";

// Shared projection for expanded images (asset url + LQIP for blur-up).
const imageFrag = /* groq */ `{
  ...,
  asset->{ _id, url, metadata { lqip, dimensions } }
}`;

// Page builder expansion: keep every block's fields, expand image-bearing
// blocks so the frontend has real asset URLs. The `site` filter is what makes
// one Sanity project serve two independent sites — coalesce so legacy docs with
// no `site` value fall into Core.
export const PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && coalesce(site, "core") == $site && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    site,
    seo,
    sections[]{
      ...,
      _type == "heroSection" => { ..., media ${imageFrag} },
      _type == "logoMarquee" => { ..., logos[] ${imageFrag} },
      _type == "richTextSection" => { ..., content[]{ ..., _type == "image" => ${imageFrag} } }
    }
  }
`);

export const PAGE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && coalesce(site, "core") == $site && defined(slug.current)]{
    "slug": slug.current
  }
`);

export const POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && coalesce(site, "core") == $site && defined(slug.current)]
  | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    pillar,
    publishedAt,
    mainImage ${imageFrag}
  }
`);

export const POST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && coalesce(site, "core") == $site && defined(slug.current)]{
    "slug": slug.current
  }
`);

export const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && coalesce(site, "core") == $site && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    pillar,
    publishedAt,
    mainImage ${imageFrag},
    body[]{ ..., markDefs[]{ ... } },
    seo,
    faq
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings" && coalesce(site, "core") == $site][0]{
    title,
    tagline,
    nav,
    primaryCta,
    footerNote
  }
`);
