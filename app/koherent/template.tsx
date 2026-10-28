// A template remounts on every navigation under /koherent (unlike the layout),
// so each page can play one short entrance: a fade and a small rise. React's
// <ViewTransition> would do more, but it's behind an experimental flag in this
// Next version, and this covers the chapter hand-ons well enough. Off with
// reduced motion.
export default function KoherentTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="k-page">
      {children}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes k-page-kf { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
          .k-page { animation: k-page-kf .45s cubic-bezier(.22,1,.36,1) both; }
        }
      `}</style>
    </div>
  );
}
