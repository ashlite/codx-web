<script>
  import SearchListProduct from '$lib/components/organism/SearchListProduct.svelte';
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import TextInput from '$lib/components/molecule/TextInput.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'

  export let data
  let product = {}
  let requestBody = {}

  async function handleSubmit(){

  }
</script>

<SearchListProduct bind:selectedProduct={product} />
<form on:submit|preventDefault={() => handleSubmit}>
  <div class="grid grid-cols-2">
    <TextInput labelTL="productId" disabled bind:value={product.id}/>
    <NumberInput labelTL="Ordered Qty" bind:value={requestBody.ordered_qty}/>
    <NumberInput labelTL="Forex Buy Price" bind:value={requestBody.forex_buy}/>
    <NumberInput labelTL="IDR Buy Price" bind:value={requestBody.idr_buy_price}/>
  </div>
  <ModalSubmit />
</form>