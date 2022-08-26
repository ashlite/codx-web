<script>
  import { get } from '$lib/api'
  import PaginationNav from '$lib/components/PaginationNav.svelte'
  import { afterNavigate } from '$app/navigation'
  import { RingLoader } from 'svelte-loading-spinners'
  import SearchBar from '$lib/components/SearchBar.svelte'
  import EditableInput from '$lib/components/EditableInput.svelte';
  import { marginCalc } from '$lib/tools'
  import { globalModal, refreshPage, toastAlert } from '$lib/store'
  import { onDestroy } from 'svelte'
  import { shortcut } from '$lib/shortcut'

  let listSupplier = {data:[]}
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
      listSupplier = await get(`/supplier?limit=${itemPerPage}&skip=${skipData}`)
    } else {
      listSupplier = await get(`/suppler?limit=${itemPerPage}&skip=${skipData}&q=${searchQuery}`) 
    }

    // totalItem = await response.data.total_product
    listSupplier = listSupplier
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
    <!-- <SearchBar on:searchTrigger={event => {
      searchQuery = event.detail.searchQuery
      RefreshData()
    }}/> -->
  </div>
  <div class="w-60">
    <button class="btn btn-primary w-full" use:shortcut={{alt:true, shift:true, code:'KeyN' }} on:click={() => globalModal.editSupplier()}>
      Add New Supplier
      <span class="ml-4">
        <kbd class="kbd kbd-xs text-base-content">N</kbd>
      </span>
    </button>
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
        <th class="text-xl">Supplier Name</th> 
        <th class="text-xl">Supplier Country</th> 
        <th class="text-xl">Supplier Email</th> 
        <th class="text-xl">Action</th>
      </tr>
    </thead>
    <tbody>
      {#if listSupplier.data.length > 0}
        {#each listSupplier.data as supplier}
          <tr>
            <td>
              {supplier.supplier_name}
            </td>
            <td>
              {supplier.country}
            </td>
            <td>
              {supplier.email}
            </td>
            <td>
              <div class="btn-group">
                <button class="btn btn-sm btn-info btn-disabled">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path xmlns="http://www.w3.org/2000/svg" d="M4 4C4 2.89543 4.89543 2 6 2H14C14.2652 2 14.5196 2.10536 14.7071 2.29289L19.7071 7.29289C19.8946 7.48043 20 7.73478 20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4ZM17.5858 8L14 4.41421V8H17.5858ZM12 4L6 4V20H18V10H13C12.4477 10 12 9.55228 12 9V4ZM8 13C8 12.4477 8.44772 12 9 12H15C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14H9C8.44772 14 8 13.5523 8 13ZM8 17C8 16.4477 8.44772 16 9 16H15C15.5523 16 16 16.4477 16 17C16 17.5523 15.5523 18 15 18H9C8.44772 18 8 17.5523 8 17Z" fill="#0D0D0D"></path>
                  </svg>
                </button>
                <button class="btn btn-sm btn-warning" on:click={() => globalModal.editSupplier(supplier)}>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path xmlns="http://www.w3.org/2000/svg" d="M16.2929 3.29289C16.6834 2.90237 17.3166 2.90237 17.7071 3.29289L20.7071 6.29289C21.0976 6.68342 21.0976 7.31658 20.7071 7.70711L11.7071 16.7071C11.5196 16.8946 11.2652 17 11 17H8C7.44772 17 7 16.5523 7 16V13C7 12.7348 7.10536 12.4804 7.29289 12.2929L16.2929 3.29289ZM9 13.4142V15H10.5858L18.5858 7L17 5.41421L9 13.4142ZM3 7C3 5.89543 3.89543 5 5 5H10C10.5523 5 11 5.44772 11 6C11 6.55228 10.5523 7 10 7H5V19H17V14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V7Z" fill="#0D0D0D"></path>
                  </svg>
                </button>
                <button class="btn btn-sm btn-error" on:click={() => globalModal.deleteConfirmation(supplier.id, supplier.supplier_name, 'supplier')}>
                  <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path xmlns="http://www.w3.org/2000/svg" d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18.9897C18.9959 5.99994 19.0021 5.99994 19.0083 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H19.9311L19.0638 20.1425C18.989 21.1891 18.1182 22 17.0689 22H6.93112C5.88184 22 5.01096 21.1891 4.9362 20.1425L4.06888 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H4.99174C4.99795 5.99994 5.00414 5.99994 5.01032 6H7V4ZM9 6H15V4H9V6ZM6.07398 8L6.93112 20H17.0689L17.926 8H6.07398ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z" fill="#0D0D0D"></path>
                  </svg>
                </button>
              </div>
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