<script>
  import { download, get, patch } from '$lib/helper/api'
  import handleDownloadResponse from '$lib/helper/donwloadFile'
  import PaginationNav from '$lib/components/organism/PaginationNav.svelte'
  import { afterNavigate } from '$app/navigation'
  import { RingLoader } from 'svelte-loading-spinners'
  import SearchBar from '$lib/components/molecule/SearchBar.svelte'
  import EditableInput from '$lib/components/atom/EditableInput.svelte'
  import BadgePercentage from '$lib/components/atom/BadgePercentage.svelte'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte'
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import CellAction from '$lib/components/molecule/CellAction.svelte';
  import { marginCalc } from '$lib/helper/tools'
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'
  import Icon from '@iconify/svelte'

  let listItem = []
  let totalItem = 0
  let searching = false
  let searchQuery = ''
  let pagination = { itemPerPage: 50, currentPage: 1 }
  const sort = {attribute: 'name', asc: true}
  
  afterNavigate(() => RefreshData())

  $: $refreshPage && RefreshData()

  async function RefreshData(){
    let skipData = (pagination.currentPage - 1) * pagination.itemPerPage
    let urlParamList = `?limit=${pagination.itemPerPage}&skip=${skipData}`
    let urlParamCount = ``
    if (searchQuery.length > 0) {
      urlParamList = urlParamList + `&q=${searchQuery}`
      urlParamCount = urlParamCount + `&q=${searchQuery}`
    }      
    
    const responseItem = await get(`/product${urlParamList}`)
    listItem = await Array.isArray(responseItem) ? responseItem : []
    
    const responseCount = await get(`/utils/count?product=1${urlParamCount}`)
    totalItem = await responseCount.total_product != undefined ? responseCount.total_product : 0

    listSorting()
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

  function updateSorting(attribute) {
    sort.attribute = attribute
    sort.asc = !sort.asc
    listSorting()
  }

  function listSorting() {
    if (sort.asc) {
      switch(sort.attribute) {
        case 'name':
          listItem = listItem.sort((a,b) => a.collection.name.localeCompare(b.collection.name))
          break
        case 'stock':
          listItem = listItem.sort((a,b) => a.total_stock - b.total_stock)
          break
        case 'buy':
          listItem = listItem.sort((a,b) => a.buy_price - b.buy_price)
          break
        case 'sell':
          listItem = listItem.sort((a,b) => a.sell_price - b.sell_price)  
          break
      }
    } else {
      switch(sort.attribute) {
        case 'name':
          listItem = listItem.sort((a,b) => b.collection.name.localeCompare(a.collection.name))
          break
        case 'stock':
          listItem = listItem.sort((a,b) => b.total_stock - a.total_stock)
          break
        case 'buy':
          listItem = listItem.sort((a,b) => b.buy_price - a.buy_price)
          break
        case 'sell':
          listItem = listItem.sort((a,b) => b.sell_price - a.sell_price)  
          break
      }
    }
  }

</script>

<div class="flex justify-between items-center gap-4">
  <div class="stat w-1/5">
    <div class="stat-title">Total Products</div>
    <div class="stat-value text-primary">{totalItem}</div>
  </div>
  <div class="w-2/5">
    <SearchBar on:searchTrigger={event => searchProduct(event.detail.searchQuery)} searchState={searching} />
  </div>
  <div class="w-2/5 flex justify-end gap-4">
    <BtnAddNew text="Product" on:click={() => globalModal.editProduct({})} />
    <BtnSuper color="accent" icon="uil:file-redo-alt" on:click={() => globalModal.excelEditor(1)}/>
  </div>
</div>
<PaginationNav totalItems={totalItem} on:changePage={e => updatePage(e.detail)} bigLimit/>

<div class="overflow-x-auto">
  <table class="table w-full">
    <thead>
      <tr class="select-none"> 
        <th class="text-xl cursor-pointer hover:bg-secondary hover:text-secondary-content" on:click={() => updateSorting('name')}>
          <div class="flex flex-row items-center">
            Product Name
            {#if sort.attribute == 'name' } 
              <Icon icon={ sort.asc ? 'uil:angle-up' : 'uil:angle-down'} width={30} height={30} />
            {/if}
          </div>
        </th> 
        <th class="text-xl cursor-pointer hover:bg-secondary hover:text-secondary-content" on:click={() => updateSorting('stock')}>
          <div class="flex flex-row items-center">
            Stock
            {#if sort.attribute == 'stock' } 
              <Icon icon={ sort.asc ? 'uil:angle-up' : 'uil:angle-down'} width={30} height={30} />
            {/if}
          </div>
        </th>
        <th class="text-xl cursor-pointer hover:bg-secondary hover:text-secondary-content" on:click={() => updateSorting('buy')}>
          <div class="flex flex-row items-center">
            Buy Price
            {#if sort.attribute == 'buy' } 
              <Icon icon={ sort.asc ? 'uil:angle-up' : 'uil:angle-down'} width={30} height={30} />
            {/if}
          </div>
        </th> 
        <th class="text-xl cursor-pointer hover:bg-secondary hover:text-secondary-content" on:click={() => updateSorting('sell')}>
          <div class="flex flex-row items-center">
            Sell Price
            {#if sort.attribute == 'sell' } 
              <Icon icon={ sort.asc ? 'uil:angle-up' : 'uil:angle-down'} width={30} height={30} />
            {/if}
          </div>
        </th>
        <th class="text-xl">Margin</th>
        <th class="text-xl">Action</th>
      </tr>
    </thead>
    <tbody>
      {#if listItem.length > 0}
        {#each listItem as product}
          <tr>
            <td>
              <div class="flex flex-row gap-2">
                <div class="w-16 h-16">
                  <img class="object-contain" src={product.product_image ?? product.collection.cover ?? `https://dummyimage.com/600x600/edb200/ffffff&text=NO+IMG`} alt="gambar product" />
                </div>
                <div class="flex flex-col">
                  <div class="font-bold">{product.collection.name}</div>
                  <div class="text-info">{product.name}</div>
                  <div class="text-accent">SKU: {product.sku}</div>
                </div>
              </div>
            </td>
            <td class="text-center">
              <div class="font-bold">{product.total_stock}</div>
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