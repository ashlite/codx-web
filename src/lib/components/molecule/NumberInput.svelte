<script>
  export let labelTR
  export let labelTL 
  export let placeholder=''
  export let limit = 0
  export let value = ''

  $: remainingLimit = limit - value.length

  function calcLimit(){

  }
</script>

<div class="form-control w-full">
  {#if labelTL || labelTR}
    <label for="" class="label">
      <span class="label-text">{labelTL ? labelTL : ''}</span>
      <span class="label-text-alt">{labelTR ? labelTR : ''}</span>
    </label>
  {/if}
  <input type="number" placeholder={placeholder} class={`input input-bordered w-full`} maxlength={limit} on:input={() => calcLimit()} bind:value={value} />
</div>