"use client";

import type { CSSProperties, ReactNode } from "react";
import { KB_CSS } from "./koherent-bring";
import { useInView } from "./koherent-motion";

// The bento's widgets (rates, switches, the applet, the integrations wall)
// play their small entrance under an `.is-in` ancestor. On the revision-2
// pages they sit one per section, so each gets its own trigger. KB_CSS is a
// string from a client module, so it has to be read here, client side: a
// server component would only get a reference to it.
export function Live({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={inView ? "is-in" : undefined} style={style}>
      {children}
      <style>{KB_CSS}</style>
    </div>
  );
}

// The same rules for a page that mounts the widgets some other way (the How
// it works scroller sets `.is-in` itself).
export function KbStyles() {
  return <style>{KB_CSS}</style>;
}
