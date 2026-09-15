import { NextResponse } from "next/server";
import { bookingStore } from "@/lib/database/booking-store";
import { verifyWebhookSignature } from "@/lib/payments/providers";

/**
 * POST /api/webhooks/razorpay
 *
 * Server-to-server events from Razorpay. Security:
 *  - Raw body is read BEFORE JSON parsing for HMAC verification
 *  - Signature verified with RAZORPAY_WEBHOOK_SECRET
 *  - Idempotent: an already-verified booking is acked without re-processing
 *
 * Handled events: payment.captured, payment.failed
 */

interface RazorpayWebhookBody {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        method?: string;
        status?: string;
        error_description?: string;
      };
    };
  };
}

const processedEventIds = new Set<string>();

export async function POST(req: Request) {
  // ── Read raw body FIRST for signature verification ──
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const valid = await verifyWebhookSignature(rawBody, signature);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: RazorpayWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Idempotency by payment entity id + event
  const entityId = body.payload?.payment?.entity?.id ?? "unknown";
  const eventKey = `${body.event}:${entityId}`;
  if (processedEventIds.has(eventKey)) {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  switch (body.event) {
    case "payment.captured": {
      const entity = body.payload?.payment?.entity;
      if (!entity?.order_id || !entity.id) {
        return NextResponse.json({ error: "Malformed event" }, { status: 400 });
      }

      const booking = await bookingStore.getByPaymentOrderId(entity.order_id);
      if (!booking) {
        // Unknown order — ack to prevent retries (could be another product)
        return NextResponse.json({ received: true, note: "Order not found" });
      }

      if (booking.payment.verified && booking.status === "CONFIRMED") {
        processedEventIds.add(eventKey);
        return NextResponse.json({ received: true, alreadyConfirmed: true });
      }

      await bookingStore.update(booking.id, {
        status: "CONFIRMED",
        payment: {
          ...booking.payment,
          verified: true,
          paymentId: entity.id,
        },
      });
      processedEventIds.add(eventKey);
      return NextResponse.json({ received: true });
    }

    case "payment.failed": {
      const entity = body.payload?.payment?.entity;
      if (entity?.order_id) {
        const booking = await bookingStore.getByPaymentOrderId(entity.order_id);
        if (booking && booking.status !== "CONFIRMED") {
          await bookingStore.update(booking.id, {
            status: "PAYMENT_FAILED",
            payment: { ...booking.payment, verified: false },
          });
        }
      }
      processedEventIds.add(eventKey);
      return NextResponse.json({ received: true });
    }

    default:
      return NextResponse.json({ received: true, unhandled: body.event });
  }
}
