<script>
  import {globalModal} from '$lib/store'
  import FormCreateCollection from './childcomp/FormCreateCollection.svelte'
  import FormEditCollection from './childcomp/FormEditCollection.svelte'
  import FormProductEditor from './childcomp/FormProductEditor.svelte'
  import DeleteConfirmation from './childcomp/DeleteConfirmation.svelte'
  import FormCollectionConnection from './childcomp/FormCollectionConnection.svelte'
  import FormCustomer from './childcomp/FormCustomerEditor.svelte'
  import FormSupplierEditor from './childcomp/FormSupplierEditor.svelte'
  import FormVenueEditor from './childcomp/FormVenueEditor.svelte'
  import FormCreatePurchase from './childcomp/FormCreatePurchase.svelte';
  import { shortcut } from '$lib/shortcut'
</script>

<input type="checkbox" id="global-modal" class="modal-toggle" checked={$globalModal}/>
<div class="modal z-[99]" id="global-modal">
  <div class="modal-box max-w-6xl {$globalModal.size == 'lg' ? 'w-full' : $globalModal.size == 'md' ? 'w-8/12' : 'w-4/12'}">
    <div id="modal-header" class="flex justify-between border-bottom border-b-2 border-accent mb-4">
      {#if $globalModal.title}
        <h3 class="font-bold text-4xl">{$globalModal.title}</h3>
      {/if}
      <button class="btn btn-sm btn-error" use:shortcut={{ code:'Escape' }} on:click={() => globalModal.close()}>X</button>
    </div>
    <div id="modal-body">
      {#if $globalModal.type == 'deleteConfirmation'}
        <DeleteConfirmation data={$globalModal.data} />
      {:else if $globalModal.type == 'createCollection'}
        <FormCreateCollection data={$globalModal.data} />
      {:else if $globalModal.type == 'editCollection'}
        <FormEditCollection data={$globalModal.data} />
      {:else if $globalModal.type == 'editProduct'}
        <FormProductEditor data={$globalModal.data} />
      {:else if $globalModal.type == 'connectionEditor'}
        <FormCollectionConnection data={$globalModal.data} />
      {:else if $globalModal.type == 'customerEditor'}
        <FormCustomer data={$globalModal.data} />
      {:else if $globalModal.type == 'supplierEditor'}
        <FormSupplierEditor data={$globalModal.data} />
      {:else if $globalModal.type == 'venueEditor'}
        <FormVenueEditor data={$globalModal.data} />
      {:else if $globalModal.type == 'newPurchase'}
        <FormCreatePurchase />
      {/if}
    </div>
  </div>
</div>