<script>
  export let data
  import BtnExternalLink from '$lib/components/atom/BtnExternalLink.svelte'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte'
  import { globalModal } from "$lib/helper/store"
  import {decodeXML, decodeHTML} from 'entities'

</script>

<div class="indicator">
  <div class="indicator-item indicator-start avatar placeholder top-4 left-4">
    <div class="bg-accent rounded-full w-12">
      <span class="text-3xl text-accent-content font-bold">
        {data.rank}
      </span>
    </div>
  </div>
  <div class="card w-80 bg-base-300 shadow-xl">
    <figure class='h-40'>
      {#if data.thumbnail.value === undefined}
        <img src="https://dummyimage.com/600x400/edb200/ffffff&text=NO+IMG" alt="thumbnail" />
      {:else}
        <img src={data.thumbnail.value} alt="thumbnail" />
      {/if}
    </figure>
    <div class="card-body">
      <div class="badge badge-secondary">{data.yearpublished == undefined ? 'NaN' : data.yearpublished.value}</div>
      <!-- <div class="flex flex-row gap-4">
        <div class="badge badge-accent">{xmlData.getAttribute('rank')}</div>
      </div> -->
      <h2 class="card-title text-base truncate">
        {decodeHTML(decodeXML(data.name.value))}
      </h2>
      <div class="card-actions justify-center">
        <BtnExternalLink href={`https://boardgamegeek.com/boardgame/${data.id}`} />
        <BtnAddNew text='Collection' noShortcut on:click={() => globalModal.collectionFromBgg(data.id)} />
      </div>
    </div>
  </div>
</div>  
