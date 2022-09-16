<script>
  export let title
  export let value
  export let titleSize = 'xl'
  export let valueSize = '4xl'
  export let valueColor = 'primary'
  export let detail
  export let detailSize = 'md'
</script>

<div class="stat w-32">
  <div class={`stat-title text-${titleSize}`}>{title}</div>
  <div class={`stat-value text-${valueColor} text-${valueSize}`}>{value}</div>
  {#if detail}
    <div class={`stat-desc text-${detailSize}`}>{detail}</div>
  {/if}
</div>