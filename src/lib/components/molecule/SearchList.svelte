<script>
  import { createEventDispatcher } from "svelte";
  import BtnSuper from '$lib/components/atom/BtnSuper.svelte';
  import { onMount } from "svelte";

  export let sideText = 'Input'
  export let searchState = false
  export let resultList = []
  export let first = false

  const dispatch = createEventDispatcher()
  let searchQuery = ''
  let firstFocus

  onMount(() => firstFocus.focus())
  function handleSearch(){
    dispatch('querySubmit', searchQuery)
  }

  function handleSelected(data){
    resultList = []
    dispatch('selectSubmit', data)
  }
</script>

<div class="form-control">
  <form on:submit|preventDefault={() => handleSearch()}>
    <div class="input-group w-full">
      <span>{sideText}</span>
      <input bind:this={firstFocus} type="text" class="input input-bordered flex-grow" bind:value={searchQuery} disabled={false} />
      {#if searchState}
        <button class="btn btn-square btn-info loading" disabled />
      {:else}
        <BtnSuper color="info" icon="uil:search" type="submit" square/>
      {/if}
    </div>
  </form>
</div>
<ul tabindex="0" class="menu bg-neutral w-4/5 absolute z-30">
  {#if resultList.length > 0}
    {#each resultList as item, index}
      <li>
        <BtnSuper on:click={() => handleSelected(index)} text={`${item}`} />
      </li>
    {/each}
  {/if}
</ul>