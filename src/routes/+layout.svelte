<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/brfavicon.png';
	import { page } from '$app/state';

	let { children } = $props();

	const isAdminRoute = $derived(
		page.url.pathname === '/admin' || page.url.pathname.startsWith('/admin/')
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Emporio B&R</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-50 text-gray-900">
	<!-- Header -->
	<header class="sticky top-0 z-20 bg-white shadow">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<div class="text-2xl font-bold text-indigo-600">Emporio Bread&Roses!</div>
			<nav class="space-x-4">
				{#if isAdminRoute}
					<a href="/admin/dashboard" class="text-gray-700 transition hover:text-indigo-600"
						>Dashboard</a
					>
					<a href="/admin/products" class="text-gray-700 transition hover:text-indigo-600"
						>Manage Products</a
					>
					<a href="/admin/orders" class="text-gray-700 transition hover:text-indigo-600">Orders</a>
					<a href="/admin/users" class="text-gray-700 transition hover:text-indigo-600">Users</a>
				{:else}
					<a href="/" class="text-gray-700 transition hover:text-indigo-600">Home</a>
					<a href="/products" class="text-gray-700 transition hover:text-indigo-600">Prodotti</a>
					<a href="/about" class="text-gray-700 transition hover:text-indigo-600">Chi siamo?</a>
					<a href="/contact" class="text-gray-700 transition hover:text-indigo-600">Contatti</a>
				{/if}
			</nav>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
		{@render children?.()}
	</main>

	<!-- Footer -->
	<footer class="mt-8 bg-white shadow-inner">
		<div class="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
			Bread & Roses {new Date().getFullYear()}. swag
		</div>
	</footer>
</div>
