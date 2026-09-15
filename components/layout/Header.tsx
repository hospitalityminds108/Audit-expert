"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { gsap } from "@/lib/animations/gsap";
import { navigation } from "@/data/navigation";
import { getIndustriesNav } from "@/data/industries";
import { planCategoryTabs } from "@/data/audit-plans";
import MobileMenu from "./MobileMenu";
import Logo from "@/components/ui/Logo";

const industriesNav = getIndustriesNav();

interface MegaMenuState {
  open: boolean;
  which: "industries" | "plans" | null;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MegaMenuState>({ open: false, which: null });
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset menus on route change
  useEffect(() => {
    setMenu({ open: false, which: null });
    setMobileOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    const lenis = window.__lenis;
    if (mobileOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  // Animate mega menu
  useEffect(() => {
    const el = megaRef.current;
    if (!el) return;
    if (menu.open) {
      gsap.set(el, { display: "block" });
      gsap.fromTo(
        el,
        { opacity: 0, y: 8, clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power3.out" }
      );
      const items = el.querySelectorAll("[data-mega-item]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.045, delay: 0.08 }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        y: 6,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        }
      });
    }
  }, [menu]);

  const openMega = (which: "industries" | "plans") => {
    setMenu((m) => (m.open && m.which === which ? { open: false, which: null } : { open: true, which }));
  };

  const isCheckout = pathname.startsWith("/checkout") || pathname.startsWith("/payment") || pathname.startsWith("/booking/confirmation");

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ease-premium ${
          scrolled
            ? "border-b border-warmgray/80 bg-white/90 backdrop-blur-xl"
            : "border-b border-warmgray/50 bg-white/80 backdrop-blur-md"
        }`}
        onMouseLeave={() => setMenu({ open: false, which: null })}
      >
        <div
          className={`container-site flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-[64px]" : "h-[88px]"
          }`}
        >
          <Logo compact={scrolled} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navigation.primary.map((item) => {
              const children = "children" in item ? item.children : null;
              if (children) {
                const open = menu.open && menu.which === children;
                return (
                  <div key={item.label} className="relative">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-haspopup="true"
                      onClick={() => openMega(children as "industries" | "plans")}
                      className={`group flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                        open ? "text-brass-400" : "text-charcoal hover:text-brass-400"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${open ? "rotate-180 text-brass-400" : "group-hover:rotate-180 group-hover:text-brass-400"}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    pathname.startsWith(item.href)
                      ? "text-brass-400"
                      : "text-charcoal hover:text-brass-400"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/book-an-audit"
              className="group relative hidden items-center gap-2 overflow-hidden rounded-full bg-brass-400 px-6 py-2.5 text-[13px] font-semibold tracking-wide text-forest transition-all duration-500 hover:bg-brass-300 sm:inline-flex"
            >
              <span className="relative z-10">{navigation.cta.label}</span>
              <ArrowUpRight
                size={15}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/20 text-forest transition-colors hover:border-brass-400 lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        <div
          ref={megaRef}
          data-mega
          className="absolute inset-x-0 top-full hidden border-b border-bone-100/8 bg-ink-950/95 backdrop-blur-2xl"
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
                          className="group flex items-start gap-4 rounded-xl px-4 py-3.5 transition-colors duration-300 hover:bg-bone-100/5"
                        >
                          <span className="font-mono text-[11px] font-medium text-brass-400/80 transition-colors group-hover:text-brass-300">
                            {ind.number}
                          </span>
                          <span>
                            <span className="flex items-center gap-1.5 font-display text-lg font-medium text-bone-100 transition-colors group-hover:text-brass-200">
                              {ind.title}
                              <ArrowUpRight
                                size={14}
                                className="opacity-0 transition-all duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="mt-1 block max-w-md text-[13px] leading-relaxed text-bone-500">
                              {ind.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden border-l border-bone-100/8 pl-10 lg:block">
                  <p className="eyebrow mb-4">Not sure which fits?</p>
                  <p className="mb-5 text-sm leading-relaxed text-bone-400">
                    Tell us what you want to measure and we&apos;ll build the right checklist, auditor
                    profile and reporting structure around your industry.
                  </p>
                  <Link
                    href="/book-an-audit"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brass-300 hover:text-brass-200"
                  >
                    Book an Audit <ArrowUpRight size={14} />
                  </Link>
                </div>
              </>
            ) : menu.which === "plans" ? (
              <>
                <div>
                  <p className="eyebrow mb-6">Audit plans by industry</p>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {planCategoryTabs.map((cat) => {
                      const count = 3;
                      return (
                        <li key={cat.id} data-mega-item>
                          <Link
                            href={`/audit-plans?category=${cat.id}`}
                            className="group flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors duration-300 hover:bg-bone-100/5"
                          >
                            <span className="font-display text-lg font-medium text-bone-100 transition-colors group-hover:text-brass-200">
                              {cat.label}
                            </span>
                            <span className="font-mono text-[11px] text-bone-500">{count} plans</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="hidden border-l border-bone-100/8 pl-10 lg:block">
                  <p className="eyebrow mb-4">Brands with many locations</p>
                  <p className="mb-5 text-sm leading-relaxed text-bone-400">
                    Build a recurring audit calendar across cities, branches, outlets or properties
                    with the AuditExpert Brand Standards Program.
                  </p>
                  <Link
                    href="/book-an-audit?program=brand-standards"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brass-300 hover:text-brass-200"
                  >
                    Design a Program <ArrowUpRight size={14} />
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
