<script>
  import Collapsible from "$lib/components/molecule/Collapsible.svelte"
  import Icon from '@iconify/svelte'
  import { get, post, del, patch } from '$lib/helper/api'
	import BtnSuper from "$lib/components/atom/BtnSuper.svelte"
  import { globalModal, refreshPage } from '$lib/helper/store'
  import { afterNavigate } from '$app/navigation'
  import { dateFormater } from "$lib/helper/tools"
  import DatePicker from "$lib/components/organism/DatePicker.svelte"
  import NumberInput from "$lib/components/molecule/NumberInput.svelte"

  let listModType = []
  let libSetting = {}
  let newOverrideTier
  let newOverrideDate = new Date()
  let weeklyDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  $: $refreshPage && RefreshData()

  afterNavigate(async () => {
    await RefreshData()
  })

  async function RefreshData() {    
    listModType = await get(`/sale/mod`)
    libSetting = await get(`/library/setting`)
    refreshPage.set(false)
  } 

  async function updateOverride() {
    await post(`/library/override/${newOverrideTier}?date=${dateFormater(newOverrideDate, "isoDateTime")}`)
    refreshPage.set(true)
  }

  async function updateWeekly() {
    console.log(newWeekly)
    await patch(`/library/setting`, {
      day_price: newWeekly
    })
    refreshPage.set(true)
  }
</script>

<div>
  <Collapsible title="Sale Setting">
    <div class="flex flex-row gap-4">
      <h1 class="text-xl font-bold">List Modifier Type</h1>
      <BtnSuper color="primary" text="Add new Mod Type" size="sm" on:click={() => globalModal.addSaleModifierType()}/>
    </div>
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Sale Type</th>
            <th>Default Mod</th>
            <th>Percentage?</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#await listModType}
            LOADING...
          {:then modData}
            {#each modData as modType}
              <tr>
                <td>{modType.sale_type}</td>
                <td>{modType.default_mod}</td>
                {#if modType.is_percentage}
                  <td class="text-success"><Icon icon="uil:check" width="30" height="30"/></td>
                {:else}
                  <td class="text-error"><Icon icon="uil:multiply" width="30" height="30"/></td>
                {/if}
                <td>{modType.notes}</td>
                <td>
                  <BtnSuper color="warning" icon="uil:edit" on:click={() => globalModal.updateSaleModifierType(modType)}/>
                </td>
              </tr>
            {/each}
          {/await}
        </tbody>
      </table>
    </div>
  </Collapsible>
  <Collapsible title="Library Setting">
    {#await libSetting}
      Loading...
    {:then setting}
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body bg-base-200">
              <h2 class="card-title">Applicable Override</h2>
              <div>Override Price Tier: <span class="text-secondary">{setting.override_price == undefined ? '0' : setting.override_price}</span></div>
              <div>Override Date: <span class="text-secondary">{dateFormater(setting.override_date == undefined ? new Date() : setting.override_date)}</span></div>
            </div>
          </div>
          <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body bg-base-200 overflow-auto">
              <h2 class="card-title">Update Override</h2>
              <DatePicker on:dateSubmit={e => newOverrideDate = e.detail} />
              <select class="select select-bordered w-full max-w-xs" bind:value={newOverrideTier}>
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
              </select>
              <div class="card-actions justify-start">
                <BtnSuper color="warning" text="Set Override" on:click={() => updateOverride()} />
              </div>
            </div>
          </div>
        </div>
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body bg-base-200 overflow-auto">
            <h2 class="card-title">Weekly Pricing Tier</h2>
            <div class=" grid grid-cols-7 gap-2">
              {#if setting.day_price != undefined }
                {#each weeklyDay as name, i}
                  <div class="flex flex-col justify-center px-6 gap-2">
                    <h1 class="text-center font-bold">{name}</h1>
                    <h2 class="text-center">Tier <span class="font-bold text-secondary">{setting.day_price[i]}</span></h2>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/await}
  </Collapsible>
</div>