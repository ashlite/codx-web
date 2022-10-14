<script>
  import BtnIcon from "$lib/components/atom/BtnIcon.svelte"
  import BtnGroup from "$lib/components/atom/BtnGroup.svelte"
  import { createEventDispatcher } from 'svelte'
  export let info = false
  export let edit = false
  export let remove = false
  export let file = false

  const dispatch = createEventDispatcher()

  function forward(type){
    dispatch(type)
  }
</script>

<BtnGroup>
  {#if info}
    <BtnIcon size="sm" color="info" icon="uil:info-circle" on:click={() => forward('info')}/>
  {/if}
  {#if edit}
    <BtnIcon size="sm" color="warning" icon="uil:edit" on:click={() => forward('edit')}/>
  {/if}
  {#if remove}
    <BtnIcon size="sm" color="error" icon="uil:trash-alt" on:click={() => forward('remove')}/>
  {/if}
  {#if file}
    <BtnIcon size="sm" color="accent" icon="uil:file-alt" on:click={() => forward('file')}/>
  {/if}
</BtnGroup>