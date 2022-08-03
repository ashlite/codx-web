<script>
  import { get } from '$lib/api'
  import { globalModal, collectionRefresh } from '$lib/store'
  import CollectionCard from '$lib/components/CollectionCard.svelte'
  import PaginationNav from '$lib/components/PaginationNav.svelte'
  import { RingLoader } from 'svelte-loading-spinners'
  import { shortcut } from '$lib/shortcut'
  import { onMount } from 'svelte';

  let totalCollection = get('/utils/count?collection=1')
  let listCollection = get(`/collection?limit=10`)

  collectionRefresh.subscribe(value => {
    if (value){
      RefreshData()
      collectionRefresh.set(false)
    }
  })

  onMount(() => {
    RefreshData()
  })
  
  async function RefreshData(data){
    if (data == undefined){
      totalCollection = get('/utils/count?collection=1')
      listCollection = get(`/collection?limit=10`)
    } else {
      let skipData = (data.currentPage - 1) * data.itemPerPage
      listCollection = (get(`/collection?limit=${data.itemPerPage}&skip=${skipData}`)) 
    }
  }

</script>

<div class="flex justify-between items-center">
  <div class="stat">
    <div class="stat-title">Total Collections</div>
    {#await totalCollection}
      <div class="stat-value text-primary">calculating...</div>
    {:then value}
      <div class="stat-value text-primary">{value.data.total_collection}</div>
    {:catch error}
      {console.log(error)}
      <div class="stat-value text-primary">{error}</div>
    {/await}
  </div>
  <div class="w-5/12">
    {#await listCollection}
      <button class="btn btn-primary btn-lg btn-disabled w-full loading" />
    {:then collections}
      <button class="btn btn-primary btn-lg w-full" use:shortcut={{alt:true, shift:true, code:'KeyN' }} on:click={() => globalModal.collectionEditor()}>
          Add New Collection 
        <span class="ml-4">
          <kbd class="kbd kbd-xs text-base-content">N</kbd>
        </span>
      </button>
    {/await}
  </div>
</div>

{#await totalCollection then value}
  <PaginationNav totalItems={value.data.total_collection} on:updatePagination={event => RefreshData(event.detail)}/>
{/await}

<div class="grid grid-cols-2 gap-4 pb-8">
  {#await listCollection}
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