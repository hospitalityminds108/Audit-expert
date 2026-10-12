import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import { ArrowRight, CalendarDays, CreditCard, MapPin, ShieldCheck, Zap } from "lucide-react";
import BookAuditForm from "@/components/forms/BookAuditForm";

export const metadata: Metadata = {
  title: "Book an Audit",
  description:
    "Book a mystery audit or SOP audit for hotels, restaurants, hospitals, malls, cinemas and salons. Pick a plan and request a callback — we scope the audit with you and confirm the date.",
};

const PATHS = [
  {
    icon: CreditCard,
    title: "Start from a plan",
    body: "Pick your plan, set locations and add-ons, and see a transparent GST-inclusive estimate before you send the request.",
    cta: "Browse plans & pricing",
    href: "/audit-plans",
    primary: true,
  },
  {
    icon: CalendarDays,
    title: "Book on a callback",
    body: "Tell us what you need and our team calls you within one working day to scope the audit and lock the schedule.",
    cta: "Use the form below",
    href: "#callback",
    primary: false,
  },
];

export default function BookAnAuditPage() {
  return (
    <div className="">
      {/* ── Hero ── */}
      <div className="container-site pb-16 pt-32 md:pt-40">
        <p className="eyebrow text-accent">
          <span className="eyebrow-rule" aria-hidden="true" />
          BOOK AN AUDIT
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-fg-50 md:text-6xl">
          Two ways to get on the calendar.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-300/80">
          Start from a published plan and build your estimate — or tell us
          what you need and we scope the audit together on a call. Both paths
          end with a confirmed date, an assigned auditor and a scored report.
        </p>

        <PageBanner priority className="mt-12" images={[{ src: "/images/industries/hotels-resorts.jpg", alt: "Hotel lobby at dusk", caption: "Hotels & resorts" }, { src: "/images/industries/restaurants-cafes.jpg", alt: "Restaurant service in progress", caption: "Restaurants & cafés" }, { src: "/images/industries/malls-retail.jpg", alt: "Shopping mall atrium", caption: "Malls & retail" }]} />

        {/* ── Two paths ── */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {PATHS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`rounded-2xl border p-7 ${
                  p.primary
                    ? "border-brand-400/40 bg-brand-400/[0.07]"
                    : "border-fg-50/10 bg-white/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-fg-50/15 bg-base-950">
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-xl text-fg-50">{p.title}</h2>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-fg-300/80">{p.body}</p>
                <Link
                  href={p.href}
                  className={`mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    p.primary
                      ? "text-accent hover:text-accent"
                      : "text-fg-200 hover:text-fg-50"
                  }`}
                >
                  {p.cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-fg-50/10 glass p-6 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, label: "No payment taken online — the quote is confirmed with you first" },
            { icon: Zap, label: "A reply within one working day" },
            { icon: MapPin, label: "Pan-India auditor network, 6 industries" },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <p key={f.label} className="flex items-start gap-2.5 text-xs leading-relaxed text-fg-300/70">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-aqua-600" aria-hidden="true" />
                {f.label}
              </p>
            );
          })}
        </div>
      </div>

      {/* ── Callback form ── */}
      <div id="callback" className="container-site scroll-mt-24 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.7fr]">
          <div>
            <p className="eyebrow text-accent">
              <span className="eyebrow-rule" aria-hidden="true" />
              CALLBACK
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-[-0.01em] text-fg-50">
              Request a callback
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-300/80">
              Share a few details and we will call to scope your audit —
              journey legs, locations, evidence needs, timeline and budget.
              If you already know the plan, select it and we come prepared.
            </p>
            <p className="mt-6 rounded-xl border border-fg-50/10 glass p-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-fg-300/60">
              3+ locations unlock 5% volume rate · 5+ unlock 10% · coupon
              FIRSTAUDIT10 saves 10% on your first audit
            </p>
          </div>
          <div className="rounded-2xl border border-fg-50/10 glass p-7">
            <BookAuditForm />
          </div>
        </div>
      </div>
    </div>
  );
}
