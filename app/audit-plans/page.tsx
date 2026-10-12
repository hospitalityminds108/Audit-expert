import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import { ArrowUpRight, Check } from "lucide-react";
import { auditPlans, planCategoryTabs, formatPrice } from "@/data/audit-plans";
import { siteConfig } from "@/data/site";
import SelectPlanButton from "@/components/pricing/SelectPlanButton";

export const metadata: Metadata = {
  title: "Plans & Pricing",
  description:
    "Fixed-scope audit plans with transparent pricing across hotels, restaurants, hospitals, malls, cinemas and salons. Mystery and SOP audits with scorecards, evidence and corrective actions.",
  openGraph: {
    title: `Audit Plans & Pricing — ${siteConfig.name}`,
    description: "Fixed-scope audit plans with transparent pricing.",
    images: [{ url: "/images/hero.jpg" }],
  },
};

const FORMAT_FILTERS = [
  { id: "all", label: "All formats" },
  { id: "mystery", label: "Mystery" },
  { id: "sop", label: "SOP / Revealed" },
] as const;

const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
  "Nineteen", "Twenty",
];

const chip = (active: boolean) =>
  `rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
    active
      ? "chip-on"
      : "border border-fg-50/15 text-fg-300 hover:border-fg-50/40 hover:text-fg-50"
  }`;

export default function AuditPlansPage({
  searchParams,
}: {
  searchParams?: { category?: string | string[]; format?: string | string[] };
}) {
  // ?category= and ?format= arrive from the nav, the home page and industry pages
  const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const category = planCategoryTabs.find((t) => t.id === first(searchParams?.category))?.id ?? "all";
  const format = FORMAT_FILTERS.find((f) => f.id === first(searchParams?.format))?.id ?? "all";

  const filterHref = (next: { category?: string; format?: string }) => {
    const c = next.category ?? category;
    const f = next.format ?? format;
    const params = new URLSearchParams();
    if (c !== "all") params.set("category", c);
    if (f !== "all") params.set("format", f);
    const qs = params.toString();
    return qs ? `/audit-plans?${qs}` : "/audit-plans";
  };

  const visibleTabs = planCategoryTabs.filter((t) => category === "all" || t.id === category);
  const matches = (p: (typeof auditPlans)[number]) => format === "all" || p.format === format;
  const totalWord = NUMBER_WORDS[auditPlans.length] ?? String(auditPlans.length);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Audit Plans", item: `${siteConfig.url}/audit-plans` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="">
        {/* Header */}
        <header className="relative overflow-hidden pb-16 pt-40 md:pb-20 md:pt-52">
          <div className="container-site">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-300/60">
                <li>
                  <Link href="/" className="tap transition-colors hover:text-accent">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-accent">Audit Plans</li>
              </ol>
            </nav>
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              AUDIT PLANS
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-display-lg leading-[1.02] text-fg-50">
              {totalWord} plans. Two formats. Zero guesswork.
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-fg-300/80">
              Fixed-scope plans with published price ranges. Every plan ends in
              the same deliverable — a scored, evidence-backed report with
              prioritized corrective actions.
            </p>
            <PageBanner priority className="mt-12" images={[{ src: "/images/sections/mystery.jpg", alt: "A mystery auditor arriving as a guest", caption: "Mystery audit" }, { src: "/images/sections/sop.jpg", alt: "A revealed SOP audit with the operations team", caption: "SOP audit" }]} />
          </div>
        </header>

        {/* Plans by category */}
        <div className="container-site pb-28 md:pb-36">
          {/* Filters */}
          <div className="mb-12 space-y-3 border-y border-fg-50/10 py-5">
            <nav aria-label="Filter plans by industry" className="flex flex-wrap items-center gap-2">
              <span className="mr-2 w-16 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-300/70">
                Industry
              </span>
              <Link
                href={filterHref({ category: "all" })}
                scroll={false}
                aria-current={category === "all" ? "true" : undefined}
                className={chip(category === "all")}
              >
                All
              </Link>
              {planCategoryTabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={filterHref({ category: tab.id })}
                  scroll={false}
                  aria-current={category === tab.id ? "true" : undefined}
                  className={chip(category === tab.id)}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Filter plans by audit format" className="flex flex-wrap items-center gap-2">
              <span className="mr-2 w-16 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-300/70">
                Format
              </span>
              {FORMAT_FILTERS.map((f) => (
                <Link
                  key={f.id}
                  href={filterHref({ format: f.id })}
                  scroll={false}
                  aria-current={format === f.id ? "true" : undefined}
                  className={chip(format === f.id)}
                >
                  {f.label}
                </Link>
              ))}
            </nav>
          </div>

          {visibleTabs.map((tab) => {
            const plans = auditPlans.filter((p) => p.category === tab.id && matches(p));
            if (!plans.length) return null;
            return (
              <section key={tab.id} className="mb-16 last:mb-0" aria-labelledby={`plans-${tab.id}`}>
                <div className="mb-6 flex items-baseline gap-4">
                  <h2 id={`plans-${tab.id}`} className="font-display text-3xl text-fg-50">
                    {tab.label}
                  </h2>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/60">
                    {plans.length} {plans.length === 1 ? "plan" : "plans"}
                  </span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {plans.map((plan) => (
                    <article
                      key={plan.slug}
                      className="glass flex flex-col rounded-2xl border border-fg-50/10 p-7 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand-500/50"
                    >
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
                      </div>
                      <h3 className="mt-5 font-display text-2xl leading-[1.15] text-fg-50">
                        <Link href={`/audit-plans/${plan.slug}`} className="tap transition-colors hover:text-accent">
                          {plan.name}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-fg-300/80">
                        {plan.tagline}
                      </p>
                      <p className="mt-5 font-mono text-lg font-medium tabular-nums text-fg-50">
                        {formatPrice(plan.priceMin, plan.priceMax)}
                        <span className="ml-2 font-sans text-xs font-normal text-fg-300/60">
                          / {plan.priceUnit}
                        </span>
                      </p>
                      <ul className="mt-5 space-y-2 border-t border-fg-50/10 pt-5">
                        {plan.scope.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-[13px] text-fg-300/85">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aqua-600" strokeWidth={2} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
                        <SelectPlanButton slug={plan.slug}>Select plan</SelectPlanButton>
                        <Link
                          href={`/audit-plans/${plan.slug}`}
                          className="tap group inline-flex items-center gap-1.5 text-sm font-medium text-fg-200 transition-colors duration-300 hover:text-accent"
                        >
                          Full details
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={1.5}
                          />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <p className="mt-10 font-mono text-[11px] leading-relaxed tracking-wide text-fg-300/60">
            * Final quotation varies with city, duration, complexity, reimbursement, travel and locations.
            Taxes as applicable. Expenses (travel, stay, meals, tickets, service purchases) are reimbursed
            separately at actuals or under an agreed cap unless expressly stated.
          </p>
        </div>
      </div>
    </>
  );
}
