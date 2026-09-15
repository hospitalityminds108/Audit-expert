"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { useHorizontalScroll, useIsMobile } from "@/lib/animations/gsap";

/**
 * Section 02 — INDUSTRIES
 * Pinned horizontal scroll through 6 industries.
 */
export default function IndustriesScroller() {
  const { containerRef, trackRef } = useHorizontalScroll<HTMLElement>();
  const isMobile = useIsMobile();

  return (
    <section
      ref={containerRef}
      id="industries"
      data-section="industries"
      className="relative overflow-hidden bg-ink-950"
      aria-label="Industries we audit"
    >
      {/* Section header — vertical space above the pinned track */}
      <div className="container-site pt-24 md:pt-32 pb-10 md:pb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-brass-400">
              <span className="eyebrow-rule" aria-hidden="true" />
              SECTION 02 — INDUSTRIES
            </p>
            <h2
              className="mt-6 font-display text-display-xl md:text-display-2xl text-bone-50 leading-[1.02] tracking-[-0.02em]"
            >
              Every industry has its own truth.
            </h2>
            <p className="mt-6 text-lead text-bone-300/80">
              Industry-specific checklists. Evidence protocols that match the
              moment. Scoring built around what each brand promises.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/industries"
              data-cursor-label="ALL"
              className="group inline-flex items-center gap-3 border border-bone-50/20 px-6 py-3.5 text-sm font-medium text-bone-50 transition-colors duration-300 hover:border-brass-400/60 hover:text-brass-300"
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
      <div className="relative pb-24 md:pb-0">
        <div
          ref={trackRef}
          className="flex gap-5 md:gap-6 px-6 md:px-[var(--gutter)] will-change-transform"
          style={
            isMobile
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
            } flex flex-col items-start justify-center rounded-2xl border border-dashed border-bone-50/15 bg-ink-900/40 p-8`}
            style={isMobile ? { scrollSnapAlign: "center" } : undefined}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brass-400">
              07 / —
            </p>
            <h3 className="mt-4 font-display text-2xl text-bone-50">
              Your industry not listed?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone-300/70">
              We build custom audit frameworks for education, aviation, banking,
              real estate and more. Tell us what you promise your customers.
            </p>
            <Link
              href="/contact"
              data-cursor-label="TALK"
              className="group mt-6 inline-flex items-center gap-3 border-b border-brass-400/40 pb-1 text-sm font-medium text-bone-50 transition-colors duration-300 hover:border-brass-300 hover:text-brass-300"
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
      } group relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950`}
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
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/25" />
      </div>

      {/* Number watermark */}
      <span className="pointer-events-none absolute right-6 top-5 font-mono text-[11px] tracking-[0.18em] text-bone-50/40">
        {String(index + 1).padStart(2, "0")} / 06
      </span>

      {/* Audit types chips */}
      <div className="absolute left-6 right-6 top-5 flex flex-wrap gap-1.5">
        {industry.auditTypes.slice(0, 3).map((type) => (
          <span
            key={type}
            className="rounded-full border border-bone-50/15 bg-ink-950/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-300/80 backdrop-blur-sm"
            aria-hidden="true"
          >
            {type}
          </span>
        ))}
      </div>

      {/* Bottom content */}
      <div className="relative p-6 md:p-7">
        <h3 className="font-display text-[28px] leading-[1.1] tracking-[-0.01em] text-bone-50">
          {industry.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-bone-300/70">
          {industry.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brass-300 transition-colors duration-300 group-hover:text-brass-200">
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
