<script>
	import { onMount } from "svelte"
  import { get } from "$lib/helper/api"
  import { durationFormater, priceFormater } from "$lib/helper/tools"
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte"
	import { globalModal } from "$lib/helper/store"

  export let priceId
  let priceData = {}

  onMount(async () => {
    priceData = await get(`/library/group/${priceId}`)
  })
</script>

{#if priceData.id != undefined}
  <div class="grid grid-cols-3 gap-4">
    {#each Object.entries(priceData) as [key, data]}
      {#if key == 'low_price' || key == 'hi_price' || key == 'custom_price'}
        <div class="flex flex-col gap-4">
          {#if key == 'low_price'}
            <div>Tier 1 (LOW)</div>
          {:else if key == 'hi_price'}
            <div>Tier 2 (HI)</div>
          {:else}
            <div>Tier 3 (CUSTOM)</div>
          {/if}
          <div>Grace Period: <span class="text-secondary">{durationFormater(data.grace_period)}</span></div>
          <div>Error Period: <span class="text-secondary">{durationFormater(data.error_period)}</span></div>
          <div>Cycle Time: <span class="text-secondary">{durationFormater(data.cycle_time)}</span></div>
          <div>Cycle Start: <span class="text-secondary">{durationFormater(data.cycle_start)}</span></div>
          <div>Cycle Price: <span class="text-secondary">{priceFormater(data.cycle_price)}</span></div>
          <div>Min Price: <span class="text-secondary">{priceFormater(data.min_price)}</span></div>
          <div>Max Price: <span class="text-secondary">{priceFormater(data.max_price)}</span></div>
        </div>
      {/if}
    {/each}
    <BtnSuper text="Update Price Group" color="info" on:click={() => globalModal.editPriceGroup(priceData.id)} />
  </div>
{/if}