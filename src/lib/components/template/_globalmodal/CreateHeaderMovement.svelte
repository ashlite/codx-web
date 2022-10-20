<script>
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import TextArea from '$lib/components/molecule/TextArea.svelte';
  import { post, get, patch } from '$lib/helper/api'
	import { globalModal, refreshPage } from '$lib/helper/store';

  export let data = { header_purchase_id : 0 }
  let purchaseHeader = data.header_purchase_id
  let selectedType = data.id ? data.movement_type : 1
  let originVenue = (data.id && data.origin_venue) ? data.origin_venue.id : 1
  let targetVenue = (data.id && data.target_venue) ? data.target_venue.id : 1
  let movementNotes = data.id ? data.movement_notes : undefined
  let listType = get(`/inventory/type`)
  let listVenue = get('/venue/')

  async function handleSubmit(){
    let requestBody = {movement_notes: movementNotes, movement_type: selectedType}
    if (purchaseHeader > 0) requestBody.header_purchase_id = purchaseHeader
    if (selectedType == 2 || selectedType == 3) requestBody.origin_venue_id = originVenue
    if (selectedType == 1 || selectedType == 3) requestBody.target_venue_id = targetVenue
    let response
    if (data.id) response = await patch(`/inventory/header/${data.id}`, requestBody) 
    else response = await post(`/inventory/header/`, requestBody) 
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