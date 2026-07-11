// Plus zone. Everything under shiptime.com/plus/* renders inside data-zone=plus,
// which resolves the Plus token set (near-black canvas, teal + amber, uppercase
// Inter) — the same section components, a different brand.
export default function PlusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-zone="plus" style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
