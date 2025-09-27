import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getSettings } from '$lib/server/settings';

export type Product = {
  id: number;
  name: string;
  category: string;
  description?: string | null;
  price: number;
  media?: string | null;
  visible?: boolean;
};

export const load: PageServerLoad = async () => {
  const all = (await db.select().from(products).where(eq(products.visible, true))) as Product[];
  const categories = Array.from(new Set(all.map((p) => p.category).filter(Boolean))).sort();
  const settings = await getSettings();
  return {
    products: all,
    categories,
    ordersOpen: settings.ordersOpen
  };
};
