import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import {
  industries,
  getIndustryBySlug,
} from "@/data/industries";
import { getPlanBySlug } from "@/data/audit-plans";
import { siteConfig } from "@/data/site";
import ProgressTracker from "@/components/industry/ProgressTracker";
import FAQAccordion from "@/components/ui/FAQAccordion";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) return { title: "Industry not found" };
  return {
    title: industry.seo.title,
    description: industry.seo.description,
    keywords: industry.seo.keywords,
    openGraph: {
      title: industry.seo.title,
      description: industry.seo.description,
      images: [{ url: industry.image }],
    },
  };
}

const TRACKER_SECTIONS = [
  { id: "problem", label: "Problem" },
  { id: "journey", label: "Journey" },
  { id: "inspect", label: "Inspect" },
  { id: "evidence", label: "Evidence" },
  { id: "process", label: "Process" },
  { id: "scorecard", label: "Scorecard" },
  { id: "plans", label: "Plans" },
  { id: "faq", label: "FAQ" },
];

export default function IndustryPage({ params }: PageProps) {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) notFound();

  const recommendedPlans = industry.recommendedPlanSlugs
    .map(getPlanBySlug)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${industry.title} Service Audits`,
    description: industry.seo.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: "India",
    serviceType: "Service audit and mystery audit",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: industry.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${siteConfig.url}/industries` },
      {
        "@type": "ListItem",
        position: 3,
        name: industry.title,
        item: `${siteConfig.url}/industries/${industry.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, faqJsonLd, breadcrumbJsonLd]) }}
      />
      <main id="main" className="bg-ink-950">
        {/* ── Hero ─────────────────────────────────────────── */}
        <header className="relative flex min-h-[70vh] items-end overflow-hidden pb-14 pt-36 md:pb-20 md:pt-48">
          <div className="absolute inset-0">
            <Image
              src={industry.image}
              alt={industry.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/45" />
          </div>

          <div className="container-site relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-300/40">
                <li>
                  <Link href="/" className="transition-colors hover:text-brass-300">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/industries" className="transition-colors hover:text-brass-300">Industries</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-brass-400">{industry.shortTitle}</li>
              </ol>
            </nav>
            <p className="eyebrow text-brass-400">
              <span className="eyebrow-rule" aria-hidden="true" />
              {industry.heroEyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-display-xl md:text-display-2xl leading-[1.02] tracking-[-0.02em] text-bone-50">
              {industry.heroHeadline}
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-bone-300/80">
              {industry.heroSupport}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {industry.auditTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-bone-50/15 bg-ink-950/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-300/80 backdrop-blur-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </header>

        <ProgressTracker sections={TRACKER_SECTIONS} />

        <div id="page-content" className="container-site pb-28 md:pb-36">
          {/* ── Problem ─────────────────────────────────────── */}
          <section id="problem" className="scroll-mt-32 pt-20 md:pt-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <div>
                <p className="eyebrow text-brass-400">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  THE PROBLEM
                </p>
                <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-bone-50">
                  {industry.problem.heading}
                </h2>
              </div>
              <div className="space-y-5">
                {industry.problem.body.map((para, i) => (
                  <p key={i} className="text-[15px] leading-[1.8] text-bone-300/80">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </section>

          {/* ── Journey ─────────────────────────────────────── */}
          <section id="journey" className="scroll-mt-32 pt-20 md:pt-28">
            <p className="eyebrow text-brass-400">
              <span className="eyebrow-rule" aria-hidden="true" />
              THE JOURNEY WE AUDIT
            </p>
            <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-bone-50">
              Touchpoint by touchpoint.
            </h2>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {industry.journey.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-ink-800 bg-ink-900/60 p-6"
                >
                  <span className="font-mono text-[11px] text-brass-400/80 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[15px] font-medium text-bone-50">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-bone-300/60">
                    {step.caption}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* ── What we inspect ─────────────────────────────── */}
          <section id="inspect" className="scroll-mt-32 pt-20 md:pt-28">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow text-brass-400">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  WHAT WE INSPECT
                </p>
                <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-bone-50">
                  The checklist behind the report.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-bone-300/75">
                  Every item maps to a checkpoint with an evidence expectation —
                  nothing in the report exists without an observation behind it.
                </p>
              </div>
              <ul className="space-y-3">
                {industry.whatWeInspect.map((item) => (
                  <li key={item} className="flex items-start gap-3 border-b border-ink-800/70 pb-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-sage-400" strokeWidth={2} />
                    <span className="text-[14px] leading-relaxed text-bone-300/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Evidence approach ───────────────────────────── */}
          <section id="evidence" className="scroll-mt-32 pt-20 md:pt-28">
            <div className="rounded-2xl border border-brass-400/20 bg-gradient-to-br from-brass-500/[0.07] to-transparent p-8 md:p-10">
              <p className="eyebrow text-brass-400">
                <span className="eyebrow-rule" aria-hidden="true" />
                EVIDENCE APPROACH
              </p>
              <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-bone-50">
                Findings are observations, not opinions.
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {industry.evidenceApproach.map((point, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <span className="mt-1 font-mono text-[11px] text-brass-400/80 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14px] leading-relaxed text-bone-300/85">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Audit process ───────────────────────────────── */}
          <section id="process" className="scroll-mt-32 pt-20 md:pt-28">
            <p className="eyebrow text-brass-400">
              <span className="eyebrow-rule" aria-hidden="true" />
              HOW THE AUDIT RUNS
            </p>
            <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-bone-50">
              From brief to report.
            </h2>
            <ol className="mt-10 space-y-0">
              {industry.auditProcess.map((step, i) => (
                <li
                  key={step.step}
                  className="grid grid-cols-[auto_1fr] gap-5 border-b border-ink-800/70 py-5 md:grid-cols-[80px_1fr_2fr]"
                >
                  <span className="font-mono text-sm text-brass-400/80 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[15px] font-medium text-bone-50">{step.step}</h3>
                  <p className="col-span-2 text-[14px] leading-relaxed text-bone-300/70 md:col-span-1">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Scorecard example ───────────────────────────── */}
          <section id="scorecard" className="scroll-mt-32 pt-20 md:pt-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
              <div>
                <p className="eyebrow text-brass-400">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  SCORECARD EXAMPLE
                </p>
                <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-bone-50">
                  What a scored report looks like.
                </h2>
                <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-bone-300/75">
                  Section scores roll up to one executive score. Every section
                  score is the weighted average of its checkpoints — each tied
                  to evidence.
                </p>
              </div>
              <div className="rounded-2xl border border-ink-800 bg-ink-900/60 p-6 md:p-8">
                <div className="space-y-5">
                  {industry.scorecardExample.map((row) => (
                    <div key={row.section} className="flex items-center gap-4">
                      <p className="w-40 shrink-0 text-[13px] text-bone-300/85">
                        {row.section}
                      </p>
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-800">
                        <div
                          className={`h-full rounded-full ${
                            row.score >= 85
                              ? "bg-sage-400"
                              : row.score >= 70
                              ? "bg-brass-400"
                              : "bg-critical/80"
                          }`}
                          style={{ width: `${row.score}%` }}
                        />
                      </div>
                      <p className="w-8 text-right font-mono text-xs tabular-nums text-bone-50">
                        {row.score}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 border-t border-ink-800 pt-4 font-mono text-[10px] leading-relaxed tracking-wide text-bone-300/40">
                  ILLUSTRATIVE EXAMPLE — ACTUAL SCORECARDS ARE CLIENT-CONFIDENTIAL.
                </p>
              </div>
            </div>
          </section>

          {/* ── Recommended plans ───────────────────────────── */}
          <section id="plans" className="scroll-mt-32 pt-20 md:pt-28">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-brass-400">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  RECOMMENDED PLANS
                </p>
                <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-bone-50">
                  Start here.
                </h2>
              </div>
              <Link
                href={`/audit-plans?category=${industry.slug}`}
                className="group inline-flex items-center gap-2.5 border-b border-brass-400/40 pb-1 text-sm font-medium text-bone-50 transition-colors duration-300 hover:border-brass-300 hover:text-brass-300"
              >
                View all {industry.shortTitle} plans
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recommendedPlans.map((plan) => (
                <Link
                  key={plan.slug}
                  href={`/audit-plans/${plan.slug}`}
                  data-cursor-label="OPEN"
                  className="group flex flex-col rounded-2xl border border-ink-800 bg-ink-900/60 p-7 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brass-400/30"
                >
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                      plan.format === "mystery"
                        ? "bg-brass-500/15 text-brass-300"
                        : "bg-sage-500/15 text-sage-300"
                    }`}
                  >
                    {plan.format === "mystery" ? "Mystery" : "SOP / Revealed"}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-bone-50">{plan.name}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-bone-300/65">
                    {plan.tagline}
                  </p>
                  <p className="mt-4 font-mono text-base tabular-nums text-bone-50">
                    ₹{(plan.priceMin / 1000).toFixed(0)}K–{(plan.priceMax / 1000).toFixed(0)}K
                    <span className="ml-2 font-sans text-xs font-normal text-bone-300/50">
                      / {plan.priceUnit}
                    </span>
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brass-300 transition-colors duration-300 group-hover:text-brass-200">
                    {plan.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── FAQ ─────────────────────────────────────────── */}
          <section id="faq" className="scroll-mt-32 pt-20 md:pt-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <div>
                <p className="eyebrow text-brass-400">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  QUESTIONS
                </p>
                <h2 className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-bone-50">
                  {industry.shortTitle} audit FAQs.
                </h2>
              </div>
              <FAQAccordion items={industry.faqs} />
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────────────── */}
          <section className="mt-24 overflow-hidden rounded-2xl border border-ink-800 bg-gradient-to-br from-ink-900 to-ink-950 p-8 text-center md:p-14">
            <h2 className="mx-auto max-w-2xl font-display text-display-md md:text-display-lg leading-[1.05] text-bone-50">
              See what your guests actually experience.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-bone-300/70">
              Book a {industry.shortTitle.toLowerCase()} audit in minutes — or
              ask for a custom framework first.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/book-an-audit?industry=${industry.slug}`}
                className="group inline-flex items-center gap-3 rounded-full bg-bone-50 px-7 py-3.5 text-sm font-semibold text-ink-950 transition-colors duration-300 hover:bg-brass-300"
              >
                Book an audit
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full border border-bone-50/20 px-7 py-3.5 text-sm font-medium text-bone-50 transition-colors duration-300 hover:border-brass-400/50 hover:text-brass-300"
              >
                Ask a question
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
