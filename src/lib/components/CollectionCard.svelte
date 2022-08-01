<script>
  export let data
  import BggBtn from "./BggBtn.svelte"
  import {collectionDeleteId, collectionDeleteName, globalModal} from '$lib/store'

</script>

<div class="grid grid-cols-5 gap-4 bg-base-300 shadow-xl h-52 overflow-clip rounded-lg">
  <figure class="col-span-2">
  {#if data.cover}
    <img src={data.cover} alt="Collection Cover" class="object-contain" />
  {:else}
    <img src="https://dummyimage.com/400x600/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain" />
  {/if}
  </figure>
  <div class="col-span-3 pt-2 pr-4">
    <div class="flex flex-row gap-4 mt-2">
      <div class="badge badge-secondary">{data.category}</div>
      {#if data.released}
        <div class="badge badge-primary">{data.released}</div>
      {/if}
    </div>
    <h2 class="text-xl truncate">{data.name}</h2>
    <div class="flex flex-row h-16 w-full mb-4">
      <div class="">
        <div class="stat-title">Age</div>
        {#if data.min_age}
          <div class="stat-value text-lg text-base">{data.min_age}</div>
        {:else}
          <div class="stat-value text-lg text-error">--</div>
        {/if}
      </div>
      <div class="divider divider-horizontal" />
      <div class="">
        <div class="stat-title">Players</div>
        {#if data.min_player || data.max_player}
          <div class="stat-value text-lg text-base">{data.min_player ? data.min_player : 'xx'} - {data.max_player ? data.max_player : 'xx'}</div>
        {:else}
          <div class="stat-value text-lg text-error">--</div>
        {/if}
      </div>
      <div class="divider divider-horizontal" />
      <div class="">
        <div class="stat-title text-l">Total Playtime</div>
        {#if data.min_player || data.max_player}
          <div class="stat-value text-lg text-base">{data.min_playtime ? data.min_playtime : 'xx'} - {data.max_playtime ? data.max_playtime : 'xx'} min</div>
        {:else}
          <div class="stat-value text-lg text-error">--</div>
        {/if}
      </div>
    </div>
    
    <div class="card-actions justify-end">
      <!-- <button class="btn btn-warning" on:click={() => globalModal.collectionEditor(data.id)}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M16.2929 2.29289C16.6834 1.90237 17.3166 1.90237 17.7071 2.29289L21.7071 6.29289C22.0976 6.68342 22.0976 7.31658 21.7071 7.70711L8.70711 20.7071C8.51957 20.8946 8.26522 21 8 21H4C3.44772 21 3 20.5523 3 20V16C3 15.7348 3.10536 15.4804 3.29289 15.2929L13.2927 5.2931L16.2929 2.29289ZM14 7.41421L5 16.4142V19H7.58579L16.5858 10L14 7.41421ZM18 8.58579L19.5858 7L17 4.41421L15.4142 6L18 8.58579Z" fill="#0D0D0D"></path>
          </svg>
      </button> -->
      <button class="btn btn-error" on:click={() => globalModal.deleteCollection(data.id, data.name)}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18.9897C18.9959 5.99994 19.0021 5.99994 19.0083 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H19.9311L19.0638 20.1425C18.989 21.1891 18.1182 22 17.0689 22H6.93112C5.88184 22 5.01096 21.1891 4.9362 20.1425L4.06888 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H4.99174C4.99795 5.99994 5.00414 5.99994 5.01032 6H7V4ZM9 6H15V4H9V6ZM6.07398 8L6.93112 20H17.0689L17.926 8H6.07398ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z" fill="#0D0D0D"></path>
        </svg>
      </button>
      <BggBtn type='link' id={data.bgg_id} />
    </div>
  </div>
</div>


