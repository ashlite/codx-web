<script>
  import EditableInput from '$lib/components/atom/EditableInput.svelte'
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import { priceFormater } from '$lib/helper/tools'
  import { patch, del } from '$lib/helper/api'
  import { refreshPage} from '$lib/helper/store'
	import { onMount } from 'svelte'
  import { globalModal } from '$lib/helper/store'
  
  export let listProduct = []
  export let listModifier = []
  export let headerSale = 0
  export let editable = true
  let summary = { totalQty: 0, totalSell: 0, grandTotal: 0, totalMod: 0 }

  onMount(() => summaryData())

  function summaryData() {
    let totalQty = 0
    let totalSell = 0
    let grandTotal= 0
    let totalMod = 0
    listProduct.forEach(item => {
      totalQty += item.qty
      totalSell += (item.sell_price - item.discount_price) * item.qty
    })
    listModifier.forEach(item => {
      totalMod += item.mod_price
    })
    grandTotal = totalSell + totalMod
    summary = {totalQty, totalSell, grandTotal, totalMod}
  }

  async function deleteMod(id) {
    await del(`/sale/header/${headerSale}/mod/${id}`)
    refreshPage.set(true)
  }

  async function updateMod(newPrice, id) {
    await patch(`/sale/header/${headerSale}/mod/${id}`, {
      mod_price: newPrice
    })
    refreshPage.set(true)
  }
</script>

{#if headerSale > 0}
<table class="table w-full">
  <thead>
    <tr>
      <th>Summary</th>
      <th>Price</th>
      <th>Notes</th>
      {#if editable}
        <th>Action</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Total Product: {summary.totalQty}</td>
      <td>{priceFormater(summary.totalSell)}</td>
      <td></td>
      {#if editable}
        <td></td>
      {/if}
    </tr>
    {#each listModifier as mod}
      <tr>
        <td>{mod.type_data.sale_type}</td>
        {#if editable}
          <td>
            <EditableInput value={mod.mod_price} dataId={mod.id} on:editableSubmit={e => updateMod(e.detail.newValue, e.detail.dataId)}/>
          </td>
          <td>{mod.notes}</td>
          <td>
            <BtnSuper color="error" icon="uil:trash" on:click={() => deleteMod(mod.id)}/>
          </td>
        {:else}
          <td>
            {mod.mod_price}
          </td>
          <td>{mod.notes}</td>
        {/if}
      </tr>
    {/each}
    <tr class="">
      <td>Total Modifier</td>
      <td>{priceFormater(summary.totalMod)}</td>
      <td></td>
      <td></td>
    </tr>
    {#if editable}
      <tr>
        <td colspan="3">
          <div class="w-4/5 mx-auto">
            <BtnSuper full size="sm" color="primary" text="Add Price Modifier" key="KeyP" kbd="p" on:click={() => globalModal.addSaleModifier(headerSale, summary.grandTotal, summary.totalSell)}/>
          </div>
        </td>
      </tr>
    {/if}
    <tr class="text-info font-bold">
      <td>GRAND TOTAL</td>
      <td>{priceFormater(summary.grandTotal)}</td>
      <td></td>
    </tr>
  </tbody>
</table>
{/if}