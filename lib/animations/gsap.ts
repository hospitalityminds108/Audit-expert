"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

// Register once
gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };

/* ─────────────────────────────────────────────
   Reduced-motion hook
   ───────────────────────────────────────────── */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ─────────────────────────────────────────────
   Media query hook
   ───────────────────────────────────────────── */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px) and (pointer: fine)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

/* ─────────────────────────────────────────────
   Scroll animation — generic reveal
   ───────────────────────────────────────────── */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(options?: {
  y?: number;
  stagger?: number;
  start?: string;
  selector?: string;
}) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reduced) {
        gsap.set(ref.current.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0 });
        return;
      }
      const targets = options?.selector
        ? ref.current.querySelectorAll(options.selector)
        : ref.current.querySelectorAll("[data-reveal]");
      if (!targets.length) return;
      gsap.fromTo(
        targets,
        { y: options?.y ?? 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: options?.stagger ?? 0.08,
          scrollTrigger: { trigger: ref.current, start: options?.start ?? "top 78%", once: true }
        }
      );
    },
    { scope: ref, dependencies: [reduced, options?.selector] }
  );

  return ref;
}

/* ─────────────────────────────────────────────
   Parallax
   ───────────────────────────────────────────── */
export function useParallax<T extends HTMLElement = HTMLElement>(strength = 0.2) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reduced) return;
      gsap.to(ref.current, {
        yPercent: -strength * 100,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true }
      });
    },
    { scope: ref, dependencies: [reduced, strength] }
  );

  return ref;
}

/* ─────────────────────────────────────────────
   Counter animation
   ───────────────────────────────────────────── */
export function useCounter(
  target: number,
  opts?: { duration?: number; decimals?: number; start?: boolean }
) {
  const [value, setValue] = useState(0);
  const obj = useRef({ v: 0 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    const tween = gsap.to(obj.current, {
      v: target,
      duration: opts?.duration ?? 1.6,
      ease: "power2.out",
      onUpdate: () => setValue(obj.current.v)
    });
    return () => {
      tween.kill();
    };
  }, [target, reduced, opts?.duration]);

  return value;
}

/* ─────────────────────────────────────────────
   Magnetic hover effect for buttons
   ───────────────────────────────────────────── */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !isDesktop || reduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [isDesktop, reduced, strength]);

  return ref;
}

/* ─────────────────────────────────────────────
   Split text reveal (words)
   ───────────────────────────────────────────── */
export function useSplitReveal<T extends HTMLElement = HTMLElement>(opts?: {
  start?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll<HTMLElement>(".split-word");
      if (!targets.length) return;

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y: "0.6em", rotate: 2, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          stagger: opts?.stagger ?? 0.045,
          delay: opts?.delay ?? 0,
          scrollTrigger: opts?.start
            ? { trigger: el, start: opts.start, once: true }
            : undefined
        }
      );
    },
    { scope: ref, dependencies: [reduced] }
  );

  return ref;
}

/* ─────────────────────────────────────────────
   Horizontal scroll section (GSAP-pinned)
   ───────────────────────────────────────────── */
export function useHorizontalScroll<T extends HTMLElement = HTMLElement>(opts?: {
  endPadding?: number;
  selector?: string;
}) {
  const containerRef = useRef<T>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track || reduced || isMobile) return;

      const getDistance = () => track.scrollWidth - container.clientWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: containerRef, dependencies: [reduced, isMobile] }
  );

  return { containerRef, trackRef };
}

/* ─────────────────────────────────────────────
   Refresh ScrollTrigger after route change
   ───────────────────────────────────────────── */
export function useScrollTriggerRefresh() {
  const pathname = usePathname();
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(t);
  }, [pathname]);
}

/* ─────────────────────────────────────────────
   Helper: safe window check
   ───────────────────────────────────────────── */
export const isBrowser = typeof window !== "undefined";
