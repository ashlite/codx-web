<script>
  import Icon from '@iconify/svelte'
  export let size = 'md'
  export let color = 'neutral'
  export let icon
  export let iconSize = 30
  export let iconWidth
  export let iconHeight
  export let type='button'
  export let text
  export let state
  export let kbd
  export let shortcut
  export let full = false
  export let grow = false
  export let outline = false
  export let square = false
  export let block = false
  export let href
</script>

{#if state == 'loading'}

  <button class={`btn btn-${size} btn-${color} ${full && 'w-full'} ${grow && 'grow'} ${square && 'btn-square'} ${block && 'btn-block'} btn-disabled loading`} />

{:else if shortcut == undefined}
  {#if href}
    <a href={href} class={`btn btn-${size} btn-${color} ${full && 'w-full'} gap-2 ${grow && 'grow'} ${outline && 'btn-outline'} $${square && 'btn-square'} ${block && 'btn-block'}`} type={type}>
      {#if icon}
        <Icon 
        icon={icon} 
        width={iconWidth == undefined ? iconSize : iconWidth} 
        height={iconHeight == undefined ? iconSize : iconHeight} />
      {/if}
      {text ? text : ''}
    </a>
  {:else}
    <button class={`btn btn-${size} btn-${color} ${full && 'w-full'} gap-2 ${grow && 'grow'} ${outline && 'btn-outline'} $${square && 'btn-square'} ${block && 'btn-block'}`} on:click type={type}>
      {#if icon}
        <Icon 
        icon={icon} 
        width={iconWidth == undefined ? iconSize : iconWidth} 
        height={iconHeight == undefined ? iconSize : iconHeight} />
      {/if}
      {text ? text : ''}
    </button>
  {/if}

{:else}
  {#if href}
    <a href={href} target="_blank"
      class={`btn btn-${size} btn-${color} ${full && 'w-full'} gap-2 ${grow && 'grow'} ${outline && 'btn-outline'} ${square && 'btn-square'} ${block && 'btn-block'}`}
      type={type}
      use:shortcut={{alt:true, shift:true, code:'KeyN' }}
    >
    {#if icon}
      <Icon 
      icon={icon} 
      width={iconWidth == undefined ? iconSize : iconWidth} 
      height={iconHeight == undefined ? iconSize : iconHeight} />
    {/if}
      {text ? text : ''}
      <kbd class="kbd kbd-xs text-base-content">{kbd}</kbd>
    </a>
  {:else}
    <button 
      class={`btn btn-${size} btn-${color} ${full && 'w-full'} gap-2 ${grow && 'grow'} ${outline && 'btn-outline'} ${square && 'btn-square'} ${block && 'btn-block'}`}
      on:click 
      type={type}
      use:shortcut={{alt:true, shift:true, code:'KeyN' }}
    >
    {#if icon}
      <Icon 
      icon={icon} 
      width={iconWidth == undefined ? iconSize : iconWidth} 
      height={iconHeight == undefined ? iconSize : iconHeight} />
    {/if}
      {text ? text : ''}
      <kbd class="kbd kbd-xs text-base-content">{kbd}</kbd>
    </button>
  {/if}

{/if}