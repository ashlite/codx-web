<script>
  import SearchListProduct from '$lib/components/organism/SearchListProduct.svelte';
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  // import TextInput from '$lib/components/molecule/TextInput.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import { priceFormater } from '$lib/helper/tools';
  import { post } from '$lib/helper/api'
	import { globalModal, refreshPage } from '$lib/helper/store';

  export let data //idr buy rate
  console.log(data)
  let product = {}
  let forexPrice
  let orderedQty = 0
  let idrPrice = 0

  $: forexToIdr = forexPrice * data.idrBuyRate
  $: if (product.id > 0){
    idrPrice = product.buy_price
    forexToIdr = product.buy_price
  } 

  async function handleSubmit(){
    const requestBody = {
      product_id: product.id,
      ordered_qty: orderedQty,
      is_new: false
    }
    requestBody.forex_buy = data.idr_buy_rate != undefined ? forexPrice : null
    requestBody.idr_buy_price = idrPrice > 0 && data.idr_buy_rate == undefined ? idrPrice : forexToIdr
    const response = await post(`/purchase/items/${data.headerId}`, requestBody)
    if (response) {
      globalModal.close()
      refreshPage.set(true)
    }
  }
</script>

<SearchListProduct bind:selectedProduct={product} />
<form on:submit|preventDefault={() => handleSubmit()}>
  <div class="grid grid-cols-2 gap-4">
    <NumberInput labelTL="productId" skipFocus disabled required bind:value={product.id}/>
    <NumberInput labelTL="Ordered Qty" bind:value={ orderedQty } required/>
    {#if data != undefined}
      <NumberInput labelTL="Forex Buy Price" decimal bind:value={ forexPrice }/>
      <div class="flex flex-col self-center">
        <div class="font-bold">
          IDR Rate {data.idrBuyRate}
        </div>
        <div class="text-info font-bold text-3xl">{priceFormater(forexToIdr)}</div>
      </div>
    {:else}
      <NumberInput labelTL="Forex Buy Price" skipFocus disabled decimal/>
      <NumberInput labelTL="IDR Buy Price" bind:value={ idrPrice } required disabled={data != undefined}/>
    {/if}
  </div>
  <ModalSubmit form />
</form>