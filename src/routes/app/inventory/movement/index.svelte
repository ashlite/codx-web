<script>
  import MonthPicker from "$lib/components/organism/MonthPicker.svelte";
  import PaginationNav from "$lib/components/organism/PaginationNav.svelte";
  import SearchBar from "$lib/components/molecule/SearchBar.svelte";
  import ProductPicker from "$lib/components/organism/ProductPicker.svelte";
  import { refreshPage } from '$lib/helper/store';
	import { get } from "$lib/helper/api";
  import { dateFormater } from "$lib/helper/tools";

  const today = new Date()
  let selectedMonth = today.getMonth()
  let selectedYear = today.getFullYear()
  let selectedProduct = undefined
  let skip = 0
  let limit = 100
  let movementResponse = get(`/inventory/movement/${selectedYear}/${selectedMonth + 1}`)
  let totalItem = 0

  $: $refreshPage && RefreshData()
  
  async function RefreshData() {
    if (selectedProduct == undefined) {
      movementResponse = await get(`/inventory/movement/${selectedYear}/${selectedMonth + 1}?skip=${skip}&limit=${limit}`)
    } else {
      movementResponse = await get(`/inventory/movement/${selectedYear}/${selectedMonth + 1}?id=${selectedProduct.id}&skip=${skip}&limit=${limit}`)
    }
    totalItem = await movementResponse.total
    refreshPage.set(false)
  }

  async function updateTime(date) {
    const selectedDate = new Date(date)
    selectedMonth = selectedDate.getMonth()
    selectedYear = selectedDate.getFullYear()
    refreshPage.set(true)
  }

  function handlePicker(item) {
    selectedProduct = item
    skip = 0
    limit = 100
    refreshPage.set(true)
  }

  function handleChangePage(pagination) {
    limit = pagination.itemPerPage
    skip = (pagination.currentPage - 1) * limit
  }
</script>

<div class="flex flex-row gap-4 mb-4 items-center">
  <h1 class="text-2xl font-bold text-primary">Product Movement</h1>
  <MonthPicker on:monthSubmit={e => updateTime(e.detail)} />
  <div class="w-3/5">
    <ProductPicker on:selected={e => handlePicker(e.detail)} />
  </div>
</div>
<PaginationNav totalItems={totalItem} on:changePage={e => handleChangePage(e.detail)}/>

<div class="overflow-x-auto">
  <table class="table w-full">
    <thead>
      <tr>
        <th>Product Data</th>
        <th>QTY</th>
        <th>Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#await movementResponse then movementData}
        {#each movementData.list_movement as data}
          <tr>
            <td>
              <div class="font-bold">{data.product.collection.name}</div>
              <div class="text-info">{data.product.name}</div>
            </td>
            <td>
              {#if data.qty >= 0}
                <div class="text-success font-bold">
                  {data.qty}
                </div>
              {:else}
                <div class="text-error font-bold">
                  {data.qty}
                </div>
              {/if}
            </td>
            <td>{dateFormater(data.move_at)}</td>
            <td>
              {#if data.apply_movement}
                <div class="badge badge-success font-bold">applied</div>
              {:else}
                <div class="badge badge-error font-bold">not applied</div>
              {/if}
            </td>
          </tr>
        {/each}
      {/await}
    </tbody>
  </table>
</div>
