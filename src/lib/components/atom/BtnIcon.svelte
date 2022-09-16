<script>
  import Icon from '@iconify/svelte'
  export let size = 'md'
  export let color = 'neutral'
  export let icon = 'uil:smile-wink'
  export let iconSize = 24
  export let iconWidth
  export let iconHeight
  export let type='button'
  export let href
</script>

{#if href}
  <a href={href} target="_blank" class={`btn btn-${size} btn-${color}`} on:click type={type}>
    <Icon 
    icon={icon} 
    width={iconWidth == undefined ? iconSize : iconWidth} 
    height={iconHeight == undefined ? iconSize : iconHeight} />
  </a>
{:else}
  <button class={`btn btn-${size} btn-${color}`} on:click type={type}>
    <Icon 
    icon={icon} 
    width={iconWidth == undefined ? iconSize : iconWidth} 
    height={iconHeight == undefined ? iconSize : iconHeight} />
  </button>
{/if}