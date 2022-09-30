<script>
  import SupplierCard from "$lib/components/molecule/SupplierCard.svelte"
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import BtnAddNew from "$lib/components/atom/BtnAddNew.svelte";
  import { priceFormater, dateFormater, marginCalc } from "$lib/helper/tools"
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'
  import { post, del, patch } from '$lib/helper/api'
  import Status from "$lib/components/atom/Status.svelte";
  import FileCard from "$lib/components/molecule/FileCard.svelte";
  import CellAction from "$lib/components/molecule/CellAction.svelte";
  import EditableInput from "$lib/components/atom/EditableInput.svelte";
	import TextInput from "$lib/components/molecule/TextInput.svelte";
	import BadgePercentage from "$lib/components/atom/BadgePercentage.svelte";
  import Collapsible from "$lib/components/molecule/Collapsible.svelte";
	import { onMount } from "svelte";
  import PurchaseApproval from "$lib/components/molecule/PuchaseApproval.svelte"
  import Alert from "$lib/components/atom/Alert.svelte";

  export let data
  let purchaseMatch = []
  let movementMatch = []
  console.log(data)
  onMount(calculateInventoryMatch)

  function openHeaderMovement(id){
    window.open(`/app/inventory/report/${id}`, '_blank')
  }

  function calculateInventoryMatch(){
    let listMovement = []
    purchaseMatch = []
    movementMatch = []
    let listItem = data.list_item.concat()

    //deflate to single array listMovement
    data.reference_movement.forEach(header => {
      if (header.list_movement.length > 0) listMovement = listMovement.concat(header.list_movement)
    });

    //match listItem with listMovement, mutate both array
    for (let i = listItem.length-1; i > -1; i--) {
      let item = listItem[i];
      for (let i2 = listMovement.length-1; i2 > -1; i2--) {
        let movement = listMovement[i2]
        // check same product
        if (item.product_id == movement.product_id) {
          if (item.ordered_qty > movement.qty) {
            item.ordered_qty -= movement.qty
            listMovement.splice(i2, 1)
          } else if (item.ordered_qty < movement.qty) {
            movement.qty -= item.ordered_qty
            listItem.splice(i,1)
          } else if (item.ordered_qty == movement.qty) {
            listMovement.splice(i2, 1)
            listItem.splice(i,1)
          }
        }
      }
    }

    //throw both array to stockMatching result
    if (listItem.length > 0) purchaseMatch = listItem
    if (listMovement.length > 0) movementMatch = listMovement
  }
</script>

{#if purchaseMatch.length > 0 || movementMatch.length > 0}
  <Collapsible title="There is mismatching item between invoice and inventory. You can't approve this section if the mismatching is not cleared. Click to learn more." color='accent'>
    {#if purchaseMatch.length > 0}
      <div class="mb-4 ml-6">
        <h1 class="font-bold">Items not received yet (remainder)</h1>
        <ul class="list-disc">
          {#each purchaseMatch as item}
            <li>
              {`(${item.ordered_qty}) # ${item.product.collection.name} - ${item.product.name}`}
            </li>
          {/each}
        </ul>            
      </div>
    {/if}
    {#if movementMatch.length > 0}
      <div class="ml-6">
        <h1 class="font-bold">Items not in Invoice (remainder)</h1>
        <ul class="list-disc">
          {#each movementMatch as item}
            <li>
              {`(${item.qty}) # ${item.product.collection.name} - ${item.product.name}`}
            </li>
          {/each}
        </ul>            
      </div>
    {/if}
  </Collapsible>
{:else}
  <PurchaseApproval 
    type=3 
    headerId={data.id}
    subText="BEWARE: if approved, the inventory can't be changed. Will finalized all inventory report and will not revert back if you revokes." 
    data={data.approval_purchase.find(item => item.approval_type == 3)}/>
    
{/if}

<div class="flex flex-row-reverse my-4 gap-4">
  <BtnAddNew text="Stock" on:click={() => globalModal.createHeaderMovement(data.id)}/>
</div>

<div class="overflow-x-auto overflow-y-clip">
  <table class="table w-full">
    <thead>
      <tr>
        <th>ID</th>
        <th>Date</th>
        <th>Venue</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each data.reference_movement as headerMovement}
        <tr class="hover cursor-pointer" on:click={() => openHeaderMovement(headerMovement.id)}>
          <td>{headerMovement.id}</td>
          <td>
            <div>
              <span class="font-bold text-info">Create At: </span>{dateFormater(headerMovement.create_at)}
            </div>
            {#if headerMovement.finish_at != undefined}
              <div>
                <span class="font-bold text-success">Finish At: </span>{dateFormater(headerMovement.finish_at)}
              </div>
            {:else if headerMovement.canceled_at != undefined}
              <div>
                <span class="font-bold text-error">Cancel At: </span>{dateFormater(headerMovement.canceled_at)}
              </div>
            {/if}
          </td>
          <td>
            <div>
              {headerMovement.target_venue.name}
            </div>
            <div>
              {headerMovement.target_venue.city}
            </div>
          </td>
          <td>
            {#if headerMovement.finish_at != undefined}
              <div class="font-bold text-success">
                Finish
              </div>
            {:else if headerMovement.canceled_at != undefined}
              <div class="font-bold text-error">
                Cancel
              </div>
            {:else}
              <div class="font-bold text-warning">
                On Progress
              </div>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th>Date</th>
        <th>Venue</th>
        <th>Status</th>
      </tr>
    </tfoot>
  </table>
</div>