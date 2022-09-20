<script>
  import { get, post } from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { BggSingleItem } from '$lib/helper/bggInteraction'
  import { onMount } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  import NumberInput from '$lib/components/molecule/NumberInput.svelte'
  import TextInput from '$lib/components/molecule/TextInput.svelte'
  import SearchBar from '$lib/components/molecule/SearchBar.svelte'
	import { priceFormater } from '$lib/helper/tools';
  export let data = {
    headerId:0,
    idrBuyRate:0,
    bggId:0
  }
  
  let listCollectionCategory = get('/category')
  let dataCollection = {category: 'Core Game'}
  let dataProduct = {name:'retail', track_inventory:true}
  let dataProductPurchase = {is_new: true}
  let parentGame = []
  let childrenGame = []
  let searchQuery = ''
  let resultQuery = []
  let startSearching = false
  let inputProduct = data.headerId > 0 ? true : false
  let inputExpansion = false
  // let firstInput

  $: forexToIdr = dataProductPurchase.forex_buy * data.idrBuyRate

  onMount(() => {
    // firstInput.focus()
    if (data.bggId > 0){
      PullDataBgg(data.bggId)
    }
  })

  async function PullDataBgg(bggId){
    let response = await BggSingleItem(bggId)
    dataCollection = {
      bgg_id: bggId,
      ...response.boardgame,
      bgg_group: response.bggGroup
    }
  }
  
  async function SearchBoardgame() {
    if (searchQuery.length > 0) {
      startSearching = true
      let response = await get(`/collection?q=${searchQuery}`)
      if (response.status == 200) {
        resultQuery = response
      } else {
        toastAlert.error('failed to get collection')
      }
      startSearching = false
    }
  }

  function AddExpansion(data){
    childrenGame = [...childrenGame, data]
  }

  function AddCore(data){
    parentGame = [...parentGame, data]
  }

  function DeleteExpansion(id){
    childrenGame.splice(childrenGame.findIndex(item => item.id == id), 1)
    childrenGame = childrenGame
  }

  function DeleteCore(id){
    parentGame.splice(parentGame.findIndex(item => item.id == id), 1)
    parentGame = parentGame
  }

  $: viewQuery = resultQuery
  .filter(item => {
    const checkChildren = childrenGame.some(childItem => childItem.id == item.id)
    const checkParent = parentGame.some(parentItem => parentItem.id == item.id)

    if(dataCollection.category != 'Core & Expansion' && checkChildren){
      return false
    } else if(dataCollection.category != 'Core & Expansion' && checkParent){
      return false
    } else if (checkChildren && checkParent){
      return false
    } else return true
  })

  async function PostDataCollection(){
    toastAlert.warning('Processing...')
    let sendData = {}
    sendData.collection = {...dataCollection}
    sendData.collection.name = dataCollection.name
    sendData.collection.description = dataCollection.description
    if (inputProduct) {
      sendData.product = {...dataProduct}
    }
    if ((dataCollection.category == 'Core Game' || dataCollection.category == 'Core & Expansion') && childrenGame.length > 0){
      sendData.collection.slave = childrenGame.map(({id, ...other}) => id)
    }
    if ((dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion') && parentGame.length > 0){
      sendData.collection.master = parentGame.map(({id, ...other}) => id)
    }
    let response = await post('/collection', sendData)
    console.log(response)
    if (data.headerId > 0){
      dataProductPurchase.product_id = response.product.id
      if (data.idrBuyRate > 0) dataProductPurchase.idr_buy_price = forexToIdr
      await post(`/purchase/items/${data.headerId}`, dataProductPurchase)
    }
    if (Object.keys(response).length > 0){
      refreshPage.set(true)
      globalModal.close()
    }
      
  }
  
</script>

<div class="pb-20">
  <div class="grid grid-cols-12 gap-4">
    <div id="collection-image" class="col-span-4 row-span-4 flex place-content-center max-h-96">
      {#if dataCollection.cover != undefined && dataCollection.cover != ''}
        <img src={dataCollection.cover} alt="Collection Cover" class="object-contain" />
      {:else}
        <img src="https://dummyimage.com/1000x1000/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain"/>
      {/if}
    </div>
    <div id="bggId-collection" class="form-control w-full col-span-4">
      <label class="label" for="bggId-collection">
        <span class="label-text">ID from BGG</span>
        <span class="label-text-alt">(please use this only if the item have BGG page)</span>
      </label>
      <SearchBar on:searchTrigger={() => PullDataBgg(dataCollection.bgg_id)} bind:searchQuery={dataCollection.bgg_id}/>
    </div>
    <div id="category-collection" class="form-control w-full col-span-4">
      <label class="label" for="category-collection">
        <span class="label-text">Category<span class="text-error font-bold">*</span></span>
      </label>
      {#await listCollectionCategory}
        <h1 class="text-xl">Loading...</h1>
      {:then value}
        <select id="category-collection" class="select select-bordered w-full" bind:value={dataCollection.category}>
          {#each value as category}
            <option value={category.category}>{category.category}</option>
          {/each}
        </select>
      {/await}
    </div>
    <div id="name-collection" class="form-control w-full col-span-8">
      <TextInput labelTL="Collection Name" bind:value={dataCollection.name} required/>
    </div>
    <div id="released-collection" class="form-control w-full col-span-2">
      <NumberInput labelTL="Year Published" bind:value={dataCollection.released} />
    </div>
    <div id="cover" class="form-control w-full col-span-6">
      <TextInput labelTL="Image Link (Must use http/https CDN format)" bind:value={dataCollection.cover} />
    </div>
    {#if dataCollection.category == 'Core Game' || dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion'}
      <div id="age-players-playtime" class="grid grid-cols-12 gap-4 mt-4 col-span-8">
        <div id="min-age" class="form-control w-full col-span-2">
          <NumberInput labelTL="Minimal Age" bind:value={dataCollection.min_age} />
        </div>
        <div id="players" class="form-control w-full col-span-4 border-l-2 border-secondary pl-2">
          <label class="label" for="players">
            <span class="label-text">Recomended Players</span>
          </label>
          <div class="grid grid-cols-7">
            <div class="w-full col-span-3">
              <NumberInput bind:value={dataCollection.min_player} />
            </div>
            <div class="font-bold text-4xl text-center">-</div>
            <div class="w-full col-span-3">
              <NumberInput bind:value={dataCollection.max_player} />
            </div>
          </div>
        </div>
        <div id="playtime" class="form-control w-full col-span-4 border-l-2 border-secondary pl-2">
          <label class="label" for="playtime">
            <span class="label-text">Recomended Playtime (Minutes)</span>
          </label>
          <div class="grid grid-cols-7">
            <div class="w-full col-span-3">
              <NumberInput bind:value={dataCollection.min_playtime} />
            </div>
            <div class="font-bold text-4xl text-center">-</div>
            <div class="w-full col-span-3">
              <NumberInput bind:value={dataCollection.max_playtime} />
            </div>
          </div>
        </div>
        <div id="difficulties" class="form-control w-full col-span-2 border-l-2 border-secondary pl-2">
          <NumberInput min=1 max=5 decimal labelTL="Difficulties" bind:value={dataCollection.game_difficulties} />
        </div>
      </div>
    {/if}
  </div>  
  
  <div id="desc-cover" class="mt-4">
    <div id="desc" class="form-control w-full">
      <label class="label" for="desc">
        <span class="label-text">Description</span>
      </label>
      <textarea id="desc-input" class="textarea textarea-bordered h-40" placeholder="Collection Description" bind:value={dataCollection.description}/>
    </div>
  </div>

  {#if dataCollection.bgg_group != undefined}
    <div class="mt-4">
      <h1 class="text-xl font-bold mb-4" >Badge & Grouping</h1>
      <div class="flex w-full flex-wrap gap-4">
        {#each dataCollection.bgg_group as bggGroup}
          {#if bggGroup.group_type == "boardgamecategory"}
            <div class="badge badge-primary">{bggGroup.value}</div>
          {:else if bggGroup.group_type == "boardgamemechanic"}
            <div class="badge badge-secondary">{bggGroup.value}</div>
          {:else}
            <div class="badge badge-accent">{bggGroup.value}</div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <div class="flex content-center gap-4 border-b-2 border-secondary pt-6 pb-2 mb-4">
    <h1 class="text-2xl font-bold">Add Product for this Collection</h1>
    <input 
      type="checkbox" 
      class="toggle toggle-accent toggle-lg" 
      bind:checked={inputProduct} 
      disabled={data.headerId > 0 ? true : false} />
  </div>

  {#if inputProduct}
    <div id="product" class="grid grid-cols-12 gap-4">
      <div id="name-product" class="w-full col-span-6">
        <TextInput labelTL="Product Name" bind:value={dataProduct.name} required/>
      </div>
      <div id="barcode-product" class="w-full col-span-4">
        <TextInput labelTL="Barcode" bind:value={dataProduct.barcode} />
      </div>
      <div class="form-control w-full col-span-2">
        <label class="label cursor-pointer" for="">
          <span class="label-text">Track Inventory?</span>
        </label>
        <input type="checkbox" class="toggle toggle-accent" bind:checked={dataProduct.track_inventory} />
      </div>
      <div id="notes-product" class="form-control w-full col-span-6">
        <label class="label" for="notes-product">
          <span class="label-text">Notes</span>
        </label>
        <textarea id="notes-product-input" class="textarea textarea-bordered h-36" placeholder="Product Description" bind:value={dataProduct.notes}/>
      </div>
      <div class="col-span-6">
        {#if data.headerId > 0 && data.idrBuyRate > 0}
          <NumberInput labelTL="Ordered Qty" bind:value={dataProductPurchase.ordered_qty} />
          <NumberInput labelTL="Forex Price" labelTR={`rate: ${data.idrBuyRate}`} bind:value={dataProductPurchase.forex_buy} />
          <div class="font-bold text-info">
            IDR Price: {priceFormater(forexToIdr)}
          </div>
        {:else if data.headerId > 0}
          <NumberInput labelTL="Ordered Qty" bind:value={dataProductPurchase.ordered_qty} />
          <NumberInput labelTL="Buy Price" bind:value={dataProductPurchase.idr_buy_price} />
        {:else}
          <NumberInput labelTL="Buy Price" bind:value={dataProduct.buy_price} />
          <NumberInput labelTL="Sell Price" bind:value={dataProduct.sell_price} />
        {/if}
      </div>
    </div>
  {/if}

  
  {#if dataCollection.category == 'Core Game' || dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion'}
    
    <div class="flex content-center gap-4 border-b-2 border-secondary pt-6 pb-2 mb-4">
      <h1 class="text-2xl font-bold">Add Expansion Connection</h1>
      <input type="checkbox" class="toggle toggle-accent toggle-lg" bind:checked={inputExpansion} />
    </div>

    {#if inputExpansion}
      <div class="flex max-h-80">
        {#if dataCollection.category == 'Core Game' || dataCollection.category == 'Core & Expansion'}
          <div class="grow">
            <h1 class="text-xl font-bold text-center">Expansion List</h1>
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th class="text-center w-4/5">Name</th> 
                  <th class="text-center w-1/5">Act</th> 
                </tr>
              </thead>
              <tbody>
                {#each childrenGame as expansion}
                  <tr>
                    <td>{expansion.name}</td>
                    <td>
                      <button class="btn btn-sm btn-error w-full" on:click={() => {
                        DeleteExpansion(expansion.id)
                      }}>
                        X
                      </button>
                    </td>
                  </tr>              
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
        
        <div class="w-1/2 border-x-2 border-secondary px-2" >
          <form class="grid grid-cols-4 gap-4" on:submit|preventDefault={() => SearchBoardgame()}>
            <input id="game-search" type="text" placeholder="Search game" class="input input-sm col-span-3 input-bordered w-full" bind:value={searchQuery} />
            {#if startSearching}
              <button class="btn btn-sm btn-info loading" />
            {:else}
              {#if searchQuery.length >= 1}
                <button class="btn btn-sm btn-info" type="submit">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path xmlns="http://www.w3.org/2000/svg" d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="#0D0D0D"></path>
                  </svg>
                </button>
              {:else}
                <button class="btn btn-sm btn-disabled">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path xmlns="http://www.w3.org/2000/svg" d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="#0D0D0D"></path>
                  </svg>
                </button>
              {/if}
            {/if}
          </form>
          <table class="table table-compact w-full">
            <thead>
              <tr>
                {#if dataCollection.category == 'Core Game' || dataCollection.category == 'Core & Expansion'}
                  <th class="text-center w-1/6">Add Exp</th>
                {/if}
                <th class="text-center w-auto">Name</th> 
                {#if dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion'}
                  <th class="text-center w-1/6">Add Core</th> 
                {/if}
              </tr>
            </thead>
            <tbody>
              {#if startSearching}
                <tr>
                  <td colspan="3">Searching...</td>
                </tr>
              {:else} 
                {#each viewQuery as collection}
                  <tr>
                    {#if (dataCollection.category == 'Core Game' || dataCollection.category == 'Core & Expansion') && !childrenGame.some(childItem => childItem.id == collection.id)}
                      <td>
                        <button class="btn btn-success btn-sm w-full" on:click={() => AddExpansion({
                          id: collection.id,
                          name: `(${collection.released}) ${collection.name}`,
                        })}>
                          +
                        </button>
                      </td>
                    {/if}
                    <td>{`(${collection.released}) ${collection.name}`}</td>
                    {#if (dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion') && !parentGame.some(parentItem => parentItem.id == collection.id)}
                      <td>
                        <button class="btn btn-success btn-sm w-full" on:click={() => AddCore({
                          id: collection.id,
                          name: `(${collection.released}) ${collection.name}`,
                        })}>
                          +
                        </button>
                      </td>
                    {/if}
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
        {#if dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion'}
          <div class="grow" >
            <h1 class="text-xl font-bold text-center">Core Game List</h1>
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th class="text-center w-4/5">Name</th> 
                  <th class="text-center w-1/5">Act</th> 
                </tr>
              </thead>
              <tbody>
                {#each parentGame as core}
                  <tr>
                    <td >{core.name}</td>
                    <td >
                      <button class="btn btn-sm btn-error" on:click={() => {
                        DeleteCore(core.id)
                      }}>
                        X
                      </button>
                    </td>
                  </tr>              
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {/if}
  {/if}
  
  <ModalSubmit on:submit={() => PostDataCollection()} />
</div>