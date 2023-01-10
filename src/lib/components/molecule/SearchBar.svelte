<script>
  import { createEventDispatcher } from 'svelte'
  import Icon from '@iconify/svelte'
  import { shortcut } from '$lib/helper/shortcut';
  export let searchState = false
  export let searchTotal = undefined
  export let searchQuery = ''

  const dispatch = createEventDispatcher()

  function dispatchSearch(){
    dispatch('searchTrigger', {
      searchQuery: searchQuery
    })
  }

</script>

<div>
  <form class="flex justify-start gap-2" on:submit|preventDefault={() => dispatchSearch()}>
    {#if searchState}
      <input type="text" class="input input-bordered w-4/5" disabled bind:value={searchQuery} />
      <button type="submit" class="btn loading btn-disabled w-1/5" />
    {:else}
      <div class="form-control w-4/5">
        <input type="text" placeholder="Search Bar" class="input input-bordered input-info w-full max-w-xs" bind:value={searchQuery} />
        {#if searchTotal != undefined}
          <label for="input" class="label">
            <span class="label-text">Total Result : {searchTotal}</span>
          </label>
        {/if}
      </div>
      <button type="submit" class="btn btn-info w-1/5">
        <Icon icon="uil:search" width="30" height="30" />
      </button>
    {/if}
  </form>
</div>