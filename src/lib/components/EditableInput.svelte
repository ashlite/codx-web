<script>
  import { createEventDispatcher } from 'svelte'
  import { priceFormater } from '$lib/tools'
  export let value 
  export let dataId
  
  let editing = false
  const dispatch = createEventDispatcher()

  function submitValue(){
    editing = false
    dispatch('editableSubmit', {
      newValue: value,
      dataId: dataId
    })
  }
</script>

<div>
  {#if editing}
    <form on:submit|preventDefault={() => submitValue()}>
      <input type="text" class="input input-bordered input-sm max-w-xs" placeholder="Search Game" bind:value={value} />
    </form>
  {:else}
    <div on:click={() => editing = true} class="cursor-pointer underline decoration-dotted decoration-1 underline-offset-2 font-bold">
      {priceFormater(value)}
    </div>
  {/if}
</div>