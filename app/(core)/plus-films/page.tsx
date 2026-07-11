import PlusHero from "@/components/ui/plus-hero";
import PlusFilmsPreview from "@/components/ui/plus-films-preview";

// Dedicated route for the three ShipTime Plus films. The preview itself lives
// in a reusable client component so it can also sit on the home index.
export default function PlusFilmsPage() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <PlusHero />
      <PlusFilmsPreview />
    </main>
  );
}
