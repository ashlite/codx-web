<script>
  import { get } from '$lib/api'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import {decodeXML} from 'entities'

  let collection
  
  onMount(async () => {
    let response = await get(`/collection/${$page.params.id}`)
    if (response.status == 200){
      collection = response.data
    }
  })
  
</script>

{#if collection != undefined}
  <div class="border-b-2 border-accent pb-2 mb-4">
    <h2>{collection.released}</h2>
    <h1 class="text-2xl font-bold">{decodeXML(collection.name)}</h1>
  </div>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-4 row-span-4">
      {#if collection.cover != undefined}
        <img src={collection.cover} alt="Collection Cover" class="object-contain" />
      {:else}
        <img src="https://dummyimage.com/1000x1000/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain"/>
      {/if}
    </div>
    <div class="col-span-2 flex gap-2">
      <p>ID BGG:</p>
      {#if collection.bgg_id != undefined}
        <a href="https://boardgamegeek.com/boardgame/{collection.bgg_id}" target="_blank" class="link link-primary">{collection.bgg_id}</a>
      {:else}
        <span>N/A</span>
      {/if}
    </div>
    <div class="col-span-2 flex gap-2">
      <p>Category:</p>
      <span>{collection.category}</span>
    </div>
    <div class="col-span-6 flex gap-2">
      <p class="textarea w-full whitespace-pre-wrap">{decodeXML(decodeXML(collection.description))}</p>

    </div>
  </div>
{/if}