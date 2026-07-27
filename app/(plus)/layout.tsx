// Plus zone. Everything under shiptime.com/plus/* renders inside data-zone=plus,
// which resolves the Plus token set (light canvas, navy + orange with a blue
// accent, uppercase Anton) — the same section components, a different brand.
export default function PlusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-zone="plus" style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
