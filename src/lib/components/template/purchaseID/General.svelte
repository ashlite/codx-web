<script>
  import SupplierCard from "$lib/components/molecule/SupplierCard.svelte"
  import BtnSuper from "$lib/components/atom/BtnSuper.svelte";
  import { priceFormater, dateFormater } from "$lib/helper/tools"
  import { globalModal, refreshPage, toastAlert } from '$lib/helper/store'
  import { post } from '$lib/helper/api'
  import Status from "$lib/components/atom/Status.svelte";
  import FileCard from "$lib/components/molecule/FileCard.svelte";
	import { onMount } from "svelte";
  export let data
  let fileInput

  // onMount(() => console.log(data))

  function editHeader(){
    if (data.canceled) toastAlert.error('Purchase already canceled, can not be edit/update anymore')
    else globalModal.editPurchase(data)
  }

  async function uploadFile(e){
    if (data.canceled) toastAlert.error('Purchase already canceled, can not be edit/update anymore')
    else {
      let formData = new FormData()
      const fileData = e.target.files[0]
      formData.append("payload", fileData)
      await post(`/file/upload?header_purchase=${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }}
      )
    }
    refreshPage.set(true)
  }
</script>

<div class="flex flex-row justify-between">
  <div class="text-xl font-bold">Create by {`${data.creator && data.creator.first_name} ${data.creator && data.creator.last_name}`}</div>
  <div class="text-xl font-bold mr-4 text-right">Date: {data.header_date && dateFormater(data.header_date)}</div>
</div>
<div class="flex flex-row my-4 justify-between content-center gap-4">
  <SupplierCard data={data.supplier}/>
  <div class="w-1/3 bg-base-300 text-base-content p-4 rounded-2xl shadow-xl">
    <h1 class="font-bold text-3xl ml-6">{data.forex_symbol}</h1>
    <h1><span class="font-bold ml-6">Buy Rate: </span>{priceFormater(data.idr_buy_rate)}</h1>
    <h1><span class="font-bold ml-6">Sell Rate: </span>{priceFormater(data.idr_sell_rate)}</h1>
    <Status 
      title="Purchase Status" 
      value={data.canceled ? 'Cancel' : data.finish_at ? 'Finish' : 'Progress'}
      valueColor={data.canceled ? 'error' : data.finish_at ? 'success' : 'info'} 
      detail={data.canceled ? `${dateFormater(data.canceled_at)} - ${data.canceled_user.first_name} ${data.canceled_user.last_name}` : data.finish_at ? `${dateFormater(data.finish_at)}` : false} />
  </div>
</div>

<h1 class="text-2xl font-bold text-secondary">Purchase Notes</h1>
<div class="flex flex-row gap-4">
  {#if data.purchase_notes != undefined}
    <div class="text-xl">
      {data.purchase_notes}
    </div>
  {:else}
    <h1 class="text-xl">None</h1>
  {/if}
</div>

<h1 class="text-2xl font-bold mt-4 text-secondary">Approval Status</h1>
<div class="flex flex-row gap-4">
  {#if data.approval_purchase && data.approval_purchase.length > 0}
    {#each data.approval_purchase as approval}
      <Status
        title={approval.approval_type == 1 ? 'Invoice' : approval.approval_type == 2 ? 'Pricing' : approval.approval_type == 3 ? 'Inventory' : approval.approval_type == 4 && 'Finance'}
        value="David"
        valueColor="success"
        detail={dateFormater(approval.created_at)}
      />
    {/each}
  {:else}
    <h1 class="text-xl">Purchase Not having approval at all.</h1>
  {/if}
</div>

<h1 class="text-2xl font-bold mt-4 text-secondary">Purchase Document</h1>
{#if data.list_doc != undefined && data.list_doc.length > 0}
  <div class="flex flex-row gap-4">
    {#each data.list_doc as fileData}
      <FileCard data={fileData} />
    {/each}
  </div>
{:else}
  <h1 class="text-xl">Purchase Not having any file uploaded.</h1>
{/if}

<div class="flex flex-row my-4 justify-end gap-4">
  <BtnSuper color="warning" icon="uil:file-edit-alt" text="Edit Purchase" on:click={() => editHeader()} />
  <input type="file" id="fileUpload" name="fileUpload" class="hidden"
    on:change={(e)=>uploadFile(e)} 
    bind:this={fileInput}  />
  <BtnSuper color="info" icon="uil:file-upload-alt" text="Upload Document" on:click={() => fileInput.click()}/>
  {#if data.canceled}
    <BtnSuper icon="uil:file-exclamation-alt" text="Re-Enabled Purchase" on:click={() => globalModal.cancelConfirmation(data.id)}/>
  {:else}
    <BtnSuper color="error" icon="uil:file-block-alt" text="Cancel Purchase" on:click={() => globalModal.cancelConfirmation(data.id)}/>
  {/if}
</div>