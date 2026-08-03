import type { Metadata } from "next";
import { Manrope, Inter, DM_Sans, Instrument_Serif, Anton, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Tracking, TrackingNoScript } from "@/components/tracking";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ── ShipTime Plus (Hana) type system ──────────────────────────────
// Anton for display headings (heavy condensed uppercase), DM Sans for body/UI.
// These drive the [data-zone="plus"] token set. (Instrument Serif is retained
// for Plus blog long-form, so it stays loaded.)
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Distinctive heavy grotesque for Core headlines (Fluz-style display face).
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShipTime — Your Logistics. Fully Optimized.",
  description: "ShipTime is your logistics operating system — unifying shipping, fulfillment, and carrier strategy across North America.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${dmSans.variable} ${instrumentSerif.variable} ${anton.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        <TrackingNoScript />
        {children}
        <Tracking />
        <Analytics />
      </body>
    </html>
  );
}
