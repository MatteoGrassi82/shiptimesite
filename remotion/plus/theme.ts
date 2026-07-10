// Shared visual system for the ShipTime Plus films — the "operating system"
// look from the strategy readout: teal on near-black. Kept separate from the
// base-ShipTime (navy/orange) comps in the parent folder.

export const ds = {
  bg: "#0A0C0D",
  bg2: "#0E1113",
  frame: "#111517",
  frame2: "#0C0F11",
  line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.14)",
  text: "#F2F6F5",
  muted: "#8C9699",
  muted2: "#596366",
  teal: "#33A89C",
  tealBr: "#4EC9BA",
  tealDim: "rgba(51,168,156,0.15)",
  amber: "#E3A94A",
  amberDim: "rgba(227,169,74,0.15)",
} as const;

// Inter is loaded globally by next/font (weights 400–700) and exposed as a CSS
// variable. We cap display weight at 700 so nothing gets faux-bolded. On the
// Remotion Player these vars cascade from <html>; in a headless MP4 render they
// resolve once the font pipeline is wired up.
export const display = 'var(--font-inter), "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';
export const mono = 'ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, monospace';

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
