"use client";

import Link from "next/link";
import { ArrowUpRight, Linkedin, Instagram, Twitter, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { navigation } from "@/data/navigation";
import { useScrollReveal } from "@/lib/animations/gsap";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const revealRef = useScrollReveal<HTMLElement>();

  return (
    <footer ref={revealRef} className="relative border-t border-bone-100/8 bg-ink-900">
      {/* Final CTA */}
      <div className="container-site relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-60" aria-hidden="true" />
        <div className="relative flex flex-col items-start gap-8 md:items-center md:text-center">
          <p className="eyebrow" data-reveal>Ready when you are</p>
          <h2
            className="max-w-4xl text-balance text-display-md font-semibold text-bone-100 md:text-display-lg"
            data-reveal
          >
            SEE THE EXPERIENCE. <span className="text-gradient-brass">IMPROVE THE STANDARD.</span>
          </h2>
          <p className="max-w-xl text-lead text-bone-400" data-reveal>
            One location or 1,000 — start by telling us what you want to measure.
          </p>
          <div className="flex flex-wrap gap-4" data-reveal>
            <Link
              href="/book-an-audit"
              className="group inline-flex items-center gap-2 rounded-full bg-brass-400 px-8 py-4 text-sm font-semibold tracking-wide text-forest transition-all duration-500 hover:bg-brass-300"
            >
              Book an Audit
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/join-as-auditor"
              className="inline-flex items-center gap-2 rounded-full border border-bone-100/20 px-8 py-4 text-sm font-semibold tracking-wide text-bone-100 transition-all duration-500 hover:border-brass-300/60 hover:text-brass-200"
            >
              Join the Auditor Network
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer body */}
      <div className="border-t border-bone-100/8">
        <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bone-400">
              Mystery audits, SOP audits and multi-location programs — an independent service
              intelligence platform by {siteConfig.company}.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/hospitalityminds" },
                { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/hospitalityminds" },
                { icon: Twitter, label: "X / Twitter", href: "https://x.com/hospitalitymind" },
                { icon: Mail, label: "Email", href: `mailto:${siteConfig.email}` }
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-bone-100/15 text-bone-400 transition-all duration-300 hover:border-brass-300/60 hover:text-brass-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="space-y-3">
              {navigation.footer.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-bone-400 transition-colors hover:text-brass-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <p className="eyebrow mb-5">Legal</p>
            <ul className="space-y-3">
              {navigation.footer.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-bone-400 transition-colors hover:text-brass-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-5">Contact</p>
            <ul className="space-y-4 text-sm text-bone-400">
              <li className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 shrink-0 text-brass-400" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-brass-300">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brass-400" aria-hidden="true" />
                {siteConfig.baseCity}
              </li>
            </ul>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-500">
              Hotels • Restaurants • Hospitals
              <br />
              Malls • Cinemas • Salons
            </p>
          </div>
        </div>

        <div className="border-t border-bone-100/8">
          <div className="container-site flex flex-col items-start justify-between gap-3 py-6 text-xs text-bone-500 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
            </p>
            <p className="font-mono uppercase tracking-[0.18em]">
              See → Measure → Understand → Improve
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
