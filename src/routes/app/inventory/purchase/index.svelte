<script>
  import PaginationNav from "$lib/components/organism/PaginationNav.svelte"
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte"
  import { refreshPage } from '$lib/helper/store'
  import { globalModal } from "$lib/helper/store"
  import { afterNavigate } from '$app/navigation'
  import { get } from "$lib/helper/api"
  import { dateFormater, priceFormater } from '$lib/helper/tools'
  import MonthPicker from "$lib/components/organism/MonthPicker.svelte"

  let listPurchase = []
  let listSupplier = []
  let statusPurchase = 0
  let selectedSupplier = 0
  let selectedDate = new Date()

  $: $refreshPage && RefreshData()

  afterNavigate(() => RefreshData())
  
  async function RefreshData() {
    if (statusPurchase == 0) {
      listPurchase = await get(`/purchase/header`)
    } else {
      const dateMin = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0, 0, 0, 0)
      const dateMax = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999)
      listPurchase = await get(`/purchase/header?finish=${statusPurchase}&supplier=${selectedSupplier}&datemin=${dateFormater(dateMin, 'isoDateTime')}&datemax=${dateFormater(dateMax, 'isoDateTime')}`)
      listSupplier = await get(`/supplier`)
    }
    refreshPage.set(false)
  }

  function openPurchase(id){
    window.open(`/app/inventory/purchase/${id}`, '_blank')
  }

  function changeMonth(date){
    selectedDate = date
    refreshPage.set(true)
  }
  
</script>

<div class="w-full min-h-screen pb-4 px-4">
  <div class="flex flex-row justify-between items-center gap-4 mb-2">
    <div class="form-control w-60 max-w-xs">
      <label class="label" for="purchase_status">
        <span class="label-text">Purchase Status</span>
      </label>
      <select id="purchase-status" class="select select-bordered select-sm" bind:value={statusPurchase} on:change={() => refreshPage.set(true)}>
        <option value={0}>On Progress</option>
        <option value={1}>Done</option>
        <option value={2}>Finish Only</option>
        <option value={3}>Cancel Only</option>
      </select>
    </div>
    {#if statusPurchase != 0}
      <div class="form-control w-60 max-w-xs">
        <label class="label" for="purchase_status">
          <span class="label-text">Supplier</span>
        </label>
        <select id="Suplier" class="select select-bordered select-sm" bind:value={selectedSupplier} on:change={() => refreshPage.set(true)}>
          <option value={0} >All Supplier</option>
          {#each listSupplier as supplier}
            <option value={supplier.id}>{supplier.supplier_name} - {supplier.country}</option>
          {/each}
        </select>
      </div>
      <MonthPicker on:monthSubmit={e => changeMonth(e.detail)} />
    {/if}
    <BtnAddNew text="Purchase" on:click={() => globalModal.createPurchase()}/>
  </div>

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
                  <p><span class="font-bold text-info">External: </span>{purchase.external_ref}</p>
                </div>
              </td>
              <td>
                <div class="flex flex-col">
                  <div><span class="font-bold text-info">Created: </span>{dateFormater(purchase.header_date, 'date')}</div>
                  {#if purchase.finish_at}
                    <div><span class="font-bold text-warning">Finish: </span>{dateFormater(purchase.finish_at, 'date')}</div>
                  {:else if purchase.canceled_at}
                    <div><span class="font-bold text-error">Cancel: </span>{dateFormater(purchase.canceled_at, 'date')}</div>
                  {:else}
                    <div class="font-bold text-primary">On Progress</div>
                  {/if}
                </div>
              </td>
              <td>
                <div class="flex flex-col">
                  <div><span class="font-bold text-info">Values: </span>{priceFormater(purchase.total_idr_buy)}</div>
                  <div><span class="font-bold text-info">QTY: </span>{purchase.total_items}</div>
                </div>
              </td>
              <td>
                <div class="flex flex-col gap-2">
                  {#each purchase.approval_purchase as approval}
                    <div class="badge badge-success">{approval.approval_type == 1 ? 'invoice' : approval.approval_type == 2 ? 'pricing' : approval.approval_type == 3 ? 'inventory' : 'finance'}</div>
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