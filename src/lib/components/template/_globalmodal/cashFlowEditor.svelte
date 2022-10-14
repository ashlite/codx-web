<script>
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import TextArea from '$lib/components/molecule/TextArea.svelte';
  import { dateFormater, priceFormater } from '$lib/helper/tools';
  import { post, get, patch } from '$lib/helper/api'
	import { globalModal, refreshPage } from '$lib/helper/store';
  import { onMount } from 'svelte';
	import DatePicker from '$lib/components/organism/DatePicker.svelte';
  import MonthPicker from '$lib/components/organism/MonthPicker.svelte';

  export let data = { headerPurchaseId:0 }
  let requestBody = {}
  let listForex = []
  let listType = []
  let selectedDate = new Date()

  $: if(requestBody.forex_symbol != 'IDR') requestBody.flow_amount = requestBody.forex_amount * requestBody.forex_rate

  onMount(async () => {
    listForex = await get(`/forex`)
    listType = await get('/cashflow/type')

    if (data.id != undefined) {
      defaultDate = new Date(data.created_at)
      if (data.forex_symbol != undefined) {
        requestBody = {...data}
      } else {
        requestBody.notes = data.notes
        requestBody.flow_amount = data.flow_amount
        requestBody.type_id = data.type_id
      }
    }
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
    if (requestBody.forex_symbol == 'IDR') {
      delete requestBody.forex_symbol
      delete requestBody.forex_amount
      delete requestBody.forex_rate
    }
    if (data.headerPurchaseId > 0) requestBody.header_purchase_id = data.headerPurchaseId
    
    if (data.id == undefined){
      const response = await post(`/cashflow/`, requestBody)
      if (response) {
        globalModal.close()
        refreshPage.set(true)
      }
    } else {
      const response = await patch(`/cashflow/${data.id}`, requestBody)
      if (response) {
        globalModal.close()
        refreshPage.set(true)
      }
    }
  }
</script>

<form on:submit|preventDefault={() => handleSubmit()}>
  <div class="col-span-6" id="dateInput">
    <DatePicker/>
  </div>
  <div class="grid grid-cols-6 gap-4">
    <div id="forex-symbol" class="form-control w-full col-span-2">
      <label class="label" for="forex-symbol">
        <span class="label-text">Forex Symbol</span>
      </label>
      <select id="forex-symbol" class="select select-bordered w-full max-w-xs" bind:value={requestBody.forex_symbol} on:change={() => setForex()}>
        <option selected value="IDR">IDR (default)</option>
        {#each listForex as forex}
          <option value={forex.forex_symbol}>
            {forex.forex_symbol}
          </option>
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
        <span class="label-text-alt">red = negative</span>
      </label>
      <select id="forex-symbol" class="select select-bordered w-full" bind:value={requestBody.type_id} required>
        {#each listType as type}
          {#if type.is_negative}
            <option value={type.id} class="text-error">- {type.flow_type}</option>
          {:else}
            <option value={type.id} class="text-success">+ {type.flow_type}</option>
          {/if}
        {/each}
      </select>
    </div>
    <div class="col-span-6" id="noteInput">
      <TextArea labelTL="Cashflow Notes" required bind:value={requestBody.notes} limit=1000 />
    </div>
  </div>
  <ModalSubmit form />
</form>