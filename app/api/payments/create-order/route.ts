import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/pricing/engine";
import { bookingStore } from "@/lib/database/booking-store";
import { bookingDetailsSchema, zodFieldErrors } from "@/lib/validation/schemas";
import { getPaymentProvider } from "@/lib/payments/providers";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

/**
 * POST /api/payments/create-order
 *
 * The ONLY endpoint that creates a booking. It:
 *  1. Validates the submitted details (Zod)
 *  2. Recalculates pricing server-side (never trusts client totals)
 *  3. Persists a PENDING_PAYMENT booking
 *  4. Creates a payment order with the active provider
 *  5. Returns order + booking identifiers (no secrets)
 */

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`order:${ip}`, 10, 10 * 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsed = bookingDetailsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const details = parsed.data;

    // ── Server-side price calculation ──
    let pricing;
    try {
      pricing = calculatePrice({
        planSlug: details.planSlug,
        locations: details.locations,
        addOnIds: details.addOnIds,
        couponCode: details.couponCode ?? null,
      });
    } catch {
      return NextResponse.json({ error: "Unknown audit plan." }, { status: 400 });
    }

    const planName = pricing.plan.name;

    // ── Persist booking (PENDING_PAYMENT) ──
    const booking = await bookingStore.create({
      planSlug: details.planSlug,
      planName,
      locations: details.locations,
      addOnIds: details.addOnIds,
      couponCode: pricing.couponCode,
      pricing: {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        gst: pricing.gst,
        total: pricing.total,
        totalInPaise: pricing.totalInPaise,
      },
      customer: details.customer,
      scheduling: details.scheduling,
    });

    // ── Create payment order ──
    const provider = getPaymentProvider();
    let order;
    try {
      order = await provider.createOrder({
        amountInPaise: pricing.totalInPaise,
        bookingReference: booking.reference,
        customer: details.customer,
      });
    } catch (err) {
      // Booking exists but no order — mark failed so retry works
      await bookingStore.update(booking.id, {
        payment: { ...booking.payment, provider: provider.name, attempts: 1, lastAttemptAt: new Date().toISOString() },
      });
      const message = err instanceof Error ? err.message : "Payment provider error";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    // ── Attach order id to booking ──
    await bookingStore.update(booking.id, {
      payment: {
        provider: provider.name,
        orderId: order.orderId,
        verified: false,
        attempts: booking.payment.attempts + 1,
        lastAttemptAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      bookingId: booking.id,
      reference: booking.reference,
      order: {
        provider: order.provider,
        orderId: order.orderId,
        amount: order.amountInPaise,
        currency: order.currency,
        publicKey: order.publicKey ?? null,
        mockPaymentId: order.mockPaymentId ?? null,
        mockSignature: order.mockSignature ?? null,
      },
      pricing: {
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        gst: pricing.gst,
        total: pricing.total,
      },
    });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
