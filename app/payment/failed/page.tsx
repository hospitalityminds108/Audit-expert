import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Failed — AuditExpert",
  description: "Your payment could not be completed.",
  robots: { index: false, follow: false },
};

export default function PaymentFailedPage() {
  return (
    <main id="main" className="bg-ink-950">
      <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/40 bg-red-400/10">
          <XCircle className="h-8 w-8 text-red-400" aria-hidden="true" />
        </div>
        <p className="eyebrow mt-8 text-red-300">
          <span className="eyebrow-rule" aria-hidden="true" />
          PAYMENT FAILED
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-[-0.01em] text-bone-50 md:text-4xl">
          The payment could not be completed
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-bone-300/70">
          Nothing was charged to your card. This can happen when a bank
          declines the transaction, a payment window times out, or the
          verification does not match. You can safely retry — your
          configuration is waiting.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brass-400 bg-brass-400 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-brass-300"
          >
            Retry payment
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-bone-50/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone-100 transition-colors hover:border-bone-50/40"
          >
            Contact support
          </Link>
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-300/40">
          If money was debited despite this screen, it auto-refunds in 5–7
          working days or reach us at audits@auditexpert.in
        </p>
      </div>
    </main>
  );
}
