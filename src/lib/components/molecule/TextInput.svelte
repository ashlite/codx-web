<script>
  export let labelTR
  export let labelTL 
  export let labelBL
  export let placeholder=''
  export let limit = 0
  export let value = ''
  export let uppercase = false
  export let disabled = false

  $: remainingLimit = limit - value.length

</script>

<div class="form-control w-full">
  {#if labelTL || labelTR}
    <label for="" class="label">
      <span class="label-text">{labelTL ? labelTL : ''}</span>
      <span class="label-text-alt">{labelTR ? labelTR : ''}</span>
    </label>
  {/if}

  {#if limit > 0}
    <input type="text" placeholder={placeholder} class={`input input-bordered w-full ${uppercase && 'uppercase'}`} maxlength={limit} bind:value={value} disabled={disabled} />
    <label for="" class="label">
      <span class="label-text"></span>
      <span class="label-text-alt">{`${remainingLimit}/${limit}`}</span>
    </label>
  {:else}
    <input type="text" placeholder={placeholder} class={`input input-bordered w-full ${uppercase && 'uppercase'}`} bind:value={value} disabled={disabled}/>
    {#if labelBL}
      <label for="" class="label">
        <span class="label-text">{labelBL}</span>
      </label>
    {/if}
  {/if}
</div>