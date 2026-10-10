"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, signupSchema, zodFieldErrors } from "@/lib/validation/schemas";
import { useAuth } from "./AuthProvider";

type Mode = "login" | "signup";

/** Only same-site relative paths are allowed as a post-auth destination. */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return "/account";
  return next;
}

const PASSWORD_RULES = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "A letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { label: "A number", test: (p: string) => /[0-9]/.test(p) },
];

/**
 * AuthForm — shared sign-in / create-account form.
 * Validates with the same Zod schemas the API uses.
 */
export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";
  const otherHref = `${isSignup ? "/login" : "/signup"}${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`;

  const clear = (key: string) => {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setFormError(null);

    const parsed = isSignup
      ? signupSchema.safeParse({ name, email, company, password, agree })
      : loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        if (data?.fields) setErrors(data.fields);
        setFormError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setUser(data.user);
      router.push(next);
      router.refresh();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {isSignup && (
        <div>
          <label htmlFor="auth-name" className="field-label">Full name</label>
          <input
            id="auth-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => { setName(e.target.value); clear("name"); }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "auth-name-err" : undefined}
            className="field"
          />
          {errors.name && <p id="auth-name-err" className="mt-1.5 text-xs text-red-700">{errors.name}</p>}
        </div>
      )}

      <div>
        <label htmlFor="auth-email" className="field-label">Work email</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clear("email"); }}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "auth-email-err" : undefined}
          className="field"
        />
        {errors.email && <p id="auth-email-err" className="mt-1.5 text-xs text-red-700">{errors.email}</p>}
      </div>

      {isSignup && (
        <div>
          <label htmlFor="auth-company" className="field-label">
            Company / brand <span className="normal-case tracking-normal text-fg-400">(optional)</span>
          </label>
          <input
            id="auth-company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="field"
          />
        </div>
      )}

      <div>
        <label htmlFor="auth-password" className="field-label">Password</label>
        <div className="relative">
          <input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); clear("password"); }}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "auth-password-err" : isSignup ? "auth-password-rules" : undefined}
            className="field pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-fg-400 transition-colors hover:text-fg-50"
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
        {errors.password && <p id="auth-password-err" className="mt-1.5 text-xs text-red-700">{errors.password}</p>}
        {isSignup && (
          <ul id="auth-password-rules" className="mt-3 flex flex-wrap gap-2">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(password);
              return (
                <li
                  key={rule.label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300 ${
                    ok ? "border-sage-500/40 bg-sage-500/10 text-sage-600" : "border-fg-50/15 text-fg-400"
                  }`}
                >
                  <Check className={`h-3 w-3 transition-opacity ${ok ? "opacity-100" : "opacity-30"}`} aria-hidden="true" />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {isSignup && (
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-fg-300">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => { setAgree(e.target.checked); clear("agree"); }}
              aria-invalid={!!errors.agree}
              className="mt-1 h-4 w-4 shrink-0 accent-brass-500"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-accent underline-offset-4 hover:underline">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-accent underline-offset-4 hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.agree && <p className="mt-1.5 text-xs text-red-700">{errors.agree}</p>}
        </div>
      )}

      {formError && (
        <p role="alert" className="rounded-xl border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold tracking-wide"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {isSignup ? "Creating account…" : "Signing in…"}
          </>
        ) : (
          <>
            {isSignup ? "Create account" : "Sign in"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-fg-400">
        {isSignup ? "Already have an account?" : "New to AuditExpert?"}{" "}
        <Link href={otherHref} className="font-semibold text-accent underline-offset-4 hover:underline">
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
