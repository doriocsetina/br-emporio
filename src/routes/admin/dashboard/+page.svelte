<script lang="ts">
  import { enhance } from '$app/forms';
  let { data } = $props();
  let settings = $state(data.settings);
  let toggling = $state(false);
</script>

<div class="max-w-7xl mx-auto p-6 space-y-8">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-gray-800">Welcome to the Admin Dashboard</h1>
    <a href="/admin/logout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</a>
  </div>

  <div class="rounded-lg bg-white p-6 shadow">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Stato ordini</h2>
        {#if settings.ordersOpen}
          <p class="text-sm text-emerald-700">Gli ordini sono APERTI</p>
        {:else}
          <p class="text-sm text-red-700">Gli ordini sono CHIUSI</p>
        {/if}
      </div>
      <form
        method="POST"
        action="?/toggleOpen"
        use:enhance={(opts) => {
          // Set loading state immediately when the form is submitted
          toggling = true;
          // Return a result handler per SvelteKit v2 enhance() typing
          return async ({ result, update }) => {
            toggling = false;
            if (result.type === 'success') {
              // Update local settings immediately for a snappy UI
              // The action returns `{ success: true, settings }`
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              settings = (result.data as any).settings;
              // Also update the page data so the rest of the route stays in sync
              await update();
            }
          };
        }}
      >
        <button
          class={`inline-flex items-center gap-2 rounded px-4 py-2 text-white shadow transition ${settings.ordersOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          disabled={toggling}
        >
          {#if toggling}
            <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          {/if}
          {settings.ordersOpen ? 'Chiudi ordini' : 'Apri ordini'}
        </button>
      </form>
    </div>

    <div class="mt-6 border-t pt-6">
      <h3 class="text-lg font-semibold text-gray-800">Chiusura automatica</h3>
      <form method="POST" action="?/setSchedule" class="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3" use:enhance>
        <label class="flex items-center gap-2">
          <input type="checkbox" name="enabled" checked={settings.autoClose.enabled} />
          <span>Abilitata</span>
        </label>
        <div>
          <label for="weekday-select" class="block text-sm text-gray-600">Giorno della settimana</label>
          <select id="weekday-select" name="weekday" class="mt-1 w-full rounded border p-2" value={settings.autoClose.weekday ?? ''}>
            <option value="">—</option>
            <option value="1">Lunedì</option>
            <option value="2">Martedì</option>
            <option value="3">Mercoledì</option>
            <option value="4">Giovedì</option>
            <option value="5">Venerdì</option>
            <option value="6">Sabato</option>
            <option value="0">Domenica</option>
          </select>
        </div>
        <div>
          <label for="time-input" class="block text-sm text-gray-600">Orario</label>
          <input id="time-input" type="time" name="time" class="mt-1 w-full rounded border p-2" value={settings.autoClose.time ?? ''} />
        </div>
        <div class="sm:col-span-3">
          <button class="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Salva pianificazione</button>
        </div>
      </form>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <a href="/admin/products" class="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
      <h2 class="text-xl font-semibold text-gray-800">Manage Products</h2>
      <p class="text-gray-500 mt-1">Add, edit, and remove products.</p>
    </a>
    <a href="/admin/orders" class="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
      <h2 class="text-xl font-semibold text-gray-800">Manage Orders</h2>
      <p class="text-gray-500 mt-1">Review and update customer orders.</p>
    </a>
    <a href="/admin/users" class="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
      <h2 class="text-xl font-semibold text-gray-800">Manage Users</h2>
      <p class="text-gray-500 mt-1">View and manage user accounts.</p>
    </a>
  </div>

  <div>
    <a href="/" class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
      ← Back to User Interface
    </a>
  </div>
</div>
