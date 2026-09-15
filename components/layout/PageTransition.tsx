"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/animations/gsap";

/**
 * Subtle page transition — a curtain wipe on route change.
 * Wrap <main> children.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const curtain = curtainRef.current;
    const main = mainRef.current;
    if (!curtain || !main) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (firstRender.current) {
      // Initial load: fade content in without curtain
      firstRender.current = false;
      gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" });
      return;
    }

    const tl = gsap.timeline();
    tl.set(curtain, { display: "block" })
      .fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: "power3.inOut" })
      .fromTo(main, { opacity: 1 }, { opacity: 0, duration: 0.2 }, "<")
      .set(curtain, { yPercent: -100, display: "none" })
      .set(main, { opacity: 1 })
      .fromTo(
        main,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
      );

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] hidden bg-ink-900"
      />
      <div ref={mainRef}>{children}</div>
    </>
  );
}
