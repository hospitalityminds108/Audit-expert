"use client";


import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/lib/animations/gsap";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * Home final CTA — the closing argument.
 */
export default function HomeCTA() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 70%" });



  return (
    <section
      ref={sectionRef}
      id="book"
      data-section="book"
      className="relative overflow-hidden bg-ink-950 py-28 md:py-36 lg:py-44"
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-500/[0.08] blur-[140px]"
        aria-hidden="true"
      />

      {/* Giant watermark */}
      <p
        className="pointer-events-none absolute inset-x-0 bottom-6 select-none text-center font-display text-[18vw] leading-none tracking-tight text-bone-50/[0.025]"
        aria-hidden="true"
      >
        SEE
      </p>

      <div className="container-site relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center text-brass-400" data-reveal>
            <span className="eyebrow-rule" aria-hidden="true" />
            THE NEXT STEP
          </p>
          <h2
            className="mt-8 font-display text-display-2xl md:text-[clamp(2.8rem,7vw,5.5rem)] text-bone-50 leading-[1.0] tracking-[-0.02em]"
            data-reveal
            data-reveal-delay="0.1"
          >
            See what your customers experience.
            <span className="block text-brass-300">Know what your teams deliver.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lead text-bone-300/75" data-reveal data-reveal-delay="0.2">
            Book an audit in minutes. Choose your industry, pick a plan, tell
            us where and when — we handle the rest, and the report tells you
            the truth.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-reveal data-reveal-delay="0.3">
            <MagneticButton
              href="/book-an-audit"
              variant="primary"
              showArrow
              className="!bg-bone-50 !text-ink-950"
              data-cursor-label="BOOK"
            >
              Book an Audit
            </MagneticButton>
            <MagneticButton
              href="/industries"
              variant="outline"
              className="!border-bone-50/25 !text-bone-50"
              data-cursor-label="VIEW"
            >
              Find My Industry
            </MagneticButton>
          </div>

          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-300/40" data-reveal data-reveal-delay="0.4">
            SEE → MEASURE → UNDERSTAND → IMPROVE
          </p>
        </div>
      </div>
    </section>
  );
}
