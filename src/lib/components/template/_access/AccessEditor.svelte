<script>
  import Collapsible from "$lib/components/molecule/Collapsible.svelte";
	import { onMount } from "svelte";
  import Toggle from "$lib/components/atom/Toggle.svelte";
  import TextInput from "$lib/components/molecule/TextInput.svelte";
  export let access
  
  onMount(() =>{
    access.inventory.purchase.approval = access.inventory.purchase.approval.toString()
  })

</script>

<div class="flex flex-col w-1/2">
  {#each Object.keys(access) as modul}
    <Collapsible title={modul}>
      {#if modul != 'file'}
        <Toggle label="root" color="primary" bind:checked={access[modul].root} />
        {#if modul == 'catalogue'}
          <Toggle label="collection-create" color="primary" bind:checked={access[modul].collection.create}/>
          <Toggle label="collection-update" color="primary" bind:checked={access[modul].collection.update}/>
          <Toggle label="product-create" color="primary" bind:checked={access[modul].product.create}/>
          <Toggle label="product-update" color="primary" bind:checked={access[modul].product.update}/>
        {:else if modul == 'crm'}
          <Toggle label="customer-create" color="primary" bind:checked={access[modul].customer.create}/>
          <Toggle label="customer-update" color="primary" bind:checked={access[modul].customer.update}/>
          <Toggle label="supplier-create" color="primary" bind:checked={access[modul].supplier.create}/>
          <Toggle label="supplier-update" color="primary" bind:checked={access[modul].supplier.update}/>
          <Toggle label="venue-create" color="primary" bind:checked={access[modul].venue.create}/>
          <Toggle label="venue-update" color="primary" bind:checked={access[modul].venue.update}/>
        {:else if modul == 'inventory'}
          <Toggle label="purchase-create" color="primary" bind:checked={access[modul].purchase.create}/>
          <Toggle label="purchase-update" color="primary" bind:checked={access[modul].purchase.update}/>
          <Toggle label="purchase-canceled" color="primary" bind:checked={access[modul].purchase.canceled}/>
          <Toggle label="purchase-invoice-create" color="primary" bind:checked={access[modul].purchase.invoice.create}/>
          <Toggle label="purchase-invoice-update" color="primary" bind:checked={access[modul].purchase.invoice.update}/>
          <Toggle label="purchase-invoice-delete" color="primary" bind:checked={access[modul].purchase.invoice.delete}/>
          <Toggle label="purchase-pricing-update" color="primary" bind:checked={access[modul].purchase.pricing.update}/>
          <Toggle label="purchase-pricing-bot" color="primary" bind:checked={access[modul].purchase.pricing.bot}/>
          <TextInput labelTL="Purchase approval" bind:value={access[modul].purchase.approval} />
          <Toggle label="report-create" color="primary" bind:checked={access[modul].report.create}/>
          <Toggle label="report-canceled" color="primary" bind:checked={access[modul].report.canceled}/>
          <Toggle label="report-finalized" color="primary" bind:checked={access[modul].report.finalized}/>
          <Toggle label="report-movement-create" color="primary" bind:checked={access[modul].report.movement.create}/>
          <Toggle label="report-movement-delete" color="primary" bind:checked={access[modul].report.movement.delete}/>          
        {:else if modul == 'cashflow'}
          <Toggle label="ledger-create" color="primary" bind:checked={access[modul].ledger.create}/>
          <Toggle label="ledger-update" color="primary" bind:checked={access[modul].ledger.update}/>
          <Toggle label="ledger-delete" color="primary" bind:checked={access[modul].ledger.delete}/>
        {:else if modul == 'setting'}
          <Toggle label="forex-create" color="primary" bind:checked={access[modul].forex.create}/>
          <Toggle label="forex-update" color="primary" bind:checked={access[modul].forex.update}/>
        {:else if modul == 'access'}
          <Toggle label="update" color="primary" bind:checked={access[modul].update}/>
        {/if}
      {:else}
        <Toggle label="upload" color="primary" bind:checked={access.file.upload}/>
        <Toggle label="download" color="primary" bind:checked={access.file.download} />
        <Toggle label="delete" color="primary" bind:checked={access.file.delete}/>
      {/if}
    </Collapsible>
  {/each}
</div>