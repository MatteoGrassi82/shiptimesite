"use client";

import React from "react";
import { BarChart3, Boxes, CreditCard, Database, Plane, ShoppingCart, Store, Truck } from "lucide-react";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";

// Vendored "orbiting circles 02" (shadcnspace) adapted for ShipTime Plus:
// remote brand SVGs swapped for lucide category icons (storefronts, ERPs,
// carriers, analytics — the integration library), palette pinned to the Plus
// kit (navy ink, orange accent, hairline borders), and every animation gated
// behind prefers-reduced-motion. Rings counter-rotate their chips so icons
// stay upright while orbiting the half-visible particle globe at the bottom.

type OrbitIcon = { Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; angle: number; accent?: boolean };

const orbits: { size: string; duration: number; icons: OrbitIcon[] }[] = [
  {
    size: "w-110 h-110 md:w-180 md:h-180",
    duration: 18,
    icons: [
      { Icon: ShoppingCart, label: "Storefronts", angle: -60 },
      { Icon: Store, label: "Marketplaces", angle: 0, accent: true },
      { Icon: Boxes, label: "Warehouses", angle: 60 },
    ],
  },
  {
    size: "w-150 h-150 md:w-220 md:h-220",
    duration: 24,
    icons: [
      { Icon: Database, label: "ERPs", angle: 0 },
      { Icon: CreditCard, label: "Billing", angle: -90 },
    ],
  },
  {
    size: "w-180 h-180 md:w-265 md:h-265",
    duration: 30,
    icons: [
      { Icon: Truck, label: "Carriers", angle: -60, accent: true },
      { Icon: BarChart3, label: "Analytics", angle: 0 },
      { Icon: Plane, label: "Cross-border", angle: 60 },
    ],
  },
];

export default function OrbitingIntegrations() {
  return (
    <div className="relative flex h-110 w-full justify-center overflow-hidden md:h-160">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-arm, .orbit-chip { animation: none !important; }
        }
      `}</style>

      {/* Center particle globe — half-visible, rising out of the section edge */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-square w-75 -translate-x-1/2 translate-y-1/2 md:w-145">
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting rings */}
      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        const allIcons = [
          ...orbit.icons,
          ...orbit.icons.map((ic) => ({ ...ic, angle: ic.angle + 180, label: `${ic.label}-mirror` })),
        ];

        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#E3E5EA] ${orbit.size}`}
          >
            {allIcons.map((iconData, iconIndex) => (
              <div
                key={iconIndex}
                className="orbit-arm absolute top-0 left-1/2 -ml-8 flex h-1/2 origin-bottom flex-col items-center justify-start"
                style={
                  {
                    "--start-angle": `${iconData.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="orbit-chip relative z-10 -mt-8 rounded-full border border-[#E3E5EA] bg-white p-3 shadow-[0_10px_24px_-16px_rgba(28,30,61,0.35)] sm:p-4"
                  style={
                    {
                      "--counter-offset": `${-iconData.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  <iconData.Icon
                    strokeWidth={1.8}
                    className={`h-6 w-6 md:h-8 md:w-8 ${iconData.accent ? "text-[#EC5A26]" : "text-[#1C1E3D]"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
