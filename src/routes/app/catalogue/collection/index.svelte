<script>
  import { get } from '$lib/api'
  import { globalModal, collectionRefresh, toastAlert } from '$lib/store'
  import CollectionCard from '$lib/components/CollectionCard.svelte'
  import PaginationNav from '$lib/components/PaginationNav.svelte'
  import { RingLoader } from 'svelte-loading-spinners'
  import { shortcut } from '$lib/shortcut'
  import { onMount, onDestroy } from 'svelte'

  let totalItem = 0
  let listItem = get(`/collection?limit=10`)
  let searching = false
  let searchName

  const unsubscribe = collectionRefresh.subscribe(value => {
    if (value){
      RefreshData()
      collectionRefresh.set(false)
    }
  })
  onDestroy(unsubscribe)

  onMount(() => {
    RefreshData()
  })
  
  async function RefreshData(data){
    searchName = undefined
    if (data == undefined){
      let response = await get('/utils/count?collection=1')
      totalItem = await response.data.total_collection
      listItem = await get(`/collection?limit=10`)
    } else {
      let skipData = (data.currentPage - 1) * data.itemPerPage
      listItem = await get(`/collection?limit=${data.itemPerPage}&skip=${skipData}`) 
    }
  }

  async function searchGame(){
    searching = true
    try{
      listItem = await get(`/collection?limit=1000&q=${searchName}`)
      totalItem = listItem.data.length
    } catch (error) {
      toastAlert.error(error.message)
    }
    searching = false
  }

</script>

<div class="flex justify-between items-center gap-4">
  <div class="stat w-32">
    <div class="stat-title">Total Items</div>
    <div class="stat-value text-primary">{totalItem}</div>
    <!-- {#await totalItem}
      <div class="stat-value text-primary">calculating...</div>
    {:then value}
      <div class="stat-value text-primary">{value.data.total_collection}</div>
    {:catch error}
      {console.log(error)}
      <div class="stat-value text-primary">{error}</div>
    {/await} -->
  </div>
  <div class="w-96">
    <form class="flex gap-2" on:submit|preventDefault={() => searchGame()}>
      {#if searching}
        <input type="text" class="input input-bordered input-info w-full" disabled bind:value={searchName}/>
        <button class="btn btn-md btn-info loading" />
      {:else}
        <input type="text" class="input input-bordered input-info w-full" bind:value={searchName}/>
        <button class="btn btn-md btn-info" type="submit">Search</button>  
      {/if}
    </form>
  </div>
  <div class="w-72">
    {#await listItem}
      <button class="btn btn-primary btn-md btn-disabled w-full loading" />
    {:then collections}
      <button class="btn btn-primary btn-md w-full" use:shortcut={{alt:true, shift:true, code:'KeyN' }} on:click={() => globalModal.collectionCreate()}>
          Add New Collection 
        <span class="ml-4">
          <kbd class="kbd kbd-xs text-base-content">N</kbd>
        </span>
      </button>
    {/await}
  </div>
</div>

<PaginationNav totalItems={totalItem} on:updatePagination={event => RefreshData(event.detail)}/>


<div class="grid grid-cols-2 gap-4 pb-8">
  {#await listItem}
    <div class="mx-auto my-6 w-fit">
      <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
    </div>
  {:then collections}
    {#each collections.data as collection}
      <CollectionCard data={collection} />
    {/each}
  {:catch error}
    {console.log(error)}
    <h2 class="text-error text-xl">{error.message}</h2>
  {/await}
</div>