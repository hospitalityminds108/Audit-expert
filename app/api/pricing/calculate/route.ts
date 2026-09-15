import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/pricing/engine";
import { priceCalcSchema, zodFieldErrors } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

/**
 * POST /api/pricing/calculate
 * Server-side price recalculation. The client sends identifiers only;
 * prices are NEVER trusted from the client.
 */

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`price:${ip}`, 60, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsed = priceCalcSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    let result;
    try {
      result = calculatePrice(parsed.data);
    } catch {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
