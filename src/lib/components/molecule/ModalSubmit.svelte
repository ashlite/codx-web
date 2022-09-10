<script>
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte"
  import { globalModal } from "$lib/helper/store"
  import { createEventDispatcher } from 'svelte'
  
  export let form = false
  export let reverse = false

  const dispatch = createEventDispatcher()

  function forward(){
    dispatch('submit')
  }
</script>

<div class={`flex gap-4 ${reverse ? 'flex-row' : 'flex-row-reverse'} my-4`}>
  <BtnSuper color="success" on:click={() => forward()} icon="uil:save" text="Proceed" iconSize="40" type={form && 'submit'} />
  {#if form}
    <BtnSuper color="warning" icon="uil:file-slash" text="Reset" iconSize="40" type="reset" />
  {/if}
  <BtnSuper type="button" color="error" on:click={() => globalModal.close()} icon="uil:cancel" text="Cancel" iconSize="40" />
</div>