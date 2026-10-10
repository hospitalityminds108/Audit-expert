"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import {
  auditPlans,
  planCategoryTabs,
  formatPrice,
} from "@/data/audit-plans";
import { gsap, useScrollReveal, usePrefersReducedMotion } from "@/lib/animations/gsap";
import SelectPlanButton from "@/components/pricing/SelectPlanButton";

type TabId = (typeof planCategoryTabs)[number]["id"];

/**
 * Section 03 — AUDIT PLANS EXPLORER
 * Category tabs → grid of plan cards with pricing. Client-side exploration;
 * authoritative pricing always recalculated server-side at checkout.
 */
export default function AuditPlanExplorer() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 75%" });
  const [activeTab, setActiveTab] = useState<TabId>("hotels-resorts");

  const plans = useMemo(
    () => auditPlans.filter((p) => p.category === activeTab),
    [activeTab]
  );

  // Roving tabindex: arrow keys / Home / End move between tabs
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = planCategoryTabs.findIndex((t) => t.id === activeTab);
    const last = planCategoryTabs.length - 1;
    let next = i;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    const id = planCategoryTabs[next].id;
    setActiveTab(id);
    document.getElementById(`tab-${id}`)?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="audit-plans"
      data-section="audit-plans"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <div className="container-site">
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-4xl">
          <p className="eyebrow text-accent" data-reveal>
            <span className="eyebrow-rule" aria-hidden="true" />
            SECTION 03 — AUDIT PLANS
          </p>
          <h2
            className="mt-6 font-display text-display-lg text-fg-50 leading-[1.02] tracking-[-0.02em]"
            data-reveal
            data-reveal-delay="0.08"
          >
            Pick a plan. Book it in minutes.
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-fg-300/80" data-reveal data-reveal-delay="0.16">
            Fixed-scope audit plans with transparent pricing. Every plan is
            delivered as a structured report: scorecard, evidence, and a
            prioritized corrective-action plan.
          </p>
        </div>

        {/* Tabs */}
        <div
          className="mb-10 md:mb-12 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter audit plans by industry"
          data-reveal
        >
          {planCategoryTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="plans-grid"
                id={`tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={onTabKeyDown}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950 ${
                  isActive
                    ? "btn-primary text-on-brand"
                    : "border border-fg-50/15 text-fg-300 hover:border-fg-50/40 hover:text-fg-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Cards grid */}
        <div
          id="plans-grid"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {plans.map((plan, i) => (
            <PlanCard key={plan.slug} plan={plan} index={i} />
          ))}
        </div>

        <p className="mt-8 font-mono text-[11px] leading-relaxed tracking-wide text-fg-300/60">
          * Final quotation varies with city, duration, complexity, reimbursement, travel and locations.
          Taxes as applicable.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function PlanCard({
  plan,
  index,
}: {
  plan: (typeof auditPlans)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Stagger-in on mount of tab switch
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: Math.min(index * 0.05, 0.3),
        ease: "power3.out",
        overwrite: "auto",
        clearProps: "transform",
      }
    );
    return () => {
      gsap.killTweensOf(el);
    };
  }, [index, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      data-plan-card
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative flex flex-col rounded-2xl border border-fg-50/10 glass p-7 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-fg-50/25 hover:shadow-[0_24px_60px_-24px_rgba(16,64,44,0.25)]"
    >
      {/* Format badge */}
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
            plan.format === "mystery"
              ? "bg-brand-400/10 text-accent"
              : "bg-aqua-500/15 text-aqua-600"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              plan.format === "mystery" ? "bg-brand-600" : "bg-aqua-500"
            }`}
            aria-hidden="true"
          />
          {plan.format === "mystery" ? "Mystery" : "SOP / Revealed"}
        </span>
        <span className="font-mono text-[10px] text-fg-300/60">
          {plan.categoryLabel}
        </span>
      </div>

      {/* Name + tagline */}
      <h3 className="mt-5 font-display text-2xl leading-[1.15] text-fg-50">
        {plan.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-300/80">
        {plan.tagline}
      </p>

      {/* Pricing */}
      <p className="mt-5 font-mono text-lg font-medium tabular-nums text-fg-50">
        {formatPrice(plan.priceMin, plan.priceMax)}
        <span className="ml-2 align-middle font-sans text-xs font-normal text-fg-300/60">
          / {plan.priceUnit}
        </span>
      </p>

      {/* Scope preview */}
      <ul className="mt-5 space-y-2.5 border-t border-fg-50/10 pt-5">
        {plan.scope.slice(0, 4).map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[13px] text-fg-300/85">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aqua-600" strokeWidth={2} />
            {item}
          </li>
        ))}
        {plan.scope.length > 4 && (
          <li className="pl-6 text-[12px] font-mono uppercase tracking-wide text-fg-300/60">
            +{plan.scope.length - 4} more checks
          </li>
        )}
      </ul>

      {/* CTA */}
      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SelectPlanButton slug={plan.slug}>Select plan</SelectPlanButton>
          <Link
            href={`/audit-plans/${plan.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-200 transition-colors duration-300 hover:text-accent"
          >
            Full details
            <ArrowUpRight
              className={`h-4 w-4 transition-transform duration-300 ${
                hover ? "translate-x-0.5 -translate-y-0.5" : ""
              }`}
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
