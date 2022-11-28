<script>
  import { get, post } from '$lib/helper/api'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import TextArea from '$lib/components/molecule/TextArea.svelte'
  import Toggle from '$lib/components/atom/Toggle.svelte'
	import { onMount } from 'svelte'
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'
  
  export let data = { headerId:0, grandTotal: 0, itemTotal:0}
  let selectedType = undefined
  let modPrice
  let modNotes
  let applyToGrand = true
  let listModType = []

  onMount(async () => {
    listModType = await get('/sale/mod')
  })

  // $: applyToGrand, calculatePrice()

  async function handleSubmit() {
    if (selectedType == undefined) {
      toastAlert.error('Type must be selected')
    } else {
      await post(`/sale/header/${data.headerId}/mod`, {
        mod_price: modPrice,
        notes: modNotes,
        type_id: listModType[selectedType].id,
      })
      refreshPage.set(true)
      globalModal.close()
    }
  }

  function calculatePrice() {
    if (listModType[selectedType].is_percentage) {
      if (applyToGrand) {
        modPrice = Math.floor((listModType[selectedType].default_mod * data.grandTotal) / 100)
      } else {
        modPrice = Math.floor((listModType[selectedType].default_mod * data.itemTotal) / 100)
      }
    } else if (listModType[selectedType].default_mod > 0) {
      modPrice = listModType[selectedType].default_mod
    }
  }
</script>

<div>
  <form class="flex flex-col gap-4" on:submit|preventDefault={() => handleSubmit()}>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="">
        <span class="label-text">Select Modifier Type</span>
      </label>
      {#await listModType}
        <select class="select select-bordered disabled">
          <option disabled selected value=0>LOADING...</option>
        </select>
      {:then modType}
        <select class="select select-bordered" bind:value={selectedType} on:change={() => calculatePrice()}>
          <option value={undefined}>Pick one</option>
          {#each modType as modData, index}
            <option value={index}>{`${modData.sale_type} (${modData.default_mod}${modData.is_percentage ? '%' : ''})`}</option>
          {/each}
        </select>
      {/await}
    </div>
    <Toggle label="Calculate percentage based on Grand Total?" bind:checked={applyToGrand} />
    <NumberInput labelTL="Modified Price" min={-99999999} bind:value={modPrice}/>
    <TextArea labelTL="Notes" bind:value={modNotes}/>

    <div class="col-span-full">
      <ModalSubmit form />
    </div>
  </form>
</div>