<script>
  import { get, post, patch} from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { onMount } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte';
  import SearchBarSupplier from '$lib/components/molecule/SearchBarSupplier.svelte';
  import DatePicker from '$lib/components/organism/DatePicker.svelte';
  import { dateFormater } from '$lib/helper/tools';
  export let data
  
  let dataPurchase = { }
  let listForex = []
  let firstInput
  let searchQuery
  let resultQuery = []
  let startSearching = false

  onMount(async () => {
    listForex = await get(`/forex`)
  })

  async function handleSubmit(){
    let response = await post('/purchase/header', dataPurchase)
    if (response){
      refreshPage.set(true)
      globalModal.close()
    }
  }

  function setForex(){
    if(dataPurchase.forex_symbol != 'IDR'){
      const selectedForex = listForex.filter(item => item.forex_symbol == dataPurchase.forex_symbol)
      dataPurchase.idr_buy_rate = selectedForex[0].idr_buy_rate
      dataPurchase.idr_sell_rate = selectedForex[0].idr_sell_rate
    } else {
      dataPurchase.idr_buy_rate = 1
      dataPurchase.idr_sell_rate = 1
    }
  }

  
</script>

<div class="pb-20">
  <SearchBarSupplier on:submitSupplier={e => dataPurchase.supplier_id = e.detail.id}/>
  <form on:submit|preventDefault = {() => handleSubmit()} class="mt-4">
    <div class="grid grid-cols-12 gap-4">
      <div id="supplier-id" class="form-control w-full col-span-3">
        <label class="label" for="supplier-id">
          <span class="label-text">Supplier ID<span class="text-error font-bold">*</span></span>
        </label>
        <input id="supplier-id" type="text" placeholder="Autofilled based on supplier" class="input input-bordered w-full" bind:value={dataPurchase.supplier_id} required disabled/>
      </div>
      <div id="supplier-id" class="form-control w-full col-span-3">
        <label class="label" for="supplier-id">
          <span class="label-text">Date</span>
        </label>
        <DatePicker noMonthly noRange on:pickerSubmit={e => dataPurchase.header_date = dateFormater(e.detail[0], 'isoDateTime')}/>
      </div>
      <div id="purchase-note" class="form-control w-full col-span-6">
        <label class="label" for="purchase-note">
          <span class="label-text">Purchase Notes</span>
        </label>
        <input id="purchase-note" type="text" class="input input-bordered w-full" bind:value={dataPurchase.purchase_notes}/>
      </div>
      <div id="forex-symbol" class="form-control w-full col-span-2">
        <label class="label" for="forex-symbol">
          <span class="label-text">Forex Symbol</span>
        </label>
        <select id="forex-symbol" class="select select-bordered w-full max-w-xs" bind:value={dataPurchase.forex_symbol} on:change={() => setForex()}>
          <option selected value="IDR">IDR (default)</option>
          {#each listForex as forex}
            <option value={forex.forex_symbol}>{forex.forex_symbol}</option>
          {/each}
        </select>
      </div>
      <div id="buy-rate" class="form-control w-full col-span-5">
        <label class="label" for="buy-rate">
          <span class="label-text">Forex Rate for Buying Items</span>
        </label>
        <input id="buy-rate" type="number" class="input input-bordered w-full" bind:value={dataPurchase.idr_buy_rate}/>
      </div>
      <div id="sell-rate" class="form-control w-full col-span-5">
        <label class="label" for="sell-rate">
          <span class="label-text">Forex Rate for Selling Items</span>
        </label>
        <input id="sell-rate" type="number" class="input input-bordered w-full" bind:value={dataPurchase.idr_sell_rate}/>
      </div>
    </div>
    
    <ModalSubmit form/>
  </form>
</div>