import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, orders, orderItems } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { CartItem } from '$lib/stores/cart';
import type { PageServerLoad } from './$types';
import { getSettings } from '$lib/server/settings';
export const load: PageServerLoad = async () => {
  const settings = await getSettings();
  return { ordersOpen: settings.ordersOpen };
};

export const actions = {
  default: async ({ request }: { request: Request }) => {
    const settings = await getSettings();
    if (!settings.ordersOpen) {
      return fail(400, { error: 'Gli ordini sono attualmente chiusi.' });
    }

    const data = await (request as any).formData();
    const name = data.get('name') as string;
    const surname = data.get('surname') as string;
    const email = data.get('email') as string;
    const delivery = data.get('delivery') === 'true';
    const address = data.get('address') as string;
    const items = JSON.parse(data.get('items') as string) as CartItem[];

    if (!name || !surname || !email || (delivery && !address) || items.length === 0) {
      return fail(400, { error: 'Per favore, compila tutti i campi richiesti.' });
    }

    try {
      let userId: number;
      const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });

      if (existingUser) {
        userId = existingUser.id;
        await db
          .update(users)
          .set({ name, surname, address: delivery ? address : existingUser.address })
          .where(eq(users.id, userId));
      } else {
        const newUser = await db
          .insert(users)
          .values({ name, surname, email, address: delivery ? address : null })
          .returning({ id: users.id });
        userId = newUser[0].id;
      }

      const newOrder = await db
        .insert(orders)
        .values({ userId, delivery, isCompleted: false, createdAt: sql`CURRENT_TIMESTAMP` })
        .returning({ id: orders.id });
      const orderId = newOrder[0].id;

      await db.insert(orderItems).values(
        items.map((item) => ({ orderId, productId: item.id, quantity: item.quantity }))
      );

      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { error: "Si è verificato un errore durante la creazione dell'ordine. Riprova più tardi." });
    }
  }
};
