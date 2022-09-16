<script>
  import PaginationNav from "$lib/components/organism/PaginationNav.svelte"
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte"
  import { refreshPage } from '$lib/helper/store'
  import { globalModal } from "$lib/helper/store"
  import { afterNavigate } from '$app/navigation'
  import { get } from "$lib/helper/api"
  import { dateFormater, priceFormater } from '$lib/helper/tools'
  import DatePicker from "$lib/components/organism/DatePicker.svelte"

  let listPurchase = []
  let itemPerPage = 50
  let currentPage = 1
  let totalItem = 0
  let searchQuery

  $: $refreshPage && RefreshData()

  afterNavigate(() => RefreshData())
  
  async function RefreshData() {
    let skipData = (currentPage - 1) * itemPerPage
    listPurchase = await get(`/purchase/header?limit=${itemPerPage}&skip=${skipData}`)
    let response = await get(`/utils/count?headerpurchase=1`)
    totalItem = response.total_purchase
    refreshPage.set(false)
  }

  function openPurchase(id){
    window.open(`/app/inventory/purchase/${id}`, '_blank')
  }
  
</script>

<div class="w-full min-h-screen pb-4 px-4">
  <div class="flex flex-row justify-between items-center gap-4 mb-2">
    <div class="form-control w-60 max-w-xs">
      <label class="label" for="purchase_status">
        <span class="label-text">Purchase Status</span>
      </label>
      <select id="purchase-status" class="select select-bordered select-sm">
        <option selected>All Status</option>
        <option>In Progress</option>
        <option>Finish</option>
      </select>
    </div>
    <div class="form-control w-60 max-w-xs">
      <label class="label" for="purchase_status">
        <span class="label-text">Supplier</span>
      </label>
      <select id="purchase-status" class="select select-bordered select-sm">
        <option selected>All Status</option>
        <option>In Progress</option>
        <option>Finish</option>
      </select>
    </div>
    <DatePicker noRange on:pickerSubmit/>
    <BtnAddNew text="Purchase" on:click={() => globalModal.createPurchase()}/>
  </div>
  <PaginationNav totalItems={totalItem} />

  <div class="overflow-x-auto overflow-y-clip">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Details</th>
          <th>Date</th>
          <th>Total Item</th>
          <th>Approval</th>
        </tr>
      </thead>
      <tbody>
        {#if listPurchase.length > 0}
          {#each listPurchase as purchase}
            <tr class="hover cursor-pointer" on:click={() => openPurchase(purchase.id)}>
              <td>
                <div class="flex flex-col">
                  <p><span class="font-bold text-info">ID: </span>{purchase.id}</p>
                  <p><span class="font-bold text-info">Supplier: </span>{purchase.supplier.supplier_name}</p>
                </div>
              </td>
              <td>
                <div class="flex flex-col">
                  <div><span class="font-bold text-info">Created: </span>{dateFormater(purchase.header_date, 'date')}</div>
                  <div><span class="font-bold text-warning">Finish: </span>{purchase.finish_date ? purchase.finish_date : 'In progress'}</div>
                </div>
              </td>
              <td>
                <div class="flex flex-col">
                  <div><span class="font-bold text-info">Values: </span>{priceFormater(purchase.total_idr_buy)}</div>
                  <div><span class="font-bold text-info">QTY: </span>{purchase.total_items}</div>
                </div>
              </td>
              <td>
                <div class="flex flex-col">
                  {#each purchase.approval_purchase as approval}
                    <div class="badge">{approval.id}</div>
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
      <tfoot>
        <tr>
          <th>Details</th>
          <th>Date</th>
          <th>Total Item</th>
          <th>Approval</th>
        </tr>
      </tfoot>
    </table>
  </div>
</div>