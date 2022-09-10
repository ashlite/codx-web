<script>
  import PaginationNav from "$lib/components/organism/PaginationNav.svelte"
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte";
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
  
</script>

<div class="w-full min-h-screen pb-4 px-4">
  <div class="flex flex-row justify-between items-center gap-4 mb-2">
    <div class="stat w-32">
      <div class="stat-title">Total Items</div>
      <div class="stat-value text-primary">{totalItem}</div>
    </div>
    <DatePicker noRange on:pickerSubmit/>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="purchase_status">
        <span class="label-text">Purchase Status</span>
      </label>
      <select id="purchase-status" class="select select-bordered select-sm">
        <option selected>All Status</option>
        <option>In Progress</option>
        <option>Finish</option>
      </select>
    </div>
    <div class="w-60">
      <BtnAddNew text="Purchase" on:click={() => globalModal.createPurchase()}/>
    </div>
  </div>
  <PaginationNav totalItems={totalItem} />

  <div class="overflow-x-auto overflow-y-clip">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Id</th>
          <th>Date</th>
          <th>Supplier</th>
          <th>Total Item</th>
          <th>Approval</th>
        </tr>
      </thead>
      <tbody>
        {#if listPurchase.length > 0}
          {#each listPurchase as purchase}
            <tr>
              <td><a href={`/app/inventory/purchase/${purchase.id}`} class="cursor-pointer font-bold text-primary underline underline-offset-2" target="_blank">{purchase.id}</a></td>
              <td>
                <div class="flex flex-col">
                  <div><span class="font-bold text-info">Created: </span>{dateFormater(purchase.header_date, 'date')}</div>
                  <div><span class="font-bold text-warning">Finish: </span>{purchase.finish_date ? purchase.finish_date : 'In progress'}</div>
                </div>
              </td>
              <td>
                <div class="dropdown dropdown-hover dropdown-right dropdown-end">
                  <label tabindex="0" for="" class="" >{purchase.supplier.supplier_name}</label>
                  <div tabindex="0" class="dropdown-content card compact w-64 shadow bg-info text-info-content">
                    <div class="card-body">
                      <h3 class="card-title">{purchase.supplier.supplier_name}</h3>
                      <p>{`(${purchase.supplier.country}) - ${purchase.supplier.email}`}</p>
                    </div>
                  </div>
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
          <th>Id</th>
          <th>Date</th>
          <th>Supplier</th>
          <th>Total Item</th>
          <th>Approval</th>
        </tr>
      </tfoot>
    </table>
  </div>
</div>