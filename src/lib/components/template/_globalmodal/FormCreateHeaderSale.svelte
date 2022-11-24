<script>
  import { get, post, patch } from '$lib/helper/api'
  import { globalModal, refreshPage } from '$lib/helper/store'
  import { BggSingleItem } from '$lib/helper/bggInteraction'
  import { onMount } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import TextArea from '$lib/components/molecule/TextArea.svelte'
  import SearchBarBggId from '$lib/components/molecule/SearchBarBggId.svelte'
  import CustomerPicker from '$lib/components/organism/CustomerPicker.svelte'
  import DatePicker from '$lib/components/organism/DatePicker.svelte'
  import { dateFormater } from '$lib/helper/tools'
	
  export let id = 0

  let listVenue = []
  let selectedVenue
  let selectedCustomer
  let selectedDate
  let notes

  onMount(async () => {
    listVenue = await get('/venue')
    if (id > 0) {
      const oldData = await get(`/sale/header/${id}`)
      selectedVenue = oldData.venue.id
      selectedCustomer = oldData.customer
      selectedDate = oldData.created_at
      notes = oldData.notes
    }
  })

  async function SaveDataSale() {
    let response
    if (id > 0) {
      response = await patch(`/sale/header/${id}`, {
        notes: notes,
        created_at: selectedDate,
        customer_id: selectedCustomer.id == undefined ? null : selectedCustomer.id,
      })
    } else {
      response = await post('/sale/header', {
        notes: notes,
        created_at: selectedDate,
        customer_id: selectedCustomer.id == undefined ? null : selectedCustomer.id,
        venue_id: selectedVenue
      })
    }
    if (response){
      refreshPage.set(true)
      globalModal.close()
    }
  }
</script>

<div class="pb-20">
  <div class="flex flex-col gap-4">
    <CustomerPicker bind:selectedCustomer={selectedCustomer} />
    <div class="form-control">
      <label class="label" for="">
        <span class="label-text">Select Venue</span>
      </label>
      {#if id > 0}
        <select class="select select-bordered" bind:value={selectedVenue} disabled>
          {#each listVenue as venue}
            <option value={venue.id}>{venue.name}</option>
          {/each}
        </select>
      {:else}
        <select class="select select-bordered" bind:value={selectedVenue}>
          {#each listVenue as venue}
            <option value={venue.id}>{venue.name}</option>
          {/each}
        </select>
      {/if}
    </div>
    <DatePicker on:dateSubmit={e => selectedDate = dateFormater(e.detail, 'isoDateTime')}/>
    <TextArea labelTL="Sale Notes" limit=256 bind:value={notes} />
    <ModalSubmit on:submit={() => SaveDataSale()} />

  </div>
  
</div>