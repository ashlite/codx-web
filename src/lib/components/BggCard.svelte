<script>
  export let xmlData
  import BggBtn from "./BggBtn.svelte"
</script>

<div class="indicator">
  <span class="indicator-item indicator-start badge badge-accent">{xmlData.getAttribute('rank')}</span>
  <div class="card w-80 bg-base-300 shadow-xl">
    <figure class='h-40'>
      {#if xmlData.children[0].getAttribute('value') === undefined}
        <img src="https://dummyimage.com/600x400/edb200/ffffff&text=NO+IMG" alt="thumbnail" />
      {:else}
        <img src={xmlData.children[0].getAttribute('value')} alt="thumbnail" />
      {/if}
    </figure>
    <div class="card-body">
      <div class="badge badge-secondary">{xmlData.children[2].getAttribute('value')}</div>
      <!-- <div class="flex flex-row gap-4">
        <div class="badge badge-accent">{xmlData.getAttribute('rank')}</div>
      </div> -->
      <h2 class="card-title text-base truncate">
        {xmlData.children[1].getAttribute('value')}
      </h2>
      <div class="card-actions justify-center">
        <BggBtn id={xmlData.getAttribute('id')} type="both"/>
      </div>
    </div>
  </div>
</div>  
