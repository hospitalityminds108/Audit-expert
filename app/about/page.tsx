import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Eye, LineChart, Scale, ShieldCheck, TrendingUp } from "lucide-react";
import { integrityStandards, siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "AuditExpert is a HospitalityMinds company: a specialist service audit practice that sees what customers experience, measures what teams deliver, and turns evidence into improvement.",
};

const BRAND_LADDER = [
  {
    icon: Eye,
    word: "SEE",
    body: "Trained auditors walk your customer journey exactly as a guest does — reservation call to checkout, entry to exit.",
  },
  {
    icon: Scale,
    word: "MEASURE",
    body: "Every touchpoint is scored against your SOPs on structured scorecards, with photo and video evidence attached.",
  },
  {
    icon: LineChart,
    word: "UNDERSTAND",
    body: "Findings are ranked by impact, not just compliance — you learn where service slips and what it costs the brand.",
  },
  {
    icon: TrendingUp,
    word: "IMPROVE",
    body: "Actionable recommendations, management debriefs and re-audits close the loop and prove the lift.",
  },
];

export default function AboutPage() {
  return (
    <div className="">
      {/* ── Hero ── */}
      <div className="container-site pb-16 pt-32 md:pt-40">
        <p className="eyebrow text-accent">
          <span className="eyebrow-rule" aria-hidden="true" />
          ABOUT
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.015em] text-fg-50 md:text-6xl">
          A specialist audit practice, backed by hospitality operators.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-300/80">
          {siteConfig.name} is the service audit practice of {siteConfig.company} —
          built by people who have run hotels, restaurants and service floors,
          for brands that want the truth about what their customers experience.
        </p>

        {/* ── Facts strip ── */}
        <dl className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { k: "Parent practice", v: siteConfig.company },
            { k: "Industries served", v: "6 verticals" },
            { k: "Audit formats", v: "Mystery + SOP" },
            { k: "Base", v: siteConfig.baseCity },
          ].map((f) => (
            <div key={f.k} className="rounded-2xl border border-fg-50/10 glass p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">
                {f.k}
              </dt>
              <dd className="mt-2 text-sm text-fg-50">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Why we exist ── */}
      <div className="container-site py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              WHY WE EXIST
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-[-0.01em] text-fg-50">
              Between the SOP binder and the guest review sits the truth.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-fg-300/80">
              Management sees dashboards, occupancy, revenue and complaints —
              but rarely sees the experience itself: the unanswered call, the
              queue at breakfast, the room that missed the standard by a
              margin nobody logged. Reviews arrive late, anonymised and
              skewed. Internal checks carry courtesy bias.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg-300/80">
              We exist to close that visibility gap with independent,
              evidence-backed audits that treat your standards as a contract
              with the guest — and report exactly where it is honoured and
              where it quietly erodes.
            </p>
          </div>
          <div className="rounded-2xl border border-fg-50/10 glass p-7">
            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
              <Compass className="h-4 w-4 text-accent" aria-hidden="true" />
              The operating method
            </p>
            <ol className="mt-6 space-y-5">
              {BRAND_LADDER.map((b, i) => {
                const Icon = b.icon;
                return (
                  <li key={b.word} className="flex gap-4">
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium text-fg-50">
                        <Icon className="h-4 w-4 text-sage-600" aria-hidden="true" />
                        {b.word}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-fg-300/70">
                        {b.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* ── Integrity standards ── */}
      <div className="container-site py-16">
        <p className="eyebrow text-accent">
          <span className="eyebrow-rule" aria-hidden="true" />
          INTEGRITY STANDARDS
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl tracking-[-0.01em] text-fg-50">
          Audit findings are only worth what the process behind them is worth.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrityStandards.map((s) => (
            <div key={s.principle} className="rounded-2xl border border-fg-50/10 glass p-6">
              <p className="flex items-center gap-2.5 text-sm font-medium text-fg-50">
                <ShieldCheck className="h-4 w-4 text-sage-600" aria-hidden="true" />
                {s.principle}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-fg-300/70">{s.standard}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="container-site pb-24">
        <div className="rounded-3xl border border-brass-400/30 bg-brass-400/[0.06] p-10 text-center md:p-14">
          <h2 className="mx-auto max-w-2xl font-display text-3xl tracking-[-0.01em] text-fg-50 md:text-4xl">
            See your brand the way your guest does.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fg-300/80">
            Book a single audit or a multi-location program — either way you
            get evidence, scores and a clear path to improvement.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/book-an-audit"
              className="inline-flex items-center justify-center gap-2 rounded-full btn-gold px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-on-gold transition-colors"
            >
              Book an audit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-fg-50/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-fg-100 transition-colors hover:border-fg-50/40"
            >
              How it works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
