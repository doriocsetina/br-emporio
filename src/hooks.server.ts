import { validateSessionToken, sessionCookieName } from "$lib/server/auth";
import { applyAutoCloseIfDue } from "$lib/server/settings";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(sessionCookieName);

  if (token) {
    const { session } = await validateSessionToken(token);
    if (session && session.userId === "admin") {
      event.locals.admin = true; // TypeScript will now be happy
    }
  }

  // apply auto-close logic based on settings, non-blocking side effect
  try { await applyAutoCloseIfDue(); } catch {}
  return resolve(event);
};

// --- TypeScript augmentation ---
declare module "@sveltejs/kit" {
  interface Locals {
    admin?: boolean;
  }
}
