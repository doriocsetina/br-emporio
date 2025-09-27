<script lang="ts">
	import { cart } from '$lib/stores/cart';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	let { data } = $props();
	const { items, total, clear } = cart;

	let delivery = $state(false);

	// Track the current form state from the $app/stores `page` store using Svelte 5 runes
	let form = $state<any>(null);
	$effect(() => {
		const unsubscribe = page.subscribe(($p) => {
			form = $p.form;
			if ($p.form?.success) {
				clear();
			}
		});
		return unsubscribe;
	});

	function formatPrice(n: number) {
		return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
	}

</script>

<div class="mx-auto max-w-4xl px-6 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-4xl font-bold text-gray-800">Checkout</h1>
		<a href="/products" class="rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50">← Torna allo shopping</a>
	</div>
	{#if !data.ordersOpen}
		<div class="mb-4 rounded border border-amber-300 bg-amber-50 p-3 text-amber-800">
			Gli ordini sono attualmente chiusi. Il checkout è disabilitato.
		</div>
	{/if}

	{#if form?.success}
		<div class="rounded-lg bg-green-100 p-6 text-center text-green-800">
			<h2 class="text-2xl font-semibold">Grazie per il tuo ordine!</h2>
			<p class="mt-2">Abbiamo ricevuto il tuo ordine e lo stiamo elaborando. Riceverai presto una mail di conferma.</p>
			<a href="/products" class="mt-4 inline-block text-indigo-600 hover:underline">Torna ai prodotti</a>
		</div>
	{:else if $items.length === 0}
		<div class="text-center text-gray-500">
			<p>Il tuo carrello è vuoto.</p>
			<a href="/products" class="text-indigo-600 hover:underline">Torna ai prodotti per aggiungerne</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
			<!-- Order Summary -->
			<div>
				<h2 class="mb-4 text-2xl font-semibold">Riepilogo Ordine</h2>
				<div class="space-y-4 rounded-lg border bg-white p-6">
					{#each $items.filter(Boolean) as item}
						<div class="flex items-center justify-between">
							<div>
								<p class="font-medium">{item.name}</p>
								<p class="text-sm text-gray-500">Quantità: {item.quantity}</p>
							</div>
							<p>{formatPrice(item.price * item.quantity)}</p>
						</div>
					{/each}
					<div class="flex justify-between border-t pt-4 font-bold">
						<p>Totale</p>
						<p>{formatPrice($total)}</p>
					</div>
				</div>
			</div>

			<!-- Order Form -->
			<div>
				<h2 class="mb-4 text-2xl font-semibold">I tuoi dati</h2>
				<form method="POST" use:enhance class="space-y-6 rounded-lg border bg-white p-6">
					<input type="hidden" name="items" value={JSON.stringify($items)} />
					<fieldset class="grid grid-cols-1 gap-6 sm:grid-cols-2" disabled={!data.ordersOpen}>
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
							<input type="text" id="name" name="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
						</div>
						<div>
							<label for="surname" class="block text-sm font-medium text-gray-700">Cognome</label>
							<input type="text" id="surname" name="surname" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
						</div>
					</fieldset>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled={!data.ordersOpen} />
					</div>

					<!-- Delivery Options -->
					<div class="flex items-center gap-8" aria-disabled={!data.ordersOpen}>
						<label class="flex items-center">
							<input type="radio" name="delivery" bind:group={delivery} value={false} class="h-4 w-4 text-indigo-600" disabled={!data.ordersOpen} />
							<span class="ml-2 text-sm text-gray-700">Ritiro in sede</span>
						</label>
						<label class="flex items-center">
							<input type="radio" name="delivery" bind:group={delivery} value={true} class="h-4 w-4 text-indigo-600" disabled={!data.ordersOpen} />
							<span class="ml-2 text-sm text-gray-700">Consegna a domicilio</span>
						</label>
					</div>

					{#if delivery}
						<div>
							<label for="address" class="block text-sm font-medium text-gray-700">Indirizzo</label>
							<textarea id="address" name="address" rows="3" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled={!data.ordersOpen}></textarea>
						</div>
					{/if}
					{#if form?.error}
						<p class="text-sm text-red-600">{form.error}</p>
					{/if}

					<button
						type="submit"
						class="w-full rounded-md px-4 py-3 font-semibold text-white shadow-sm"
						class:bg-indigo-600={data.ordersOpen}
						class:hover:bg-indigo-700={data.ordersOpen}
						class:bg-gray-400={!data.ordersOpen}
						disabled={!data.ordersOpen}
					>
						Invia Ordine
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>