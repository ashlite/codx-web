<script>
  export let title = 'Open secret'
  export let color = 'primary'
</script>

<div class="collapse rounded-md">
  <input type="checkbox" /> 
  <div 
    class={`collapse-title bg-${color} text-${color}-content font-bold`}
  >
    {title}
  </div>
  <div class={`collapse-content bg-${color} text-${color}-content`}> 
    <slot />
  </div>
</div>