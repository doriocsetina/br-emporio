<script lang="ts">
	import { cart } from '$lib/stores/cart';

	let { data } = $props();

	// cart API
	const { items, count, total, add, remove, setQuantity, clear } = cart;

	// filtering
	let selectedCategory = $state<string>('All');
	const categories = ['All', ...data.categories];
	let searchTerm = $state('');

	const filtered = $derived(
		data.products
			.filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
			.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	let showCart = $state(false);

	function addToCart(p: { id: number; name: string; price: number; media?: string | null }) {
		add({ id: p.id, name: p.name, price: p.price, media: p.media }, 1);
		showCart = true;
	}
	function formatPrice(n: number) {
		return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
	}
</script>

<div class="mx-auto max-w-7xl px-6 py-8">
  {#if !data.ordersOpen}
    <div class="mb-4 rounded border border-amber-300 bg-amber-50 p-3 text-amber-800">
      Gli ordini sono attualmente chiusi. Torna più tardi!
    </div>
  {/if}

  <!-- Top Bar: Title, Filters -->
  <div class="flex flex-col gap-4 pr-48 sm:flex-row sm:items-center sm:justify-between">
    <h1 class="text-3xl font-bold text-gray-800">Our Products</h1>

    <div class="flex items-center gap-4">
      <!-- Search Input -->
      <div class="flex items-center gap-2">
        <label for="search-input" class="text-sm text-gray-600">Search</label>
        <input
          id="search-input"
          type="text"
          bind:value={searchTerm}
          placeholder="Product name..."
          class="rounded border p-2"
        />
      </div>

      <!-- Category Filter -->
      <div class="flex items-center gap-2">
        <label for="category-select" class="text-sm text-gray-600">Category</label>
        <select id="category-select" bind:value={selectedCategory} class="rounded border p-2">
          {#each categories as c}
            <option value={c}>{c}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Fixed Cart Button/Dropdown (top-right) -->
  <div class="fixed top-24 right-6 z-30">
    <div class="relative">
      <button
        class="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700"
        onclick={() => (showCart = !showCart)}
        aria-haspopup="menu"
        aria-expanded={showCart}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 100 6 3 3 0 000-6zm9-9H6.606m9.894 0l-1.2 6.4a1.125 1.125 0 01-1.107.9H8.25m0 0L6.75 5.25m1.5 9h9.75a1.125 1.125 0 001.107-.9l1.2-6.4H6.75" />
        </svg>
        <span>Cart ({$count})</span>
        <span class="opacity-80">· {formatPrice($total)}</span>
      </button>

      {#if showCart}
        <div class="absolute right-0 mt-2 w-80 rounded border bg-white shadow-lg">
          <div class="max-h-80 overflow-auto">
            {#if $items.length === 0}
              <div class="p-4 text-sm text-gray-500">Your cart is empty.</div>
            {:else}
              {#each $items as it}
                <div class="flex items-center gap-3 border-b p-3 last:border-b-0">
                  {#if it.media}
                    <img src={it.media} alt={it.name} class="h-12 w-12 rounded object-cover" />
                  {/if}
                  <div class="min-w-0 flex-1">
                    <div class="truncate font-medium">{it.name}</div>
                    <div class="text-sm text-gray-500">
                      {formatPrice(it.price)} · Qty
                      <input
                        type="number"
                        min="1"
                        class="ml-1 w-16 rounded border px-1"
                        value={it.quantity}
                        onchange={(e) => setQuantity(it.id, Number((e.target as HTMLInputElement).value))}
                      />
                    </div>
                  </div>
                  <button class="text-sm text-red-600 hover:underline" onclick={() => remove(it.id)}>
                    Remove
                  </button>
                </div>
              {/each}
            {/if}
          </div>
          <div class="flex items-center justify-between border-t p-3">
            <div class="font-semibold">Total: {formatPrice($total)}</div>
            {#if data.ordersOpen}
              <a href="/checkout" class="rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700" onclick={() => (showCart = false)}>
                Vai al Checkout
              </a>
            {:else}
              <button class="cursor-not-allowed rounded bg-gray-300 px-3 py-2 text-gray-600" title="Ordini chiusi" disabled>
                Checkout non disponibile
              </button>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Product Grid -->
  <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each filtered as product}
      <div class="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg">
        {#if product.media}
          <img src={product.media} alt={product.name} class="h-44 w-full object-cover" />
        {/if}
        <div class="flex h-full flex-col p-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold">{product.name}</h3>
            <p class="text-sm text-gray-500">{product.category}</p>
            {#if product.description}
              <p class="mt-1 line-clamp-3 text-gray-700">{product.description}</p>
            {/if}
          </div>
          <div class="mt-3 flex items-center justify-between">
            <div class="font-bold">{formatPrice(product.price)}</div>
            <button class="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700" onclick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
