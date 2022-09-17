<script>
  import SupplierCard from "$lib/components/molecule/SupplierCard.svelte"
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { priceFormater, dateFormater } from "$lib/helper/tools"
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'
  import { post } from '$lib/helper/api'
  import Status from "$lib/components/atom/Status.svelte";
  import FileCard from "$lib/components/molecule/FileCard.svelte";
  import CellAction from "$lib/components/molecule/CellAction.svelte";
  import EditableInput from "$lib/components/atom/EditableInput.svelte";

  export let data

  let sumData = summaryPurchase()

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

</script>

<div class="overflow-x-auto">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th rowspan="2" class="text-xl text-center">Product</th>
        <th rowspan="2" class="text-xl text-center">Qty</th>
        {#if data.forex_symbol != undefined}
          <th colspan="2" class="text-xl text-center">{data.forex_symbol}</th>
        {/if}
        <th colspan="2" class="text-xl text-center">{data.forex_symbol != undefined ? `IDR = ${data.idr_buy_rate}` : `IDR`}</th>
        <th rowspan="2"></th>
      </tr>
      <tr>
        {#if data.forex_symbol != undefined}
          <th class="text-xl text-center">Single</th>
          <th class="text-xl text-center">Total</th>
        {/if}
        <th class="text-xl text-center">Single</th>
        <th class="text-xl text-center">Total</th>
      </tr>
    </thead>
    <tbody>
      {#each data.list_item as item}
        <tr>
          <td>
            <div class="flex flex-row gap-2">
              <div class="avatar">
                <div class="w-20 rounded">
                  <img src={item.product.product_image != undefined ? item.product.product_image : item.product.collection.cover} alt="Product"/>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-xl font-bold">{item.product.collection.name}</div>
                <div class="text-info">{item.product.name}</div>
              </div>
            </div>
          </td>
          <td class="tex-center text-xl">
            {item.ordered_qty}
          </td>
          {#if data.forex_symbol != undefined}
            <td class="text-right">
              {priceFormater(item.forex_buy, 'USD')}
            </td>
            <td class="text-right">
              {priceFormater(item.forex_buy * item.ordered_qty, 'USD')}
            </td>
          {/if}
          <td class="text-right">
            {priceFormater(item.idr_buy_price)}
          </td>
          <td class="text-right">
            {priceFormater(item.idr_buy_price * item.ordered_qty)}
          </td>
          <td>
            <CellAction remove/>
          </td>
        </tr>
      {/each}
      <tr>
        <td class="text-info font-bold text-2xl text-right">SUMMARY</td>
        <td class="text-info font-bold text-xl">{sumData.totalQty}</td>
        {#if data.forex_symbol != undefined}
          <td class="text-info font-bold text-xl text-right" colspan="2">
            {priceFormater(sumData.totalForexBuy, 'USD')}
          </td>
        {/if}
        <td class="text-info font-bold text-xl text-right" colspan="2">
          {priceFormater(sumData.totalIdrBuy)}
        </td>
      </tr>
      <tr>
        <td colspan="100%">
          <div class="flex flex-row gap-4 justify-end">
            <div class="w-1/4">
              <BtnSuper icon="uil:plus" text="Product" color="primary" key="KeyN" kbd="N" block on:click={() => globalModal.addPurchaseProduct()} />
            </div>
            <div class="w-2/5">
              <BtnSuper icon="uil:plus" text="Collection with Product" color="secondary" key="KeyC" kbd="C" block />
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>