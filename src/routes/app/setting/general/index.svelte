<script>
  import Collapsible from "$lib/components/molecule/Collapsible.svelte"
  import Icon from '@iconify/svelte'
  import { get } from '$lib/helper/api'
	import BtnSuper from "$lib/components/atom/BtnSuper.svelte"
  import { globalModal, refreshPage } from '$lib/helper/store'
  import { afterNavigate } from '$app/navigation'

  let listModType = []

  $: $refreshPage && RefreshData()

  afterNavigate(async () => {
    await RefreshData()
  })

  async function RefreshData() {    
    listModType = await get(`/sale/mod`)
    refreshPage.set(false)
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
</div>