<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Emporio B&R</title>
</svelte:head>

<div class="flex flex-col min-h-screen bg-gray-50 text-gray-900">

	<!-- Header -->
	<header class="bg-white shadow">
		<div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
			<div class="text-2xl font-bold text-indigo-600">Emporio Bread&Roses!</div>
			<nav class="space-x-4">
				<a href="/" class="text-gray-700 hover:text-indigo-600 transition">Home</a>
				<a href="/products" class="text-gray-700 hover:text-indigo-600 transition">Products</a>
				<a href="/about" class="text-gray-700 hover:text-indigo-600 transition">About</a>
				<a href="/contact" class="text-gray-700 hover:text-indigo-600 transition">Contact</a>
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
			&copy; {new Date().getFullYear()} MyShop. All rights reserved.
		</div>
	</footer>
</div>
