<script>
  import {globalModal} from '$lib/store'
  import Editor from '$lib/components/Editor.svelte'
</script>

<input type="checkbox" id="global-modal" class="modal-toggle" checked={$globalModal}/>
<div class="modal" id="global-modal">
  <div class="modal-box w-full max-w-5xl">
    {#if $globalModal.title}
      <h3 class="font-bold text-2xl">{$globalModal.title}</h3>
    {/if}
    <button class="btn btn-sm btn-error absolute right-2 top-2" on:click={() => globalModal.close()}>X</button>
    <Editor />
  </div>
</div>