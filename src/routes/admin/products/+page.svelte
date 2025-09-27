<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types';
	export let data: PageData;

	let editId: number | null = null;
	let form: any = { name: '', category: '', description: '', price: '', media: '' };

	type Product = {
		id: number;
		name: string;
		category: string;
		description?: string | null;
		price: number;
		media?: string | null;
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
			description: product.description, // ❌ optional
			price: product.price,
			media: product.media // ❌ optional
		};
	};

	const handleSubmit = async (event: Event, action: string) => {
		event.preventDefault();
		const formData = new FormData();
		if (editId) formData.append('id', editId.toString());
		formData.append('name', form.name);
		formData.append('category', form.category);
		formData.append('description', form.description);
		formData.append('price', form.price.toString());
		formData.append('media', form.media);

		const response = await fetch(`?/${action}`, { method: 'POST', body: formData });
		if (response.ok) {
			resetForm();
			await invalidate(window.location.pathname);
		} else {
			const data = await response.json();
			alert(data.error ?? 'Something went wrong');
		}
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this product?')) return;

		const formData = new FormData();
		formData.append('id', id.toString());
		const response = await fetch('?/delete', { method: 'POST', body: formData });
		if (response.ok) await invalidate(window.location.pathname);
	};
</script>

<div class="max-w-7xl mx-auto p-6 space-y-6">
  <h1 class="text-3xl font-bold text-gray-800">Products</h1>

  <!-- Add/Edit Form -->
  <div class="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2">
    <h2 class="text-xl font-semibold mb-4">{editId ? 'Edit Product' : 'Add Product'}</h2>
    <form class="space-y-4" on:submit={(e) => handleSubmit(e, editId ? 'edit' : 'add')}>
      <input type="text" placeholder="Name" bind:value={form.name} class="w-full p-2 border rounded" required />
      <input type="text" placeholder="Category" bind:value={form.category} class="w-full p-2 border rounded" required />
      <input type="text" placeholder="Description" bind:value={form.description} class="w-full p-2 border rounded" />
      <input type="number" placeholder="Price" bind:value={form.price} class="w-full p-2 border rounded" required />
      <input type="text" placeholder="Media URL" bind:value={form.media} class="w-full p-2 border rounded" />
      <div class="flex space-x-2">
        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          {editId ? 'Update' : 'Add'}
        </button>
        {#if editId}
          <button type="button" on:click={resetForm} class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        {/if}
      </div>
    </form>
  </div>

  <!-- Products Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#each data.products as product}
      <div class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
        {#if product.media}
          <img src={product.media} alt={product.name} class="w-full h-40 object-cover" />
        {/if}
        <div class="p-4">
          <h3 class="text-lg font-semibold">{product.name}</h3>
          <p class="text-sm text-gray-500">{product.category}</p>
          <p class="text-gray-700 mt-1">{product.description}</p>
          <p class="mt-2 font-bold">${product.price.toFixed(2)}</p>
          <div class="flex space-x-2 mt-3">
            <button on:click={() => setEdit(product)} class="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm">
              Edit
            </button>
            <button on:click={() => handleDelete(product.id)} class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

