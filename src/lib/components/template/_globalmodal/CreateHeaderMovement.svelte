<script>
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import TextArea from '$lib/components/molecule/TextArea.svelte';
  import { post, get } from '$lib/helper/api'
	import { globalModal, refreshPage } from '$lib/helper/store';

  export let data = { header_purchase_id : 0 }
  let purchaseHeader = data.header_purchase_id
  let selectedType = 1
  let originVenue = 1
  let targetVenue = 1
  let movementNotes
  const listType = get(`/inventory/type`)
  const listVenue = get('/venue/')

  async function handleSubmit(){
    let requestBody = {movement_notes: movementNotes, movement_type: selectedType}
    if (purchaseHeader > 0) requestBody.header_purchase_id = purchaseHeader
    if (selectedType == 2 || selectedType == 3) requestBody.origin_venue_id = originVenue
    if (selectedType == 1 || selectedType == 3) requestBody.target_venue_id = targetVenue
    const response = await post(`/inventory/header/`, requestBody)
    if (response) {
      globalModal.close()
      refreshPage.set(true)
    }
  }
</script>

<form on:submit|preventDefault={() => handleSubmit()}>
  <div class="grid grid-cols-2 gap-4">
    <NumberInput labelTL="Puchase Id" labelTR="autofill if needed" skipFocus disabled bind:value={purchaseHeader}/>
    <div class="w-full">
      <label class="label" for="type">
        <span class="label-text">Movement Type</span>
      </label>
      {#if purchaseHeader > 0}
        <select id="type" class="select select-bordered select-md w-full" disabled>
          <option selected>inbound</option>
        </select>
      {:else}
        <select id="type" class="select select-bordered select-md w-full" bind:value={selectedType}>
          {#await listType then arrType}
            {#each arrType as type}
              <option value={type.id}>{type.movement_type}</option>
            {/each}
          {/await}
        </select>
      {/if}
    </div>

    {#if selectedType == 2 || selectedType == 3}
      <div>
        <label class="label" for="type">
          <span class="label-text">Origin Venue</span>
        </label>
        <select id="venue" class="select select-bordered select-md w-full" bind:value={originVenue}>
          {#await listVenue then arrVenue}
            {#each arrVenue as venue}
              <option value={venue.id}>{venue.name}</option>
            {/each}
          {/await}
        </select>
      </div>
    {:else}
      <div></div>
    {/if}

    {#if selectedType == 1 || selectedType == 3}
      <div>
        <label class="label" for="type">
          <span class="label-text">Target Venue</span>
        </label>
        <select id="venue" class="select select-bordered select-md w-full" bind:value={targetVenue}>
          {#await listVenue then arrVenue}
            {#each arrVenue as venue}
              <option value={venue.id}>{venue.name}</option>
            {/each}
          {/await}
        </select>
      </div>
    {/if}
    <div class="col-span-2">
      <TextArea labelTL="Notes" limit=1000 bind:value={movementNotes}/>
    </div>
  </div>
  <ModalSubmit form />
</form>