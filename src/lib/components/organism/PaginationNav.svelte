<script>
  import { createEventDispatcher, onMount } from 'svelte'
  import Icon from '@iconify/svelte'
  import BtnIcon from '../atom/BtnIcon.svelte'
  import BtnSuper from '../atom/BtnSuper.svelte'
  export let totalItems
  let currentPage = 1
  let totalPages = 1
  let itemPerPage = 50
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
      <option value={50}>50</option>
      <option value={100}>100</option>
      <option value={150}>150</option>
      <option value={200}>200</option>
    </select>
  </div>
  <div class="col-start-4 col-span-7">
    <div class="btn-group w-full self-end">
      <BtnIcon on:click={() => nextPage()} size="md" iconSize="40" color="info" icon="uil:angle-left" />
      <button class="btn btn-md grow cursor-default no-animation pointer-events-none">Page {currentPage} of {totalPages}</button>
      <BtnIcon on:click={() => previousPage()} size="md" iconSize="40" color="info" icon="uil:angle-right" />
    </div>
  </div>
  <div class="col-start-11 col-span-2">
    <BtnSuper
      size="md" 
      on:click={() => dispatchUpdate()}
      icon="uil:refresh"
      text="Refresh"
      color="info"
      full
    />
  </div>
</div>