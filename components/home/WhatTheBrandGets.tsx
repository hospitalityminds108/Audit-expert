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
      className="relative overflow-hidden bg-ink-950 py-24 md:py-32 lg:py-40"
    >
      {/* Ambient */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[720px] rounded-full bg-brass-500/[0.06] blur-[130px]"
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
            <p className="eyebrow text-brass-400" data-reveal>
              <span className="eyebrow-rule" aria-hidden="true" />
              SECTION 06 — WHAT THE BRAND GETS
            </p>
            <h2
              className="mt-6 font-display text-display-xl md:text-display-2xl text-bone-50 leading-[1.02] tracking-[-0.02em]"
              data-reveal
              data-reveal-delay="0.08"
            >
              A report built for decisions, not decoration.
            </h2>
            <p className="mt-6 max-w-xl text-lead text-bone-300/80" data-reveal data-reveal-delay="0.16">
              Every audit closes with a structured report: one executive score,
              section-by-section breakdowns, evidence behind every finding, and
              actions ranked by priority with owners and timelines.
            </p>

            <ul className="mt-10 space-y-0">
              {reportDeliverables.map((item, i) => (
                <li
                  key={item.title}
                  className="group flex items-start gap-4 border-b border-ink-800/70 py-4"
                  data-reveal
                  data-reveal-delay={String(0.18 + i * 0.05)}
                >
                  <span className="mt-0.5 font-mono text-[11px] text-brass-400/80 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-bone-50">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-bone-300/60">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10" data-reveal data-reveal-delay="0.5">
              <Link
                href="/book-an-audit"
                data-cursor-label="BOOK"
                className="group inline-flex items-center gap-3 border-b border-brass-400/40 pb-1 text-sm font-medium text-bone-50 transition-colors duration-300 hover:border-brass-300 hover:text-brass-300"
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
    <div className="relative rounded-2xl border border-ink-800 bg-ink-900/80 p-6 md:p-8 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
      {/* Report header */}
      <div className="flex items-center justify-between border-b border-ink-800 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brass-400/30 bg-brass-500/10 text-brass-300">
            <FileText className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-300/50">
              Audit Report
            </p>
            <p className="text-sm font-medium text-bone-50">
              Grand Meridien — Mumbai
            </p>
          </div>
        </div>
        <p className="font-mono text-[10px] text-bone-300/40">
          REF AE-2026-004821
        </p>
      </div>

      {/* Executive score */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 border-b border-ink-800 py-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-300/50">
            Executive Score
          </p>
          <div className="mt-2 flex items-end gap-3">
            <p className="font-display text-5xl leading-none text-bone-50">
              87<span className="text-2xl text-bone-300/50">%</span>
            </p>
            <p className="mb-1 inline-flex items-center gap-1 font-mono text-[11px] text-sage-400">
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
                i === 5 ? "bg-brass-400" : "bg-ink-700"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Section scores */}
      <div className="space-y-4 border-b border-ink-800 py-6">
        {[
          { section: "Front Office", score: 92, weight: "22%" },
          { section: "Housekeeping", score: 88, weight: "20%" },
          { section: "F&B Service", score: 81, weight: "18%" },
          { section: "Brand Standards", score: 85, weight: "15%" },
        ].map((row) => (
          <div key={row.section} className="flex items-center gap-4">
            <p className="w-32 text-[13px] text-bone-300/85">{row.section}</p>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brass-600 to-brass-300"
                style={{ width: `${row.score}%` }}
              />
            </div>
            <p className="w-8 text-right font-mono text-xs tabular-nums text-bone-50">
              {row.score}
            </p>
            <p className="w-10 text-right font-mono text-[10px] text-bone-300/40">
              {row.weight}
            </p>
          </div>
        ))}
      </div>

      {/* Priority actions */}
      <div className="pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-300/50">
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
              className="flex items-center justify-between gap-3 rounded-lg border border-ink-800 bg-ink-950/60 px-3.5 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] ${
                    a.level === "CRITICAL"
                      ? "bg-critical/15 text-critical"
                      : a.level === "HIGH"
                      ? "bg-brass-500/15 text-brass-300"
                      : "bg-sage-500/15 text-sage-300"
                  }`}
                >
                  {a.level}
                </span>
                <p className="text-[12.5px] text-bone-300/85">{a.text}</p>
              </div>
              <p className="shrink-0 font-mono text-[10px] text-bone-300/40">
                {a.owner}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
