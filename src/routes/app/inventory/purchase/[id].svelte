<script>
  import { get } from '$lib/helper/api'
  import Tabs from "$lib/components/atom/Tabs.svelte";
  import General from "$lib/components/template/_purchaseID/General.svelte"
  import { page } from '$app/stores'
  import { afterNavigate } from '$app/navigation';
  import { refreshPage, forexPricingRate } from '$lib/helper/store';
	import PurchaseList from '$lib/components/template/_purchaseID/PurchaseList.svelte';
  import PurchaseApproval from '$lib/components/molecule/PuchaseApproval.svelte'
  import CustomList from '$lib/components/template/_purchaseID/CustomList.svelte';
  import PricingList from '$lib/components/template/_purchaseID/PricingList.svelte';
  import InventoryList from '$lib/components/template/_purchaseID/InventoryList.svelte';
  import Finance from '$lib/components/template/_purchaseID/Finance.svelte';

  const options = ['General', 'Invoice', 'Pricing', 'Inventory', 'Finance', 'Publishing', 'Custom']
  let option = 0
  let purchaseData = {}

  $: $refreshPage && RefreshData()
  
  afterNavigate(async () => {
    await RefreshData()
    forexPricingRate.set(purchaseData.idr_sell_rate)
  })

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
        subText="BEWARE: if approved, will update automatically all buy price of the listed product. The new price will be average from new price and older price based on quantity. General can't be change, but you can still upload file." 
        data={data.approval_purchase.find(item => item.approval_type == 1)}/>
      <PurchaseList data={data} />
    {:else if option == 2}
      <PurchaseApproval 
        type=2 
        headerId={data.id}
        subText="BEWARE: if approved, will update all selling price in this list to a new price. If New Price is 0, then the price in the system will not change." 
        data={data.approval_purchase.find(item => item.approval_type == 2)}/>
      <PricingList data={data} />
    {:else if option == 3}
      <InventoryList data={data}/>
    {:else if option == 4}
      <PurchaseApproval 
        type=4 
        headerId={data.id}
        subText="BEWARE: if approved, you can't add or remove fees from this purchase." 
        data={data.approval_purchase.find(item => item.approval_type == 4)}/>
      <Finance data={data}/>
    {:else if option == 6}
      {#if data.forex_symbol == undefined || data.forex_symbol == 'IDR'}
        <h1 class="text-error text-3xl font-bold">There is no need for custom invoice</h1>
      {:else}
        <CustomList data={data}/>
      {/if}
    {:else}
      <h1>Work in Progress</h1>
    {/if}
  </div>
{/await}