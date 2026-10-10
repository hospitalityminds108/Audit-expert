"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, usePrefersReducedMotion } from "@/lib/animations/gsap";
import { heroConfig } from "@/data/site";

const SCORES = [
  { label: "Guest Experience", value: 94 },
  { label: "SOP Compliance", value: 89 },
  { label: "Brand Standards", value: 93 },
] as const;

/**
 * Hero — split composition on the white canvas.
 * Left: masked word-by-word headline, CTAs, counting stats.
 * Right: a framed photograph that wipes open, with glass score cards that
 * drift with the pointer and parallax away on scroll.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return;
      const q = gsap.utils.selector(root);
      const counters = q("[data-count]") as HTMLElement[];
      const bars = q("[data-bar]") as HTMLElement[];

      const setFinal = () => {
        counters.forEach((el) => {
          el.textContent = el.dataset.count ?? "";
        });
        gsap.set(bars, { scaleX: 1 });
      };

      if (reduced) {
        gsap.set(q("[data-hero-word], [data-hero-fade], [data-hero-float], [data-hero-frame]"), {
          clearProps: "all",
        });
        setFinal();
        return;
      }

      // ── Intro ──
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        q("[data-hero-word]"),
        // y: 0 cancels the pixel offset GSAP would otherwise keep from the pre-hydration CSS transform
        { y: 0, yPercent: 115, rotate: 4 },
        { y: 0, yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.045 },
        0.1
      )
        .fromTo(
          q("[data-hero-fade]"),
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
          0.55
        )
        .fromTo(
          q("[data-hero-frame]"),
          { clipPath: "inset(100% 0% 0% 0% round 32px)", scale: 1.06 },
          { clipPath: "inset(0% 0% 0% 0% round 32px)", scale: 1, duration: 1.5, ease: "power3.inOut" },
          0.2
        )
        .fromTo(
          q("[data-hero-photo]"),
          { scale: 1.35 },
          { scale: 1.08, duration: 2.1, ease: "power3.out" },
          0.2
        )
        .fromTo(
          q("[data-hero-float]"),
          { opacity: 0, y: 46, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.14, ease: "power3.out" },
          1.0
        )
        .fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 1.3, stagger: 0.12, ease: "power3.out" }, 1.25);

      // Stats count up
      counters.forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        const state = { v: 0 };
        tl.to(
          state,
          {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(state.v));
            },
          },
          0.9
        );
      });

      // ── Pointer drift: each floating layer moves by its own depth ──
      const layers = (q("[data-depth]") as HTMLElement[]).map((el) => ({
        depth: Number(el.dataset.depth ?? 0),
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
      }));
      const tiltX = gsap.quickTo(stage, "rotationY", { duration: 1, ease: "power3.out" });
      const tiltY = gsap.quickTo(stage, "rotationX", { duration: 1, ease: "power3.out" });
      const fine = window.matchMedia("(pointer: fine)").matches;
      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.depth);
          l.y(ny * l.depth);
        });
        tiltX(nx * 5);
        tiltY(-ny * 4);
      };
      const onLeave = () => {
        layers.forEach((l) => {
          l.x(0);
          l.y(0);
        });
        tiltX(0);
        tiltY(0);
      };
      if (fine) {
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
      }

      // ── Scroll: the stage lifts away, the photo keeps travelling ──
      gsap.to(q("[data-hero-photo]"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-hero-copy]"), {
        yPercent: -10,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom 20%", scrub: true },
      });

      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40"
      aria-label="AuditExpert introduction"
    >
      {/* Backdrop: soft grid + a slow green bloom */}
      <div className="pointer-events-none absolute inset-0 bg-grid-subtle" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[620px] w-[620px] rounded-full bg-brand-300/40 blur-[130px]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_0.9fr] lg:gap-16">
          {/* ── Copy ── */}
          <div data-hero-copy>
            <p
              className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/30 bg-white/80 py-1.5 pl-2 pr-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-accent shadow-[0_8px_24px_-16px_rgba(16,64,44,0.5)]"
              data-hero-fade
            >
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-brand-100">
                <span className="absolute h-full w-full animate-ping rounded-full bg-brand-400/50" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-brand-600" />
              </span>
              {heroConfig.subEyebrow}
            </p>

            <h1 className="mt-7 text-[clamp(1.9rem,3.35vw,4.1rem)] font-semibold leading-[1.04] tracking-[-0.025em] text-fg-50">
              {heroConfig.headline.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                  {line.split(" ").map((w, j) => (
                    <span
                      key={j}
                      data-hero-word
                      className={`inline-block will-change-transform ${i >= 2 ? "text-gradient-brand" : ""}`}
                    >
                      {w}
                      {" "}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <p className="mt-7 max-w-xl text-lead-lg text-fg-300" data-hero-fade>
              {heroConfig.supporting}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4" data-hero-fade>
              <Link
                href={heroConfig.ctaPrimary.href}
                className="btn-primary group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold tracking-wide"
              >
                {heroConfig.ctaPrimary.label}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href={heroConfig.ctaSecondary.href}
                className="btn-ghost inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold tracking-wide"
              >
                {heroConfig.ctaSecondary.label}
              </Link>
            </div>

            {/* Stats */}
            <dl
              className="mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-fg-50/10 pt-8 sm:grid-cols-4"
              data-hero-fade
            >
              {heroConfig.stats.map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-4xl font-semibold tabular-nums text-fg-50">
                    <span data-count={s.value}>{s.value}</span>
                    <span className="text-accent">{s.suffix}</span>
                  </dd>
                  <dt className="mt-1.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-fg-400">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Stage ── */}
          <div className="relative mx-auto w-full max-w-[560px] [perspective:1400px] lg:max-w-none">
            <div ref={stageRef} className="relative [transform-style:preserve-3d]">
              {/* Photo frame */}
              <div
                data-hero-frame
                className="relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-[0_50px_100px_-50px_rgba(16,64,44,0.65)] sm:aspect-[5/5.4]"
              >
                <div data-hero-photo className="absolute inset-0 will-change-transform">
                  <Image
                    src="/images/hero.jpg"
                    alt="Hotel lobby at dusk — a guest journey in progress"
                    fill
                    priority
                    sizes="(min-width: 1024px) 46vw, 92vw"
                    className="object-cover"
                  />
                </div>
                {/* Green wash keeps the photograph inside the palette */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-brand-700/45 via-brand-500/10 to-transparent mix-blend-soft-light"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-700/55 to-transparent"
                  aria-hidden="true"
                />
                <p className="absolute bottom-6 left-6 right-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/90">
                  <BadgeCheck size={14} aria-hidden="true" />
                  Independent · Evidence-backed
                </p>
              </div>

              {/* Score card */}
              <div
                data-hero-float
                data-depth="-34"
                aria-hidden="true"
                className="glass absolute -left-4 top-10 w-[250px] rounded-2xl border border-fg-50/10 p-5 sm:-left-10 sm:w-[270px] lg:-left-12"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-400">Service Score</p>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                    <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand-500" />
                    Live
                  </span>
                </div>
                <p className="mt-3 font-display text-5xl font-semibold text-fg-50">
                  92<span className="text-2xl text-accent">%</span>
                </p>
                <div className="mt-5 space-y-3.5">
                  {SCORES.map((m) => (
                    <div key={m.label}>
                      <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
                        <span className="text-fg-400">{m.label}</span>
                        <span className="text-fg-100">{m.value}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-base-800">
                        <div
                          data-bar
                          className="h-full origin-left rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkpoint chip */}
              <div
                data-hero-float
                data-depth="46"
                aria-hidden="true"
                className="glass absolute -right-3 bottom-24 w-56 rounded-2xl border border-fg-50/10 p-4 sm:-right-8 lg:-right-6"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-accent">
                    <ShieldCheck size={15} />
                  </span>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-400">Checkpoint 34/40</p>
                </div>
                <p className="mt-2.5 text-[13px] leading-snug text-fg-200">
                  Arrival greeting under 30s — <span className="font-semibold text-accent">pass</span>
                </p>
              </div>

              {/* Rotating seal */}
              <div
                data-hero-float
                data-depth="70"
                aria-hidden="true"
                className="absolute -bottom-8 left-6 hidden h-28 w-28 sm:block"
              >
                <svg viewBox="0 0 120 120" className="h-full w-full animate-[spin_22s_linear_infinite]">
                  <defs>
                    <path id="hero-seal" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                  </defs>
                  <circle cx="60" cy="60" r="59" className="fill-white" />
                  <circle cx="60" cy="60" r="58.5" className="fill-none stroke-brand-500/40" strokeWidth="1" />
                  <text className="fill-fg-200 font-mono text-[9.5px] uppercase tracking-[0.3em]">
                    <textPath href="#hero-seal">See · Measure · Understand · Improve ·</textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-accent">
                  <ArrowDown size={20} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
