<script>
  import { get, patch } from '$lib/helper/api'
  import PaginationNav from '$lib/components/organism/PaginationNav.svelte'
  import { afterNavigate } from '$app/navigation'
  import { RingLoader } from 'svelte-loading-spinners'
  import SearchBar from '$lib/components/molecule/SearchBar.svelte'
  import EditableInput from '$lib/components/atom/EditableInput.svelte'
  import BadgePercentage from '$lib/components/atom/BadgePercentage.svelte'
  import BtnIcon from '$lib/components/atom/BtnIcon.svelte'
  import BtnGroup from '$lib/components/atom/BtnGroup.svelte'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte'
  import CellAction from '$lib/components/molecule/CellAction.svelte';
  import { marginCalc } from '$lib/helper/tools'
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'

  let listItem = []
  let totalItem = 0
  let searching = false
  let searchQuery = ''
  let pagination = { itemPerPage: 50, currentPage: 1 }
  
  afterNavigate(() => RefreshData())

  $: refreshPage && RefreshData()

  async function RefreshData(){
    let skipData = (pagination.currentPage - 1) * pagination.itemPerPage
    let urlParamList = `?limit=${pagination.itemPerPage}&skip=${skipData}`
    let urlParamCount = ``
    if (searchQuery.length > 0) {
      urlParamList = urlParamList + `&q=${searchQuery}`
      urlParamCount = urlParamCount + `?q=${searchQuery}`
    }      
    
    const responseItem = await get(`/product${urlParamList}`)
    listItem = await Array.isArray(responseItem) ? responseItem : []
    
    const responseCount = await get(`/utils/count?product=1${urlParamCount}`)
    totalItem = await responseCount.total_product != undefined ? responseCount.total_product : 0

    refreshPage.set(false)
    searchQuery = ''
    searching = false
  }

  async function searchProduct(query){
    searching = true
    searchQuery = query
    refreshPage.set(true)
  }

  async function updatePage(limit){
    pagination.itemPerPage = limit.itemPerPage
    pagination.currentPage = limit.currentPage
    refreshPage.set(true)
  }

  async function handleEditable(type, data){
    let response
    try{
      if (type == 'buy'){
        response = await patch(`/product/${data.dataId}/buyprice/${data.newValue}`)  
      } else if (type == 'sell'){
        response = await patch(`/product/${data.dataId}/sellprice/${data.newValue}`)
      }
    } catch (error){
      toastAlert.error(error.message)
    }

    if (response.status == 200){
      RefreshData()
      toastAlert.success('Price updated')
    } else {
      toastAlert.error('Failed to update price')
    }
  } 

</script>

<div class="flex justify-between items-center gap-4">
  <div class="stat w-32">
    <div class="stat-title">Total Products</div>
    <div class="stat-value text-primary">{totalItem}</div>
  </div>
  <div class="w-80">
    <SearchBar on:searchTrigger={event => searchProduct(event.detail.searchQuery)} searchState={searching} />
  </div>
  <div class="w-60">
    <BtnAddNew text="Product" on:click={() => globalModal.editProduct({})} />
  </div>
</div>
<PaginationNav totalItems={totalItem} on:updatePagination={event => updatePage(event.detail)}/>

<div class="overflow-x-auto">
  <table class="table table-compact w-full">
    <thead>
      <tr> 
        <th class="text-xl">Product Name</th> 
        <th class="text-xl">Buy Price</th> 
        <th class="text-xl">Sell Price</th>
        <th class="text-xl">Margin</th>
        <th class="text-xl">Action</th>
      </tr>
    </thead>
    <tbody>
      {#if listItem.length > 0}
        {#each listItem as product}
          <tr>
            <td>
              <div class="flex flex-col">
                <div class="font-bold">{product.collection.name}</div>
                <div class="text-info">{product.name}</div>
              </div>
            </td>
            <td>
              <EditableInput value={product.buy_price} dataId={product.id} on:editableSubmit={event => handleEditable('buy', event.detail)}/>
            </td>
            <td>
              <div class="flex flex-col gap-2">
                <EditableInput value={product.sell_price} dataId={product.id} on:editableSubmit={event => handleEditable('sell', event.detail)}/>
                </div>
            </td>
            <td>                
                <BadgePercentage value={marginCalc(product.buy_price, product.sell_price, 'percent')}/>
            </td>
            <td>
              <CellAction edit remove
                on:edit={() => globalModal.editProduct(product, product.collection)}
                on:remove={() => globalModal.deleteConfirmation(product.id, `${product.collection.name} - ${product.name}`, 'product')}
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