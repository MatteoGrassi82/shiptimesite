import { useId } from "react";

import { cn } from "@/lib/utils";

// Tiling dot field rendered as one SVG <pattern>, so the density is resolution
// independent and costs a single node no matter how large the area. useId keeps
// the pattern id unique when several instances share a page — without it the
// second instance would reference the first one's fill.
//
// Vendored as given; the only change is that colour comes from the caller via
// className (we pass a ShipTime ink/orange tint) rather than the stock slate.

interface DotPatternProps {
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  cx?: number | string;
  cy?: number | string;
  cr?: number | string;
  className?: string;
  [key: string]: unknown;
}

export function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full fill-slate-500/50 md:fill-slate-500/70", className)}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export default DotPattern;
