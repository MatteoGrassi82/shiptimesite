import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { Container } from "./primitives";
import type { LogoMarqueeBlock } from "./types";

export function LogoMarquee({ heading, logos }: LogoMarqueeBlock) {
  const items = (logos || []).filter((l) => l?.asset?.url);
  if (!items.length && !heading) return null;

  return (
    <section
      style={{
        background: "var(--page)",
        color: "var(--ink)",
        padding: "clamp(40px, 5vw, 72px) 0",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      {heading && (
        <Container>
          <p className="st-eyebrow" style={{ textAlign: "center", fontSize: 11.5, marginBottom: 28 }}>
            {heading}
          </p>
        </Container>
      )}
      {items.length > 0 && (
        <Marquee pauseOnHover className="[--duration:34s]">
          {items.map((l, i) => (
            <Image
              key={l.asset?._id || i}
              src={l.asset!.url!}
              alt={l.alt || ""}
              width={150}
              height={40}
              style={{ height: 34, width: "auto", objectFit: "contain", opacity: 0.72, margin: "0 30px" }}
            />
          ))}
        </Marquee>
      )}
    </section>
  );
}
