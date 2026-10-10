import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export default function LegalShell({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="">
      <div className="container-site pb-24 pt-32 md:pt-40">
        <p className="eyebrow text-accent">
          <span className="eyebrow-rule" aria-hidden="true" />
          LEGAL
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-[-0.015em] text-fg-50 md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/60">
          Last updated: {updated}
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-fg-300/80">{intro}</p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* ── Section index ── */}
          <nav aria-label="Contents" className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">
              Contents
            </p>
            <ol className="mt-4 space-y-2.5">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#s-${i + 1}`}
                    className="flex gap-3 text-xs text-fg-300/80 transition-colors hover:text-accent"
                  >
                    <span className="font-mono text-[10px] text-fg-300/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* ── Sections ── */}
          <div className="max-w-3xl space-y-10">
            {sections.map((s, i) => (
              <section key={s.heading} id={`s-${i + 1}`} className="scroll-mt-24">
                <h2 className="font-display text-xl text-fg-50">
                  <span className="mr-3 font-mono text-xs text-accent/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-fg-300/80">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-2xl border border-fg-50/10 glass p-6">
              <p className="text-sm leading-relaxed text-fg-300/80">
                Questions about this policy? Write to{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-accent underline underline-offset-2 hover:text-accent"
                >
                  {siteConfig.email}
                </a>{" "}
                or see our{" "}
                <Link href="/contact" className="text-accent underline underline-offset-2 hover:text-accent">
                  contact page
                </Link>
                .
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-200 hover:text-fg-50"
              >
                Back to home
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
