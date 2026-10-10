/**
 * Shared Zod schemas — used by BOTH client forms and server API routes.
 * Client-side validation gives instant feedback; server-side revalidation
 * is the source of truth. Never trust the client.
 */

import { z } from "zod";

/* ── Helpers ─────────────────────────────────────────────── */

const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(80, "Name is too long");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+]?[\d\s-]{10,16}$/, "Enter a valid phone number (10–16 digits)");

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker to select a date");

/* ── Contact form ───────────────────────────────────────── */

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.enum([
    "audit-inquiry",
    "multi-location",
    "custom-checklist",
    "auditor-network",
    "partnership",
    "other",
  ]),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters)").max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy policy to continue" }) }),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/* ── Auditor application ─────────────────────────────────── */

export const auditorApplicationSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  city: z.string().trim().min(2, "Select your primary city"),
  auditorType: z.string().trim().min(2, "Select the auditor type that fits you"),
  experience: z.string().trim().min(2, "Select your years of experience"),
  portfolio: z
    .string()
    .trim()
    .url("Enter a valid URL (https://…)")
    .optional()
    .or(z.literal("")),
  availability: z.enum(["part-time", "full-time", "on-call"]),
  motivation: z.string().trim().min(20, "Tell us a little more (at least 20 characters)").max(2000),
  agree: z.literal(true, { errorMap: () => ({ message: "Please accept the integrity standards" }) }),
});

export type AuditorApplicationInput = z.infer<typeof auditorApplicationSchema>;

/* ── Accounts ────────────────────────────────────────────── */

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: z.string().trim().max(120).optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Za-z]/, "Include at least one letter")
    .regex(/[0-9]/, "Include at least one number"),
  agree: z.literal(true, { errorMap: () => ({ message: "Please accept the terms to continue" }) }),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password").max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

/* ── Booking → checkout ──────────────────────────────────── */

export const bookingDetailsSchema = z.object({
  planSlug: z.string().trim().min(2),
  locations: z.number().int().min(1, "At least one location").max(20, "Contact us for 20+ locations"),
  addOnIds: z.array(z.string()).max(10).default([]),
  couponCode: z.string().trim().max(24).optional().nullable(),
  customer: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    company: z.string().trim().max(120).optional(),
  }),
  scheduling: z.object({
    preferredDate: dateSchema,
    preferredSlot: z.enum(["morning", "afternoon", "evening", "flexible"]),
    notes: z.string().trim().max(1000).optional(),
  }),
});

export type BookingDetailsInput = z.infer<typeof bookingDetailsSchema>;

/* ── Payment verification (client → server) ─────────────── */

export const paymentVerifySchema = z.object({
  bookingId: z.string().trim().min(6),
  razorpayOrderId: z.string().trim().min(6),
  razorpayPaymentId: z.string().trim().min(6),
  razorpaySignature: z.string().trim().min(16),
});

export type PaymentVerifyInput = z.infer<typeof paymentVerifySchema>;

/* ── Coupon check (client → server) ─────────────────────── */

export const couponCheckSchema = z.object({
  planSlug: z.string().trim().min(2),
  locations: z.number().int().min(1).max(20),
  addOnIds: z.array(z.string()).max(10).default([]),
  couponCode: z.string().trim().min(3).max(24),
});

export type CouponCheckInput = z.infer<typeof couponCheckSchema>;

/* ── Price re-calculation (client → server) ─────────────── */

export const priceCalcSchema = z.object({
  planSlug: z.string().trim().min(2),
  locations: z.number().int().min(1).max(20),
  addOnIds: z.array(z.string()).max(10).default([]),
  couponCode: z.string().trim().max(24).optional().nullable(),
});

export type PriceCalcInput = z.infer<typeof priceCalcSchema>;

/* ── API helpers ────────────────────────────────────────── */

/** Flatten a ZodError into { field: message } for form display */
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}
