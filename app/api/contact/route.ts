import { NextResponse } from "next/server";
import { contactFormSchema, zodFieldErrors } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

/**
 * POST /api/contact
 * Contact form submissions. Rate-limited and Zod-validated.
 * In production, wire to an email provider (Resend/SendGrid);
 * the handler logs the structured lead for now.
 */

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`contact:${ip}`, 5, 10 * 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    // Structured lead — replace console with email/CRM in production
    console.log("[LEAD:CONTACT]", JSON.stringify({ ...parsed.data, at: new Date().toISOString(), ip }));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
