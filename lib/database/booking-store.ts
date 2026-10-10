/**
 * Booking Store — in-memory booking persistence.
 *
 * This is a deliberate abstraction: swap `MemoryBookingStore` for a
 * Postgres/Neon/Supabase adapter by implementing `BookingStore`.
 * The API surface is intentionally small and async so a real DB
 * drops in without touching callers.
 */

import { randomUUID } from "node:crypto";

export type BookingStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "REPORTED"
  | "COMPLETED"
  | "CANCELLED"
  | "PAYMENT_FAILED";

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface SchedulingInfo {
  preferredDate: string;
  preferredSlot: string;
  notes?: string;
}

export interface PricingSnapshot {
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  totalInPaise: number;
}

export interface PaymentInfo {
  provider: string;
  orderId?: string;
  paymentId?: string;
  signature?: string;
  verified: boolean;
  attempts: number;
  lastAttemptAt?: string;
}

export interface Booking {
  id: string;
  reference: string;
  status: BookingStatus;
  planSlug: string;
  planName: string;
  locations: number;
  addOnIds: string[];
  couponCode: string | null;
  /** Server-calculated pricing snapshot at order time */
  pricing: PricingSnapshot;
  customer: CustomerInfo;
  scheduling: SchedulingInfo;
  payment: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDraft {
  planSlug: string;
  planName: string;
  locations: number;
  addOnIds: string[];
  couponCode: string | null;
  pricing: PricingSnapshot;
  customer: CustomerInfo;
  scheduling: SchedulingInfo;
}

export interface BookingStore {
  create(draft: BookingDraft): Promise<Booking>;
  get(id: string): Promise<Booking | null>;
  getByReference(ref: string): Promise<Booking | null>;
  update(id: string, patch: Partial<Booking>): Promise<Booking | null>;
  /** Find a booking by payment order id (for webhook idempotency) */
  getByPaymentOrderId(orderId: string): Promise<Booking | null>;
  /** Bookings made with a given customer email, newest first */
  listByEmail(email: string): Promise<Booking[]>;
}

/**
 * Booking reference format: AE-YYYY-XXXXXX
 * Six digits, zero-padded, time-informed to stay near-monotonic.
 */
export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const timePart = Date.now() % 1000000;
  const sixDigits = String(timePart).padStart(6, "0").slice(0, 6);
  return `AE-${year}-${sixDigits}`;
}

class MemoryBookingStore implements BookingStore {
  private bookings = new Map<string, Booking>();

  async create(draft: BookingDraft): Promise<Booking> {
    const id = `bk_${randomUUID()}`;
    const now = new Date().toISOString();
    const booking: Booking = {
      id,
      reference: generateBookingReference(),
      status: "PENDING_PAYMENT",
      ...draft,
      payment: {
        provider: "unassigned",
        verified: false,
        attempts: 0,
      },
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async get(id: string): Promise<Booking | null> {
    return this.bookings.get(id) ?? null;
  }

  async getByReference(ref: string): Promise<Booking | null> {
    for (const b of this.bookings.values()) {
      if (b.reference === ref) return b;
    }
    return null;
  }

  async getByPaymentOrderId(orderId: string): Promise<Booking | null> {
    for (const b of this.bookings.values()) {
      if (b.payment.orderId === orderId) return b;
    }
    return null;
  }

  async listByEmail(email: string): Promise<Booking[]> {
    const needle = email.trim().toLowerCase();
    return [...this.bookings.values()]
      .filter((b) => b.customer.email.trim().toLowerCase() === needle)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async update(id: string, patch: Partial<Booking>): Promise<Booking | null> {
    const booking = this.bookings.get(id);
    if (!booking) return null;
    const updated: Booking = { ...booking, ...patch, updatedAt: new Date().toISOString() };
    this.bookings.set(id, updated);
    return updated;
  }
}

/**
 * Process-wide singleton. Kept on globalThis in every environment: route
 * handlers are bundled separately, so a module-level instance would give
 * create-order and verify different stores and lose the booking between them.
 */
const globalForStore = globalThis as unknown as { __bookingStore?: BookingStore };

export const bookingStore: BookingStore =
  globalForStore.__bookingStore ?? new MemoryBookingStore();

globalForStore.__bookingStore = bookingStore;
