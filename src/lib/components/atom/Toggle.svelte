<script>
  export let checked = false
  export let label = ''
</script>

<div class="form-control w-full">
  {#if label == '' }
    <input type="checkbox" class="toggle" bind:checked={checked} />
  {:else}
    <label class="label cursor-pointer">
      <span class="label-text">{label}</span> 
      <input type="checkbox" class="toggle" bind:checked={checked} />
    </label>
  {/if}
</div>