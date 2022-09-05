<script>
  import { get, del } from '$lib/helper/api'
  import PaginationNav from '$lib/components/organism/PaginationNav.svelte'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte';
  import CellAction from '$lib/components/molecule/CellAction.svelte'
  import { afterNavigate } from '$app/navigation'
  import { RingLoader } from 'svelte-loading-spinners'
  import SearchBar from '$lib/components/molecule/SearchBar.svelte'
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'
  import { onDestroy } from 'svelte'
  import { shortcut } from '$lib/helper/shortcut'

  let listCustomer = {data:[]}
  // let totalItem = 0
  let searchQuery
  let itemPerPage = 50
  let currentPage = 1

  afterNavigate(() => RefreshData())

  async function RefreshData() {
    let skipData = (currentPage - 1) * itemPerPage
    // let response
    if (searchQuery == undefined){
      // response = await get('/utils/count?product=1')
      listCustomer = await get(`/customer?limit=${itemPerPage}&skip=${skipData}`)
    } else {
      listCustomer = await get(`/customer?limit=${itemPerPage}&skip=${skipData}&q=${searchQuery}`) 
    }

    // totalItem = await response.data.total_product
    listCustomer = listCustomer
  }

  const unsubscribe = refreshPage.subscribe(value => {
    if (value){
      RefreshData()
      refreshPage.set(false)
    }
  })
  onDestroy(unsubscribe) 

</script>

<div class="flex justify-between items-center gap-4">
  <!-- <div class="stat w-32">
    <div class="stat-title">Total Products</div>
    <div class="stat-value text-primary">{totalItem}</div>
  </div> -->
  <div class="w-80">
    <SearchBar on:searchTrigger={event => {
      searchQuery = event.detail.searchQuery
      RefreshData()
    }}/>
  </div>
  <div class="w-60">
    <BtnAddNew text="Customer" on:click={() => globalModal.editCustomer()} />
  </div>
</div>
<!-- <PaginationNav totalItems={totalItem} on:updatePagination={event => {
  itemPerPage = event.detail.itemPerPage
  currentPage = event.detail.currentPage
  RefreshData()
}}/> -->

<div class="overflow-x-auto">
  <table class="table table-compact w-full">
    <thead>
      <tr> 
        <th class="text-xl">Customer Name</th> 
        <th class="text-xl">Customer Email</th> 
        <th class="text-xl">Customer Mobile</th> 
        <th class="text-xl">Action</th>
      </tr>
    </thead>
    <tbody>
      {#if listCustomer.data.length > 0}
        {#each listCustomer.data as customer}
          <tr>
            <td>
              {customer.name}
            </td>
            <td>
              {customer.email}
            </td>
            <td>
              {customer.mobile}
            </td>
            <td>
              <CellAction edit remove
                on:edit={() => globalModal.editCustomer(customer)}
                on:remove={() => globalModal.deleteConfirmation(customer.id, customer.name, 'customer')}
              />
            </td>
          </tr>
        {/each}
      {:else}
        <div class="mx-auto my-6 w-fit">
          <RingLoader size="200" color="#FF3E00" unit="px" duration="2s"/>
        </div>
      {/if}
    </tbody> 
  </table>
</div>