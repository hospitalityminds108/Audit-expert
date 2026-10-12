"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { gsap } from "@/lib/animations/gsap";
import { navigation } from "@/data/navigation";
import { getIndustriesNav } from "@/data/industries";
import { planCategoryTabs } from "@/data/audit-plans";
import { getAuditTypesNav } from "@/data/audit-types";

interface Props {
  open: boolean;
  onClose: () => void;
}

const industriesNav = getIndustriesNav();
const auditTypes = getAuditTypesNav();

export default function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const scrim = scrimRef.current;
    if (!panel || !scrim) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(panel, { x: open ? 0 : "100%", pointerEvents: open ? "auto" : "none" });
      gsap.set(scrim, { opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" });
      if (open) {
        gsap.set(panel.querySelectorAll("[data-mobile-item]"), { opacity: 1, y: 0 });
      }
      return;
    }

    if (open) {
      document.body.style.overflow = "hidden";
      const items = panel.querySelectorAll("[data-mobile-item]");
      const tl = gsap.timeline();
      tl.set([panel, scrim], { pointerEvents: "auto" })
        .to(scrim, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
        .to(panel, { x: 0, duration: 0.6, ease: "power4.out" }, 0.05)
        .fromTo(
          items,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05 },
          0.22
        );
    } else {
      const tl = gsap.timeline();
      tl.to(panel, { x: "100%", duration: 0.45, ease: "power3.in" }, 0)
        .to(scrim, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.1)
        .set([panel, scrim], { pointerEvents: "none" })
        .add(() => {
          document.body.style.overflow = "";
        });
    }
  }, [open]);

  // Escape key close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[95] lg:hidden"
      aria-hidden={!open}
      // closed menu: keep its links out of the tab order
      {...(open ? {} : ({ inert: "" } as object))}
    >
      <div
        ref={scrimRef}
        className="absolute inset-0 bg-base-800/70 opacity-0 backdrop-blur-sm"
        style={{ pointerEvents: "none" }}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="glass-strong absolute inset-y-0 right-0 flex w-full max-w-md translate-x-full flex-col overflow-y-auto border-l border-fg-50/10"
        style={{ pointerEvents: "none" }}
      >
        <div className="flex items-center justify-between border-b border-fg-50/10 px-7 py-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-fg-50/15 bg-white/70 text-fg-100 transition-colors hover:border-brand-500/60"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-7 py-8" aria-label="Mobile">
          <ul>
            <li data-mobile-item>
              <p className="eyebrow mb-2 mt-4">Industries</p>
            </li>
            {industriesNav.map((ind) => (
              <li key={ind.slug} data-mobile-item>
                <Link
                  href={`/industries/${ind.slug}`}
                  className="flex items-center justify-between border-b border-fg-50/10 py-3.5 font-display text-xl font-medium text-fg-100"
                >
                  <span>
                    <span className="mr-3 font-mono text-xs text-accent">{ind.number}</span>
                    {ind.title}
                  </span>
                  <ArrowUpRight size={18} className="text-fg-400" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-8">
            <li data-mobile-item>
              <p className="eyebrow mb-2">Audit Type</p>
            </li>
            {auditTypes.map((type) => (
              <li key={type.format} data-mobile-item>
                <Link
                  href={`/audit-plans?format=${type.format}`}
                  className="flex items-center justify-between border-b border-fg-50/10 py-3.5 font-display text-xl font-medium text-fg-100"
                >
                  <span>
                    {type.label}
                    <span className="ml-3 font-mono text-xs text-fg-400">{type.count} plans</span>
                  </span>
                  <ArrowUpRight size={18} className="text-fg-400" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-8">
            <li data-mobile-item>
              <p className="eyebrow mb-2">Plans &amp; Pricing</p>
            </li>
            {planCategoryTabs.map((cat) => (
              <li key={cat.id} data-mobile-item>
                <Link
                  href={`/audit-plans?category=${cat.id}`}
                  className="flex items-center justify-between border-b border-fg-50/10 py-3.5 font-display text-xl font-medium text-fg-100"
                >
                  {cat.label}
                  <ArrowUpRight size={18} className="text-fg-400" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-8">
            {[
              { label: "How It Works", href: "/how-it-works" },
              { label: "About", href: "/about" },
              { label: "Join as Auditor", href: "/join-as-auditor" },
              { label: "Contact", href: "/contact" }
            ].map((item) => (
              <li key={item.href} data-mobile-item>
                <Link
                  href={item.href}
                  className="block border-b border-fg-50/10 py-3.5 font-display text-xl font-medium text-fg-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div data-mobile-item className="mt-auto pb-10 pt-10">
            <Link
              href="/book-an-audit"
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold tracking-wide"
            >
              {navigation.cta.label} <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
