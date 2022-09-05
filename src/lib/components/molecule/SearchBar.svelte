<script>
  import { createEventDispatcher } from 'svelte'
  import Icon from '@iconify/svelte'
  import { shortcut } from '$lib/helper/shortcut';
  export let searchState = false

  const dispatch = createEventDispatcher()
  let searchQuery = ''

  function dispatchSearch(){
    dispatch('searchTrigger', {
      searchQuery: searchQuery
    })
  }

</script>

<div>
  <form class="flex gap-2" on:submit|preventDefault={() => dispatchSearch()}>
    {#if searchState}
      <input type="text" class="input input-bordered w-full max-w-xs" disabled bind:value={searchQuery} />
      <button type="submit" class="btn loading btn-disabled" />
    {:else}
      <input type="text" placeholder="Search Bar" class="input input-bordered input-info w-full max-w-xs" bind:value={searchQuery} />
      <button type="submit" class="btn btn-info">
        <Icon icon="uil:search" width="30" height="30" />
      </button>
    {/if}
  </form>
</div>