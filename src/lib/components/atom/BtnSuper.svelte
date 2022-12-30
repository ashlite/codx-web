<script>
  import { shortcut } from '$lib/helper/shortcut';
  import Icon from '@iconify/svelte'
  export let size = 'md'
  export let color = 'neutral'
  export let icon = undefined
  export let iconSize = 30
  export let type = 'button'
  export let text = ''
  export let state = ''
  export let kbd = undefined
  export let key = undefined
  export let full = false
  export let grow = false
  export let outline = false
  export let square = false
  export let block = false
  export let href = undefined
  export let textAlign = 'center'

  let globalClass = `btn gap-2 btn-${size} btn-${color} ${full && 'w-full'} ${grow && 'grow'} ${outline && 'btn-outline'} ${square && 'btn-square'} ${block && 'btn-block'} text-${textAlign}`

  const shortcutSetting = { alt:true, shift:true, code:key }

</script>

{#if state == 'loading'}

  <button class={`${globalClass} btn-disabled loading`}>Processing</button>

{:else}
  {#if key == undefined }
    {#if href != undefined}
      <a href={href} class={globalClass} type={type}>
        {#if icon}
          <Icon 
          icon={icon} 
          width={iconSize} 
          height={iconSize} />
        {/if}
        {text}
      </a>
    {:else}
      <button class={globalClass} on:click type={type}>
        {#if icon}
          <Icon 
          icon={icon} 
          width={iconSize} 
          height={iconSize} />
        {/if}
        {text}
      </button>
    {/if}

  {:else}
    {#if href != undefined}
      <a href={href}
        class={globalClass}
        type={type}
        use:shortcut={shortcutSetting}
      >
        {#if icon}
          <Icon 
          icon={icon} 
          width={iconSize} 
          height={iconSize} />
        {/if}
        {text}
        <kbd class="kbd kbd-xs text-base-content">{kbd}</kbd>
      </a>
    {:else}
      <button 
        class={globalClass}
        on:click 
        type={type}
        use:shortcut={shortcutSetting}
      >
        {#if icon}
          <Icon 
          icon={icon} 
          width={iconSize} 
          height={iconSize} />
        {/if}
        {text}
        <kbd class="kbd kbd-xs text-base-content">{kbd}</kbd>
      </button>
    {/if}
  {/if}
{/if}