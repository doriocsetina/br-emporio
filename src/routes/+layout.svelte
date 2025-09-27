<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/brfavicon.png';
	import { page } from '$app/state';

	let { children } = $props();

	const isAdminRoute = $derived(page.url.pathname === '/admin' || page.url.pathname.startsWith('/admin/'));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Emporio B&R</title>
</svelte:head>

<div class="flex flex-col min-h-screen bg-gray-50 text-gray-900">

	<!-- Header -->
	<header class="sticky top-0 z-20 bg-white shadow">
		<div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
			<div class="text-2xl font-bold text-indigo-600">Emporio Bread&Roses!</div>
			<nav class="space-x-4">
				{#if isAdminRoute}
					<a href="/admin/dashboard" class="text-gray-700 hover:text-indigo-600 transition">Dashboard</a>
					<a href="/admin/products" class="text-gray-700 hover:text-indigo-600 transition">Manage Products</a>
					<a href="/admin/orders" class="text-gray-700 hover:text-indigo-600 transition">Orders</a>
					<a href="/admin/users" class="text-gray-700 hover:text-indigo-600 transition">Users</a>
				{:else}
					<a href="/" class="text-gray-700 hover:text-indigo-600 transition">Home</a>
					<a href="/products" class="text-gray-700 hover:text-indigo-600 transition">Prodotti</a>
					<a href="/about" class="text-gray-700 hover:text-indigo-600 transition">Chi siamo?</a>
					<a href="/contact" class="text-gray-700 hover:text-indigo-600 transition">Contatti</a>
				{/if}
			</nav>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
		{@render children?.()}
	</main>

	<!-- Footer -->
	<footer class="bg-white shadow-inner mt-8">
		<div class="max-w-7xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
			Bread & Roses {new Date().getFullYear()}. swag
		</div>
	</footer>
</div>
