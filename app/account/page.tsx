import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { bookingStore } from "@/lib/database/booking-store";
import { formatInr } from "@/lib/pricing/engine";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Awaiting payment",
  CONFIRMED: "Confirmed",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In progress",
  REPORTED: "Report ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  PAYMENT_FAILED: "Payment failed",
  DRAFT: "Draft",
};

export default async function AccountPage() {
  const session = getSession();
  if (!session) redirect("/login?next=/account");

  const { user } = session;
  const bookings = await bookingStore.listByEmail(user.email);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="container-site pb-24 pt-32 md:pt-40">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-rule" aria-hidden="true" />
            YOUR ACCOUNT
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.015em] text-fg-50 md:text-6xl">
            Welcome, {firstName}.
          </h1>
          <p className="mt-4 text-sm text-fg-300">
            Signed in as <span className="font-medium text-fg-50">{user.email}</span>
            {user.company ? ` · ${user.company}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/audit-plans"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide"
          >
            Book an audit
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <SignOutButton />
        </div>
      </div>

      <section className="mt-14" aria-labelledby="bookings-heading">
        <h2 id="bookings-heading" className="font-display text-2xl text-fg-50">
          Your bookings
        </h2>

        {bookings.length === 0 ? (
          <div className="glass mt-6 rounded-2xl border border-fg-50/10 p-8 text-center md:p-12">
            <p className="font-display text-2xl text-fg-50">No bookings yet</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-300">
              Bookings made with {user.email} appear here with their reference, status and total.
            </p>
            <Link
              href="/audit-plans"
              className="btn-ghost mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide"
            >
              Explore plans &amp; pricing
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {bookings.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/booking/confirmation/${b.id}`}
                  className="glass group block rounded-2xl border border-fg-50/10 p-6 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-brand-500/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{b.reference}</p>
                      <p className="mt-2 font-display text-xl text-fg-50">{b.planName}</p>
                    </div>
                    <span className="rounded-full border border-fg-50/15 bg-white/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-300">
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-fg-50/10 pt-4 text-sm text-fg-300">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
                      {b.scheduling.preferredDate}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                      {b.locations} {b.locations === 1 ? "location" : "locations"}
                    </span>
                    <span className="ml-auto font-mono text-sm font-medium text-fg-50">
                      {formatInr(b.pricing.total)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
