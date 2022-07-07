<script>
  export let data
  import BggBtn from "./BggBtn.svelte"
  import {collectionDeleteId, collectionDeleteName} from '$lib/store'

  function SetDelete(){
    collectionDeleteName.set(data.name)
    collectionDeleteId.set(data.id)
  }

</script>

<div class="flex flex-row gap-4 bg-base-300 shadow-xl h-52 overflow-clip rounded-lg">
  <figure class="basis-2/5">
  {#if data.cover}
    <img src={data.cover} alt="Collection Cover" class="object-contain" />
  {:else}
    <img src="https://dummyimage.com/400x600/edb200/ffffff&text=NO+IMG" alt="No Img Fallback" class="object-contain" />
  {/if}
  </figure>
  <div class="basis-3/5 pt-2 pr-4">
    <div class="flex flex-row gap-4 mt-2">
      <div class="badge badge-secondary">{data.category}</div>
      {#if data.released}
        <div class="badge badge-primary">{data.released}</div>
      {/if}
    </div>
    <h2 class="text-xl truncate ...">{data.name}</h2>
    <div class="flex flex-row h-16 w-full mb-4">
      <div class="">
        <div class="stat-title text-l">Age</div>
        <div class="stat-value text-base">{data.min_age ? data.min_age : 'xx'}</div>
      </div>
      <div class="divider divider-horizontal" />
      <div class="">
        <div class="stat-title text-l">Players</div>
        <div class="stat-value text-base">{data.min_player ? data.min_player : 'xx'} - {data.max_player ? data.max_player : 'xx'}</div>
      </div>
      <div class="divider divider-horizontal" />
      <div class="">
        <div class="stat-title text-l">Total Playtime</div>
        <div class="stat-value text-base">{data.min_playtime ? data.min_playtime : 'xx'} - {data.max_playtime ? data.max_playtime : 'xx'} min</div>
      </div>
    </div>
    
    <div class="card-actions justify-end">
      <button class="btn btn-error" on:click={SetDelete}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18.9897C18.9959 5.99994 19.0021 5.99994 19.0083 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H19.9311L19.0638 20.1425C18.989 21.1891 18.1182 22 17.0689 22H6.93112C5.88184 22 5.01096 21.1891 4.9362 20.1425L4.06888 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H4.99174C4.99795 5.99994 5.00414 5.99994 5.01032 6H7V4ZM9 6H15V4H9V6ZM6.07398 8L6.93112 20H17.0689L17.926 8H6.07398ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z" fill="#0D0D0D"></path>
        </svg>
      </button>
      <BggBtn type='link' id={data.bgg_id} />
    </div>
  </div>
</div>


