import { NextResponse } from "next/server";
import { bookingStore } from "@/lib/database/booking-store";
import { paymentVerifySchema, zodFieldErrors } from "@/lib/validation/schemas";
import { getPaymentProvider } from "@/lib/payments/providers";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

/**
 * POST /api/payments/verify
 * Server-side payment verification. Marks the booking CONFIRMED only
 * after the provider signature verifies. Idempotent — verifying an
 * already-confirmed booking returns success without re-processing.
 */

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`verify:${ip}`, 20, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsed = paymentVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

    const booking = await bookingStore.get(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Idempotency: already confirmed → success
    if (booking.payment.verified && booking.status === "CONFIRMED") {
      return NextResponse.json({
        verified: true,
        bookingId: booking.id,
        reference: booking.reference,
        alreadyConfirmed: true,
      });
    }

    // The order id must match the one stored at creation
    if (booking.payment.orderId !== razorpayOrderId) {
      return NextResponse.json(
        { error: "Order mismatch for this booking." },
        { status: 400 }
      );
    }

    const provider = getPaymentProvider();
    const result = await provider.verifyPayment({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!result.verified) {
      await bookingStore.update(booking.id, {
        status: "PAYMENT_FAILED",
        payment: { ...booking.payment, verified: false, paymentId: razorpayPaymentId, signature: razorpaySignature },
      });
      return NextResponse.json(
        { verified: false, error: result.error ?? "Verification failed" },
        { status: 400 }
      );
    }

    await bookingStore.update(booking.id, {
      status: "CONFIRMED",
      payment: {
        ...booking.payment,
        verified: true,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
    });

    // Email confirmation (demo: logged for the transactional email worker)
    console.log(
      `[EMAIL:CONFIRMATION] ref=${booking.reference} to=${booking.customer.email} ` +
        `plan=${booking.planName} locations=${booking.locations} ` +
        `total=${booking.pricing.total} date=${booking.scheduling.preferredDate}`
    );

    return NextResponse.json({
      verified: true,
      bookingId: booking.id,
      reference: booking.reference,
      alreadyConfirmed: false,
    });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
