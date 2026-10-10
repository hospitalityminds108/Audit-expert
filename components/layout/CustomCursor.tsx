"use client";

import { useEffect, useRef, useState } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/animations/gsap";

const INTERACTIVE =
  "a, button, [data-cursor-label], input, select, textarea, label, summary, [role='button'], [role='tab'], [data-interactive]";
const TEXT_FIELD = "input, select, textarea";

/**
 * Premium custom cursor — desktop, fine-pointer only.
 * Expands on interactive elements; shows labels on media.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isDesktop || reduced) {
      document.body.removeAttribute("data-cursor");
      return;
    }
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.setAttribute("data-cursor", "custom");

    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    let started = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!started) {
        // First sighting — snap the ring to the pointer instead of flying in from 0,0
        started = true;
        ringX = mouseX;
        ringY = mouseY;
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      const el = e.target instanceof Element ? e.target : null;
      const target = el?.closest<HTMLElement>(INTERACTIVE) ?? null;
      // Text fields keep the native caret, so step out of the way
      setHidden(Boolean(el?.closest(TEXT_FIELD)));
      setActive(Boolean(target));
      setLabel(el?.closest<HTMLElement>("[data-cursor-label]")?.getAttribute("data-cursor-label") || null);
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onLeave = () => setHidden(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.body.removeAttribute("data-cursor");
    };
  }, [isDesktop, reduced]);

  if (!isDesktop || reduced) return null;

  const size = label ? 76 : active ? 52 : 32;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-brass-400 shadow-[0_0_0_1px_rgba(21,25,23,0.55)] transition-opacity duration-300 ${
          hidden || label ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        ref={ringRef}
        style={{ width: size, height: size }}
        className={`fixed left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-300 ease-premium ${
          label
            ? "border-brass-400 bg-base-950/90"
            : active
              ? "border-brass-400 bg-brass-400/15 shadow-[0_0_0_1px_rgba(21,25,23,0.35)]"
              : "border-brass-500 shadow-[0_0_0_1px_rgba(21,25,23,0.35)]"
        } ${hidden ? "opacity-0" : "opacity-100"}`}
      >
        {label && (
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
