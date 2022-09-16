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
  let fileInput

</script>

<div class="overflow-x-auto">
  <table class="table w-full">
    <!-- head -->
    <thead>
      <tr>
        <th rowspan="2" class="text-xl text-center">Product</th>
        <th rowspan="2" class="text-xl text-center">Qty</th>
        {#if data.forex_symbol != undefined}
          <th colspan="2" class="text-center">{data.forex_symbol}</th>
        {/if}
        <th colspan="2" class="text-center">{data.forex_symbol != undefined ? `IDR = ${data.idr_buy_rate}` : `IDR`}</th>
        <th rowspan="2"></th>
      </tr>
      <tr>
        {#if data.forex_symbol != undefined}
          <th class="text-center">Single</th>
          <th class="text-center">Total</th>
        {/if}
        <th class="text-center">Single</th>
        <th class="text-center">Total</th>
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
            <td>
              {priceFormater(item.forex_buy, 'USD')}
            </td>
            <td>
              {priceFormater(item.forex_buy * item.ordered_qty, 'USD')}
            </td>
          {/if}
          <td>
            {priceFormater(item.idr_buy_price)}
          </td>
          <td>
            {priceFormater(item.idr_buy_price * item.ordered_qty)}
          </td>
          <td>
            <CellAction remove/>
          </td>
        </tr>
      {/each}
      <tr>
        <td colspan="100%">
          <BtnSuper icon="uil:plus" text="Add Item" color="primary" block/>
        </td>
      </tr>
      <tr>
        <td colspan="100%">
          <BtnSuper text="Add New Collection with Item" color="secondary" block />
        </td>
      </tr>
    </tbody>
  </table>
</div>