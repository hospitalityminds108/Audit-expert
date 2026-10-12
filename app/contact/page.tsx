import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/ui/PageBanner";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to AuditExpert about mystery audits, SOP audits, multi-location programs or joining the auditor network. We reply within one working day.",
};

export default function ContactPage() {
  return (
    <div className="">
      <div className="container-site pb-24 pt-32 md:pt-40">
        {/* ── Hero ── */}
        <p className="eyebrow text-accent">
          <span className="eyebrow-rule" aria-hidden="true" />
          CONTACT
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.015em] text-fg-50 md:text-6xl">
          Let&apos;s talk about what your customers actually experience.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-300/80">
          Audit inquiry, multi-location program, custom checklist or joining
          the auditor network — send a message and we reply within one
          working day.
        </p>

        <PageBanner priority className="mt-12" images={[{ src: "/images/industries/hospitals-clinics.jpg", alt: "Hospital reception desk", caption: "Hospitals & clinics" }, { src: "/images/sections/city.jpg", alt: "City skyline at dusk", caption: "Mumbai, India" }]} />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          {/* ── Contact channels ── */}
          <div className="space-y-4">
            <a
              href={`mailto:${siteConfig.email}`}
              className="group flex items-center gap-4 rounded-2xl border border-fg-50/10 glass p-5 transition-colors hover:border-brand-400/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fg-50/15 bg-base-950">
                <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">
                  Email
                </span>
                <span className="mt-0.5 block text-sm text-fg-50">{siteConfig.email}</span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-fg-300/60 transition-colors group-hover:text-accent" aria-hidden="true" />
            </a>
            <a
              href="tel:+919820000000"
              className="group flex items-center gap-4 rounded-2xl border border-fg-50/10 glass p-5 transition-colors hover:border-brand-400/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fg-50/15 bg-base-950">
                <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">
                  Phone / WhatsApp
                </span>
                <span className="mt-0.5 block text-sm text-fg-50">{siteConfig.phone}</span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-fg-300/60 transition-colors group-hover:text-accent" aria-hidden="true" />
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-fg-50/10 glass p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fg-50/15 bg-base-950">
                <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">
                  Base
                </span>
                <span className="mt-0.5 block text-sm text-fg-50">{siteConfig.baseCity}</span>
              </span>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-fg-50/10 glass p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fg-50/15 bg-base-950">
                <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">
                  Response time
                </span>
                <span className="mt-0.5 block text-sm text-fg-50">Within 1 working day</span>
              </span>
            </div>
            <div className="rounded-2xl border border-brand-400/30 bg-brand-400/[0.07] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent/80">
                Already know the plan?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg-300/80">
                Pick a plan, build your estimate and send the request in a minute.
              </p>
              <Link
                href="/audit-plans"
                className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent hover:text-accent"
              >
                Browse plans &amp; pricing
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="rounded-2xl border border-fg-50/10 glass p-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
