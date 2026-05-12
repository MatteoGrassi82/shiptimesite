import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Icon = {
  Lightning: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></svg>
  ),
  Layers: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M12 2l10 5-10 5L2 7l10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
  ),
  Map: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></svg>
  ),
  Chart: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" /></svg>
  ),
  Cart: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" /></svg>
  ),
  Warehouse: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M22 12V8L12 3 2 8v4" /><path d="M2 12v9h20v-9" /><path d="M6 21V12h12v9" /></svg>
  ),
  Package: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg>
  ),
  Check: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M20 6L9 17l-5-5" /></svg>
  ),
  Tag: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><circle cx="7" cy="7" r="1.5" /></svg>
  ),
  Dollar: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
  ),
  Code: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
  ),
  Shield: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
  Return: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M9 14L4 9l5-5" /><path d="M4 9h11a5 5 0 015 5v3" /></svg>
  ),
  Search: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
  ),
  Clipboard: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><rect x="6" y="4" width="12" height="18" rx="2" /><rect x="9" y="2" width="6" height="4" rx="1" /></svg>
  ),
  Calendar: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
  ),
  Phone: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" /></svg>
  ),
  Chat: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
  ),
  Mail: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg>
  ),
  Mobile: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
  ),
  Cog: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>
  ),
};
