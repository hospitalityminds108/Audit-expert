"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { useScrollReveal } from "@/lib/animations/gsap";

/** Grid placement per tile: one feature tile, two wide tiles, three standard. */
const SPANS = [
  "col-span-2 row-span-2",
  "col-span-2",
  "col-span-1",
  "col-span-1",
  "col-span-2",
  "col-span-1",
] as const;

/**
 * Section 02 — INDUSTRIES
 * A photographic grid of the six industries. Everything is in normal page
 * flow — no pinned or horizontal scrolling.
 */
export default function IndustriesBento() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.07 });

  return (
    <section
      ref={sectionRef}
      id="industries"
      data-section="industries"
      className="relative py-24 md:py-32"
      aria-labelledby="industries-heading"
    >
      <div className="container-site">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow" data-reveal>
              <span className="eyebrow-rule" aria-hidden="true" />
              SECTION 02 — INDUSTRIES
            </p>
            <h2
              id="industries-heading"
              className="mt-6 font-display text-display-lg leading-[1.02] text-fg-50"
              data-reveal
            >
              Every industry has its own truth.
            </h2>
            <p className="mt-6 text-lead text-fg-300" data-reveal>
              Industry-specific checklists. Evidence protocols that match the
              moment. Scoring built around what each brand promises.
            </p>
          </div>
          <Link
            href="/industries"
            data-reveal
            className="btn-ghost group inline-flex shrink-0 items-center gap-2.5 self-start rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide md:self-auto"
          >
            View all industries
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4 md:gap-4 lg:auto-rows-[250px]">
          {industries.map((industry, i) => (
            <Link
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              data-reveal
              aria-label={`Explore audits for ${industry.title}`}
              className={`group relative overflow-hidden rounded-3xl shadow-[0_30px_60px_-40px_rgba(16,64,44,0.6)] ${SPANS[i] ?? "col-span-1"}`}
            >
              <Image
                src={industry.image}
                alt={industry.imageAlt}
                fill
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.07]"
              />
              {/* Green scrim keeps the label readable without going dark */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand-700/90 via-brand-700/25 to-transparent transition-opacity duration-500 group-hover:opacity-90"
                aria-hidden="true"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-fg-100">
                {String(i + 1).padStart(2, "0")} / 06
              </span>
              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-accent transition-transform duration-500 ease-premium group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <h3
                  className={`font-display leading-[1.1] tracking-[-0.01em] text-white ${
                    i === 0 ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
                  }`}
                >
                  {industry.title}
                </h3>
                {i === 0 && (
                  <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-white/85 sm:block">
                    {industry.description}
                  </p>
                )}
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/80">
                  {industry.auditTypes.slice(0, i === 0 ? 4 : 2).map((type) => (
                    <span key={type}>{type}</span>
                  ))}
                </p>
              </div>
            </Link>
          ))}

          {/* Not listed */}
          <div
            data-reveal
            className="glass col-span-2 flex flex-col justify-center rounded-3xl border border-dashed border-brand-500/40 p-6 md:col-span-1"
          >
            <h3 className="font-display text-xl text-fg-50">Your industry not listed?</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-fg-300">
              We build custom frameworks for education, aviation, banking and more.
            </p>
            <Link
              href="/contact"
              className="tap group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              Request a framework
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
