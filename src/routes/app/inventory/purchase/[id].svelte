<script>
  import { get } from '$lib/helper/api'
  import Tabs from "$lib/components/atom/Tabs.svelte";
  import General from "$lib/components/template/purchaseID/General.svelte"
  import { page } from '$app/stores'
  import { afterNavigate } from '$app/navigation';
  import { refreshPage } from '$lib/helper/store';
	import PurchaseList from '$lib/components/template/purchaseID/PurchaseList.svelte';
  import PurchaseApproval from '$lib/components/molecule/PuchaseApproval.svelte'
  import CustomList from '$lib/components/template/purchaseID/CustomList.svelte';
  import PricingList from '$lib/components/template/purchaseID/PricingList.svelte';

  const options = ['General', 'Invoice', 'Pricing', 'Inventory', 'Finance', 'Custom']
  let option = 0
  let purchaseData = {}

  $: $refreshPage && RefreshData()
  
  afterNavigate(() => RefreshData())

  async function RefreshData(){
    purchaseData = await get(`/purchase/header/${$page.params.id}`)
    refreshPage.set(false)
  }
</script>

<div class="mb-4">
  <Tabs options={options} bind:value={option} />
</div>

{#await purchaseData then data}
  <div class="gap-y-4">
    {#if option == 0}
      <General data={data}/>
    {:else if option == 1}
      <PurchaseApproval 
        type=1 
        headerId={data.id}
        subText="BEWARE: if approved, will update automatically all buy price of the listed product. The new price will be average from new price and older price based on quantity." 
        data={data.approval_purchase.find(item => item.approval_type == 1)}/>
      <PurchaseList data={data} />
    {:else if option == 2}
      <PurchaseApproval 
        type=2 
        headerId={data.id}
        subText="BEWARE: if approved, will update all selling price in this list to a new price." 
        data={data.approval_purchase.find(item => item.approval_type == 2)}/>
      <PricingList data={data} />
    {:else if option == 5}
      {#if data.forex_symbol == undefined}
        <h1 class="text-error text-3xl font-bold">There is no need for custom invoice</h1>
      {:else}
        <CustomList data={data}/>
      {/if}
    {:else}
      <h1>Work in Progress</h1>
    {/if}
  </div>
{/await}