<script>
  import PaginationNav from "$lib/components/organism/PaginationNav.svelte"
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte"
  import { refreshPage, globalModal } from '$lib/helper/store'
  import { afterNavigate } from '$app/navigation'
  import { get } from "$lib/helper/api"
  import { dateFormater, priceFormater } from '$lib/helper/tools'
  import DatePicker from "$lib/components/organism/DatePicker.svelte"
	import CellAction from "$lib/components/molecule/CellAction.svelte";

  let listHeader = []
  let listType = []
  let listVenue = []
  let itemPerPage = 50
  let currentPage = 1
  let totalItem = 0
  let searchQuery
  let selectedType = 0
  let selectedVenue = 0
  const globalDate = new Date()
  let dateRange = {
    min: new Date(globalDate.getFullYear(), globalDate.getMonth(), 1),
    max: new Date(globalDate.getFullYear(), globalDate.getMonth() + 1, 0)
  }    

  $: $refreshPage && RefreshData()

  afterNavigate(async () => {
    listType = await get(`/inventory/type`)
    listVenue = await get('/venue/')
    RefreshData()
  })

  async function RefreshData() {
    let filter = ``
    if (selectedType > 0) filter += `&type=${selectedType}`
    if (selectedType < 0) filter += `&canceled=1`
    
    listHeader = await get(`/inventory/header?createmin=${dateFormater(dateRange.min, 'isoDateTime')}&createmax=${dateFormater(dateRange.max, 'isoDateTime')}${filter}`)
    // let response = await get(`/utils/count?headerpurchase=1`)
    // totalItem = response.total_purchase
    refreshPage.set(false)
  }

  function openHeaderMovement(id){
    window.open(`/app/inventory/report/${id}`, '_blank')
  }

  function updateRange(data){
    dateRange = data
    RefreshData()
  }
  
</script>

<div class="w-full min-h-screen pb-4 px-4">
  <div class="grid grid-cols-4 justify-between items-center gap-4 mb-4">
    <div class="form-control w-60 max-w-xs">
      <label class="label" for="purchase_status">
        <span class="label-text">Type</span>
      </label>
      <select id="purchase-status" class="select select-bordered select-sm" bind:value={selectedType} on:change={() => RefreshData()}>
        <option value={0}>all status</option>
        {#each listType as type}
          <option value={type.id}>{type.movement_type}</option>
        {/each}
        <option value={-1}>canceled</option>
      </select>
    </div>
    <div class="form-control w-60 max-w-xs">
      <label class="label" for="purchase_status">
        <span class="label-text">Venue</span>
      </label>
      <select id="purchase-status" class="select select-bordered select-sm" bind:value={selectedVenue}>
        <option value={0}>all venue</option>
        {#each listVenue as venue}
          <option value={venue.id}>{venue.name}</option>
        {/each}
      </select>
    </div>
    <DatePicker noRange noDaily defaultMonth={Date.now()} on:pickerSubmit={e => updateRange(e.detail)}/>
    <BtnAddNew text="Report" on:click={() => globalModal.createHeaderMovement()}/>
  </div>

  <div class="overflow-x-auto overflow-y-clip">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Details</th>
          <th>Date</th>
          <th>Venue</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#each listHeader as header}
          <tr class="hover cursor-pointer" on:click={() => openHeaderMovement(header.id)}>
            <td>
              <span class="text-info font-bold">
                {header.movement_type == 1 ? 'INC' : header.movement_type == 2 ? 'OUT' : 'TRF'}-{header.id}
              </span>
              {#if header.header_purchase_id != undefined}
                <div>
                  <span class="text-accent">Purchase: </span> {header.header_purchase_id}
                </div>
              {/if}
            </td>
            <td>
              <div class="text-info">created: {dateFormater(header.create_at)}</div>
              <div class="text-warning">finish: {header.finish_at != undefined ? dateFormater(header.finish_at) : '~'}</div>
              <div class="text-error">cancel: {header.canceled_at != undefined ? dateFormater(header.canceled_at) : '~'}</div>
            </td>
            <td>
              <div class="text-info">origin: {header.origin_venue != undefined ? header.origin_venue.name : '~'}</div>
              <div class="text-warning">target: {header.target_venue != undefined ? header.target_venue.name : '~'}</div>
            </td>
            <td>
              {#if header.canceled_at != undefined}
                <div class="text-error font-bold">CANCELED</div>
              {:else if header.finish_at != undefined}
                <div class="text-success font-bold">FINISH</div>
              {:else}
                <div class="font-bold">ON PROGRESS</div>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <th>Details</th>
          <th>Date</th>
          <th>Venue</th>
          <th>Status</th>
        </tr>
      </tfoot>
    </table>
  </div>
</div>