/**
 * Sessions — stateless, signed, httpOnly cookie.
 *
 * The cookie carries `base64url(payload).hmacSha256` signed with AUTH_SECRET.
 * Nothing sensitive is stored in it (id, name, email, expiry).
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { PublicUser } from "./user-store";

export const SESSION_COOKIE = "ae_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface Session {
  user: PublicUser;
  /** Expiry, epoch seconds */
  exp: number;
}

const globalForSecret = globalThis as unknown as { __authSecret?: string };

function secret(): string {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  // No configured secret: fall back to a per-process random one so cookies are
  // still unforgeable. Sessions then reset whenever the server restarts.
  if (!globalForSecret.__authSecret) {
    globalForSecret.__authSecret = randomBytes(32).toString("hex");
    if (process.env.NODE_ENV === "production") {
      console.warn("[auth] AUTH_SECRET is not set — sessions will not survive a restart.");
    }
  }
  return globalForSecret.__authSecret;
}

const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function encodeSession(user: PublicUser): string {
  const session: Session = { user, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    if (!session?.user?.id || session.exp < Date.now() / 1000) return null;
    return session;
  } catch {
    return null;
  }
}

/** Read the current session inside a Server Component or Route Handler. */
export function getSession(): Session | null {
  return decodeSession(cookies().get(SESSION_COOKIE)?.value);
}

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export function clearedSessionCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}

/** Only allow same-site relative redirects after sign-in. */
export function safeNextPath(next: string | null | undefined, fallback = "/account"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
