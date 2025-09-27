import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, orders, orderItems, products } from '$lib/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

function weekKeyToLabel(weekKey: string) {
	// weekKey is in the form YYYY-WW
	const [y, w] = weekKey.split('-').map((v) => Number(v));
	return `Settimana ${w} · ${y}`;
}

export const load: PageServerLoad = async ({ url }) => {
	// Get list of distinct weeks that have orders, newest first
	const weekRows = await db
		.select({
			week: sql<string>`strftime('%Y-%W', ${orders.createdAt})`
		})
		.from(orders)
		.groupBy(sql`strftime('%Y-%W', ${orders.createdAt})`)
		.orderBy(sql`strftime('%Y-%W', ${orders.createdAt}) DESC`);

	const weeks = weekRows.map((r) => r.week).filter(Boolean);

	const selectedWeek = url.searchParams.get('week') || weeks[0] || '';

	let ordersData: Array<{
		id: number;
		createdAt: string | null;
		customerName: string | null;
		email: string | null;
		delivery: boolean;
		address: string | null;
		total: number; // computed from items
		isCompleted?: boolean;
		paidTotal?: number | null;
		items: Array<{ productName: string; quantity: number; price: number }>;
	}> = [];

	if (selectedWeek) {
		// Fetch flattened rows for the selected week (one row per order-item)
		const rows = await db
			.select({
				orderId: orders.id,
				createdAt: orders.createdAt,
				delivery: orders.delivery,
				isCompleted: orders.isCompleted,
				paidTotal: orders.total,
				userName: users.name,
				userSurname: users.surname,
				email: users.email,
				address: users.address,
				productName: products.name,
				price: products.price,
				quantity: orderItems.quantity
			})
			.from(orders)
			.leftJoin(users, eq(users.id, orders.userId))
			.leftJoin(orderItems, eq(orderItems.orderId, orders.id))
			.leftJoin(products, eq(products.id, orderItems.productId))
			.where(
				and(
					sql`strftime('%Y-%W', ${orders.createdAt}) = ${selectedWeek}`
				)
			)
			.orderBy(sql`${orders.createdAt} DESC`);

		// Aggregate into orders with items lists and totals
		const map = new Map<number, (typeof ordersData)[number]>();
		for (const r of rows) {
			let o = map.get(r.orderId);
			if (!o) {
				o = {
					id: r.orderId,
					createdAt: r.createdAt ?? null,
					customerName: [r.userName, r.userSurname].filter(Boolean).join(' ') || null,
					email: r.email ?? null,
					delivery: !!r.delivery,
					address: r.address ?? null,
					total: 0,
					isCompleted: !!r.isCompleted,
					paidTotal: r.paidTotal ?? null,
					items: []
				};
				map.set(r.orderId, o);
			}
			if (r.productName) {
				o.items.push({ productName: r.productName, quantity: r.quantity ?? 0, price: r.price ?? 0 });
				o.total += (r.price ?? 0) * (r.quantity ?? 0);
			}
		}
		ordersData = Array.from(map.values());
	}

	return {
		weeks: weeks.map((w) => ({ key: w, label: weekKeyToLabel(w) })),
		selectedWeek,
		orders: ordersData
	};
};

export const actions: Actions = {
  markPaid: async ({ request }) => {
    const form = await request.formData();
    const id = Number(form.get('id'));
    const totalStr = form.get('total');
    const total = totalStr != null ? parseFloat(String(totalStr).replace(',', '.')) : NaN;

    if (!id || isNaN(total) || total <= 0) {
      return { error: 'Totale non valido' } as const;
    }

    await db
      .update(orders)
      .set({ total, isCompleted: true })
      .where(eq(orders.id, id));

    return { success: true } as const;
  }
};
