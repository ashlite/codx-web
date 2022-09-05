<script>
  import { get } from '$lib/helper/api'
  import PaginationNav from '$lib/components/organism/PaginationNav.svelte'
  import { afterNavigate } from '$app/navigation'
  import { RingLoader } from 'svelte-loading-spinners'
  import SearchBar from '$lib/components/molecule/SearchBar.svelte'
  import EditableInput from '$lib/components/atom/EditableInput.svelte'
  import BadgePercentage from '$lib/components/atom/BadgePercentage.svelte'
  import BtnIcon from '$lib/components/atom/BtnIcon.svelte'
  import BtnGroup from '$lib/components/atom/BtnGroup.svelte'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte'
  import { marginCalc } from '$lib/helper/tools'
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'
  import { onDestroy } from 'svelte'
  import {patch} from '$lib/helper/api'

  let listProduct = {data:[]}
  let totalItem = 0
  let searchQuery, itemPerPage = 50, currentPage = 1

  afterNavigate(() => RefreshData())

  async function RefreshData() {
    let skipData = (currentPage - 1) * itemPerPage
    let response
    if (searchQuery == undefined){
      response = await get('/utils/count?product=1')
      listProduct = await get(`/product?limit=${itemPerPage}&skip=${skipData}`)
    } else {
      listProduct = await get(`/product?limit=${itemPerPage}&skip=${skipData}&q=${searchQuery}`) 
    }

    totalItem = await response.data.total_product
    listProduct = listProduct
  }

  const unsubscribe = refreshPage.subscribe(value => {
    if (value){
      RefreshData()
      refreshPage.set(false)
    }
  })
  onDestroy(unsubscribe)

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
    <SearchBar on:searchTrigger={event => {
      searchQuery = event.detail.searchQuery
      RefreshData()
    }}/>
  </div>
  <div class="w-60">
    <BtnAddNew text="Product" on:click={() => globalModal.editProduct({})} />
    <!-- <button class="btn btn-primary w-full" >Add New Product</button> -->
  </div>
</div>
<PaginationNav totalItems={totalItem} on:updatePagination={event => {
  itemPerPage = event.detail.itemPerPage
  currentPage = event.detail.currentPage
  RefreshData()
}}/>

<div class="overflow-x-auto">
  <table class="table table-compact w-full">
    <thead>
      <tr> 
        <th class="text-xl">Product Name</th> 
        <th class="text-xl">Buy Price</th> 
        <th class="text-xl">Sell Price</th> 
        <th class="text-xl">Action</th>
      </tr>
    </thead>
    <tbody>
      {#if listProduct.data.length > 0}
        {#each listProduct.data as product}
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
                <BadgePercentage value={marginCalc(product.buy_price, product.sell_price, 'percent')}/>
              </div>
            </td>
            <td>
              <BtnGroup>
                <BtnIcon icon="uil:edit" iconSize="24" color="warning" size="sm" on:click={() => globalModal.editProduct(product, product.collection)}/>
                <BtnIcon icon="uil:trash-alt" iconSize="24" color="error" size="sm" on:click={() => globalModal.deleteConfirmation(product.id, product.name, 'product')}/>
              </BtnGroup>
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