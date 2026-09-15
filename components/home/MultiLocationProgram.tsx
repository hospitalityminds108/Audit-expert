"use client";


import { TrendingUp, ArrowUpRight } from "lucide-react";
import { brandProgramFeatures } from "@/data/site";
import { useCounter, useScrollReveal, usePrefersReducedMotion } from "@/lib/animations/gsap";

/**
 * Section 04 — MULTI-LOCATION PROGRAM
 * A living dashboard view of a multi-unit brand audit program.
 */
export default function MultiLocationProgram() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 75%" });
  const prefersReducedMotion = usePrefersReducedMotion();

  const brandScore = useCounter(87, { duration: 1.8 });
  const locationsLive = useCounter(24, { duration: 1.4 });
  const gapsClosed = useCounter(143, { duration: 1.6 });

  return (
    <section
      ref={sectionRef}
      id="multi-location"
      data-section="multi-location"
      className="relative overflow-hidden bg-ink-950 py-24 md:py-32 lg:py-40"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full bg-brass-500/[0.07] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-[480px] w-[480px] rounded-full bg-sage-500/[0.05] blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <p className="eyebrow text-brass-400" data-reveal>
              <span className="eyebrow-rule" aria-hidden="true" />
              SECTION 04 — MULTI-LOCATION PROGRAM
            </p>
            <h2
              className="mt-6 font-display text-display-xl md:text-display-2xl text-bone-50 leading-[1.02] tracking-[-0.02em]"
              data-reveal
              data-reveal-delay="0.08"
            >
              One framework. Every location. One truth.
            </h2>
            <p className="mt-6 max-w-xl text-lead text-bone-300/80" data-reveal data-reveal-delay="0.16">
              When a brand runs on many units, consistency is the product. The
              AuditExpert program puts every property on one scorecard — so you
              see which locations deliver the standard, and which ones quietly
              don&apos;t.
            </p>

            {/* Feature list */}
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {brandProgramFeatures.map((feature, i) => (
                <li
                  key={feature.title}
                  className="flex items-start gap-3.5"
                  data-reveal
                  data-reveal-delay={String(0.2 + i * 0.05)}
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-bone-50">{feature.title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-bone-300/60">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10" data-reveal data-reveal-delay="0.4">
              <a
                href="/how-it-works"
                data-cursor-label="OPEN"
                className="group inline-flex items-center gap-3 border-b border-brass-400/40 pb-1 text-sm font-medium text-bone-50 transition-colors duration-300 hover:border-brass-300 hover:text-brass-300"
              >
                See how the program runs
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </div>

          {/* Right: dashboard mockup */}
          <div data-reveal data-reveal-delay="0.2" className="relative">
            <DashboardMockup
              brandScore={brandScore}
              locationsLive={locationsLive}
              gapsClosed={gapsClosed}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function DashboardMockup({
  brandScore,
  locationsLive,
  gapsClosed,
  prefersReducedMotion,
}: {
  brandScore: number;
  locationsLive: number;
  gapsClosed: number;
  prefersReducedMotion: boolean;
}) {
  const rows = [
    { city: "Mumbai", score: 91, delta: "+4", status: "on-standard" },
    { city: "Delhi NCR", score: 84, delta: "+2", status: "on-standard" },
    { city: "Bengaluru", score: 78, delta: "-3", status: "watch" },
    { city: "Pune", score: 88, delta: "+6", status: "on-standard" },
    { city: "Hyderabad", score: 72, delta: "-5", status: "action" },
  ];

  return (
    <div className="relative rounded-2xl border border-ink-800 bg-ink-900/80 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-ink-800 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-bone-50/20" />
          <span className="h-2 w-2 rounded-full bg-bone-50/20" />
          <span className="h-2 w-2 rounded-full bg-bone-50/20" />
          <p className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-300/50">
            Brand Program — Q3
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-500/30 bg-sage-500/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-sage-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-400" />
          </span>
          Live
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3 border-b border-ink-800 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-300/50">
            Brand Score
          </p>
          <p className="mt-1.5 font-display text-3xl tabular-nums text-bone-50">
            {brandScore}
            <span className="text-lg text-bone-300/50">%</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-300/50">
            Locations
          </p>
          <p className="mt-1.5 font-display text-3xl tabular-nums text-bone-50">
            {locationsLive}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-300/50">
            Gaps Closed
          </p>
          <p className="mt-1.5 font-display text-3xl tabular-nums text-bone-50">
            {gapsClosed}
          </p>
        </div>
      </div>

      {/* Location rows */}
      <div className="divide-y divide-ink-800/70">
        {rows.map((row) => (
          <div key={row.city} className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  row.status === "on-standard"
                    ? "bg-sage-400"
                    : row.status === "watch"
                    ? "bg-brass-400"
                    : "bg-critical/80"
                }`}
                aria-hidden="true"
              />
              <p className="text-sm text-bone-300/85">{row.city}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-1 w-20 overflow-hidden rounded-full bg-ink-800" aria-hidden="true">
                <div
                  className={`h-full rounded-full ${
                    row.status === "on-standard"
                      ? "bg-sage-400"
                      : row.status === "watch"
                      ? "bg-brass-400"
                      : "bg-critical/80"
                  }`}
                  style={{
                    width: prefersReducedMotion ? `${row.score}%` : undefined,
                  }}
                  data-bar
                  data-score={String(row.score)}
                />
              </div>
              <p className="w-8 text-right font-mono text-sm tabular-nums text-bone-50">
                {row.score}
              </p>
              <p
                className={`w-10 text-right font-mono text-[11px] tabular-nums ${
                  row.delta.startsWith("+")
                    ? "text-sage-400"
                      : "text-critical/80"
                }`}
              >
                {row.delta}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div className="mt-5 flex items-center justify-between border-t border-ink-800 pt-4">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-300/45">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          Trend improving — 3 cycles
        </p>
        <p className="font-mono text-[10px] text-bone-300/35">
          AuditExpert Platform
        </p>
      </div>
    </div>
  );
}
