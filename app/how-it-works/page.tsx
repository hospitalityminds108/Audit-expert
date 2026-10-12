import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import {
  ArrowUpRight,
  CalendarCheck,
  ClipboardList,
  Compass,
  FileBarChart,
  FileCheck2,
  MapPin,
  Radar,
  Scale,
  ScanEye,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { methodologySteps, twoWays } from "@/data/navigation";
import { reportDeliverables, brandProgramFeatures, siteConfig } from "@/data/site";
import { bookingFaqs } from "@/data/faqs";
import MagneticButton from "@/components/ui/MagneticButton";
import FAQAccordion from "@/components/ui/FAQAccordion";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "The AuditExpert methodology: define, design, assign, audit, verify, improve. How a service audit runs from scoping to scored, evidence-backed report and corrective actions.",
  openGraph: {
    title: `How It Works — ${siteConfig.name}`,
    description: "The AuditExpert methodology from scoping to scored, evidence-backed report.",
    images: [{ url: "/images/hero.jpg" }],
  },
};

const auditInvariants = [
  {
    icon: ClipboardList,
    title: "Industry-specific checklist",
    detail:
      "Not a generic form. Every checkpoint is written for your industry and mapped to your customer journey.",
  },
  {
    icon: ScanEye,
    title: "Evidence over opinion",
    detail:
      "Timed observations, photographs where permitted, records. Every finding is tied to what was actually seen.",
  },
  {
    icon: Scale,
    title: "Structured scoring",
    detail:
      "Checkpoint, section and overall scores. One number leadership sees first — and the detail behind it.",
  },
  {
    icon: Compass,
    title: "Prioritised corrective actions",
    detail:
      "Critical, high, medium and low. Practical recommendations with owners, not a list of complaints.",
  },
] as const;

const runTimeline = [
  {
    phase: "Before the audit",
    detail:
      "Scope, journey and checkpoints agreed. Auditor briefed and matched. For mystery formats, the scenario is designed to reflect a realistic customer — not an artificial test.",
  },
  {
    phase: "The audit",
    detail:
      "The auditor visits as agreed — incognito or announced. Every checkpoint is observed, tested where applicable, and documented with timings and evidence.",
  },
  {
    phase: "Verification",
    detail:
      "Findings and evidence pass internal quality review. Scores are checked, claims are verified, and the report is assembled.",
  },
  {
    phase: "Report & debrief",
    detail:
      "You receive the scored, evidence-backed report with corrective actions. Applicable plans include a management debrief with your team.",
  },
  {
    phase: "After the audit",
    detail:
      "Actions are tracked. Re-audits and multi-location programs measure whether the gaps actually closed — quarter over quarter.",
  },
] as const;

export default function HowItWorksPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "How It Works", item: `${siteConfig.url}/how-it-works` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-500/10 blur-3xl"
          />
          <div className="container-site relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-300/60">
                <li>
                  <Link href="/" className="tap transition-colors hover:text-accent">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-accent">How It Works</li>
              </ol>
            </nav>
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              THE METHODOLOGY
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-display-xl leading-[1.02] text-fg-50 md:text-display-lg">
              Six steps from first briefing to a brand that measurably improves.
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-fg-300/80">
              An AuditExpert audit is not a visit with an opinion. It is a
              designed, documented, scored process — the same discipline every
              time, adapted to your industry and your standards.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <MagneticButton href="/book-an-audit" variant="primary" size="lg" showArrow>
                Book an Audit
              </MagneticButton>
              <MagneticButton
                href="/audit-plans"
                variant="outline"
                size="lg"
              >
                Browse Plans
              </MagneticButton>
            </div>
          </div>
        </header>

        {/* ── Six-step methodology ─────────────────────────────── */}
        <div className="container-site">
          <PageBanner images={[{ src: "/images/sections/mystery.jpg", alt: "A mystery auditor arriving as a guest", caption: "Mystery audit" }, { src: "/images/sections/sop.jpg", alt: "A revealed SOP audit with the operations team", caption: "SOP audit" }, { src: "/images/industries/hotels-resorts.jpg", alt: "Hotel lobby at dusk", caption: "Hotels & resorts" }]} />
        </div>

        <section aria-labelledby="methodology" className="py-16 md:py-24">
          <div className="container-site">
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              DEFINE → IMPROVE
            </p>
            <h2
              id="methodology"
              className="mt-5 max-w-3xl font-display text-4xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
            >
              The methodology behind every audit
            </h2>

            <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-fg-50/10 bg-fg-50/10 md:grid-cols-2 lg:grid-cols-3">
              {methodologySteps.map((step) => (
                <li key={step.number} className="bg-white/70 p-8 transition-colors hover:bg-white">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-4xl font-medium text-accent/80">
                      {step.number}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-300/60">
                      Step
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl tracking-[0.02em] text-fg-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-300/80">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Two formats reminder ─────────────────────────────── */}
        <section aria-labelledby="formats" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <div className="grid gap-10 lg:grid-cols-2">
              {[
                { way: twoWays.mystery, tone: "brass" },
                { way: twoWays.sop, tone: "sage" },
              ].map(({ way, tone }) => (
                <div
                  key={way.label}
                  className={`flex flex-col rounded-2xl border glass p-8 md:p-10 ${
                    tone === "brass" ? "border-brand-400/25" : "border-aqua-600/25"
                  }`}
                >
                  <p
                    className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                      tone === "brass" ? "text-accent" : "text-aqua-600"
                    }`}
                  >
                    {way.label}
                  </p>
                  <h3 className="mt-4 font-display text-2xl leading-tight text-fg-50">{way.sub}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-300/85">{way.description}</p>
                  <ul className="mt-6 space-y-2.5">
                    {way.points.slice(0, 4).map((pt) => (
                      <li key={pt.title} className="flex items-start gap-3 text-sm text-fg-50">
                        <Radar
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            tone === "brass" ? "text-accent" : "text-aqua-600"
                          }`}
                          aria-hidden="true"
                        />
                        {pt.title}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={way.cta.href}
                    className="tap mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-50 transition-colors hover:text-accent"
                  >
                    {way.cta.label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What every audit includes ────────────────────────── */}
        <section aria-labelledby="invariants" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              NON-NEGOTIABLES
            </p>
            <h2
              id="invariants"
              className="mt-5 max-w-3xl font-display text-4xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
            >
              Whatever the plan, every audit includes
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {auditInvariants.map((inv) => (
                <div
                  key={inv.title}
                  className="rounded-2xl border border-fg-50/10 glass p-7 transition-colors hover:border-brand-400/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500/10 text-accent">
                    <inv.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg text-fg-50">{inv.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-300/80">{inv.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Run timeline ─────────────────────────────────────── */}
        <section aria-labelledby="timeline" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                THE RUN
              </p>
              <h2
                id="timeline"
                className="mt-5 font-display text-4xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
              >
                What happens, in order
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-300/80">
                A single audit typically runs one to three weeks from briefing
                to report, depending on plan and scheduling. Multi-location
                programs run on your calendar — monthly, quarterly or annually.
              </p>
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-fg-50/10 glass p-5">
                <CalendarCheck className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <p className="text-sm text-fg-300/85">
                  Preferred dates and constraints are captured in the booking flow.
                </p>
              </div>
            </div>
            <ol className="relative border-l border-fg-50/15">
              {runTimeline.map((t, i) => (
                <li key={t.phase} className="relative pb-10 pl-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[9px] top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full border-brand-400/50 btn-primary"
                  >
                    <span className="h-[6px] w-[6px] rounded-full bg-brand-600" />
                  </span>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-fg-50">{t.phase}</h3>
                  <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-fg-300/80">{t.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Report anatomy ───────────────────────────────────── */}
        <section aria-labelledby="report" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-accent">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  THE DELIVERABLE
                </p>
                <h2
                  id="report"
                  className="mt-5 max-w-3xl font-display text-4xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
                >
                  Anatomy of the report
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-fg-300/80">
                One executive score. Section scores behind it. Evidence behind
                every section score. Actions behind every finding.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-fg-50/10 bg-fg-50/10 sm:grid-cols-2 lg:grid-cols-4">
              {reportDeliverables.map((d, i) => (
                <div key={d.title} className="bg-white/70 p-7">
                  <div className="flex items-center justify-between">
                    <FileBarChart className="h-5 w-5 text-accent" aria-hidden="true" />
                    <span className="font-mono text-[10px] text-fg-300/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-sm font-semibold text-fg-50">{d.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-300/75">{d.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── From audit to program ────────────────────────────── */}
        <section aria-labelledby="program" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <div className="rounded-3xl px-8 py-14 md:px-16 md:py-20">
              <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    SCALE
                  </p>
                  <h2
                    id="program"
                    className="mt-5 font-display text-4xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
                  >
                    From one audit to a brand-wide program
                  </h2>
                  <p className="mt-5 max-w-md text-lead text-fg-300/80">
                    Single audits find the gaps. Programs close them — and keep
                    them closed. Location scores, brand score, repeat gaps and
                    action tracking, on one framework.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <MagneticButton
                      href="/book-an-audit"
                      variant="primary"
                      size="lg"
                      showArrow
                    >
                      Start with one audit
                    </MagneticButton>
                  </div>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {brandProgramFeatures.map((f) => (
                    <li
                      key={f.title}
                      className="rounded-xl border border-fg-50/12 glass p-5"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                        <h3 className="text-sm font-semibold text-fg-50">{f.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-fg-300/75">{f.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Integrity ────────────────────────────────────────── */}
        <section aria-labelledby="integrity" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                INTEGRITY
              </p>
              <h2
                id="integrity"
                className="mt-5 font-display text-4xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
              >
                Why you can act on the findings
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-300/80">
                An audit is only worth what its integrity is worth. Reports
                distinguish observed fact from professional judgement, and pass
                internal quality review before release.
              </p>
            </div>
            <div className="flex items-start gap-5 rounded-2xl border border-brand-400/25 bg-brand-500/[0.06] p-8">
              <ShieldCheck className="h-8 w-8 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h3 className="font-display text-xl text-fg-50">Fair reporting, always</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-300/85">
                  Strengths are reported alongside failures. Evidence is linked
                  to every finding. Conflicts of interest are disclosed. Your
                  information stays confidential. This is what makes an
                  AuditExpert report something a board can act on — not just a
                  complaint list.
                </p>
                <Link
                  href="/about"
                  className="tap mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-50 transition-colors hover:text-accent"
                >
                  About AuditExpert
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section aria-labelledby="faq" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                QUESTIONS
              </p>
              <h2 id="faq" className="mt-5 font-display text-4xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl">
                Booking questions
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-300/80">
                The practical details of scheduling, expenses and deliverables.
                Anything else — ask directly.
              </p>
              <MagneticButton
                href="/contact"
                variant="outline"
                size="md"
                className="mt-8"
              >
                Ask a question
              </MagneticButton>
            </div>
            <div>
              <FAQAccordion items={bookingFaqs} tone="light" />
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section aria-labelledby="cta" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <div className="relative overflow-hidden rounded-3xl px-8 py-14 md:px-16 md:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
              />
              <div className="relative max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  SEE → MEASURE → UNDERSTAND → IMPROVE
                </p>
                <h2
                  id="cta"
                  className="mt-5 font-display text-4xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
                >
                  Now you know how it works. See how your brand actually runs.
                </h2>
                <div className="mt-8 flex flex-wrap gap-4">
                  <MagneticButton href="/book-an-audit" variant="primary" size="lg" showArrow>
                    Book an Audit
                  </MagneticButton>
                  <MagneticButton
                    href="/industries"
                    variant="ghost"
                    size="lg"
                  >
                    Find my industry
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
