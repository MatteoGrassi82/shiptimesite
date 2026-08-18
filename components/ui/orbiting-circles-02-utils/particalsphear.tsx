"use client";

import { useEffect, useRef } from "react";

// Particle globe for the orbiting-circles integration section: ~700 points on
// a fibonacci sphere, rotated around Y and tilted toward the viewer, drawn on
// a 2D canvas. ShipTime palette — navy points with sparse orange nodes. Static
// single frame under prefers-reduced-motion.
export default function ParticleSphereAnimation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // fibonacci sphere: evenly distributed points, no pole clumping
    const N = 700;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const pts: { x: number; y: number; z: number; orange: boolean }[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = GA * i;
      pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, orange: i % 29 === 0 });
    }

    let W = 0;
    let H = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, W * dpr);
      canvas.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let t = 0;
    const tilt = -0.35;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const R = (Math.min(W, H) / 2) * 0.92;
      const cx = W / 2;
      const cy = H / 2;
      for (const p of pts) {
        const x1 = p.x * Math.cos(t) + p.z * Math.sin(t);
        const z1 = -p.x * Math.sin(t) + p.z * Math.cos(t);
        const y2 = p.y * Math.cos(tilt) - z1 * Math.sin(tilt);
        const z2 = p.y * Math.sin(tilt) + z1 * Math.cos(tilt);
        const depth = (z2 + 1) / 2; // 0 back … 1 front
        const alpha = 0.1 + depth * 0.6;
        ctx.fillStyle = p.orange ? `rgba(236,90,38,${alpha})` : `rgba(28,30,61,${alpha})`;
        ctx.beginPath();
        ctx.arc(cx + x1 * R, cy + y2 * R, 0.6 + depth * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      t += 0.0035;
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="h-full w-full" />;
}
