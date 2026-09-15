/**
 * Rate limiting — fixed-window, in-memory.
 * Suitable for a single-instance deployment; swap for Redis
 * (Upstash) in multi-instance production. IP is extracted from
 * standard proxy headers by the API routes.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in window */
  remaining: number;
  /** Epoch ms when window resets */
  resetAt: number;
  /** Suggested Retry-After seconds */
  retryAfter: number;
}

/**
 * Consume one request from the bucket.
 * @param key     Unique key (e.g. `contact:1.2.3.4`)
 * @param limit   Max requests per window
 * @param windowMs Window length in ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    success: true,
    remaining: limit - bucket.count,
    resetAt: bucket.resetAt,
    retryAfter: 0,
  };
}

/** Extract client IP from request headers (Vercel/proxied setups) */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/** Housekeeping: drop expired buckets (call occasionally) */
export function pruneBuckets(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
