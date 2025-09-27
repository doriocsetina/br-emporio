import { writable, derived, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  media?: string | null;
  quantity: number;
};

const STORAGE_KEY = 'br_emporio_cart_v1';

function createCartStore() {
  let initial: CartItem[] = [];
  if (browser) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) initial = JSON.parse(raw);
    } catch {}
  }

  const items: Writable<CartItem[]> = writable(initial);

  if (browser) {
    items.subscribe((value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch {}
    });
  }

  function add(item: Omit<CartItem, 'quantity'>, qty = 1) {
    items.update((list) => {
      const idx = list.findIndex((p) => p.id === item.id);
      if (idx !== -1) {
        const next = [...list];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...list, { ...item, quantity: qty }];
    });
  }

  function setQuantity(id: number, qty: number) {
    items.update((list) => list.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p)));
  }

  function remove(id: number) {
    items.update((list) => list.filter((p) => p.id !== id));
  }

  function clear() {
    items.set([]);
  }

  const count = derived(items, ($items) => $items.reduce((sum, i) => sum + i.quantity, 0));
  const total = derived(items, ($items) => $items.reduce((sum, i) => sum + i.price * i.quantity, 0));

  return { items, add, setQuantity, remove, clear, count, total };
}

export const cart = createCartStore();
