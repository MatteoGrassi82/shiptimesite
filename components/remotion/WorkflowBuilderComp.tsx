import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import type { ReactNode } from "react";
import { getLocale } from "@/lib/i18n";

/* Locale (stable singleton, evaluated once at module load). All user-visible
   copy below is provided in EN and IT and selected via this flag. Non-text
   code — geometry, timings, easing, colors, ports, camera — is untouched. */
const LOC = getLocale();
const IT = LOC === "it";

/* ----------------------------------------------------------------------------
   ShipTime Plus — "Shipping Workflow"  (510f / 17s @ 30fps, seamless loop)

   An 8-node flow canvas on the left (camera pans/zooms node-to-node) runs in
   lockstep with a "Live Run" event log + carrier API console on the right.
   One inbound order cascades into a fully-handled outcome: order details read,
   address validated, every carrier rate-shopped, the cheapest qualified rate
   selected, a label booked & printed, and tracking synced with a buyer
   notification — no one touched anything.

   Apple-grade craft: layered light, restrained color, slow confident motion.
   Everything is derived from useCurrentFrame() + useVideoConfig() so the loop
   and choreography stay correct and fully deterministic.

   TEAL nodes = action/API call (rate/label/tracking calls). ORANGE nodes =
   decision/gate. Layout (900): viewport 584 + gap 16 + panel 284 + insets 16.
---------------------------------------------------------------------------- */

/* ---- Brand tokens ---------------------------------------------------------- */
const SANS = "'DM Sans', system-ui, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'JetBrains Mono', monospace";

const INK = "#0A0A0B";
const SLATE = "#3F3F46";
const MUTED = "#71717A";
const HAIRLINE = "rgba(0,0,0,0.06)";
const HAIRLINE_STRONG = "rgba(0,0,0,0.08)";
const CANVAS = "#F7F7F8";
const ACCENT = "#EC5A26"; /* ShipTime primary orange (decision/gate nodes) */
const ACCENT_DEEP = "#C2461A";
const SUCCESS = "#1A7A4A";
const DANGER = "#FF453A";
const WARNING = "#F0845B"; /* soft orange */

/* Action/API-call nodes + console syntax — ShipTime teal */
const PURPLE = "#2E4C8F";
const PURPLE_DEEP = "#3B82F6";
const CONSOLE_BG = "#0E1116";
const CONSOLE_BG2 = "#111317";
const SYN_VERB = "#B392F0";
const SYN_PATH = "#E6EDF3";
const SYN_KEY = "#79C0FF";
const SYN_STR = "#FFA657";
const SYN_COMMENT = "#8B949E";
const SYN_OK = "#3FB950";
const DIM = 0.42; // desaturated/dimmed node + stub-edge opacity floor

/* Layered, realistic elevation — contact + ambient + glassy top edge. */
const CARD_SHADOW =
  "0 1px 2px rgba(10,10,11,0.04), 0 8px 22px -10px rgba(10,10,11,0.12), 0 26px 50px -28px rgba(10,10,11,0.16)";
const CARD_INSET = "inset 0 1px 0 rgba(255,255,255,0.72)";
const CARD_BG = "linear-gradient(180deg, #FFFFFF 0%, #FCFCFD 100%)";

/* ---- World / camera geometry ----------------------------------------------- */
const WORLD_W = 1760;
const WORLD_H = 940;
const VW = 868; // full-width node canvas (Live Run panel removed)
const VH = 478; // left viewport height
const VIEW_X = 16;
const VIEW_Y = 14;
const PANEL_W = 284;
const PANEL_X = 600;
const NODE_W = 316;

/* ---- Motion helpers -------------------------------------------------------- */
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function easeOut(frame: number, delay: number, duration: number): number {
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}

type Reveal = { opacity: number; ty: number; blur: number };

/* Pure, non-hook reveal so it can be called per-item inside a .map(). */
function revealAt(frame: number, at: number, dur = 22): Reveal {
  const t = easeOut(frame, at, dur);
  return { opacity: t, ty: (1 - t) * 14, blur: (1 - t) * 4 };
}

/* Loop-safe fade applied to the whole stage so frame (D-1) -> 0 is seamless.
   Fade in 0->9, fade out (D-12)->D so the camera hard-reset is hidden. */
function loopGuard(frame: number, D: number): number {
  const fadeIn = interpolate(frame, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const fadeOut = interpolate(frame, [D - 12, D], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  return Math.min(fadeIn, fadeOut);
}

/* Mix two hex colors (#rrggbb) by t in [0,1]. */
function mix(a: string, b: string, t: number): string {
  const k = clamp01(t);
  const pa = [
    parseInt(a.slice(1, 3), 16),
    parseInt(a.slice(3, 5), 16),
    parseInt(a.slice(5, 7), 16),
  ];
  const pb = [
    parseInt(b.slice(1, 3), 16),
    parseInt(b.slice(3, 5), 16),
    parseInt(b.slice(5, 7), 16),
  ];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/* Camera transform: center world point (cx,cy) at zoom in the VW×VH viewport. */
function cameraTransform(cx: number, cy: number, zoom: number): string {
  const tx = VW / 2 - cx * zoom;
  const ty = VH / 2 - cy * zoom;
  return `translate(${tx}px, ${ty}px) scale(${zoom})`;
}

/* Cubic bezier between two ports. `bow` adds vertical-tangent handles for the
   row-to-row drops (E3/E6); default is horizontal-tangent (left/right ports). */
function bezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bow = 0
): string {
  if (bow !== 0) {
    // Vertical-tangent: leave downward, arrive downward (snake row drops).
    const handle = Math.max(70, Math.abs(y2 - y1) * 0.5 + Math.abs(x2 - x1) * 0.18) + bow;
    const c1y = y1 + handle;
    const c2y = y2 - handle;
    return `M${x1},${y1} C ${x1},${c1y} ${x2},${c2y} ${x2},${y2}`;
  }
  // Horizontal-tangent: leave/arrive horizontally. Sign follows dx so left→
  // right and right→left hops both bow outward cleanly. The handle is capped
  // near half the horizontal span so short edges keep a calm, single curve.
  const dx = x2 - x1;
  const dy = Math.abs(y2 - y1);
  const dir = dx >= 0 ? 1 : -1;
  const mag = Math.min(Math.max(34, Math.abs(dx) * 0.5 + dy * 0.3), Math.abs(dx) * 0.62 + 46);
  const c1x = x1 + dir * mag;
  const c2x = x2 - dir * mag;
  return `M${x1},${y1} C ${c1x},${y1} ${c2x},${y2} ${x2},${y2}`;
}

/* Wraps [bracketed] segments of agent copy in an ACCENT-tinted entity span. */
function tintEntities(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((seg, i) => {
    if (seg.startsWith("[") && seg.endsWith("]")) {
      return (
        <span key={i} style={{ color: ACCENT, fontWeight: 600 }}>
          {seg.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{seg}</span>;
  });
}

/* ---- Graph data types ------------------------------------------------------ */
type NodeId =
  | "inbound"
  | "chart"
  | "cancel"
  | "note"
  | "waitlist"
  | "offer"
  | "confirm"
  | "final";
type AccentKind = "blue" | "purple";
type ChipDef = { label: string; dim: boolean; warn?: boolean };
type NodeDef = {
  id: NodeId;
  title: string;
  accent: AccentKind;
  x: number;
  y: number;
  w: number;
  h: number;
  body: string; // wrapping paragraph (mono); height is fixed so ports stay attached
  chips: ChipDef[];
};

type Port = { x: number; y: number };
type EdgeDef = {
  id: string;
  from: Port;
  to: Port;
  bow: number; // >0 → vertical-tangent drop
  dim: boolean; // dimmed stub that never lights
  lightAt: number; // frame at which a taken edge fully lights
};

/* ---- 8 nodes (world px) ----------------------------------------------------
   Bodies are single wrapping paragraphs; each card uses an explicit fixed
   height (= `h`) so the bezier ports stay attached to the real card edges and
   nothing is clipped at the node's beat.                                    */
const NODES_EN: NodeDef[] = [
  {
    id: "inbound",
    title: "# Order Received",
    accent: "purple",
    x: 60,
    y: 96,
    w: NODE_W,
    h: 112,
    body:
      "A new order hits the store webhook. ShipTime ingests it instantly — no manual entry, no CSV. The workflow fires the moment it lands.",
    chips: [],
  },
  {
    id: "chart",
    title: "# Read: Order Details",
    accent: "purple",
    x: 452,
    y: 96,
    w: NODE_W,
    h: 168,
    body:
      "Before pricing anything, ShipTime pulls the order: destination, dimensions, weight, declared value, contents, and the buyer's chosen service.",
    chips: [{ label: "Order Loaded", dim: false }],
  },
  {
    id: "cancel",
    title: "# Validate: Address",
    accent: "blue",
    x: 844,
    y: 80,
    w: NODE_W,
    h: 206,
    body:
      "ShipTime validates the ship-to address, normalizes it, and classifies it commercial vs residential — captured as structured data, so surcharges are priced correctly.",
    chips: [
      { label: "Commercial · Verified", dim: false },
      { label: "Residential", dim: true },
    ],
  },
  {
    id: "note",
    title: "# Rate Shop: All Carriers",
    accent: "purple",
    x: 844,
    y: 430,
    w: NODE_W,
    h: 168,
    body:
      "ShipTime fires one call to every carrier at once — UPS, FedEx, USPS, DHL, regionals — pulling live negotiated rates, transit times, and surcharges for this exact parcel.",
    chips: [{ label: "9 Rates Returned", dim: false }],
  },
  {
    id: "waitlist",
    title: "# Select: Cheapest Qualified",
    accent: "purple",
    x: 452,
    y: 430,
    w: NODE_W,
    h: 168,
    body:
      "The instant rates return, ShipTime ranks them AND filters on the SLA — choosing the cheapest carrier that still meets the delivery deadline, not just the lowest sticker price.",
    chips: [{ label: "UPS Ground · meets SLA", dim: false, warn: true }],
  },
  {
    id: "offer",
    title: "# Book: Label",
    accent: "blue",
    x: 60,
    y: 420,
    w: NODE_W,
    h: 206,
    body:
      "ShipTime books the chosen rate live, purchasing the label against the negotiated account and reserving the pickup — the qualified rate is locked before it can change.",
    chips: [
      { label: "Label Purchased", dim: false },
      { label: "Rate Expired -> Re-shop", dim: true },
    ],
  },
  {
    id: "confirm",
    title: "# Print: Label + Docs",
    accent: "blue",
    x: 452,
    y: 740,
    w: NODE_W,
    h: 168,
    body:
      "The label prints to the warehouse queue — with the packing slip and any customs docs the destination needs — ready to slap on the box in seconds.",
    chips: [{ label: "Printed", dim: false }],
  },
  {
    id: "final",
    title: "# Sync: Tracking + Notify",
    accent: "purple",
    x: 844,
    y: 740,
    w: NODE_W,
    h: 128,
    body:
      "Three writes fire at once: the tracking number syncs back to the order, the store marks it fulfilled, and a shipping-confirmation email goes to the buyer.",
    chips: [],
  },
];

/* Italian variant — identical geometry/accent/ports, translated copy only. */
const NODES_IT: NodeDef[] = [
  {
    id: "inbound",
    title: "# Ordine Ricevuto",
    accent: "purple",
    x: 60,
    y: 96,
    w: NODE_W,
    h: 112,
    body:
      "Arriva un nuovo ordine dal webhook dello store. ShipTime lo acquisisce all'istante — nessun inserimento manuale, nessun CSV. Il flusso parte appena arriva.",
    chips: [],
  },
  {
    id: "chart",
    title: "# Leggi: Dettagli Ordine",
    accent: "purple",
    x: 452,
    y: 96,
    w: NODE_W,
    h: 168,
    body:
      "Prima di calcolare le tariffe, ShipTime apre l'ordine: destinazione, dimensioni, peso, valore dichiarato, contenuto e servizio scelto dall'acquirente.",
    chips: [{ label: "Ordine Caricato", dim: false }],
  },
  {
    id: "cancel",
    title: "# Valida: Indirizzo",
    accent: "blue",
    x: 844,
    y: 80,
    w: NODE_W,
    h: 206,
    body:
      "ShipTime valida l'indirizzo di destinazione, lo normalizza e lo classifica commerciale o residenziale — registrato come dato strutturato, così i supplementi sono corretti.",
    chips: [
      { label: "Commerciale · Verificato", dim: false },
      { label: "Residenziale", dim: true },
    ],
  },
  {
    id: "note",
    title: "# Confronta: Tutti i Corrieri",
    accent: "purple",
    x: 844,
    y: 430,
    w: NODE_W,
    h: 168,
    body:
      "ShipTime interroga tutti i corrieri in una volta — UPS, FedEx, USPS, DHL, regionali — recuperando tariffe negoziate live, tempi di transito e supplementi per questo collo.",
    chips: [{ label: "9 Tariffe Ricevute", dim: false }],
  },
  {
    id: "waitlist",
    title: "# Scegli: Più Economica Idonea",
    accent: "purple",
    x: 452,
    y: 430,
    w: NODE_W,
    h: 168,
    body:
      "Appena arrivano le tariffe, ShipTime le ordina E le filtra sull'SLA — scegliendo il corriere più economico che rispetta comunque la scadenza, non solo il prezzo più basso.",
    chips: [{ label: "UPS Ground · rispetta SLA", dim: false, warn: true }],
  },
  {
    id: "offer",
    title: "# Prenota: Etichetta",
    accent: "blue",
    x: 60,
    y: 420,
    w: NODE_W,
    h: 206,
    body:
      "ShipTime prenota la tariffa scelta live, acquistando l'etichetta sull'account negoziato e riservando il ritiro — la tariffa idonea è bloccata prima che possa cambiare.",
    chips: [
      { label: "Etichetta Acquistata", dim: false },
      { label: "Tariffa Scaduta -> Riconfronta", dim: true },
    ],
  },
  {
    id: "confirm",
    title: "# Stampa: Etichetta + Documenti",
    accent: "blue",
    x: 452,
    y: 740,
    w: NODE_W,
    h: 168,
    body:
      "L'etichetta va in stampa nella coda del magazzino — con il documento di trasporto e ogni documento doganale richiesto — pronta da applicare al collo in pochi secondi.",
    chips: [{ label: "Stampato", dim: false }],
  },
  {
    id: "final",
    title: "# Sincronizza: Tracking + Avviso",
    accent: "purple",
    x: 844,
    y: 740,
    w: NODE_W,
    h: 128,
    body:
      "Tre scritture in un colpo solo: il numero di tracking torna nell'ordine, lo store lo segna come evaso e una mail di conferma spedizione va all'acquirente.",
    chips: [],
  },
];

const NODES: NodeDef[] = IT ? NODES_IT : NODES_EN;

const NODE_BY_ID: Record<NodeId, NodeDef> = NODES.reduce((acc, n) => {
  acc[n.id] = n;
  return acc;
}, {} as Record<NodeId, NodeDef>);

/* Port helpers derived from node geometry (title bar 32, chip row metrics). */
const TITLE_BAR_H = 32;
function portLeftCenter(id: NodeId): Port {
  const n = NODE_BY_ID[id];
  return { x: n.x, y: n.y + n.h / 2 };
}
function portRightCenter(id: NodeId): Port {
  const n = NODE_BY_ID[id];
  return { x: n.x + n.w, y: n.y + n.h / 2 };
}
function portBottomCenter(id: NodeId): Port {
  const n = NODE_BY_ID[id];
  return { x: n.x + n.w / 2, y: n.y + n.h };
}
function portTopCenter(id: NodeId): Port {
  const n = NODE_BY_ID[id];
  return { x: n.x + n.w / 2, y: n.y };
}

/* ---- Edges (taken + dimmed stubs) ----------------------------------------- */
const EDGES: EdgeDef[] = [
  // E1 entry: inbound bottom -> chart left
  {
    id: "e1",
    from: portBottomCenter("inbound"),
    to: portLeftCenter("chart"),
    bow: 0,
    dim: false,
    lightAt: 60,
  },
  // E2 chart right -> cancel left
  {
    id: "e2",
    from: portRightCenter("chart"),
    to: portLeftCenter("cancel"),
    bow: 0,
    dim: false,
    lightAt: 120,
  },
  // E3 cancel bottom -> note top (row drop)
  {
    id: "e3",
    from: portBottomCenter("cancel"),
    to: portTopCenter("note"),
    bow: 18,
    dim: false,
    lightAt: 206,
  },
  // E4 note left -> waitlist right (mid row R->L)
  {
    id: "e4",
    from: portLeftCenter("note"),
    to: portRightCenter("waitlist"),
    bow: 0,
    dim: false,
    lightAt: 256,
  },
  // E5 waitlist left -> offer right (mid row R->L)
  {
    id: "e5",
    from: portLeftCenter("waitlist"),
    to: portRightCenter("offer"),
    bow: 0,
    dim: false,
    lightAt: 316,
  },
  // E6 offer bottom -> confirm left (drop + over)
  {
    id: "e6",
    from: portBottomCenter("offer"),
    to: portLeftCenter("confirm"),
    bow: 14,
    dim: false,
    lightAt: 382,
  },
  // E7 confirm right -> final left (bottom row L->R)
  {
    id: "e7",
    from: portRightCenter("confirm"),
    to: portLeftCenter("final"),
    bow: 0,
    dim: false,
    lightAt: 430,
  },
  // S1 dimmed: validate "Residential" branch -> faint end ring (goes nowhere)
  {
    id: "s1",
    from: {
      x: NODE_BY_ID.cancel.x + NODE_BY_ID.cancel.w,
      y: NODE_BY_ID.cancel.y + NODE_BY_ID.cancel.h - 26,
    },
    to: { x: NODE_BY_ID.cancel.x + NODE_BY_ID.cancel.w + 96, y: NODE_BY_ID.cancel.y + NODE_BY_ID.cancel.h + 28 },
    bow: 0,
    dim: true,
    lightAt: 1e9,
  },
  // S2 dimmed: book "Rate Expired" loop-back gesture toward rate-shop
  {
    id: "s2",
    from: {
      x: NODE_BY_ID.offer.x + NODE_BY_ID.offer.w / 2 + 40,
      y: NODE_BY_ID.offer.y + NODE_BY_ID.offer.h,
    },
    to: { x: NODE_BY_ID.waitlist.x - 92, y: NODE_BY_ID.waitlist.y + NODE_BY_ID.waitlist.h / 2 + 6 },
    bow: -8,
    dim: true,
    lightAt: 1e9,
  },
];

/* ---- Camera keyframes (§2) ------------------------------------------------- */
type CamKey = { atFrame: number; cx: number; cy: number; zoom: number };
const KEYFRAMES: CamKey[] = [
  { atFrame: 12, cx: 218, cy: 152, zoom: 1.2 },
  { atFrame: 78, cx: 610, cy: 180, zoom: 1.18 },
  { atFrame: 138, cx: 1002, cy: 183, zoom: 1.14 },
  { atFrame: 222, cx: 1002, cy: 514, zoom: 1.16 },
  { atFrame: 270, cx: 610, cy: 514, zoom: 1.16 },
  { atFrame: 330, cx: 218, cy: 523, zoom: 1.14 },
  { atFrame: 396, cx: 610, cy: 824, zoom: 1.16 },
  { atFrame: 444, cx: 1002, cy: 804, zoom: 1.18 },
  { atFrame: 486, cx: 1002, cy: 772, zoom: 1.12 },
];

/* Each keyframe's primary focus node (for the cross-fading glow). */
const KEY_FOCUS: NodeId[] = [
  "inbound",
  "chart",
  "cancel",
  "note",
  "waitlist",
  "offer",
  "confirm",
  "final",
  "final",
];

function cameraAt(frame: number): { cx: number; cy: number; zoom: number } {
  const first = KEYFRAMES[0];
  const last = KEYFRAMES[KEYFRAMES.length - 1];
  if (frame <= first.atFrame) return { cx: first.cx, cy: first.cy, zoom: first.zoom };
  if (frame >= last.atFrame) return { cx: last.cx, cy: last.cy, zoom: last.zoom };
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (frame >= a.atFrame && frame <= b.atFrame) {
      const t = interpolate(frame, [a.atFrame, b.atFrame], [0, 1], {
        easing: EASE,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return {
        cx: a.cx + (b.cx - a.cx) * t,
        cy: a.cy + (b.cy - a.cy) * t,
        zoom: a.zoom + (b.zoom - a.zoom) * t,
      };
    }
  }
  return { cx: last.cx, cy: last.cy, zoom: last.zoom };
}

/* Cross-fading focus glow: triangle peaking at the node's keyframe, sharing
   ~12f of overlap with adjacent keyframes during the pan. */
function focusWeight(frame: number, nodeId: NodeId): number {
  let w = 0;
  for (let i = 0; i < KEYFRAMES.length; i++) {
    if (KEY_FOCUS[i] !== nodeId) continue;
    const at = KEYFRAMES[i].atFrame;
    const prev = i > 0 ? KEYFRAMES[i - 1].atFrame : at - 60;
    const next = i < KEYFRAMES.length - 1 ? KEYFRAMES[i + 1].atFrame : at + 60;
    // rise from midpoint(prev..at) → at, hold a touch, fall to midpoint(at..next)
    const riseStart = at - Math.min(24, (at - prev) * 0.5);
    const fallEnd = at + Math.min(24, (next - at) * 0.5);
    const up = interpolate(frame, [riseStart, at], [0, 1], {
      easing: EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const down = interpolate(frame, [at, fallEnd], [1, 0], {
      easing: EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    w = Math.max(w, Math.min(up, down));
  }
  return w;
}

/* Taken edge draw + light progress; dim stubs return a constant low value. */
function edgeProgress(frame: number, edge: EdgeDef): number {
  if (edge.dim) return DIM;
  // Draw-on slightly before lightAt, settle to a calm lit floor after.
  const a = edge.lightAt - 18;
  return interpolate(
    frame,
    [a, edge.lightAt, edge.lightAt + 60, edge.lightAt + 80],
    [0, 1, 1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
  );
}

/* ============================================================================
   CONSOLE SCRIPT (multi-call support)
============================================================================ */
type ConsoleSeg = { text: string; color: string };
type ConsoleLineT = { segs: ConsoleSeg[]; indent?: number };
type ConsoleCall = {
  tool: string;
  status: string;
  statusColor: string;
  lines: ConsoleLineT[];
};

function seg(text: string, color: string): ConsoleSeg {
  return { text, color };
}
function kv(key: string, val: string, indent = 1): ConsoleLineT {
  return {
    indent,
    segs: [seg(key, SYN_KEY), seg(": ", SYN_PATH), seg(val, SYN_STR)],
  };
}
function comment(text: string): ConsoleLineT {
  return { segs: [seg(text, SYN_COMMENT)] };
}
function verb(v: string, path: string): ConsoleLineT {
  return { segs: [seg(v + " ", SYN_VERB), seg(path, SYN_PATH)] };
}
function ok(text: string): ConsoleLineT {
  return { segs: [seg(text, SYN_OK)] };
}

/* Node 1 — Order webhook */
const CALLS_TELEPHONY_EN: ConsoleCall[] = [
  {
    tool: "ORDER WEBHOOK",
    status: "ORDER RECEIVED",
    statusColor: SYN_OK,
    lines: [
      kv("store", '"acme-outfitters.myshopify.com"', 0),
      kv("order_id", '"#ST-48291"', 0),
      comment("// workflow: auto_fulfill v3"),
    ],
  },
];
const CALLS_TELEPHONY_IT: ConsoleCall[] = [
  {
    tool: "ORDER WEBHOOK",
    status: "ORDER RECEIVED",
    statusColor: SYN_OK,
    lines: [
      kv("store", '"acme-outfitters.myshopify.com"', 0),
      kv("order_id", '"#ST-48291"', 0),
      comment("// workflow: auto_fulfill v3"),
    ],
  },
];
const CALLS_TELEPHONY: ConsoleCall[] = IT ? CALLS_TELEPHONY_IT : CALLS_TELEPHONY_EN;

/* Node 2 — Order details read */
const CALLS_CHART_EN: ConsoleCall[] = [
  {
    tool: "ORDER API",
    status: "200 OK",
    statusColor: SYN_OK,
    lines: [
      verb("GET", "/api/v1/orders/ST-48291"),
      kv("ship_to", '"Austin, TX 78701"'),
      kv("parcel", '"12x9x6 in · 4.2 lb"'),
      kv("declared_value", '"$180.00"'),
      kv("service", '"cheapest by SLA"'),
      comment("// 1 dimensional flag"),
    ],
  },
];
const CALLS_CHART_IT: ConsoleCall[] = [
  {
    tool: "ORDER API",
    status: "200 OK",
    statusColor: SYN_OK,
    lines: [
      verb("GET", "/api/v1/orders/ST-48291"),
      kv("ship_to", '"Austin, TX 78701"'),
      kv("parcel", '"30x23x15 cm · 1,9 kg"'),
      kv("declared_value", '"180,00 $"'),
      kv("service", '"più economica per SLA"'),
      comment("// 1 flag dimensionale"),
    ],
  },
];
const CALLS_CHART: ConsoleCall[] = IT ? CALLS_CHART_IT : CALLS_CHART_EN;

/* Node 4 — Rate shop write */
const CALLS_NOTE_EN: ConsoleCall[] = [
  {
    tool: "RATES API",
    status: "200 OK",
    statusColor: SYN_OK,
    lines: [
      verb("GET", "/api/v1/rates?to=78701&wt=4.2"),
      kv("carriers_quoted", '"UPS, FedEx, USPS, DHL"'),
      kv("cheapest", '"UPS Ground · $8.41"'),
      kv("fastest", '"FedEx 2Day · $22.10"'),
      ok("● 9 RATES RETURNED · 380ms"),
    ],
  },
];
const CALLS_NOTE_IT: ConsoleCall[] = [
  {
    tool: "RATES API",
    status: "200 OK",
    statusColor: SYN_OK,
    lines: [
      verb("GET", "/api/v1/rates?to=78701&wt=4.2"),
      kv("carriers_quoted", '"UPS, FedEx, USPS, DHL"'),
      kv("cheapest", '"UPS Ground · 8,41 $"'),
      kv("fastest", '"FedEx 2Day · 22,10 $"'),
      ok("● 9 TARIFFE RICEVUTE · 380ms"),
    ],
  },
];
const CALLS_NOTE: ConsoleCall[] = IT ? CALLS_NOTE_IT : CALLS_NOTE_EN;

/* Node 5 — Rate rank + SLA check (two calls in one card) */
const CALLS_WAITLIST_EN: ConsoleCall[] = [
  {
    tool: "RATE RANK",
    status: "200 OK",
    statusColor: SYN_OK,
    lines: [
      verb("POST", "/api/v1/rates/rank?order=ST-48291"),
      kv("candidates", "9"),
    ],
  },
  {
    tool: "SLA CHECK",
    status: "200 OK",
    statusColor: SYN_OK,
    lines: [
      verb("GET", "/api/v1/rates/rt_2207/transit"),
      kv("carrier", '"UPS Ground"'),
      kv("deadline", '"delivers in 3d · SLA 4d"'),
      kv("cost", '"$8.41"'),
      comment("// selected: cheapest that meets SLA"),
    ],
  },
];
const CALLS_WAITLIST_IT: ConsoleCall[] = [
  {
    tool: "RATE RANK",
    status: "200 OK",
    statusColor: SYN_OK,
    lines: [
      verb("POST", "/api/v1/rates/rank?order=ST-48291"),
      kv("candidates", "9"),
    ],
  },
  {
    tool: "SLA CHECK",
    status: "200 OK",
    statusColor: SYN_OK,
    lines: [
      verb("GET", "/api/v1/rates/rt_2207/transit"),
      kv("carrier", '"UPS Ground"'),
      kv("deadline", '"consegna in 3g · SLA 4g"'),
      kv("cost", '"8,41 $"'),
      comment("// scelto: la più economica che rispetta l'SLA"),
    ],
  },
];
const CALLS_WAITLIST: ConsoleCall[] = IT ? CALLS_WAITLIST_IT : CALLS_WAITLIST_EN;

/* Node 8 — Three writes in one conceptual card */
const CALLS_FINAL_EN: ConsoleCall[] = [
  {
    tool: "LABEL + TRACKING + EMAIL",
    status: "3x OK",
    statusColor: SYN_OK,
    lines: [
      {
        indent: 0,
        segs: [
          seg("POST ", SYN_VERB),
          seg("/api/v1/orders/ST-48291/tracking", SYN_PATH),
          seg("  ", SYN_PATH),
          seg("201 synced", SYN_OK),
        ],
      },
      {
        indent: 0,
        segs: [
          seg("POST ", SYN_VERB),
          seg("/api/v1/orders/ST-48291/fulfill", SYN_PATH),
          seg("  ", SYN_PATH),
          seg("200 fulfilled", SYN_OK),
        ],
      },
      kv("tracking", '"1Z999AA10123456784"'),
      kv("carrier", '"UPS Ground · $8.41"'),
      {
        indent: 0,
        segs: [
          seg("EMAIL -> buyer: ", SYN_VERB),
          seg('"Your order has shipped — track it here."', SYN_STR),
        ],
      },
      ok("● DONE · 0 manual work"),
    ],
  },
];
const CALLS_FINAL_IT: ConsoleCall[] = [
  {
    tool: "LABEL + TRACKING + EMAIL",
    status: "3x OK",
    statusColor: SYN_OK,
    lines: [
      {
        indent: 0,
        segs: [
          seg("POST ", SYN_VERB),
          seg("/api/v1/orders/ST-48291/tracking", SYN_PATH),
          seg("  ", SYN_PATH),
          seg("201 synced", SYN_OK),
        ],
      },
      {
        indent: 0,
        segs: [
          seg("POST ", SYN_VERB),
          seg("/api/v1/orders/ST-48291/fulfill", SYN_PATH),
          seg("  ", SYN_PATH),
          seg("200 fulfilled", SYN_OK),
        ],
      },
      kv("tracking", '"1Z999AA10123456784"'),
      kv("carrier", '"UPS Ground · 8,41 $"'),
      {
        indent: 0,
        segs: [
          seg("EMAIL -> buyer: ", SYN_VERB),
          seg('"Il tuo ordine è stato spedito — segui la spedizione qui."', SYN_STR),
        ],
      },
      ok("● FATTO · 0 lavoro manuale"),
    ],
  },
];
const CALLS_FINAL: ConsoleCall[] = IT ? CALLS_FINAL_IT : CALLS_FINAL_EN;

/* ---- Conversation script --------------------------------------------------- */
type ConvItem =
  | { kind: "agent"; appearAt: number; text: string }
  | { kind: "user"; appearAt: number; text: string }
  | {
      kind: "console";
      appearAt: number;
      calls: ConsoleCall[];
      lineDelay: number;
    };

const STREAM_EN: ConvItem[] = [
  // B1 — Order received (webhook console)
  { kind: "console", appearAt: 18, calls: CALLS_TELEPHONY, lineDelay: 11 },
  // B2 — Order details read
  { kind: "console", appearAt: 84, calls: CALLS_CHART, lineDelay: 9 },
  // B3 — Address validation narration
  {
    kind: "agent",
    appearAt: 140,
    text:
      "New order [#ST-48291] to [Austin, TX]. Validating the ship-to address before I price anything — a wrong class means a wrong surcharge.",
  },
  {
    kind: "user",
    appearAt: 158,
    text: "USPS lookup: address normalized, matched to a business park.",
  },
  {
    kind: "agent",
    appearAt: 176,
    text:
      "Classified [commercial] — so no residential surcharge applies. Locking that in on the order record.",
  },
  {
    kind: "user",
    appearAt: 194,
    text: "Address verified: commercial, no surcharge.",
  },
  // B4 — Rate shop write
  { kind: "console", appearAt: 224, calls: CALLS_NOTE, lineDelay: 9 },
  // B5 — Rate rank + SLA check
  { kind: "console", appearAt: 272, calls: CALLS_WAITLIST, lineDelay: 9 },
  // B6 — Selection narration
  {
    kind: "agent",
    appearAt: 332,
    text:
      "Nine rates back. Cheapest overall is [USPS at $7.90], but it misses the [4-day SLA]. [UPS Ground at $8.41] delivers in 3 — cheapest that still qualifies. Booking it.",
  },
  { kind: "user", appearAt: 356, text: "Rate locked: UPS Ground, $8.41." },
  // B7 — Book + print narration
  {
    kind: "agent",
    appearAt: 398,
    text:
      "Label purchased on the negotiated account and sent to the [warehouse print queue] — packing slip attached. Syncing tracking to the order now.",
  },
  { kind: "user", appearAt: 422, text: "Label printed. Ready to ship." },
  // B8 — Three writes
  { kind: "console", appearAt: 444, calls: CALLS_FINAL, lineDelay: 7 },
];

/* Italian variant — identical frames/kinds/lineDelay, translated text only.
   Console items reference the same locale-aware CALLS_* constants. */
const STREAM_IT: ConvItem[] = [
  // B1 — Order received (webhook console)
  { kind: "console", appearAt: 18, calls: CALLS_TELEPHONY, lineDelay: 11 },
  // B2 — Order details read
  { kind: "console", appearAt: 84, calls: CALLS_CHART, lineDelay: 9 },
  // B3 — Address validation narration
  {
    kind: "agent",
    appearAt: 140,
    text:
      "Nuovo ordine [#ST-48291] per [Austin, TX]. Valido l'indirizzo di destinazione prima di calcolare le tariffe — una classe sbagliata significa un supplemento sbagliato.",
  },
  {
    kind: "user",
    appearAt: 158,
    text: "Lookup USPS: indirizzo normalizzato, associato a un business park.",
  },
  {
    kind: "agent",
    appearAt: 176,
    text:
      "Classificato [commerciale] — quindi nessun supplemento residenziale. Lo blocco sul record dell'ordine.",
  },
  {
    kind: "user",
    appearAt: 194,
    text: "Indirizzo verificato: commerciale, nessun supplemento.",
  },
  // B4 — Rate shop write
  { kind: "console", appearAt: 224, calls: CALLS_NOTE, lineDelay: 9 },
  // B5 — Rate rank + SLA check
  { kind: "console", appearAt: 272, calls: CALLS_WAITLIST, lineDelay: 9 },
  // B6 — Selection narration
  {
    kind: "agent",
    appearAt: 332,
    text:
      "Nove tariffe ricevute. La più economica in assoluto è [USPS a 7,90 $], ma non rispetta l'[SLA di 4 giorni]. [UPS Ground a 8,41 $] consegna in 3 — la più economica che qualifica. La prenoto.",
  },
  { kind: "user", appearAt: 356, text: "Tariffa bloccata: UPS Ground, 8,41 $." },
  // B7 — Book + print narration
  {
    kind: "agent",
    appearAt: 398,
    text:
      "Etichetta acquistata sull'account negoziato e inviata alla [coda di stampa del magazzino] — documento di trasporto allegato. Sincronizzo ora il tracking sull'ordine.",
  },
  { kind: "user", appearAt: 422, text: "Etichetta stampata. Pronta a spedire." },
  // B8 — Three writes
  { kind: "console", appearAt: 444, calls: CALLS_FINAL, lineDelay: 7 },
];

const STREAM: ConvItem[] = IT ? STREAM_IT : STREAM_EN;

/* Estimated rendered heights (fixed, not measured) for the auto-scroll math. */
function lineCharLen(line: ConsoleLineT): number {
  return line.segs.reduce((n, s) => n + s.text.length, 0);
}
function callLineCount(calls: ConsoleCall[]): number {
  return calls.reduce((n, c) => n + c.lines.length, 0);
}
function consoleHeight(calls: ConsoleCall[]): number {
  const headers = calls.length * 30;
  const body = callLineCount(calls) * 16 + calls.length * 16;
  return headers + body + 8;
}
function bubbleHeight(text: string, isUser: boolean): number {
  // ~26 chars/line at the bubble width; 17px line + chrome.
  const perLine = isUser ? 30 : 28;
  const lines = Math.max(1, Math.ceil(text.length / perLine));
  return lines * 16 + 22;
}
function itemHeight(item: ConvItem): number {
  if (item.kind === "console") return consoleHeight(item.calls);
  return bubbleHeight(item.text, item.kind === "user");
}

/* ============================================================================
   ROOT COMPONENT
============================================================================ */
export function WorkflowBuilderComp() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const D = durationInFrames;

  const stageOpacity = loopGuard(frame, D);
  // Soft "settle in" — barely-perceptible scale over the first 9f.
  const settle = interpolate(frame, [0, 9], [0.997, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  const cam = cameraAt(frame);
  const worldTransform = cameraTransform(cam.cx, cam.cy, cam.zoom);

  // Closing footer chip (B486..498).
  const closing = easeOut(frame, 486, 12);

  return (
    <AbsoluteFill
      style={{
        background: CANVAS,
        fontFamily: SANS,
        opacity: stageOpacity,
        transform: `scale(${settle})`,
        transformOrigin: "50% 50%",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <BackgroundTexture />

      {/* ============ LEFT: clipped camera viewport ============ */}
      <div
        style={{
          position: "absolute",
          left: VIEW_X,
          top: VIEW_Y,
          width: VW,
          height: VH,
          borderRadius: 18,
          overflow: "hidden",
          background: CARD_BG,
          border: `1px solid ${HAIRLINE}`,
          boxShadow: `${CARD_SHADOW}, ${CARD_INSET}`,
        }}
      >
        {/* dot grid inside the canvas */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(10,10,11,0.045) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            backgroundPosition: "-1px -1px",
            opacity: 0.7,
          }}
        />
        {/* soft 4-edge mask so nodes scrolling off look soft, not hard-clipped */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%), linear-gradient(to bottom, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)",
            WebkitMaskComposite: "source-in",
            maskImage:
              "linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%), linear-gradient(to bottom, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)",
            maskComposite: "intersect",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: WORLD_W,
              height: WORLD_H,
              transform: worldTransform,
              transformOrigin: "0 0",
              willChange: "transform",
            }}
          >
            <EdgeLayer frame={frame} />
            {NODES.map((n) => (
              <FlowNode key={n.id} node={n} frame={frame} />
            ))}
          </div>
        </div>
      </div>

      {/* Live Simulation panel removed — the shipping node canvas runs full-width. */}

      {/* ============ Closing footer chip ============ */}
      <div
        style={{
          position: "absolute",
          left: VIEW_X,
          bottom: 22,
          width: VW,
          display: "flex",
          justifyContent: "center",
          opacity: closing,
          transform: `translateY(${(1 - closing) * 8}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "9px 16px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            border: `1px solid ${HAIRLINE_STRONG}`,
            boxShadow: CARD_SHADOW,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: SUCCESS,
              boxShadow: `0 0 8px ${SUCCESS}aa`,
            }}
          />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "-0.2px",
              color: INK,
            }}
          >
            {IT
              ? "ShipTime non ha solo prezzato la spedizione. Ha completato tutto il lavoro."
              : "ShipTime didn't just price the shipment. It finished the whole job."}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ============================================================================
   GRAPH — EDGES
============================================================================ */
function EdgeLayer({ frame }: { frame: number }) {
  // Flowing dash phase — loop-safe: 30 divides 510 cleanly.
  const flow = -((frame % 30) / 30) * 9;
  return (
    <svg
      width={WORLD_W}
      height={WORLD_H}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      {EDGES.map((e) => {
        const d = bezierPath(e.from.x, e.from.y, e.to.x, e.to.y, e.bow);
        const p = edgeProgress(frame, e);
        if (e.dim) {
          // static dimmed stub ending in a faint hollow ring
          return (
            <g key={e.id} opacity={DIM}>
              <path
                d={d}
                stroke="rgba(10,10,11,0.2)"
                strokeWidth={1.8}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="2 6"
              />
              <circle
                cx={e.to.x}
                cy={e.to.y}
                r={5}
                fill="none"
                stroke="rgba(10,10,11,0.26)"
                strokeWidth={1.4}
              />
            </g>
          );
        }
        const lit = clamp01(p);
        const portStroke = lit > 0.08 ? ACCENT : "rgba(10,10,11,0.2)";
        return (
          <g key={e.id}>
            <path
              d={d}
              stroke="rgba(10,10,11,0.14)"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={d}
              stroke={ACCENT}
              strokeWidth={2.4}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="2 7"
              strokeDashoffset={flow}
              opacity={lit}
            />
            <circle
              cx={e.from.x}
              cy={e.from.y}
              r={3.5}
              fill="#fff"
              stroke={portStroke}
              strokeWidth={1.5}
            />
            <circle
              cx={e.to.x}
              cy={e.to.y}
              r={3.5}
              fill="#fff"
              stroke={portStroke}
              strokeWidth={1.5}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================================
   GRAPH — NODE
============================================================================ */
function accentColors(accent: AccentKind): { main: string; deep: string } {
  if (accent === "purple") return { main: PURPLE, deep: PURPLE_DEEP };
  return { main: ACCENT, deep: ACCENT_DEEP };
}

function FlowNode({ node, frame }: { node: NodeDef; frame: number }) {
  const { main, deep } = accentColors(node.accent);
  const focus = focusWeight(frame, node.id);
  const opacity = interpolate(focus, [0, 1], [0.9, 1]);

  const glow =
    focus > 0.02
      ? `0 0 0 ${1.5 * focus}px ${main}${hexA(0.42 * focus)}, 0 0 28px -4px ${main}${hexA(0.5 * focus)}, ${CARD_SHADOW}`
      : CARD_SHADOW;

  const barBg = `linear-gradient(180deg, ${main} 0%, ${deep} 100%)`;

  return (
    <div
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: node.w,
        height: node.h,
        background: CARD_BG,
        borderRadius: 15,
        border: `1px solid ${HAIRLINE}`,
        boxShadow: glow,
        overflow: "hidden",
        opacity,
        display: "flex",
        flexDirection: "column",
        willChange: "opacity, box-shadow",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: barBg,
          padding: "0 14px",
          height: TITLE_BAR_H,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24)",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "-0.2px",
            fontFamily: MONO,
          }}
        >
          {node.title}
        </span>
      </div>

      {/* Body (monospace, wrapping) */}
      <div
        style={{
          padding: "11px 14px 9px",
          flex: 1,
          minHeight: 0,
          fontFamily: MONO,
          fontSize: 10.5,
          lineHeight: 1.5,
          color: SLATE,
          whiteSpace: "normal",
          overflowWrap: "break-word",
        }}
      >
        {node.body}
      </div>

      {/* Branch chips */}
      {node.chips.length > 0 && (
        <div
          style={{
            padding: "0 14px 12px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 7,
          }}
        >
          {node.chips.map((c) => (
            <BranchChip key={c.label} chip={c} accent={node.accent} />
          ))}
        </div>
      )}
    </div>
  );
}

/* hex alpha byte for a color suffix (e.g. "3AAFA9" + hexA(0.5)). */
function hexA(a: number): string {
  const v = Math.round(clamp01(a) * 255);
  return v.toString(16).padStart(2, "0");
}

function BranchChip({ chip, accent }: { chip: ChipDef; accent: AccentKind }) {
  const { main } = accentColors(accent);
  const base = chip.warn ? WARNING : main;
  const dotColor = chip.dim ? mix(base, "#FFFFFF", 0.45) : base;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "6px 10px",
        borderRadius: 9,
        background: chip.dim ? "rgba(10,10,11,0.018)" : "rgba(236,90,38,0.04)",
        border: `1px solid ${chip.dim ? HAIRLINE : "rgba(236,90,38,0.14)"}`,
        opacity: chip.dim ? DIM : 1,
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: dotColor,
          boxShadow: chip.dim ? "none" : `0 0 6px ${dotColor}66`,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 10.5,
          color: chip.dim ? MUTED : SLATE,
          fontWeight: 500,
          letterSpacing: "-0.1px",
          fontFamily: SANS,
          whiteSpace: "nowrap",
        }}
      >
        {chip.label}
      </span>
      {/* Right connection port */}
      <div
        style={{
          marginLeft: "auto",
          width: 14,
          height: 14,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px solid ${chip.dim ? "rgba(10,10,11,0.16)" : main}`,
          background: chip.dim ? "transparent" : main,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 4.5,
            height: 4.5,
            borderRadius: "50%",
            background: chip.dim ? "rgba(10,10,11,0.22)" : "#fff",
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================================
   LIVE SIMULATION PANEL
============================================================================ */
function SimPanel({
  frame,
  durationInFrames,
}: {
  frame: number;
  durationInFrames: number;
}) {
  const D = durationInFrames;

  // SPEAKING during conversation beats (agent talking), LISTENING otherwise.
  // Cross-faded toggle: 1 = agent speaking layer, 0 = listening layer.
  const speakWeight = interpolate(
    frame,
    [
      0,
      138, // pre-conv: listening
      140,
      157, // A1 speak
      158,
      175, // U1 listen
      176,
      193, // A2 speak
      194,
      331, // U2 + processing listen
      332,
      355, // A3 speak
      356,
      397, // U3 listen
      398,
      421, // A4 speak
      422,
      D, // U4 + final processing listen
    ],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
  );

  // Auto-scroll: keep the newest revealed block near the viewport bottom.
  const CONV_H = 346; // scroll viewport height (panel minus header + state card)
  const GAP = 10;
  // Cumulative top of each item.
  let acc = 0;
  const tops: number[] = STREAM.map((it) => {
    const t = acc;
    acc += itemHeight(it) + GAP;
    return t;
  });

  // Scroll target keyed off each item's appearAt: pin its bottom near bottom.
  const scrollFrames: number[] = [];
  const scrollVals: number[] = [];
  STREAM.forEach((it, i) => {
    const bottom = tops[i] + itemHeight(it);
    const target = Math.max(0, bottom - CONV_H + 14);
    scrollFrames.push(it.appearAt + 14);
    scrollVals.push(target);
  });
  // ensure monotonic frames for interpolate
  for (let i = 1; i < scrollFrames.length; i++) {
    if (scrollFrames[i] <= scrollFrames[i - 1]) {
      scrollFrames[i] = scrollFrames[i - 1] + 1;
    }
  }
  const scrollY = interpolate(frame, scrollFrames, scrollVals, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  // Header green dot pulse — loop-safe phase (2 periods over D).
  const dotPhase = (frame / D) * Math.PI * 2 * 2;
  const corePulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(dotPhase));
  const ringT = 0.5 + 0.5 * Math.sin(dotPhase);
  const ringScale = 1 + ringT * 1.4;
  const ringOpacity = (1 - ringT) * 0.3;

  const panelOp = easeOut(frame, 4, 24);

  return (
    <div
      style={{
        position: "absolute",
        left: PANEL_X,
        top: VIEW_Y,
        width: PANEL_W,
        height: VH,
        opacity: panelOp,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: CARD_BG,
          borderRadius: 18,
          border: `1px solid ${HAIRLINE}`,
          boxShadow: `${CARD_SHADOW}, ${CARD_INSET}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${HAIRLINE}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ position: "relative", width: 9, height: 9 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: SUCCESS,
                  transform: `scale(${ringScale})`,
                  opacity: ringOpacity,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: SUCCESS,
                  opacity: corePulse,
                  boxShadow: `0 0 7px ${SUCCESS}88`,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: "-0.2px",
                color: INK,
              }}
            >
              {IT ? "Esecuzione Live" : "Live Run"}
            </span>
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.3px",
              color: SUCCESS,
              border: `1px solid ${SUCCESS}33`,
              background: `${SUCCESS}0D`,
              borderRadius: 999,
              padding: "4px 9px",
            }}
          >
            {IT ? "IN CORSO" : "RUNNING"}
          </div>
        </div>

        {/* State card */}
        <div style={{ padding: "12px 14px 0", flexShrink: 0 }}>
          <StateCard frame={frame} durationInFrames={D} speakWeight={speakWeight} />
        </div>

        {/* Scroll stack */}
        <div
          style={{
            position: "relative",
            margin: "12px 12px 12px",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
            maskImage:
              "linear-gradient(180deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 4,
              top: 0,
              display: "flex",
              flexDirection: "column",
              gap: GAP,
              transform: `translateY(${-scrollY}px)`,
              willChange: "transform",
            }}
          >
            {STREAM.map((it, i) => {
              if (it.kind === "agent")
                return (
                  <AgentBubble key={i} body={it.text} frame={frame} appearAt={it.appearAt} />
                );
              if (it.kind === "user")
                return (
                  <UserBubble key={i} body={it.text} frame={frame} appearAt={it.appearAt} />
                );
              return (
                <ToolConsole
                  key={i}
                  calls={it.calls}
                  frame={frame}
                  appearAt={it.appearAt}
                  lineDelay={it.lineDelay}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StateCard({
  frame,
  durationInFrames,
  speakWeight,
}: {
  frame: number;
  durationInFrames: number;
  speakWeight: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: "#F7F7F8",
        borderRadius: 12,
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
        height: 58,
        overflow: "hidden",
      }}
    >
      {/* LISTENING layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          opacity: 1 - speakWeight,
        }}
      >
        <Waveform mode="listen" frame={frame} durationInFrames={durationInFrames} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "1.8px",
            color: MUTED,
            fontWeight: 500,
          }}
        >
          {IT ? "IN ATTESA…" : "WAITING…"}
        </span>
      </div>
      {/* SPEAKING layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          opacity: speakWeight,
        }}
      >
        <Waveform mode="speak" frame={frame} durationInFrames={durationInFrames} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "1.8px",
            color: ACCENT_DEEP,
            fontWeight: 600,
          }}
        >
          {IT ? "IN ELABORAZIONE" : "PROCESSING"}
        </span>
      </div>
    </div>
  );
}

/* ---- Bubbles --------------------------------------------------------------- */
function AgentBubble({
  body,
  frame,
  appearAt,
}: {
  body: string;
  frame: number;
  appearAt: number;
}) {
  const r = revealAt(frame, appearAt);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        opacity: r.opacity,
        transform: `translateY(${r.ty}px)`,
        filter: r.blur > 0.05 ? `blur(${r.blur}px)` : "none",
      }}
    >
      <Avatar kind="robot" />
      <div
        style={{
          maxWidth: 196,
          background: "linear-gradient(180deg, #FBFBFD 0%, #F4F4F5 100%)",
          border: `1px solid ${HAIRLINE_STRONG}`,
          borderRadius: 14,
          borderTopLeftRadius: 5,
          padding: "8px 11px",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(10,10,11,0.03)",
        }}
      >
        <p
          style={{
            fontSize: 11.5,
            color: INK,
            lineHeight: 1.45,
            margin: 0,
            fontFamily: SANS,
          }}
        >
          {tintEntities(body)}
        </p>
      </div>
    </div>
  );
}

function UserBubble({
  body,
  frame,
  appearAt,
}: {
  body: string;
  frame: number;
  appearAt: number;
}) {
  const r = revealAt(frame, appearAt);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        gap: 8,
        opacity: r.opacity,
        transform: `translateY(${r.ty}px)`,
        filter: r.blur > 0.05 ? `blur(${r.blur}px)` : "none",
      }}
    >
      <div
        style={{
          maxWidth: 192,
          background: `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_DEEP} 100%)`,
          borderRadius: 14,
          borderTopRightRadius: 5,
          padding: "8px 11px",
          boxShadow: `0 1px 2px ${ACCENT}33, 0 6px 16px -10px ${ACCENT_DEEP}66`,
        }}
      >
        <p
          style={{
            fontSize: 11.5,
            color: "#FFFFFF",
            lineHeight: 1.45,
            margin: 0,
            fontFamily: SANS,
            fontWeight: 500,
          }}
        >
          {body}
        </p>
      </div>
      <Avatar kind="person" />
    </div>
  );
}

/* ---- Tool console (multi-call, line-by-line type reveal) ------------------- */
function ToolConsole({
  calls,
  frame,
  appearAt,
  lineDelay,
}: {
  calls: ConsoleCall[];
  frame: number;
  appearAt: number;
  lineDelay: number;
}) {
  const r = revealAt(frame, appearAt - 4);
  // Caret blink — loop-safe: 30 divides 510.
  const caretOn = frame % 30 < 15;

  // Flatten lines across calls into one cumulative index so the second call's
  // header reveals only after the first call's lines finish.
  let cumIndex = 0;
  const callBlocks = calls.map((call) => {
    const headerIndex = cumIndex;
    cumIndex += 1; // header consumes one reveal slot
    const lineMeta = call.lines.map((line) => {
      const idx = cumIndex;
      cumIndex += 1;
      return { line, idx };
    });
    return { call, headerIndex, lineMeta };
  });

  const lineStart = (idx: number) => appearAt + 4 + idx * lineDelay;

  return (
    <div
      style={{
        opacity: r.opacity,
        transform: `translateY(${r.ty}px)`,
        filter: r.blur > 0.05 ? `blur(${r.blur}px)` : "none",
        background: `linear-gradient(180deg, ${CONSOLE_BG2} 0%, ${CONSOLE_BG} 100%)`,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.4), 0 14px 30px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      {callBlocks.map((block, bi) => {
        const headerShown = frame >= lineStart(block.headerIndex);
        if (!headerShown) return null;
        return (
          <div key={bi}>
            {/* header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 11px",
                borderTop: bi > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <TerminalGlyph />
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                    color: SYN_PATH,
                  }}
                >
                  TOOL: {block.call.tool}
                </span>
              </div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  color: block.call.statusColor,
                }}
              >
                {block.call.status}
              </span>
            </div>
            {/* body */}
            <div style={{ padding: "8px 11px 9px" }}>
              {block.lineMeta.map(({ line, idx }, li) => {
                const start = lineStart(idx);
                if (frame < start) return null;
                const len = lineCharLen(line);
                const chars = Math.floor(
                  interpolate(frame, [start, start + lineDelay], [0, len], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                );
                const typing = frame < start + lineDelay;
                return (
                  <ConsoleLineView
                    key={li}
                    line={line}
                    chars={typing ? chars : len}
                    cursor={typing && caretOn}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function sliceSegs(line: ConsoleLineT, chars: number): ConsoleSeg[] {
  const out: ConsoleSeg[] = [];
  let remaining = chars;
  for (const s of line.segs) {
    if (remaining <= 0) break;
    if (s.text.length <= remaining) {
      out.push(s);
      remaining -= s.text.length;
    } else {
      out.push({ text: s.text.slice(0, remaining), color: s.color });
      remaining = 0;
    }
  }
  return out;
}

function ConsoleLineView({
  line,
  chars,
  cursor,
}: {
  line: ConsoleLineT;
  chars: number;
  cursor: boolean;
}) {
  const segs = sliceSegs(line, chars);
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 9.5,
        lineHeight: 1.65,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        paddingLeft: (line.indent ?? 0) * 12,
      }}
    >
      {segs.map((s, i) => (
        <span key={i} style={{ color: s.color }}>
          {s.text}
        </span>
      ))}
      {cursor && (
        <span
          style={{
            display: "inline-block",
            width: 5,
            height: 10,
            marginLeft: 1,
            marginBottom: -1,
            background: SYN_PATH,
            verticalAlign: "baseline",
          }}
        />
      )}
    </div>
  );
}

/* ---- Avatar ---------------------------------------------------------------- */
function Avatar({ kind }: { kind: "robot" | "person" }) {
  const isRobot = kind === "robot";
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 7,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isRobot
          ? "linear-gradient(180deg, #E4F4F3 0%, #D2ECEA 100%)"
          : `linear-gradient(180deg, ${ACCENT} 0%, ${ACCENT_DEEP} 100%)`,
        border: isRobot
          ? "1px solid rgba(46,76,143,0.22)"
          : "1px solid rgba(255,255,255,0.18)",
        boxShadow: isRobot
          ? "inset 0 1px 0 rgba(255,255,255,0.7)"
          : `0 1px 3px ${ACCENT_DEEP}55`,
      }}
    >
      {isRobot ? <RobotGlyph /> : <PersonGlyph />}
    </div>
  );
}

/* ---- Waveform -------------------------------------------------------------- */
function Waveform({
  mode,
  frame,
  durationInFrames,
}: {
  mode: "listen" | "speak";
  frame: number;
  durationInFrames: number;
}) {
  const bars = 22;
  // Loop-safe phases: 8 periods speaking, 4 listening, over the full loop.
  const tSpeak = (frame / durationInFrames) * Math.PI * 2 * 8;
  const tListen = (frame / durationInFrames) * Math.PI * 2 * 4;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        height: 30,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const center = (bars - 1) / 2;
        const dist = Math.abs(i - center) / center;
        const envelope = 1 - dist * 0.55;
        if (mode === "listen") {
          const breathe = 0.5 + 0.5 * Math.sin(tListen + i * 0.5);
          const h = 3 + envelope * (2 + breathe * 2);
          return (
            <div
              key={i}
              style={{
                width: 2.5,
                height: h,
                borderRadius: 2,
                background: MUTED,
                opacity: 0.26 + envelope * 0.12,
              }}
            />
          );
        }
        const wobble =
          Math.sin(tSpeak + i * 0.5) * 0.5 +
          Math.sin(tSpeak * 1.5 - i * 0.45) * 0.32 +
          Math.sin(tSpeak * 0.5 + i * 1.1) * 0.18;
        const norm = (wobble + 1) / 2;
        const h = 4 + envelope * norm * 22;
        const lit = clamp01((norm - 0.35) / 0.45);
        const barColor = mix("#F6BFA8", ACCENT, lit);
        return (
          <div
            key={i}
            style={{
              width: 2.5,
              height: h,
              borderRadius: 2,
              background: barColor,
              opacity: 0.45 + envelope * 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================================
   BACKGROUND + ICONOGRAPHY
============================================================================ */
function BackgroundTexture() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* Soft accent glow behind the panel */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,90,38,0.09) 0%, rgba(236,90,38,0.03) 40%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
      {/* Purple wash low-left (action territory) */}
      <div
        style={{
          position: "absolute",
          left: -80,
          bottom: -120,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(46,76,143,0.07) 0%, transparent 65%)",
        }}
      />
      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 60%, rgba(10,10,11,0.035) 100%)",
        }}
      />
    </div>
  );
}

function TerminalGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 5 L6 8 L3 11"
        stroke={SYN_OK}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.5 11 H12" stroke={SYN_OK} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RobotGlyph() {
  // ShipTime automation mark — a shipping box.
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2 L13.2 4.6 V10.4 L8 13 L2.8 10.4 V4.6 Z"
        stroke={PURPLE_DEEP}
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M2.8 4.6 L8 7.2 L13.2 4.6 M8 7.2 V13" stroke={PURPLE_DEEP} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.4 3.3 L10.6 5.9" stroke={PURPLE} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function PersonGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.4" r="2.6" stroke="#FFFFFF" strokeWidth="1.4" />
      <path
        d="M3.2 13 C3.2 10 5.4 9 8 9 C10.6 9 12.8 10 12.8 13"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
