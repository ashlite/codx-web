<script>
  import { createEventDispatcher } from 'svelte'
  import Icon from '@iconify/svelte'
  import { shortcut } from '$lib/helper/shortcut';
  export let searchState = false
  export let searchTotal
  export let searchQuery = ''

  const dispatch = createEventDispatcher()

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
      <div class="form-control w-full">
        <input type="text" placeholder="Search Bar" class="input input-bordered input-info w-full max-w-xs" bind:value={searchQuery} />
        {#if searchTotal != undefined}
          <label for="input" class="label">
            <span class="label-text">Total Result : {searchTotal}</span>
          </label>
        {/if}
      </div>
      <button type="submit" class="btn btn-info">
        <Icon icon="uil:search" width="30" height="30" />
      </button>
    {/if}
  </form>
</div>