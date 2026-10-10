import { NextResponse } from "next/server";
import { clearedSessionCookie } from "@/lib/auth/session";

/** POST /api/auth/logout — clears the session cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearedSessionCookie());
  return res;
}
