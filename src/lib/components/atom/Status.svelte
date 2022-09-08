<script>
  export let title
  export let value
  export let titleSize = 'xl'
  export let valueSize = '4xl'
</script>

<div class="stat w-32">
  <div class={`stat-title text-${titleSize}`}>{title}</div>
  <div class={`stat-value text-primary text-${valueSize}`}>{value}</div>
</div>