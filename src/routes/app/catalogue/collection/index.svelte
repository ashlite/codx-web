<script>
  import { get } from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import CollectionCard from '$lib/components/organism/CollectionCard.svelte'
  import PaginationNav from '$lib/components/organism/PaginationNav.svelte'
  import { RingLoader } from 'svelte-loading-spinners'
  import { shortcut } from '$lib/helper/shortcut'
  import { onDestroy } from 'svelte'
  import { afterNavigate } from '$app/navigation'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte'
  import SearchBar from '$lib/components/molecule/SearchBar.svelte'

  let totalItem = 0
  let listItem = {data:[]}
  let searching = false
  let searchName
  let noProduct = false

  $: noProduct, RefreshData()

  const unsubscribe = refreshPage.subscribe(value => {
    if (value){
      RefreshData()
      refreshPage.set(false)
    }
  })
  onDestroy(unsubscribe)
  
  async function RefreshData(data){
    try{
      if (data == undefined){
        searchName = undefined
        let response = await get(`/utils/count?collection=1&noproduct=${noProduct ? 1 : 0}`)
        totalItem = await response.data.total_collection
        listItem = await get(`/collection?limit=50&noproduct=${noProduct ? 1 : 0}`)
      } else if (searchName != undefined){
        let skipData = (data.currentPage - 1) * data.itemPerPage
        listItem = await get(`/collection?limit=${data.itemPerPage}&skip=${skipData}&q=${searchName}&noproduct=${noProduct ? 1 : 0}`)
      } else {
        let skipData = (data.currentPage - 1) * data.itemPerPage
        listItem = await get(`/collection?limit=${data.itemPerPage}&skip=${skipData}&noproduct=${noProduct ? 1 : 0}`)
      }
      listItem = listItem
    } catch(error){
      console.log(error)
    }
  }

  async function searchGame(query){
    searching = true
    try{
      listItem = await get(`/collection?limit=10&q=${query}&noproduct=${noProduct ? 1 : 0}`)
      let response = await get(`/utils/count?collection=1&q=${query}&noproduct=${noProduct ? 1 : 0}`)
      totalItem = await response.data.total_collection
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
  </div>
  <div class="form-control w-30">
    <label class="flex flex-col gap-2 label cursor-pointer">
      <span class="stat-title">No Product Only</span> 
      <input type="checkbox" class="toggle toggle-md" bind:checked={noProduct} />
    </label>
  </div>
  <div class="w-96">
    <SearchBar on:searchTrigger={e => searchGame(e.detail.searchQuery)} searchState={searching} />
    <!-- <form class="flex gap-2" on:submit|preventDefault={() => searchGame()}>
      {#if searching}
        <input type="text" class="input input-bordered input-info w-full" disabled bind:value={searchName}/>
        <button class="btn btn-md btn-info loading" />
      {:else}
        <input type="text" class="input input-bordered input-info w-full" bind:value={searchName}/>
        <button class="btn btn-md btn-info" type="submit">Search</button>  
      {/if}
    </form> -->
  </div>
  <div class="w-60">
    <BtnAddNew text='Collection' on:click={() => globalModal.collectionCreate()}/>
  </div>
</div>

<PaginationNav totalItems={totalItem} on:updatePagination={event => RefreshData(event.detail)}/>

<div class="grid grid-cols-2 gap-4 pb-8">
  {#if listItem.data.length > 0}
    {#each listItem.data as collection}
      <CollectionCard data={collection} />
    {/each}
  {:else}
    <div class="mx-auto my-6 w-fit">
      <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
    </div>
  {/if}
  <!-- {#await listItem}
  {:then collections}
    {#each collections.data as collection}
      <CollectionCard data={collection} />
    {/each}
  {:catch error}
    {console.log(error)}
    <h2 class="text-error text-xl">{error.message}</h2>
  {/await} -->
</div>