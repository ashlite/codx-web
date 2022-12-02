<script>
  import FormCreateCollection from '$lib/components/template/_globalmodal/FormCreateCollection.svelte'
  import FormEditCollection from '$lib/components/template/_globalmodal/FormEditCollection.svelte'
  import FormProductEditor from '$lib/components/template/_globalmodal/FormProductEditor.svelte'
  import DeleteConfirmation from '$lib/components/template/_globalmodal/DeleteConfirmation.svelte'
  import FormCollectionConnection from '$lib/components/template/_globalmodal/FormCollectionConnection.svelte'
  import FormCustomer from '$lib/components/template/_globalmodal/FormCustomerEditor.svelte'
  import FormSupplierEditor from '$lib/components/template/_globalmodal/FormSupplierEditor.svelte'
  import FormVenueEditor from '$lib/components/template/_globalmodal/FormVenueEditor.svelte'
  import FormCreatePurchase from '$lib/components/template/_globalmodal/FormCreatePurchase.svelte'
  import CancelConfirmation from '$lib/components/template/_globalmodal/CancelConfirmation.svelte'
  import FormForex from '$lib/components/template/_globalmodal/FormForex.svelte'
  import FormAddPurchaseProduct from '$lib/components/template/_globalmodal/FormAddPurchaseProduct.svelte'
  import CreateHeaderMovement from '$lib/components/template/_globalmodal/CreateHeaderMovement.svelte'
  import AddMovement from '$lib/components/template/_globalmodal/AddMovement.svelte'
  import CashFlowEditor from '$lib/components/template/_globalmodal/cashFlowEditor.svelte'
  import FormCreateHeaderSale from '$lib/components//template/_globalmodal/FormCreateHeaderSale.svelte'
  import FormSaleModifier from '$lib/components/template/_globalmodal/FormSaleModifier.svelte'
  import FormSaleModType from '$lib/components/template/_globalmodal/FormSaleModType.svelte'
  import CancelSaleHeader from '$lib/components/template/_globalmodal/CancelSaleHeader.svelte'
  import ConfirmPayment from '$lib/components/template/_globalmodal/ConfirmPayment.svelte'
  import PriceGroupEditor from '$lib/components/template/_globalmodal/PriceGroupEditor.svelte'
  import { globalModal } from '$lib/helper/store'
  import { shortcut } from '$lib/helper/shortcut'
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
        <FormCreatePurchase data={$globalModal.data} />
      {:else if $globalModal.type == 'cancelConfirmation'}
        <CancelConfirmation data={$globalModal.data}/>
      {:else if $globalModal.type == 'forexEditor'}
        <FormForex data={$globalModal.data} />
      {:else if $globalModal.type == 'addPurchaseProduct'}
        <FormAddPurchaseProduct data={$globalModal.data}/>
      {:else if $globalModal.type == 'addHeaderMovement'}
        <CreateHeaderMovement data={$globalModal.data} />
      {:else if $globalModal.type == 'addMovement'}
        <AddMovement data={$globalModal.data} />
      {:else if $globalModal.type == 'addCashflow'}
        <CashFlowEditor data={$globalModal.data} />
      {:else if $globalModal.type == 'formHeaderSale'}
        <FormCreateHeaderSale id={$globalModal.data}/>
      {:else if $globalModal.type == 'formSaleModifier'}
        <FormSaleModifier data={$globalModal.data} />
      {:else if $globalModal.type == 'formSaleModType'}
        <FormSaleModType data={$globalModal.data}/>
      {:else if $globalModal.type == 'cancelHeaderConfirmation'}
        <CancelSaleHeader data={$globalModal.data}/>
      {:else if $globalModal.type == 'confirmPayment'}
        <ConfirmPayment data={$globalModal.data} />
      {:else if $globalModal.type == 'priceGroupEditor'}
        <PriceGroupEditor data={$globalModal.data}/>
      {/if}
    </div>
  </div>
</div>