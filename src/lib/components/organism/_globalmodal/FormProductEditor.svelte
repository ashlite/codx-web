<script>
  import { get, post, patch } from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { onMount } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte';
  export let data

  let dataProduct
  let dataCollection = {}
  let newProduct = true
  let firstInput
  let searchQuery
  let resultQuery = []
  let startSearching = false

  if (data.product.id == undefined){
    dataProduct = {track_inventory: true, ...data.product}
  } else {
    dataProduct = data.product
    newProduct = false
  }

  if (data.collection != undefined){
    dataCollection = data.collection
  }

  onMount(() => {
    firstInput.focus()
  })
  
  async function searchCollection() {
    if (searchQuery.length > 0) {
      startSearching = true
      let response = await get(`/collection?q=${searchQuery}`)
      resultQuery = response
      startSearching = false
    }
  }

  function setCurrentCollection(collection){
    dataCollection = collection
    searchQuery = ''
    resultQuery = []
  }

  function removeCollection(){
    dataCollection = {}
  }

  async function saveData(){
    let sendData = {product:dataProduct}
    sendData.product.collection_id = dataCollection.id
    
    try{
      if (newProduct){
        let response = await post('/product', sendData)
        if (response.status == 201) {
          toastAlert.success('product created')
          refreshPage.set(true)
          globalModal.close()
        }
      } else {
        let response = await patch(`/product/${dataProduct.id}`, sendData)
        if (response.status == 200) {
          toastAlert.success('product updated')
          refreshPage.set(true)
          globalModal.close()
        } 
      }
    } catch (error) {
      toastAlert.error(error.message)
    }
  }
  
</script>

<div class="mb-4 h-48 ">
  {#if dataCollection.id != undefined}
    <!-- Collection Card -->
    <div class="card card-side bg-base-100 shadow-xl max-h-full">
      <figure class="w-1/5">
        {#if dataCollection.cover != undefined}
          <img src={dataCollection.cover} alt="Collection Cover" class="object-contain" />
        {:else}
          <img src="https://dummyimage.com/1000x1000/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain max-h-96"/>
        {/if}
      </figure>
      <div class="card-body">
        <h2 class="card-title">{`(${dataCollection.released}) - ${dataCollection.name}`}</h2>
        <div><span class="text-info font-bold">Category: </span>{dataCollection.category}</div>
        <div class="card-actions justify-end">
          <button class="btn btn-warning" on:click={() => removeCollection()}>Change Collection</button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Collection Search -->
    <div>
      <div class="form-control">
        <form>
          <div class="input-group w-3/5">
            <span>Search Collection</span>
            <input type="text" class="input input-bordered flex-grow" bind:value={searchQuery} />
            {#if startSearching}
              <button class="btn btn-square btn-info loading" />
            {:else}
              <button class="btn btn-square btn-info" on:click={() => searchCollection()}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path xmlns="http://www.w3.org/2000/svg" d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="#0D0D0D"></path>
                </svg>
              </button>
            {/if}
          </div>
        </form>
      </div>
    </div>
    <ul class="menu bg-neutral w-full absolute">
      {#if resultQuery.length > 0}
        {#each resultQuery as collection}
          <li><button class="text-neutral-content" on:click={() => setCurrentCollection(collection)}>{`(${collection.released}) - ${collection.name}`}</button></li>
        {/each}
      {/if}
    </ul>
  {/if}
</div>

<div class="pb-20">
  <div id="product" class="grid grid-cols-12 gap-4">
    <div class="col-span-4 row-span-3 row-start-1 col-start-1">
      {#if dataProduct.product_image != undefined}
        <img src={dataProduct.product_image} alt="Product" class="object-contain max-h-96" />
      {:else}
        <img src="https://dummyimage.com/1000x1000/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain max-h-96"/>
      {/if}
    </div>
    <div id="name-product" class="form-control w-full col-span-8">
      <label class="label" for="name-product">
        <span class="label-text">Product Name<span class="text-error font-bold">*</span></span>
      </label>
      <input bind:this={firstInput} id="name-product-input" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataProduct.name} required/>
    </div>
    <div id="barcode-product" class="form-control w-full col-span-6">
      <label class="label" for="barcode-product">
        <span class="label-text">Barcode</span>
      </label>
      <input id="barcode-product-input" type="text" class="input input-bordered w-full" bind:value={dataProduct.barcode}/>
    </div>
    <div class="form-control w-full col-span-2">
      <label class="label cursor-pointer" for="">
        <span class="label-text">Track Inventory?</span>
      </label>
      <input type="checkbox" class="toggle toggle-accent" bind:checked={dataProduct.track_inventory} />
    </div>
    <div id="img-link" class="form-control w-full col-span-8">
      <label class="label" for="notes-product">
        <span class="label-text">Link Image (CDN format)</span>
      </label>
      <input type="text" class="input input-bordered w-full" placeholder="Product Description" bind:value={dataProduct.product_image}/>
    </div>
    <div id="notes-product" class="form-control w-full col-span-6">
      <label class="label" for="notes-product">
        <span class="label-text">Notes</span>
      </label>
      <textarea id="notes-product-input" class="textarea textarea-bordered h-36" bind:value={dataProduct.notes}/>
    </div>
    <div class="col-span-6">
      <label class="label" for="buy-price">
        <span class="label-text">Buy Price</span>
      </label>
      <input id="buy-price" type="number" class="input input-bordered w-full" bind:value={dataProduct.buy_price}/>
      <label class="label" for="sell-price">
        <span class="label-text">Sell Price</span>
      </label>
      <input id="sell-price" type="number" class="input input-bordered w-full" bind:value={dataProduct.sell_price}/>
    </div>
  </div>

  <ModalSubmit on:submit={() => saveData()}/>

</div>