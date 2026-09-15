import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful — AuditExpert",
  description: "Your payment was received and verified.",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <main id="main" className="bg-ink-950">
      <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sage-400/40 bg-sage-400/10">
          <CheckCircle2 className="h-8 w-8 text-sage-300" aria-hidden="true" />
        </div>
        <p className="eyebrow mt-8 text-sage-300">
          <span className="eyebrow-rule" aria-hidden="true" />
          PAYMENT VERIFIED
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-[-0.01em] text-bone-50 md:text-4xl">
          Payment received. Thank you.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-bone-300/70">
          Your payment has been verified on our server. Your booking is being
          confirmed and a confirmation email with your invoice is on its way.
          If you arrived here from a payment window, your confirmation screen
          should be loading automatically.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brass-400 bg-brass-400 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-brass-300"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-bone-50/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone-100 transition-colors hover:border-bone-50/40"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
