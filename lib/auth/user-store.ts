/**
 * User Store — in-memory account persistence.
 *
 * Mirrors `lib/database/booking-store.ts`: a small async interface so a
 * Postgres/Neon/Supabase adapter can replace `MemoryUserStore` without
 * touching callers. Until then accounts live in process memory and are
 * lost on restart — connect DATABASE_URL before going live.
 */

import { randomBytes, randomUUID, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  /** scrypt hash stored as "salt:hash" (hex) — the password itself is never stored */
  passwordHash: string;
  createdAt: string;
}

export type PublicUser = Pick<User, "id" | "name" | "email" | "company" | "phone">;

export interface NewUser {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

export interface UserStore {
  create(input: NewUser): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
  getById(id: string): Promise<User | null>;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email, company: user.company, phone: user.phone };
}

class MemoryUserStore implements UserStore {
  private users = new Map<string, User>();
  private byEmail = new Map<string, string>();

  async create(input: NewUser): Promise<User> {
    const email = input.email.trim().toLowerCase();
    if (this.byEmail.has(email)) throw new Error("EMAIL_TAKEN");
    const user: User = {
      id: `usr_${randomUUID()}`,
      name: input.name.trim(),
      email,
      company: input.company?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      passwordHash: await hashPassword(input.password),
      createdAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    this.byEmail.set(email, user.id);
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const id = this.byEmail.get(email.trim().toLowerCase());
    return id ? this.users.get(id) ?? null : null;
  }

  async getById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }
}

/** Process-wide singleton (shared across route bundles and HMR via globalThis) */
const globalForUsers = globalThis as unknown as { __userStore?: UserStore };

export const userStore: UserStore = globalForUsers.__userStore ?? new MemoryUserStore();
globalForUsers.__userStore = userStore;
