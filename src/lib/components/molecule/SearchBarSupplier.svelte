<script>
  import { get } from '$lib/helper/api'
  import BtnIcon from '$lib/components/atom/BtnIcon.svelte'
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte';
  import { createEventDispatcher } from 'svelte'

  let searchState = false
  let searchQuery
  let resultQuery = []
  const dispatch = createEventDispatcher()

  function forward(data){
    dispatch('submitSupplier', data)
    resultQuery = []
  }

  async function searchSupplier(query){
    resultQuery = await get(`/supplier?q=${query}`) 
  }

  $:resultQuery

</script>

<div class="form-control">
  <form on:submit|preventDefault={() => searchSupplier(searchQuery)}>
    <div class="input-group w-full">
      <span>Search Supplier</span>
      <input type="text" class="input input-bordered flex-grow" bind:value={searchQuery} disabled={false} />
      {#if searchState}
        <button class="btn btn-square btn-info loading" disabled />
      {:else}
        <BtnIcon color="info" icon="uil:search" type="submit"/>
      {/if}
    </div>
  </form>
</div>
<ul class="menu bg-neutral w-4/5 absolute z-30">
  {#if resultQuery.length > 0}
    {#each resultQuery as supplier}
      <li>
        <BtnSuper on:click={() => forward(supplier)} text={`(${supplier.country}) - ${supplier.supplier_name}`} />
      </li>
    {/each}
  {/if}
</ul>