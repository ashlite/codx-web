<script>
	import { onMount } from "svelte"
  import { get, post, patch } from "$lib/helper/api"
  import TextInput from "$lib/components/molecule/TextInput.svelte"
  import Toggle from "$lib/components/atom/Toggle.svelte"
  import NumberInput from "$lib/components/molecule/NumberInput.svelte"
  import LibPriceEditor from "$lib/components/organism/LibPriceEditor.svelte"
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
	import { globalModal, refreshPage } from "$lib/helper/store";
  
  export let data = 0
  let name
  let is_active
  let low_price
  let hi_price
  let custom_price

  onMount(async() => {
    if (data > 0) {
      const response = await get(`/library/group/${data}`)
      name = response.name
      is_active = response.is_active
      low_price = response.low_price
      hi_price = response.hi_price
      custom_price = response.custom_price
    }
  })

  async function handleSubmit() {
    const payload = {
      group_data: { name, is_active },
      low_price,
      hi_price,
      custom_price
    }
    if (data > 0) {
      await patch(`/library/group/${data}`, payload)
    } else {
      await post(`/library/group`, payload)
    }
    globalModal.close()
    refreshPage.set(true)
  }
</script>

<div>
  <form on:submit|preventDefault = {() => handleSubmit()}>
    <div class="flex flex-col mb-4 w-1/3">
      <TextInput labelTL="Name" bind:value={name} />
      <div class="w-1/3">
        <Toggle label="Active ?" bind:checked={is_active} />
      </div>
    </div>
    <div class="flex flex-row gap-2">
      <div class="card w-full bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Tier 1 Price (LOW)</h2>
          <LibPriceEditor bind:priceData={low_price} />
        </div>
      </div>
      <div class="card w-full bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Tier 2 Price (HI)</h2>
          <LibPriceEditor bind:priceData={hi_price} />
        </div>
      </div>
      <div class="card w-full bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Tier 3 Price (CUSTOM)</h2>
          <LibPriceEditor bind:priceData={custom_price} />
        </div>
      </div>
    </div>
    <ModalSubmit form />
  </form>
</div>