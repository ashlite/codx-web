<script>
import ProductPicker from "$lib/components/organism/ProductPicker.svelte";
import { get } from "$lib/helper/api";
import { priceFormater, dateFormater } from "$lib/helper/tools";

let selectedProduct = undefined

async function handleSelect(product) {
  selectedProduct = await get(`/product/${product.id}`)
  console.log(selectedProduct)
}
</script>

<div class="mx-auto">
  <ProductPicker on:selected={e => handleSelect(e.detail)} />
</div>

{#await selectedProduct then item}
{#if selectedProduct != undefined}
  <div class="text-2xl text-primary font-bold">
    {`${item.product.collection.name} (${item.product.collection.released})`}
  </div>
  <div class="text-2xl text-info mb-4">
    {`${item.product.name}`}
  </div>
  <div class="grid grid-cols-6 mb-4 gap-2">
    <div class="text-secondary font-bold justify-self-end">Barcode: </div>
    <div class="col-span-2">{item.product.barcode}</div>
    <div class="text-secondary font-bold justify-self-end">SKU: </div>
    <div class="col-span-2">{item.product.sku}</div>
    <div class="text-secondary font-bold justify-self-end">Buy Price: </div>
    <div class="col-span-2">{priceFormater(item.product.buy_price)}</div>
    <div class="text-secondary font-bold justify-self-end">Sell price: </div>
    <div class="col-span-2">{priceFormater(item.product.sell_price)}</div>
    <div class="text-secondary font-bold justify-self-end">Commision: </div>
    <div class="col-span-2">0</div>
    <div class="text-secondary font-bold justify-self-end">Created date: </div>
    <div class="col-span-2">{dateFormater(item.product.create_at)}</div>
    <div class="text-secondary font-bold justify-self-end">Total Stock: </div>
    <div class="col-span-2">{item.product.total_stock}</div>
  </div>
  <div class="text-lg text-accent">Stock Location</div>
  <div class="stats shadow">
    {#each item.stock as stock}
      <div class="stat">
        <div class="stat-title">{stock.Venue.name}</div>
        <div class="stat-value text-secondary">{stock.stock}</div>
        <div class="stat-desc">{stock.Venue.city}</div>
      </div>
    {/each}
  </div>
{/if}
{/await}