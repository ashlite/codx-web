<script>
  export let data
  import BtnExternalLink from '$lib/components/atom/BtnExternalLink.svelte'
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte';
  import { globalModal} from '$lib/helper/store'

</script>

<div class="tooltip z-10" data-tip={data.name}>
  <div class="grid grid-cols-5 gap-4 bg-base-300 shadow-xl h-52 overflow-clip rounded-lg">
  <figure class="col-span-2 h-52">
  {#if data.cover}
    <img src={data.cover} alt="Collection Cover" class="mx-auto object-contain object-center h-full" />
  {:else}
    <img src="https://dummyimage.com/600x600/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain object-center h-full" />
  {/if}
  </figure>
  <div class="col-span-3 pt-2 pr-4">
    <div class="flex flex-row justify-between gap-4 mt-2">
      <div class="">{data.category}</div>
      {#if (data.released ?? 0) > 0}
        <div class="text-primary">{data.released}</div>
      {/if}
      <div class="">
        Variant:
        {#if data.total_product > 0}
          <div class="badge badge-success">{data.total_product}</div>
        {:else}
          <div class="badge badge-error">0</div>
        {/if}
      </div>
    </div>

    <h2 class="text-xl truncate text-start">{data.name}</h2>
    {#if data.category == 'Expansion' || data.category == 'Core Game' || data.category == 'Core & Expansion'}
      <div class="flex flex-row h-16 w-full mb-4">
        <div class="">
          <div class="stat-title">Age</div>
          {#if data.min_age}
            <div class="stat-value text-lg">{data.min_age}</div>
          {:else}
            <div class="stat-value text-lg text-error">N/A</div>
          {/if}
        </div>
        <div class="divider divider-horizontal" />
        <div class="">
          <div class="stat-title">Players</div>
          {#if data.min_player == undefined}
            <div class="stat-value text-lg text-error">N/A</div>
          {:else if data.min_player == data.max_player}
            <div class="stat-value text-lg">{data.min_player}</div>
          {:else}
            <div class="stat-value text-lg">{data.min_player} - {data.max_player}</div>
          {/if}
        </div>
        <div class="divider divider-horizontal" />
        <div class="">
          <div class="stat-title text-l">Playtime</div>
          {#if data.min_playtime == undefined}
            <div class="stat-value text-lg text-error">N/A</div>
          {:else if data.min_playtime == data.max_playtime}
            <div class="stat-value text-lg">{data.min_playtime} min</div>
          {:else}
            <div class="stat-value text-lg">{data.min_playtime} - {data.max_playtime} min</div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="h-16 w-full mb-4"></div>
    {/if}
    
    <div class="card-actions justify-end">
      <BtnSuper href={`/app/catalogue/collection/${data.id}`} color="success" icon="uil:file-alt" />
      {#if data.bgg_id}
        <BtnSuper href={`https://boardgamegeek.com/boardgame/${data.bgg_id}`} color="info" icon="uil:external-link-alt" />
      {/if}
      <BtnSuper color="error" icon="uil:trash-alt" on:click={() => globalModal.deleteConfirmation(data.id, data.name, 'collection')}/>
    </div>
  </div>
  </div>
</div>

