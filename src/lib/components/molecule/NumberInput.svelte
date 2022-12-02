<script>
  export let labelTR = false
  export let labelTL = false
  export let placeholder=''
  export let value = 0
  export let disabled = false
  export let required = false
  export let decimal = false
  export let min = 0
  export let max = 'infinite'
  export let skipFocus = false
  export let tooltip = false
  export let posTooltip = "top"
  export let labelSum = false
</script>

<div class="form-control w-full">
  {#if labelTL || labelTR}
    {#if tooltip}
      <label for="" class={`label tooltip tooltip-${posTooltip}`} data-tip={tooltip} >
        <span class="label-text">{labelTL ? labelTL : ''}</span>
        <span class="label-text-alt">{labelTR ? labelTR : ''}</span>
      </label>
    {:else}
      <label for="" class="label" >
        <span class="label-text">{labelTL ? labelTL : ''}</span>
        <span class="label-text-alt">{labelTR ? labelTR : ''}</span>
      </label>
    {/if}
  {/if}
  <input 
    type="number" 
    placeholder={placeholder} 
    class={`input input-bordered w-full ${disabled && 'btn-disabled'}`} 
    bind:value={value} 
    required={required} 
    step={decimal ? .01 : 1}
    min={min}
    max={max}
    tabindex={skipFocus ? -1 : 0}
  />
  {#if labelSum}
    <label for="" class="label">
      <span class="label-text">{labelSum}</span>
    </label>
  {/if}
</div>