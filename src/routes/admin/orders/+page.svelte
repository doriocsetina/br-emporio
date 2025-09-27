<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  // submitting state per-order id (reactive)
  let submitting = $state<Record<number, boolean>>({});

  function formatPrice(n: number) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
  }
</script>

<div class="mx-auto max-w-6xl px-6 py-8">
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <h1 class="text-3xl font-bold text-gray-800">Ordini</h1>

    <form method="GET" class="flex items-center gap-2">
      <label for="week" class="text-sm text-gray-600">Settimana</label>
      <select id="week" name="week" class="rounded border p-2" value={data.selectedWeek} onchange={(e) => (e.currentTarget as HTMLSelectElement).form?.submit()}>
        {#each data.weeks as w}
          <option value={w.key}>{w.label}</option>
        {/each}
      </select>
      <noscript>
        <button type="submit" class="rounded bg-indigo-600 px-3 py-2 text-white">Vai</button>
      </noscript>
    </form>
  </div>

  {#if !data.selectedWeek}
    <p class="text-gray-500">Nessuna settimana disponibile.</p>
  {:else if data.orders.length === 0}
    <p class="text-gray-500">Nessun ordine per la settimana selezionata.</p>
  {:else}
    <div class="space-y-4">
      {#each data.orders as o}
        <div class="rounded-lg border bg-white p-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="font-semibold">{o.customerName || 'Sconosciuto'}</p>
              <p class="text-sm text-gray-500">{o.email}</p>
              {#if o.delivery}
                <p class="text-xs text-emerald-700">Consegna {o.address ? `· ${o.address}` : ''}</p>
              {:else}
                <p class="text-xs text-gray-600">Ritiro in sede</p>
              {/if}
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">{o.createdAt}</p>
              <p class="font-bold">{formatPrice(o.total)}</p>
              {#if o.isCompleted}
                <span class="mt-1 inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Pagato {o.paidTotal != null ? `· ${formatPrice(o.paidTotal)}` : ''}</span>
              {/if}
            </div>
          </div>

          <div class="mt-3 divide-y rounded border">
            {#each o.items as it}
              <div class="flex items-center justify-between px-3 py-2">
                <div class="truncate">
                  <p class="truncate">{it.productName}</p>
                  <p class="text-xs text-gray-500">Qty {it.quantity}</p>
                </div>
                <div class="text-sm">{formatPrice(it.price * it.quantity)}</div>
              </div>
            {/each}
          </div>

          {#if !o.isCompleted}
            <form
              method="POST"
              action="?/markPaid"
              use:enhance={(submit) => {
                submitting[o.id] = true;
                return ({ result, update }) => {
                  submitting[o.id] = false;
                  if (result.type === 'success') update();
                };
              }}
              class="mt-3 flex items-end gap-3"
            >
              <div>
                <label for={`total-${o.id}`} class="block text-xs text-gray-600">Totale</label>
                <input
                  id={`total-${o.id}`}
                  name="total"
                  type="number"
                  step="0.01"
                  min="0"
                  inputmode="decimal"
                  class="w-40 rounded border p-2"
                  value={o.paidTotal ?? o.total}
                  required
                  disabled={submitting[o.id]}
                />
              </div>
              <input type="hidden" name="id" value={o.id} />
              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
                disabled={submitting[o.id]}
                aria-busy={submitting[o.id]}
              >
                {#if submitting[o.id]}
                  <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Segnando...
                {:else}
                  Segna come pagato
                {/if}
              </button>
            </form>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>