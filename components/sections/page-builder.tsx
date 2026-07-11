import type { Block } from "./types";
import { Hero } from "./Hero";
import { FeatureGrid } from "./FeatureGrid";
import { LogoMarquee } from "./LogoMarquee";
import { MetricStats } from "./MetricStats";
import { Testimonials } from "./Testimonials";
import { Faq } from "./Faq";
import { Cta } from "./Cta";
import { RichText } from "./RichText";
import { Booking } from "./Booking";

// The registry: maps a Sanity block `_type` to its React section. This is the
// heart of "every other page is assembled from sections" — the [slug] route
// fetches an ordered array of blocks and this renders them in order, each block
// wearing the zone brand via tokens. Add a new section: build the component,
// add its schema type, and add one case here.
export function PageBuilder({ sections }: { sections?: Block[] }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((block) => {
        switch (block._type) {
          case "heroSection":
            return <Hero key={block._key} {...block} />;
          case "featureGrid":
            return <FeatureGrid key={block._key} {...block} />;
          case "logoMarquee":
            return <LogoMarquee key={block._key} {...block} />;
          case "metricStats":
            return <MetricStats key={block._key} {...block} />;
          case "testimonialSection":
            return <Testimonials key={block._key} {...block} />;
          case "faqSection":
            return <Faq key={block._key} {...block} />;
          case "ctaSection":
            return <Cta key={block._key} {...block} />;
          case "richTextSection":
            return <RichText key={block._key} {...block} />;
          case "bookingEmbed":
            return <Booking key={block._key} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
