"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/animations/gsap";

/**
 * Bridges Lenis smooth scroll with GSAP ScrollTrigger.
 * Mounts once at the app root.
 */
export default function LenisGSAPBridge() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      // Refresh triggers after route changes (content height changes)
      const t = setTimeout(() => ScrollTrigger.refresh(), 150);
      return () => {
        lenis.off?.("scroll", ScrollTrigger.update);
        clearTimeout(t);
      };
    }
  }, [pathname]);

  return null;
}
