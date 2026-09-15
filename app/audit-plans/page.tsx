import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { auditPlans, planCategoryTabs, formatPrice } from "@/data/audit-plans";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Audit Plans & Pricing — ${siteConfig.name}`,
  description:
    "Fixed-scope audit plans with transparent pricing across hotels, restaurants, hospitals, malls, cinemas and salons. Mystery and SOP audits with scorecards, evidence and corrective actions.",
  openGraph: {
    title: `Audit Plans & Pricing — ${siteConfig.name}`,
    description: "Fixed-scope audit plans with transparent pricing.",
    images: [{ url: "/images/hero.jpg" }],
  },
};

export default function AuditPlansPage() {
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
      <main id="main" className="bg-bone-50">
        {/* Header */}
        <header className="relative overflow-hidden pb-16 pt-40 md:pb-20 md:pt-52">
          <div className="container-site">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-700/40">
                <li>
                  <Link href="/" className="transition-colors hover:text-brass-600">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-brass-600">Audit Plans</li>
              </ol>
            </nav>
            <p className="eyebrow text-brass-600">
              <span className="eyebrow-rule" aria-hidden="true" />
              AUDIT PLANS
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-display-xl md:text-display-2xl leading-[1.02] tracking-[-0.02em] text-ink-950">
              Nineteen plans. Two formats. Zero guesswork.
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-ink-700/80">
              Fixed-scope plans with published price ranges. Every plan ends in
              the same deliverable — a scored, evidence-backed report with
              prioritized corrective actions.
            </p>
          </div>
        </header>

        {/* Plans by category */}
        <div className="container-site pb-28 md:pb-36">
          {planCategoryTabs.map((tab) => {
            const plans = auditPlans.filter((p) => p.category === tab.id);
            return (
              <section key={tab.id} className="mb-16 last:mb-0" aria-labelledby={`plans-${tab.id}`}>
                <div className="mb-6 flex items-baseline gap-4">
                  <h2 id={`plans-${tab.id}`} className="font-display text-2xl text-ink-950">
                    {tab.label}
                  </h2>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700/40">
                    {plans.length} plans
                  </span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {plans.map((plan) => (
                    <Link
                      key={plan.slug}
                      href={`/audit-plans/${plan.slug}`}
                      data-cursor-label="OPEN"
                      className="group flex flex-col rounded-2xl border border-ink-950/10 bg-white p-7 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-ink-950/25 hover:shadow-[0_24px_60px_-24px_rgba(6,8,10,0.35)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                            plan.format === "mystery"
                              ? "bg-brass-100/60 text-brass-700"
                              : "bg-sage-100/70 text-sage-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              plan.format === "mystery" ? "bg-brass-500" : "bg-sage-500"
                            }`}
                            aria-hidden="true"
                          />
                          {plan.format === "mystery" ? "Mystery" : "SOP / Revealed"}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-2xl leading-[1.15] text-ink-950">
                        {plan.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-700/70">
                        {plan.tagline}
                      </p>
                      <p className="mt-5 font-mono text-lg font-medium tabular-nums text-ink-950">
                        {formatPrice(plan.priceMin, plan.priceMax)}
                        <span className="ml-2 font-sans text-xs font-normal text-ink-700/50">
                          / {plan.priceUnit}
                        </span>
                      </p>
                      <ul className="mt-5 space-y-2 border-t border-ink-950/8 pt-5">
                        {plan.scope.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-[13px] text-ink-700/85">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-600" strokeWidth={2} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-ink-950 transition-colors duration-300 group-hover:text-brass-600">
                        {plan.cta}
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={1.5}
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <p className="mt-10 font-mono text-[11px] leading-relaxed tracking-wide text-ink-700/50">
            * Final quotation varies with city, duration, complexity, reimbursement, travel and locations.
            Taxes as applicable. Expenses (travel, stay, meals, tickets, service purchases) are reimbursed
            separately at actuals or under an agreed cap unless expressly stated.
          </p>
        </div>
      </main>
    </>
  );
}
