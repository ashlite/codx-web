<script>
  import { shortcut } from '$lib/helper/shortcut'
  import Icon from '@iconify/svelte'
  export let text
  export let state
  export let noShortcut = false

</script>

{#if state == 'loading'}
  <button class="btn btn-primary btn-disabled loading" />
{:else if !noShortcut}
  <button class="btn btn-primary max-w-full gap-2" use:shortcut={{alt:true, shift:true, code:'KeyN' }} on:click>
    <Icon icon="uil:plus" width="30" height="30"/>
    {text} 
    <kbd class="kbd kbd-xs text-base-content">N</kbd>
  </button>
{:else}
  <button class="btn btn-primary max-w-full gap-2" on:click>
    <Icon icon="uil:plus" width="30" height="30"/>
    {text} 
  </button>
{/if}