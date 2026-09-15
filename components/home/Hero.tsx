"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, usePrefersReducedMotion } from "@/lib/animations/gsap";
import { heroConfig } from "@/data/site";

/**
 * Hero — cinematic audit-in-real-time opening.
 * Background scales subtly; headline reveals with stagger;
 * floating score UI parallaxes on scroll.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const scoreRef2 = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (reduced) {
        gsap.set(root.querySelectorAll("[data-hero-word]"), { opacity: 1, y: 0 });
        return;
      }

      // Intro timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        root.querySelectorAll("[data-hero-word]"),
        { opacity: 0, y: "0.65em", filter: "blur(10px)", rotate: 3 },
        { opacity: 1, y: 0, filter: "blur(0px)", rotate: 0, duration: 1.25, stagger: 0.05 },
        0.15
      )
        .fromTo(
          root.querySelectorAll("[data-hero-fade]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          0.7
        )
        .fromTo(
          root.querySelector("[data-hero-score]"),
          { opacity: 0, y: 40, rotateX: 12 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: "power3.out" },
          1.0
        );

      // Scroll-driven exit
      gsap.to(bgRef.current, {
        scale: 1.12,
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true }
      });
      gsap.to(headlineRef.current, {
        yPercent: -22,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "55% top", scrub: true }
      });
      gsap.to(scoreRef.current, {
        y: -120,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true }
      });
      gsap.to(scoreRef2.current, {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true }
      });
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
      aria-label="AuditExpert introduction"
    >
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero.jpg"
          alt="Luxury hotel lobby at dusk — a guest journey in progress"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(213,168,75,0.2),transparent_40%)]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/45 to-ink-950" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-ink-950/30" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="container-site relative z-10 pb-24 pt-40 md:pb-32">
        <div className="grid items-end gap-12 lg:grid-cols-[1.5fr_1fr]">
          {/* Headline column */}
          <div ref={headlineRef}>
            <div className="mb-7 flex items-center gap-4" data-hero-fade>
              <span className="h-px w-10 bg-brass-400" aria-hidden="true" />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.34em] text-brass-300">
                {heroConfig.eyebrow}
                <span className="mx-2 text-bone-500">/</span>
                <span className="text-bone-300">{heroConfig.subEyebrow}</span>
              </p>
            </div>

            <h1 className="max-w-[15ch] text-[clamp(2.6rem,7.2vw,6.8rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-bone-100">
              {heroConfig.headline.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                  {line.split(" ").map((w, j) => (
                    <span
                      key={j}
                      data-hero-word
                      className={`inline-block will-change-transform ${
                        i >= 2 ? "text-brass-200" : ""
                      }`}
                    >
                      {w}
                      {"\u00A0"}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <p className="mt-8 max-w-xl text-lead text-bone-300" data-hero-fade>
              {heroConfig.supporting}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4" data-hero-fade>
              <Link
                href="/industries"
                className="group inline-flex items-center gap-2.5 rounded-full bg-emerald px-8 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-500 hover:bg-sage-600"
              >
                {heroConfig.ctaPrimary.label}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/join-as-auditor"
                className="inline-flex items-center gap-2.5 rounded-full border border-bone-100/25 px-8 py-4 text-sm font-semibold tracking-wide text-bone-100 backdrop-blur-sm transition-all duration-500 hover:border-brass-300/60 hover:text-brass-200"
              >
                {heroConfig.ctaSecondary.label}
              </Link>
            </div>

            {/* Stats strip */}
            <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-bone-100/12 pt-8 sm:grid-cols-4" data-hero-fade>
              {heroConfig.stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-500">{s.label}</dt>
                  <dd className="mt-1.5 font-display text-3xl font-semibold text-bone-100">
                    {s.value}
                    <span className="text-brass-300">{s.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Floating audit score interface */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div
              ref={scoreRef}
              data-hero-score
              className="ml-auto w-[340px] rounded-2xl border border-bone-100/12 bg-ink-950/60 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-bone-500">
                  Service Score
                </p>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-sage-400">
                  <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-sage-400" />
                  Live
                </span>
              </div>
              <p className="mt-4 font-display text-6xl font-semibold text-bone-100">
                92<span className="text-2xl text-brass-300">%</span>
              </p>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Guest Experience", value: 94, w: "94%" },
                  { label: "SOP Compliance", value: 89, w: "89%" },
                  { label: "Brand Standards", value: 93, w: "93%" }
                ].map((m) => (
                  <div key={m.label}>
                    <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
                      <span className="text-bone-400">{m.label}</span>
                      <span className="text-bone-200">{m.value}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-bone-100/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-brass-500 to-brass-300" style={{ width: m.w }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t border-bone-100/10 pt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-bone-500">
                Evidence attached · 3 critical actions
              </p>
            </div>

            {/* Secondary floating chip */}
            <div
              ref={scoreRef2}
              className="absolute -left-2 top-[58%] w-56 rounded-xl border border-bone-100/12 bg-ink-950/55 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={15} className="text-sage-400" />
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone-400">
                  Checkpoint 34/40
                </p>
              </div>
              <p className="mt-2.5 text-[13px] leading-snug text-bone-300">
                Arrival greeting under 30s — <span className="text-sage-300">pass</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block" data-hero-fade>
        <div className="flex flex-col items-center gap-2 text-bone-500">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown size={14} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
