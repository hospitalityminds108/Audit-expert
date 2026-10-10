import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import {
  Award,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  Star,
  Users2,
} from "lucide-react";
import { auditorTypes, testimonials } from "@/data/navigation";
import { integrityStandards, siteConfig } from "@/data/site";
import { auditorFaqs } from "@/data/faqs";
import AuditorApplicationForm from "@/components/forms/AuditorApplicationForm";
import FAQAccordion from "@/components/ui/FAQAccordion";

export const metadata: Metadata = {
  title: "Join as Auditor",
  description:
    "Join the AuditExpert auditor network. Hospitality, retail, healthcare and quality professionals — matched assignments, certified training, per-assignment compensation.",
  openGraph: {
    title: `Join as Auditor — ${siteConfig.name}`,
    description: "Join the AuditExpert auditor network.",
    images: [{ url: "/images/hero.jpg" }],
  },
};

const perks = [
  {
    icon: GraduationCap,
    title: "Certified training",
    detail:
      "Orientation on methodology, evidence standards, confidentiality and reporting before your first assignment.",
  },
  {
    icon: ClipboardCheck,
    title: "Matched assignments",
    detail:
      "Assignments matched by city, industry experience, availability and your auditor quality rating.",
  },
  {
    icon: Star,
    title: "Ratings that count",
    detail:
      "Quality checks and ratings keep the network sharp — and open better assignments to you.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity framework",
    detail:
      "You are protected by the same integrity standards our clients rely on: evidence, confidentiality, independence.",
  },
] as const;

export default function JoinAsAuditorPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Join as Auditor",
        item: `${siteConfig.url}/join-as-auditor`,
      },
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
            className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand-500/10 blur-3xl"
          />
          <div className="container-site relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-300/60">
                <li>
                  <Link href="/" className="transition-colors hover:text-accent">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-accent">Join as Auditor</li>
              </ol>
            </nav>
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              THE AUDITOR NETWORK
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-display-xl leading-[1.02] tracking-[-0.02em] text-fg-50 md:text-display-lg">
              Have a trained eye? Put it to work.
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-fg-300/80">
              AuditExpert runs on a network of hospitality, retail, healthcare
              and quality professionals who know what great service looks like
              — and can prove it with evidence. Apply to join.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {auditorTypes.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-fg-50/15 bg-white/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/80"
                >
                  {t}
                </span>
              ))}
              <span className="rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                +{auditorTypes.length - 4} more
              </span>
            </div>
          </div>
        </header>

        {/* ── Perks ────────────────────────────────────────────── */}
        <div className="container-site">
          <PageBanner images={[{ src: "/images/sections/mystery.jpg", alt: "A mystery auditor arriving as a guest", caption: "Mystery audit" }, { src: "/images/industries/restaurants-cafes.jpg", alt: "Restaurant service in progress", caption: "Restaurants & cafés" }, { src: "/images/industries/malls-retail.jpg", alt: "Shopping mall atrium", caption: "Malls & retail" }]} />
        </div>

        <section aria-labelledby="perks" className="py-16 md:py-24">
          <div className="container-site">
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              WHY JOIN
            </p>
            <h2
              id="perks"
              className="mt-5 max-w-3xl font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
            >
              Four reasons auditors stay in the network
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {perks.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-fg-50/10 glass p-7 transition-colors hover:border-brand-400/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500/10 text-accent">
                    <p.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg text-fg-50">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-300/80">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How selection works ──────────────────────────────── */}
        <section aria-labelledby="selection" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                SELECTION
              </p>
              <h2
                id="selection"
                className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
              >
                How selection works
              </h2>
              <ol className="mt-8 space-y-0 border-l border-fg-50/15">
                {[
                  {
                    title: "Apply",
                    detail: "Submit the form below with your background, city and availability.",
                  },
                  {
                    title: "Profile review",
                    detail: "The network team reviews your profile against active programs and geography.",
                  },
                  {
                    title: "Orientation & training",
                    detail: "Selected auditors complete orientation on methodology, evidence and confidentiality.",
                  },
                  {
                    title: "Sample assessment",
                    detail: "A sample evaluation confirms reporting quality before live assignments.",
                  },
                  {
                    title: "Matched assignments",
                    detail: "You receive assignments matched to your city, sectors and rating.",
                  },
                ].map((s, i) => (
                  <li key={s.title} className="relative pb-8 pl-10 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[9px] top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-brand-400/50 bg-fg-50/5"
                    >
                      <span className="h-[6px] w-[6px] rounded-full bg-brand-600" />
                    </span>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg text-fg-50">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-fg-300/80">{s.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-6 self-start rounded-2xl border border-fg-50/10 glass p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-accent">
                  <Users2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl text-fg-50">Who we look for</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {auditorTypes.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-fg-50/12 bg-fg-50/5 px-3 py-1.5 text-xs text-fg-50"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-fg-300/80">
                You don&rsquo;t need audit experience to apply — but you do
                need the eye. We train for method; you bring the standards.
              </p>
              <div className="flex items-center gap-3 rounded-xl bg-base-950 p-5 text-fg-50">
                <Award className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <p className="text-sm text-fg-300/90">
                  Compensation is per completed, quality-verified assignment.
                  Terms shared during onboarding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────── */}
        <section aria-labelledby="auditor-voices" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              FROM THE FIELD
            </p>
            <h2
              id="auditor-voices"
              className="mt-5 max-w-3xl font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
            >
              What brands say about our reports
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.author + t.context}
                  className="flex flex-col rounded-2xl border border-fg-50/10 glass p-7"
                >
                  <blockquote className="flex-1 text-sm leading-relaxed text-fg-50">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-end justify-between border-t border-fg-50/10 pt-5">
                    <div>
                      <p className="text-sm font-semibold text-fg-50">{t.author}</p>
                      <p className="mt-0.5 text-xs text-fg-300/70">{t.context}</p>
                    </div>
                    <p className="text-right">
                      <span className="font-display text-xl text-accent">{t.metric}</span>
                      <span className="block text-[10px] uppercase tracking-[0.12em] text-fg-300/60">
                        {t.metricLabel}
                      </span>
                    </p>
                    </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── Integrity standards ──────────────────────────────── */}
        <section aria-labelledby="integrity" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                THE FRAMEWORK
              </p>
              <h2
                id="integrity"
                className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
              >
                The integrity framework you operate under
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-300/80">
                These standards protect clients and auditors alike. They are
                the difference between a report that can be acted on and an
                opinion that can&rsquo;t.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {integrityStandards.map((s) => (
                <li key={s.principle} className="rounded-xl border border-fg-50/10 glass p-6">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-50">
                      {s.principle}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-300/80">{s.standard}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Application ──────────────────────────────────────── */}
        <section id="apply" aria-labelledby="apply-heading" className="border-t border-fg-50/10 py-16 md:py-24">
          <div className="container-site">
            <div className="mx-auto max-w-3xl">
              <p className="eyebrow text-accent">
                <span className="eyebrow-rule" aria-hidden="true" />
                APPLY
              </p>
              <h2
                id="apply-heading"
                className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl"
              >
                Apply to the network
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-300/80">
                Fields marked * are required. Reviews typically take five to
                seven working days.
              </p>
              <div className="mt-10">
                <AuditorApplicationForm />
              </div>
            </div>
            <div className="mt-6 mx-auto max-w-3xl text-sm leading-relaxed text-fg-300/80">
              Questions first?{" "}
              <Link href="/contact" className="text-accent underline decoration-brand-600/40 underline-offset-4 transition-colors hover:text-accent">
                Talk to the network team
              </Link>
              .
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
              <h2 id="faq" className="mt-5 font-display text-3xl leading-tight tracking-[-0.01em] text-fg-50 md:text-4xl">
                Auditor questions
              </h2>
            </div>
            <div>
              <FAQAccordion items={auditorFaqs} tone="light" />
            </div>
          </div>
        </section>

        {/* Spacer for fixed header + footer CTA */}
        <div className="h-10" aria-hidden="true" />
      </div>
    </>
  );
}
