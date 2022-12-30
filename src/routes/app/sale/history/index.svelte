<script>
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte"
  import { refreshPage, globalModal } from '$lib/helper/store'
  import { afterNavigate } from '$app/navigation'
  import { get } from "$lib/helper/api"
  import { dateFormater } from '$lib/helper/tools'
  import MonthPicker from "$lib/components/organism/MonthPicker.svelte"
  import PaginationNav from "$lib/components/organism/PaginationNav.svelte"

  let listHeader = []
  let filterList = 0
  let sortList = 1
  let dateFilter = new Date()
  let totalRow = 0
  let currentPage = 1
  let itemPerPage = 50

  $: $refreshPage && RefreshData()

  afterNavigate(async () => {
    RefreshData()
  })

  async function RefreshData() {    
    const dateMin = new Date(dateFilter)
    dateMin.setDate(1)
    dateMin.setHours(0,0,0,0)
    const dateMax = new Date(dateFilter)
    dateMax.setMonth(dateMax.getMonth() + 1)
    dateMax.setDate(0)
    dateMax.setHours(23,59,59,999)
    const result = await get(`/sale/header?finish=2&datemin=${dateFormater(dateMin, 'isoDateTime')}&datemax=${dateFormater(dateMax, 'isoDateTime')}&sort=${sortList}&take=${itemPerPage}&skip=${(currentPage - 1) * itemPerPage}`)
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
    totalRow = await get(`/sale/count?finish=2&datemin=${dateFormater(dateMin, 'isoDateTime')}&datemax=${dateFormater(dateMax, 'isoDateTime')}`)
    refreshPage.set(false)
  } 

  function openSale(id) {
    window.open(`/app/sale/detail/${id}`, '_blank')
  }

  function updateDateFilter(newDate) {
    dateFilter = newDate
    refreshPage.set(true)
  }

  function updatePage(pagination) {
    currentPage = pagination.currentPage
    itemPerPage = pagination.itemPerPage
    refreshPage.set(true)
  }
</script>

<div class="w-full min-h-screen pb-4 px-4">
  <div class="grid grid-cols-3 justify-between items-center gap-4 mb-4">
    <select class="select select-bordered w-full" bind:value={filterList} on:change={() => refreshPage.set(true)}>
      <option value={0} selected>All Status</option>
      <option value={1}>Pending</option>
      <option value={2}>Payment Progress</option>
      <option value={3}>Finish</option>
      <option value={4}>Cancel</option>
      <option value={5}>Trouble</option>
    </select>
    <select class="select select-bordered w-full" bind:value={sortList} on:change={() => refreshPage.set(true)}>
      <option value={1} selected>ID Ascending</option>
      <option value={2}>ID Descending</option>
      <option value={3}>Create Date Ascending</option>
      <option value={4}>Create Date Descending</option>
      <option value={5}>Last Update Ascending</option>
      <option value={6}>Last Update Descending</option>
    </select>
    <MonthPicker on:monthSubmit={e => updateDateFilter(e.detail)}/>
    <div class="col-span-3">
      <PaginationNav totalItems={totalRow} on:changePage={e => updatePage(e.detail)} />
    </div>
  </div>

  <div class="overflow-x-auto overflow-y-clip">
    <table class="table w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Metadata</th>
          <th>Notes</th>
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
              <div>{header.notes}</div>
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
          <th>Notes</th>
          <th>Venue</th>
        </tr>
      </tfoot>
    </table>
  </div>
</div>