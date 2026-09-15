import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="bg-ink-950">
      <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <p className="eyebrow text-brass-400">
          <span className="eyebrow-rule" aria-hidden="true" />
          404 — NOT FOUND
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-[-0.015em] text-bone-50 md:text-7xl">
          This page didn&apos;t pass the audit.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-bone-300/70">
          The address you followed doesn&apos;t exist — it may have moved, or
          the reference is incomplete. Let&apos;s get you back to solid
          evidence.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brass-400 bg-brass-400 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-brass-300"
          >
            Back to home
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/audit-plans"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-bone-50/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bone-100 transition-colors hover:border-bone-50/40"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Browse audit plans
          </Link>
        </div>
      </div>
    </main>
  );
}
