import { db } from "$lib/server/db";
import { products } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

// Shape of a single product
type Product = {
	id: number;
	name: string;
	category: string;
	description?: string | null;
	price: number;
	media?: string | null;
};

// Load function
export const load: PageServerLoad = async () => {
	const allProducts: Product[] = await db.select().from(products);
	return { products: allProducts };
};

// Actions
export const actions: Actions = {
	add: async ({ request }) => {
		const form = await request.formData();
		const name = form.get("name")?.toString();
		const category = form.get("category")?.toString();
		const description = form.get("description")?.toString();
		const price = parseFloat(form.get("price") as string);
		const media = form.get("media")?.toString();

		if (!name || !category || isNaN(price)) return fail(400, { error: "Missing fields" });

		await db.insert(products).values({ name, category, description, price, media });
		return { success: true };
	},

	edit: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get("id"));
		const name = form.get("name")?.toString();
		const category = form.get("category")?.toString();
		const description = form.get("description")?.toString();
		const price = parseFloat(form.get("price") as string);
		const media = form.get("media")?.toString();

		if (!id || !name || !category || isNaN(price)) return fail(400, { error: "Invalid fields" });

		await db
			.update(products)
			.set({ name, category, description, price, media })
			.where(eq(products.id, id));

		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = Number(form.get("id"));
		if (!id) return fail(400, { error: "Missing id" });

		await db.delete(products).where(eq(products.id, id));
		return { success: true };
	}
};
