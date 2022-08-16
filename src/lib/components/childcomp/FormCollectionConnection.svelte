<script>
  import { decodeHTML } from 'entities'
  import { globalModal, collectionRefresh, toastAlert } from '$lib/store'
  import { get, patch } from '$lib/api'
  export let data

  let parentGame = data.collection.master
  let childrenGame = data.collection.slave
  let searchQuery = ''
  let resultQuery = []
  let startSearching = false
  
  let dataCollection = data.collection

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
    if(dataCollection.category != 'Core & Expansion'){
      return !childrenGame.some(childItem => childItem.id == item.id)
    } else return item
  })
  .filter(item => {
    if(dataCollection.category != 'Core & Expansion'){
      return !parentGame.some(parentItem => parentItem.id == item.id)
    } else return item
  })
  .filter(item =>{
    return (!childrenGame.some(childItem => childItem.id == item.id) && !parentGame.some(parentItem => parentItem.id == item.id)) 
  })
  .filter(item => item.id != dataCollection.id)

  async function PatchConnection(){
    toastAlert.warning('Processing...')
    let sendData = {}
    sendData.collection = {
      name: dataCollection.name,
      category: dataCollection.category
    }
    
    if ((dataCollection.category == 'Core Game' || dataCollection.category == 'Core & Expansion') && childrenGame.length > 0){
      sendData.collection.slave = childrenGame.map(({id, ...other}) => id)
    }
    if ((dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion') && parentGame.length > 0){
      sendData.collection.master = parentGame.map(({id, ...other}) => id)
    }

    try{      
      let response = await patch(`/collection/${dataCollection.id}`, sendData)
      if (response.status == 200){
        toastAlert.success('Success')
        collectionRefresh.set(true)
        globalModal.close()
      } else {
        toastAlert.error(`Failed to save data (${response.status})`)
      }
    } catch(err){
      toastAlert.error(err.message)
    }
  }

</script>

<div class="flex gap-4 flex-row-reverse my-4">
  <button aria-label="Confirm" class="btn btn-success w-1/5" on:click={() => PatchConnection()}>
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
              <td>{decodeHTML(expansion.name)}</td>
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
              {#if dataCollection.category == 'Core Game' || dataCollection.category == 'Core & Expansion'}
                <td>
                  <button class="btn btn-success btn-sm w-full" on:click={() => AddExpansion({
                    id: collection.id,
                    name: `(${collection.released}) ${collection.name}`,
                  })}>
                    +
                  </button>
                </td>
              {/if}
              <td>{`(${collection.released}) ${decodeHTML(collection.name)}`}</td>
              {#if dataCollection.category == 'Expansion' || dataCollection.category == 'Core & Expansion'}
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
              <td >{decodeHTML(core.name)}</td>
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