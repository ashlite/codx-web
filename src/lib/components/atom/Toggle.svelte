<script>
  export let checked = false
  export let label = ''
  export let color = 'base'
  export let size = 'md'
  export let disabled = false

  function checkEnter(e){
    if (e.key == 'Enter') checked = !checked
  }
</script>

<div class="form-control w-full">
  {#if label == '' }
    <input type="checkbox" class="toggle" bind:checked={checked} />
  {:else}
    <label class="label cursor-pointer">
      <span class="label-text">{label}</span> 
      <input 
        type="checkbox" 
        class={`toggle toggle-${color} toggle-${size}`} 
        bind:checked={checked} 
        disabled={disabled}
        on:keypress|preventDefault={e => checkEnter(e)}
      />
    </label>
  {/if}
</div>