<script>
  import { onMount } from 'svelte'
  import { user } from '../../stores.js'
  import { Route } from 'svelte-router-spa'
  export let currentRoute
  let initialized = false

  // The onMount lifecycle function
  onMount(() => {
    // Svelte stores are written to by callign set
    user.set({
      name: 'Test User',
      schoolName: 'Test Schoool',
    })
    initialized = true
  })
</script>

<div>
  {#if initialized}
    <Route {currentRoute} />
  {/if}
</div>
