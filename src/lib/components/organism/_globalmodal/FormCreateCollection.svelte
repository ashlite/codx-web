<script>
  import { get, post } from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { BggSingleItem } from '$lib/helper/bggInteraction'
  import { onMount } from 'svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
  export let data
  
  let listCollectionCategory = get('/category')
  let dataCollection = {category: 'Core Game'}
  let dataProduct = {name:'retail', track_inventory:true}
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

    console.log(sendData)
    
    let response = await post('/collection', sendData)
    if (Object.keys(response).length > 0){
      refreshPage.set(true)
      globalModal.close()
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