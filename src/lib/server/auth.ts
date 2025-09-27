// src/lib/server/auth.ts
import type { RequestEvent } from "@sveltejs/kit";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "$lib/server/db";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";

// --- schema for sessions ---
export const session = sqliteTable("sessions", {
  id: text("id").primaryKey(), // hex of sha256(token)
  userId: text("user_id").notNull(), // "admin"
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull()
});

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const sessionCookieName = "auth-session";

// --- token generation ---
export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return encodeBase64url(bytes);
}

// --- create session ---
export async function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
  await db.insert(session).values({
    id: sessionId,
    userId,
    expiresAt
  });
  return { id: sessionId, userId, expiresAt };
}

// --- validate session ---
export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await db.select().from(session).where(eq(session.id, sessionId));

  if (!result) return { session: null };

  const expired = Date.now() >= result.expiresAt.getTime();
  if (expired) {
    await db.delete(session).where(eq(session.id, result.id));
    return { session: null };
  }

  // renew if less than 15 days left
  if (Date.now() >= result.expiresAt.getTime() - DAY_IN_MS * 15) {
    result.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
    await db
      .update(session)
      .set({ expiresAt: result.expiresAt })
      .where(eq(session.id, result.id));
  }

  return { session: result };
}

// --- invalidate session ---
export async function invalidateSession(sessionId: string) {
  await db.delete(session).where(eq(session.id, sessionId));
}

// --- cookie helpers ---
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
  event.cookies.set(sessionCookieName, token, {
    expires: expiresAt,
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true
  });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
  event.cookies.delete(sessionCookieName, { path: "/" });
}
