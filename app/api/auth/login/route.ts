import { NextResponse } from "next/server";
import { loginSchema, zodFieldErrors } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { userStore, toPublicUser, verifyPassword } from "@/lib/auth/user-store";
import { encodeSession, sessionCookie } from "@/lib/auth/session";

/**
 * POST /api/auth/login
 * Verifies credentials and sets the session cookie.
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`login:${ip}`, 10, 10 * 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fields: zodFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const found = await userStore.getByEmail(parsed.data.email);
    // Same message for an unknown email and a wrong password — don't reveal which
    if (!found || !(await verifyPassword(parsed.data.password, found.passwordHash))) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    const user = toPublicUser(found);
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set(sessionCookie(encodeSession(user)));
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
