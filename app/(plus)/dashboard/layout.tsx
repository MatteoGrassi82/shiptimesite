import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

// Koherent's two fonts (brand deck, Oct 22), loaded for /dashboard so Koherent
// accounts can switch to them. ShipTime accounts keep the system font; the
// theme in components/console/brand.tsx picks which one is used.
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${schibsted.variable} ${jetbrains.variable}`}>{children}</div>;
}
