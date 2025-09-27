<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	export let data: PageData;

	let editId: number | null = null;
	let form: any = { name: '', category: '', description: '', price: '', media: '' };
	let isSaving = false;

	type Product = {
		id: number;
		name: string;
		category: string;
		description?: string | null;
		price: number;
		media?: string | null;
		visible: boolean;
	};

	const resetForm = () => {
		form = { name: '', category: '', description: '', price: '', media: '' };
		editId = null;
	};

	const setEdit = (product: Product) => {
		editId = product.id;
		form = {
			name: product.name,
			category: product.category,
			description: product.description,
			price: product.price,
			media: product.media
		};
	};
</script>

<div class="mx-auto max-w-7xl space-y-6 p-6">
	<h1 class="text-3xl font-bold text-gray-800">Products</h1>

	<!-- Add/Edit Form -->
	<div class="w-full rounded-lg bg-white p-6 shadow-md md:w-1/2">
		<h2 class="mb-4 text-xl font-semibold">{editId ? 'Edit Product' : 'Add Product'}</h2>
		<form
			class="space-y-4"
			method="POST"
			action={editId ? '?/edit' : '?/add'}
			use:enhance={(submit) => {
				isSaving = true;
				return ({ result, update }) => {
					isSaving = false;
					if (result.type === 'success') {
						resetForm();
						update(); // re-run load to refresh products
					} else if (result.type === 'failure' && result.data?.error) {
						alert(result.data.error);
					}
				};
			}}
		>
			{#if editId}
				<input type="hidden" name="id" value={editId} />
			{/if}
			<input
				name="name"
				type="text"
				placeholder="Name"
				bind:value={form.name}
				class="w-full rounded border p-2"
				required
				disabled={isSaving}
				aria-disabled={isSaving}
			/>
			<input
				name="category"
				type="text"
				placeholder="Category"
				bind:value={form.category}
				class="w-full rounded border p-2"
				required
				disabled={isSaving}
				aria-disabled={isSaving}
			/>
			<input
				name="description"
				type="text"
				placeholder="Description"
				bind:value={form.description}
				class="w-full rounded border p-2"
				disabled={isSaving}
				aria-disabled={isSaving}
			/>
			<input
				name="price"
				type="number"
				step="0.01"
				min="0"
				inputmode="decimal"
				placeholder="Price"
				bind:value={form.price}
				class="w-full rounded border p-2"
				required
				disabled={isSaving}
				aria-disabled={isSaving}
			/>
			<input
				name="media"
				type="text"
				placeholder="Media URL"
				bind:value={form.media}
				class="w-full rounded border p-2"
				disabled={isSaving}
				aria-disabled={isSaving}
			/>
			<div class="flex space-x-2">
				<button
					type="submit"
					class="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={isSaving}
					aria-busy={isSaving}
				>
					{#if isSaving}
						<svg
							class="h-4 w-4 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							></path>
						</svg>
						Saving...
					{:else}
						{editId ? 'Update' : 'Add'}
					{/if}
				</button>
				{#if editId}
					<button
						type="button"
						on:click={resetForm}
						class="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
						disabled={isSaving}>Cancel</button
					>
				{/if}
			</div>
		</form>
	</div>

	<!-- Products Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each data.products as product}
			<div class="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-lg">
				{#if product.media}
					<img src={product.media} alt={product.name} class="h-40 w-full object-cover" />
				{/if}
				<div class="p-4">
					<h3 class="text-lg font-semibold">{product.name}</h3>
					<p class="text-sm text-gray-500">{product.category}</p>
					<p class="mt-1 text-gray-700">{product.description}</p>
					<p class="mt-2 font-bold">${product.price.toFixed(2)}</p>
					<div class="mt-3 flex flex-wrap items-center gap-2">
						<form
							method="POST"
							action="?/toggleVisible"
							use:enhance={() => ({ result, update }) => { if (result.type === 'success') update(); }}
							class="inline-flex items-center gap-2"
						>
							<input type="hidden" name="id" value={product.id} />
							<label class="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									name="visible"
									checked={product.visible}
									on:change={(e) => (e.currentTarget.form as HTMLFormElement)?.requestSubmit()}
								/>
								<span class={product.visible ? 'text-emerald-700' : 'text-gray-500'}>
									{product.visible ? 'Visible in catalog' : 'Hidden from catalog'}
								</span>
							</label>
						</form>
						<button
							on:click={() => setEdit(product)}
							class="rounded bg-yellow-400 px-2 py-1 text-sm text-white hover:bg-yellow-500"
						>
							Edit
						</button>
						<form
							method="POST"
							action="?/delete"
							use:enhance={(submit) =>
								({ result, update }) => {
									if (result.type === 'success') update();
								}}
							class="inline"
						>
							<input type="hidden" name="id" value={product.id} />
							<button
								type="submit"
								class="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
							>
								Delete
							</button>
						</form>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
