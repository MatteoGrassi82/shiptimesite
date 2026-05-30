"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useCallback } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  autoRotateSpeed?: number;
  connections?: { from: [number, number]; to: [number, number] }[];
  markers?: { lat: number; lng: number; label?: string }[];
}

const DEFAULT_MARKERS = [
  { lat: 43.65, lng: -79.38,  label: "Toronto" },
  { lat: 45.50, lng: -73.57,  label: "Montreal" },
  { lat: 49.28, lng: -123.12, label: "Vancouver" },
  { lat: 51.04, lng: -114.07, label: "Calgary" },
  { lat: 40.71, lng: -74.01,  label: "New York" },
  { lat: 34.05, lng: -118.24, label: "Los Angeles" },
  { lat: 41.88, lng: -87.63,  label: "Chicago" },
  { lat: 29.76, lng: -95.37,  label: "Houston" },
  { lat: 47.61, lng: -122.33, label: "Seattle" },
  { lat: 25.76, lng: -80.19,  label: "Miami" },
];

const DEFAULT_CONNECTIONS: { from: [number, number]; to: [number, number] }[] = [
  { from: [43.65, -79.38],  to: [40.71, -74.01] },
  { from: [43.65, -79.38],  to: [45.50, -73.57] },
  { from: [43.65, -79.38],  to: [41.88, -87.63] },
  { from: [49.28, -123.12], to: [47.61, -122.33] },
  { from: [49.28, -123.12], to: [34.05, -118.24] },
  { from: [40.71, -74.01],  to: [25.76, -80.19] },
  { from: [34.05, -118.24], to: [29.76, -95.37] },
  { from: [41.88, -87.63],  to: [29.76, -95.37] },
  { from: [51.04, -114.07], to: [47.61, -122.33] },
];

function latLngToXYZ(lat: number, lng: number, r: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}

function rotateY(x: number, y: number, z: number, a: number): [number, number, number] {
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}

function rotateX(x: number, y: number, z: number, a: number): [number, number, number] {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}

function project(x: number, y: number, z: number, cx: number, cy: number, fov: number): [number, number] {
  const s = fov / (fov + z);
  return [x * s + cx, y * s + cy];
}

export function InteractiveGlobe({
  className,
  size = 600,
  dotColor = "rgba(200, 210, 255, ALPHA)",
  arcColor = "rgba(236, 90, 38, 0.65)",
  markerColor = "rgba(236, 90, 38, 1)",
  autoRotateSpeed = 0.0015,
  connections = DEFAULT_CONNECTIONS,
  markers = DEFAULT_MARKERS,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef = useRef(0.4);
  const rotXRef = useRef(0.25);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const dotsRef = useRef<[number, number, number][]>([]);

  useEffect(() => {
    const dots: [number, number, number][] = [];
    const n = 1400;
    const gr = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < n; i++) {
      const theta = (2 * Math.PI * i) / gr;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      dots.push([Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi)]);
    }
    dotsRef.current = dots;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) * 0.38;
    const fov = 600;

    if (!dragRef.current.active) rotYRef.current += autoRotateSpeed;
    timeRef.current += 0.015;
    const t = timeRef.current;
    const ry = rotYRef.current;
    const rx = rotXRef.current;

    ctx.clearRect(0, 0, w, h);

    // Dots
    for (const d of dotsRef.current) {
      let [x, y, z] = [d[0] * radius, d[1] * radius, d[2] * radius];
      [x, y, z] = rotateX(x, y, z, rx);
      [x, y, z] = rotateY(x, y, z, ry);
      if (z > 0) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const alpha = Math.max(0.1, 1 - (z + radius) / (2 * radius));
      ctx.beginPath();
      ctx.arc(sx, sy, 0.9 + alpha * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = dotColor.replace("ALPHA", alpha.toFixed(2));
      ctx.fill();
    }

    // Arcs + traveling dots
    for (const conn of connections) {
      let [x1, y1, z1] = latLngToXYZ(conn.from[0], conn.from[1], radius);
      let [x2, y2, z2] = latLngToXYZ(conn.to[0], conn.to[1], radius);
      [x1, y1, z1] = rotateX(x1, y1, z1, rx); [x1, y1, z1] = rotateY(x1, y1, z1, ry);
      [x2, y2, z2] = rotateX(x2, y2, z2, rx); [x2, y2, z2] = rotateY(x2, y2, z2, ry);
      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;
      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, mz = (z1 + z2) / 2;
      const ml = Math.sqrt(mx * mx + my * my + mz * mz);
      const ah = radius * 1.22;
      const [scx, scy] = project((mx / ml) * ah, (my / ml) * ah, (mz / ml) * ah, cx, cy, fov);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // Traveling dot
      const tp = (Math.sin(t * 1.1 + conn.from[0] * 0.1) + 1) / 2;
      const tx2 = (1 - tp) * (1 - tp) * sx1 + 2 * (1 - tp) * tp * scx + tp * tp * sx2;
      const ty2 = (1 - tp) * (1 - tp) * sy1 + 2 * (1 - tp) * tp * scy + tp * tp * sy2;
      ctx.beginPath();
      ctx.arc(tx2, ty2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();
    }

    // Markers
    for (const m of markers) {
      let [x, y, z] = latLngToXYZ(m.lat, m.lng, radius);
      [x, y, z] = rotateX(x, y, z, rx); [x, y, z] = rotateY(x, y, z, ry);
      if (z > radius * 0.1) continue;
      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const pulse = Math.sin(t * 2 + m.lat) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 4 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(236, 90, 38, ${0.15 + pulse * 0.15})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();
    }

    animRef.current = requestAnimationFrame(draw);
  }, [dotColor, arcColor, markerColor, autoRotateSpeed, connections, markers]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotYRef.current, startRotX: rotXRef.current };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    rotYRef.current = dragRef.current.startRotY + (e.clientX - dragRef.current.startX) * 0.005;
    rotXRef.current = Math.max(-1, Math.min(1, dragRef.current.startRotX + (e.clientY - dragRef.current.startY) * 0.005));
  }, []);

  const onPointerUp = useCallback(() => { dragRef.current.active = false; }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("cursor-grab active:cursor-grabbing", className)}
      style={{ width: size, height: size }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}
