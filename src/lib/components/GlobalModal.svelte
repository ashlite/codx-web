<script>
  import {globalModal} from '$lib/store'
  import EditorCreatCollection from './childcomp/EditorCreatCollection.svelte'
  import ModalDelete from './childcomp/ModalDelete.svelte';
</script>

<input type="checkbox" id="global-modal" class="modal-toggle" checked={$globalModal}/>
<div class="modal z-[99]" id="global-modal">
  <div class="modal-box max-w-6xl {$globalModal.size == 'lg' ? 'w-full' : $globalModal.size == 'md' ? 'w-8/12' : 'w-4/12'}">
    <div id="modal-header" class="flex justify-between border-bottom border-b-2 border-accent mb-4">
      {#if $globalModal.title}
        <h3 class="font-bold text-4xl">{$globalModal.title}</h3>
      {/if}
      <button class="btn btn-sm btn-error" on:click={() => globalModal.close()}>X</button>
    </div>
    <div id="modal-body">
      {#if $globalModal.type == 'deleteCollection'}
        <ModalDelete data={$globalModal.data} />
      {:else if $globalModal.type == 'collectionEditor'}
        <EditorCreatCollection data={$globalModal.data} />
      {/if}
    </div>
  </div>
</div>