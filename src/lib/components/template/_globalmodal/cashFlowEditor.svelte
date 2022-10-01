<script>
  import SearchListProduct from '$lib/components/organism/SearchListProduct.svelte';
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import TextArea from '$lib/components/molecule/TextArea.svelte';
  import { dateFormater, priceFormater } from '$lib/helper/tools';
  import { post, get } from '$lib/helper/api'
	import { globalModal, refreshPage, toastAlert } from '$lib/helper/store';
  import Toggle from '$lib/components/atom/Toggle.svelte';
	import { onMount } from 'svelte';
	import { list } from 'postcss';
  import { page } from '$app/stores';
	import DatePicker from '$lib/components/organism/DatePicker.svelte';

  export let data = {headerPurchaseId:0}
  let requestBody = {}
  let listForex = []
  let listType = []
  let qty = 0

  $: if(requestBody.forex_symbol != 'IDR') requestBody.flow_amount = requestBody.forex_amount * requestBody.forex_rate

  onMount(async () => {
    listForex = await get(`/forex`)
    listType = await get('/cashflow/type')
  })

  function setForex(){
    if(requestBody.forex_symbol != 'IDR'){
      const selectedForex = listForex.filter(item => item.forex_symbol == requestBody.forex_symbol)
      requestBody.forex_rate = selectedForex[0].idr_buy_rate
    } else {
      requestBody.forex_rate = 1
    }
  }

  async function handleSubmit(){
    if (qty > 0 && product.id > 0) {
      const requestBody = {
        product_id: product.id,
        qty: qty
      }
      const response = await post(`/inventory/header/${$page.params.id}/movement`, requestBody)
      if (response) {
        globalModal.close()
        refreshPage.set(true)
      }
    } else toastAlert.error('qty must be greater than 0')
  }
</script>

<form on:submit|preventDefault={() => handleSubmit()}>
  <div class="col-span-6" id="dateInput">
    <DatePicker noMonthly noRange on:pickerSubmit={e => requestBody.create_at = dateFormater(e.detail[0], 'isoDateTime')}/>
  </div>
  <div class="grid grid-cols-6 gap-4">
    <div id="forex-symbol" class="form-control w-full col-span-2">
      <label class="label" for="forex-symbol">
        <span class="label-text">Forex Symbol</span>
      </label>
      <select id="forex-symbol" class="select select-bordered w-full max-w-xs" bind:value={requestBody.forex_symbol} on:change={() => setForex()}>
        <option selected value="IDR">IDR (default)</option>
        {#each listForex as forex}
          <option value={forex.forex_symbol}>{forex.forex_symbol}</option>
        {/each}
      </select>
    </div>
    <div class="col-span-2" id="forexRate">
      <NumberInput labelTL="Forex Rate" labelTR={priceFormater(requestBody.forex_rate)} bind:value={requestBody.forex_rate}/>
    </div>
    <div class="col-span-2" id="forexAmount">
      <NumberInput labelTL="Forex Amount" labelTR={priceFormater(requestBody.forex_amount, requestBody.forex_symbol)} bind:value={requestBody.forex_amount} decimal/>
    </div>
    <div class="col-span-3" id="flowAmount">
      <NumberInput labelTL="Flow Amount in IDR" labelTR={priceFormater(requestBody.flow_amount)} bind:value={requestBody.flow_amount} required/>
    </div>
    <div class="col-span-3">
      <label class="label" for="forex-symbol">
        <span class="label-text">Flow Type</span>
      </label>
      <select id="forex-symbol" class="select select-bordered w-full" bind:value={requestBody.type_id} required>
        {#each listType as type}
          <option value={type.id}>{type.flow_type}</option>
        {/each}
      </select>
    </div>
    <div class="col-span-6" id="noteInput">
      <TextArea labelTL="Cashflow Notes" required bind:value={requestBody.notes} limit=1000 />
    </div>
  </div>
  <ModalSubmit form />
</form>