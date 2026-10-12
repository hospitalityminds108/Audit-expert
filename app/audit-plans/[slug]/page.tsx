import type { Metadata } from "next";
import Link from "next/link";
import SelectPlanButton from "@/components/pricing/SelectPlanButton";
import PageBanner from "@/components/ui/PageBanner";
import { getIndustryBySlug } from "@/data/industries";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  ClipboardList,
  Compass,
  FileCheck2,
  Users,
} from "lucide-react";
import {
  auditPlans,
  getPlanBySlug,
  getPlansByCategory,
  formatPrice,
} from "@/data/audit-plans";
import { siteConfig } from "@/data/site";
import MagneticButton from "@/components/ui/MagneticButton";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return auditPlans.map((plan) => ({ slug: plan.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const plan = getPlanBySlug(params.slug);
  if (!plan) return { title: "Audit plan not found" };
  return {
    title: plan.seo.title,
    description: plan.seo.description,
    openGraph: {
      title: plan.seo.title,
      description: plan.seo.description,
      images: [{ url: "/images/hero.jpg" }],
    },
  };
}

export default function AuditPlanPage({ params }: PageProps) {
  const plan = getPlanBySlug(params.slug);
  if (!plan) notFound();
  const planIndustry = getIndustryBySlug(plan.category);

  const relatedPlans = getPlansByCategory(plan.category)
    .filter((p) => p.slug !== plan.slug)
    .slice(0, 3);

  const isMystery = plan.format === "mystery";

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: plan.name,
    description: plan.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: "India",
    serviceType: `${isMystery ? "Mystery audit" : "SOP audit"} — ${plan.categoryLabel}`,
  };

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plan.name,
    description: plan.seo.description,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: plan.priceMin,
      highPrice: plan.priceMax,
      offerCount: 1,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/audit-plans/${plan.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Audit Plans", item: `${siteConfig.url}/audit-plans` },
      { "@type": "ListItem", position: 3, name: plan.name, item: `${siteConfig.url}/audit-plans/${plan.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, offerJsonLd, breadcrumbJsonLd]) }}
      />
      <div className="">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full blur-3xl ${
              isMystery ? "bg-brand-500/10" : "bg-aqua-500/10"
            }`}
          />
          <div className="container-site relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-300/60">
                <li>
                  <Link href="/" className="tap transition-colors hover:text-accent">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/audit-plans" className="tap transition-colors hover:text-accent">Audit Plans</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-accent">{plan.name}</li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
                  isMystery
                    ? "border-brand-400/40 bg-brand-400/10 text-accent"
                    : "border-aqua-400/40 bg-aqua-400/10 text-aqua-600"
                }`}
              >
                {isMystery ? "Mystery Format" : "SOP Format"}
              </span>
              <span className="rounded-full border border-fg-50/15 bg-white/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/80">
                {plan.categoryLabel}
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-display-xl leading-[1.02] text-fg-50 md:text-display-lg">
              {plan.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-fg-300/80">{plan.tagline}</p>

            <div className="mt-10 flex flex-col gap-6 border-t border-fg-50/10 pt-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/60">
                  Published range
                </p>
                <p className="mt-2 font-display text-3xl text-fg-50 md:text-4xl">
                  {formatPrice(plan.priceMin, plan.priceMax)}
                  <span className="ml-2 font-mono text-xs uppercase tracking-[0.14em] text-fg-300/70">
                    / {plan.priceUnit}
                  </span>
                </p>
                <p className="mt-2 max-w-md text-sm text-fg-300/60">{plan.priceNote}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <SelectPlanButton slug={plan.slug} size="lg">
                  {plan.cta}
                </SelectPlanButton>
                <MagneticButton
                  href="/contact"
                  variant="outline"
                  size="lg"
                >
                  Talk to us
                </MagneticButton>
              </div>
            </div>
          </div>
        </header>

        {planIndustry && (
          <div className="container-site pb-12">
            <PageBanner
              priority
              images={[
                { src: planIndustry.image, alt: planIndustry.imageAlt, caption: plan.categoryLabel },
                plan.format === "mystery"
                  ? { src: "/images/sections/mystery.jpg", alt: "A mystery auditor arriving as a guest", caption: "Mystery audit" }
                  : { src: "/images/sections/sop.jpg", alt: "A revealed SOP audit with the operations team", caption: "SOP audit" },
              ]}
            />
          </div>
        )}

        {/* ── Facts strip ──────────────────────────────────────── */}
        <section aria-label="Plan facts" className="border-y border-fg-50/10 bg-brand-100/40">
          <div className="container-site grid grid-cols-2 gap-x-8 gap-y-6 py-10 md:grid-cols-4">
            {[
              { label: "Format", value: isMystery ? "Mystery" : "SOP / Revealed" },
              { label: "Category", value: plan.categoryLabel },
              { label: "Starting at", value: formatPrice(plan.priceMin, plan.priceMax) },
              { label: "Best for", value: plan.bestFor },
            ].map((fact) => (
              <div key={fact.label}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-300/60">
                  {fact.label}
                </p>
                <p className="mt-1.5 text-sm font-medium text-fg-50">{fact.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Overview + Who it's for ──────────────────────────── */}
        <section aria-labelledby="plan-overview" className="py-16 md:py-24">
          <div className="container-site grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                THE PLAN
              </p>
              <h2
                id="plan-overview"
                className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
              >
                What this audit covers
              </h2>
              <p className="mt-6 max-w-2xl text-lead text-fg-300/85">{plan.description}</p>
            </div>
            <aside className="rounded-2xl border border-fg-50/10 glass p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-accent">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl text-fg-50">Who it&rsquo;s for</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {plan.whoItsFor.map((who) => (
                  <li key={who} className="flex items-start gap-3 text-sm text-fg-300/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    {who}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* ── Scope ────────────────────────────────────────────── */}
        <section aria-labelledby="plan-scope" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-accent">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  SCOPE
                </p>
                <h2 id="plan-scope" className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl">
                  Every checkpoint, defined upfront
                </h2>
              </div>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/60 md:block">
                {plan.scope.length} checkpoints
              </span>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {plan.scope.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-4 rounded-xl border border-fg-50/10 glass p-5 transition-colors hover:border-brand-400/40"
                >
                  <span className="font-mono text-[11px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium leading-snug text-fg-50">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Journey ──────────────────────────────────────────── */}
        <section aria-labelledby="plan-journey" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                PROCESS
              </p>
              <h2 id="plan-journey" className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl">
                How the audit runs
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-300/80">
                A defined sequence from scoping to debrief. You know who is
                coming, when, and what they are measuring — even in a mystery
                format, the framework is agreed before the visit.
              </p>
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-fg-50/10 glass p-5">
                <Compass className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <p className="text-sm text-fg-300/85">
                  Every phase maps to the AuditExpert methodology —{" "}
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-50">
                    See → Measure → Understand → Improve
                  </span>
                </p>
              </div>
            </div>
            <ol className="relative space-y-0 border-l border-fg-50/15">
              {plan.journey.map((step, i) => (
                <li key={step.phase} className="relative pb-10 pl-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[9px] top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full border-brand-400/50 btn-primary"
                  >
                    <span className="h-[6px] w-[6px] rounded-full bg-brand-600" />
                  </span>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    Phase {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-fg-50">{step.phase}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-fg-300/80">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Evidence + Deliverables ──────────────────────────── */}
        <section aria-labelledby="plan-output" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                EVIDENCE
              </p>
              <h2 id="plan-output" className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl">
                Evidence captured on the ground
              </h2>
              <ul className="mt-8 space-y-4">
                {plan.evidenceCaptured.map((ev) => (
                  <li key={ev} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base-950 font-mono text-[11px] text-accent">
                      <ClipboardList className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="pt-1.5 text-sm leading-relaxed text-fg-50">{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-base-950 p-8 text-fg-50 md:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-400/15 text-accent">
                  <FileCheck2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl">What you receive</h3>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.deliverables.map((d, i) => (
                  <li key={d} className="flex items-start gap-4 border-b border-fg-50/10 pb-4 last:border-0 last:pb-0">
                    <span className="font-mono text-[11px] text-accent">
                      D{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-fg-100/90">{d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/60">
                Every deliverable is evidence-linked. No claim without proof.
              </p>
            </div>
          </div>
        </section>

        {/* ── Booking CTA ──────────────────────────────────────── */}
        <section aria-labelledby="plan-cta" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <div className="relative overflow-hidden rounded-3xl px-8 py-14 md:px-16 md:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
              />
              <div className="relative max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  BOOK THIS PLAN
                </p>
                <h2
                  id="plan-cta"
                  className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
                >
                  {isMystery
                    ? "See your brand the way a real guest does."
                    : "Measure your standards against what actually happens."}
                </h2>
                <p className="mt-5 max-w-xl text-lead text-fg-300/80">
                  Configure locations, add-ons and scheduling in the booking
                  flow. Total calculated transparently — {formatPrice(plan.priceMin, plan.priceMax)}{" "}
                  published range, 18% GST shown in your estimate.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <SelectPlanButton slug={plan.slug} size="lg">
                    {plan.cta}
                  </SelectPlanButton>
                  <MagneticButton
                    href={`/industries/${plan.category}`}
                    variant="ghost"
                    size="lg"
                  >
                    Compare {plan.categoryLabel} plans
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related plans ────────────────────────────────────── */}
        {relatedPlans.length > 0 && (
          <section aria-labelledby="related-plans" className="border-t border-fg-50/10 py-16 md:py-24">
            <div className="container-site">
              <div className="mb-10 flex items-end justify-between gap-6">
                <div>
                  <p className="eyebrow text-accent">
                    <span className="eyebrow-rule" aria-hidden="true" />
                    ALSO IN {plan.categoryLabel.toUpperCase()}
                  </p>
                  <h2 id="related-plans" className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl">
                    Related plans
                  </h2>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {relatedPlans.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/audit-plans/${p.slug}`}
                    className="group flex flex-col rounded-2xl border border-fg-50/10 glass p-7 transition-all hover:border-brand-400/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                          p.format === "mystery"
                            ? "border-brand-400/30 bg-brand-500/10 text-accent"
                            : "border-aqua-600/30 bg-aqua-500/10 text-aqua-600"
                        }`}
                      >
                        {p.format === "mystery" ? "Mystery" : "SOP"}
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-fg-300/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-5 font-display text-xl text-fg-50">{p.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-300/75">{p.tagline}</p>
                    <p className="mt-5 border-t border-fg-50/10 pt-4 font-mono text-xs uppercase tracking-[0.14em] text-fg-50">
                      {formatPrice(p.priceMin, p.priceMax)}
                      <span className="ml-2 font-normal normal-case tracking-normal text-fg-300/60">
                        / {p.priceUnit}
                      </span>
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
