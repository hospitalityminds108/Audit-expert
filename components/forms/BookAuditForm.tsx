"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { auditPlans, getPlanBySlug, formatPrice } from "@/data/audit-plans";
import { industries } from "@/data/industries";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  planSlug: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  planSlug: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s-]{10,16}$/;

export default function BookAuditForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [presetPlan, setPresetPlan] = useState<string | null>(null);

  // Read ?plan= preselect on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan && getPlanBySlug(plan)) {
      setPresetPlan(plan);
      setForm((f) => ({ ...f, planSlug: plan, industry: getPlanBySlug(plan)!.category }));
    }
    const ind = params.get("industry");
    if (ind && !presetPlan) {
      setForm((f) => (f.industry ? f : { ...f, industry: ind }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = (): boolean => {
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = "Please enter your full name";
    if (!EMAIL_RE.test(form.email.trim())) er.email = "Enter a valid email address";
    if (!PHONE_RE.test(form.phone.trim())) er.phone = "Enter a valid phone number (10–16 digits)";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/book-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim() || undefined,
          industry: form.industry || undefined,
          planSlug: form.planSlug || undefined,
          message: form.message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(
          data?.error === "Too many requests"
            ? "Too many submissions — please try again in a few minutes."
            : "Could not submit. Please try again."
        );
        return;
      }
      setSuccess(true);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-sage-400/30 bg-sage-400/5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-400/15">
          <Check className="h-7 w-7 text-sage-300" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-2xl text-bone-50">Callback requested</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-bone-300/70">
          Thank you, {form.name.split(" ")[0]}. Our team will call {form.phone} within
          one working day to scope your audit, answer questions and lock the schedule.
        </p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/40">
          Prefer to configure and pay online right now?
        </p>
        <Link
          href={form.planSlug ? `/checkout?plan=${form.planSlug}` : "/checkout"}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-brass-400 bg-brass-400 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-ink-950 transition-colors hover:bg-brass-300"
        >
          Configure &amp; pay online
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const plan = form.planSlug ? getPlanBySlug(form.planSlug) : undefined;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {/* Preselected plan context */}
      {presetPlan && plan && (
        <div className="rounded-xl border border-brass-400/30 bg-brass-400/10 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass-300/80">
            Selected plan
          </p>
          <p className="mt-1 text-sm font-medium text-bone-50">
            {plan.name} · {formatPrice(plan.priceMin, plan.priceMax)}
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="ba-name" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Full name *
          </label>
          <input
            id="ba-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "ba-name-err" : undefined}
            className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400 ${
              errors.name ? "border-red-500/70" : "border-bone-50/15"
            }`}
          />
          {errors.name && <p id="ba-name-err" className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="ba-email" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Email *
          </label>
          <input
            id="ba-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "ba-email-err" : undefined}
            className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400 ${
              errors.email ? "border-red-500/70" : "border-bone-50/15"
            }`}
          />
          {errors.email && <p id="ba-email-err" className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="ba-phone" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Phone / WhatsApp *
          </label>
          <input
            id="ba-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "ba-phone-err" : undefined}
            className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400 ${
              errors.phone ? "border-red-500/70" : "border-bone-50/15"
            }`}
          />
          {errors.phone && <p id="ba-phone-err" className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="ba-company" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Company / brand
          </label>
          <input
            id="ba-company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={set("company")}
            className="w-full rounded-xl border border-bone-50/15 bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400"
          />
        </div>
        <div>
          <label htmlFor="ba-industry" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Industry
          </label>
          <select
            id="ba-industry"
            value={form.industry}
            onChange={set("industry")}
            className="w-full appearance-none rounded-xl border border-bone-50/15 bg-ink-900/60 px-4 py-3 text-sm text-bone-50 outline-none transition-colors focus:border-brass-400"
          >
            <option value="">Select industry…</option>
            {industries.map((ind) => (
              <option key={ind.slug} value={ind.slug}>{ind.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ba-plan" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Audit plan
          </label>
          <select
            id="ba-plan"
            value={form.planSlug}
            onChange={set("planSlug")}
            className="w-full appearance-none rounded-xl border border-bone-50/15 bg-ink-900/60 px-4 py-3 text-sm text-bone-50 outline-none transition-colors focus:border-brass-400"
          >
            <option value="">Not sure yet — advise me</option>
            {auditPlans.map((p) => (
              <option key={p.slug} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ba-message" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
          Anything we should know
        </label>
        <textarea
          id="ba-message"
          rows={4}
          value={form.message}
          onChange={set("message")}
          placeholder="Locations, cities, timelines, specific concerns…"
          className="w-full rounded-xl border border-bone-50/15 bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400"
        />
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm text-red-300">
          {serverError}
        </p>
      )}

      <div className="flex flex-col items-start justify-between gap-5 border-t border-bone-50/10 pt-6 sm:flex-row sm:items-center">
        <p className="text-xs text-bone-300/50">
          We reply within one working day. No spam, ever.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-3 rounded-full border border-brass-400 bg-brass-400 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Request callback
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
