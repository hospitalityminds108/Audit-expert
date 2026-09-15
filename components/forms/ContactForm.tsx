"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  consent: boolean;
}

const SUBJECTS = [
  { value: "audit-inquiry", label: "Audit inquiry" },
  { value: "multi-location", label: "Multi-location program" },
  { value: "custom-checklist", label: "Custom checklist audit" },
  { value: "auditor-network", label: "Join the auditor network" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Something else" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s-]{10,16}$/;

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "audit-inquiry",
  message: "",
  consent: false,
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
    };

  const toggleConsent = () => {
    setForm((f) => ({ ...f, consent: !f.consent }));
    if (errors.consent) setErrors((er) => ({ ...er, consent: "" }));
  };

  const validate = (): boolean => {
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = "Please enter your full name";
    if (!EMAIL_RE.test(form.email.trim())) er.email = "Enter a valid email address";
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim()))
      er.phone = "Enter a valid phone number (10–16 digits)";
    if (form.message.trim().length < 20)
      er.message = "Tell us a little more (at least 20 characters)";
    if (!form.consent) er.consent = "Please accept the privacy policy to continue";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          subject: form.subject,
          message: form.message.trim(),
          consent: true,
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
        <h3 className="mt-5 font-display text-2xl text-bone-50">Message received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-bone-300/70">
          Thank you, {form.name.split(" ")[0]}. We reply to every inquiry within
          one working day — usually much faster. A copy of your message is on
          its way to {form.email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Full name *
          </label>
          <input
            id="ct-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "ct-name-err" : undefined}
            className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400 ${
              errors.name ? "border-red-500/70" : "border-bone-50/15"
            }`}
          />
          {errors.name && <p id="ct-name-err" className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="ct-email" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Email *
          </label>
          <input
            id="ct-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "ct-email-err" : undefined}
            className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400 ${
              errors.email ? "border-red-500/70" : "border-bone-50/15"
            }`}
          />
          {errors.email && <p id="ct-email-err" className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="ct-phone" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Phone / WhatsApp
          </label>
          <input
            id="ct-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "ct-phone-err" : undefined}
            className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400 ${
              errors.phone ? "border-red-500/70" : "border-bone-50/15"
            }`}
          />
          {errors.phone && <p id="ct-phone-err" className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="ct-company" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
            Company / brand
          </label>
          <input
            id="ct-company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={set("company")}
            className="w-full rounded-xl border border-bone-50/15 bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ct-subject" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
          What is this about *
        </label>
        <select
          id="ct-subject"
          value={form.subject}
          onChange={set("subject")}
          className="w-full appearance-none rounded-xl border border-bone-50/15 bg-ink-900/60 px-4 py-3 text-sm text-bone-50 outline-none transition-colors focus:border-brass-400"
        >
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ct-message" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-bone-300/70">
          Message *
        </label>
        <textarea
          id="ct-message"
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Your property type, cities, what you want to find out…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "ct-message-err" : undefined}
          className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-300/30 outline-none transition-colors focus:border-brass-400 ${
            errors.message ? "border-red-500/70" : "border-bone-50/15"
          }`}
        />
        {errors.message && <p id="ct-message-err" className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-bone-300/70">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={toggleConsent}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "ct-consent-err" : undefined}
            className="mt-0.5 h-4 w-4 accent-brass-400"
          />
          <span>
            I agree to be contacted about my inquiry and accept the{" "}
            <a href="/privacy" className="text-brass-300 underline underline-offset-2 hover:text-brass-200">
              privacy policy
            </a>
            . My details are never sold or shared.
          </span>
        </label>
        {errors.consent && <p id="ct-consent-err" className="mt-1.5 text-xs text-red-400">{errors.consent}</p>}
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm text-red-300">
          {serverError}
        </p>
      )}

      <div className="flex flex-col items-start justify-between gap-5 border-t border-bone-50/10 pt-6 sm:flex-row sm:items-center">
        <p className="text-xs text-bone-300/50">We reply within one working day.</p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-3 rounded-full border border-brass-400 bg-brass-400 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-forest transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
