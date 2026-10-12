"use client";


import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, ClipboardList, LineChart, ShieldCheck } from "lucide-react";
import { auditorTypes } from "@/data/navigation";

const JOIN_STEPS = [
  { title: "Apply", detail: "Tell us your city, sector experience and availability." },
  { title: "Profile review", detail: "We check fit, background and any conflicts of interest." },
  { title: "Orientation & training", detail: "Checklists, evidence standards and scoring discipline." },
  { title: "Sample assessment", detail: "A supervised audit, reviewed against our quality bar." },
  { title: "Matched assignments", detail: "Paid assignments matched to your city and sector." },
] as const;
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
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      {/* Ambient */}
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-[520px] w-[520px] rounded-full bg-aqua-500/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Left: pitch */}
          <div>
            <p className="eyebrow text-accent" data-reveal>
              <span className="eyebrow-rule" aria-hidden="true" />
              SECTION 08 — THE AUDITOR NETWORK
            </p>
            <h2
              className="mt-6 font-display text-display-lg text-fg-50 leading-[1.02]"
              data-reveal
              data-reveal-delay="0.08"
            >
              See what others miss. Get paid for it.
            </h2>
            <p className="mt-6 max-w-xl text-lead text-fg-300/80" data-reveal data-reveal-delay="0.16">
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
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-400/25 bg-brand-500/10 text-accent">
                    {perk.icon}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium text-fg-50">{perk.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-fg-300/70">
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
                className="group inline-flex items-center gap-3 rounded-full btn-primary px-7 py-3.5 text-sm font-semibold text-on-brand transition-all duration-300"
              >
                Apply to the network
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </Link>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/60">
                Rolling applications · All cities
              </p>
            </div>

            {/* Auditor types chips */}
            <div className="mt-12 border-t border-fg-50/10 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-300/60">
                Who joins
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {auditorTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-fg-50/12 px-3.5 py-1.5 text-[12px] text-fg-300/75"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: testimonials + network card */}
          <div className="flex flex-col gap-6">
            <ol className="glass rounded-2xl border border-fg-50/10 p-7 md:p-8" data-reveal data-reveal-delay="0.15">
              <li className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-400">
                How you join
              </li>
              {JOIN_STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-5 pb-7 last:pb-0">
                  {i < JOIN_STEPS.length - 1 && (
                    <span className="absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-px bg-gradient-to-b from-brand-500/50 to-transparent" aria-hidden="true" />
                  )}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 font-mono text-[11px] font-semibold text-on-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-fg-50">{step.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-fg-300">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Small integrity note card */}
            <div
              data-reveal
              data-reveal-delay="0.45"
              className="rounded-2xl border border-brand-400/20 bg-gradient-to-br from-brand-500/10 to-transparent p-6"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                Integrity first
              </p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-fg-300/75">
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
