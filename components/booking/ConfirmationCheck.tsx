"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations/gsap";
import { usePrefersReducedMotion } from "@/lib/animations/gsap";

/**
 * Animated SVG check mark — brass circle draw + check stroke
 * draw-on. Honors prefers-reduced-motion (static state).
 */
export default function ConfirmationCheck({
  size = 96,
}: {
  size?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!svgRef.current) return;
    const circle = svgRef.current.querySelector<SVGPathElement>(".check-circle");
    const mark = svgRef.current.querySelector<SVGPathElement>(".check-mark");
    if (!circle || !mark) return;

    if (reduced) {
      gsap.set([circle, mark], { strokeDashoffset: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(
      circle,
      { strokeDashoffset: 302 },
      { strokeDashoffset: 0, duration: 0.9 },
      0.15
    )
      .fromTo(
        mark,
        { strokeDashoffset: 52 },
        { strokeDashoffset: 0, duration: 0.45 },
        0.75
      )
      .fromTo(
        svgRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 },
        0
      );
    return () => {
      tl.kill();
    };
  }, [reduced]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="Booking confirmed"
    >
      <path
        className="check-circle"
        d="M50 50 m -38 0 a 38 38 0 1 0 76 0 a 38 38 0 1 0 -76 0"
        stroke="#c9a962"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="302"
        strokeDashoffset={reduced ? 0 : 302}
      />
      <path
        className="check-mark"
        d="M32 51 L45 64 L70 38"
        stroke="#c9a962"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="52"
        strokeDashoffset={reduced ? 0 : 52}
      />
    </svg>
  );
}
