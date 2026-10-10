"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

/**
 * Subtle page transition — a curtain wipe on route change.
 * Wrap <main> children.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const main = mainRef.current;
    if (!curtain || !main) return;

    const isFirst = lastPath.current === null;
    const samePath = lastPath.current === pathname;
    lastPath.current = pathname;
    // First paint and effect re-runs on the same route play nothing
    if (isFirst || samePath) return;

    // New route starts at the top, unless it targets an in-page anchor
    if (!window.location.hash) {
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A transform left on this wrapper would break position:fixed children and
    // ScrollTrigger pinning, so every exit path clears it.
    const settle = () => {
      gsap.set(curtain, { display: "none" });
      gsap.set(main, { clearProps: "transform,opacity" });
      ScrollTrigger.refresh();
    };

    const tl = gsap.timeline({ onComplete: settle });
    tl.set(curtain, { display: "block", yPercent: 0 })
      .set(main, { opacity: 0, y: 14 })
      .to(curtain, { yPercent: -100, duration: 0.6, ease: "power3.inOut" })
      .to(main, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.35");

    return () => {
      tl.kill();
      settle();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] hidden bg-gradient-to-b from-base-800 via-base-900 to-base-950"
      />
      <div ref={mainRef}>{children}</div>
    </>
  );
}
