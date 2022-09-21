<script>
  import { createEventDispatcher } from 'svelte'
  import { priceFormater } from '$lib/helper/tools'
  export let value 
  export let dataId
  export let currency = 'IDR'
  export let frontLabel = ''
  
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
      <input autofocus type="text" class="input input-bordered input-sm max-w-xs" bind:value={value} on:blur={() => editing = false}/>
    </form>
  {:else}
    <div on:click={() => editing = true} class="cursor-pointer underline decoration-dotted decoration-1 underline-offset-2 font-bold">
      {`${frontLabel} ${priceFormater(value, currency)}`}
    </div>
  {/if}
</div>