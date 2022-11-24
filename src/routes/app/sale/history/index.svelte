<script>
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte"
  import { refreshPage, globalModal } from '$lib/helper/store'
  import { afterNavigate } from '$app/navigation'
  import { get } from "$lib/helper/api"
  import { dateFormater } from '$lib/helper/tools'
  import MonthPicker from "$lib/components/organism/MonthPicker.svelte"

  let listHeader = []
  let filterList = 0

  $: $refreshPage && RefreshData()

  afterNavigate(async () => {
    RefreshData()
  })

  async function RefreshData() {    
    const result = await get(`/sale/header`)
    switch (filterList) {
      case 0:
        listHeader = result
        break
      case 1:
        listHeader = result.filter(item => item.status == 'PENDING')
        break
      case 2:
        listHeader = result.filter(item => item.status == 'ON_PROGRESS')
        break
      case 3:
        listHeader = result.filter(item => item.status == 'FINISH')
        break
      case 4:
        listHeader = result.filter(item => item.status == 'CANCEL')
        break
      case 5:
        listHeader = result.filter(item => item.status == 'TROUBLE')
        break
    }
    refreshPage.set(false)
  } 

  function openSale(id) {
    window.open(`/app/sale/detail/${id}`, '_blank')
  }
</script>

<div class="w-full min-h-screen pb-4 px-4">
  <div class="grid grid-cols-4 justify-between items-center gap-4 mb-4">
    <select class="select select-bordered w-full" bind:value={filterList} on:change={() => refreshPage.set(true)}>
      <option value={0} selected>All Status</option>
      <option value={1}>Pending</option>
      <option value={2}>Payment Progress</option>
      <option value={3}>Finish</option>
      <option value={4}>Cancel</option>
      <option value={5}>Trouble</option>
    </select>
    <MonthPicker />
  </div>

  <div class="overflow-x-auto overflow-y-clip">
    <table class="table w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Metadata</th>
          <th>Venue</th>
        </tr>
      </thead>
      <tbody>
        {#each listHeader as header}
          <tr class="hover cursor-pointer" on:click={() => openSale(header.id)}>
            <td class="text-lg font-bold text-primary">
              {header.id}
            </td>
            <td>
              {#if header.customer != undefined}
                <div class="font-bold">{header.customer.name}</div>
                <div class="text-info">{header.customer.email}</div>
                <div>{header.customer.mobile}</div>
              {:else}
                <div class="font-bold text-accent-focus">None Selected</div>
              {/if}
            </td>
            <td>
              <div class="font-bold">Creator: {`${header.created_user.first_name}`}</div>
              <div class="text-warning">Date: {dateFormater(header.created_at)}</div>
              <div class="text-warning">Status: {header.status}</div>
            </td>
            <td>
              <div class="font-bold">{header.venue.name}</div>
            </td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Metadata</th>
          <th>Venue</th>
        </tr>
      </tfoot>
    </table>
  </div>
</div>