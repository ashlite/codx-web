<script>
  import AddCollectionModal from "./AddCollectionModal.svelte"
  export let type
  export let id

</script>

<div class="flex flex-row gap-4">
  {#if type == 'link' || type == 'both'}
  <a class="btn btn-info" href={`https://boardgamegeek.com/boardgame/${id}`} target="_blank">
    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path xmlns="http://www.w3.org/2000/svg" d="M14 5C13.4477 5 13 4.55228 13 4C13 3.44772 13.4477 3 14 3H20C20.2652 3 20.5196 3.10536 20.7071 3.29289C20.8946 3.48043 21 3.73478 21 4L21 10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10L19 6.41422L9.70711 15.7071C9.31658 16.0976 8.68342 16.0976 8.29289 15.7071C7.90237 15.3166 7.90237 14.6834 8.29289 14.2929L17.5858 5H14ZM3 7C3 5.89543 3.89543 5 5 5H10C10.5523 5 11 5.44772 11 6C11 6.55228 10.5523 7 10 7H5V19H17V14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V19C19 20.1046 18.1046 21 17 21H5C3.89543 21 3 20.1046 3 19V7Z" fill="#0D0D0D"></path>
    </svg>
  </a>
  {/if}
  
  {#if type == 'add' || type == 'both'}
    <label class="modal-button btn btn-primary gap-2" for={`modal${id}`}>
      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path xmlns="http://www.w3.org/2000/svg" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z" fill="#0D0D0D"></path>
      </svg>
      Collection
    </label>
    <AddCollectionModal idModal={`modal${id}`} idBGG={id}/>
  {/if}
</div>

