<script>
  import { get } from '$lib/helper/api'
  import Tabs from "$lib/components/atom/Tabs.svelte";
  import General from "$lib/components/template/purchaseID/General.svelte"
  import { page } from '$app/stores'
  import { afterNavigate } from '$app/navigation';
  import { refreshPage } from '$lib/helper/store';
	import PurchaseList from '$lib/components/template/purchaseID/PurchaseList.svelte';

  const options = ['General', 'Invoice', 'Pricing', 'Inventory', 'Finance', 'Custom']
  let option = 0
  let purchaseData = {}

  $: $refreshPage && RefreshData()
  
  afterNavigate(() => RefreshData())

  async function RefreshData(){
    purchaseData = await get(`/purchase/header/${$page.params.id}`)
    console.log(purchaseData)
    refreshPage.set(false)
  }
</script>

<div class="mb-4">
  <Tabs options={options} bind:value={option} />
</div>

{#await purchaseData then data}
  <div>
    {#if option == 0}
      <General data={data}/>
    {:else if option == 1}
      <PurchaseList data={data}/>
    {:else}
      <h1>Work in Progress</h1>
    {/if}
  </div>
{/await}