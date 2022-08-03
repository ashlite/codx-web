<script>
  export let data
  import BggBtn from "./BggBtn.svelte"
  import {decodeXML} from 'entities'
</script>

<div class="indicator">
  <span class="indicator-item indicator-start badge badge-accent">{data.rank}</span>
  <div class="card w-80 bg-base-300 shadow-xl">
    <figure class='h-40'>
      {#if data.thumbnail.value === undefined}
        <img src="https://dummyimage.com/600x400/edb200/ffffff&text=NO+IMG" alt="thumbnail" />
      {:else}
        <img src={data.thumbnail.value} alt="thumbnail" />
      {/if}
    </figure>
    <div class="card-body">
      <div class="badge badge-secondary">{data.rank}</div>
      <!-- <div class="flex flex-row gap-4">
        <div class="badge badge-accent">{xmlData.getAttribute('rank')}</div>
      </div> -->
      <h2 class="card-title text-base truncate">
        {decodeXML(data.name.value)}
      </h2>
      <div class="card-actions justify-center">
        <BggBtn id={data.id} type="both"/>
      </div>
    </div>
  </div>
</div>  
