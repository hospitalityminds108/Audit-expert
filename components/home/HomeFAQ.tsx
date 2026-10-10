"use client";


import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { generalFaqs } from "@/data/faqs";
import { useScrollReveal } from "@/lib/animations/gsap";
import FAQAccordion from "@/components/ui/FAQAccordion";

/**
 * Home FAQ — structured questions from the original site, with FAQPage JSON-LD.
 */
export default function HomeFAQ() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 75%" });

  return (
    <section
      ref={sectionRef}
      id="faq"
      data-section="faq"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Left */}
          <div>
            <p className="eyebrow text-accent" data-reveal>
              <span className="eyebrow-rule" aria-hidden="true" />
              QUESTIONS
            </p>
            <h2
              className="mt-6 font-display text-display-lg text-fg-50 leading-[1.02] tracking-[-0.02em]"
              data-reveal
              data-reveal-delay="0.08"
            >
              Clear answers, before you ask.
            </h2>
            <p className="mt-6 max-w-md text-lead text-fg-300/80" data-reveal data-reveal-delay="0.16">
              The questions every operations leader asks before their first
              audit — answered plainly.
            </p>
            <div className="mt-8" data-reveal data-reveal-delay="0.24">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 border-b border-brand-400/40 pb-1 text-sm font-medium text-fg-50 transition-colors duration-300 hover:border-brand-400 hover:text-accent"
              >
                Ask us something else
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>

          {/* Right: accordion */}
          <div data-reveal data-reveal-delay="0.15">
            <FAQAccordion items={generalFaqs} defaultOpen={0} tone="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
