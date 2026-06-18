"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/icons";

const NAVY    = "#1C1E3D";
const ORANGE  = "#EC5A26";
const MUTED   = "#6E728A";
const BORDER  = "#E8E8E8";
const SURFACE = "#F8FAFB";

const SIGNUP = "https://app.shiptime.com/";
const signupUrl = (content: string) =>
  `${SIGNUP}?utm_source=shiptimelandin&utm_medium=landing&utm_campaign=signup&utm_content=${content}`;

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=100&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=100&auto=format&fit=crop",
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={16} height={16} viewBox="0 0 24 24" fill={ORANGE}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// Floating pill chip — same as original alternative page
function PillChip({ label, accent = "#E3EEFC" }: { label: string; accent?: string }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 pl-2.5 pr-4 py-2.5"
      style={{ background: "#fff", borderRadius: 14, boxShadow: "0 10px 30px rgba(28,30,61,0.16)", border: `1px solid ${BORDER}` }}
    >
      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: accent }}>
        <Icon.Check size={15} style={{ stroke: NAVY }} />
      </span>
      <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: NAVY, fontFamily: "var(--font-manrope), sans-serif" }}>{label}</span>
    </div>
  );
}

// The original photo-right visual from the alternative page
function HeroVisual({ photo }: { photo: string | null }) {
  return (
    <div className="relative" style={{ paddingTop: 8, paddingBottom: 8 }}>
      <div className="relative overflow-hidden mx-auto" style={{ borderRadius: 22, maxWidth: 380, boxShadow: "0 20px 60px rgba(28,30,61,0.16)" }}>
        {photo ? (
          <Image src={photo} alt="Ship smarter with ShipTime" width={760} height={950} className="block w-full h-auto object-cover" priority />
        ) : (
          <div className="flex items-center justify-center" style={{ aspectRatio: "4 / 5", background: "linear-gradient(135deg, #E3EEFC 0%, #FAF0EB 100%)" }}>
            <Icon.Package size={64} style={{ stroke: ORANGE, opacity: 0.45 }} />
          </div>
        )}
      </div>

      {/* Top-right pill */}
      <div className="absolute" style={{ top: 24, right: -8 }}>
        <PillChip label="Best rate found" accent="#E3EEFC" />
      </div>

      {/* Mid-right stacked notifications card */}
      <div className="absolute" style={{ top: "40%", right: -20, width: 230 }}>
        <div className="p-3" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 16px 44px rgba(28,30,61,0.18)", border: `1px solid ${BORDER}` }}>
          {[
            { c: ORANGE,    w: 78, hl: false },
            { c: "#E3EEFC", w: 64, hl: true  },
            { c: "#D7E9D4", w: 72, hl: false },
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl"
              style={{ background: row.hl ? SURFACE : "transparent", border: row.hl ? `1px solid ${BORDER}` : "1px solid transparent" }}
            >
              <span className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: row.c }} />
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="h-2 rounded-full" style={{ background: BORDER, width: `${row.w}%` }} />
                <span className="h-2 rounded-full" style={{ background: "#EFF1F4", width: `${row.w - 22}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom pill */}
      <div className="absolute" style={{ bottom: 28, left: 0 }}>
        <PillChip label="Canada Post ready" accent="#FAF0EB" />
      </div>
    </div>
  );
}

type Props = {
  competitorName: string;
  photo: string | null;
};

export default function AlternativeHero({ competitorName, photo }: Props) {
  return (
    <section
      className="w-full px-6 md:px-10 pt-28 pb-16 md:pt-36 md:pb-24"
      style={{ background: "#fff" }}
    >
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center" style={{ maxWidth: 1100 }}>

        {/* ── LEFT: Copy ── */}
        <div>
          {/* Trust badge */}
          <div className="flex items-center gap-2 mb-7">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill={ORANGE}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, fontFamily: "var(--font-manrope), sans-serif" }}>
                1,000+ five-star reviews
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-manrope), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: NAVY,
              marginBottom: "1.2rem",
            }}
          >
            The Best{" "}
            <em style={{ fontStyle: "italic", fontWeight: 300, color: "#8B90A8" }}>{competitorName}</em>{" "}
            Alternative.
          </h1>

          {/* Sub-headline */}
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 17,
              lineHeight: 1.65,
              color: MUTED,
              marginBottom: "2rem",
              maxWidth: 440,
            }}
          >
            ShipTime brings <strong style={{ color: NAVY, fontWeight: 600 }}>every carrier, one screen</strong> — compare rates, print labels, manage freight, and track every package from one platform.
          </p>

          {/* Avatar stack + social proof */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex">
              {AVATARS.map((src, i) => (
                <div
                  key={i}
                  className="relative rounded-full overflow-hidden flex-shrink-0"
                  style={{
                    width: 36, height: 36,
                    marginLeft: i === 0 ? 0 : -10,
                    border: "2px solid #fff",
                    boxShadow: "0 1px 4px rgba(28,30,61,0.15)",
                    zIndex: AVATARS.length - i,
                  }}
                >
                  <Image src={src} alt="customer" fill style={{ objectFit: "cover" }} sizes="36px" />
                </div>
              ))}
            </div>
            <div>
              <Stars />
              <p style={{ fontSize: 12.5, color: MUTED, fontFamily: "var(--font-inter), sans-serif", marginTop: 2 }}>
                <strong style={{ color: NAVY }}>500+</strong> businesses shipping smarter every day
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <a
              href={signupUrl("alt-hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-7 py-3.5 rounded-full text-white text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: NAVY, fontFamily: "var(--font-manrope), sans-serif", letterSpacing: "0.01em" }}
            >
              Start Shipping Free
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <p style={{ fontSize: 12, color: MUTED, fontFamily: "var(--font-inter), sans-serif" }}>
              No platform fee · No contract · Setup in 5 minutes
            </p>
          </div>
        </div>

        {/* ── RIGHT: original photo visual ── */}
        <div className="hidden md:block">
          <HeroVisual photo={photo} />
        </div>

      </div>
    </section>
  );
}
