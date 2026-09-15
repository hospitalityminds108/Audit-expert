"use client";


import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, ClipboardList, LineChart, ShieldCheck } from "lucide-react";
import { auditorTypes, testimonials } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { useScrollReveal } from "@/lib/animations/gsap";

/**
 * Section 08 — JOIN AS AN AUDITOR
 * The auditor network pitch + social proof strip.
 */
export default function JoinAsAuditor() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 75%" });



  return (
    <section
      ref={sectionRef}
      id="join"
      data-section="join"
      className="relative overflow-hidden bg-ink-950 py-24 md:py-32 lg:py-40"
    >
      {/* Ambient */}
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-[520px] w-[520px] rounded-full bg-sage-500/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Left: pitch */}
          <div>
            <p className="eyebrow text-brass-400" data-reveal>
              <span className="eyebrow-rule" aria-hidden="true" />
              SECTION 08 — THE AUDITOR NETWORK
            </p>
            <h2
              className="mt-6 font-display text-display-xl md:text-display-2xl text-bone-50 leading-[1.02] tracking-[-0.02em]"
              data-reveal
              data-reveal-delay="0.08"
            >
              See what others miss. Get paid for it.
            </h2>
            <p className="mt-6 max-w-xl text-lead text-bone-300/80" data-reveal data-reveal-delay="0.16">
              We are building a city-by-city network of trained evaluators —
              hospitality professionals, quality specialists and
              customer-experience experts who audit the real world with
              discipline and evidence.
            </p>

            {/* Perks */}
            <ul className="mt-10 space-y-5">
              {[
                {
                  icon: <BadgeCheck className="h-4.5 w-4.5" strokeWidth={1.5} />,
                  title: "Certified training",
                  detail: "Structured onboarding on checklists, evidence and scoring discipline.",
                },
                {
                  icon: <ClipboardList className="h-4.5 w-4.5" strokeWidth={1.5} />,
                  title: "Matched assignments",
                  detail: "Assignments aligned to your city, sector and experience.",
                },
                {
                  icon: <LineChart className="h-4.5 w-4.5" strokeWidth={1.5} />,
                  title: "Ratings that compound",
                  detail: "Quality ratings unlock higher-value assignments over time.",
                },
                {
                  icon: <ShieldCheck className="h-4.5 w-4.5" strokeWidth={1.5} />,
                  title: "Integrity framework",
                  detail: "A clear code of conduct — evidence, confidentiality, independence.",
                },
              ].map((perk, i) => (
                <li
                  key={perk.title}
                  className="flex items-start gap-4"
                  data-reveal
                  data-reveal-delay={String(0.2 + i * 0.06)}
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass-400/25 bg-brass-500/10 text-brass-300">
                    {perk.icon}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-bone-50">{perk.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-bone-300/60">
                      {perk.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap items-center gap-4" data-reveal data-reveal-delay="0.45">
              <Link
                href="/join-as-auditor"
                data-cursor-label="APPLY"
                className="group inline-flex items-center gap-3 rounded-full bg-bone-50 px-7 py-3.5 text-sm font-semibold text-ink-950 transition-all duration-300 hover:bg-brass-300 hover:text-ink-950"
              >
                Apply to the network
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </Link>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-300/45">
                Rolling applications · All cities
              </p>
            </div>

            {/* Auditor types chips */}
            <div className="mt-12 border-t border-ink-800 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-300/45">
                Who joins
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {auditorTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-bone-50/12 px-3.5 py-1.5 text-[12px] text-bone-300/75"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: testimonials + network card */}
          <div className="flex flex-col gap-6">
            {testimonials.map((t, i) => (
              <figure
                key={t.author + i}
                data-reveal
                data-reveal-delay={String(0.15 + i * 0.1)}
                className="relative rounded-2xl border border-ink-800 bg-ink-900/60 p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-5xl leading-none text-brass-400/40" aria-hidden="true">
                    &ldquo;
                  </span>
                  <div className="text-right">
                    <p className="font-mono text-xl text-brass-300 tabular-nums">{t.metric}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone-300/45">
                      {t.metricLabel}
                    </p>
                  </div>
                </div>
                <blockquote className="mt-2 text-[15px] leading-relaxed text-bone-300/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-800 pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-bone-50/15 bg-ink-950 font-mono text-[10px] text-bone-300/70">
                    {t.author.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-bone-50">{t.author}</p>
                    <p className="text-[11px] text-bone-300/55">{t.context}</p>
                  </div>
                </figcaption>
              </figure>
            ))}

            {/* Small integrity note card */}
            <div
              data-reveal
              data-reveal-delay="0.45"
              className="rounded-2xl border border-brass-400/20 bg-gradient-to-br from-brass-500/10 to-transparent p-6"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-400">
                Integrity first
              </p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-bone-300/75">
                Every auditor operates under our six-principle integrity
                framework — evidence, confidentiality, independence, fair
                reporting, competence and review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
