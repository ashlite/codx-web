<script>
  import { createEventDispatcher, onMount } from 'svelte'
  export let totalItems
  let currentPage = 1, totalPages = 1, itemPerPage = 10
  const dispatch = createEventDispatcher()

  function dispatchUpdate(){
    dispatch('updatePagination', {
      itemPerPage: itemPerPage,
      currentPage: currentPage
    })
  }

  function nextPage(){
    if (currentPage != 1) {
      currentPage--
      dispatchUpdate()
    }
  }

  function previousPage(){
    if (currentPage < totalPages) {
      currentPage++
      dispatchUpdate()
    }
  }

  onMount(() => {
    dispatchUpdate()
  })

  $: totalPages = Math.max(1, Math.ceil(totalItems / itemPerPage)) 
  $: if (currentPage > totalPages) {
      currentPage = totalPages
    }
</script>

<div class="grid grid-cols-12 mb-4 gap-4">
  <div class="col-span-3 flex items-center gap-4">
    <h3 class="text-xl">Items per page:</h3>
    <select class="select select-bordered max-w-xs" bind:value={itemPerPage} on:change={() => dispatchUpdate()} >
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
  </div>
  <div class="col-start-4 col-span-7">
    <div class="btn-group w-full self-end">
      <button class="btn btn-md btn-info" on:click={() => nextPage()}>-</button>
      <button class="btn btn-md grow cursor-default no-animation pointer-events-none">Page {currentPage} of {totalPages}</button>
      <button class="btn btn-md btn-info" on:click={() => previousPage()}>+</button>
    </div>
  </div>
  <div class="col-start-11 col-span-2">
    <button class="btn btn-md btn-success w-full" on:click={() => dispatchUpdate()}>
      <svg class="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path xmlns="http://www.w3.org/2000/svg" d="M12.7929 2.29289C13.1834 1.90237 13.8166 1.90237 14.2071 2.29289L17.2071 5.29289C17.5976 5.68342 17.5976 6.31658 17.2071 6.70711L14.2071 9.70711C13.8166 10.0976 13.1834 10.0976 12.7929 9.70711C12.4024 9.31658 12.4024 8.68342 12.7929 8.29289L14.0858 7H12.5C8.95228 7 6 9.95228 6 13.5C6 17.0477 8.95228 20 12.5 20C16.0477 20 19 17.0477 19 13.5C19 12.9477 19.4477 12.5 20 12.5C20.5523 12.5 21 12.9477 21 13.5C21 18.1523 17.1523 22 12.5 22C7.84772 22 4 18.1523 4 13.5C4 8.84772 7.84772 5 12.5 5H14.0858L12.7929 3.70711C12.4024 3.31658 12.4024 2.68342 12.7929 2.29289Z" fill="#0D0D0D"></path>
        </svg>
      Refresh
    </button>
  </div>
</div>