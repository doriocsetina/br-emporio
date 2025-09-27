import { ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private';
import { fail, redirect } from "@sveltejs/kit";
import {
  createSession,
  setSessionTokenCookie,
  generateSessionToken
} from "$lib/server/auth";

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    console.log("username + password:", ADMIN_USERNAME, ADMIN_PASSWORD );
    console.log("username + password given:", username, password );

    if (
      username !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      return fail(400, { error: "Invalid credentials" });
    }

    console.log("generated cookie:");
    const token = generateSessionToken();
    const session = await createSession(token, "admin");
    setSessionTokenCookie({ cookies } as any, token, session.expiresAt);

    throw redirect(302, "/admin");
  }
};
