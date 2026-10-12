"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Check, Minus, Plus, ShieldCheck, X } from "lucide-react";
import { addOns, formatPrice, type AuditPlan } from "@/data/audit-plans";
import { calculatePrice, formatInr } from "@/lib/pricing/engine";

const MAX_LOCATIONS = 20;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * PlanSelectModal — the "selected plan" popup.
 * Shows what the plan covers, lets the buyer set locations and add-ons with a
 * live estimate, then hands the configuration to the callback request form.
 * The figure is an estimate; the final quote is confirmed on the call.
 */
export default function PlanSelectModal({ plan, onClose }: { plan: AuditPlan; onClose: () => void }) {
  const [locations, setLocations] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const openedOn = useRef(pathname);

  // Close when the route changes underneath the popup
  useEffect(() => {
    if (pathname !== openedOn.current) onClose();
  }, [pathname, onClose]);

  // Lock page scroll, trap focus, Escape to close, restore focus on exit
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [onClose]);

  const price = useMemo(
    () => calculatePrice({ planSlug: plan.slug, locations, addOnIds: selected }),
    [plan.slug, locations, selected]
  );

  const toggle = (id: string) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const requestHref = useMemo(() => {
    const params = new URLSearchParams({ plan: plan.slug, locations: String(locations) });
    if (selected.length) params.set("addons", selected.join(","));
    return `/book-an-audit?${params.toString()}#callback`;
  }, [plan.slug, locations, selected]);

  const isMystery = plan.format === "mystery";

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-base-800/70 backdrop-blur-md"
        style={{ animation: "scrim-in 0.35s ease-out both" }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-modal-title"
        className="glass-strong relative flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-fg-50/10 sm:rounded-3xl"
        style={{ animation: "dialog-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-fg-50/10 px-6 py-5 sm:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-400/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                <Check className="h-3 w-3" aria-hidden="true" />
                Plan selected
              </span>
              <span
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                  isMystery ? "bg-brand-400/15 text-accent" : "bg-aqua-500/15 text-aqua-600"
                }`}
              >
                {isMystery ? "Mystery" : "SOP / Revealed"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-400">
                {plan.categoryLabel}
              </span>
            </div>
            <h2 id="plan-modal-title" className="mt-3 font-display text-2xl leading-tight text-fg-50 sm:text-3xl">
              {plan.name}
            </h2>
            <p className="mt-1.5 text-sm text-fg-300">{plan.tagline}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-fg-50/15 bg-white/70 text-fg-200 transition-colors hover:border-brand-500/60 hover:text-accent"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="grid flex-1 gap-0 overflow-y-auto md:grid-cols-[1.1fr_1fr]">
          {/* What you get */}
          <div className="border-b border-fg-50/10 px-6 py-6 sm:px-8 md:border-b-0 md:border-r">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-400">What the audit covers</p>
            <ul className="mt-4 space-y-2.5">
              {plan.scope.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-fg-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-aqua-600" strokeWidth={2} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-400">You receive</p>
            <ul className="mt-4 space-y-2.5">
              {plan.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-fg-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-7 rounded-xl border border-fg-50/10 bg-white/60 p-4 text-xs leading-relaxed text-fg-300">
              <span className="font-semibold text-fg-50">Best for:</span> {plan.bestFor}. Published range{" "}
              {formatPrice(plan.priceMin, plan.priceMax)} / {plan.priceUnit}.
            </p>
          </div>

          {/* Configure */}
          <div className="px-6 py-6 sm:px-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-400">Configure</p>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-fg-50/10 bg-white/60 p-4">
              <div>
                <p className="text-sm font-medium text-fg-50">Locations</p>
                <p className="mt-0.5 text-xs text-fg-400">3+ save 5% · 5+ save 10%</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setLocations((l) => Math.max(1, l - 1))}
                  disabled={locations <= 1}
                  aria-label="Remove a location"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-fg-50/15 bg-white text-fg-200 transition-colors hover:border-brand-500/60 disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="w-7 text-center font-mono text-lg tabular-nums text-fg-50" aria-live="polite">
                  {locations}
                </span>
                <button
                  type="button"
                  onClick={() => setLocations((l) => Math.min(MAX_LOCATIONS, l + 1))}
                  disabled={locations >= MAX_LOCATIONS}
                  aria-label="Add a location"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-fg-50/15 bg-white text-fg-200 transition-colors hover:border-brand-500/60 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {addOns.map((a) => {
                const on = selected.includes(a.id);
                const perExtra = a.id === "additional-location";
                const unavailable = perExtra && locations < 2;
                return (
                  <label
                    key={a.id}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 transition-colors duration-300 ${
                      unavailable
                        ? "cursor-not-allowed border-fg-50/10 opacity-50"
                        : on
                          ? "cursor-pointer border-brand-500/60 bg-brand-400/15"
                          : "cursor-pointer border-fg-50/10 bg-white/50 hover:border-fg-50/25"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={on && !unavailable}
                        disabled={unavailable}
                        onChange={() => toggle(a.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
                      />
                      <span>
                        <span className="block text-sm font-medium text-fg-50">{a.label}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-fg-400">
                          {unavailable ? "Available with 2 or more locations" : a.description}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-fg-200">
                      {formatInr(a.price)}
                      {perExtra ? " / extra" : ""}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Estimate */}
            <dl className="mt-5 space-y-2 border-t border-fg-50/10 pt-4 text-sm">
              {price.lines.map((line) => (
                <div key={line.id} className="flex items-start justify-between gap-3">
                  <dt className="text-fg-300">
                    {line.label}
                    {line.id === "base" && line.detail && (
                      <span className="block text-[11px] text-fg-400">{line.detail}</span>
                    )}
                  </dt>
                  <dd className="shrink-0 font-mono text-xs tabular-nums text-fg-50">{formatInr(line.amount)}</dd>
                </div>
              ))}
              <div className="flex justify-between">
                <dt className="text-fg-300">GST (18%)</dt>
                <dd className="font-mono text-xs tabular-nums text-fg-50">{formatInr(price.gst)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-fg-50/10 pt-3">
                <dt className="font-medium text-fg-50">Estimated total</dt>
                <dd className="font-display text-3xl tabular-nums text-fg-50">{formatInr(price.total)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-3 border-t border-fg-50/10 bg-white/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-fg-400 sm:max-w-xs">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-aqua-600" aria-hidden="true" />
            This is an estimate. We confirm scope and the final quote on a call — nothing is charged online.
          </p>
          <Link
            href={requestHref}
            onClick={onClose}
            className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide"
          >
            Request this plan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
