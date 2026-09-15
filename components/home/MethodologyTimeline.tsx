"use client";

import { useRef } from "react";
import { methodologySteps } from "@/data/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, usePrefersReducedMotion, useIsDesktop } from "@/lib/animations/gsap";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Section 05 — METHODOLOGY
 * A vertical timeline of the 6-step methodology with a scrub-driven
 * progress line that draws as you scroll.
 */
export default function MethodologyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Draw the progress line as the section scrolls
      const progressLine = sectionRef.current.querySelector("[data-progress-line]");
      const steps = gsap.utils.toArray<HTMLElement>("[data-method-step]");

      if (prefersReducedMotion) {
        gsap.set(progressLine, { scaleY: 1 });
        gsap.set(steps, { opacity: 1, y: 0 });
        return;
      }

      if (progressLine) {
        gsap.fromTo(
          progressLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 70%",
              scrub: 0.6,
            },
          }
        );
      }

      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 78%",
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, isDesktop] }
  );

  return (
    <section
      ref={sectionRef}
      id="methodology"
      data-section="methodology"
      className="relative bg-bone-100 py-24 md:py-32 lg:py-40"
    >
      <div className="container-site">
        {/* Header */}
        <div className="mb-16 md:mb-24 max-w-4xl">
          <p className="eyebrow text-brass-500" data-reveal>
            <span className="eyebrow-rule" aria-hidden="true" />
            SECTION 05 — METHODOLOGY
          </p>
          <h2 className="mt-6 font-display text-display-xl md:text-display-2xl text-ink-950 leading-[1.02] tracking-[-0.02em]" data-reveal data-reveal-delay="0.08">
            Define. Design. Assign. Audit. Verify. Improve.
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-ink-700/80" data-reveal data-reveal-delay="0.16">
            Six steps. One standard of evidence. A process built so findings are
            never opinions — they are verified observations with owners and
            deadlines.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Track + progress line */}
          <div
            className="absolute left-[19px] top-2 bottom-2 w-px bg-ink-950/10 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          >
            <div
              data-progress-line
              className="absolute inset-0 w-px origin-top bg-brass-500"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <ol className="space-y-14 md:space-y-0">
            {methodologySteps.map((step, i) => (
              <li
                key={step.number}
                data-method-step
                className="relative md:grid md:grid-cols-2 md:gap-16 md:py-10"
              >
                {/* Dot on the line */}
                <span
                  className="absolute left-[19px] top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-bone-100 bg-ink-950 md:left-1/2 md:top-12"
                  aria-hidden="true"
                />
                <div
                  className={`pl-12 md:pl-0 ${
                    i % 2 === 0
                      ? "md:col-start-1 md:pr-4 md:text-right"
                      : "md:col-start-2 md:pl-4"
                  }`}
                >
                  <div
                    className={`inline-flex items-baseline gap-4 ${
                      i % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <span className="font-mono text-sm font-medium text-brass-600 tabular-nums">
                      {step.number}
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl tracking-[-0.01em] text-ink-950">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-700/80 md:ml-auto">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer link */}
        <div className="mt-16 md:mt-20" data-reveal>
          <Link
            href="/how-it-works"
            data-cursor-label="OPEN"
            className="group inline-flex items-center gap-3 border-b border-brass-600/40 pb-1 text-sm font-medium text-ink-950 transition-colors duration-300 hover:border-brass-500 hover:text-brass-600"
          >
            Read the full methodology
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
