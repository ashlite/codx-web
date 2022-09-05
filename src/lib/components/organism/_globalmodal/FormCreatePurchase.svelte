<script>
  import { get, post, patch} from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { onMount } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte';
  export let data
  
  let dataPurchase = { }
  let firstInput
  let searchQuery
  let resultQuery = []
  let startSearching = false

  onMount(() => firstInput.focus())

  async function handleSubmit(){
    let response
    // try {
    //   if (dataVenue.id == undefined) {
    //     response = await post(`/venue`, {venue: dataVenue})
    //   } else {
    //     response = await patch(`/venue/${dataVenue.id}`, {venue: dataVenue})
    //   }
      
    //   if (response.status == 200 || response.status == 201) {
    //     toastAlert.success('Success Submiting Venue')
    //     refreshPage.set(true)
    //     globalModal.close()
    //   } else {
    //     toastAlert.error('Failed to Save Venue')
    //   }

    // } catch(error){
    //   console.log(error)
    //   toastAlert.error(error.message)
    // }
  }

  
</script>

<div class="pb-20">
  <div class="form-control mb-4">
    <form on:submit|preventDefault={() => handleSearch()}>
      <div class="input-group w-full">
        <span>Search Collection</span>
        <input type="text" class="input input-bordered flex-grow" bind:value={searchQuery} bind:this={firstInput} disabled={false} />
        {#if startSearching}
          <button class="btn btn-square btn-info loading" />
        {:else}
          <button class="btn btn-square btn-info" on:click={() => searchSupplier()}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path xmlns="http://www.w3.org/2000/svg" d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="#0D0D0D"></path>
            </svg>
          </button>
        {/if}
      </div>
    </form>
    <ul class="menu bg-neutral w-full absolute">
      {#if resultQuery.length > 0}
        {#each resultQuery as supplier}
          <li><button class="text-neutral-content" on:click={() => setCurrentSupplier(supplier)}>{`(${supplier.country}) - ${supplier.supplier_name}`}</button></li>
        {/each}
      {/if}
    </ul>
  </div>
  <form on:submit|preventDefault = {() => handleSubmit()}>
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
        <input id="supplier-id" type="datetime-local" class="input input-bordered w-full" bind:value={dataPurchase.header_date} required/>
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
        <input id="forex-symbol" type="text" placeholder="empty = IDR" class="input input-bordered w-full" bind:value={dataPurchase.forex_symbol}/>
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