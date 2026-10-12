"use client";


import { Check, FileText, ArrowUpRight } from "lucide-react";
import { reportDeliverables } from "@/data/site";
import { useScrollReveal, useParallax } from "@/lib/animations/gsap";
import Image from "next/image";
import Link from "next/link";

/**
 * Section 06 — WHAT THE BRAND GETS
 * The deliverable: an audit report UI — scorecard + evidence + actions.
 */
export default function WhatTheBrandGets() {
  const sectionRef = useScrollReveal<HTMLElement>({ start: "top 75%" });
  const reportRef = useParallax<HTMLDivElement>(0.08);

  return (
    <section
      ref={sectionRef}
      id="what-the-brand-gets"
      data-section="what-the-brand-gets"
      className="relative overflow-hidden py-20 md:py-24 lg:py-28"
    >
      {/* Ambient */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[720px] rounded-full bg-brand-500/[0.06] blur-[130px]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20 items-center">
          {/* Left: report mockup */}
          <div ref={reportRef} data-reveal data-reveal-delay="0.15" className="relative order-2 lg:order-1">
            <ReportMockup />
          </div>

          {/* Right: copy + deliverables */}
          <div className="order-1 lg:order-2">
            <p className="eyebrow text-accent" data-reveal>
              <span className="eyebrow-rule" aria-hidden="true" />
              SECTION 06 — WHAT THE BRAND GETS
            </p>
            <h2
              className="mt-6 font-display text-display-lg text-fg-50 leading-[1.02]"
              data-reveal
              data-reveal-delay="0.08"
            >
              A report built for decisions, not decoration.
            </h2>
            <p className="mt-6 max-w-xl text-lead text-fg-300/80" data-reveal data-reveal-delay="0.16">
              Every audit closes with a structured report: one executive score,
              section-by-section breakdowns, evidence behind every finding, and
              actions ranked by priority with owners and timelines.
            </p>

            <ul className="mt-10 space-y-0">
              {reportDeliverables.map((item, i) => (
                <li
                  key={item.title}
                  className="group flex items-start gap-4 border-b border-fg-50/10 py-4"
                  data-reveal
                  data-reveal-delay={String(0.18 + i * 0.05)}
                >
                  <span className="mt-0.5 font-mono text-[11px] text-accent/80 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-fg-50">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-fg-300/70">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10" data-reveal data-reveal-delay="0.5">
              <Link
                href="/book-an-audit"
                className="group inline-flex items-center gap-3 border-b border-brand-400/40 pb-1 text-sm font-medium text-fg-50 transition-colors duration-300 hover:border-brand-300 hover:text-accent"
              >
                Get a sample report structure
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ReportMockup() {
  return (
    <div className="relative rounded-2xl border border-fg-50/10 glass p-6 md:p-8 shadow-[0_40px_80px_-40px_rgba(16,64,44,0.28)]">
      {/* Report header */}
      <div className="flex items-center justify-between border-b border-fg-50/10 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-500/10 text-accent">
            <FileText className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-300/60">
              Audit Report
            </p>
            <p className="text-sm font-medium text-fg-50">
              Grand Meridien — Mumbai
            </p>
          </div>
        </div>
        <p className="font-mono text-[10px] text-fg-300/60">
          REF AE-2026-004821
        </p>
      </div>

      {/* Executive score */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 border-b border-fg-50/10 py-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-300/60">
            Executive Score
          </p>
          <div className="mt-2 flex items-end gap-3">
            <p className="font-display text-5xl leading-none text-fg-50">
              87<span className="text-2xl text-fg-300/60">%</span>
            </p>
            <p className="mb-1 inline-flex items-center gap-1 font-mono text-[11px] text-aqua-600">
              <Check className="h-3 w-3" strokeWidth={2.5} />
              +6 vs last cycle
            </p>
          </div>
        </div>
        <div className="flex h-16 items-end gap-1.5" aria-hidden="true">
          {[52, 61, 74, 68, 81, 87].map((h, i) => (
            <div
              key={i}
              className={`w-2 rounded-t-sm ${
                i === 5 ? "bg-brand-600" : "bg-base-700"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Section scores */}
      <div className="space-y-4 border-b border-fg-50/10 py-6">
        {[
          { section: "Front Office", score: 92, weight: "22%" },
          { section: "Housekeeping", score: 88, weight: "20%" },
          { section: "F&B Service", score: 81, weight: "18%" },
          { section: "Brand Standards", score: 85, weight: "15%" },
        ].map((row) => (
          <div key={row.section} className="flex items-center gap-4">
            <p className="w-32 text-[13px] text-fg-300/85">{row.section}</p>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-base-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-300"
                style={{ width: `${row.score}%` }}
              />
            </div>
            <p className="w-8 text-right font-mono text-xs tabular-nums text-fg-50">
              {row.score}
            </p>
            <p className="w-10 text-right font-mono text-[10px] text-fg-300/60">
              {row.weight}
            </p>
          </div>
        ))}
      </div>

      {/* Priority actions */}
      <div className="pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-300/60">
          Priority Actions
        </p>
        <ul className="mt-3 space-y-2.5">
          {[
            { level: "CRITICAL", text: "Room 412 — amenity kit incomplete", owner: "HK · Asst Mgr" },
            { level: "HIGH", text: "Check-in wait 14 min at 3 PM peak", owner: "FO · Duty Mgr" },
            { level: "MEDIUM", text: "Breakfast buffet restock lag 09:15+", owner: "F&B · Supervisor" },
          ].map((a) => (
            <li
              key={a.text}
              className="flex items-center justify-between gap-3 rounded-lg border border-fg-50/10 bg-base-950/60 px-3.5 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] ${
                    a.level === "CRITICAL"
                      ? "bg-critical/15 text-critical"
                      : a.level === "HIGH"
                      ? "bg-amber-500/15 text-amber-700"
                      : "bg-aqua-500/15 text-aqua-600"
                  }`}
                >
                  {a.level}
                </span>
                <p className="text-[12.5px] text-fg-300/85">{a.text}</p>
              </div>
              <p className="shrink-0 font-mono text-[10px] text-fg-300/60">
                {a.owner}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
