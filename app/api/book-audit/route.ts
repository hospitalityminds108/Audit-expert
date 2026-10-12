import { NextResponse } from "next/server";
import { z } from "zod";
import { zodFieldErrors } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

/**
 * POST /api/book-audit
 * "Request a callback" leads from the booking page — for clients who
 * scope the audit on a call before anything is booked.
 */

const callbackSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{10,16}$/, "Enter a valid phone number (10–16 digits)"),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  industry: z.string().trim().max(60).optional().or(z.literal("")),
  planSlug: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`bookaudit:${ip}`, 5, 10 * 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsed = callbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    console.log("[LEAD:BOOKING_CALLBACK]", JSON.stringify({ ...parsed.data, at: new Date().toISOString(), ip }));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
