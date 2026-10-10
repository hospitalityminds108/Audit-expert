"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/animations/gsap";

/**
 * Re-measures scroll-linked animations after each route change and once
 * images and fonts have settled, so triggers never fire at stale positions.
 */
export default function ScrollTriggerRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 250);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  return null;
}
