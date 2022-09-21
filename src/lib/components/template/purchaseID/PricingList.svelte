<script>
  import SupplierCard from "$lib/components/molecule/SupplierCard.svelte"
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { priceFormater, dateFormater, marginCalc } from "$lib/helper/tools"
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'
  import { post, del, patch } from '$lib/helper/api'
  import Status from "$lib/components/atom/Status.svelte";
  import FileCard from "$lib/components/molecule/FileCard.svelte";
  import CellAction from "$lib/components/molecule/CellAction.svelte";
  import EditableInput from "$lib/components/atom/EditableInput.svelte";
	import TextInput from "$lib/components/molecule/TextInput.svelte";
	import BadgePercentage from "$lib/components/atom/BadgePercentage.svelte";

  export let data
  let sumData = summaryPurchase()

  $: data.list_item.length, sumData = summaryPurchase()

  function summaryPurchase(){
    let totalQty = 0
    let totalProduct = 0
    let totalIdrBuy = 0
    let totalForexBuy = 0
    data.list_item.forEach(item => {
      totalProduct++
      totalQty += item.ordered_qty
      totalIdrBuy += item.ordered_qty * item.idr_buy_price
      totalForexBuy += item.ordered_qty * item.forex_buy
    });
    return {totalQty, totalProduct, totalIdrBuy, totalForexBuy}
  }

  async function updateMSRP(id, newPrice){
    const requestBody = {
      forex_sell: newPrice
    }
    await patch(`/purchase/items/${data.id}/${id}`, requestBody)
    refreshPage.set(true)
  }

  async function updateSell(id, newPrice){
    const requestBody = {
      idr_sell_price: newPrice
    }
    await patch(`/purchase/items/${data.id}/${id}`, requestBody)
    refreshPage.set(true)
  }

</script>

{#if data.forex_symbol != undefined && data.forex_symbol != 'IDR'}
  <div class="w-1/2">
    <TextInput 
      labelTL = "Forex Rate for MSRP"
      bind:value={data.idr_sell_rate}
    />
  </div>
{/if}
<div class="overflow-x-auto pb-8">
  <table class="table w-full table-fixed">
    <!-- head -->
    <thead>
      <tr>
        <th class="text-xl text-center w-6/12">Data Product</th>
        <th class="text-xl text-center w-2/12">MSRP</th>
        <th class="text-xl text-center w-2/12">System Price</th>
        <th class="text-xl text-center w-2/12">New Price</th>
      </tr>
    </thead>
    <tbody>
      {#each data.list_item.sort((a,b) => a.id - b.id) as item}
        <tr>
          <td>
            <div class="flex flex-row gap-2">
              <div class="avatar">
                <div class="w-20 rounded">
                  <img src={item.product.product_image != undefined ? item.product.product_image : item.product.collection.cover} alt="Product"/>
                </div>
              </div>
              <div class="flex flex-col overflow-x-clip">
                {#if item.is_new}
                  <div class="badge badge-md badge-accent font-bold text-accent-content">NEW ITEMS</div>
                {/if}
                <div class="text-xl font-bold text-ellipsis">{item.product.collection.name}</div>
                <div class="text-info text-ellipsis">{item.product.name}</div>
              </div>
            </div>
          </td>
          <td class="text-left">
            {#if data.forex_symbol != undefined && data.forex_symbol != 'IDR'}
              <EditableInput 
                bind:value={item.forex_sell} 
                currency="USD" 
                frontLabel="MSRP"
                dataId={item.id}
                on:editableSubmit={e => updateMSRP(e.detail.dataId, e.detail.newValue)}  
              />
              <div>
                <span class="text-info">IDR: </span> {priceFormater(item.forex_sell * data.idr_sell_rate)}
              </div>
              <BadgePercentage value={marginCalc(item.idr_buy_price, item.forex_sell * data.idr_sell_rate, 'percent')} />
            {/if}
          </td>
          <td class="text-right">
            <div>{priceFormater(item.product.sell_price)}</div>
            <div class="text-info">{priceFormater(item.product.sell_price * item.ordered_qty)}</div>
            <BadgePercentage value={marginCalc(item.idr_buy_price, item.product.sell_price, 'percent')} />
          </td>
          <td class="text-right">
            <EditableInput
              bind:value={item.idr_sell_price}
              dataId={item.id}
              on:editableSubmit={e => updateSell(e.detail.dataId, e.detail.newValue)}
            />
            <div class="text-info">{priceFormater(item.idr_sell_price * item.ordered_qty)}</div>
            <BadgePercentage value={marginCalc(item.idr_buy_price, item.idr_sell_price, 'percent')} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="flex flex-row gap-4 justify-end">
    <div class="w-1/4">
      <BtnSuper icon="uil:plus" text="Product" color="primary" key="KeyN" kbd="N" block on:click={() => globalModal.addPurchaseProduct(data.idr_buy_rate, data.id)} />
    </div>
    <div class="w-2/5">
      <BtnSuper icon="uil:plus" text="Collection with Product" color="secondary" key="KeyC" kbd="C" block on:click={() => globalModal.addPurchaseNewCollection(data.id, data.idr_buy_rate)} />
    </div>
  </div>
</div>