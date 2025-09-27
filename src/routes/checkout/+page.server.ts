import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, orders, orderItems } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { CartItem } from '$lib/stores/cart';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name') as string;
		const surname = data.get('surname') as string;
		const email = data.get('email') as string;
		const delivery = data.get('delivery') === 'true';
		const address = data.get('address') as string;
		const items = JSON.parse(data.get('items') as string) as CartItem[];

		// Basic validation
		if (!name || !surname || !email || (delivery && !address) || items.length === 0) {
			return fail(400, { error: 'Per favore, compila tutti i campi richiesti.' });
		}

		try {
			let userId: number;

			// Check if user exists, otherwise create them
			const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

			if (existingUser) {
				userId = existingUser.id;
				// Optionally update user info
				await db.update(users).set({ name, surname, address: delivery ? address : existingUser.address }).where(eq(users.id, userId));
			} else {
				const newUser = await db.insert(users).values({ name, surname, email, address: delivery ? address : null }).returning({ id: users.id });
				userId = newUser[0].id;
			}

			// Create the order
			const newOrder = await db.insert(orders).values({
				userId,
				delivery,
				isCompleted: false,
				createdAt: sql`CURRENT_TIMESTAMP`
			}).returning({ id: orders.id });

			const orderId = newOrder[0].id;

			// Add order items
			await db.insert(orderItems).values(
				items.map((item) => ({
					orderId,
					productId: item.id,
					quantity: item.quantity
				}))
			);

			return { success: true };

		} catch (e) {
			console.error(e);
			return fail(500, { error: "Si è verificato un errore durante la creazione dell'ordine. Riprova più tardi." });
		}
	}
};
