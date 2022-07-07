<!-- <script context="module">
  export async function load() {
    
    const getTotal = await get('/utils/count?collection=1')
    const listCollection = await get('/collection?limit=50')
    return {
      status: 200,
      props: {
        totalCollection : getTotal.total_collection,
        listCollection
      }
    };
  }
</script> -->

<script>
  import { get } from '$lib/api'
  import CollectionCard from '$lib/components/CollectionCard.svelte'
  import PaginationNav from '$lib/components/PaginationNav.svelte'
  import ModalDelete from '$lib/components/ModalDelete.svelte'
  import { RingLoader } from 'svelte-loading-spinners'
  import { onMount } from 'svelte'

  let totalCollection = {}
  let listCollection = {}
  let loadingData = false

  async function RefreshPage(){
    loadingData = true
    try{
      totalCollection = await get('/utils/count?collection=1')
      listCollection = await get('/collection?limit=50')
    } catch(e) {
      console.log(e)
    } finally {
      loadingData = false
    }
  }


</script>

<div class="stat">
  <div class="stat-title">Total Collections</div>
  {#await totalCollection}
    <div class="stat-value text-primary">calculating...</div>
  {:then value}
    <div class="stat-value text-primary">{value.total_collection}</div>
  {:catch error}
    {console.log(error)}
    <div class="stat-value text-primary">Error</div>
  {/await}
</div>
<div class="grid grid-cols-9 mb-4 gap-4">
  <div class="col-start-4 col-span-3">
    <PaginationNav />
  </div>
  <div class="col-start-8 col-span-2">
    <button class="btn btn-primary w-full">Add New Collection</button>
  </div>
</div>

<div class="grid grid-cols-2 gap-4">
  {#await listCollection}
    <div class="mx-auto my-6 w-fit">
      <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
    </div>
  {:then collections}
    {#each collections as collection}
      <CollectionCard data={collection} />
    {/each}
  {:catch error}
    {console.log(error)}
    <h2 class="text-error text-xl">{error.message}</h2>
  {/await}
</div>

<ModalDelete on:message={RefreshPage} />