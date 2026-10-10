"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import { auditPlans, addOns, getPlanBySlug, formatPrice } from "@/data/audit-plans";
import { industries } from "@/data/industries";
import type { PricingResult } from "@/lib/pricing/engine";
import { checkoutFaqs } from "@/data/faqs";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { useAuth } from "@/components/auth/AuthProvider";

/* ────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────── */

interface Details {
  name: string;
  email: string;
  phone: string;
  company: string;
  preferredDate: string;
  preferredSlot: string;
  notes: string;
}

interface OrderResponse {
  bookingId: string;
  reference: string;
  order: {
    provider: "razorpay" | "mock";
    orderId: string;
    amount: number;
    currency: string;
    publicKey: string | null;
    mockPaymentId: string | null;
    mockSignature: string | null;
  };
  pricing: { subtotal: number; discount: number; gst: number; total: number };
}

type Step = "configure" | "details" | "pay";

const STEPS = [
  { id: "configure", label: "Configure" },
  { id: "details", label: "Details" },
  { id: "pay", label: "Pay" },
] as const;

/* ────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────── */

function formatInr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

/** Load Razorpay Checkout on demand (only the razorpay provider needs it). */
function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
    script.addEventListener("error", () => resolve(false));
    if (!existing) {
      script.src = RAZORPAY_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

/* Minimal typings for the Razorpay Checkout script (loaded only when the
   razorpay provider is active). We only use constructor + open(). */
interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  notes: Record<string, string>;
  theme: { color: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

/* ────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────── */

export default function CheckoutClient() {
  const router = useRouter();
  const { user } = useAuth();
  const topRef = useRef<HTMLOListElement>(null);

  // ── Wizard state ──
  const [step, setStep] = useState<Step>("configure");
  const [planSlug, setPlanSlug] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [locations, setLocations] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);

  // ── Details ──
  const [details, setDetails] = useState<Details>({
    name: "",
    email: "",
    phone: "",
    company: "",
    preferredDate: "",
    preferredSlot: "flexible",
    notes: "",
  });
  const [detailsErrors, setDetailsErrors] = useState<Record<string, string>>({});

  // ── Pricing (server-computed) ──
  const [pricing, setPricing] = useState<PricingResult | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  // ── Order / payment ──
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  // ── Read query params on mount (plan/industry preselect) ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const loc = params.get("locations");
    if (plan && getPlanBySlug(plan)) {
      setPlanSlug(plan);
      const p = getPlanBySlug(plan)!;
      setIndustry(p.category);
    }
    if (loc) {
      const n = parseInt(loc, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= 20) setLocations(n);
    }
    // Add-ons chosen in the plan popup
    const known = new Set<string>(addOns.map((a) => a.id));
    const chosen = (params.get("addons") ?? "").split(",").filter((id) => known.has(id));
    if (chosen.length) setSelectedAddOns(chosen);
  }, []);

  // ── Signed-in buyers: start from their saved details (never overwrite typing) ──
  useEffect(() => {
    if (!user) return;
    setDetails((d) => ({
      ...d,
      name: d.name || user.name,
      email: d.email || user.email,
      phone: d.phone || user.phone || "",
      company: d.company || user.company || "",
    }));
  }, [user]);

  // ── Each step starts at the top of the wizard, not mid-page ──
  const goToStep = useCallback((next: Step) => {
    setStep(next);
    requestAnimationFrame(() => {
      const el = topRef.current;
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // ── Server-side price recalculation on any change ──
  const recalcPrice = useCallback(async () => {
    if (!planSlug) {
      setPricing(null);
      return;
    }
    setPricingLoading(true);
    try {
      const res = await fetch("/api/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug,
          locations,
          addOnIds: selectedAddOns,
          couponCode: couponApplied,
        }),
      });
      if (res.ok) {
        const fresh: PricingResult = await res.json();
        setPricing(fresh);
        setCouponError(fresh.couponError ?? null);
      }
    } catch {
      /* keep previous pricing on network error */
    } finally {
      setPricingLoading(false);
    }
  }, [planSlug, locations, selectedAddOns, couponApplied]);

  useEffect(() => {
    void recalcPrice();
  }, [recalcPrice]);

  // ── Plan filtering by industry ──
  const filteredPlans = useMemo(() => {
    if (!industry) return auditPlans;
    return auditPlans.filter((p) => p.category === industry);
  }, [industry]);

  // ── Coupon ──
  const applyCoupon = async () => {
    if (!couponInput.trim() || !planSlug) return;
    setCouponChecking(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug,
          locations,
          addOnIds: selectedAddOns,
          couponCode: couponInput.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponApplied(data.code);
        setCouponError(null);
        await recalcPrice();
      } else {
        setCouponError(data.error ?? "Coupon not applicable.");
      }
    } catch {
      setCouponError("Could not verify the coupon. Try again.");
    } finally {
      setCouponChecking(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponInput("");
    setCouponError(null);
  };

  // ── Validation (mirrors server Zod) ──
  const validateDetails = (): boolean => {
    const er: Record<string, string> = {};
    if (details.name.trim().length < 2) er.name = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) er.email = "Enter a valid email";
    if (!/^[+]?[\d\s-]{10,16}$/.test(details.phone.trim()))
      er.phone = "Enter a valid phone number";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(details.preferredDate))
      er.preferredDate = "Pick a preferred date";
    setDetailsErrors(er);
    return Object.keys(er).length === 0;
  };

  // ── Create order → open payment ──
  const startPayment = async () => {
    if (!planSlug || submitting) return;
    setSubmitting(true);
    setOrderError(null);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug,
          locations,
          addOnIds: selectedAddOns,
          couponCode: couponApplied,
          customer: {
            name: details.name,
            email: details.email,
            phone: details.phone,
            company: details.company || undefined,
          },
          scheduling: {
            preferredDate: details.preferredDate,
            preferredSlot: details.preferredSlot,
            notes: details.notes || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error ?? "Could not start payment. Please try again.");
        setSubmitting(false);
        return;
      }
      setOrder(data as OrderResponse);
      await openCheckout(data as OrderResponse);
    } catch {
      setOrderError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  // ── Payment window handling (razorpay or mock) ──
  const openCheckout = async (data: OrderResponse) => {
    if (data.order.provider === "mock") {
      // Mock: auto-verify using pre-computed signature
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: data.bookingId,
          razorpayOrderId: data.order.orderId,
          razorpayPaymentId: data.order.mockPaymentId,
          razorpaySignature: data.order.mockSignature,
        }),
      });
      const vd = await verifyRes.json();
      if (vd.verified) {
        router.push(`/booking/confirmation/${data.bookingId}`);
      } else {
        router.push("/payment/failed");
      }
      return;
    }

    // Razorpay Checkout
    if (!data.order.publicKey || !(await loadRazorpay()) || !window.Razorpay) {
      setOrderError("The payment window could not be opened. Check your connection and try again.");
      setSubmitting(false);
      return;
    }
    const rzp = new window.Razorpay({
      key: data.order.publicKey,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "AuditExpert",
      description: `Audit booking ${data.reference}`,
      order_id: data.order.orderId,
      prefill: { name: details.name, email: details.email, contact: details.phone },
      notes: { booking_reference: data.reference },
      theme: { color: "#0B8455" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: data.bookingId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        const vd = await verifyRes.json();
        if (vd.verified) {
          router.push(`/booking/confirmation/${data.bookingId}`);
        } else {
          router.push("/payment/failed");
        }
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
          router.push("/payment/cancelled");
        },
      },
    });
    rzp.open();
    setSubmitting(false);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  };

  const canProceedConfigure = planSlug !== "";

  /* ════════════════════════════════════════════════════════
     Render
     ════════════════════════════════════════════════════════ */

  return (
    <div className="container-site pb-32 pt-32 md:pt-40 lg:pb-24">
      {/* Mobile: keep the running total in view */}
      {pricing && (
        <div className="glass-strong fixed inset-x-0 bottom-0 z-[70] flex items-center justify-between gap-4 border-t border-fg-50/10 px-5 py-3 lg:hidden">
          <div className="min-w-0">
            <p className="truncate text-xs text-fg-400">{pricing.plan.name}</p>
            <p className="font-display text-xl tabular-nums text-fg-50">{formatInr(pricing.total)}</p>
          </div>
          <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-400">
            incl. GST · {pricing.locations} {pricing.locations === 1 ? "location" : "locations"}
          </p>
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-accent">
            <span className="eyebrow-rule" aria-hidden="true" />
            SECURE CHECKOUT
          </p>
          <h1 className="mt-4 font-display text-3xl tracking-[-0.01em] text-fg-50 md:text-4xl">
            Configure your audit
          </h1>
          <p className="mt-3 max-w-xl text-sm text-fg-300/80">
            Prices are calculated on our server — the number you see is the
            number you pay. 18% GST shown transparently at checkout.
          </p>
        </div>
        <Link
          href="/audit-plans"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/70 transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to plans & pricing
        </Link>
      </div>

      {/* ── Step indicator ── */}
      <ol ref={topRef} className="mb-12 grid scroll-mt-28 grid-cols-3 gap-2" aria-label="Checkout steps">
        {STEPS.map((s, i) => {
          const active = step === s.id;
          const done = STEPS.findIndex((x) => x.id === step) > i;
          return (
            <li
              key={s.id}
              aria-current={active ? "step" : undefined}
              onClick={done ? () => goToStep(s.id) : undefined}
              className={`flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-3 transition-colors duration-300 sm:gap-3 sm:px-4 ${done ? "cursor-pointer hover:border-aqua-500/60 " : ""}${
                active
                  ? "border-brand-400/50 bg-brand-400/10"
                  : done
                  ? "border-aqua-400/30 bg-aqua-400/5"
                  : "border-fg-50/10 bg-white/60"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${
                  active
                    ? "bg-brand-600 text-on-brand"
                    : done
                    ? "bg-aqua-500/80 text-fg-50"
                    : "bg-fg-50/10 text-fg-300/70"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={`truncate font-mono text-[10px] uppercase tracking-[0.06em] sm:text-[11px] sm:tracking-[0.14em] ${
                  active ? "text-fg-50" : "text-fg-300/60"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* ═══ Left: wizard ═══ */}
        <div>
          {/* ── STEP 1: CONFIGURE ── */}
          {step === "configure" && (
            <div className="space-y-10">
              {/* Industry */}
              <div>
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
                  01 — Industry
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setIndustry("")}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      industry === ""
                        ? "border-brand-400/60 bg-brand-400/10 text-fg-50"
                        : "border-fg-50/10 bg-white/60 text-fg-300/80 hover:border-fg-50/25"
                    }`}
                  >
                    All industries
                  </button>
                  {industries.map((ind) => {
                    const count = auditPlans.filter((p) => p.category === ind.slug).length;
                    return (
                    <button
                      key={ind.slug}
                      type="button"
                      onClick={() => setIndustry(ind.slug)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        industry === ind.slug
                          ? "border-brand-400/60 bg-brand-400/10 text-fg-50"
                          : "border-fg-50/10 bg-white/60 text-fg-300/80 hover:border-fg-50/25"
                      }`}
                    >
                      {ind.shortTitle}
                      <span className="ml-2 font-mono text-[10px] text-fg-300/60">
                        {count}
                      </span>
                    </button>
                    );
                  })}
                </div>
              </div>

              {/* Plan */}
              <div>
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
                  02 — Audit plan
                </h2>
                <div className="grid gap-2">
                  {filteredPlans.map((plan) => {
                    const selected = planSlug === plan.slug;
                    return (
                      <button
                        key={plan.slug}
                        type="button"
                        onClick={() => {
                          setPlanSlug(plan.slug);
                          if (industry !== plan.category) setIndustry(plan.category);
                        }}
                        className={`flex items-start justify-between gap-4 rounded-xl border p-5 text-left transition-colors ${
                          selected
                            ? "border-brand-400/60 bg-brand-400/10"
                            : "border-fg-50/10 bg-white/60 hover:border-fg-50/25"
                        }`}
                        aria-pressed={selected}
                      >
                        <span className="flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-fg-50">{plan.name}</span>
                            <span
                              className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${
                                plan.format === "mystery"
                                  ? "border-brand-400/40 bg-brand-400/10 text-accent"
                                  : "border-aqua-400/40 bg-aqua-400/10 text-aqua-600"
                              }`}
                            >
                              {plan.format}
                            </span>
                          </span>
                          <span className="mt-1.5 block text-xs text-fg-300/70">{plan.tagline}</span>
                        </span>
                        <span className="shrink-0 font-mono text-xs text-fg-300/80">
                          {formatPrice(plan.priceMin, plan.priceMax)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Locations + add-ons */}
              <div>
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
                  03 — Locations &amp; add-ons
                </h2>
                <div className="rounded-xl border border-fg-50/10 glass p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-fg-50">Locations</p>
                      <p className="mt-1 text-xs text-fg-300/70">
                        3+ locations: 5% volume rate · 5+: 10%
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setLocations((l) => Math.max(1, l - 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-fg-50/15 text-fg-200 hover:border-brand-400/50"
                        aria-label="Remove a location"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center font-mono text-lg text-fg-50" aria-live="polite">
                        {locations}
                      </span>
                      <button
                        type="button"
                        onClick={() => setLocations((l) => Math.min(20, l + 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-fg-50/15 text-fg-200 hover:border-brand-400/50"
                        aria-label="Add a location"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 border-t border-fg-50/10 pt-6">
                    {addOns.map((a) => {
                      const on = selectedAddOns.includes(a.id);
                      return (
                        <label
                          key={a.id}
                          className={`flex cursor-pointer items-start justify-between gap-4 rounded-lg border p-4 transition-colors ${
                            on ? "border-brand-400/50 bg-brand-400/10" : "border-fg-50/10 hover:border-fg-50/25"
                          }`}
                        >
                          <span className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => toggleAddOn(a.id)}
                              className="mt-0.5 h-4 w-4 accent-brand-400"
                            />
                            <span>
                              <span className="block text-sm text-fg-100">{a.label}</span>
                              <span className="mt-0.5 block text-xs text-fg-300/65">{a.description}</span>
                            </span>
                          </span>
                          <span className="shrink-0 font-mono text-xs text-fg-300/80">
                            {formatInr(a.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div>
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
                  04 — Coupon
                </h2>
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-fg-50/10 glass p-4">
                  {couponApplied ? (
                    <div className="flex w-full items-center justify-between rounded-lg bg-aqua-400/10 px-4 py-3">
                      <span className="flex items-center gap-2.5 text-sm text-aqua-600">
                        <Tag className="h-4 w-4" aria-hidden="true" />
                        {couponApplied} applied
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/70 hover:text-fg-100"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="FIRSTAUDIT10"
                        aria-label="Coupon code"
                        className="min-w-0 flex-1 rounded-lg border border-fg-50/15 bg-base-950 px-4 py-2.5 font-mono text-sm uppercase tracking-[0.1em] text-fg-50 placeholder:text-fg-300/60 outline-none focus:border-brand-400"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponChecking || !planSlug}
                        className="rounded-lg border border-brand-400/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-brand-400/10 disabled:opacity-40"
                      >
                        {couponChecking ? "Checking…" : "Apply"}
                      </button>
                    </>
                  )}
                  {couponError && <p className="w-full text-xs text-red-700">{couponError}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-fg-50/10 pt-8">
                <p className="text-xs text-fg-300/60">
                  {planSlug ? "Selection ready." : "Select a plan to continue."}
                </p>
                <button
                  type="button"
                  onClick={() => goToStep("details")}
                  disabled={!canProceedConfigure}
                  className="inline-flex items-center gap-2 rounded-full btn-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-on-brand transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: DETAILS ── */}
          {step === "details" && (
            <div className="space-y-8">
              {!user && (
                <p className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl border border-fg-50/10 px-5 py-4 text-sm text-fg-300">
                  <span>Have an account? Sign in and we&apos;ll fill this in for you.</span>
                  <Link
                    href={`/login?next=${encodeURIComponent(
                      `/checkout?plan=${planSlug}&locations=${locations}${selectedAddOns.length ? `&addons=${selectedAddOns.join(",")}` : ""}`
                    )}`}
                    className="font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              )}
              <div>
                <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
                  05 — Booking details
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  {(
                    [
                      { key: "name", label: "Full name *", type: "text", ac: "name" },
                      { key: "email", label: "Email *", type: "email", ac: "email" },
                      { key: "phone", label: "Phone / WhatsApp *", type: "tel", ac: "tel" },
                      { key: "company", label: "Company / brand", type: "text", ac: "organization" },
                    ] as const
                  ).map((f) => (
                    <div key={f.key}>
                      <label
                        htmlFor={`d-${f.key}`}
                        className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/80"
                      >
                        {f.label}
                      </label>
                      <input
                        id={`d-${f.key}`}
                        type={f.type}
                        autoComplete={f.ac}
                        value={details[f.key]}
                        onChange={(e) => {
                          setDetails((d) => ({ ...d, [f.key]: e.target.value }));
                          if (detailsErrors[f.key])
                            setDetailsErrors((er) => ({ ...er, [f.key]: "" }));
                        }}
                        className={`w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-fg-50 placeholder:text-fg-300/60 outline-none transition-colors focus:border-brand-400 ${
                          detailsErrors[f.key] ? "border-red-500/70" : "border-fg-50/15"
                        }`}
                      />
                      {detailsErrors[f.key] && (
                        <p className="mt-1.5 text-xs text-red-700">{detailsErrors[f.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
                  06 — Scheduling
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="d-date"
                      className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/80"
                    >
                      Preferred date *
                    </label>
                    <input
                      id="d-date"
                      type="date"
                      value={details.preferredDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        setDetails((d) => ({ ...d, preferredDate: e.target.value }));
                        if (detailsErrors.preferredDate)
                          setDetailsErrors((er) => ({ ...er, preferredDate: "" }));
                      }}
                      className={`w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-fg-50 outline-none transition-colors focus:border-brand-400 ${
                        detailsErrors.preferredDate ? "border-red-500/70" : "border-fg-50/15"
                      }`}
                    />
                    {detailsErrors.preferredDate && (
                      <p className="mt-1.5 text-xs text-red-700">{detailsErrors.preferredDate}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="d-slot"
                      className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-fg-300/80"
                    >
                      Preferred slot
                    </label>
                    <div className="relative">
                      <select
                        id="d-slot"
                        value={details.preferredSlot}
                        onChange={(e) => setDetails((d) => ({ ...d, preferredSlot: e.target.value }))}
                        className="w-full appearance-none rounded-xl border border-fg-50/15 bg-white/60 px-4 py-3 text-sm text-fg-50 outline-none focus:border-brand-400"
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                        <option value="flexible">Flexible</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-300/60"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <label
                    htmlFor="d-notes"
                    className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/80"
                  >
                    Notes for the audit team
                  </label>
                  <textarea
                    id="d-notes"
                    rows={4}
                    value={details.notes}
                    onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
                    placeholder="Property name, special requirements, context…"
                    className="w-full resize-none rounded-xl border border-fg-50/15 bg-white/60 px-4 py-3 text-sm text-fg-50 placeholder:text-fg-300/60 outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-fg-50/10 pt-8">
                <button
                  type="button"
                  onClick={() => goToStep("configure")}
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/70 transition-colors hover:text-fg-100"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateDetails()) goToStep("pay");
                  }}
                  className="inline-flex items-center gap-2 rounded-full btn-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-on-brand transition-colors"
                >
                  Review &amp; pay
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="rounded-xl border border-fg-50/10 glass p-5">
                <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/70">
                  <ShieldCheck className="h-4 w-4 text-aqua-600" aria-hidden="true" />
                  Your details are encrypted in transit
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: PAY ── */}
          {step === "pay" && (
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
                  07 — Review &amp; pay
                </h2>
                <div className="space-y-4 rounded-2xl border border-fg-50/10 glass p-6">
                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">Plan</p>
                      <p className="mt-1 text-fg-50">{pricing?.plan.name ?? "—"}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">Locations</p>
                      <p className="mt-1 text-fg-50">{pricing?.locations ?? locations}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">Date</p>
                      <p className="mt-1 text-fg-50">{details.preferredDate}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">Contact</p>
                      <p className="mt-1 text-fg-50">{details.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-fg-50/10 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-300/60">
                      Booking details
                    </p>
                    <p className="mt-2 text-sm text-fg-300/80">
                      {details.name} · {details.phone} · {details.preferredSlot} slot
                      {details.company ? ` · ${details.company}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              {orderError && (
                <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-700">
                  {orderError}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-fg-50/10 pt-8">
                <button
                  type="button"
                  onClick={() => goToStep("details")}
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-300/70 transition-colors hover:text-fg-100"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={startPayment}
                  disabled={submitting || !pricing}
                  className="inline-flex items-center gap-3 rounded-full btn-primary px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-on-brand transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Processing…
                    </>
                  ) : (
                    <>
                      Pay {pricing ? formatInr(pricing.total) : ""}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-fg-50/10 glass p-5">
                <p className="flex items-start gap-2.5 text-xs leading-relaxed text-fg-300/80">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-aqua-600" aria-hidden="true" />
                  Payment is verified on our server before your booking is
                  confirmed. If payment fails, nothing is charged and you can
                  retry safely.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ═══ Right: sticky order summary ═══ */}
        <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-fg-50/12 glass p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
                Order summary
              </h2>
              {pricingLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-fg-300/60" aria-hidden="true" />
              )}
            </div>

            {!planSlug ? (
              <p className="mt-6 text-sm text-fg-300/60">Select a plan to see pricing.</p>
            ) : pricing ? (
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-medium text-fg-50">{pricing.plan.name}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/60">
                    {pricing.plan.format} · {pricing.plan.categoryLabel}
                  </p>
                </div>
                <ul className="space-y-2.5 border-t border-fg-50/10 pt-4">
                  {pricing.lines.map((line) => (
                    <li key={line.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-fg-300/80">
                        {line.label}
                        {line.detail && (
                          <span className="mt-0.5 block text-[11px] text-fg-300/60">{line.detail}</span>
                        )}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-fg-100">
                        {formatInr(line.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
                {pricing.discount > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-aqua-400/10 px-4 py-3 text-sm">
                    <span className="flex items-center gap-2 text-aqua-600">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      {pricing.couponCode}
                    </span>
                    <span className="font-mono text-xs text-aqua-600">
                      −{formatInr(pricing.discount)}
                    </span>
                  </div>
                )}
                <dl className="space-y-2 border-t border-fg-50/10 pt-4">
                  <div className="flex justify-between text-sm">
                    <dt className="text-fg-300/80">Subtotal</dt>
                    <dd className="font-mono text-xs text-fg-100">{formatInr(pricing.subtotal)}</dd>
                  </div>
                  {pricing.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-fg-300/80">Discount</dt>
                      <dd className="font-mono text-xs text-aqua-600">−{formatInr(pricing.discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <dt className="text-fg-300/80">GST (18%)</dt>
                    <dd className="font-mono text-xs text-fg-100">{formatInr(pricing.gst)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-fg-50/10 pt-3 text-base">
                    <dt className="font-medium text-fg-50">Total</dt>
                    <dd className="font-display text-xl text-accent">{formatInr(pricing.total)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-3 text-sm text-fg-300/60">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Calculating on server…
              </div>
            )}
          </div>

          {/* Checkout FAQs */}
          <div className="mt-8">
            <FAQAccordion items={checkoutFaqs} />
          </div>
        </aside>
      </div>
    </div>
  );
}
