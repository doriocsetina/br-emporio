// src/routes/admin/+layout.server.ts
import { redirect } from "@sveltejs/kit";

export const load = ({ locals, url }) => {
	// allow login page without session
	if (url.pathname === "/admin/login") return {};

	if (!locals.admin) {
		throw redirect(302, "/admin/login");
	}

	return { admin: true };
};
