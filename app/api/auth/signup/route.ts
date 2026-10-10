import { NextResponse } from "next/server";
import { signupSchema, zodFieldErrors } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { userStore, toPublicUser } from "@/lib/auth/user-store";
import { encodeSession, sessionCookie } from "@/lib/auth/session";

/**
 * POST /api/auth/signup
 * Creates an account and signs the visitor in.
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`signup:${ip}`, 8, 10 * 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const parsed = signupSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const { name, email, password, company } = parsed.data;
    if (await userStore.getByEmail(email)) {
      return NextResponse.json(
        {
          error: "An account with this email already exists.",
          fields: { email: "This email is already registered — sign in instead" },
        },
        { status: 409 }
      );
    }

    const user = toPublicUser(
      await userStore.create({ name, email, password, company: company || undefined })
    );
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set(sessionCookie(encodeSession(user)));
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
