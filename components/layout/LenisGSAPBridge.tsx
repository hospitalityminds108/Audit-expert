"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/animations/gsap";
import { useSmoothScroll } from "./SmoothScrollProvider";

/**
 * Bridges Lenis smooth scroll with GSAP ScrollTrigger.
 * Mounts once at the app root.
 */
export default function LenisGSAPBridge() {
  const pathname = usePathname();
  const { lenis } = useSmoothScroll();

  // Keep ScrollTrigger in step with Lenis
  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  // Re-measure triggers after route changes and once images/fonts settle
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 200);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  return null;
}
