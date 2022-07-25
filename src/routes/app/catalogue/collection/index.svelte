<script>
  import { get } from '$lib/api'
  import {globalModal} from '$lib/store'
  import CollectionCard from '$lib/components/CollectionCard.svelte'
  import PaginationNav from '$lib/components/PaginationNav.svelte'
  import ModalDelete from '$lib/components/ModalDelete.svelte'
  import { RingLoader } from 'svelte-loading-spinners'
  import { shortcut } from '$lib/shortcut'
  import { goto } from '$app/navigation'
  
  let totalCollection = get('/utils/count?collection=1')
  let listCollection = get('/collection?limit=50')

  async function RefreshPage(){
    totalCollection = (get('/utils/count?collection=1'))
    listCollection = (get('/collection?limit=50')) 
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
    {#await listCollection}
      <button class="btn btn-primary btn-disabled w-full loading" />
    {:then collection}
      <button class="btn btn-primary w-full" use:shortcut={{alt:true, shift:true, code:'KeyN' }} on:click={() => globalModal.collectionEditor()}>
          Add New Collection 
        <span class="ml-4">
          <kbd class="kbd kbd-xs text-base-content">N</kbd>
        </span>
      </button>
    {/await}
  </div>
</div>

<div class="grid grid-cols-2 gap-4 pb-8">
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