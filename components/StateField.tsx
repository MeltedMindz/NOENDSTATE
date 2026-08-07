"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's procedural field. Horizontal strata accumulate upward — one
 * appended at a time, like records — with occasional signal-colored lines.
 * Old strata sink into the ink as new ones arrive.
 *
 * Behavior contract:
 * - deterministic-ish ambient drawing, no network, no libraries
 * - pauses when the document is hidden
 * - respects prefers-reduced-motion: renders one static completed field
 * - never blocks input; pointer-events: none
 */

const SIGNALS = ["#59d9c3", "#8be08a", "#e3e05a", "#e39a5a", "#e37a6a"];

export function StateField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;
    let lastAppend = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0e0d0b";
      ctx.fillRect(0, 0, clientWidth, clientHeight);
      if (reduced) {
        drawStatic();
      } else {
        // Seed with existing history so the field never starts empty —
        // the record predates the viewer's arrival.
        for (let i = 0; i < 26; i++) appendStratum();
      }
    }

    function appendStratum() {
      if (!canvas || !ctx) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // New strata arrive in the lower third; everything above is history.
      const y = h - 40 - Math.random() * (h * 0.3);
      const isSignal = Math.random() < 0.12;
      const color = isSignal
        ? SIGNALS[Math.floor(Math.random() * SIGNALS.length)]
        : "rgba(138, 134, 124, 0.5)";
      const inset = Math.random() * w * 0.3;
      const fromLeft = Math.random() > 0.5;
      const x1 = fromLeft ? w * 0.04 : w * 0.04 + inset;
      const x2 = fromLeft ? w * 0.96 - inset : w * 0.96;

      // Sink the existing field slightly into the ink (palimpsest).
      ctx.fillStyle = "rgba(14, 13, 11, 0.055)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = color;
      ctx.lineWidth = isSignal ? 1.5 : 1;
      ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      ctx.beginPath();
      ctx.moveTo(x1, y + 0.5);
      ctx.lineTo(x2, y + 0.5);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawStatic() {
      // Reduced motion: a completed field, drawn once.
      for (let i = 0; i < 70; i++) appendStratum();
    }

    function tick(t: number) {
      if (!running) return;
      if (t - lastAppend > 420) {
        lastAppend = t;
        appendStratum();
      }
      raf = requestAnimationFrame(tick);
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduced) {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
