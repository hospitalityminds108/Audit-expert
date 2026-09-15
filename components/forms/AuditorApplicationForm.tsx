"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { auditorTypes } from "@/data/navigation";

type Status = "idle" | "submitting" | "success" | "error";

const CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Goa",
  "Kochi",
  "Other",
] as const;

const EXPERIENCE = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
] as const;

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  auditorType: string;
  experience: string;
  portfolio: string;
  availability: string;
  motivation: string;
  agree: boolean;
}

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  auditorType: "",
  experience: "",
  portfolio: "",
  availability: "part-time",
  motivation: "",
  agree: false,
};

export default function AuditorApplicationForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value =
      e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = (): boolean => {
    const er: Record<string, string> = {};
    if (form.fullName.trim().length < 2) er.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Enter a valid email address.";
    if (!/^[+]?[\d\s-]{10,15}$/.test(form.phone.trim()))
      er.phone = "Enter a valid phone number (10–15 digits).";
    if (!form.city) er.city = "Select your primary city.";
    if (!form.auditorType) er.auditorType = "Select the auditor type that fits you.";
    if (!form.experience) er.experience = "Select your years of experience.";
    if (form.motivation.trim().length < 20)
      er.motivation = "Tell us a little more (at least 20 characters).";
    if (!form.agree) er.agree = "Please confirm you accept the integrity standards.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/auditor-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-sage-600/30 bg-sage-500/[0.08] p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-600/15 text-sage-700">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-2xl text-ink-950">Application received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-700/80">
          Thank you, {form.fullName.split(" ")[0]}. Your application has entered
          review. If your profile matches active programs, the network team will
          reach out about orientation and a sample assessment.
        </p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700/50">
          Reference: AE-AUD-{new Date().getFullYear()}-{String(form.email.length * 137).padStart(6, "0").slice(0, 6)}
        </p>
      </div>
    );
  }

  const inputCls = (k: string) =>
    `w-full rounded-xl border bg-bone-50 px-4 py-3 text-sm text-ink-950 placeholder:text-ink-700/40 outline-none transition-colors focus:border-brass-600 focus:ring-2 focus:ring-brass-600/15 ${
      errors[k] ? "border-red-500/70" : "border-ink-950/15"
    }`;

  const labelCls = "mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700/70";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" aria-label="Auditor application">
      {status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/[0.07] px-5 py-4 text-sm text-red-700"
        >
          Something went wrong submitting your application. Please try again in a
          moment.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelCls}>
            Full name *
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={set("fullName")}
            className={inputCls("fullName")}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-err" : undefined}
          />
          {errors.fullName && (
            <p id="fullName-err" className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            className={inputCls("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-err" : undefined}
          />
          {errors.email && (
            <p id="email-err" className="mt-1.5 text-xs text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone / WhatsApp *
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            className={inputCls("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-err" : undefined}
          />
          {errors.phone && (
            <p id="phone-err" className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
          )}
        </div>
        <div>
          <label htmlFor="city" className={labelCls}>
            Primary city *
          </label>
          <select
            id="city"
            value={form.city}
            onChange={set("city")}
            className={inputCls("city")}
            aria-invalid={Boolean(errors.city)}
          >
            <option value="">Select city…</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.city && <p className="mt-1.5 text-xs text-red-600">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="auditorType" className={labelCls}>
            Auditor type *
          </label>
          <select
            id="auditorType"
            value={form.auditorType}
            onChange={set("auditorType")}
            className={inputCls("auditorType")}
            aria-invalid={Boolean(errors.auditorType)}
          >
            <option value="">Select type…</option>
            {auditorTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.auditorType && (
            <p className="mt-1.5 text-xs text-red-600">{errors.auditorType}</p>
          )}
        </div>
        <div>
          <label htmlFor="experience" className={labelCls}>
            Years of experience *
          </label>
          <select
            id="experience"
            value={form.experience}
            onChange={set("experience")}
            className={inputCls("experience")}
            aria-invalid={Boolean(errors.experience)}
          >
            <option value="">Select experience…</option>
            {EXPERIENCE.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
          {errors.experience && (
            <p className="mt-1.5 text-xs text-red-600">{errors.experience}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="portfolio" className={labelCls}>
          LinkedIn / portfolio URL
        </label>
        <input
          id="portfolio"
          type="url"
          placeholder="https://linkedin.com/in/…"
          value={form.portfolio}
          onChange={set("portfolio")}
          className={inputCls("portfolio")}
        />
      </div>

      <fieldset>
        <legend className={labelCls}>Availability *</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { value: "part-time", label: "Part-time assignments" },
            { value: "full-time", label: "Full-time / frequent" },
            { value: "on-call", label: "On-call / occasional" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                form.availability === opt.value
                  ? "border-brass-600 bg-brass-500/10 text-ink-950"
                  : "border-ink-950/15 bg-bone-50 text-ink-700 hover:border-ink-950/30"
              }`}
            >
              <input
                type="radio"
                name="availability"
                value={opt.value}
                checked={form.availability === opt.value}
                onChange={set("availability")}
                className="accent-brass-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="motivation" className={labelCls}>
          Why you? Tell us about your background and eye for detail *
        </label>
        <textarea
          id="motivation"
          rows={5}
          value={form.motivation}
          onChange={set("motivation")}
          className={`${inputCls("motivation")} resize-none`}
          aria-invalid={Boolean(errors.motivation)}
          aria-describedby={errors.motivation ? "motivation-err" : undefined}
        />
        {errors.motivation && (
          <p id="motivation-err" className="mt-1.5 text-xs text-red-600">{errors.motivation}</p>
        )}
      </div>

      <div>
        <label htmlFor="agree" className="flex cursor-pointer items-start gap-3 text-sm text-ink-800">
          <input
            id="agree"
            type="checkbox"
            checked={form.agree}
            onChange={set("agree")}
            className="mt-0.5 h-4 w-4 accent-brass-600"
            aria-invalid={Boolean(errors.agree)}
          />
          <span>
            I confirm the details above are accurate and I accept the
            AuditExpert integrity standards — evidence over opinion,
            confidentiality, independence and fair reporting.
          </span>
        </label>
        {errors.agree && <p className="mt-1.5 text-xs text-red-600">{errors.agree}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-brass-400 bg-brass-400 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          <>
            Submit application
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </>
        )}
      </button>

      <p className="text-xs leading-relaxed text-ink-700/60">
        Applications are reviewed against active programs, geography and sector
        needs. Joining the network does not guarantee a minimum number of
        assignments.
      </p>
    </form>
  );
}
