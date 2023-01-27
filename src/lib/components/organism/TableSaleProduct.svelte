<script>
  import EditableInput from '$lib/components/atom/EditableInput.svelte'
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import { priceFormater } from '$lib/helper/tools'
  import { patch, del } from '$lib/helper/api'
  import { refreshPage} from '$lib/helper/store'
  
  export let listProduct = []
  export let headerSale = 0
  export let editable = true

  async function updateBody(data, type) {
    if (type == 'qty') {
      await patch(`/sale/header/${headerSale}/item/${data.dataId}`, {
        qty: data.newValue
      })
    } else if (type == 'sell') {
      await patch(`/sale/header/${headerSale}/item/${data.dataId}`, {
        sell_price: data.newValue
      })
    } else if (type == 'discount') {
      await patch(`/sale/header/${headerSale}/item/${data.dataId}`, {
        discount_price: data.newValue
      })
    }
    refreshPage.set(true)
  }

  async function deleteItem(id) {
    await del(`/sale/header/${headerSale}/item/${id}`)
    refreshPage.set(true)
  }
</script>

{#if headerSale > 0}
<table class="table w-full">
  <thead>
    <tr>
      <th>Product</th>
      <th>QTY</th>
      <th>Price</th>
      <th>Discount</th>
      <th>Total Price</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#each listProduct as product}
      <tr>
        <td>
          <div class="flex flex-row gap-2">
            <div class="h-24 w-24">
              <img class="object-contain" src={product.product.product_image ?? product.product.collection.cover ?? `https://dummyimage.com/600x600/edb200/ffffff&text=NO+IMG`} alt="gambar product" />
            </div>
            <div>
              <div class="font-bold">{product.product.collection.name}</div>
              <div class="text-info">{product.product.name}</div>
            </div>
          </div>
        </td>
        <td>
          {#if editable}
            <EditableInput value={product.qty} notCurrency dataId={product.id} on:editableSubmit={e => updateBody(e.detail, 'qty')}/>
          {:else}
            {product.qty}
          {/if}
        </td>
        <td>
          {#if editable}
            <EditableInput value={product.sell_price} dataId={product.id} on:editableSubmit={e => updateBody(e.detail, 'sell')} />
          {:else}
            {priceFormater(product.sell_price)}
          {/if}
        </td>
        <td>
          {#if editable}
            <EditableInput value={product.discount_price} dataId={product.id} on:editableSubmit={e => updateBody(e.detail, 'discount')} />
          {:else}
            {priceFormater(product.discount_price)}
          {/if}
        </td>
        <td class="font-bold">{priceFormater((product.sell_price - product.discount_price) * product.qty)}</td>
        {#if editable}
          <td>
            <BtnSuper color="error" size='sm' icon="uil:multiply" on:click={() => deleteItem(product.id)}/>
          </td>
        {/if}
      </tr>
    {/each}
  </tbody>
</table>
{/if}