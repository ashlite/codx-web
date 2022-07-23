<script>
  import { toggleModalCollectionEditor } from '$lib/store'
  import { RingLoader } from 'svelte-loading-spinners'
  import { createEventDispatcher } from 'svelte'
  import { get } from '$lib/api'

  let dataCollection = {
    category: 'Core Game',
  }
  let categories = get('/category')
  const dispatch = createEventDispatcher()

  function Cancel(){
    toggleModalCollectionEditor.set(false)
  }
</script>

<input type="checkbox" class="modal-toggle" bind:checked={$toggleModalCollectionEditor} />
<div class="modal">
  <div class="modal-box w-screen">
    <h1 class="text-4xl font-bold text-center">Add New Collection</h1>
    <div id="input-form">
      <div id="nama-collection" class="form-control w-full">
        <label class="label" for="nama-collection">
          <span class="label-text">Collection Name<span class="text-error font-bold">*</span></span>
        </label>
        <input id="nama-collection" type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={dataCollection.name} required/>
      </div>
      <div id="bggId-collection" class="form-control w-full">
        <label class="label" for="nama-collection">
          <span class="label-text">ID from BGG</span>
          <span class="label-text-alt">(optional only if no bgg data)</span>
        </label>
        <div class="grid grid-cols-4 gap-4">
          <input id="nama-collection" type="number" placeholder="Type here" class="input col-span-3 input-bordered w-full" bind:value={dataCollection.bgg_id} />
          <button class="btn btn-info">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path xmlns="http://www.w3.org/2000/svg" d="M10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="#0D0D0D"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div id="category-collection" class="form-control w-full">
          <label class="label" for="nama-collection">
            <span class="label-text">Category<span class="text-error font-bold">*</span></span>
          </label>
          <select id="category-collection" class="select select-bordered w-full" bind:value={dataCollection.category}>
            {#await categories}
              <option>Loading...</option>
            {:then value}
              {#each value as category}
                <option value={category.category}>{category.category}</option>
              {/each}
            {/await}
          </select>
        </div>
        <div id="released-category" class="form-control w-full">
          <label class="label" for="nama-collection">
            <span class="label-text">Year Published</span>
          </label>
          <input id="released-collection" type="number" class="input input-bordered w-full" bind:value={dataCollection.released}/>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mx-auto my-6">
      <button aria-label="Confirm" class="btn btn-success">
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M20.6644 5.2526C21.0772 5.61952 21.1143 6.25159 20.7474 6.66437L10.0808 18.6644C9.89099 18.8779 9.61898 19 9.33334 19C9.04771 19 8.7757 18.8779 8.58593 18.6644L3.2526 12.6644C2.88568 12.2516 2.92286 11.6195 3.33565 11.2526C3.74843 10.8857 4.3805 10.9229 4.74742 11.3356L9.33334 16.4948L19.2526 5.33565C19.6195 4.92286 20.2516 4.88568 20.6644 5.2526Z" fill="#0D0D0D"></path>
          </svg>
        Confirm
      </button>
      <button aria-label="Cancel" class="btn btn-error" on:click={Cancel}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0D0D0D"></path>
          </svg>
        Cancel
      </button>
    </div>
  </div>
</div>