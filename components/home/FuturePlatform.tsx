"use client";


import Link from "next/link";
import { ArrowUpRight, LayoutDashboard, MapPin, CalendarClock, CheckCircle2 } from "lucide-react";
import { futurePlatform } from "@/data/site";
import { useScrollReveal } from "@/lib/animations/gsap";
/**
 * Section 07 — THE FUTURE PLATFORM
 * The product roadmap the brand grows into. Feature grid + roadmap status.
 */
export default function FuturePlatform() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 75%" });

  return (
    <section
      ref={sectionRef}
      id="platform"
      data-section="platform"
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <div className="container-site">
        {/* Header */}
        <div className="mb-14 md:mb-20 max-w-4xl">
          <p className="eyebrow text-accent" data-reveal>
            <span className="eyebrow-rule" aria-hidden="true" />
            SECTION 07 — THE FUTURE PLATFORM
          </p>
          <h2
            className="mt-6 font-display text-display-lg text-fg-50 leading-[1.02] tracking-[-0.02em]"
            data-reveal
            data-reveal-delay="0.08"
          >
            Audits today. Platform tomorrow.
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-fg-300/80" data-reveal data-reveal-delay="0.16">
            Every engagement runs on a disciplined process today, and grows
            into a connected platform: dashboards, benchmarking, scheduling
            and action closure — one system for the whole brand.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {futurePlatform.map((feature, i) => (
            <div
              key={feature.title}
              data-reveal
              data-reveal-delay={String((i % 4) * 0.07)}
              className="group relative overflow-hidden rounded-2xl border border-fg-50/10 glass p-6 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-fg-50/20 hover:shadow-[0_24px_60px_-28px_rgba(84,66,20,0.25)]"
            >
              {/* Index */}
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] text-fg-300/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-fg-50/10 bg-fg-50/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-fg-300/70">
                  Roadmap
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl leading-snug text-fg-50">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-fg-300/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Platform preview strip */}
        <div
          className="mt-12 md:mt-16 overflow-hidden rounded-2xl border border-fg-50/10 bg-base-950"
          data-reveal
        >
          <div className="grid md:grid-cols-[1.2fr_2fr]">
            {/* Left copy */}
            <div className="border-b md:border-b-0 md:border-r border-fg-50/10 p-7 md:p-9">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Platform Preview
              </p>
              <h3 className="mt-4 font-display text-2xl md:text-3xl text-fg-50 leading-[1.15]">
                The command center for your brand standard.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-300/80">
                A live look at where the program is heading — every location,
                every score, every open action in one place.
              </p>
              <Link
                href="/how-it-works"
                data-cursor-label="OPEN"
                className="group mt-6 inline-flex items-center gap-2.5 border-b border-brass-400/40 pb-1 text-sm font-medium text-fg-50 transition-colors duration-300 hover:border-brass-300 hover:text-accent"
              >
                Explore the roadmap
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </div>

            {/* Right: mini dashboard */}
            <div className="relative p-7 md:p-9">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />, label: "Client Dashboard", state: "In development" },
                  { icon: <MapPin className="h-4 w-4" strokeWidth={1.5} />, label: "GPS Evidence", state: "Planned" },
                  { icon: <CalendarClock className="h-4 w-4" strokeWidth={1.5} />, label: "Recurring Scheduler", state: "Planned" },
                  { icon: <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />, label: "Action Closure", state: "In development" },
                ].map((tile) => (
                  <div
                    key={tile.label}
                    className="rounded-xl border border-fg-50/10 glass p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brass-400/25 bg-brass-500/10 text-accent">
                        {tile.icon}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-fg-300/60">
                        {tile.state}
                      </span>
                    </div>
                    <p className="mt-3 text-[13px] font-medium text-fg-50">
                      {tile.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-wide text-fg-300/60">
                MODULES SHOWN ARE IN ACTIVE DEVELOPMENT — AVAILABLE TO PROGRAM
                CLIENTS FIRST.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
