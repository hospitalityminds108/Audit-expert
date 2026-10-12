"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/data/navigation";
import { gsap, useScrollReveal, usePrefersReducedMotion } from "@/lib/animations/gsap";

const ROTATE_MS = 6500;

/** Photograph behind each result's metric, in the order of the testimonials */
const RESULT_IMAGES = [
  { src: "/images/industries/hotels-resorts.jpg", alt: "Hotel lobby" },
  { src: "/images/industries/restaurants-cafes.jpg", alt: "Restaurant dining room" },
  { src: "/images/industries/hospitals-clinics.jpg", alt: "Hospital reception" },
] as const;

/**
 * Testimonials — what changed after the audit.
 * One quote on stage at a time with its headline metric; rotates on a timer
 * (paused on hover/focus and for reduced motion), with manual controls.
 */
export default function Testimonials() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const count = testimonials.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  // Auto-advance
  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => go(index + 1), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, paused, reduced, go]);

  // Animate the incoming quote
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-quote-part]",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }
      );
      gsap.fromTo("[data-quote-metric]", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.6)" });
    }, stage);
    return () => ctx.revert();
  }, [index, reduced]);

  const t = testimonials[index];

  return (
    <section
      ref={sectionRef}
      id="results"
      data-section="results"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
      aria-labelledby="results-heading"
    >
      <div className="container-site">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow" data-reveal>
              <span className="eyebrow-rule" aria-hidden="true" />
              WHAT CHANGED AFTER THE AUDIT
            </p>
            <h2
              id="results-heading"
              className="mt-6 font-display text-display-lg leading-[1.02] text-fg-50"
              data-reveal
              data-reveal-delay="0.08"
            >
              Evidence that moves the numbers.
            </h2>
          </div>
          <div className="flex items-center gap-3" data-reveal data-reveal-delay="0.16">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous result"
              className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next result"
              className="btn-ghost flex h-12 w-12 items-center justify-center rounded-full"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          data-reveal
          data-reveal-delay="0.2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="glass overflow-hidden rounded-3xl border border-fg-50/10"
        >
          <div ref={stageRef} className="grid md:grid-cols-[1fr_1.7fr]" aria-live="polite">
            {/* Metric */}
            <div className="relative flex min-h-[260px] flex-col justify-between gap-10 overflow-hidden p-8 text-white md:p-12">
              {/* All photographs stay mounted and cross-fade, so nothing reloads mid-rotation */}
              {RESULT_IMAGES.map((img, i) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={i === index % RESULT_IMAGES.length ? img.alt : ""}
                  fill
                  sizes="(min-width: 768px) 36vw, 100vw"
                  className={`object-cover transition-opacity duration-700 ${
                    i === index % RESULT_IMAGES.length ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div
                className="absolute inset-0 bg-gradient-to-br from-brand-600/90 via-brand-700/80 to-brand-700/95"
                aria-hidden="true"
              />
              <Quote className="relative h-9 w-9 text-white/70" aria-hidden="true" />
              <div className="relative" data-quote-metric>
                <p className="font-display text-6xl font-semibold leading-none tabular-nums md:text-7xl">{t.metric}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">{t.metricLabel}</p>
              </div>
            </div>

            {/* Quote */}
            <figure className="flex flex-col justify-between gap-10 p-8 md:p-12">
              <blockquote
                data-quote-part
                className="font-display text-[1.7rem] font-medium leading-[1.3] text-fg-50 md:text-[2.25rem]"
              >
                “{t.quote}”
              </blockquote>
              <figcaption data-quote-part className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 font-mono text-xs font-semibold text-accent">
                  {t.author.split(" ").map((w) => w[0]).join("")}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-fg-50">{t.author}</span>
                  <span className="block text-[13px] text-fg-400">{t.context}</span>
                </span>
              </figcaption>
            </figure>
          </div>

          {/* Progress / pagination */}
          <div className="flex gap-2 border-t border-fg-50/10 px-8 py-5 md:px-12">
            {testimonials.map((item, i) => (
              <button
                key={item.context}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show result ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className="group h-6 flex-1"
              >
                <span className="block h-[3px] overflow-hidden rounded-full bg-base-700 transition-colors group-hover:bg-base-600">
                  <span
                    key={i === index ? `on-${index}-${paused}` : "off"}
                    className="block h-full origin-left rounded-full bg-brand-500"
                    style={
                      i === index
                        ? reduced || paused
                          ? { transform: "scaleX(1)" }
                          : { animation: `progress-fill ${ROTATE_MS}ms linear both` }
                        : { transform: i < index ? "scaleX(1)" : "scaleX(0)" }
                    }
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
