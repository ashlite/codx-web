<script>
  import { get, post } from '$lib/api'
  import { listCollectionCategory, collectionEditorData, toastAlert } from '$lib/store'
  import CollectionEditorForm from '$lib/components/CollectionEditorForm.svelte'
  collectionEditorData.reset()
  listCollectionCategory.set(get('/category'))

  let dataProduct = {}
  let parentGame = [], childrenGame = []
  let searchQuery = '', resultQuery = [], startSearching = false
  
  async function SearchBoardgame() {
    if (searchQuery.length > 0) {
      startSearching = true
      resultQuery = await get(`/collection?q=${searchQuery}`)
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
    console.log($collectionEditorData)
    try{
      let response = await post('/collection', {
        collection: {
          ...$collectionEditorData
        }
      })
      if (response.collection.id){
        toastAlert.success('Success')
      } else {
        toastAlert.error('Failed to save data')
      }
    } catch(err){
      toastAlert.error(err.message)
    }
  }
  
</script>

<div class="pb-20">
  <div class="grid grid-cols-12 border-b-2 border-secondary pb-6 mb-4">
    <div class="col-span-6" >
      <h1 class="text-4xl font-bold">Add New or Edit Collection</h1>
    </div>
    <div class="col-start-10 col-span-3">
      <button aria-label="Confirm" class="btn btn-success w-full" on:click={() => PostDataCollection()}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M3 5C3 3.89543 3.89543 3 5 3H9H15H16.5858C17.1162 3 17.6249 3.21071 18 3.58579L20.7071 6.29289C20.8946 6.48043 21 6.73478 21 7V19C21 20.1046 20.1046 21 19 21H15H9H5C3.89543 21 3 20.1046 3 19V5ZM9 19H15V13H9V19ZM17 19H19V7.41421L17 5.41421V7C17 8.10457 16.1046 9 15 9H9C7.89543 9 7 8.10457 7 7V5H5V19H7V13C7 11.8954 7.89543 11 9 11H15C16.1046 11 17 11.8954 17 13V19ZM9 5V7H15V5H9Z" fill="#0D0D0D"></path>
        </svg>
        Save
      </button>
    </div>
  </div>

  <CollectionEditorForm />

  <div class="grid grid-cols-12 border-b-2 border-secondary py-6 mb-4">
    <div class="col-span-12" >
      <h1 class="text-4xl font-bold">Add Product for this Collection (optional)</h1>
    </div>
  </div>

  <div id="product" class="grid grid-cols-12 gap-4">
    <div id="name-product" class="form-control w-full col-span-6">
      <label class="label" for="name-product">
        <span class="label-text">Product Name<span class="text-error font-bold">*</span></span>
        <span class="label-text-alt">Just leave it empty if you don't want to add product</span>
      </label>
      <input id="name-product-input" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataProduct.name} required/>
    </div>
    <div id="sku-product" class="form-control w-full col-span-3">
      <label class="label" for="sku-product">
        <span class="label-text">SKU</span>
      </label>
      <input id="sku-product-input" type="text" class="input input-bordered w-full" bind:value={dataProduct.sku}/>
    </div>
    <div id="barcode-product" class="form-control w-full col-span-3">
      <label class="label" for="barcode-product">
        <span class="label-text">SKU</span>
      </label>
      <input id="barcode-product-input" type="text" class="input input-bordered w-full" bind:value={dataProduct.barcode}/>
    </div>
    <div id="notes-product" class="form-control w-full col-span-6">
      <label class="label" for="notes-product">
        <span class="label-text">Notes</span>
      </label>
      <textarea id="notes-product-input" class="textarea textarea-bordered h-40" placeholder="Product Description" bind:value={dataProduct.notes}/>
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
      <div class="form-control w-1/3">
        <label class="label cursor-pointer">
          <span class="label-text">Track Inventory?</span>
          <input type="checkbox" class="toggle toggle-accent" bind:checked={dataProduct.track_inventory} />
        </label>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 border-b-2 border-secondary py-6 mb-4">
    <div class="col-span-12" >
      <h1 class="text-4xl font-bold">Add Expansion / Core Connection</h1>
    </div>
  </div>

  {#if $collectionEditorData.category == 'Core Game' || $collectionEditorData.category == 'Expansion' || $collectionEditorData.category == 'Core & Expansion'}
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
</div>