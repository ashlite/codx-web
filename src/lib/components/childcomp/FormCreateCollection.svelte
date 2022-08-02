<script>
  import { get, post } from '$lib/api'
  import { globalModal, toastAlert, collectionRefresh } from '$lib/store'
  import { BggSingleItem } from '$lib/bggInteraction'
  import { onMount } from 'svelte'
  export let data
  
  let listCollectionCategory = get('/category')
  let dataCollection = {category: 'Core Game'}
  let dataProduct = {track_inventory:true}
  let parentGame = []
  let childrenGame = []
  let searchQuery = ''
  let resultQuery = []
  let startSearching = false
  let inputProduct = false
  let inputExpansion = false
  let firstInput

  onMount(() => {
    firstInput.focus()
    if (data.bggId != undefined && data.bggId > 0){
      PullDataBgg(data.bggId)
    }
  })

  async function PullDataBgg(bggId){
    let response = await BggSingleItem(bggId)
    dataCollection = {
      bgg_id: bggId,
      ...response.boardgame,
    }
  }
  
  async function SearchBoardgame() {
    if (searchQuery.length > 0) {
      startSearching = true
      let response = await get(`/collection?q=${searchQuery}`)
      if (response.status == 200) {
        resultQuery = response.data
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
    return !childrenGame.some(childItem => childItem.id == item.id)
  })
  .filter(item => {
    return !parentGame.some(parentItem => parentItem.id == item.id)
  })

  async function PostDataCollection(){
    toastAlert.warning('Processing...')
    let sendData = {}
    sendData.collection = {...dataCollection}
    if (inputProduct) {
      sendData.product = {...dataProduct}
    }
    if (dataCollection.category == 'Core Game' && dataCollection.category == 'Core & Expansion' && childrenGame.length > 0){
      sendData.slave = childrenGame.map(({id, ...other}) => id)
    }
    if (dataCollection.category == 'Expansion' && dataCollection.category == 'Core & Expansion' && parentGame.length > 0){
      sendData.master = childrenGame.map(({id, ...other}) => id)
    }

    
    try{      
      let response = await post('/collection', sendData)
      if (response.status == 200){
        toastAlert.success('Success')
        collectionRefresh.set(true)
        globalModal.close()
      } else {
        toastAlert.error('Failed to save data')
      }
    } catch(err){
      toastAlert.error(err.message)
    }
  }
  
</script>

<div class="pb-20">
  <div class="grid grid-cols-12 gap-4">
    <div id="collection-image" class="col-span-4 row-span-4 flex place-content-center max-h-96">
      {#if dataCollection.cover != undefined}
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
      <div class="grid grid-cols-3 gap-4">
        <input bind:this={firstInput} id="nama-collection" type="number" placeholder="Type here" class="input col-span-2 input-bordered w-full" bind:value={dataCollection.bgg_id} />
        <button class="btn btn-info col-start-3" on:click={() => PullDataBgg(dataCollection.bgg_id)}>
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path xmlns="http://www.w3.org/2000/svg" d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="#0D0D0D"></path>
          </svg>
        </button>
      </div>
    </div>
    <div id="category-collection" class="form-control w-full col-span-4">
      <label class="label" for="category-collection">
        <span class="label-text">Category<span class="text-error font-bold">*</span></span>
      </label>
      {#await listCollectionCategory}
        <h1 class="text-xl">Loading...</h1>
      {:then value}
        <select id="category-collection" class="select select-bordered w-full" bind:value={dataCollection.category}>
          {#each value.data as category}
            <option value={category.category}>{category.category}</option>
          {/each}
        </select>
      {/await}
    </div>
    <div id="name-collection" class="form-control w-full col-span-8">
      <label class="label" for="nama-collection">
        <span class="label-text">Collection Name<span class="text-error font-bold">*</span></span>
      </label>
      <input id="nama-collection" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataCollection.name} required/>
    </div>
    <div id="released-collection" class="form-control w-full col-span-2">
      <label class="label" for="released-collection">
        <span class="label-text">Year Published</span>
      </label>
      <input id="released-collection" type="number" class="input input-bordered w-full" bind:value={dataCollection.released}/>
    </div>
    <div id="cover" class="form-control w-full col-span-6">
      <label class="label" for="cover">
        <span class="label-text">Image Link (Must use http/https CDN format)</span>
      </label>
      <input id="cover-input" type="text" class="input input-bordered w-full" bind:value={dataCollection.cover}/>
    </div>
    {#if dataCollection.category == 'Core Game' || dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion'}
      <div id="age-players-playtime" class="grid grid-cols-12 gap-4 mt-4 col-span-8">
        <div id="min-age" class="form-control w-full col-span-2">
          <label class="label" for="min-age">
            <span class="label-text">Minimal Age</span>
          </label>
          <input id="min-age-input" type="number" class="input input-bordered w-full" bind:value={dataCollection.min_age}/>
        </div>
        <div id="players" class="form-control w-full col-span-4 border-l-2 border-secondary pl-2">
          <label class="label" for="players">
            <span class="label-text">Recomended Players</span>
          </label>
          <div class="grid grid-cols-7">
            <input id="min-player" type="number" class="input input-bordered w-full col-span-3" bind:value={dataCollection.min_player}/>
            <div class="font-bold text-4xl text-center">-</div>
            <input id="max-player" type="number" class="input input-bordered w-full col-span-3" bind:value={dataCollection.max_player}/>
          </div>
        </div>
        <div id="playtime" class="form-control w-full col-span-4 border-l-2 border-secondary pl-2">
          <label class="label" for="playtime">
            <span class="label-text">Recomended Playtime (Minutes)</span>
          </label>
          <div class="grid grid-cols-7">
            <input id="min-playtime" type="number" class="input input-bordered w-full col-span-3" bind:value={dataCollection.min_playtime}/>
            <div class="font-bold text-4xl text-center">-</div>
            <input id="max-playtime" type="number" class="input input-bordered w-full col-span-3" bind:value={dataCollection.max_playtime}/>
          </div>
        </div>
        <div id="difficulties" class="form-control w-full col-span-2 border-l-2 border-secondary pl-2">
          <label class="label" for="difficulties">
            <span class="label-text">Difficulties</span>
          </label>
          <input id="difficulties-input" type="number" step="0.01" max="5" min="1" class="input input-bordered w-full" bind:value={dataCollection.game_difficulties}/>
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

  <div class="flex content-center gap-4 border-b-2 border-secondary pt-6 pb-2 mb-4">
    <h1 class="text-2xl font-bold">Add Product for this Collection (optional)</h1>
    <input type="checkbox" class="toggle toggle-accent toggle-lg" bind:checked={inputProduct} />
  </div>

  {#if inputProduct}
    <div id="product" class="grid grid-cols-12 gap-4">
      <div id="name-product" class="form-control w-full col-span-6">
        <label class="label" for="name-product">
          <span class="label-text">Product Name<span class="text-error font-bold">*</span></span>
          <span class="label-text-alt">Just leave it empty if you don't want to add product</span>
        </label>
        <input id="name-product-input" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataProduct.name} required/>
      </div>
      <div id="barcode-product" class="form-control w-full col-span-4">
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
      <div id="notes-product" class="form-control w-full col-span-6">
        <label class="label" for="notes-product">
          <span class="label-text">Notes</span>
        </label>
        <textarea id="notes-product-input" class="textarea textarea-bordered h-36" placeholder="Product Description" bind:value={dataProduct.notes}/>
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
  {/if}

  
  {#if dataCollection.category == 'Core Game' || dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion'}
    
    <div class="flex content-center gap-4 border-b-2 border-secondary pt-6 pb-2 mb-4">
      <h1 class="text-2xl font-bold">Add Expansion Connection(optional)</h1>
      <input type="checkbox" class="toggle toggle-accent toggle-lg" bind:checked={inputExpansion} />
    </div>

    {#if inputExpansion}
      <div class="grid grid-cols-12 max-h-80">
        <div class="col-span-3" >
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
        <div class="col-span-6 border-x-2 border-secondary px-2" >
          <div class="grid grid-cols-4 gap-4">
            <input id="game-search" type="text" placeholder="Search game" class="input input-sm col-span-3 input-bordered w-full" bind:value={searchQuery} />
            {#if startSearching}
              <button class="btn btn-sm btn-info loading" />
            {:else}
              {#if searchQuery.length >= 1}
                <button class="btn btn-sm btn-info" on:click={() => SearchBoardgame()}>
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
            
          </div>
          <table class="table table-compact w-full">
            <thead>
              <tr>
                <th class="text-center w-1/6">Add Exp</th>
                <th class="text-center w-4/6">Name</th> 
                <th class="text-center w-1/6">Add Core</th> 
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
                    <td>
                      <button class="btn btn-success btn-sm w-full" on:click={() => AddExpansion({
                        id: collection.id,
                        name: `(${collection.released}) ${collection.name}`,
                      })}>
                        +
                      </button>
                    </td>
                    <td>{`(${collection.released}) ${collection.name}`}</td>
                    <td>
                      <button class="btn btn-success btn-sm w-full" on:click={() => AddCore({
                        id: collection.id,
                        name: `(${collection.released}) ${collection.name}`,
                      })}>
                        +
                      </button>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
        <div class="col-span-3" >
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
      </div>
    {/if}
  {/if}

  <div class="flex gap-4 flex-row-reverse mt-6">
    <button aria-label="Confirm" class="btn btn-success w-1/5" on:click={() => PostDataCollection()}>
      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path xmlns="http://www.w3.org/2000/svg" d="M3 5C3 3.89543 3.89543 3 5 3H9H15H16.5858C17.1162 3 17.6249 3.21071 18 3.58579L20.7071 6.29289C20.8946 6.48043 21 6.73478 21 7V19C21 20.1046 20.1046 21 19 21H15H9H5C3.89543 21 3 20.1046 3 19V5ZM9 19H15V13H9V19ZM17 19H19V7.41421L17 5.41421V7C17 8.10457 16.1046 9 15 9H9C7.89543 9 7 8.10457 7 7V5H5V19H7V13C7 11.8954 7.89543 11 9 11H15C16.1046 11 17 11.8954 17 13V19ZM9 5V7H15V5H9Z" fill="#0D0D0D"></path>
      </svg>
      Save
    </button>
    <button aria-label="Confirm" class="btn btn-warning w-1/5" on:click={() => globalModal.close()}>
      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path xmlns="http://www.w3.org/2000/svg" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM7.79289 7.79289C8.18342 7.40237 8.81658 7.40237 9.20711 7.79289L12 10.5858L14.7929 7.79289C15.1834 7.40237 15.8166 7.40237 16.2071 7.79289C16.5976 8.18342 16.5976 8.81658 16.2071 9.20711L13.4142 12L16.2071 14.7929C16.5976 15.1834 16.5976 15.8166 16.2071 16.2071C15.8166 16.5976 15.1834 16.5976 14.7929 16.2071L12 13.4142L9.20711 16.2071C8.81658 16.5976 8.18342 16.5976 7.79289 16.2071C7.40237 15.8166 7.40237 15.1834 7.79289 14.7929L10.5858 12L7.79289 9.20711C7.40237 8.81658 7.40237 8.18342 7.79289 7.79289Z" fill="#0D0D0D"></path>
        </svg>
      Cancel
    </button>
  </div>
</div>