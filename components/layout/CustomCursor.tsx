"use client";

import { useEffect, useRef, useState } from "react";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/animations/gsap";

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
    document.body.setAttribute("data-cursor", "custom");

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setHidden(false);
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;

      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor-label], input, select, textarea, [role='button'], [data-interactive]"
      );
      if (target) {
        setActive(true);
        const text = target.getAttribute("data-cursor-label");
        setLabel(text || null);
      } else {
        setActive(false);
        setLabel(null);
      }
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      const size = label ? 76 : active ? 52 : 32;
      ring.style.transform = `translate3d(${ringX - size / 2}px, ${ringY - size / 2}px, 0)`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
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
  }, [isDesktop, reduced, active, label]);

  if (!isDesktop || reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-brass-300 transition-opacity duration-300 ${
          hidden ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 flex items-center justify-center rounded-full border transition-all duration-300 ease-premium ${
          label
            ? "border-brass-300 bg-ink-950/85 backdrop-blur-sm"
            : active
              ? "border-brass-300/70 bg-brass-300/10"
              : "border-bone-100/40"
        } ${hidden ? "opacity-0" : "opacity-100"}`}
      >
        {label && (
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-brass-200">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
