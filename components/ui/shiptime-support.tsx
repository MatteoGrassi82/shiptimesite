"use client";

import type React from "react";
import Image from "next/image";
import { Check, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import FloatProp from "@/components/ui/float-prop";

// ── Support ───────────────────────────────────────────────────────────────────
// Built on the one claim in ShipTime's support story a competitor cannot copy
// cheaply: we take it to the carrier for you. Rate tables get matched and
// features get cloned; standing between a small shipper and a carrier's claims
// process is an operating cost a rival has to actually pay.
//
// Design follows the feature tour rather than the generic card grid — warm
// field, portrait on a beige card, a live claim widget riding its corner, props
// breaking the edges. The photo is the courier that used to sit in "No strings
// attached", which this section replaced.

const ds = {
  navy:   "#1C1E3D",
  body:   "#4B4F66",
  muted:  "#6E728A",
  orange: "#EC5A26",
  green:  "#3FA864",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
  field:  "#ECEAE7",
};

const CARD_BG = "linear-gradient(180deg, #E8E2DA 0%, #DBD3C8 100%)";
const widgetShadow = "0 18px 44px rgba(28,30,61,0.20)";

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
  color: ds.navy,
};

const PILLARS: [string, string][] = [
  ["We argue with the carrier, not you", "Lost parcel, damage, a charge that makes no sense — we take it to the carrier on your account's behalf and chase it to a resolution."],
  ["A named account manager", "Someone who knows your volume, your lanes and your busy season — not a queue position. Bilingual, English and French."],
  ["A person, on the phone", "Phone, live chat or email, answered by people who ship for a living. No bot tier to get past first."],
];

// The claim moving through the states a carrier would make you chase yourself.
function ClaimWidget() {
  const steps: [string, boolean][] = [
    ["Claim filed with carrier", true],
    ["ShipTime chasing carrier", true],
    ["Refunded to your account", false],
  ];
  return (
    <div style={{ width: 208 }}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[12px] font-extrabold" style={{ ...sans, color: ds.navy }}>Damage claim</span>
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ ...sans, background: "rgba(236,90,38,0.12)", color: ds.orange }}>#ST-48201</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {steps.map(([label, done], i) => (
          <div key={label} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl" style={{ background: done ? ds.surface : ds.white, border: `1px solid ${done ? ds.border : "#EFEDEA"}` }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: done ? "rgba(63,168,100,0.16)" : "rgba(28,30,61,0.06)" }}>
              {done
                ? <Check size={10} style={{ stroke: ds.green, strokeWidth: 3.5 }} />
                : <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(28,30,61,0.22)" }} />}
            </span>
            <span className="text-[11px] font-semibold leading-tight" style={{ ...sans, color: done ? ds.navy : ds.muted }}>{label}</span>
            {i === 1 && <span className="ml-auto text-[9px] font-bold uppercase tracking-wider" style={{ ...sans, color: ds.orange }}>Us</span>}
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        <Phone size={11} style={{ stroke: ds.orange }} />
        <span className="text-[11px] font-semibold" style={{ ...sans, color: ds.body }}>You did not make this call</span>
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 pl-2 pr-3.5 py-2" style={{ background: ds.white, borderRadius: 999, boxShadow: widgetShadow, border: `1px solid ${ds.border}` }}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ds.green }}>
        <Check size={11} style={{ stroke: "#fff", strokeWidth: 3.5 }} />
      </span>
      <span className="text-[12px] font-bold whitespace-nowrap" style={{ ...sans, color: ds.navy }}>{label}</span>
    </div>
  );
}

export default function ShipTimeSupport({ background = ds.field }: { background?: string }) {
  return (
    <section className="relative overflow-hidden px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div className="relative" style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ ...sans, color: ds.orange }}>Support</p>
          <h2 className="mx-auto" style={{ ...display, fontSize: "clamp(1.9rem, 4.6vw, 3rem)", maxWidth: 660 }}>
            When a shipment goes wrong, you get a person
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.6, color: ds.body, maxWidth: 520 }}>
            Every carrier has a claims process. Almost none of them are built for a
            business your size. That is the part we take off your desk.
          </p>
        </Reveal>

        <div className="grid items-center gap-10 md:gap-16 md:grid-cols-2">
          {/* portrait card */}
          <div className="relative mx-auto w-full md:order-2" style={{ maxWidth: 440 }}>
            <div className="relative w-full overflow-hidden" style={{ borderRadius: 28, aspectRatio: "3 / 4", background: CARD_BG }}>
              <Image
                src="/generated/core-include-pickup.png"
                alt="A ShipTime courier collecting a parcel"
                fill
                className="object-cover"
                style={{ objectPosition: "center 22%" }}
                sizes="(max-width: 768px) 90vw, 440px"
              />
            </div>
            <div className="absolute -right-2 top-6 md:-right-5">
              <Chip label="Claim resolved" />
            </div>
            <div className="absolute -left-3 bottom-6 md:-left-6">
              <div className="p-3" style={{ background: ds.white, borderRadius: 16, boxShadow: widgetShadow, border: `1px solid ${ds.border}`, minWidth: 176 }}>
                <ClaimWidget />
              </div>
            </div>
            <FloatProp prop="coin" size={72} rotate={-16} style={{ right: -34, bottom: "16%" }} />
          </div>

          {/* pillars */}
          <Reveal className="md:order-1">
            <ul className="flex flex-col gap-7 list-none p-0 m-0" style={{ maxWidth: 460 }}>
              {PILLARS.map(([title, body], i) => (
                <li key={title} className="flex items-start gap-4">
                  <span
                    className="flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
                    style={{ ...sans, width: 30, height: 30, borderRadius: 999, background: ds.white, color: ds.orange, border: `1px solid ${ds.border}`, marginTop: 2 }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="mb-2" style={{ ...display, fontSize: "1.22rem", lineHeight: 1.06 }}>{title}</h3>
                    <p style={{ ...sans, fontSize: 15, lineHeight: 1.65, color: ds.body }}>{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <FloatProp prop="parcel" size={104} rotate={13} style={{ left: "-2%", top: "14%" }} />
    </section>
  );
}
