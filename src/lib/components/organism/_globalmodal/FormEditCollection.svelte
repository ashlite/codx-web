<script>
  import { get, patch } from '$lib/helper/api'
  import { globalModal, toastAlert, refreshPage } from '$lib/helper/store'
  import { BggSingleItem } from '$lib/helper/bggInteraction'
  import ModalSubmit from '$lib/components/molecule/ModalSubmit.svelte';
  import { onMount } from 'svelte'
  export let data
  
  let listCollectionCategory = get('/category')
  let dataCollection = data.collection
  dataCollection.name = dataCollection.name
  dataCollection.description = dataCollection.description
  delete dataCollection.master
  delete dataCollection.slave
  delete dataCollection.product

  let firstInput

  onMount(() => {
    firstInput.focus()
  })

  async function PullDataBgg(bggId){
    let response = await BggSingleItem(bggId)
    dataCollection = {
      ...dataCollection,
      bgg_id: bggId,
      ...response.boardgame,
      bgg_group: response.bggGroup
    }
  }

  async function PatchDataCollection(){
    toastAlert.warning('Processing...')
    let sendData = {}
    sendData.collection = {...dataCollection}
    sendData.collection.name = dataCollection.name
    sendData.collection.description = dataCollection.description
    
    try{      
      let response = await patch(`/collection/${dataCollection.id}`, sendData)
      if (response.status == 200){
        toastAlert.success('Success')
        refreshPage.set(true)
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

  <ModalSubmit on:submit={() => PatchDataCollection()}/>
</div>