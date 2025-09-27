import { env } from '$env/dynamic/private';
import { fail, redirect } from "@sveltejs/kit";
import {
  createSession,
  setSessionTokenCookie,
  generateSessionToken
} from "$lib/server/auth";

const adminUsername = env.ADMIN_USERNAME;
const adminPassword = env.ADMIN_PASSWORD;

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");

    if (
      username !== adminUsername ||
      password !== adminPassword
    ) {
      return fail(400, { error: "Invalid credentials" });
    }

    console.log("generated cookie.");
    const token = generateSessionToken();
    const session = await createSession(token, "admin");
    setSessionTokenCookie({ cookies } as any, token, session.expiresAt);

    throw redirect(302, "/admin");
  }
};
