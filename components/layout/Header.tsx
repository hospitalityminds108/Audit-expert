"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, UserRound } from "lucide-react";
import { gsap } from "@/lib/animations/gsap";
import { navigation } from "@/data/navigation";
import { getIndustriesNav } from "@/data/industries";
import { auditPlans, planCategoryTabs } from "@/data/audit-plans";
import { useAuth } from "@/components/auth/AuthProvider";
import MobileMenu from "./MobileMenu";
import Logo from "@/components/ui/Logo";

const industriesNav = getIndustriesNav();

type MegaKey = "industries" | "plans";

interface MegaMenuState {
  open: boolean;
  which: MegaKey | null;
}

const CLOSED: MegaMenuState = { open: false, which: null };

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MegaMenuState>(CLOSED);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, ready } = useAuth();

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset menus on route change
  useEffect(() => {
    setMenu(CLOSED);
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the mega menu
  useEffect(() => {
    if (!menu.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(CLOSED);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu.open]);

  // Animate mega menu
  useEffect(() => {
    const el = megaRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf(el);
    if (menu.open) {
      gsap.set(el, { display: "block" });
      gsap.fromTo(
        el,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: reduced ? 0 : 0.45, ease: "power3.out" }
      );
      if (!reduced) {
        gsap.fromTo(
          el.querySelectorAll("[data-mega-item]"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.04, delay: 0.06 }
        );
      }
    } else {
      gsap.to(el, {
        opacity: 0,
        y: -6,
        duration: reduced ? 0 : 0.22,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        }
      });
    }
  }, [menu]);

  const toggleMega = (which: MegaKey) => {
    setMenu((m) => (m.open && m.which === which ? CLOSED : { open: true, which }));
  };

  const linkCls = (active: boolean) =>
    `rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
      active ? "bg-brand-400/15 text-accent" : "text-fg-200 hover:text-accent"
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] border-b transition-all duration-500 ease-premium ${
          scrolled || menu.open
            ? "border-fg-50/10 bg-white/90 shadow-[0_12px_40px_-24px_rgba(16,64,44,0.45)] backdrop-blur-xl"
            : "border-transparent bg-white/85 backdrop-blur-xl"
        }`}
        onMouseLeave={() => setMenu(CLOSED)}
      >
        <div
          className={`container-site flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-[64px]" : "h-[76px]"
          }`}
        >
          <Logo compact={scrolled} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navigation.primary.map((item) => {
              const children = "children" in item ? (item.children as MegaKey) : null;
              const current = pathname.startsWith(item.href);
              if (children) {
                const open = menu.open && menu.which === children;
                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    aria-controls="mega-menu"
                    onClick={() => toggleMega(children)}
                    className={`group flex items-center gap-1.5 ${linkCls(open || current)}`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={linkCls(current)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Account — hidden until the session check returns to avoid a flicker */}
            <div className={`hidden transition-opacity duration-300 md:block ${ready ? "opacity-100" : "opacity-0"}`}>
              {user ? (
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 rounded-full border border-fg-50/15 bg-white/70 py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-fg-100 transition-colors duration-300 hover:border-brand-500/60 hover:text-accent"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-mono text-[11px] font-semibold uppercase text-on-brand">
                    {user.name.trim().charAt(0) || <UserRound size={13} />}
                  </span>
                  {user.name.split(" ")[0]}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-[13px] font-medium tracking-wide text-fg-200 transition-colors duration-300 hover:text-accent"
                >
                  Sign in
                </Link>
              )}
            </div>

            <Link
              href={navigation.cta.href}
              className="btn-primary group hidden items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold tracking-wide sm:inline-flex"
            >
              {navigation.cta.label}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-fg-50/20 bg-white/60 text-fg-50 transition-colors hover:border-brand-500 lg:hidden"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden="true">
                <span className="block h-[1.5px] w-5 bg-current" />
                <span className="block h-[1.5px] w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        <div
          ref={megaRef}
          id="mega-menu"
          className="glass-strong absolute inset-x-0 top-full border-b border-fg-50/10"
          style={{ display: "none" }}
        >
          <div className="container-site grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr]">
            {menu.which === "industries" ? (
              <>
                <div>
                  <p className="eyebrow mb-6">Industries we audit</p>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {industriesNav.map((ind) => (
                      <li key={ind.slug} data-mega-item>
                        <Link
                          href={`/industries/${ind.slug}`}
                          className="group flex items-start gap-4 rounded-xl px-4 py-3.5 transition-colors duration-300 hover:bg-brand-400/10"
                        >
                          <span className="font-mono text-[11px] font-medium text-accent">{ind.number}</span>
                          <span>
                            <span className="flex items-center gap-1.5 font-display text-lg font-medium text-fg-50 transition-colors group-hover:text-accent">
                              {ind.title}
                              <ArrowUpRight
                                size={14}
                                className="opacity-0 transition-all duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="mt-1 block max-w-md text-[13px] leading-relaxed text-fg-400">
                              {ind.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden border-l border-fg-50/10 pl-10 lg:block">
                  <p className="eyebrow mb-4">Not sure which fits?</p>
                  <p className="mb-5 text-sm leading-relaxed text-fg-300">
                    Tell us what you want to measure and we&apos;ll build the right checklist, auditor
                    profile and reporting structure around your industry.
                  </p>
                  <Link
                    href="/book-an-audit"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    Book an Audit <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </>
            ) : menu.which === "plans" ? (
              <>
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <p className="eyebrow">Plans &amp; pricing by industry</p>
                    <Link
                      href="/audit-plans"
                      onClick={() => setMenu(CLOSED)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      All {auditPlans.length} plans <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {planCategoryTabs.map((cat) => {
                      const count = auditPlans.filter((p) => p.category === cat.id).length;
                      return (
                        <li key={cat.id} data-mega-item>
                          <Link
                            href={`/audit-plans?category=${cat.id}`}
                            onClick={() => setMenu(CLOSED)}
                            className="group flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors duration-300 hover:bg-brand-400/10"
                          >
                            <span className="font-display text-lg font-medium text-fg-50 transition-colors group-hover:text-accent">
                              {cat.label}
                            </span>
                            <span className="font-mono text-[11px] text-fg-400">{count} plans</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="hidden border-l border-fg-50/10 pl-10 lg:block">
                  <p className="eyebrow mb-4">Brands with many locations</p>
                  <p className="mb-5 text-sm leading-relaxed text-fg-300">
                    Build a recurring audit calendar across cities, branches, outlets or properties
                    with the AuditExpert Brand Standards Program.
                  </p>
                  <Link
                    href="/book-an-audit?program=brand-standards"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    Design a Program <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
