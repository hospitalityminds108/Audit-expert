import { NextResponse } from "next/server";
import { calculatePrice, findCoupon } from "@/lib/pricing/engine";
import { couponCheckSchema, zodFieldErrors } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

/**
 * POST /api/coupons
 * Server-side coupon validation. Coupon definitions live in the
 * pricing engine; the client never receives definitions, only
 * validation results for a code it submits.
 */

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`coupon:${ip}`, 20, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsed = couponCheckSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const { planSlug, locations, addOnIds, couponCode } = parsed.data;

    // Recompute subtotal server-side (never trust client)
    let pricing;
    try {
      pricing = calculatePrice({ planSlug, locations, addOnIds });
    } catch {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    const def = findCoupon(couponCode);
    if (!def) {
      return NextResponse.json(
        { valid: false, error: "Coupon code not recognized." },
        { status: 200 }
      );
    }

    // Evaluate against the server-computed context
    const result = calculatePrice({ planSlug, locations, addOnIds, couponCode });
    if (result.couponError) {
      return NextResponse.json(
        { valid: false, error: result.couponError },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: result.couponCode,
      discount: result.discount,
      description: result.discountLabel,
      subtotal: pricing.subtotal,
    });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
