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
  const selector = options?.selector ?? "[data-reveal]";
  const y = options?.y ?? 28;
  const stagger = options?.stagger ?? 0.08;

  useGSAP(
    () => {
      if (!ref.current) return;
      const targets = gsap.utils.toArray<HTMLElement>(selector, ref.current);
      if (!targets.length) return;
      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(targets, { opacity: 0, y });
      // Each element reveals as it enters the viewport; elements entering
      // together are sequenced by data-reveal-delay, else by stagger.
      ScrollTrigger.batch(targets, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((el, i) => {
            const own = parseFloat((el as HTMLElement).dataset.revealDelay ?? "");
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              delay: Number.isFinite(own) ? own : i * stagger,
              overwrite: true,
              // hand transform back to CSS so hover lifts keep working
              clearProps: "transform"
            });
          });
        }
      });
    },
    { scope: ref, dependencies: [reduced, selector, y, stagger] }
  );

  return ref;
}

/* ─────────────────────────────────────────────
   In-view flag (fires once)
   ───────────────────────────────────────────── */
export function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
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
  const start = opts?.start ?? true;
  const duration = opts?.duration ?? 1.6;
  const factor = Math.pow(10, opts?.decimals ?? 0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      return;
    }
    const tween = gsap.to(obj.current, {
      v: target,
      duration,
      ease: "power2.out",
      onUpdate: () => setValue(Math.round(obj.current.v * factor) / factor)
    });
    return () => {
      tween.kill();
    };
  }, [target, reduced, start, duration, factor]);

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
export function useHorizontalScroll<T extends HTMLElement = HTMLElement>() {
  const containerRef = useRef<T>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useGSAP(
    () => {
      const track = trackRef.current;
      const viewport = track?.parentElement;
      if (!track || !viewport || reduced || isMobile) return;

      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      // Pin only the card strip (not the section header) and hold it centred in
      // the viewport, so the cards are fully visible on short laptop screens too.
      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: () => `top ${Math.max(88, Math.round((window.innerHeight - viewport.offsetHeight) / 2))}px`,
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
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
