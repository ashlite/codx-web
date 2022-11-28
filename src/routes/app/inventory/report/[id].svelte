<script>
  import { refreshPage, globalModal } from '$lib/helper/store'
  import { afterNavigate } from '$app/navigation'
  import { page } from '$app/stores'
	import MovementApproval from "$lib/components/molecule/MovementApproval.svelte";
  import { get, del, patch } from '$lib/helper/api'
  import BtnAddNew from '$lib/components/atom/BtnAddNew.svelte'
  import CellAction from '$lib/components/molecule/CellAction.svelte'
	import BtnSuper from '$lib/components/atom/BtnSuper.svelte';

  let data = {}

  $: $refreshPage && RefreshData()

  afterNavigate(RefreshData)

  async function RefreshData() {
    data = await get(`/inventory/header/${$page.params.id}`)
    refreshPage.set(false)
  }

  async function removeMovement(productId){
    await del(`/inventory/header/${$page.params.id}/movement/${productId}`)
    refreshPage.set(true)
  }
</script>

<MovementApproval data={data} />
<div class="flex flex-row gap-4">
  <div class="text-2xl font-bold text-secondary">
    {#if data.movement_type == 1}
      INC-{data.id}
    {:else if data.movement_type == 2}
      OUT-{data.id}
    {:else}
      TRF-{data.id}
    {/if}
  </div>
  {#if data.origin_venue}
    <div class="text-2xl font-bold text-primary">
      Origin: <span class="font-normal text-base-content">{data.origin_venue.name}</span>
    </div>
  {/if}
  {#if data.target_venue}
    <div class="text-2xl font-bold text-primary">
      Target: <span class="font-normal text-base-content">{data.target_venue.name}</span>
    </div>
  {/if}
</div>
{#if data.id != undefined}
  <div class="flex flex-row my-4 justify-between items-center">
    <div class="basis-2/4">
      <h1 class="font-bold text-secondary">Movement Notes</h1>
      <p class="textarea w-full whitespace-pre-wrap">{data.movement_notes}</p>
    </div>
    <div class="basis-1/4">
      <h1 class="font-bold text-secondary">Create By</h1>
      <div class="truncate">{`${data.create_user.first_name} ${data.create_user.last_name}`}</div>
      <div class="truncate">{`${data.create_user.email}`}</div>
    </div>
    {#if data.finish_at == undefined && data.canceled_at == undefined}
      <div class="flex flex-col items-center gap-2 basis-1/4">
        <BtnSuper text="Edit Header" color="accent" icon="uil:edit" block on:click={() => globalModal.editHeaderMovement(data)} />
        <BtnAddNew text="Movement" on:click={() => globalModal.addMovement()}/>
      </div>
    {/if}
  </div> 
{/if}

<div class="overflow-x-auto overflow-y-clip">
  <table class="table w-full table-fixed">
    <thead>
      <tr>
        <th class="w-2/12">Image</th>
        <th class="w-6/12">Details</th>
        <th class="w-2/12">QTY</th>
        <th class="w-2/12">Action</th>
      </tr>
    </thead>
    <tbody>
      {#if data.list_movement != undefined}
        {#each data.list_movement as movement}
          <tr>
            <td>
              <figure class="h-24">
                <img src={movement.product.collection.cover} alt="product" class="object-contain"/>
              </figure>
            </td>
            <td>
              <div class="flex flex-col">
                <div class="font-bold">{movement.product.collection.name}</div>
                <div class="text-info">{movement.product.name}</div>
              </div>
            </td>
            <td>
              {movement.qty}
            </td>
            <td>
              <CellAction remove on:remove={() => removeMovement(movement.product.id)} />
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
    <tfoot>
      <tr>
        <th>Image</th>
        <th>Details</th>
        <th>QTY</th>
        <th>Action</th>
      </tr>
    </tfoot>
  </table>
</div>