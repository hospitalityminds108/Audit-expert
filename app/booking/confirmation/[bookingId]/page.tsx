import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Phone,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { bookingStore } from "@/lib/database/booking-store";
import ConfirmationCheck from "@/components/booking/ConfirmationCheck";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking Confirmation",
  description: "Your audit booking is confirmed.",
  robots: { index: false, follow: false },
};

function formatInr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatSlot(slot: string): string {
  const slots: Record<string, string> = {
    morning: "Morning (9am–12pm)",
    afternoon: "Afternoon (12–4pm)",
    evening: "Evening (4–8pm)",
    flexible: "Flexible",
  };
  return slots[slot] ?? slot;
}

export default async function BookingConfirmationPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const booking = await bookingStore.get(params.bookingId);

  // Booking not found or unconfirmed (server store restart, bad id, …)
  if (!booking || !booking.payment.verified || booking.status !== "CONFIRMED") {
    return (
      <div className="">
        <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-fg-50/15 bg-white/60">
            <FileText className="h-8 w-8 text-fg-300/70" aria-hidden="true" />
          </div>
          <h1 className="mt-8 font-display text-3xl tracking-[-0.01em] text-fg-50 md:text-4xl">
            Booking not available
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-300/80">
            We could not find a confirmed booking with this reference. If you
            just completed a payment, refresh in a moment — or contact us and
            we will locate your booking immediately.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-full btn-primary px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-on-brand transition-colors"
            >
              Back to checkout
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-fg-50/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-fg-100 transition-colors hover:border-fg-50/40"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { customer, scheduling, pricing } = booking;

  return (
    <div className="">
      <div className="container-site py-32 md:py-40">
        {/* ── Confirmation header ── */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <ConfirmationCheck size={104} />
          </div>
          <p className="eyebrow mt-8 text-aqua-600">
            <span className="eyebrow-rule" aria-hidden="true" />
            BOOKING CONFIRMED
          </p>
          <h1 className="mt-4 font-display text-3xl tracking-[-0.01em] text-fg-50 md:text-5xl">
            Your audit is booked
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-fg-300/80">
            Payment verified on our server and booking confirmed. A
            confirmation email with your invoice is on its way to{" "}
            <span className="text-fg-100">{customer.email}</span>. Keep your
            booking reference handy for all communication.
          </p>
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl border border-brand-400/30 bg-brand-400/10 px-8 py-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/80">
              Booking reference
            </span>
            <span className="font-mono text-2xl tracking-[0.12em] text-accent">
              {booking.reference}
            </span>
          </div>
        </div>

        {/* ── Confirmation details grid ── */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
          {/* Booking recap */}
          <section className="rounded-2xl border border-fg-50/10 glass p-7">
            <h2 className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
              <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
              Audit booked
            </h2>
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/60">
                  Plan
                </dt>
                <dd className="mt-1 text-sm text-fg-50">{booking.planName}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/60">
                  Locations
                </dt>
                <dd className="mt-1 text-sm text-fg-50">
                  {booking.locations}{" "}
                  {booking.locations === 1 ? "outlet" : "outlets"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/60">
                  Preferred date
                </dt>
                <dd className="mt-1 text-sm text-fg-50">
                  {formatSlot(scheduling.preferredSlot)}
                  <span className="block text-fg-300/70">
                    {scheduling.preferredDate}
                  </span>
                </dd>
              </div>
              {booking.addOnIds.length > 0 && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/60">
                    Add-ons
                  </dt>
                  <dd className="mt-1 text-sm text-fg-50">
                    {booking.addOnIds.join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Payment recap */}
          <section className="rounded-2xl border border-fg-50/10 glass p-7">
            <h2 className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-300/70">
              <Receipt className="h-4 w-4 text-accent" aria-hidden="true" />
              Payment summary
            </h2>
            <dl className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-fg-300/80">Subtotal</dt>
                <dd className="font-mono text-xs text-fg-100">
                  {formatInr(pricing.subtotal)}
                </dd>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <dt className="text-fg-300/80">
                    Discount{booking.couponCode ? ` (${booking.couponCode})` : ""}
                  </dt>
                  <dd className="font-mono text-xs text-aqua-600">
                    −{formatInr(pricing.discount)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <dt className="text-fg-300/80">GST (18%)</dt>
                <dd className="font-mono text-xs text-fg-100">
                  {formatInr(pricing.gst)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-fg-50/10 pt-3">
                <dt className="text-sm font-medium text-fg-50">Total paid</dt>
                <dd className="font-display text-xl text-accent">
                  {formatInr(pricing.total)}
                </dd>
              </div>
              <div className="pt-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/60">
                  Payment ID
                </dt>
                <dd className="mt-1 break-all font-mono text-[11px] text-fg-300/80">
                  {booking.payment.paymentId ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/60">
                  Status
                </dt>
                <dd className="mt-1 inline-flex items-center gap-2 text-sm text-aqua-600">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Verified · {booking.payment.provider}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* ── Next steps ── */}
        <div className="mx-auto mt-6 max-w-5xl rounded-2xl border border-fg-50/10 glass p-7">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-300/70">
            What happens next
          </h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            <li className="flex gap-4">
              <span className="font-mono text-xs text-accent">01</span>
              <div>
                <p className="text-sm font-medium text-fg-50">
                  Scheduling call
                </p>
                <p className="mt-1 text-xs leading-relaxed text-fg-300/70">
                  Our team calls {customer.phone} within 24 hours to lock the
                  audit window and share the evidence checklist.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-xs text-accent">02</span>
              <div>
                <p className="text-sm font-medium text-fg-50">
                  Auditor assignment
                </p>
                <p className="mt-1 text-xs leading-relaxed text-fg-300/70">
                  A trained, independent auditor is assigned and your audit is
                  scheduled for the chosen window.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-xs text-accent">03</span>
              <div>
                <p className="text-sm font-medium text-fg-50">
                  Report &amp; debrief
                </p>
                <p className="mt-1 text-xs leading-relaxed text-fg-300/70">
                  Your scored report with photo and video evidence is delivered
                  within 72 hours of the audit date.
                </p>
                </div>
            </li>
          </ol>
        </div>

        {/* ── Contact strip ── */}
        <div className="mx-auto mt-6 flex max-w-5xl flex-col items-center justify-between gap-5 rounded-2xl border border-fg-50/10 glass p-7 sm:flex-row">
          <p className="flex items-center gap-3 text-sm text-fg-300/80">
            <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
            Questions about your booking?
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:audits@auditexpert.in"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-100 transition-colors hover:text-accent"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              audits@auditexpert.in
            </a>
            <a
              href="tel:+919820000000"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-100 transition-colors hover:text-accent"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              +91 98200 00000
            </a>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-5xl text-center font-mono text-[10px] uppercase tracking-[0.14em] text-fg-300/60">
          <MapPin className="mr-1.5 inline h-3 w-3" aria-hidden="true" />
          This page is not indexed and contains your private booking details.
        </p>
      </div>
    </div>
  );
}
