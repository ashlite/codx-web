<script>
  export let data
  import BggBtn from "./BggBtn.svelte"
  import { globalModal} from '$lib/store'
  import { goto } from "$app/navigation"
  import { decodeHTML } from 'entities'

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
    <h2 class="text-xl truncate">{decodeHTML(data.name)}</h2>
    <div class="flex flex-row h-16 w-full mb-4">
      <div class="">
        <div class="stat-title">Age</div>
        {#if data.min_age}
          <div class="stat-value text-lg text-base">{data.min_age}</div>
        {:else}
          <div class="stat-value text-lg text-error">N/A</div>
        {/if}
      </div>
      <div class="divider divider-horizontal" />
      <div class="">
        <div class="stat-title">Players</div>
        {#if data.min_player == undefined}
          <div class="stat-value text-lg text-error">N/A</div>
        {:else if data.min_player == data.max_player}
          <div class="stat-value text-lg text-base">{data.min_player}</div>
        {:else}
          <div class="stat-value text-lg text-base">{data.min_player} - {data.max_player}</div>
        {/if}
      </div>
      <div class="divider divider-horizontal" />
      <div class="">
        <div class="stat-title text-l">Total Playtime</div>
        {#if data.min_playtime == undefined}
          <div class="stat-value text-lg text-error">N/A</div>
        {:else if data.min_playtime == data.max_playtime}
          <div class="stat-value text-lg text-base">{data.min_playtime} min</div>
        {:else}
          <div class="stat-value text-lg text-base">{data.min_playtime} - {data.max_playtime} min</div>
        {/if}
      </div>
    </div>
    
    <div class="card-actions justify-end">
      <button class="btn btn-success" on:click={() => goto(`/app/catalogue/collection/${data.id}`)}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M4 4C4 2.89543 4.89543 2 6 2H14C14.2652 2 14.5196 2.10536 14.7071 2.29289L19.7071 7.29289C19.8946 7.48043 20 7.73478 20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4ZM17.5858 8L14 4.41421V8H17.5858ZM12 4L6 4V20H18V10H13C12.4477 10 12 9.55228 12 9V4ZM8 13C8 12.4477 8.44772 12 9 12H15C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14H9C8.44772 14 8 13.5523 8 13ZM8 17C8 16.4477 8.44772 16 9 16H15C15.5523 16 16 16.4477 16 17C16 17.5523 15.5523 18 15 18H9C8.44772 18 8 17.5523 8 17Z" fill="#0D0D0D"></path>
          </svg>
      </button>
      <BggBtn type='link' id={data.bgg_id} />
      <button class="btn btn-error" on:click={() => globalModal.deleteConfirmation(data.id, data.name, 'collection')}>
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path xmlns="http://www.w3.org/2000/svg" d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H18.9897C18.9959 5.99994 19.0021 5.99994 19.0083 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H19.9311L19.0638 20.1425C18.989 21.1891 18.1182 22 17.0689 22H6.93112C5.88184 22 5.01096 21.1891 4.9362 20.1425L4.06888 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H4.99174C4.99795 5.99994 5.00414 5.99994 5.01032 6H7V4ZM9 6H15V4H9V6ZM6.07398 8L6.93112 20H17.0689L17.926 8H6.07398ZM10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V11C13 10.4477 13.4477 10 14 10Z" fill="#0D0D0D"></path>
        </svg>
      </button>
    </div>
  </div>
</div>


