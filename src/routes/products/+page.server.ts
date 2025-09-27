import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';

export type Product = {
  id: number;
  name: string;
  category: string;
  description?: string | null;
  price: number;
  media?: string | null;
};

export const load: PageServerLoad = async () => {
  const all = (await db.select().from(products)) as Product[];
  const categories = Array.from(new Set(all.map((p) => p.category).filter(Boolean))).sort();
  return {
    products: all,
    categories
  };
};
