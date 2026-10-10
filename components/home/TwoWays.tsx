"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Eye, ClipboardCheck } from "lucide-react";
import { twoWays } from "@/data/navigation";
import { useScrollReveal, useIsMobile } from "@/lib/animations/gsap";

type WayKey = "mystery" | "sop";
type Way = (typeof twoWays)[WayKey];

/**
 * Section 01 — THE AUDIT INTELLIGENCE
 * Two hover-expanding panels: Mystery (customer view) vs SOP (management view).
 */
export default function TwoWays() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 75%" });
  const isMobile = useIsMobile();

  const handleEnter = (_key: WayKey) => {
    /* panel handles its own expansion */
  };

  return (
    <section
      ref={sectionRef}
      id="two-ways"
      data-section="two-ways"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <div className="container-site">
        {/* Header */}
        <div className="mb-14 md:mb-20 lg:mb-24 max-w-4xl">
          <p className="eyebrow text-accent" data-reveal>
            <span className="eyebrow-rule" aria-hidden="true" />
            {twoWays.eyebrow}
          </p>
          <h2
            className="mt-6 font-display text-display-lg text-fg-50 leading-[1.02] tracking-[-0.02em]"
            data-reveal
            data-reveal-delay="0.08"
          >
            {twoWays.headline}
          </h2>
          <p
            className="mt-6 max-w-2xl text-lead text-fg-300/80"
            data-reveal
            data-reveal-delay="0.16"
          >
            {twoWays.intro}
          </p>
        </div>
      </div>

      {/* Split panels */}
      <div className="container-site">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-4" style={{ minHeight: isMobile ? undefined : "620px" }}>
          <Panel
            way={twoWays.mystery}
            index={0}
            icon={<Eye className="h-5 w-5" strokeWidth={1.5} />}
            
          />
          <Panel
            way={twoWays.sop}
            index={1}
            icon={<ClipboardCheck className="h-5 w-5" strokeWidth={1.5} />}
            
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Panel({
  way,
  index,
  icon,
}: {
  way: Way;
  index: number;
  icon: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isActive = useRef(false);

  const setActive = (value: boolean) => {
    if (!panelRef.current || isMobile) return;
    isActive.current = value;
    const el = panelRef.current;
    el.style.flexGrow = value ? "1.9" : "1";
    el.dataset.active = value ? "true" : "false";
  };

  return (
    <div
      ref={panelRef}
      data-reveal
      data-reveal-delay={String(index * 0.12)}
      data-active="false"
      data-cursor-label="OPEN"
      className={`group relative overflow-hidden rounded-2xl border border-fg-50/10 glass ${
        isMobile ? "min-h-[560px]" : "lg:flex lg:min-h-[620px]"
      } transition-[flex-grow] duration-[900ms] ease-premium`}
      style={{ flexGrow: 1, flexBasis: 0 }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={way.image}
          alt={`${way.label} — ${way.sub}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-45 transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.06]"
          priority={false}
        />
        {/* Gradient scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/80 to-base-950/30" />
      </div>

      {/* Content */}
      <div className="relative flex h-full min-h-[560px] lg:min-h-[620px] flex-col justify-between p-7 sm:p-9 lg:p-10">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-fg-50/20 bg-base-950/50 text-accent backdrop-blur-sm">
              {icon}
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                {way.label}
              </p>
              <p className="mt-0.5 text-sm text-fg-300/80 italic font-display">
                {way.sub}
              </p>
            </div>
          </div>
          <span className="font-mono text-[11px] text-fg-300/60">
            {index === 0 ? "01 / 02" : "02 / 02"}
          </span>
        </div>

        {/* Points */}
        <ul className="mt-10 space-y-4 lg:space-y-[1.1rem] lg:max-w-[88%]">
          {way.points.map((point, i) => (
            <li key={point.title} className="flex items-start gap-4">
              <span className="mt-[3px] font-mono text-[11px] text-accent/80 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[15px] font-medium leading-snug text-fg-50">
                  {point.title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-fg-300/70">
                  {point.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Bottom row */}
        <div className="mt-10">
          <p className="mb-6 max-w-md text-sm leading-relaxed text-fg-300/80">
            {way.description}
          </p>
          <a
            href={way.cta.href}
            data-cursor-label="VIEW"
            className="group/cta inline-flex items-center gap-3 border-b border-brass-400/40 pb-1 text-sm font-medium text-fg-50 transition-colors duration-300 hover:border-brass-300 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          >
            {way.cta.label}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
