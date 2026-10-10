"use client";

import { useEffect } from "react";

/**
 * PointerGlow — feeds pointer coordinates to the `.glass` surface under the
 * cursor so its highlight follows the mouse. One passive listener for the
 * whole app; no-op on touch devices.
 */
export default function PointerGlow() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const card = e.target instanceof Element ? e.target.closest<HTMLElement>(".glass") : null;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
