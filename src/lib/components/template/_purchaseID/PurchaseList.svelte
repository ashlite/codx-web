<script>
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { priceFormater } from "$lib/helper/tools"
  import { globalModal, refreshPage } from '$lib/helper/store'
  import { del, patch } from '$lib/helper/api'
  import CellAction from "$lib/components/molecule/CellAction.svelte";
  import EditableInput from "$lib/components/atom/EditableInput.svelte";

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

  async function removePurchaseItem(listId){
    await del(`/purchase/items/${data.id}/${listId}`)
    refreshPage.set(true)
  }

  async function updateForexPrice(e) {
    const idrBuyPrice = e.newValue * data.idr_buy_rate
    await patch(`/purchase/items/${data.id}/${e.dataId}`, {forex_buy: e.newValue, idr_buy_price: idrBuyPrice})
    refreshPage.set(true)
  }

  async function updateIdrPrice(e) {
    await patch(`/purchase/items/${data.id}/${e.dataId}`, {idr_buy_price: e.newValue})
    refreshPage.set(true)
  }

  async function updateOrderedQty(e) {
    await patch(`/purchase/items/${data.id}/${e.dataId}`, {ordered_qty: e.newValue})
    refreshPage.set(true)
  }

  async function changeToNew(id){
    await patch(`/purchase/items/${data.id}/${id}`, {is_new: true})
    refreshPage.set(true)
  }

  async function changeToOld(id){
    await patch(`/purchase/items/${data.id}/${id}`, {is_new: false})
    refreshPage.set(true)
  }

</script>

<div class="overflow-x-auto pb-8">
  <table class="table w-full table-fixed">
    <!-- head -->
    <thead>
      <tr>
        <th class="text-xl text-center w-7/12">Product</th>
        <th class="text-xl text-center w-1/12">Qty</th>
        {#if data.forex_symbol != undefined && data.forex_symbol != 'IDR'}
          <th class="text-xl text-center w-1/12">{data.forex_symbol}</th>
          <th class="text-xl text-center w-2/12">{data.forex_symbol != undefined ? `IDR = ${data.idr_buy_rate}` : `IDR`}</th>
        {:else}
          <th class="text-xl text-center w-3/12">IDR</th>
        {/if}
        <th class="w-1/12"></th>
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
                  <div class="badge badge-md badge-accent font-bold text-accent-content cursor-pointer" on:click={() => changeToOld(item.id)}>NEW ITEMS</div>
                {:else}
                  <div class="badge badge-md font-bold cursor-pointer" on:click={() => changeToNew(item.id)}>RESTOCK</div>
                {/if}
                <div class="text-xl font-bold text-ellipsis">{item.product.collection.name}</div>
                <div class="text-info text-ellipsis">{item.product.name}</div>
              </div>
            </div>
          </td>
          <td class="text-center text-xl">
            <EditableInput notCurrency dataId={item.id} value={item.ordered_qty} on:editableSubmit={e => updateOrderedQty(e.detail)} />
          </td>
          {#if data.forex_symbol != undefined && data.forex_symbol != 'IDR'}
            <td class="text-right">
              <div><EditableInput dataId={item.id} currency={data.forex_symbol} value={item.forex_buy} on:editableSubmit={e => updateForexPrice(e.detail)} /></div>
              <div class="text-info">{priceFormater(item.forex_buy * item.ordered_qty, data.forex_symbol)}</div>
            </td>
            <td class="text-right">
              <div>{priceFormater(item.idr_buy_price)}</div>
              <div class="text-info">{priceFormater(item.idr_buy_price * item.ordered_qty)}</div>
            </td>
          {:else}
            <td class="text-right">
              <div><EditableInput dataId={item.id} value={item.idr_buy_price} on:editableSubmit={e => updateIdrPrice(e.detail)} /></div>
              <div class="text-info">{priceFormater(item.idr_buy_price * item.ordered_qty)}</div>
            </td>
          {/if}
          <td class="justify-end">
            <CellAction remove on:remove={() => removePurchaseItem(item.id)}/>
          </td>
        </tr>
      {/each}
      <tr>
        <td class="text-info font-bold text-2xl text-right">PURCHASE SUMMARY</td>
        <td class="text-info font-bold text-xl">{sumData.totalQty}</td>
        {#if data.forex_symbol != undefined && data.forex_symbol != 'IDR'}
          <td class="text-info font-bold text-xl text-right">
            {priceFormater(sumData.totalForexBuy, data.forex_symbol)}
          </td>
        {/if}
        <td class="text-info font-bold text-xl text-right">
          {priceFormater(sumData.totalIdrBuy)}
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
  <div class="flex flex-row gap-4 justify-end">
    <div class="w-1/4">
      <BtnSuper icon="uil:plus" text="Product" color="primary" key="KeyN" kbd="N" block on:click={() => globalModal.addPurchaseProduct(data.idr_buy_rate, data.id)} />
    </div>
  </div>
</div>