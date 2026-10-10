"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, usePrefersReducedMotion } from "@/lib/animations/gsap";

/**
 * ProgressTracker — sticky scroll progress bar + active section indicator
 * for long-form industry pages.
 */
export default function ProgressTracker({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !barRef.current) return;
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: "#page-content",
            start: "top 60%",
            end: "bottom 80%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: wrapperRef, dependencies: [prefersReducedMotion] }
  );

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div ref={wrapperRef} className="sticky top-24 z-40 hidden md:block">
      <div className="container-site">
        <div className="flex items-center gap-6 border-b border-fg-50/10 pb-3">
          <div className="h-px flex-1 overflow-hidden bg-base-800">
            <div ref={barRef} className="h-px w-full origin-left bg-brand-600" />
          </div>
          <nav aria-label="Page sections" className="flex items-center gap-5">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  activeId === s.id
                    ? "text-accent"
                    : "text-fg-300/60 hover:text-fg-300/80"
                }`}
                aria-current={activeId === s.id ? "location" : undefined}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
