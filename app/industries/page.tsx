import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { auditPlans } from "@/data/audit-plans";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Industries We Audit",
  description:
    "Industry-specific service audits for hotels, restaurants, hospitals, malls, cinemas and salons. Checklists, evidence and scoring built around what your brand promises.",
  openGraph: {
    title: `Industries We Audit — ${siteConfig.name}`,
    description:
      "Industry-specific service audits with evidence-based scoring for six service industries.",
    images: [{ url: "/images/hero.jpg" }],
  },
};

export default function IndustriesIndexPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${siteConfig.url}/industries` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="">
        {/* Page header */}
        <header className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brass-500/[0.07] blur-[140px]"
            aria-hidden="true"
          />
          <div className="container-site relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-300/60">
                <li>
                  <Link href="/" className="transition-colors hover:text-accent">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-accent">
                  Industries
                </li>
              </ol>
            </nav>
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              INDUSTRIES
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-display-lg leading-[1.02] tracking-[-0.02em] text-fg-50">
              Six industries. Six ways the experience breaks.
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-fg-300/80">
              Every framework is built on the promises your industry actually
              makes — the guest journey, the clinical front desk, the checkout
              queue, the seat you paid for.
            </p>
          </div>
        </header>

        {/* Industry list */}
        <div className="container-site pb-28 md:pb-36">
          <div className="grid gap-6 md:grid-cols-2">
            {industries.map((industry, i) => {
              const planCount = auditPlans.filter(
                (p) => p.category === industry.slug
              ).length;
              return (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  data-cursor-label="VIEW"
                  className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-fg-50/10 bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={industry.image}
                      alt={industry.imageAlt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover opacity-50 transition-all duration-[1200ms] ease-premium group-hover:scale-[1.05] group-hover:opacity-65"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/65 to-base-950/20" />
                  </div>

                  <span className="absolute right-6 top-6 font-mono text-[11px] tracking-[0.18em] text-fg-50/60">
                    {String(i + 1).padStart(2, "0")} / 06
                  </span>

                  <div className="relative p-7 md:p-8">
                    <div className="flex flex-wrap gap-1.5">
                      {industry.auditTypes.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className="rounded-full border border-fg-50/15 bg-base-950/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/80 backdrop-blur-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-4 font-display text-3xl leading-[1.08] text-fg-50">
                      {industry.title}
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-fg-300/80">
                      {industry.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/60">
                        {planCount} audit plans
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors duration-300 group-hover:text-accent">
                        Explore
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={1.5}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Custom framework CTA */}
          <div className="mt-14 rounded-2xl border border-dashed border-fg-50/15 p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  Not on the list?
                </p>
                <h2 className="mt-3 font-display text-2xl text-fg-50">
                  We build custom audit frameworks.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-300/80">
                  Education, aviation, banking, real estate — if you make a
                  promise to customers, we can measure whether it&apos;s kept.
                </p>
              </div>
              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center gap-3 rounded-full btn-gold px-7 py-3.5 text-sm font-semibold text-on-gold transition-colors duration-300"
              >
                Talk to us
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
