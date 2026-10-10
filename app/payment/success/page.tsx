import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment was received and verified.",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <div className="">
      <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-aqua-400/40 bg-aqua-400/10">
          <CheckCircle2 className="h-8 w-8 text-aqua-600" aria-hidden="true" />
        </div>
        <p className="eyebrow mt-8 text-aqua-600">
          <span className="eyebrow-rule" aria-hidden="true" />
          PAYMENT VERIFIED
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-[-0.01em] text-fg-50 md:text-4xl">
          Payment received. Thank you.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-300/80">
          Your payment has been verified on our server. Your booking is being
          confirmed and a confirmation email with your invoice is on its way.
          If you arrived here from a payment window, your confirmation screen
          should be loading automatically.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full btn-primary px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-on-brand transition-colors"
          >
            Back to home
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
