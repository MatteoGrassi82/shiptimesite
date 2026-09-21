import type React from "react";
import { Phone, Users, Handshake } from "lucide-react";

// ── Support ───────────────────────────────────────────────────────────────────
// Built around the one claim on shiptime.com that a competitor cannot copy
// cheaply: ShipTime talks to the carrier *for* you. Rate tables get matched and
// features get cloned; standing between a small shipper and a carrier's claims
// process is an operating cost rivals have to actually pay.
//
// Bilingual and the dedicated account manager come from shiptime.com's own
// "Heroic Support" section.

const ds = {
  navy:   "#1C1E3D",
  muted:  "#6E728A",
  orange: "#EC5A26",
  border: "#E8E8E8",
  surface:"#F8FAFB",
  white:  "#FFFFFF",
};

const sans: React.CSSProperties = { fontFamily: "var(--font-manrope), system-ui, sans-serif" };
const display: React.CSSProperties = {
  fontFamily: "var(--font-anton), Impact, 'Arial Narrow', sans-serif",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.005em",
  lineHeight: 0.96,
};

const PILLARS = [
  {
    Icon: Handshake,
    title: "We argue with the carrier, not you",
    body: "Lost parcel, damage claim, a charge that makes no sense — we take it to the carrier on your account's behalf and chase it to a resolution.",
  },
  {
    Icon: Users,
    title: "A named account manager",
    body: "Someone who knows your volume, your lanes and your busy season — not a queue position. Bilingual, English and French.",
  },
  {
    Icon: Phone,
    title: "A person, on the phone",
    body: "Phone, live chat or email, answered by people who ship for a living. No bot tier to get past first.",
  },
];

export default function ShipTimeSupport({ background = ds.surface }: { background?: string }) {
  return (
    <section className="px-5 md:px-10 py-20 md:py-28" style={{ background }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ ...sans, color: ds.orange }}>
            Support
          </p>
          <h2 className="mx-auto" style={{ ...display, color: ds.navy, fontSize: "clamp(1.8rem, 4.4vw, 2.8rem)", maxWidth: 640 }}>
            When a shipment goes wrong, you get a person
          </h2>
          <p className="mt-5 mx-auto" style={{ ...sans, fontSize: 16.5, lineHeight: 1.6, color: ds.muted, maxWidth: 520 }}>
            Every carrier has a claims process. Almost none of them are built for
            a business your size. That is the part we take off your desk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {PILLARS.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col px-7 py-8"
              style={{ background: ds.white, border: `1px solid ${ds.border}`, borderRadius: 18, boxShadow: "0 2px 16px rgba(28,30,61,0.05)" }}
            >
              <span
                className="flex items-center justify-center mb-5"
                style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(236,90,38,0.10)" }}
              >
                <Icon size={21} style={{ stroke: ds.orange }} />
              </span>
              <h3 className="mb-3" style={{ ...display, color: ds.navy, fontSize: "1.2rem", lineHeight: 1.05 }}>{title}</h3>
              <p style={{ ...sans, fontSize: 14.5, lineHeight: 1.65, color: ds.muted }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
