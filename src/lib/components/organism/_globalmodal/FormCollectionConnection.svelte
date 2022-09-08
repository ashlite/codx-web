<script>
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { get, patch } from '$lib/helper/api'
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte'
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
        refreshPage.set(true)
        globalModal.close()
      } else {
        toastAlert.error(`Failed to save data (${response.status})`)
      }
    } catch(err){
      toastAlert.error(err.message)
    }
  }

</script>

<ModalSubmit on:submit={() => PatchConnection()}/>
<!-- 
<div class="flex gap-4 flex-row-reverse my-4">
  <BtnSuper color="success" on:click={() => PatchConnection()} icon="uil:save" text="Save" iconSize="40" />
  <BtnSuper color="warning" on:click={() => globalModal.close()} icon="uil:cancel" text="Cancel" iconSize="40" />
</div> -->

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