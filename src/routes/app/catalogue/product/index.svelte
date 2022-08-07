<script>
  import { get } from '$lib/api'
  import {priceFormater} from '$lib/tools'
  import PaginationNav from '$lib/components/PaginationNav.svelte'
  import { afterNavigate } from '$app/navigation'
  import { RingLoader } from 'svelte-loading-spinners'

  let listProduct = {data:[]}
  let totalItem = 0

  afterNavigate(() => RefreshData())

  async function RefreshData(data){
    if (data == undefined){
      let response = await get('/utils/count?product=1')
      totalItem = await response.data.total_collection
      listProduct = await get(`/product?limit=10`)
    } else {
      let skipData = (data.currentPage - 1) * data.itemPerPage
      listProduct = await get(`/product?limit=${data.itemPerPage}&skip=${skipData}`) 
    }
    listProduct = listProduct
  }
</script>

<PaginationNav defaultItemPerPage=100 totalItems={totalItem} on:updatePagination={event => RefreshData(event.detail)}/>

<div class="overflow-x-auto">
  <table class="table table-compact w-full">
    <thead>
      <tr> 
        <th>Collection</th> 
        <th>Product</th>
        <th>Buy Price</th> 
        <th>Sell Price</th> 
      </tr>
    </thead>
    <tbody>
      {#if listProduct.data.length > 0}
        {#each listProduct.data as product}
          <tr>
            <td>{product.collection.name}</td>
            <td>{product.name}</td>
            <td>{priceFormater(product.buy_price)}</td>
            <td>{priceFormater(product.sell_price)}</td>
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