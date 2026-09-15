import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Cancelled — AuditExpert",
  description: "Your payment was cancelled before completion.",
  robots: { index: false, follow: false },
};

export default function PaymentCancelledPage() {
  return (
    <main id="main" className="bg-ink-950">
      <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brass-400/40 bg-brass-400/10">
          <Clock className="h-8 w-8 text-brass-300" aria-hidden="true" />
        </div>
        <p className="eyebrow mt-8 text-brass-300">
          <span className="eyebrow-rule" aria-hidden="true" />
          PAYMENT CANCELLED
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-[-0.01em] text-bone-50 md:text-4xl">
          Payment window closed
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-bone-300/70">
          You closed the payment window before completing the transaction, so
          nothing was charged. Your audit configuration is still saved —
          resume whenever you are ready, or book a callback and we will
          complete the booking together on a call.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brass-400 bg-brass-400 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-brass-300"
          >
            Resume checkout
          </Link>
          <Link
            href="/book-an-audit"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-bone-50/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone-100 transition-colors hover:border-bone-50/40"
          >
            Book a callback
          </Link>
        </div>
      </div>
    </main>
  );
}
