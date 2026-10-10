"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { useHorizontalScroll, useIsMobile, usePrefersReducedMotion } from "@/lib/animations/gsap";

/**
 * Section 02 — INDUSTRIES
 * Pinned horizontal scroll through 6 industries.
 */
export default function IndustriesScroller() {
  const { containerRef, trackRef } = useHorizontalScroll<HTMLElement>();
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  // Without the pinned scroll the strip must be swipeable / scrollable itself
  const nativeScroll = isMobile || reduced;

  return (
    <section
      ref={containerRef}
      id="industries"
      data-section="industries"
      className="relative overflow-hidden pb-24 md:pb-32"
      aria-label="Industries we audit"
    >
      {/* Section header — vertical space above the pinned track */}
      <div className="container-site pt-24 md:pt-32 pb-10 md:pb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              SECTION 02 — INDUSTRIES
            </p>
            <h2
              className="mt-6 font-display text-display-lg text-fg-50 leading-[1.02] tracking-[-0.02em]"
            >
              Every industry has its own truth.
            </h2>
            <p className="mt-6 text-lead text-fg-300/80">
              Industry-specific checklists. Evidence protocols that match the
              moment. Scoring built around what each brand promises.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/industries"
              data-cursor-label="ALL"
              className="group inline-flex items-center gap-3 border border-fg-50/20 px-6 py-3.5 text-sm font-medium text-fg-50 transition-colors duration-300 hover:border-brass-400/60 hover:text-accent"
            >
              View all industries
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal track */}
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-5 md:gap-6 px-6 md:px-[var(--gutter)] will-change-transform"
          style={
            nativeScroll
              ? { overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }
              : undefined
          }
        >
          {industries.map((industry, i) => (
            <IndustryCard
              key={industry.slug}
              industry={industry}
              index={i}
              isMobile={isMobile}
            />
          ))}

          {/* End cap card */}
          <div
            className={`${
              isMobile ? "w-[80vw] shrink-0" : "w-[420px] shrink-0"
            } flex flex-col items-start justify-center rounded-2xl border border-dashed border-fg-50/15 glass p-8`}
            style={isMobile ? { scrollSnapAlign: "center" } : undefined}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              07 / —
            </p>
            <h3 className="mt-4 font-display text-2xl text-fg-50">
              Your industry not listed?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-300/80">
              We build custom audit frameworks for education, aviation, banking,
              real estate and more. Tell us what you promise your customers.
            </p>
            <Link
              href="/contact"
              data-cursor-label="TALK"
              className="group mt-6 inline-flex items-center gap-3 border-b border-brass-400/40 pb-1 text-sm font-medium text-fg-50 transition-colors duration-300 hover:border-brass-300 hover:text-accent"
            >
              Request a custom framework
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function IndustryCard({
  industry,
  index,
  isMobile,
}: {
  industry: (typeof industries)[number];
  index: number;
  isMobile: boolean;
}) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      data-cursor-label="VIEW"
      className={`${
        isMobile ? "w-[78vw] shrink-0" : "w-[420px] shrink-0"
      } group relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-2xl border border-fg-50/10 bg-white/60 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950`}
      style={isMobile ? { scrollSnapAlign: "center" } : undefined}
      aria-label={`Explore audits for ${industry.title}`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={industry.image}
          alt={industry.imageAlt}
          fill
          sizes="(min-width: 1024px) 420px, 78vw"
          className="object-cover opacity-55 transition-all duration-[1200ms] ease-premium group-hover:scale-[1.05] group-hover:opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/60 to-base-950/25" />
      </div>

      {/* Number watermark */}
      <span className="pointer-events-none absolute right-6 top-5 font-mono text-[11px] tracking-[0.18em] text-fg-50/60">
        {String(index + 1).padStart(2, "0")} / 06
      </span>

      {/* Audit types chips */}
      <div className="absolute left-6 right-6 top-5 flex flex-wrap gap-1.5">
        {industry.auditTypes.slice(0, 3).map((type) => (
          <span
            key={type}
            className="rounded-full border border-fg-50/15 bg-base-950/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/80 backdrop-blur-sm"
            aria-hidden="true"
          >
            {type}
          </span>
        ))}
      </div>

      {/* Bottom content */}
      <div className="relative p-6 md:p-7">
        <h3 className="font-display text-[28px] leading-[1.1] tracking-[-0.01em] text-fg-50">
          {industry.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-fg-300/80">
          {industry.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-300 group-hover:text-accent">
          View industry
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
          />
        </span>
      </div>
    </Link>
  );
}
