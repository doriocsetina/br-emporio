<script lang="ts">
  export let form;
</script>

<form method="POST">
  <label>
    Username
    <input name="username" required />
  </label>
  <label>
    Password
    <input type="password" name="password" required />
  </label>
  <button type="submit">Login</button>

  {#if form?.error}
    <p class="text-red-500">{form.error}</p>
  {/if}
</form>
