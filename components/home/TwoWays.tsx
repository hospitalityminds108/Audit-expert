"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, ClipboardCheck } from "lucide-react";
import { twoWays } from "@/data/navigation";
import { useScrollReveal } from "@/lib/animations/gsap";

type WayKey = "mystery" | "sop";
type Way = (typeof twoWays)[WayKey];

/**
 * Section 01 — THE AUDIT INTELLIGENCE
 * Two hover-expanding panels: Mystery (customer view) vs SOP (management view).
 */
export default function TwoWays() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 75%" });

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
            className="mt-6 font-display text-display-lg text-fg-50 leading-[1.02]"
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
        <div className="flex flex-col gap-5 lg:flex-row">
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
  return (
    <article
      data-reveal
      data-reveal-delay={String(index * 0.12)}
      className="glass group flex flex-1 flex-col overflow-hidden rounded-3xl border border-fg-50/10 transition-colors duration-500 hover:border-brand-500/50"
    >
      {/* Photograph */}
      <div className="relative m-2.5 h-52 overflow-hidden rounded-[20px] sm:h-64">
        <Image
          src={way.image}
          alt={`${way.label} — ${way.sub}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.06]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-700/85 via-brand-700/15 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-accent">
              {icon}
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">{way.label}</p>
              <p className="mt-0.5 font-display text-sm italic text-white/85">{way.sub}</p>
            </div>
          </div>
          <span className="rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] text-fg-100">
            {index === 0 ? "01 / 02" : "02 / 02"}
          </span>
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <p className="text-[15px] leading-relaxed text-fg-300">{way.description}</p>

        <ul className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {way.points.map((point, i) => (
            <li key={point.title} className="flex items-start gap-3.5">
              <span className="mt-[3px] font-mono text-[11px] tabular-nums text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[15px] font-semibold leading-snug text-fg-50">{point.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-fg-300">{point.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-9">
          <Link
            href={way.cta.href}
            className="btn-ghost group/cta inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide"
          >
            {way.cta.label}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
