import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { Container, Heading } from "./primitives";
import type { RichTextBlock } from "./types";

// Portable Text renderer, token-styled so long-form content matches whichever
// zone it renders in. Reused by the blog post body too.
export const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ margin: "0 0 18px", fontSize: 16.5, lineHeight: 1.7, color: "var(--ink-2)" }}>{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="st-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", margin: "40px 0 14px" }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="st-display" style={{ fontSize: "1.3rem", margin: "30px 0 10px" }}>{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{ margin: "24px 0", padding: "6px 0 6px 20px", borderLeft: "3px solid var(--brand)", color: "var(--ink)", fontSize: 18, lineHeight: 1.6 }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ color: "var(--ink)", fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = (value?.href as string) || "#";
      const external = !href.startsWith("/");
      return (
        <a
          href={href}
          style={{ color: "var(--brand)", textDecoration: "underline", textUnderlineOffset: 2 }}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ margin: "0 0 18px", paddingLeft: 22, color: "var(--ink-2)", fontSize: 16.5, lineHeight: 1.7 }}>{children}</ul>
    ),
    number: ({ children }) => (
      <ol style={{ margin: "0 0 18px", paddingLeft: 22, color: "var(--ink-2)", fontSize: 16.5, lineHeight: 1.7 }}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li>,
    number: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = (value.asset.url as string) || urlFor(value).width(1400).url();
      return (
        <span style={{ display: "block", margin: "28px 0", borderRadius: "var(--radius-card)", overflow: "hidden", border: "1px solid var(--line)" }}>
          <Image src={url} alt={(value.alt as string) || ""} width={1400} height={800} style={{ width: "100%", height: "auto", display: "block" }} />
        </span>
      );
    },
  },
};

export function RichText({ heading, content }: RichTextBlock) {
  if (!content?.length && !heading) return null;
  return (
    <section style={{ background: "var(--page)", color: "var(--ink)", padding: "clamp(48px, 7vw, 96px) 0" }}>
      <Container style={{ maxWidth: 760 }}>
        {heading && <Heading style={{ marginBottom: 24 }}>{heading}</Heading>}
        {content && content.length > 0 && (
          <PortableText value={content as never} components={portableComponents} />
        )}
      </Container>
    </section>
  );
}
