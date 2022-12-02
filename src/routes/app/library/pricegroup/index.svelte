<script>
  import Collapsible from "$lib/components/molecule/Collapsible.svelte"
  import PaginationNav from "$lib/components/organism/PaginationNav.svelte"
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte"
  import { refreshPage } from '$lib/helper/store'
  import { globalModal } from "$lib/helper/store"
  import { afterNavigate } from '$app/navigation'
  import { get } from "$lib/helper/api"
  import { dateFormater, priceFormater } from '$lib/helper/tools'
  import MonthPicker from "$lib/components/organism/MonthPicker.svelte"
	import PriceGroupCard from "$lib/components/organism/PriceGroupCard.svelte"

  let listPriceGroup = []

  $: $refreshPage && RefreshData()

  afterNavigate(() => RefreshData())

  async function RefreshData() {
    listPriceGroup = await get('/library/group')
    refreshPage.set(false)
  }

</script>

<div class="flex flex-row gap-4 items-center">
  <h1 class="text-3xl font-bold text-primary">List Group Pricing</h1>
  <BtnAddNew text="New Price Group" on:click={() => globalModal.createPriceGroup()} />
</div>
{#each listPriceGroup as PriceGroup}
  <Collapsible title={`${PriceGroup.name} - ${PriceGroup.is_active ? 'ACTIVE' : 'DEACTIVE'}`}>
    <PriceGroupCard priceId={PriceGroup.id} />
  </Collapsible>
{/each}