import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** GET /api/auth/me — the signed-in user, or null. */
export async function GET() {
  const session = getSession();
  return NextResponse.json(
    { user: session?.user ?? null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
