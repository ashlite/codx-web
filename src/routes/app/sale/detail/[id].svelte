<script>
  import { refreshPage, globalModal } from '$lib/helper/store'
  import { get, post } from '$lib/helper/api'
  import { page } from '$app/stores'
  import { afterNavigate } from '$app/navigation'
  import GlobalCard from '$lib/components/molecule/GlobalCard.svelte'
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import { dateFormater, priceFormater } from '$lib/helper/tools'
  import ProductPicker from '$lib/components/organism/ProductPicker.svelte'
  import TableSaleProduct from '$lib/components/organism/TableSaleProduct.svelte'
  import TableSaleSummary from '$lib/components/organism/TableSaleSummary.svelte'

  let saleData = get(`/sale/header/${$page.params.id}`)
  let summary = {}

  $: $refreshPage && RefreshData()

  // afterNavigate(async () => {
  //   await RefreshData()
  // })

  async function RefreshData() {    
    saleData = await get(`/sale/header/${$page.params.id}`)
    refreshPage.set(false)
  }

  async function AddProductSale(item) {
    await post(`/sale/header/${$page.params.id}/item`, {
      discount_price: 0,
      qty: 1,
      sell_price: item.sell_price,
      product_id: item.id
    })
    refreshPage.set(true)
  }
</script>

<div class="flex flex-row gap-4">
  <h1 class="text-3xl text-primary font-bold">Sale ID {$page.params.id}</h1>
  <BtnSuper text="Update Sale Data" color="secondary" on:click={() => globalModal.updateHeaderSale($page.params.id)} kbd='e' key='KeyE' />
</div>
{#await saleData then data}
  <div class="grid grid-cols-2 gap-4">
    <GlobalCard title="Sale Data">
      <div>
        <span class="text-secondary font-bold">Created at: </span> {dateFormater(data.created_at)}
      </div>
      <div>
        <span class="text-secondary font-bold">Created by: </span> {data.created_user.first_name}
      </div>
      <div>
        <span class="text-secondary font-bold">Status: </span> {data.status}
      </div>
      <div>
        <span class="text-secondary font-bold">Venue: </span> {data.venue.name}
      </div>
      <div>
        {#if data.processor != undefined}
          <span class="text-secondary font-bold">Processor: </span> {data.processor.name}
        {:else}
          <span class="text-secondary font-bold">Processor: </span> not selected
        {/if}
      </div>
    </GlobalCard>
    <GlobalCard title="Customer Data">
      {#if data.customer != undefined}
        <div>
          <span class="text-secondary font-bold">Name: </span> {data.customer.name}
        </div>
        <div>
          <span class="text-secondary font-bold">Address: </span> {data.customer.address}
        </div>
        <div>
          <span class="text-secondary font-bold">Mobile: </span> {data.customer.mobile}
        </div>
        <div>
          <span class="text-secondary font-bold">Email: </span> {data.customer.email}
        </div>
      {:else}
        <h1 class="text-accent text-xl">NO CUSTOMER</h1>
      {/if}
    </GlobalCard>
  </div>
  <div class="my-4">
    <span class="font-bold text-xl text-accent">NOTES: </span> {data.notes}
  </div>
  <ProductPicker on:selected={e => AddProductSale(e.detail)} />
  
  <div>   
    {#key saleData}
      <TableSaleProduct headerSale={data.id} listProduct={data.list_product} />
      <TableSaleSummary headerSale={data.id} listProduct={data.list_product} listModifier={data.list_modifier} />
    {/key}
  </div>
  <div class="flex flex-row-reverse gap-4 mt-4 pb-8">
    <BtnSuper text="Proceed to Payment" color="success" icon="uil:bill"/>
    <BtnSuper text="Cancel this Transaction" color="error" icon="uil:file-contract-dollar"/>
  </div>
{/await}