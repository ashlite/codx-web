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
  let listItem = []
  let pagination = { itemPerPage: 50, currentPage: 1 }
  let searching = false
  let searchQuery = ''
  let noProduct = false

  $: noProduct, RefreshData()

  $: $refreshPage && RefreshData()
  
  async function RefreshData(){
    let skipData = (pagination.currentPage - 1) * pagination.itemPerPage
    let urlParamList = `?limit=${pagination.itemPerPage}&skip=${skipData}&noproduct=${noProduct ? 1 : 0}`
    let urlParamCount = `&noproduct=${noProduct ? 1 : 0}`
    if (searchQuery.length > 0) {
      urlParamList = urlParamList + `&q=${searchQuery}`
      urlParamCount = urlParamCount + `&q=${searchQuery}`
    }      
    
    const responseItem = await get(`/collection${urlParamList}`)
    listItem = await Array.isArray(responseItem) ? responseItem : []
    
    const responseCount = await get(`/utils/count?collection=1${urlParamCount}`)
    totalItem = await responseCount.total_collection != undefined ? responseCount.total_collection : 0

    refreshPage.set(false)
    searchQuery = ''
    searching = false
  }

  async function searchGame(query){
    searching = true
    searchQuery = query
    refreshPage.set(true)
  }

  async function updatePage(limit){
    pagination = limit
    refreshPage.set(true)
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
  </div>
  <div class="w-60">
    <BtnAddNew text='Collection' on:click={() => globalModal.collectionCreate()}/>
  </div>
</div>

<PaginationNav totalItems={totalItem} on:changePage={e => updatePage(e.detail)}/>

<div class="grid grid-cols-2 gap-4 pb-8">
  {#if searching}
    <div class="mx-auto my-6 w-fit">
      <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
    </div>
  {:else}
    {#each listItem as collection}
      <CollectionCard data={collection} />
    {/each}
  {/if}
</div>