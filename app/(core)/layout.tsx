// Core zone. Nested layout (the real <html>/<body> lives in app/layout.tsx).
// Everything under shiptime.com/* that isn't /plus renders inside data-zone=core,
// which resolves the Core token set (light canvas, navy + orange, Manrope).
export default function CoreLayout({ children }: { children: React.ReactNode }) {
  return <div data-zone="core">{children}</div>;
}
