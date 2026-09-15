/**
 * Payment abstraction layer.
 *
 * Two providers:
 *  - RazorpayProvider — real Razorpay Orders API (server-side)
 *  - MockProvider     — deterministic demo mode (PAYMENT_PROVIDER=mock)
 *
 * Both implement `PaymentProvider`. The API routes never touch
 * provider internals; they call this interface only.
 */

export interface CreateOrderInput {
  /** Amount in paise (₹1 = 100 paise) — server-calculated only */
  amountInPaise: number;
  /** Booking reference, e.g. AE-2026-004821 */
  bookingReference: string;
  customer: { name: string; email: string; phone: string };
}

export interface OrderResult {
  provider: "razorpay" | "mock";
  orderId: string;
  amountInPaise: number;
  currency: string;
  /** Public key for Checkout initialization (razorpay only) */
  publicKey?: string;
  /** Mock provider: pre-validated signature for auto-verify */
  mockSignature?: string;
  /** Mock provider: the deterministic payment id paired with the signature */
  mockPaymentId?: string;
}

export interface VerifyInput {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyResult {
  verified: boolean;
  provider: "razorpay" | "mock";
  error?: string;
}

export interface PaymentProvider {
  readonly name: "razorpay" | "mock";
  createOrder(input: CreateOrderInput): Promise<OrderResult>;
  verifyPayment(input: VerifyInput): Promise<VerifyResult>;
}

/**
 * Verify a webhook payload signature (HMAC-SHA256 with webhook secret).
 * Used by /api/webhooks/razorpay for server-to-server events.
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex === signature;
}

/* ────────────────────────────────────────────────────────────
   Razorpay provider (real)
   ──────────────────────────────────────────────────────────── */

export class RazorpayProvider implements PaymentProvider {
  readonly name = "razorpay" as const;
  private keyId = process.env.RAZORPAY_KEY_ID ?? "";
  private keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";

  async createOrder(input: CreateOrderInput): Promise<OrderResult> {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: input.amountInPaise,
        currency: "INR",
        receipt: input.bookingReference,
        notes: {
          booking_reference: input.bookingReference,
          customer_name: input.customer.name,
          customer_email: input.customer.email,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Razorpay order creation failed: ${res.status} ${text}`);
    }

    const data = (await res.json()) as { id: string; amount: number; currency: string };
    return {
      provider: "razorpay",
      orderId: data.id,
      amountInPaise: data.amount,
      currency: data.currency,
      publicKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment(input: VerifyInput): Promise<VerifyResult> {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return { verified: false, provider: "razorpay", error: "Razorpay not configured" };

    // Razorpay checkout signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const payload = `${input.orderId}|${input.paymentId}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expected = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const verified = expected === input.signature;
    return {
      verified,
      provider: "razorpay",
      error: verified ? undefined : "Signature verification failed",
    };
  }
}

/* ────────────────────────────────────────────────────────────
   Mock provider (demo mode)
   ──────────────────────────────────────────────────────────── */

/**
 * Mock mode exists so the full booking → payment → verification →
 * confirmation flow can be demonstrated end-to-end without real
 * credentials. `mockSignature` is derived from the same HMAC
 * scheme with a demo secret so verification logic is exercised.
 */
const MOCK_SECRET = "auditexpert-mock-secret";

export async function hmacHex(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export class MockProvider implements PaymentProvider {
  readonly name = "mock" as const;

  async createOrder(input: CreateOrderInput): Promise<OrderResult> {
    const orderId = `order_mock_${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
    const paymentId = paymentIdFor(orderId);
    return {
      provider: "mock",
      orderId,
      amountInPaise: input.amountInPaise,
      currency: "INR",
      // Pre-computed signature lets the mock checkout auto-verify server-side
      mockPaymentId: paymentId,
      mockSignature: await hmacHex(MOCK_SECRET, `${orderId}|${paymentId}`),
    };
  }

  async verifyPayment(input: VerifyInput): Promise<VerifyResult> {
    const expected = await hmacHex(MOCK_SECRET, `${input.orderId}|${input.paymentId}`);
    const verified = expected === input.signature;
    return {
      verified,
      provider: "mock",
      error: verified ? undefined : "Mock signature verification failed",
    };
  }
}

/** Deterministic mock payment id for a given order */
function paymentIdFor(orderId: string): string {
  return `pay_mock_${orderId.replace("order_mock_", "")}`;
}

export function getMockPaymentId(orderId: string): string {
  return paymentIdFor(orderId);
}

/* ────────────────────────────────────────────────────────────
   Provider selection
   ──────────────────────────────────────────────────────────── */

const globalForPayments = globalThis as unknown as {
  __paymentProvider?: PaymentProvider;
};

export function getPaymentProvider(): PaymentProvider {
  if (globalForPayments.__paymentProvider) {
    return globalForPayments.__paymentProvider;
  }
  const provider =
    process.env.PAYMENT_PROVIDER === "razorpay" ? new RazorpayProvider() : new MockProvider();
  globalForPayments.__paymentProvider = provider;
  return provider;
}

export const activeProviderName = (): "razorpay" | "mock" =>
  process.env.PAYMENT_PROVIDER === "razorpay" ? "razorpay" : "mock";
