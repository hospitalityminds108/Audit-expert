import { addOns, getPlanBySlug } from "@/data/audit-plans";

/**
 * Pricing Engine — server-authoritative price calculation.
 * The client NEVER sends prices; it sends identifiers only
 * (plan slug, add-on ids, coupon code, location counts).
 * The engine recalculates everything from trusted data.
 */

export const GST_RATE = 0.18;

/** Coupons are defined server-side. Codes are case-insensitive. */
export interface CouponDef {
  code: string;
  type: "percent" | "flat";
  value: number;
  /** Minimum subtotal (₹) before discount applies */
  minAmount: number;
  /** Minimum locations required (multi-location coupons) */
  minLocations?: number;
  /** Cap on discount (₹) */
  maxDiscount: number;
  /** Only valid for single-location bookings */
  singleLocationOnly?: boolean;
  description: string;
  active: boolean;
}

export const COUPONS: CouponDef[] = [
  {
    code: "FIRSTAUDIT10",
    type: "percent",
    value: 10,
    minAmount: 10000,
    maxDiscount: 5000,
    description: "10% off your first audit (max ₹5,000)",
    active: true,
  },
  {
    code: "MULTILOC15",
    type: "percent",
    value: 15,
    minAmount: 100000,
    minLocations: 3,
    maxDiscount: 20000,
    description: "15% off multi-location programs (3+ locations, max ₹20,000)",
    active: true,
  },
  {
    code: "WELCOME2K",
    type: "flat",
    value: 2000,
    minAmount: 20000,
    singleLocationOnly: true,
    maxDiscount: 2000,
    description: "₹2,000 flat off single-location bookings above ₹20,000",
    active: true,
  },
];

export interface PricingInput {
  planSlug: string;
  locations?: number;
  addOnIds?: string[];
  couponCode?: string | null;
}

export interface PriceLine {
  id: string;
  label: string;
  detail?: string;
  amount: number;
}

export interface PricingResult {
  plan: { slug: string; name: string; categoryLabel: string; format: string };
  locations: number;
  lines: PriceLine[];
  subtotal: number;
  discount: number;
  discountLabel: string | null;
  gst: number;
  total: number;
  couponCode: string | null;
  couponError: string | null;
  totalInPaise: number;
}

export interface CouponCheckResult {
  valid: boolean;
  discount: number;
  description: string | null;
  error?: string;
}

/** Normalize and look up a coupon. Returns null if not found. */
export function findCoupon(rawCode: string): CouponDef | null {
  const code = rawCode.trim().toUpperCase();
  const def = COUPONS.find((c) => c.code === code && c.active);
  return def ?? null;
}

/** Evaluate a coupon against an order context. Pure function. */
export function evaluateCoupon(
  def: CouponDef,
  context: { subtotal: number; locations: number }
): CouponCheckResult {
  if (context.subtotal < def.minAmount) {
    return {
      valid: false,
      discount: 0,
      description: null,
      error: `Minimum order of ${formatInr(def.minAmount)} required.`,
    };
  }
  if (def.minLocations !== undefined && context.locations < def.minLocations) {
    return {
      valid: false,
      discount: 0,
      description: null,
      error: `Requires ${def.minLocations}+ locations.`,
    };
  }
  if (def.singleLocationOnly && context.locations > 1) {
    return {
      valid: false,
      discount: 0,
      description: null,
      error: "Valid for single-location bookings only.",
    };
  }
  const discount =
    def.type === "percent"
      ? Math.min(Math.round((context.subtotal * def.value) / 100), def.maxDiscount)
      : Math.min(def.value, def.maxDiscount, context.subtotal);
  return { valid: true, discount, description: def.description };
}

/**
 * Calculate the full price breakdown for a booking.
 * Throws on unknown plan. All amounts in ₹ (integers).
 */
export function calculatePrice(input: PricingInput): PricingResult {
  const plan = getPlanBySlug(input.planSlug);
  if (!plan) throw new Error(`Unknown plan: ${input.planSlug}`);

  const locations = Math.min(Math.max(input.locations ?? 1, 1), 20);
  const addOnIds = Array.from(new Set(input.addOnIds ?? []));

  // Multi-location volume rate on the per-location price
  const volumeRate = locations >= 5 ? 0.1 : locations >= 3 ? 0.05 : 0;
  const perLocationPrice = Math.round(plan.basePrice * (1 - volumeRate));
  const baseTotal = perLocationPrice * locations;

  const lines: PriceLine[] = [
    {
      id: "base",
      label: `${plan.name} × ${locations} ${locations === 1 ? "location" : "locations"}`,
      detail:
        volumeRate > 0
          ? `${Math.round(volumeRate * 100)}% multi-location rate applied`
          : `${formatInr(plan.basePrice)} base / location`,
      amount: baseTotal,
    },
  ];

  // Add-ons — "additional-location" is priced per extra location
  for (const id of addOnIds) {
    const addOn = addOns.find((a) => a.id === id);
    if (!addOn) continue;
    const times = id === "additional-location" ? Math.max(locations - 1, 0) : 1;
    const amount = addOn.price * times;
    if (amount > 0) {
      lines.push({
        id: `addon-${addOn.id}`,
        label: `${addOn.label}${times > 1 ? ` × ${times}` : ""}`,
        detail: addOn.description,
        amount,
      });
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  // Coupon — validated server-side against trusted definitions
  let discount = 0;
  let discountLabel: string | null = null;
  let couponError: string | null = null;
  let couponCode: string | null = null;

  const rawCode = input.couponCode?.trim() ?? "";
  if (rawCode.length > 0) {
    const def = findCoupon(rawCode);
    if (!def) {
      couponError = "Coupon code not recognized.";
    } else {
      const check = evaluateCoupon(def, { subtotal, locations });
      if (!check.valid) {
        couponError = check.error ?? "Coupon not applicable.";
      } else {
        discount = check.discount;
        discountLabel = check.description;
        couponCode = def.code;
      }
    }
  }

  const discounted = Math.max(subtotal - discount, 0);
  const gst = Math.round(discounted * GST_RATE);
  const total = discounted + gst;

  return {
    plan: {
      slug: plan.slug,
      name: plan.name,
      categoryLabel: plan.categoryLabel,
      format: plan.format,
    },
    locations,
    lines,
    subtotal,
    discount,
    discountLabel,
    gst,
    total,
    couponCode,
    couponError,
    totalInPaise: total * 100,
  };
}

export function formatInr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}
